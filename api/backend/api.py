from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime, timedelta
import requests
import os
from dotenv import load_dotenv
import jwt
import traceback
from functools import wraps
from flask import send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename


# Load env variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"], supports_credentials=True)



DATABASE = "midocean_crm.db"
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
API_KEY = os.getenv("API_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
app.config['SECRET_KEY'] = JWT_SECRET
products_bp = Blueprint('products', __name__)

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

API_ENDPOINTS = {
    "products": {
        "url": "https://api.midocean.com/gateway/products/2.0?language=fr",
        "headers": {
            "Accept": "application/json",
            "x-Gateway-APIKey": API_KEY
        }
    },
    "stock": {
        "url": "https://api.midocean.com/gateway/stock/2.0",
        "headers": {
            "Accept": "application/json",
            "x-Gateway-APIKey": API_KEY
        }
    },
    "pricelist": {
        "url": "https://api.midocean.com/gateway/pricelist/2.0",
        "headers": {
            "Accept": "application/json",
            "x-Gateway-APIKey": API_KEY
        }
    },
    "printpricelist": {
        "url": "https://api.midocean.com/gateway/printpricelist/2.0",
        "headers": {
            "Accept": "application/json",
            "x-Gateway-APIKey": API_KEY
        }
    },
    "printdata": {
        "url": "https://api.midocean.com/gateway/printdata/1.0",
        "headers": {
            "Accept": "application/json",
            "x-Gateway-APIKey": API_KEY
        }
    }
}

# --- DB init & connection helpers ---

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT,
            category_level1 TEXT,
            category_level2 TEXT,
            category_level3 TEXT,
            description TEXT,
            stock INTEGER DEFAULT 0,
            rating REAL DEFAULT 0
        )
    ''')

    # Table for storing API data cache
    c.execute("""
        CREATE TABLE IF NOT EXISTS api_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            endpoint TEXT NOT NULL,
            fetched_at TEXT NOT NULL,
            data TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

    # Users table (clients, commerciaux, admins)
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin','commercial','client')),
            password_hash TEXT NOT NULL
        )
    """)

    # Clients (B2B)
    c.execute("""
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT NOT NULL,
            siret TEXT UNIQUE,
            main_contact TEXT,
            email TEXT,
            phone TEXT
        )
    """)

    # Favorites (produits préférés par client)
    c.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id TEXT NOT NULL,
            product_name TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    # Quotes / simulations
    c.execute("""
        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            products TEXT NOT NULL, -- JSON string [{"product_id": "...", "qty": 1, "price_estimate": 123}, ...]
            created_at TEXT NOT NULL,
            FOREIGN KEY(client_id) REFERENCES clients(id)
        )
    """)

    conn.commit()


    # Insert default admin if not exists
    c.execute("SELECT id FROM users WHERE role='admin' LIMIT 1")
    if c.fetchone() is None:
        password_hash = password_hash = generate_password_hash(ADMIN_PASSWORD, method='pbkdf2:sha256')
        c.execute("INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)",
                  ('Administrator', 'admin@midocean.local', 'admin', password_hash))

    conn.commit()
    conn.close()

# --- JWT token utils ---

def generate_token(user_id):
    return jwt.encode(
        {"user_id": user_id, "exp": datetime.utcnow() + timedelta(hours=6)},
        app.config['SECRET_KEY'],
        algorithm="HS256"
    )

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        if not token:
            return jsonify({"message": "Token requis"}), 401
        try:
            decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            request.user_id = decoded['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expiré"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token invalide"}), 401
        return f(*args, **kwargs)
    return decorated


# --- Routes ---



@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, password_hash FROM users WHERE email = ?", (username,))
    user = c.fetchone()
    conn.close()

    # Support admin username/password from env (simple fallback)
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        token = generate_token(0)
        return jsonify({"token": token})

    if user and check_password_hash(user['password_hash'], password):
        token = generate_token(user['id'])
        return jsonify({"token": token})
    return jsonify({"message": "Nom ou mot de passe invalide"}), 401

# --- Fetch external APIs and save results ---
@app.route('/midocean/fetch', methods=['GET'])
@auth_required
def fetch_data():
    conn = get_db()
    c = conn.cursor()
    results = {}

    for endpoint, config in API_ENDPOINTS.items():
        try:
            response = requests.get(config["url"], headers=config["headers"], timeout=15)
            response.raise_for_status()
            json_data = response.json()

            c.execute(
                "INSERT INTO api_data (endpoint, fetched_at, data, status) VALUES (?, ?, ?, ?)",
                (endpoint, datetime.now().isoformat(), json.dumps(json_data), "success")
            )
            results[endpoint] = {"status": "success", "size": len(response.text)}
        except Exception as e:
            error_msg = str(e)
            c.execute(
                "INSERT INTO api_data (endpoint, fetched_at, data, status) VALUES (?, ?, ?, ?)",
                (endpoint, datetime.now().isoformat(), json.dumps({"error": error_msg}), "error")
            )
            results[endpoint] = {"status": "error", "error": error_msg}

    conn.commit()
    conn.close()
    return jsonify({"results": results, "timestamp": datetime.now().isoformat()})

@app.route('/midocean/data', methods=['GET'])
@auth_required
def get_data():
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT endpoint, data, fetched_at, status 
        FROM api_data 
        WHERE id IN (SELECT MAX(id) FROM api_data GROUP BY endpoint)
        ORDER BY endpoint
    """)
    data = []
    for endpoint, data_str, fetched_at, status in c.fetchall():
        try:
            content = json.loads(data_str)
        except json.JSONDecodeError:
            content = {"error": "Format invalide"}

        data.append({
            "api": endpoint,
            "data": content,
            "last_updated": fetched_at,
            "status": status
        })
    conn.close()
    return jsonify(data)

# --- CRUD Users ---

@app.route('/users', methods=['GET'])
@auth_required
def get_users():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, name, email, role FROM users")
    users = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(users)

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    role = data.get('role')
    password = data.get('password')
    if not all([name, email, role, password]):
        return jsonify({"message": "Tous les champs sont obligatoires"}), 400

    password_hash = generate_password_hash(password)
    conn = get_db()
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)",
                  (name, email, role, password_hash))
        conn.commit()
        user_id = c.lastrowid
    except Exception as e:
        conn.close()
        return jsonify({"message": "Erreur lors de la création", "error": str(e)}), 400
    conn.close()
    return jsonify({"id": user_id, "name": name, "email": email, "role": role}), 201

VALID_ROLES = ['admin', 'commercial', 'client']

@app.route('/users/<int:user_id>', methods=['PUT'])
@auth_required
def update_user(user_id):
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    role = data.get('role')
    password = data.get('password')

    # Vérification du rôle
    if role and role not in VALID_ROLES:
        return jsonify({"error": f"Le rôle doit être dans {VALID_ROLES}"}), 400

    # Hash du mot de passe si fourni
    password_hash = None
    if password:
        password_hash = generate_password_hash(password)

    conn = get_db()
    c = conn.cursor()

    # Préparation de la requête UPDATE selon les champs fournis
    fields = []
    values = []

    if name:
        fields.append("name = ?")
        values.append(name)
    if email:
        fields.append("email = ?")
        values.append(email)
    if role:
        fields.append("role = ?")
        values.append(role)
    if password_hash:
        fields.append("password_hash = ?")
        values.append(password_hash)

    if not fields:
        return jsonify({"message": "Aucun champ à mettre à jour"}), 400

    values.append(user_id)
    query = f"UPDATE users SET {', '.join(fields)} WHERE id = ?"

    try:
        c.execute(query, values)
        conn.commit()
    except sqlite3.IntegrityError as e:
        conn.close()
        return jsonify({"error": "Erreur lors de la mise à jour", "message": str(e)}), 400

    conn.close()
    return jsonify({"message": "Utilisateur mis à jour avec succès"})

@app.route('/users/<int:user_id>', methods=['DELETE'])
@auth_required
def delete_user(user_id):
    conn = get_db()
    c = conn.cursor()
    try:
        c.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({"error": "Erreur lors de la suppression", "message": str(e)}), 400
    conn.close()
    return jsonify({"message": "Utilisateur supprimé"})

# --- Gestion des favoris ---

@app.route('/favorites', methods=['GET'])
@auth_required
def get_favorites():
    user_id = request.user_id
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, product_id, product_name FROM favorites WHERE user_id = ?", (user_id,))
    favorites = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(favorites)

@app.route('/favorites', methods=['POST'])
@auth_required
def add_favorite():
    user_id = request.user_id
    data = request.get_json()
    product_id = data.get('product_id')
    product_name = data.get('product_name')

    if not product_id:
        return jsonify({"message": "product_id est obligatoire"}), 400

    conn = get_db()
    c = conn.cursor()
    # Vérifier si déjà favori
    c.execute("SELECT id FROM favorites WHERE user_id = ? AND product_id = ?", (user_id, product_id))
    if c.fetchone():
        conn.close()
        return jsonify({"message": "Produit déjà dans les favoris"}), 400

    c.execute("INSERT INTO favorites (user_id, product_id, product_name) VALUES (?, ?, ?)",
              (user_id, product_id, product_name))
    conn.commit()
    fav_id = c.lastrowid
    conn.close()
    return jsonify({"id": fav_id, "product_id": product_id, "product_name": product_name}), 201

@app.route('/favorites/<int:fav_id>', methods=['DELETE'])
@auth_required
def remove_favorite(fav_id):
    user_id = request.user_id
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM favorites WHERE id = ? AND user_id = ?", (fav_id, user_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Favori supprimé"})

# --- Gestion des clients ---

@app.route('/clients', methods=['GET'])
@auth_required
def get_clients():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM clients")
    clients = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(clients)

@app.route('/clients', methods=['POST'])
@auth_required
def create_client():
    data = request.get_json()
    company_name = data.get('company_name')
    siret = data.get('siret')
    main_contact = data.get('main_contact')
    email = data.get('email')
    phone = data.get('phone')

    if not company_name:
        return jsonify({"message": "company_name est obligatoire"}), 400

    conn = get_db()
    c = conn.cursor()
    try:
        c.execute("INSERT INTO clients (company_name, siret, main_contact, email, phone) VALUES (?, ?, ?, ?, ?)",
                  (company_name, siret, main_contact, email, phone))
        conn.commit()
        client_id = c.lastrowid
    except Exception as e:
        conn.close()
        return jsonify({"message": "Erreur lors de la création du client", "error": str(e)}), 400
    conn.close()
    return jsonify({"id": client_id, "company_name": company_name}), 201

@app.route('/clients/<int:client_id>', methods=['PUT'])
@auth_required
def update_client(client_id):
    data = request.get_json()
    company_name = data.get('company_name')
    siret = data.get('siret')
    main_contact = data.get('main_contact')
    email = data.get('email')
    phone = data.get('phone')

    conn = get_db()
    c = conn.cursor()

    fields = []
    values = []

    if company_name:
        fields.append("company_name = ?")
        values.append(company_name)
    if siret:
        fields.append("siret = ?")
        values.append(siret)
    if main_contact:
        fields.append("main_contact = ?")
        values.append(main_contact)
    if email:
        fields.append("email = ?")
        values.append(email)
    if phone:
        fields.append("phone = ?")
        values.append(phone)

    if not fields:
        return jsonify({"message": "Aucun champ à mettre à jour"}), 400

    values.append(client_id)
    query = f"UPDATE clients SET {', '.join(fields)} WHERE id = ?"

    try:
        c.execute(query, values)
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({"message": "Erreur lors de la mise à jour", "error": str(e)}), 400
    conn.close()
    return jsonify({"message": "Client mis à jour"})

@app.route('/clients/<int:client_id>', methods=['DELETE'])
@auth_required
def delete_client(client_id):
    conn = get_db()
    c = conn.cursor()
    try:
        c.execute("DELETE FROM clients WHERE id = ?", (client_id,))
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({"message": "Erreur lors de la suppression", "error": str(e)}), 400
    conn.close()
    return jsonify({"message": "Client supprimé"})

# --- Gestion des devis / simulations ---

@app.route('/quotes', methods=['GET'])
@auth_required
def get_quotes():
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT quotes.id, clients.company_name, quotes.products, quotes.created_at 
        FROM quotes JOIN clients ON quotes.client_id = clients.id
        ORDER BY quotes.created_at DESC
    """)
    quotes = []
    for row in c.fetchall():
        quotes.append({
            "id": row["id"],
            "client": row["company_name"],
            "products": json.loads(row["products"]),
            "created_at": row["created_at"]
        })
    conn.close()
    return jsonify(quotes)

@app.route('/quotes', methods=['POST'])
@auth_required
def create_quote():
    data = request.get_json()
    client_id = data.get("client_id")
    products = data.get("products")  # liste d’objets

    if not client_id or not products:
        return jsonify({"message": "client_id et products sont requis"}), 400

    try:
        products_json = json.dumps(products)
    except Exception:
        return jsonify({"message": "Format products invalide"}), 400

    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO quotes (client_id, products, created_at) VALUES (?, ?, ?)",
              (client_id, products_json, datetime.now().isoformat()))
    conn.commit()
    quote_id = c.lastrowid
    conn.close()

    return jsonify({"id": quote_id, "client_id": client_id, "products": products}), 201

# --- Nouvelle route pour renvoyer toutes les images des produits en JSON ---

@app.route('/products/images/full', methods=['GET'])
@auth_required
def products_images_full():
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        SELECT data FROM api_data 
        WHERE endpoint = 'products' 
        ORDER BY fetched_at DESC 
        LIMIT 1
    """)
    products_row = c.fetchone()

    c.execute("""
        SELECT data FROM api_data 
        WHERE endpoint = 'pricelist' 
        ORDER BY fetched_at DESC 
        LIMIT 1
    """)
    pricelist_row = c.fetchone()

    c.execute("""
        SELECT data FROM api_data 
        WHERE endpoint = 'stock' 
        ORDER BY fetched_at DESC 
        LIMIT 1
    """)
    stock_row = c.fetchone()

    conn.close()

    if not products_row:
        return jsonify({"message": "Aucune donnée produit trouvée"}), 404

    try:
        products_data = json.loads(products_row['data'])
        pricelist_data = json.loads(pricelist_row['data']) if pricelist_row else {}
    except Exception:
        return jsonify({"message": "Erreur de format JSON"}), 500

    products = products_data.get("products", []) if isinstance(products_data, dict) else products_data
    prices = pricelist_data.get("price", []) if isinstance(pricelist_data, dict) else []

    stock_data = json.loads(stock_row['data']) if stock_row else {}
    stock_items = stock_data.get("stock", []) if isinstance(stock_data, dict) else []

    stock_by_ref = {}
    for item in stock_items:
        sku = item.get("sku", "")
        qty = item.get("qty", 0)
        ref = sku.split("-")[0]
        stock_by_ref[ref] = stock_by_ref.get(ref, 0) + qty

    price_by_variant_id = {
        item["variant_id"]: item for item in prices if "variant_id" in item
    }

    results = []

    for product in products:
        variants = product.get("variants", [])
        product_prices = []

        variant_output = []
        for variant in variants:
            variant_id = variant.get("variant_id")
            sku = variant.get("sku")
            color = variant.get("color_description")
            gtin = variant.get("gtin")
            color_code = variant.get("color_code")

            variant_images = []
            for asset in variant.get("digital_assets", []):
                if asset.get("type") == "image":
                    variant_images.append({
                        "subtype": asset.get("subtype"),
                        "url": asset.get("url_highress") or asset.get("url")
                    })

            if variant_id and variant_id in price_by_variant_id:
                try:
                    price_str = price_by_variant_id[variant_id]["price"]
                    price_float = float(price_str.replace(",", "."))
                    product_prices.append(price_float)
                except Exception:
                    pass

            variant_output.append({
                "variant_id": variant_id,
                "sku": sku,
                "color": color,
                "color_code": color_code,
                "gtin": gtin,
                "images": variant_images
            })

        final_price = min(product_prices) if product_prices else None

        base_info = {
            "product_name": product.get("product_name"),
            "master_code": product.get("master_code"),
            "short_description": product.get("short_description"),
            "long_description": product.get("long_description"),
            "brand": product.get("brand"),
            "material": product.get("material"),
            "price": final_price,
            "stock": stock_by_ref.get(product.get("master_code"), 0),
            "category_level1": variants[0].get("category_level1") if variants else None,
            "category_level2": variants[0].get("category_level2") if variants else None,
            "category_level3": variants[0].get("category_level3") if variants else None,
        }

        # Images depuis printing_positions (génériques au produit, pas aux variants)
        product_images = []
        for position in product.get("printing_positions", []):
            for img in position.get("images", []):
                if "print_position_image_blank" in img:
                    product_images.append({
                        "source": "printing_positions",
                        "type": "blank",
                        "url": img.get("print_position_image_blank")
                    })
                if "print_position_image_with_area" in img:
                    product_images.append({
                        "source": "printing_positions",
                        "type": "with_area",
                        "url": img.get("print_position_image_with_area")
                    })

        # Tri des images générales
        product_images.sort(key=lambda img: (
            0 if img.get("subtype") == "item_picture_front" else 1
        ))

        results.append({
            **base_info,
            "images": product_images,
            "variants": variant_output
        })

    return jsonify({"products_with_images": results})





@app.route('/users/me', methods=['GET'])
@auth_required
def get_current_user():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, name, email, role FROM users WHERE id = ?", (request.user_id,))
    user = c.fetchone()
    conn.close()
    
    if user:
        return jsonify(dict(user))
    return jsonify({"message": "Utilisateur non trouvé"}), 404

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not all([name, email, password]):
        return jsonify({"message": "Tous les champs sont obligatoires"}), 400
    
    # Validation supplémentaire de l'email
    if '@' not in email or '.' not in email.split('@')[-1]:
        return jsonify({"message": "Email invalide"}), 400
    
    conn = get_db()
    c = conn.cursor()
    
    # Vérification email existant
    c.execute("SELECT id FROM users WHERE email = ?", (email,))
    if c.fetchone():
        conn.close()
        return jsonify({"message": "Cet email est déjà utilisé"}), 400
    # Avant le hash du mot de passe
    if len(password) < 8:
        return jsonify({"message": "Le mot de passe doit faire au moins 8 caractères"}), 400
    
    # Hachage mot de passe
    password_hash = generate_password_hash(password)
    
    try:
        # FORCER le rôle client pour les inscriptions publiques
        c.execute("""
            INSERT INTO users (name, email, role, password_hash) 
            VALUES (?, ?, 'client', ?)
        """, (name, email, password_hash))
        conn.commit()
        user_id = c.lastrowid
        
        # Génération du token JWT
        token = generate_token(user_id)
        
        return jsonify({
            "message": "Compte créé avec succès",
            "token": token,
            "user": {
                "id": user_id,
                "name": name,
                "email": email,
                "role": "client"
            }
        }), 201
        
        
    except Exception as e:
        conn.rollback()
        return jsonify({
            "message": "Erreur technique",
            "error": str(e)
        }), 500
    finally:
        conn.close()

# Route pour servir les images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/products', methods=['GET'])
def get_products():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM products')
    rows = c.fetchall()
    conn.close()

    products = []
    for row in rows:
        product = dict(row)
        
        # Assurer que les champs JSON sont valides
        for json_field in ['colors_json', 'images_json', 'images_by_color_json']:
            try:
                if product.get(json_field):
                    json.loads(product[json_field])
            except json.JSONDecodeError:
                product[json_field] = '[]'
        
        # Corriger les URLs d'images
        if product.get("image") and not product["image"].startswith(("http", "/")):
            product["image"] = f"/uploads/{product['image']}"
        
        products.append(product)

    return jsonify(products)
@products_bp.route('/products', methods=['POST'])
def create_product():
    try:
        name = request.form.get('name')
        price = float(request.form.get('price', 0))
        description = request.form.get('description')
        category_level1 = request.form.get('category_level1')
        category_level2 = request.form.get('category_level2')
        category_level3 = request.form.get('category_level3')
        stock = int(request.form.get('stock', 0))
        colors_json = request.form.get('colors_json')
        images_json = request.form.get('images_json')
        images_by_color_json = request.form.get('images_by_color_json')
        image_path = None

        if 'image' in request.files:
            image = request.files['image']
            if image.filename != '':
                filename = secure_filename(f"{uuid4().hex}_{image.filename}")
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                image.save(os.path.join(UPLOAD_FOLDER, filename))
                image_path = f"/uploads/{filename}"
        elif request.form.get('image_url'):
            image_path = request.form.get('image_url')

        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute('''
            INSERT INTO products (
                name,
                price,
                image,
                category_level1,
                category_level2,
                category_level3,
                description,
                stock,
                colors_json,
                images_json,
                images_by_color_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            name,
            price,
            image_path,
            category_level1,
            category_level2,
            category_level3,
            description,
            stock,
            colors_json,
            images_json,
            images_by_color_json
        ))

        conn.commit()
        conn.close()

        return jsonify({'message': 'Produit ajouté avec succès'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

app.register_blueprint(products_bp)


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5001, debug=True)