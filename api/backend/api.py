from flask import Blueprint, Flask, request, jsonify, current_app
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime, timedelta
import requests
import os
from dotenv import load_dotenv
from uuid import uuid4
import jwt
import traceback
from functools import wraps
from flask import send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_mail import Mail, Message
import pdfkit
import uuid


# Load env variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"], supports_credentials=True)



DATABASE = "midocean_crm.db"
UPLOAD_FOLDER = 'static/uploads'
app.config['DATABASE'] = DATABASE
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
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
    # Remplace current_app par app si tu es hors contexte requête
    conn = sqlite3.connect(app.config['DATABASE'])
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
    
def parse_json_safe(json_str, default=None):
    if json_str is None:
        return default
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return default



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

import json

@products_bp.route('/products/<int:product_id>/similar', methods=['GET'])
def get_similar_products(product_id):
    try:
        # D'abord, récupérer le produit pour connaître sa catégorie
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        c.execute('SELECT category_level1 FROM products WHERE id = ?', (product_id,))
        product = c.fetchone()
        
        if product is None:
            conn.close()
            return jsonify({'error': 'Produit non trouvé'}), 404
        
        category = product['category_level1']
        
        # Récupérer 4 produits aléatoires de la même catégorie (en excluant le produit actuel)
        c.execute('''
            SELECT * FROM products 
            WHERE category_level1 = ? AND id != ?
            ORDER BY RANDOM()
            LIMIT 4
        ''', (category, product_id))
        
        similar_products = []
        for row in c.fetchall():
            product = dict(row)
            
            # Corriger l'URL de l'image
            if product.get("image") and not product["image"].startswith(("http", "/")):
                product["image"] = f"/uploads/{product['image']}"
                
            similar_products.append(product)
        
        conn.close()
        return jsonify(similar_products)
        
    except Exception as e:
        if 'conn' in locals():
            conn.close()
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/printdata/by-master-code/<string:master_code>', methods=['GET'])
def get_print_data_by_master_code(master_code):
    try:
        conn = get_db()
        c = conn.cursor()
        
        # Get latest print data
        c.execute("""
            SELECT data FROM api_data 
            WHERE endpoint = 'printdata'
            ORDER BY fetched_at DESC 
            LIMIT 1
        """)
        row = c.fetchone()
        
        if not row:
            return jsonify({"error": "No print data found"}), 404

        print_data = json.loads(row['data'])
        result = None

        if 'products' in print_data:
            for product in print_data['products']:
                if product.get('master_code') == master_code:
                    result = {
                        'master_data': {
                            'master_code': product.get('master_code'),
                            'master_id': product.get('master_id'),
                            'print_manipulation': product.get('print_manipulation'),
                            'print_template': product.get('print_template'),
                            'item_color_numbers': product.get('item_color_numbers', [])
                        },
                        'printing_positions': []
                    }

                    for position in product.get('printing_positions', []):
                        position_data = {
                            'position_id': position.get('position_id'),
                            'print_position_type': position.get('print_position_type'),
                            'max_print_size_width': position.get('max_print_size_width'),
                            'max_print_size_height': position.get('max_print_size_height'),
                            'print_size_unit': position.get('print_size_unit'),
                            'rotation': position.get('rotation'),
                            'images': position.get('images', []),
                            'points': position.get('points', []),
                            'printing_techniques': []
                        }

                        for tech_id in position.get('printing_techniques', []):
                            for global_tech in print_data.get('printing_techniques', []):
                                if global_tech.get('id') == tech_id:
                                    position_data['printing_techniques'].append({
                                        'id': tech_id,
                                        'name': global_tech.get('name', []),
                                        'default': global_tech.get('default', False),
                                        'max_colours': global_tech.get('max_colours')
                                    })
                                    break

                        result['printing_positions'].append(position_data)
                    break

        if not result:
            return jsonify({"error": f"Product with master_code {master_code} not found"}), 404

        return jsonify({
            'status': 'success',
            'data': result
        })

    except Exception as e:
        app.logger.error(f"Error in get_print_data_by_master_code: {str(e)}\n{traceback.format_exc()}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500
    finally:
        conn.close()



@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM products WHERE id = ?', (product_id,))
    row = c.fetchone()
    conn.close()

    if not row:
        return jsonify({'error': 'Produit non trouvé'}), 404

    product = dict(row)
    for field in ['colors_json', 'images_json', 'images_by_color_json', 'print_data_json']:
        product[field] = parse_json_safe(product.get(field), [] if 'by_color' not in field else {})

    if product.get("image") and not product["image"].startswith(("http", "/")):
        product["image"] = f"/uploads/{product['image']}"

    return jsonify(product)


@products_bp.route('/products', methods=['GET'])
def get_products():
    try:
        conn = sqlite3.connect(app.config['DATABASE'])
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute('SELECT * FROM products')
        rows = c.fetchall()
        conn.close()

        products = []
        for row in rows:
            product = dict(row)
            for field in ['colors_json', 'images_json', 'images_by_color_json', 'print_data_json']:
                default = [] if 'by_color' not in field and 'print_data' not in field else {}
                product[field] = parse_json_safe(product.get(field), default)

            if product.get("image") and not product["image"].startswith(("http", "/")):
                product["image"] = f"/uploads/{product['image']}"

            products.append(product)

        return jsonify(products)

    except Exception as e:
        print("❌ Erreur /products :", str(e))
        traceback.print_exc()
        return jsonify({"error": "Erreur serveur"}), 500



@products_bp.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT * FROM products WHERE id = ?', (id,))
        row = c.fetchone()
        conn.close()

        if row is None:
            return jsonify({'error': 'Produit non trouvé'}), 404

        product = dict(row)
        product['colors_json'] = parse_json_safe(product.get('colors_json'), [])
        product['images_json'] = parse_json_safe(product.get('images_json'), [])
        product['images_by_color_json'] = parse_json_safe(product.get('images_by_color_json'), {})
        product['print_data_json'] = parse_json_safe(product.get('print_data_json'), {})

        if product.get("image") and not product["image"].startswith(("http", "/")):
            product["image"] = f"/uploads/{product['image']}"

        return jsonify(product)

    except Exception as e:
        print("❌ Erreur /products/<id> :", str(e))
        traceback.print_exc()
        return jsonify({"error": "Erreur serveur"}), 500


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@products_bp.route('/products', methods=['POST'])
def create_product():
    try:
        # Champs obligatoires
        name = request.form.get('name')
        price = request.form.get('price')
        if not name or not price:
            return jsonify({'error': 'Le nom et le prix sont obligatoires'}), 400

        product_data = {
            'name': name,
            'price': float(price),
            'description': request.form.get('description', ''),
            'category_level1': request.form.get('category_level1', ''),
            'category_level2': request.form.get('category_level2', ''),
            'category_level3': request.form.get('category_level3', ''),
            'stock': int(request.form.get('stock', 0)),
            'image': None
        }

        # Image uploadée
        if 'image' in request.files and request.files['image'].filename:
            image_file = request.files['image']
            filename = secure_filename(f"{uuid4().hex}_{image_file.filename}")
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(image_path)
            product_data['image'] = filename

        # Image depuis URL
        elif request.form.get('image_url'):
            try:
                image_url = request.form['image_url']
                response = requests.get(image_url, timeout=10)
                response.raise_for_status()
                ext = os.path.splitext(image_url)[1] or '.jpg'
                filename = secure_filename(f"{uuid4().hex}{ext}")
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                with open(image_path, 'wb') as f:
                    f.write(response.content)
                product_data['image'] = filename
            except Exception as e:
                app.logger.error(f"[Image] Erreur téléchargement image depuis URL: {e}")

        # Champs JSON
        json_fields = ['colors_json', 'images_json', 'images_by_color_json', 'print_data_json']
        for field in json_fields:
            raw = request.form.get(field)
            if raw:
                try:
                    product_data[field] = json.loads(raw)
                except json.JSONDecodeError:
                    app.logger.warning(f"[JSON] Erreur décodage {field}")
                    product_data[field] = [] if 'json' in field else {}
            else:
                product_data[field] = [] if 'json' in field else {}

        # Normalisation des positions d'impression
        print_data = product_data['print_data_json']
        if isinstance(print_data, dict) and 'printing_positions' in print_data:
            for pos in print_data['printing_positions']:
                if isinstance(pos, dict):
                    pos['position_id'] = pos.get('position_id', str(uuid4()))
                    pos['position_name'] = pos.get('position_name', 'Position inconnue')
                    pos['points'] = pos.get('points', [])
                    pos['images'] = pos.get('images', [])

        # Insertion en base
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO products (
                name, price, image, description,
                category_level1, category_level2, category_level3,
                stock, colors_json, images_json,
                images_by_color_json, print_data_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            product_data['name'],
            product_data['price'],
            product_data['image'],
            product_data['description'],
            product_data['category_level1'],
            product_data['category_level2'],
            product_data['category_level3'],
            product_data['stock'],
            json.dumps(product_data['colors_json']),
            json.dumps(product_data['images_json']),
            json.dumps(product_data['images_by_color_json']),
            json.dumps(product_data['print_data_json']),
        ))
        conn.commit()
        product_id = cursor.lastrowid
        conn.close()

        return jsonify({
            'message': 'Produit créé avec succès',
            'product_id': product_id,
            'print_data': product_data['print_data_json']
        }), 201

    except ValueError as e:
        return jsonify({'error': f'Donnée invalide: {str(e)}'}), 400
    except Exception as e:
        app.logger.error(f"[SERVER ERROR] {str(e)}")
        traceback.print_exc()
        return jsonify({'error': 'Erreur interne du serveur', 'details': str(e)}), 500
    
app.register_blueprint(products_bp)

# --- Routes pour les devis ---

# Configuration SMTP
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'no-reply@midocean.com')
app.config['PDF_FOLDER'] = 'static/pdfs'
app.config['BASE_URL'] = 'http://localhost:5001'  # À adapter en production

mail = Mail(app)

def generate_pdf(devis_data):
    """Génère un PDF professionnel pour le devis"""
    if not os.path.exists(app.config['PDF_FOLDER']):
        os.makedirs(app.config['PDF_FOLDER'])
    
    pdf_filename = f"devis-{datetime.now().strftime('%Y%m%d-%H%M%S')}-{uuid.uuid4().hex[:6]}.pdf"
    pdf_path = os.path.join(app.config['PDF_FOLDER'], pdf_filename)
    
    # HTML template pour le PDF
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Devis {devis_data['devis_id']}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }}
            .header {{ border-bottom: 2px solid #0066cc; padding-bottom: 10px; margin-bottom: 20px; }}
            .info-section {{ margin-bottom: 30px; }}
            .product-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            .product-table th, .product-table td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            .product-table th {{ background-color: #f2f2f2; }}
            .total-section {{ margin-top: 30px; text-align: right; }}
            .signature {{ margin-top: 50px; border-top: 1px dashed #999; padding-top: 20px; }}
            .product-image {{ max-width: 200px; max-height: 200px; margin: 10px 0; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>{devis_data['companyInfo']['companyName']} - Devis personnalisé</h1>
            <p>Offre n°{devis_data['devis_id']} réalisée à Paris le {datetime.now().strftime('%d/%m/%Y')}</p>
            <p>Date de fin de validité : {(datetime.now() + timedelta(days=60)).strftime('%d/%m/%Y')}</p>
            <p>Votre référence client : {devis_data.get('client_reference', 'N/A')}</p>
        </div>

        <div class="info-section">
            <h2>{devis_data['companyInfo']['companyName']}</h2>
            <p>{devis_data['companyInfo']['billingAddress']}</p>
        </div>

        <div class="info-section">
            <h3>{devis_data['companyInfo']['firstName']} {devis_data['companyInfo']['lastName']}</h3>
            <p>{devis_data['companyInfo']['email']}</p>
            <p>{devis_data['companyInfo']['phone']}</p>
        </div>

        <h2>{devis_data['product']['quantity']} | {devis_data['product']['name'].upper()}</h2>

        <table class="product-table">
            <tr>
                <th>Description</th>
                <th>Quantité (Prix Unitaire HT)</th>
                <th>Total HT</th>
            </tr>
            <tr>
                <td>
                    {devis_data['product']['name']}<br>
                    {devis_data['product']['description']}
                </td>
                <td>{devis_data['product']['quantity']} pièces ({devis_data['product']['price']} € P.U.)</td>
                <td>{devis_data['total']} €</td>
            </tr>
        </table>

        {f'<img src="{devis_data["product"]["image"]}" class="product-image" alt="Image produit">' if devis_data['product'].get('image') else ''}

        <div class="info-section">
            <h3>CARACTÉRISTIQUES PRODUIT</h3>
            <p>Couleur : {devis_data['product'].get('color', 'Non spécifié')}</p>
            <p><strong>PERSONNALISATION</strong></p>
            <p>Marquage sérigraphie 1 couleur</p>
            <p>Position de marquage : centré</p>
            <p>Frais techniques inclus</p>
        </div>

        <div class="total-section">
            <h3>Sous-total hors taxe</h3>
            <p>TVA 20.0% : {float(devis_data['total']) * 0.2} €</p>
            <h2>Total TTC : {float(devis_data['total']) * 1.2} €</h2>
        </div>

        <div class="signature">
            <p>Avant de signer ce devis, vous devez recevoir un e-mail pour confirmer votre identité.</p>
            <p>{devis_data['companyInfo']['firstName']} {devis_data['companyInfo']['lastName']} ({devis_data['companyInfo']['email']})</p>
            <p>Vérifier pour signer</p>
        </div>

        <div class="info-section">
            <h3>Conditions d'achat</h3>
            <p>Règlement : 100% à la commande (Paiement comptant)</p>
            <p>Paiement par chèque ou virement</p>
        </div>

        <div class="info-section">
            <h3>Besoin d'informations complémentaires ?</h3>
            <p>Notre équipe vous répond directement :</p>
            <p>+33 2 40 48 83 22</p>
            <p>contact@midocean.com</p>
        </div>
    </body>
    </html>
    """
    
    # Génération du PDF
    pdfkit.from_string(html_content, pdf_path)
    
    return f"{app.config['BASE_URL']}/{app.config['PDF_FOLDER']}/{pdf_filename}"

@app.route('/api/devis', methods=['POST'])
def create_devis():
    try:
        data = request.get_json()
        print("Données reçues:", data)

        # Validation des données
        required_fields = ['product', 'companyInfo']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Champ manquant: {field}"}), 400

        # Calcul du total si non fourni
        if 'total' not in data:
            data['total'] = float(data['product']['price']) * int(data['product']['quantity'])

        # Génération du PDF
        data['devis_id'] = f"DEV-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        pdf_url = generate_pdf(data)

        # Envoi de l'email
        msg = Message(
            subject=f"Devis {data['devis_id']} - {data['product']['name']}",
            recipients=[data['companyInfo']['email']],
            html=f"""
            <h2>Votre devis MIDOCEAN</h2>
            <p><strong>Référence:</strong> {data['devis_id']}</p>
            <p><strong>Client:</strong> {data['companyInfo']['companyName']}</p>
            <p><strong>Contact:</strong> {data['companyInfo']['firstName']} {data['companyInfo']['lastName']}</p>
            <hr>
            <h3>Détails du produit</h3>
            <p><strong>Produit:</strong> {data['product']['name']}</p>
            <p><strong>Référence:</strong> {data['product'].get('reference', 'N/A')}</p>
            <p><strong>Quantité:</strong> {data['product']['quantity']}</p>
            <p><strong>Prix unitaire:</strong> {data['product']['price']} €</p>
            <p><strong>Total HT:</strong> {data['total']} €</p>
            <p><strong>Total TTC:</strong> {float(data['total']) * 1.2} €</p>
            <hr>
            <p>Téléchargez votre devis complet au format PDF : <a href="{pdf_url}">Télécharger le devis</a></p>
            <p>Vous pouvez aussi <a href="{pdf_url}">imprimer cette offre</a></p>
            <hr>
            <p>Besoin d'informations complémentaires ? Contactez-nous au +33 2 40 48 83 22</p>
            """
        )
        mail.send(msg)

        return jsonify({
            "success": True,
            "devis_id": data['devis_id'],
            "pdf_url": pdf_url,
            "message": "Devis créé et email envoyé avec succès"
        })

    except Exception as e:
        print("Erreur complète:", str(e))
        return jsonify({
            "error": "Erreur lors de la création du devis",
            "details": str(e)
        }), 500



if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5001, debug=True)