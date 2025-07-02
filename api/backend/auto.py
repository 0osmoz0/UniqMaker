import requests

API_PRODUCTS_URL = "http://localhost:5001/products/images/full"
API_ADD_PRODUCT_URL = "http://localhost:5001/products"
AUTH_URL = "http://localhost:5001/auth/login"

REFS = [
    "MO2437", "MO2347", "MO2269", "MO2345", "MO2543", "MO2544", "MO2359", "MO7455", "MO8594", "MO2338", "MO6651", "MO6955",
    "KC1350", "MO6876", "MO2076", "MO2562", "MO2549", "MO2500", "MO2409", "MO2575", "MO2517", "MO2561", "MO2571", "MO2459",
    "MO2570", "MO2440", "MO9243", "MO2403", "MO6313", "MO9910", "MO8294", "MO9227", "MO7251", "MO2315", "MO2119", "MO6149",
    "MO9358", "MO2107", "MO9634", "MO9431", "MO7843", "MO6276", "MO6431", "MO7890", "MO9538", "MO6779", "MO9686", "MO2330",
    "MO8314", "MO8409", "MO8999", "MO6208", "MO8933", "MO9812", "MO2203", "IT2658", "MO6871", "MO8422", "MO8147", "MO9991",
    "MO6974", "MO2322", "MO6771", "MO9602", "MO8861", "MO9963", "KC4268", "MO2327", "MO2241", "MO2325", "MO8313", "MO6965",
    "MO2404", "MO2320", "MO6765", "MO9356", "MO6963", "MO6237", "MO8816", "KC2966", "MO9247", "MO6776", "MO9203", "MO2131",
    "MO6473", "MO2314", "MO8860", "MO6656", "IT3708", "MO9523", "MO6381", "MO6151", "MO2313", "MO7732", "MO6258", "MO9938",
    "MO2352", "MO2086", "MO6405", "MO8442", "MO6462", "MO8322", "MO2099", "MO7369", "MO9630", "MO2110", "MO6647", "MO6388",
    "MO8473", "MO6778", "MO9925", "MO6592", "MO2274", "MO2509", "MO2447", "KC2683", "MO6282", "MO8512", "IT2698", "MO9374",
    "MO9815", "MO9932", "MO2237", "MO9933", "MO7245", "MO6130", "MO9054", "MO6697", "MO9782", "KC2204", "MO8252", "KC5720",
    "MO8980", "MO2366", "MO2379", "MO7520", "MO6406", "MO9798", "MO6629", "IT3059", "MO6165", "MO2253", "MO7651", "MO9335",
    "MO2140", "IT3441", "MO6694", "MO8983", "MO6421", "MO9196", "MO2427", "MO2580", "MO2478", "MO2469", "MO2380", "KC8893",
    "MO2361", "MO9684", "MO1804", "MO2159", "MO1800", "MO8108", "MO9481", "IT3775", "MO2371", "MO9819", "MO9036", "MO9541",
    "MO7431", "IT3789", "MO2162", "MO6558", "KC2387", "MO6585", "MO9836", "MO7793", "MO6586", "MO6593", "MO2248", "MO8686",
    "MO6916", "AR1253", "MO9834", "MO6344", "KC2206", "KC6652", "MO7626", "MO2195", "MO6792", "MO7304", "MO9833", "MO7242",
    "KC7109", "MO9959", "MO6653", "KC2520", "MO7804", "IT3177", "MO6468", "MO7818", "MO6729", "MO8406", "MO2236", "MO6535",
    "MO2135", "MO6725", "MO6915", "KC2225", "KC6856", "MO2563", "MO2505", "MO2532", "MO2501", "MO7375", "MO9574", "IT3087",
    "KC2937", "KC2941", "KC7102", "MO9187", "KC6230", "IT1911", "MO8580", "KC1312", "MO7389", "MO8252", "MO8817", "KC2478",
    "MO2223", "MO6201", "MO9207", "MO6517", "MO9189", "MO8769", "MO9873", "MO9301", "MO8450", "MO6980", "MO9270", "MO9777",
    "MO9240", "MO6427", "MO8924", "MO8922", "MO2329", "MO2130", "CX1529", "CX1466", "CX1474", "CX1511", "CX1539", "CX1362",
    "CX1504", "CX1335", "CX1525", "CX1482", "MO2328", "CX1543", "MO2394", "CX1413", "CX1304", "CX1435", "CX1528", "CX1533",
    "CX1520", "CX1518", "CX1475", "CX1360", "KC5131", "MO8776", "MO8775", "MO8581", "KC5132", "MO2167", "MO2286", "MO8326",
    "MO2533", "MO2405", "MO2497", "MO2460", "MO2484", "MO2483", "MO2474", "MO2538", "MO2539", "MO2428", "MO2461", "MO8664",
    "MO8622", "MO8470", "MO8373", "MO7602", "MO9948", "MO8062", "MO6942", "MO8877", "IT3011", "MO8238", "MO6702", "MO9773",
    "MO8880", "IT3866", "MO6978", "AR1589", "MO6161", "MO8678", "MO8461", "MO8235", "MO7780",
    "KC1063", "KC2126", "MO6979", "MO2280", "MO8462", "MO2357", "MO8426", "MO2138", "MO9676",
    "MO8945", "MO7681", "MO2139", "MO9199", "MO8685", "MO2416", "MO2534", "MO2535", "MO2552",
    "MO2555", "MO2487", "MO2518", "MO2273", "MO2559", "MO2466", "MO2465", "MO2492", "MO2519",
    "MO2512", "MO2486", "MO2402", "MO9846", "MO9813", "IT3787", "MO6443", "MO2197", "MO6713",
    "MO6189", "MO9513", "MO9603", "MO2126", "MO7208", "KC2364", "MO9880", "MO8576", "MO8331",
    "MO8346", "MO6173", "MO9930", "MO9577", "MO8967", "MO8718", "MO9294", "MO8809", "IT3101",
    "MO6172", "IT2074", "MO8868", "KC5078", "MO2204", "MO8808", "MO6870", "MO6174", "MO7214",
    "MO9179", "MO2191", "MO9729", "MO6807", "MO8368", "MO8959", "MO8958", "MO7760", "MO9919",
    "KC6351", "MO9439", "MO6746", "MO9638", "MO7264", "KC6998", "MO2430", "MO2456", "MO2429",
    "MO2583", "MO2584", "MO2546", "MO2471", "MO6525", "MO2363", "MO9221", "MO9529", "MO9275",
    "MO9686", "MO6741", "MO2153", "MO6527", "MO6194", "MO8701", "MO9024", "MO9463", "MO2160",
    "MO8070", "MO9546", "MO9545", "MO8539", "IT3491", "MO9237", "MO8282", "MO9987", "MO8288",
    "MO2282", "MO6526", "MO9503", "MO6777", "MO9192", "MO8532", "MO6444", "KC6388", "MO6239",
    "MO6204", "MO9223", "MO6548", "MO9908", "MO1401c", "MO2451", "MO2432", "MO2442", "MO2431",
    "MO2513", "MO2445", "MO2520", "MO9891", "MO6815", "MO6662", "MO8735", "MO6874", "MO2211",
    "MO9673", "MO2079", "MO6825", "MO6642", "MO2378", "MO9692", "MO2275", "MO2279", "MO6393",
    "MO9785", "MO6317", "MO2182", "MO6879"
]

def get_token():
    """Récupère un token JWT via le login admin/admin"""
    data = {"username": "admin", "password": "admin"}
    response = requests.post(AUTH_URL, json=data)
    response.raise_for_status()
    return response.json()["token"]

def fetch_products(token):
    """Récupère la liste des produits avec images depuis l'API protégée"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(API_PRODUCTS_URL, headers=headers)
    response.raise_for_status()
    return response.json().get("products_with_images", [])

def import_product(product, token):
    """Envoie un produit à l'API d'ajout avec authentification"""
    form_data = {
        "name": product.get("product_name", f"Produit {product.get('master_code')}"),
        "price": product.get("price") * 2 if product.get("price") else 0,
        "stock": product.get("stock", 0),
        "category_level1": product.get("category_level1") or "Catégorie par défaut",
        "category_level2": product.get("category_level2") or "Sous-catégorie par défaut",
        "category_level3": product.get("category_level3") or "Sous-sous-catégorie par défaut",
        "description": product.get("long_description") or "Pas de description disponible",
        "image_url": product.get("images", [{}])[0].get("url", "")
    }
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.post(API_ADD_PRODUCT_URL, data=form_data, headers=headers)
    if res.status_code == 201:
        print(f"✅ Produit {form_data['name']} ajouté")
    else:
        print(f"❌ Erreur pour {form_data['name']} : {res.text}")

def main():
    token = get_token()
    all_products = fetch_products(token)
    imported_count = 0

    for product in all_products:
        if product.get("master_code") in REFS:
            import_product(product, token)
            imported_count += 1

    print(f"\n✅ {imported_count} produits importés avec succès.")

if __name__ == "__main__":
    main()