import 'package:flutter/material.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart'; // Import path_provider
import 'dart:math';
import 'dart:convert';
import 'dart:ui' as ui; // Importing dart:ui for ui.Image
import 'package:flutter/rendering.dart'; // Importing for RenderRepaintBoundary
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:uniqmaker/ProfilePage.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:uniqmaker/api_service.dart';
import 'package:mailer/mailer.dart';
import 'package:mailer/smtp_server.dart';

class CataloguePage extends StatelessWidget {
  final List<String> categories = [
    "Textile", "Bureau", "Drinkware", "Parapluies", "Sport", "Technologie", "Écologique"
  ];

  final List<Map<String, String>> bestSellers = [
    {"name": "T-shirt Bio", "image": "assets/textile_white.png", "price": "12€"},
    {"name": "Gourde Inox", "image": "assets/mug.png", "price": "15€"},
    {"name": "Carnet A5", "image": "assets/carnet.png", "price": "6€"},
  ];

  final List<Map<String, String>> suggestions = [
    {
      "name": "Parapluie Automatique",
      "image": "assets/paraplui.png",
      "desc": "Parapluie pliable résistant au vent",
      "price": "9€"
    },
    {
      "name": "Stylo Bambou",
      "image": "assets/stylo.png",
      "desc": "Stylo écologique à bille",
      "price": "2€"
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text("Catalogue", style: TextStyle(fontWeight: FontWeight.w600)),
        backgroundColor: Colors.transparent,
        actions: [
          //clickable

          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: GestureDetector (
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => ProfilePage()));
              },
            child: CircleAvatar(
              backgroundImage: AssetImage("assets/profile.jpg"),
            ),
            ),
          )
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _sectionTitle("Catégories"),
          const SizedBox(height: 8),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: categories.map((cat) {
              return ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => CategoryProductsPage(categoryName: cat),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  backgroundColor: Colors.orange.shade50,
                  foregroundColor: Colors.deepOrange,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  elevation: 0,
                ),
                child: Text(cat),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),

          _sectionTitle("Best Sellers"),
          const SizedBox(height: 12),
          SizedBox(
            height: 180,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: bestSellers.length,
              itemBuilder: (context, index) {
                final item = bestSellers[index];
                return CompactProductCard(
                  name: item["name"]!,
                  imagePath: item["image"]!,
                  price: item["price"]!,
                );
              },
            ),
          ),

          const SizedBox(height: 24),
          _sectionTitle("Suggestions & Nouveautés"),
          const SizedBox(height: 12),
          Column(
            children: suggestions.map((item) {
              return SuggestionTile(
                name: item["name"]!,
                imagePath: item["image"]!,
                desc: item["desc"]!,
                price: item["price"]!,
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(String text) {
    return Text(
      text,
      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black87),
    );
  }
}

class CompactProductCard extends StatelessWidget {
  final String name;
  final String imagePath;
  final String price;

  const CompactProductCard({super.key, required this.name, required this.imagePath, required this.price});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProductDetailPage(name: name, imagePath: imagePath, price: double.parse(price.replaceAll('€', '').trim()), productType: "defaultType"),
          ),
        );
      },
      child: Container(
        width: 140,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: Colors.white,
          boxShadow: [
            BoxShadow(color: Colors.grey.shade300, blurRadius: 6, offset: const Offset(0, 3)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              child: Image.asset(imagePath, height: 100, width: 140, fit: BoxFit.cover),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(price, style: const TextStyle(color: Colors.deepOrange, fontWeight: FontWeight.w500)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class SuggestionTile extends StatelessWidget {
  final String name;
  final String imagePath;
  final String desc;
  final String price;

  const SuggestionTile({super.key, required this.name, required this.imagePath, required this.desc, required this.price});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProductDetailPage(name: name, imagePath: imagePath, price: double.parse(price.replaceAll('€', '').trim()), productType: "defaultType"),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.orange.shade50,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.asset(imagePath, width: 60, height: 60, fit: BoxFit.cover),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(desc, style: const TextStyle(fontSize: 13, color: Colors.black54)),
                ],
              ),
            ),
            Text(price, style: const TextStyle(color: Colors.deepOrange, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

class CategoryProductsPage extends StatelessWidget {
  final String categoryName;
  const CategoryProductsPage({super.key, required this.categoryName});

  @override
  Widget build(BuildContext context) {
    final Map<String, List<Map<String, String>>> categoryProducts = {
      "Textile": [
        {"name": "T-shirt Bio", "image": "assets/textile_white.png", "price": "12€"},
        {"name": "Sweat Uni", "image": "assets/textile_white.png", "price": "25€"},
      ],
      "Bureau": [
        {"name": "Carnet A5", "image": "assets/carnet.png", "price": "6€"},
        {"name": "Stylo Bambou", "image": "assets/stylo.png", "price": "2€"},
      ],
      "Drinkware": [
        {"name": "Gourde Inox", "image": "assets/mug.png", "price": "15€"},
        {"name": "Mug Thermo", "image": "assets/mug.png", "price": "10€"},
      ],
      "Parapluies": [
        {"name": "Parapluie Auto", "image": "assets/paraplui.png", "price": "9€"},
      ],
      "Sport": [
        {"name": "Bouteille Sport", "image": "assets/mug.png", "price": "11€"},
      ],
      "Technologie": [
        {"name": "Clé USB 16Go", "image": "assets/stylo.png", "price": "8€"},
      ],
      "Écologique": [
        {"name": "Stylo Bambou", "image": "assets/stylo.png", "price": "2€"},
      ],
    };

    final List<Map<String, String>> products = categoryProducts[categoryName] ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(categoryName),
      ),
      body: products.isEmpty
          ? const Center(child: Text("Aucun produit disponible"))
          : GridView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: products.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 3 / 4,
              ),
              itemBuilder: (context, index) {
                final product = products[index];
                return InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ProductDetailPage(
                          name: product["name"]!,
                          imagePath: product["image"]!,
                          price: double.parse(product["price"]!.replaceAll('€', '').trim()),
                          productType: categoryName.toLowerCase(), // Assuming categoryName represents the product type
                        ),
                      ),
                    );
                  },
                  child: ProductCard(
                    name: product["name"]!,
                    imagePath: product["image"]!,
                    price: product["price"]!,
                  ),
                );
              },
            ),
    );
  }
}

class ProductCard extends StatelessWidget {
  final String name;
  final String imagePath;
  final String price;
  final VoidCallback? onTap;

  const ProductCard({super.key, required this.name, required this.imagePath, required this.price, this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.grey.shade300, blurRadius: 5, offset: const Offset(0, 3)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              child: Image.asset(imagePath, height: 120, width: double.infinity, fit: BoxFit.cover),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  Text(price, style: const TextStyle(color: Colors.deepOrange, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ProductListPageV2 extends StatelessWidget {
  final List<Product> products = [
    Product(
      name: 'REGENT 1830',
      type: 'T-shirt',
      price: 29.99,
      imagePath: 'assets/tshirt.png',
      rating: 4.8,
      reviewCount: 9,
    ),
    Product(
      name: 'CLASSIC 1950',
      type: 'Sweat',
      price: 49.99,
      imagePath: 'assets/sweat.png',
      rating: 4.5,
      reviewCount: 7,
    ),
  ];

  ProductListPageV2({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('01 | STUDIO'),
      ),
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (context, index) {
          return ProductCard(
            name: products[index].name,
            imagePath: products[index].imagePath,
            price: '${products[index].price.toStringAsFixed(2)} €',
          );
        },
      ),
    );
  }
}

class ProductDetails {
  final String productName;
  final String productType;
  final double productPrice;
  final String productImagePath;
  final double productRating;
  final int productReviewCount;

  ProductDetails({
    required this.productName,
    required this.productType,
    required this.productPrice,
    required this.productImagePath,
    this.productRating = 0,
    this.productReviewCount = 0,
  });
}

class DetailedProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;

  const DetailedProductCard({
    super.key,
    required this.product,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(8),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Image.asset(
                product.imagePath,
                height: 150,
                fit: BoxFit.contain,
              ),
              const SizedBox(height: 8),
              Text(
                product.name,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '${product.type} personnalisé pas cher',
                style: const TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  ...List.generate(5, (index) {
                    return Icon(
                      index < product.rating.floor()
                          ? Icons.star
                          : Icons.star_border,
                      color: Colors.amber,
                      size: 16,
                    );
                  }),
                  const SizedBox(width: 4),
                  Text(
                    '${product.rating.toStringAsFixed(1)} (${product.reviewCount})',
                    style: const TextStyle(fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: onTap,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 36),
                ),
                child: const Text('PERSONNALISER'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class ProductListPageV3 extends StatelessWidget {
  final List<Product> products = [
    Product(
      name: 'REGENT 1830',
      type: 'T-shirt',
      price: 29.99,
      imagePath: 'assets/tshirt.png',
      rating: 4.8,
      reviewCount: 9,
    ),
    Product(
      name: 'CLASSIC 1950',
      type: 'Casquette',
      price: 24.99,
      imagePath: 'assets/cap.png',
      rating: 4.5,
      reviewCount: 7,
    ),
    Product(
      name: 'PREMIUM 2023',
      type: 'Sweat',
      price: 49.99,
      imagePath: 'assets/sweat.png',
      rating: 4.7,
      reviewCount: 12,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('01 | STUDIO'),
      ),
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (context, index) {
          return ProductCard(
            name: products[index].name,
            imagePath: products[index].imagePath,
            price: '${products[index].price.toStringAsFixed(2)} €',
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ProductDetailPage(
                    name: products[index].name,
                    imagePath: products[index].imagePath,
                    price: products[index].price,
                    productType: products[index].type,
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class ProductV2 {
  final String nameV2;
  final String typeV2;
  final double priceV2;
  final String imagePathV2;
  final double ratingV2;
  final int reviewCountV2;

  ProductV2({
    required this.nameV2,
    required this.typeV2,
    required this.priceV2,
    required this.imagePathV2,
    this.ratingV2 = 0,
    this.reviewCountV2 = 0,
  });
}

class ProductListPage extends StatelessWidget {
  final List<Product> products = [
    Product(
      name: 'REGENT 1830',
      type: 'T-shirt',
      price: 29.99,
      imagePath: 'assets/tshirt.png',
      rating: 4.8,
      reviewCount: 9,
    ),
    Product(
      name: 'CLASSIC 1950',
      type: 'Sweat',
      price: 49.99,
      imagePath: 'assets/sweat.png',
      rating: 4.5,
      reviewCount: 7,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('01 | STUDIO'),
      ),
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (context, index) {
          return ProductCard(
            name: products[index].name,
            imagePath: products[index].imagePath,
            price: '${products[index].price.toStringAsFixed(2)} €',
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ProductDetailPage(
                    name: products[index].name,
                    imagePath: products[index].imagePath,
                    price: products[index].price,
                    productType: products[index].type,
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class Product {
  final String name;
  final String type;
  final double price;
  final String imagePath;
  final double rating;
  final int reviewCount;

  Product({
    required this.name,
    required this.type,
    required this.price,
    required this.imagePath,
    this.rating = 0,
    this.reviewCount = 0,
  });
}

class CustomProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;

  const CustomProductCard({
    Key? key,
    required this.product,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(8),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Image.asset(
                product.imagePath,
                height: 150,
                fit: BoxFit.contain,
              ),
              SizedBox(height: 8),
              Text(
                product.name,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '${product.type} personnalisé pas cher',
                style: TextStyle(color: Colors.grey),
              ),
              SizedBox(height: 4),
              Row(
                children: [
                  ...List.generate(5, (index) {
                    return Icon(
                      index < product.rating.floor()
                          ? Icons.star
                          : Icons.star_border,
                      color: Colors.amber,
                      size: 16,
                    );
                  }),
                  SizedBox(width: 4),
                  Text(
                    '${product.rating.toStringAsFixed(1)} (${product.reviewCount})',
                    style: TextStyle(fontSize: 12),
                  ),
                ],
              ),
              SizedBox(height: 8),
              ElevatedButton(
                onPressed: onTap,
                child: Text('PERSONNALISER'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,
                  minimumSize: Size(double.infinity, 36),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class ProductDetailPage extends StatefulWidget {
  final String name;
  final String imagePath;
  final double price;
  final String productType;

  const ProductDetailPage({
    Key? key,
    required this.name,
    required this.imagePath,
    required this.price,
    required this.productType,
  }) : super(key: key);

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  // Variables de personnalisation
  int _quantity = 1;
  Color _productColor = Colors.white;
  File? _customLogo;
  String _customText = '';
  bool _isFavorite = false;
  Offset _logoPosition = Offset.zero;
  Offset _textPosition = Offset.zero;
  double _logoScale = 1.0;
  double _textScale = 1.0;
  double _logoRotation = 0;
  double _textRotation = 0;
  String? _selectedElement;
  Color _textColor = Colors.black;
  String _selectedFont = 'Roboto';
  String _selectedPosition = 'Poche poitrine';
  final TextEditingController _textController = TextEditingController();
  final GlobalKey _productPreviewKey = GlobalKey();

  // Contrôleurs pour les informations client
  final _clientNameController = TextEditingController();
  final _clientEmailController = TextEditingController();
  final _clientPhoneController = TextEditingController();
  final _clientAddressController = TextEditingController();

  // Options disponibles
  final List<Color> _availableColors = [
    Colors.black,
    Colors.white,
    const Color(0xFFE30613),
    const Color(0xFFFFD800),
    const Color(0xFF007A30),
    const Color(0xFF0038A8),
    const Color(0xFF6D3B8E),
    const Color(0xFFFF6B00),
  ];

  final List<String> _availableFonts = [
    'Roboto',
    'Arial',
    'Times New Roman',
    'Courier New',
    'Comic Sans MS'
  ];

  List<String> _availablePositions = [
    'Poche poitrine',
    'Centré poitrine',
    'Dos haut',
    'Dos bas',
    'Manche gauche',
    'Manche droite',
    'Style bas'
  ];

  final Size _productSize = Size(300, 400);
  bool _isSaving = false;
  bool _isDisposed = false;

  @override
  void initState() {
    super.initState();
    _initializePositions();
    _adaptPositionsForProductType();
  }

  void _initializePositions() {
    _logoPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.4);
    _textPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.6);
  }

  void _adaptPositionsForProductType() {
    if (_isDisposed) return;
    
    setState(() {
      switch (widget.productType.toLowerCase()) {
        case 'casquette':
          _availablePositions = ['Avant', 'Côté droit', 'Côté gauche', 'Arrière'];
          _selectedPosition = 'Avant';
          break;
        case 'sweat':
          if (!_availablePositions.contains('Poche kangourou')) {
            _availablePositions.add('Poche kangourou');
          }
          break;
      }
      _applySmartPositioning();
    });
  }

  void _applySmartPositioning() {
    if (_isDisposed) return;

    setState(() {
      switch (_selectedPosition) {
        case 'Poche poitrine':
          _logoPosition = Offset(_productSize.width * 0.3, _productSize.height * 0.3);
          _textPosition = Offset(_productSize.width * 0.3, _productSize.height * 0.4);
          break;
        case 'Centré poitrine':
          _logoPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.3);
          _textPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.4);
          break;
        case 'Dos haut':
          _logoPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.1);
          _textPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.2);
          break;
        case 'Dos bas':
          _logoPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.7);
          _textPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.8);
          break;
        case 'Manche gauche':
          _logoPosition = Offset(_productSize.width * 0.1, _productSize.height * 0.5);
          _textPosition = Offset(_productSize.width * 0.1, _productSize.height * 0.6);
          break;
        case 'Manche droite':
          _logoPosition = Offset(_productSize.width * 0.9, _productSize.height * 0.5);
          _textPosition = Offset(_productSize.width * 0.9, _productSize.height * 0.6);
          break;
        case 'Poche kangourou':
          _logoPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.6);
          _textPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.7);
          break;
        case 'Avant':
          _logoPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.4);
          _textPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.5);
          break;
        default:
          _logoPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.4);
          _textPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.6);
      }
      
      _logoScale = 1.0;
      _textScale = 1.0;
      _logoRotation = 0;
      _textRotation = 0;
    });
  }

  @override
  void dispose() {
    _isDisposed = true;
    _textController.dispose();
    _clientNameController.dispose();
    _clientEmailController.dispose();
    _clientPhoneController.dispose();
    _clientAddressController.dispose();
    super.dispose();
  }

  Future<File?> _captureProductImage() async {
    if (_isDisposed) return null;
    
    try {
      setState(() => _isSaving = true);
      
      final boundary = _productPreviewKey.currentContext?.findRenderObject() as RenderRepaintBoundary?;
      if (boundary == null || !boundary.attached) return null;

      final image = await boundary.toImage(pixelRatio: 3.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      if (byteData == null) return null;

      final directory = await getApplicationDocumentsDirectory();
      final filePath = '${directory.path}/custom_product_${DateTime.now().millisecondsSinceEpoch}.png';
      final file = File(filePath);
      await file.writeAsBytes(byteData.buffer.asUint8List());
      
      return file;
    } catch (e) {
      debugPrint('Error capturing image: $e');
      return null;
    } finally {
      if (!_isDisposed) {
        setState(() => _isSaving = false);
      }
    }
  }

  Widget _buildProductPreview() {
    return RepaintBoundary(
      key: _productPreviewKey,
      child: GestureDetector(
        onScaleStart: _handleScaleStart,
        onScaleUpdate: _handleScaleUpdate,
        onTapUp: _handleTapUp,
        child: Stack(
          children: [
            Center(
              child: ColorFiltered(
                colorFilter: ColorFilter.mode(_productColor, BlendMode.srcATop),
                child: Image.asset(
                  widget.imagePath,
                  fit: BoxFit.contain,
                  width: _productSize.width,
                  height: _productSize.height,
                ),
              ),
            ),
            if (_customLogo != null)
              Positioned(
                left: _logoPosition.dx,
                top: _logoPosition.dy,
                child: GestureDetector(
                  onTap: () => _selectElement('logo'),
                  child: Transform(
                    transform: Matrix4.identity()
                      ..translate(-50 * _logoScale, -50 * _logoScale)
                      ..scale(_logoScale)
                      ..rotateZ(_logoRotation),
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        border: _selectedElement == 'logo'
                            ? Border.all(color: Colors.blue, width: 2)
                            : null,
                      ),
                      child: Image.file(
                        _customLogo!,
                        fit: BoxFit.contain,
                        errorBuilder: (ctx, error, stack) => Icon(Icons.error),
                      ),
                    ),
                  ),
                ),
              ),
            if (_customText.isNotEmpty)
              Positioned(
                left: _textPosition.dx,
                top: _textPosition.dy,
                child: GestureDetector(
                  onTap: () => _selectElement('text'),
                  child: Transform(
                    transform: Matrix4.identity()
                      ..translate(-_getTextWidth() / 2, -24 * _textScale / 2)
                      ..scale(_textScale)
                      ..rotateZ(_textRotation),
                    child: Container(
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.7),
                        border: _selectedElement == 'text'
                            ? Border.all(color: Colors.red, width: 2)
                            : null,
                      ),
                      child: Text(
                        _customText,
                        style: TextStyle(
                          fontFamily: _selectedFont,
                          fontSize: 24,
                          color: _textColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  void _selectElement(String element) {
    if (_isDisposed) return;
    setState(() => _selectedElement = element);
  }

  double _getTextWidth() {
    final textPainter = TextPainter(
      text: TextSpan(
        text: _customText,
        style: TextStyle(
          fontFamily: _selectedFont,
          fontSize: 24,
          fontWeight: FontWeight.bold,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    return textPainter.width;
  }

  void _handleScaleStart(ScaleStartDetails details) {
    if (_selectedElement == null) return;
  }

  void _handleScaleUpdate(ScaleUpdateDetails details) {
    if (_isDisposed || _selectedElement == null) return;

    setState(() {
      if (_selectedElement == 'logo') {
        _logoPosition += details.focalPointDelta;
        _logoScale *= details.scale;
        _logoRotation += details.rotation;
      } else if (_selectedElement == 'text') {
        _textPosition += details.focalPointDelta;
        _textScale *= details.scale;
        _textRotation += details.rotation;
      }
    });
  }

  void _handleTapUp(TapUpDetails details) {
    if (_isDisposed) return;

    final tapPosition = details.localPosition;
    final logoRect = Rect.fromCenter(
      center: _logoPosition,
      width: 100 * _logoScale,
      height: 100 * _logoScale,
    );
    final textRect = Rect.fromCenter(
      center: _textPosition,
      width: _getTextWidth() * _textScale,
      height: 24 * _textScale,
    );

    setState(() {
      if (_customLogo != null && logoRect.contains(tapPosition)) {
        _selectedElement = 'logo';
      } else if (_customText.isNotEmpty && textRect.contains(tapPosition)) {
        _selectedElement = 'text';
      } else {
        _selectedElement = null;
      }
    });
  }

  Future<void> _uploadLogo() async {
    if (_isDisposed) return;
    
    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(source: ImageSource.gallery);
      if (pickedFile != null) {
        setState(() {
          _customLogo = File(pickedFile.path);
          _selectedElement = 'logo';
        });
      }
    } catch (e) {
      debugPrint('Error uploading logo: $e');
    }
  }

  void _showColorPicker([bool isProductColor = true]) {
    if (_isDisposed) return;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isProductColor ? 'Couleur du produit' : 'Couleur du texte'),
        content: SingleChildScrollView(
          child: ColorPicker(
            pickerColor: isProductColor ? _productColor : _textColor,
            onColorChanged: (color) {
              if (!_isDisposed) {
                setState(() {
                  if (isProductColor) {
                    _productColor = color;
                  } else {
                    _textColor = color;
                  }
                });
              }
            },
            showLabel: true,
            pickerAreaHeightPercent: 0.8,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Valider'),
          ),
        ],
      ),
    );
  }

  void _showEmailDialog() {
    if (_isDisposed) return;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) {
          return AlertDialog(
            title: Text('Demander un devis'),
            content: SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  maxWidth: MediaQuery.of(context).size.width * 0.9,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('Informations client', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    SizedBox(height: 10),
                    TextField(
                      controller: _clientNameController,
                      decoration: InputDecoration(
                        labelText: 'Nom complet*',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    SizedBox(height: 10),
                    TextField(
                      controller: _clientEmailController,
                      decoration: InputDecoration(
                        labelText: 'Email*',
                        border: OutlineInputBorder(),
                        hintText: 'exemple@domaine.com',
                      ),
                      keyboardType: TextInputType.emailAddress,
                    ),
                    SizedBox(height: 10),
                    TextField(
                      controller: _clientPhoneController,
                      decoration: InputDecoration(
                        labelText: 'Téléphone*',
                        border: OutlineInputBorder(),
                        hintText: '06 12 34 56 78',
                      ),
                      keyboardType: TextInputType.phone,
                    ),
                    SizedBox(height: 10),
                    TextField(
                      controller: _clientAddressController,
                      decoration: InputDecoration(
                        labelText: 'Adresse',
                        border: OutlineInputBorder(),
                        hintText: 'Adresse de livraison',
                      ),
                      maxLines: 2,
                    ),
                    SizedBox(height: 20),
                    Text('Récapitulatif du devis', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    SizedBox(height: 10),
                    _buildQuoteSummary(),
                  ],
                ),
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text('Annuler'),
              ),
              ElevatedButton(
                onPressed: _isSaving ? null : () => _sendQuote(context),
                child: _isSaving
                    ? CircularProgressIndicator(color: Colors.white)
                    : Text('Envoyer la demande'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildQuoteSummary() {
    final totalPrice = widget.price * _quantity;
    final vat = totalPrice * 0.2;
    final totalWithVat = totalPrice + vat;
    final reference = 'DEV-${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}';

    return Card(
      elevation: 1,
      child: Padding(
        padding: EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Container(
              padding: EdgeInsets.all(5),
              color: Colors.blue[50],
              child: Row(
                children: [
                  Icon(Icons.receipt, color: Colors.blue),
                  SizedBox(width: 5),
                  Text(
                    'DEVIS N°$reference',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blue),
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            
            // Product preview
            Container(
              height: 150,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey[300]!),
                borderRadius: BorderRadius.circular(8),
                color: Colors.grey[100],
              ),
              child: _buildProductPreview(),
            ),
            SizedBox(height: 16),
            
            // Product details
            Text('Détails du produit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            SizedBox(height: 8),
            Table(
              columnWidths: {0: FlexColumnWidth(2), 1: FlexColumnWidth(3)},
              children: [
                _buildTableRow('Produit', widget.name),
                _buildTableRow('Type', widget.productType),
                _buildTableRow('Quantité', '$_quantity'),
                _buildTableRow('Prix unitaire', '${widget.price.toStringAsFixed(2)} €'),
              ],
            ),
            Divider(),
            
            // Customization
            Text('Personnalisation', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            SizedBox(height: 8),
            Table(
              columnWidths: {0: FlexColumnWidth(2), 1: FlexColumnWidth(3)},
              children: [
                _buildTableRowWithColor('Couleur', _productColor),
                if (_customText.isNotEmpty) ...[
                  _buildTableRow('Texte', _customText),
                  _buildTableRow('Police', _selectedFont),
                  _buildTableRowWithColor('Couleur texte', _textColor),
                ],
                if (_customLogo != null)
                  _buildTableRow('Logo', 'Personnalisé'),
                _buildTableRow('Position', _selectedPosition),
              ],
            ),
            Divider(),
            
            // Pricing
            Text('Total', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            SizedBox(height: 8),
            Table(
              columnWidths: {0: FlexColumnWidth(2), 1: FlexColumnWidth(3)},
              children: [
                _buildTableRow('Sous-total', '${totalPrice.toStringAsFixed(2)} €'),
                _buildTableRow('TVA (20%)', '${vat.toStringAsFixed(2)} €'),
                _buildTableRow('Total TTC', '${totalWithVat.toStringAsFixed(2)} €',
                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
              ],
            ),
            SizedBox(height: 10),
            Text('*TVA incluse', style: TextStyle(fontSize: 12, color: Colors.grey)),
            SizedBox(height: 10),
            Text('Valable 30 jours', style: TextStyle(fontStyle: FontStyle.italic)),
          ],
        ),
      ),
    );
  }

  TableRow _buildTableRow(String label, String value, {TextStyle? style}) {
    return TableRow(
      children: [
        Padding(
          padding: EdgeInsets.symmetric(vertical: 4),
          child: Text('$label:', style: TextStyle(fontWeight: FontWeight.w500)),
        ),
        Padding(
          padding: EdgeInsets.symmetric(vertical: 4),
          child: Text(value, style: style),
        ),
      ],
    );
  }

  TableRow _buildTableRowWithColor(String label, Color color) {
    return TableRow(
      children: [
        Padding(
          padding: EdgeInsets.symmetric(vertical: 4),
          child: Text('$label:', style: TextStyle(fontWeight: FontWeight.w500)),
        ),
        Padding(
          padding: EdgeInsets.symmetric(vertical: 4),
          child: Row(
            children: [
              Container(
                width: 16,
                height: 16,
                decoration: BoxDecoration(
                  color: color,
                  border: Border.all(color: Colors.black),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              SizedBox(width: 8),
              Text(_getColorName(color)),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _sendQuote(BuildContext context) async {
    if (_isDisposed) return;
    if (_clientNameController.text.isEmpty || 
        _clientEmailController.text.isEmpty || 
        _clientPhoneController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Veuillez remplir tous les champs obligatoires (*)')),
      );
      return;
    }

    setState(() => _isSaving = true);
    try {
      final productImage = await _captureProductImage();
      final email = _clientEmailController.text;
      final subject = 'Devis ${widget.name} pour ${_clientNameController.text}';
      final body = _generateEmailBody();

      final mailtoUri = Uri(
        scheme: 'mailto',
        path: email,
        queryParameters: {
          'subject': subject,
          'body': body,
        },
      );

      if (await canLaunchUrl(mailtoUri)) {
        await launchUrl(mailtoUri);
        if (!_isDisposed) {
          Navigator.of(context).pop();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Demande de devis envoyée avec succès')),
          );
        }
      } else {
        await _showFallbackOptions(context, subject, body);
      }
    } catch (e) {
      if (!_isDisposed) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur lors de l\'envoi: $e')),
        );
      }
    } finally {
      if (!_isDisposed) {
        setState(() => _isSaving = false);
      }
    }
  }

  String _generateEmailBody() {
    final totalPrice = widget.price * _quantity;
    final vat = totalPrice * 0.2;
    final totalWithVat = totalPrice + vat;
    final reference = 'DEV-${DateTime.now().millisecondsSinceEpoch.toString().substring(4)}';
    
    return '''
DEVIS PERSONNALISÉ
==================

Référence: $reference
Date: ${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}

INFORMATIONS CLIENT
-------------------
Nom: ${_clientNameController.text}
Email: ${_clientEmailController.text}
Téléphone: ${_clientPhoneController.text}
${_clientAddressController.text.isNotEmpty ? 'Adresse: ${_clientAddressController.text}' : ''}

DÉTAILS DU PRODUIT
------------------
Produit: ${widget.name}
Type: ${widget.productType}
Quantité: $_quantity
Prix unitaire: ${widget.price.toStringAsFixed(2)} €
Sous-total: ${totalPrice.toStringAsFixed(2)} €
TVA (20%): ${vat.toStringAsFixed(2)} €
TOTAL TTC: ${totalWithVat.toStringAsFixed(2)} €

PERSONNALISATION
----------------
Couleur: ${_getColorName(_productColor)}
${_customText.isNotEmpty ? 'Texte: "$_customText"\nPolice: $_selectedFont\nCouleur texte: ${_getColorName(_textColor)}' : ''}
${_customLogo != null ? 'Logo personnalisé: Oui' : ''}
Position: $_selectedPosition

CONDITIONS
----------
- Valable 30 jours
- Paiement à la commande
- Livraison sous 15 jours ouvrés

Pour valider ce devis ou pour toute question, veuillez répondre à cet email.

Cordialement,
[Votre Entreprise]
[Votre Téléphone]
[Votre Email]
[Votre Site Web]
''';
  }

  String _getColorName(Color color) {
    if (color == Colors.black) return 'Noir';
    if (color == Colors.white) return 'Blanc';
    if (color == const Color(0xFFE30613)) return 'Rouge';
    if (color == const Color(0xFFFFD800)) return 'Jaune';
    if (color == const Color(0xFF007A30)) return 'Vert';
    if (color == const Color(0xFF0038A8)) return 'Bleu';
    if (color == const Color(0xFF6D3B8E)) return 'Violet';
    if (color == const Color(0xFFFF6B00)) return 'Orange';
    return 'personnalisée';
  }

  Future<void> _showFallbackOptions(BuildContext context, String subject, String body) async {
    if (_isDisposed) return;
    
    await showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Options d\'envoi'),
          content: SingleChildScrollView(
            child: Column(
              children: [
                Text('Impossible d\'ouvrir l\'application email. Vous pouvez copier le devis ci-dessous:'),
                SizedBox(height: 20),
                Container(
                  padding: EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: SelectableText(
                    'Sujet: $subject\n\n$body',
                    style: TextStyle(fontFamily: 'Courier'),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              child: Text('Copier'),
              onPressed: () {
                Clipboard.setData(ClipboardData(text: 'Sujet: $subject\n\n$body'));
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Devis copié dans le presse-papier')),
                );
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Fermer'),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        );
      },
    );
  }

  Widget _buildPositionSelector() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Position du motif',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _selectedPosition,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
              isExpanded: true,
              items: _availablePositions.map((position) {
                return DropdownMenuItem(
                  value: position,
                  child: Text(position),
                );
              }).toList(),
              onChanged: (value) {
                if (!_isDisposed && value != null) {
                  setState(() {
                    _selectedPosition = value;
                    _applySmartPositioning();
                  });
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildElementControls() {
    if (_selectedElement == null) return SizedBox.shrink();

    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Modifier ${_selectedElement == 'logo' ? 'le logo' : 'le texte'}',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildControlButton(
                  icon: Icons.rotate_left,
                  label: 'Rotation -',
                  onPressed: () {
                    if (_isDisposed) return;
                    setState(() {
                      if (_selectedElement == 'logo') {
                        _logoRotation -= 0.1;
                      } else if (_selectedElement == 'text') {
                        _textRotation -= 0.1;
                      }
                    });
                  },
                ),
                _buildControlButton(
                  icon: Icons.rotate_right,
                  label: 'Rotation +',
                  onPressed: () {
                    if (_isDisposed) return;
                    setState(() {
                      if (_selectedElement == 'logo') {
                        _logoRotation += 0.1;
                      } else if (_selectedElement == 'text') {
                        _textRotation += 0.1;
                      }
                    });
                  },
                ),
                _buildControlButton(
                  icon: Icons.zoom_in,
                  label: 'Agrandir',
                  onPressed: () {
                    if (_isDisposed) return;
                    setState(() {
                      if (_selectedElement == 'logo') {
                        _logoScale *= 1.1;
                      } else if (_selectedElement == 'text') {
                        _textScale *= 1.1;
                      }
                    });
                  },
                ),
                _buildControlButton(
                  icon: Icons.zoom_out,
                  label: 'Réduire',
                  onPressed: () {
                    if (_isDisposed) return;
                    setState(() {
                      if (_selectedElement == 'logo') {
                        _logoScale *= 0.9;
                      } else if (_selectedElement == 'text') {
                        _textScale *= 0.9;
                      }
                    });
                  },
                ),
                if (_selectedElement == 'text')
                  _buildControlButton(
                    icon: Icons.color_lens,
                    label: 'Couleur',
                    onPressed: () => _showColorPicker(false),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlButton({required IconData icon, required String label, required VoidCallback onPressed}) {
    return Column(
      children: [
        IconButton(
          icon: Icon(icon),
          onPressed: onPressed,
          style: IconButton.styleFrom(
            backgroundColor: Colors.blue[50],
            padding: EdgeInsets.all(12),
          ),
        ),
        SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 12)),
      ],
    );
  }

  Widget _buildTextCustomization() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Personnalisation du texte',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 12),
            TextField(
              controller: _textController,
              decoration: InputDecoration(
                labelText: 'Texte à imprimer',
                border: OutlineInputBorder(),
                suffixIcon: _customText.isNotEmpty
                    ? IconButton(
                        icon: Icon(Icons.clear),
                        onPressed: () {
                          if (_isDisposed) return;
                          setState(() {
                            _customText = '';
                            _textController.clear();
                          });
                        },
                      )
                    : null,
              ),
              onChanged: (value) {
                if (_isDisposed) return;
                setState(() {
                  _customText = value;
                  _selectedElement = 'text';
                });
              },
            ),
            SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: _selectedFont,
              decoration: InputDecoration(
                labelText: 'Police d\'écriture',
                border: OutlineInputBorder(),
              ),
              items: _availableFonts.map((font) {
                return DropdownMenuItem(
                  value: font,
                  child: Text(font),
                );
              }).toList(),
              onChanged: (value) {
                if (!_isDisposed && value != null) {
                  setState(() => _selectedFont = value);
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLogoUpload() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Logo personnalisé',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: _uploadLogo,
              icon: Icon(Icons.upload),
              label: Text(_customLogo != null ? 'Changer le logo' : 'Ajouter un logo'),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, 48),
                backgroundColor: Colors.blue[50],
                foregroundColor: Colors.blue,
              ),
            ),
            if (_customLogo != null) ...[
              SizedBox(height: 12),
              ElevatedButton(
                onPressed: () {
                  if (_isDisposed) return;
                  setState(() {
                    _customLogo = null;
                    _selectedElement = null;
                  });
                },
                child: Text('Supprimer le logo'),
                style: ElevatedButton.styleFrom(
                  minimumSize: Size(double.infinity, 48),
                  backgroundColor: Colors.red[50],
                  foregroundColor: Colors.red,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildColorSelector() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Couleur du produit',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 12),
            Text('Couleurs disponibles:', style: TextStyle(color: Colors.grey)),
            SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _availableColors.map((color) {
                return GestureDetector(
                  onTap: () {
                    if (_isDisposed) return;
                    setState(() => _productColor = color);
                  },
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: color,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: _productColor == color ? Colors.black : Colors.transparent,
                        width: 2,
                      ),
                    ),
                    child: _productColor == color
                        ? Icon(Icons.check, color: color.computeLuminance() > 0.5 ? Colors.black : Colors.white)
                        : null,
                  ),
                );
              }).toList(),
            ),
            SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: () => _showColorPicker(true),
              icon: Icon(Icons.color_lens),
              label: Text('Autre couleur'),
            ),
          ],
        ),
      ),
    );
  }     
@override
Widget build(BuildContext context) {
  final totalPrice = widget.price * _quantity;

  return Scaffold(
    appBar: AppBar(
      title: Text(widget.name),
      actions: [
        IconButton(
          icon: Icon(_isFavorite ? Icons.favorite : Icons.favorite_border),
          color: _isFavorite ? Colors.red : null,
          onPressed: () => setState(() => _isFavorite = !_isFavorite),
        ),
        if (_isSaving) Padding(
          padding: EdgeInsets.all(12),
          child: CircularProgressIndicator(color: Colors.white),
        ),
      ],
    ),
    body: Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            child: Column(
              children: [
                // Product preview
                Container(
                  padding: EdgeInsets.all(16),
                  color: Colors.grey[50],
                  child: Center(
                    child: GestureDetector(
                      onScaleStart: _handleScaleStart,
                      onScaleUpdate: _handleScaleUpdate,
                      onTapUp: _handleTapUp,
                      child: _buildProductPreview(),
                    ),
                  ),
                ),
                
                // Customization controls
                Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Personnalisez votre produit', style: Theme.of(context).textTheme.titleLarge),
                      SizedBox(height: 16),
                      _buildPositionSelector(),
                      SizedBox(height: 16),
                      if (_selectedElement != null) _buildElementControls(),
                      SizedBox(height: 16),
                      _buildTextCustomization(),
                      SizedBox(height: 16),
                      _buildLogoUpload(),
                      SizedBox(height: 16),
                      _buildColorSelector(),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        
        // Bottom controls
        Container(
          padding: EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 10,
                offset: Offset(0, -5),
              ),
            ],
          ),
          child: Row(
            children: [
              Expanded(
                child: Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.remove),
                      onPressed: () {
                        if (_quantity > 1) setState(() => _quantity--);
                      },
                    ),
                    Container(
                      width: 50,
                      alignment: Alignment.center,
                      child: Text('$_quantity', style: TextStyle(fontSize: 18)),
                    ),
                    IconButton(
                      icon: Icon(Icons.add),
                      onPressed: () => setState(() => _quantity++),
                    ),
                    Spacer(),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('Total', style: TextStyle(color: Colors.grey)),
                        Text(
                          '${totalPrice.toStringAsFixed(2)} €',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                            color: Colors.green,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              SizedBox(width: 12),
              ElevatedButton(
                onPressed: _isSaving ? null : _showEmailDialog,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  minimumSize: Size(120, 50),
                ),
                child: _isSaving
                    ? CircularProgressIndicator(color: Colors.white)
                    : Text('Devis', style: TextStyle(fontSize: 16)),
              ),
            ],
          ),
        ),
      ],
    ),
  );
 }
}