import 'package:flutter/material.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'dart:math';
import 'dart:convert';
import 'dart:ui' as ui;
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';


class CataloguePage extends StatelessWidget {
  const CataloguePage({super.key});

  final List<String> categories = const [
    "Textile", "Bureau", "Drinkware", "Parapluies", "Sport", "Technologie", "Écologique"
  ];

  final List<ProductCardData> bestSellers = const [
    ProductCardData(
      name: "T-shirt Bio", 
      image: "assets/textile_white.png", 
      price: "12€",
      type: "Textile",
    ),
    ProductCardData(
      name: "Gourde Inox", 
      image: "assets/mug.png", 
      price: "15€",
      type: "Drinkware",
    ),
    ProductCardData(
      name: "Carnet A5", 
      image: "assets/carnet.png", 
      price: "6€",
      type: "Bureau",
    ),
  ];

  final List<SuggestionTileData> suggestions = const [
    SuggestionTileData(
      name: "Parapluie Automatique",
      image: "assets/paraplui.png",
      desc: "Parapluie pliable résistant au vent",
      price: "9€",
      type: "Parapluies",
    ),
    SuggestionTileData(
      name: "Stylo Bambou",
      image: "assets/stylo.png",
      desc: "Stylo écologique à bille",
      price: "2€",
      type: "Bureau",
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text("Catalogue"),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: GestureDetector(
              onTap: () => Navigator.pushNamed(context, '/profile'),
              child: const CircleAvatar(
                backgroundImage: AssetImage("assets/profile.jpg"),
              ),
            ),
          )
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSectionTitle(context, "Catégories"),
          const SizedBox(height: 8),
          _buildCategoriesGrid(context),
          const SizedBox(height: 24),
          _buildSectionTitle(context, "Best Sellers"),
          const SizedBox(height: 12),
          _buildBestSellersList(),
          const SizedBox(height: 24),
          _buildSectionTitle(context, "Suggestions & Nouveautés"),
          const SizedBox(height: 12),
          _buildSuggestionsList(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/client-meeting'),
        child: const Icon(Icons.calendar_today),
        tooltip: 'Prendre RDV',
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String text) {
    return Text(
      text,
      style: Theme.of(context).textTheme.titleLarge?.copyWith(
        fontWeight: FontWeight.bold,
        color: Colors.black87,
      ),
    );
  }

  Widget _buildCategoriesGrid(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: categories.map((category) => _buildCategoryButton(context, category)).toList(),
    );
  }

  Widget _buildCategoryButton(BuildContext context, String category) {
    return ElevatedButton(
      onPressed: () {
        Navigator.pushNamed(
          context, 
          '/category-products',
          arguments: category,
        );
      },
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        backgroundColor: Colors.orange.shade50,
        foregroundColor: Colors.deepOrange,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
      ),
      child: Text(category),
    );
  }

  Widget _buildBestSellersList() {
    return SizedBox(
      height: 180,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: bestSellers.length,
        itemBuilder: (context, index) {
          return CompactProductCard(product: bestSellers[index]);
        },
      ),
    );
  }

  Widget _buildSuggestionsList() {
    return Column(
      children: suggestions.map((suggestion) => SuggestionTile(data: suggestion)).toList(),
    );
  }
}

// Data Models
@immutable
class ProductCardData {
  final String name;
  final String image;
  final String price;
  final String type;

  const ProductCardData({
    required this.name,
    required this.image,
    required this.price,
    required this.type,
  });
}

@immutable
class SuggestionTileData {
  final String name;
  final String image;
  final String desc;
  final String price;
  final String type;

  const SuggestionTileData({
    required this.name,
    required this.image,
    required this.desc,
    required this.price,
    required this.type,
  });
}

// Compact Product Card
class CompactProductCard extends StatelessWidget {
  final ProductCardData product;

  const CompactProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => _navigateToProductDetail(context),
      child: Container(
        width: 140,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: Colors.white,
          boxShadow: [
            BoxShadow(
                color: Colors.grey.shade300, 
                blurRadius: 6, 
                offset: const Offset(0, 3),
            ),
          ],
        ),
        
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildProductImage(),
            _buildProductInfo(),
          ],
        ),
      ),
    );
  }

  Widget _buildProductImage() {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
      child: Image.asset(
        product.image, 
        height: 100, 
        width: 140, 
        fit: BoxFit.cover,
      ),
    );
  }

  Widget _buildProductInfo() {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            product.name, 
            maxLines: 1, 
            overflow: TextOverflow.ellipsis, 
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          Text(
            product.price, 
            style: const TextStyle(
              color: Colors.deepOrange, 
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  void _navigateToProductDetail(BuildContext context) {
    Navigator.pushNamed(
      context,
      '/product-detail',
      arguments: {
        'name': product.name,
        'imagePath': product.image,
        'price': double.parse(product.price.replaceAll('€', '').trim()),
        'productType': product.type,
      },
    );
  }
}

// Suggestion Tile
class SuggestionTile extends StatelessWidget {
  final SuggestionTileData data;

  const SuggestionTile({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => _navigateToProductDetail(context),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.orange.shade50,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            _buildProductImage(),
            const SizedBox(width: 12),
            _buildProductInfo(),
            _buildProductPrice(),
          ],
        ),
      ),
    );
  }

  Widget _buildProductImage() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Image.asset(
        data.image, 
        width: 60, 
        height: 60, 
        fit: BoxFit.cover,
      ),
    );
  }

  Widget _buildProductInfo() {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            data.name, 
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          Text(
            data.desc, 
            style: const TextStyle(
              fontSize: 13, 
              color: Colors.black54,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductPrice() {
    return Text(
      data.price, 
      style: const TextStyle(
        color: Colors.deepOrange, 
        fontWeight: FontWeight.bold,
      ),
    );
  }

  void _navigateToProductDetail(BuildContext context) {
    Navigator.pushNamed(
      context,
      '/product-detail',
      arguments: {
        'name': data.name,
        'imagePath': data.image,
        'price': double.parse(data.price.replaceAll('€', '').trim()),
        'productType': data.type,
      },
    );
  }
}

// Category Products Page
class CategoryProductsPage extends StatelessWidget {
  final String categoryName;
  
  const CategoryProductsPage({super.key, required this.categoryName});

  final Map<String, List<ProductCardData>> _categoryProducts = const {
    "Textile": [
      ProductCardData(
        name: "T-shirt Bio", 
        image: "assets/textile_white.png", 
        price: "12€",
        type: "Textile",
      ),
      ProductCardData(
        name: "Sweat Uni", 
        image: "assets/textile_white.png", 
        price: "25€",
        type: "Textile",
      ),
    ],
    "Bureau": [
      ProductCardData(
        name: "Carnet A5", 
        image: "assets/carnet.png", 
        price: "6€",
        type: "Bureau",
      ),
      ProductCardData(
        name: "Stylo Bambou", 
        image: "assets/stylo.png", 
        price: "2€",
        type: "Bureau",
      ),
    ],
    "Drinkware": [
      ProductCardData(
        name: "Gourde Inox", 
        image: "assets/mug.png", 
        price: "15€",
        type: "Drinkware",
      ),
      ProductCardData(
        name: "Mug Thermo", 
        image: "assets/mug.png", 
        price: "10€",
        type: "Drinkware",
      ),
    ],
    "Parapluies": [
      ProductCardData(
        name: "Parapluie Auto", 
        image: "assets/paraplui.png", 
        price: "9€",
        type: "Parapluies",
      ),
    ],
    "Sport": [
      ProductCardData(
        name: "Bouteille Sport", 
        image: "assets/mug.png", 
        price: "11€",
        type: "Sport",
      ),
    ],
    "Technologie": [
      ProductCardData(
        name: "Clé USB 16Go", 
        image: "assets/stylo.png", 
        price: "8€",
        type: "Technologie",
      ),
    ],
    "Écologique": [
      ProductCardData(
        name: "Stylo Bambou", 
        image: "assets/stylo.png", 
        price: "2€",
        type: "Écologique",
      ),
    ],
  };

  @override
  Widget build(BuildContext context) {
    final products = _categoryProducts[categoryName] ?? [];

    return Scaffold(
      appBar: AppBar(title: Text(categoryName)),
      body: _buildProductGrid(products),
    );
  }

  Widget _buildProductGrid(List<ProductCardData> products) {
    if (products.isEmpty) {
      return const Center(child: Text("Aucun produit disponible"));
    }

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: products.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 3 / 4,
      ),
      itemBuilder: (context, index) {
        return ProductCard(product: products[index]);
      },
    );
  }
}

// Product Card
class ProductCard extends StatelessWidget {
  final ProductCardData product;

  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => _navigateToProductDetail(context),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.shade300, 
              blurRadius: 5, 
              offset: const Offset(0, 3)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildProductImage(),
            _buildProductInfo(),
          ],
        ),
      ),
    );
  }

  Widget _buildProductImage() {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
      child: Image.asset(
        product.image, 
        height: 120, 
        width: double.infinity, 
        fit: BoxFit.cover,
      ),
    );
  }

  Widget _buildProductInfo() {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            product.name, 
            style: const TextStyle(fontWeight: FontWeight.bold), 
            maxLines: 1, 
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            product.price, 
            style: const TextStyle(
              color: Colors.deepOrange, 
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  void _navigateToProductDetail(BuildContext context) {
    Navigator.pushNamed(
      context,
      '/product-detail',
      arguments: {
        'name': product.name,
        'imagePath': product.image,
        'price': double.parse(product.price.replaceAll('€', '').trim()),
        'productType': product.type,
      },
    );
  }
}

// Product Detail Page
class ProductDetailPage extends StatefulWidget {
  final String name;
  final String imagePath;
  final double price;
  final String productType;

  const ProductDetailPage({
    super.key,
    required this.name,
    required this.imagePath,
    required this.price,
    required this.productType,
  });

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  // Customization state
  int _quantity = 1;
  Color _productColor = Colors.white;
  File? _customLogo;
  String _customText = '';
  bool _isFavorite = false;
  bool _isSaving = false;
  
  // Position and transformation state
  Offset _logoPosition = Offset.zero;
  Offset _textPosition = Offset.zero;
  double _logoScale = 1.0;
  double _textScale = 1.0;
  double _logoRotation = 0;
  double _textRotation = 0;
  
  // Selection and style state
  String? _selectedElement;
  Color _textColor = Colors.black;
  String _selectedFont = 'Roboto';
  String _selectedPosition = 'Poche poitrine';
  
  // Client info controllers
  final TextEditingController _textController = TextEditingController();
  final TextEditingController _clientNameController = TextEditingController();
  final TextEditingController _clientEmailController = TextEditingController();
  final TextEditingController _clientPhoneController = TextEditingController();
  final TextEditingController _clientAddressController = TextEditingController();
  
  // Preview key
  final GlobalKey _productPreviewKey = GlobalKey();
  
  // Available options
  final List<Color> _availableColors = const [
    Colors.black,
    Colors.white,
    Color(0xFFE30613), // Red
    Color(0xFFFFD800), // Yellow
    Color(0xFF007A30), // Green
    Color(0xFF0038A8), // Blue
    Color(0xFF6D3B8E), // Purple
    Color(0xFFFF6B00), // Orange
  ];

  final List<String> _availableFonts = const [
    'Roboto',
    'Arial',
    'Times New Roman',
    'Courier New',
    'Comic Sans MS'
  ];

  final List<String> _availablePositions = const [
    'Poche poitrine',
    'Centré poitrine',
    'Dos haut',
    'Dos bas',
    'Manche gauche',
    'Manche droite',
    'Style bas'
  ];

  final List<String> _availablePlacements = const [
    'Avant',
    'Dos',
    'Manche gauche',
    'Manche droite'
  ];

  final Map<String, Rect> _placementZones = const {
    'Avant': Rect.fromLTWH(0.25, 0.15, 0.5, 0.3),
    'Dos': Rect.fromLTWH(0.25, 0.15, 0.5, 0.3),
    'Manche gauche': Rect.fromLTWH(0.05, 0.25, 0.2, 0.15),
    'Manche droite': Rect.fromLTWH(0.75, 0.25, 0.2, 0.15),
  };

  String _selectedPlacement = 'Avant';
  final Size _productSize = const Size(300, 400);
  bool _isDisposed = false;

  @override
  void initState() {
    super.initState();
    _initializePositions();
    _adaptPositionsForProductType();
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

  void _initializePositions() {
    _logoPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.4);
    _textPosition = Offset(_productSize.width * 0.5, _productSize.height * 0.6);
  }

  void _adaptPositionsForProductType() {
    if (_isDisposed) return;
    
    setState(() {
      switch (widget.productType.toLowerCase()) {
        case 'casquette':
          // Use the class-level _availablePlacements variable
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
          if (_isSaving) const Padding(
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
                  _buildProductPreviewSection(),
                  _buildCustomizationControls(),
                ],
              ),
            ),
          ),
          _buildBottomControls(totalPrice),
        ],
      ),
    );
  }

  Widget _buildProductPreviewSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.grey[50],
      child: Center(
        child: GestureDetector(
          onScaleStart: _handleScaleStart,
          onScaleUpdate: _handleScaleUpdate,
          onTapUp: _handleTapUp,
          child: _buildProductPreview(),
        ),
      ),
    );
  }

  Widget _buildProductPreview() {
    return RepaintBoundary(
      key: _productPreviewKey,
      child: Stack(
        children: [
          // Base product with selected color
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

          // Placement zones (shown only in edit mode)
          if (_selectedElement != null)
            Positioned.fromRect(
              rect: Rect.fromLTWH(
                _productSize.width * _placementZones[_selectedPlacement]!.left,
                _productSize.height * _placementZones[_selectedPlacement]!.top,
                _productSize.width * _placementZones[_selectedPlacement]!.width,
                _productSize.height * _placementZones[_selectedPlacement]!.height,
              ),
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: Colors.blue.withOpacity(0.5),
                    width: 2,
                    strokeAlign: BorderSide.strokeAlignOutside,
                  ),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Center(
                  child: Text(
                    _selectedPlacement,
                    style: TextStyle(
                      color: Colors.blue,
                      fontWeight: FontWeight.bold,
                      backgroundColor: Colors.white.withOpacity(0.7),
                    ),
                  ),
                ),
              ),
            ),

          // Sleeve representation
          if (_selectedPlacement.startsWith('Manche'))
            CustomPaint(
              size: Size(_productSize.width, _productSize.height),
              painter: _SleevePainter(
                isLeft: _selectedPlacement == 'Manche gauche',
                isHighlighted: true,
              ),
            ),

          // Custom logo
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
                    constraints: BoxConstraints(
                      maxWidth: _productSize.width * _placementZones[_selectedPlacement]!.width * 0.8,
                      maxHeight: _productSize.height * _placementZones[_selectedPlacement]!.height * 0.8,
                    ),
                    decoration: BoxDecoration(
                      border: _selectedElement == 'logo'
                          ? Border.all(color: Colors.blue, width: 2)
                          : null,
                    ),
                    child: Image.file(
                      _customLogo!,
                      fit: BoxFit.contain,
                      errorBuilder: (ctx, error, stack) => const Icon(Icons.error),
                    ),
                  ),
                ),
              ),
            ),

          // Custom text
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
                    constraints: BoxConstraints(
                      maxWidth: _productSize.width * _placementZones[_selectedPlacement]!.width,
                    ),
                    padding: const EdgeInsets.all(8),
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
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildCustomizationControls() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Personnalisez votre produit', 
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 16),
          _buildPositionSelector(),
          const SizedBox(height: 16),
          if (_selectedElement != null) _buildElementControls(),
          const SizedBox(height: 16),
          _buildTextCustomization(),
          const SizedBox(height: 16),
          _buildLogoUpload(),
          const SizedBox(height: 16),
          _buildColorSelector(),
        ],
      ),
    );
  }

  Widget _buildPositionSelector() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Placement du marquage',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _selectedPlacement,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
              isExpanded: true,
              items: _availablePlacements.map((placement) {
                return DropdownMenuItem(
                  value: placement,
                  child: Text(placement),
                );
              }).toList(),
              onChanged: (value) {
                if (!_isDisposed && value != null) {
                  setState(() {
                    _selectedPlacement = value;
                    _updatePositionsBasedOnPlacement();
                  });
                }
              },
            ),
            const SizedBox(height: 12),
            const Text(
              'Position exacte',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _selectedPosition,
              decoration: const InputDecoration(
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
    if (_selectedElement == null) return const SizedBox.shrink();

    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Modifier ${_selectedElement == 'logo' ? 'le logo' : 'le texte'}',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildControlButton(
                  icon: Icons.rotate_left,
                  label: 'Rotation -',
                  onPressed: () => _adjustElementRotation(-0.1),
                ),
                _buildControlButton(
                  icon: Icons.rotate_right,
                  label: 'Rotation +',
                  onPressed: () => _adjustElementRotation(0.1),
                ),
                _buildControlButton(
                  icon: Icons.zoom_in,
                  label: 'Agrandir',
                  onPressed: () => _adjustElementScale(1.1),
                ),
                _buildControlButton(
                  icon: Icons.zoom_out,
                  label: 'Réduire',
                  onPressed: () => _adjustElementScale(0.9),
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

  Widget _buildControlButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
  }) {
    return Column(
      children: [
        IconButton(
          icon: Icon(icon),
          onPressed: onPressed,
          style: IconButton.styleFrom(
            backgroundColor: Colors.blue[50],
            padding: const EdgeInsets.all(12),
          ),
        ),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }

  Widget _buildTextCustomization() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Personnalisation du texte',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _textController,
              decoration: InputDecoration(
                labelText: 'Texte à imprimer',
                border: const OutlineInputBorder(),
                suffixIcon: _customText.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: _clearCustomText,
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
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: _selectedFont,
              decoration: const InputDecoration(
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
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Logo personnalisé',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: _uploadLogo,
              icon: const Icon(Icons.upload),
              label: Text(_customLogo != null ? 'Changer le logo' : 'Ajouter un logo'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
                backgroundColor: Colors.blue[50],
                foregroundColor: Colors.blue,
              ),
            ),
            if (_customLogo != null) ...[
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: _removeLogo,
                child: const Text('Supprimer le logo'),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 48),
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
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Couleur du produit',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 12),
            const Text('Couleurs disponibles:', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 8),
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
                        ? Icon(
                            Icons.check, 
                            color: color.computeLuminance() > 0.5 ? Colors.black : Colors.white,
                          )
                        : null,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: () => _showColorPicker(true),
              icon: const Icon(Icons.color_lens),
              label: const Text('Autre couleur'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomControls(double totalPrice) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Row(
              children: [
                _buildQuantityControls(),
                const Spacer(),
                _buildPriceDisplay(totalPrice),
              ],
            ),
          ),
          const SizedBox(width: 12),
          _buildQuoteButton(),
        ],
      ),
    );
  }

  Widget _buildQuantityControls() {
    return Row(
      children: [
        IconButton(
          icon: const Icon(Icons.remove),
          onPressed: () {
            if (_quantity > 1) setState(() => _quantity--);
          },
        ),
        Container(
          width: 50,
          alignment: Alignment.center,
          child: Text('$_quantity', style: const TextStyle(fontSize: 18)),
        ),
        IconButton(
          icon: const Icon(Icons.add),
          onPressed: () => setState(() => _quantity++),
        ),
      ],
    );
  }

  Widget _buildPriceDisplay(double totalPrice) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        const Text('Total', style: TextStyle(color: Colors.grey)),
        Text(
          '${totalPrice.toStringAsFixed(2)} €',
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 20,
            color: Colors.green,
          ),
        ),
      ],
    );
  }

  Widget _buildQuoteButton() {
    return ElevatedButton(
      onPressed: _isSaving ? null : _showEmailDialog,
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        minimumSize: const Size(120, 50),
      ),
      child: _isSaving
          ? const CircularProgressIndicator(color: Colors.white)
          : const Text('Devis', style: TextStyle(fontSize: 16)),
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
            child: const Text('Valider'),
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
            title: const Text('Demander un devis'),
            content: SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  maxWidth: MediaQuery.of(context).size.width * 0.9,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('Informations client', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 10),
                    _buildClientInfoForm(),
                    const SizedBox(height: 20),
                    const Text('Récapitulatif du devis', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 10),
                    _buildQuoteSummary(),
                  ],
                ),
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Annuler'),
              ),
              ElevatedButton(
                onPressed: _isSaving ? null : () => _sendQuote(context),
                child: _isSaving
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Envoyer la demande'),
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

  Widget _buildClientInfoForm() {
    return Column(
      children: [
        TextField(
          controller: _clientNameController,
          decoration: const InputDecoration(
            labelText: 'Nom complet*',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _clientEmailController,
          decoration: const InputDecoration(
            labelText: 'Email*',
            border: OutlineInputBorder(),
            hintText: 'exemple@domaine.com',
          ),
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _clientPhoneController,
          decoration: const InputDecoration(
            labelText: 'Téléphone*',
            border: OutlineInputBorder(),
            hintText: '06 12 34 56 78',
          ),
          keyboardType: TextInputType.phone,
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _clientAddressController,
          decoration: const InputDecoration(
            labelText: 'Adresse',
            border: OutlineInputBorder(),
            hintText: 'Adresse de livraison',
          ),
          maxLines: 2,
        ),
      ],
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
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(5),
              color: Colors.blue[50],
              child: Row(
                children: [
                  const Icon(Icons.receipt, color: Colors.blue),
                  const SizedBox(width: 5),
                  Text(
                    'DEVIS N°$reference',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blue),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
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
            const SizedBox(height: 16),
            
            // Product details
            const Text('Détails du produit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Table(
              columnWidths: const {0: FlexColumnWidth(2), 1: FlexColumnWidth(3)},
              children: [
                _buildTableRow('Produit', widget.name),
                _buildTableRow('Type', widget.productType),
                _buildTableRow('Quantité', '$_quantity'),
                _buildTableRow('Prix unitaire', '${widget.price.toStringAsFixed(2)} €'),
              ],
            ),
            const Divider(),
            
            // Customization
            const Text('Personnalisation', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Table(
              columnWidths: const {0: FlexColumnWidth(2), 1: FlexColumnWidth(3)},
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
            const Divider(),
            
            // Pricing
            const Text('Total', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Table(
              columnWidths: const {0: FlexColumnWidth(2), 1: FlexColumnWidth(3)},
              children: [
                _buildTableRow('Sous-total', '${totalPrice.toStringAsFixed(2)} €'),
                _buildTableRow('TVA (20%)', '${vat.toStringAsFixed(2)} €'),
                _buildTableRow('Total TTC', '${totalWithVat.toStringAsFixed(2)} €',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
              ],
            ),
            const SizedBox(height: 10),
            const Text('*TVA incluse', style: TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 10),
            const Text('Valable 30 jours', style: TextStyle(fontStyle: FontStyle.italic)),
          ],
        ),
      ),
    );
  }

  TableRow _buildTableRow(String label, String value, {TextStyle? style}) {
    return TableRow(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Text('$label:', style: const TextStyle(fontWeight: FontWeight.w500)),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Text(value, style: style),
        ),
      ],
    );
  }

  TableRow _buildTableRowWithColor(String label, Color color) {
    return TableRow(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Text('$label:', style: const TextStyle(fontWeight: FontWeight.w500)),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
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
              const SizedBox(width: 8),
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
        const SnackBar(content: Text('Veuillez remplir tous les champs obligatoires (*)')),
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
            const SnackBar(content: Text('Demande de devis envoyée avec succès')),
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
  
  // Créer les paramètres pour la page de suivi
  final trackingParams = {
    'id': reference,
    'amount': totalWithVat.toStringAsFixed(2),
    'product': widget.name,
    'image': widget.imagePath, // Ajout du chemin de l'image
    'quantity': _quantity.toString(),
    'type': widget.productType,
    'color': _productColor.value.toRadixString(16).padLeft(8, '0').substring(2), // Format hex sans alpha
    'textColor': _textColor.value.toRadixString(16).padLeft(8, '0').substring(2),
    if (_customText.isNotEmpty) 'text': _customText,
    if (_selectedFont != 'Roboto') 'font': _selectedFont,
  };

  // Encoder les paramètres pour l'URL
  final queryString = Uri(queryParameters: trackingParams).query;
  final trackingUrl = 'https://0osmoz0.github.io/UniqMaker/?$queryString';

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
Placement: $_selectedPlacement
Position exacte: $_selectedPosition
Couleur: ${_getColorName(_productColor)}
${_customText.isNotEmpty ? 'Texte: "$_customText"\nPolice: $_selectedFont\nCouleur texte: ${_getColorName(_textColor)}' : ''}
${_customLogo != null ? 'Logo personnalisé: Oui' : ''}

SUIVI DE COMMANDE
-----------------
Vous pouvez suivre l'avancement de votre commande et effectuer le paiement à tout moment en cliquant sur le lien suivant:
$trackingUrl

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
          title: const Text('Options d\'envoi'),
          content: SingleChildScrollView(
            child: Column(
              children: [
                const Text('Impossible d\'ouvrir l\'application email. Vous pouvez copier le devis ci-dessous:'),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: SelectableText(
                    'Sujet: $subject\n\n$body',
                    style: const TextStyle(fontFamily: 'Courier'),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              child: const Text('Copier'),
              onPressed: () {
                Clipboard.setData(ClipboardData(text: 'Sujet: $subject\n\n$body'));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Devis copié dans le presse-papier')),
                );
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Fermer'),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        );
      },
    );
  }

  void _updatePositionsBasedOnPlacement() {
    if (_isDisposed) return;
    
    setState(() {
      final zone = _placementZones[_selectedPlacement]!;
      
      // Position elements at the center of their zone
      _logoPosition = Offset(
        _productSize.width * (zone.left + zone.width / 2),
        _productSize.height * (zone.top + zone.height / 2),
      );
      
      _textPosition = Offset(
        _productSize.width * (zone.left + zone.width / 2),
        _productSize.height * (zone.top + zone.height / 2),
      );
      
      // Adjust position based on placement type
      switch (_selectedPlacement) {
        case 'Avant':
          _selectedPosition = 'Poche poitrine';
          break;
        case 'Dos':
          _selectedPosition = 'Dos haut';
          break;
        case 'Manche gauche':
          _selectedPosition = 'Manche gauche';
          break;
        case 'Manche droite':
          _selectedPosition = 'Manche droite';
          break;
      }
      
      // Reset transformations
      _logoScale = 1.0;
      _textScale = 1.0;
      _logoRotation = 0;
      _textRotation = 0;
    });
  }

  void _adjustElementRotation(double delta) {
    if (_isDisposed) return;
    setState(() {
      if (_selectedElement == 'logo') {
        _logoRotation += delta;
      } else if (_selectedElement == 'text') {
        _textRotation += delta;
      }
    });
  }

  void _adjustElementScale(double factor) {
    if (_isDisposed) return;
    setState(() {
      if (_selectedElement == 'logo') {
        _logoScale *= factor;
      } else if (_selectedElement == 'text') {
        _textScale *= factor;
      }
    });
  }

  void _clearCustomText() {
    if (_isDisposed) return;
    setState(() {
      _customText = '';
      _textController.clear();
    });
  }

  void _removeLogo() {
    if (_isDisposed) return;
    setState(() {
      _customLogo = null;
      _selectedElement = null;
    });
  }
}

// Sleeve Painter for custom sleeves visualization
class _SleevePainter extends CustomPainter {
  final bool isLeft;
  final bool isHighlighted;

  const _SleevePainter({required this.isLeft, required this.isHighlighted});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = isHighlighted ? Colors.orange.withOpacity(0.2) : Colors.transparent
      ..style = PaintingStyle.fill;

    final borderPaint = Paint()
      ..color = Colors.orange.withOpacity(0.8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    final path = Path();
    if (isLeft) {
      path.moveTo(size.width * 0.2, size.height * 0.2);
      path.quadraticBezierTo(
        size.width * 0.05, size.height * 0.3,
        size.width * 0.1, size.height * 0.4);
      path.lineTo(size.width * 0.25, size.height * 0.35);
      path.quadraticBezierTo(
        size.width * 0.2, size.height * 0.25,
        size.width * 0.2, size.height * 0.2);
    } else {
      path.moveTo(size.width * 0.8, size.height * 0.2);
      path.quadraticBezierTo(
        size.width * 0.95, size.height * 0.3,
        size.width * 0.9, size.height * 0.4);
      path.lineTo(size.width * 0.75, size.height * 0.35);
      path.quadraticBezierTo(
        size.width * 0.8, size.height * 0.25,
        size.width * 0.8, size.height * 0.2);
    }
    path.close();

    canvas.drawPath(path, paint);
    canvas.drawPath(path, borderPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}