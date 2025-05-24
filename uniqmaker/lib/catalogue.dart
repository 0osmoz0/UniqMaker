import 'package:flutter/material.dart';
import 'dart:io';
import 'dart:math';
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

  const ProductCard({super.key, required this.name, required this.imagePath, required this.price});

  @override
  Widget build(BuildContext context) {
    return Container(
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
  _ProductDetailPageState createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  // Personalization variables
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

  // Email form variables
  final _clientEmailController = TextEditingController();
  final _clientNameController = TextEditingController();

  // Available options
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
    setState(() {
      switch (widget.productType.toLowerCase()) {
        case 'casquette':
          _availablePositions = ['Avant', 'Côté droit', 'Côté gauche', 'Arrière'];
          _selectedPosition = 'Avant';
          break;
        case 'sweat':
          _availablePositions.add('Poche kangourou');
          break;
      }
      // Add this missing method to your _ProductDetailPageState class
    void _applySmartPositioning() {
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
      _applySmartPositioning();
    });
  }

  @override
  void dispose() {
    _textController.dispose();
    _clientEmailController.dispose();
    _clientNameController.dispose();
    super.dispose();
  }

  void _handleScaleStart(ScaleStartDetails details) {
    // Add logic to handle the start of a scaling gesture
  }

  void _handleScaleUpdate(ScaleUpdateDetails details) {
    // Add logic to handle updates during a scaling gesture
  }

  void _handleTapUp(TapUpDetails details) {
    // Add logic to handle a tap gesture
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.name),
        actions: [
          IconButton(
            icon: Icon(_isFavorite ? Icons.favorite : Icons.favorite_border),
            color: _isFavorite ? Colors.red : null,
            onPressed: () => setState(() => _isFavorite = !_isFavorite),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
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
                        onTap: () => setState(() => _selectedElement = 'logo'),
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
                        onTap: () => setState(() => _selectedElement = 'text'),
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
          ),
          Container(
            height: 300,
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
            child: SingleChildScrollView(
              child: Column(
                children: [
                  _buildPositionSelector(),
                  const SizedBox(height: 12),
                  if (_selectedElement != null) _buildElementControls(),
                  const SizedBox(height: 12),
                  _buildTextCustomization(),
                  const SizedBox(height: 12),
                  _buildLogoUpload(),
                  const SizedBox(height: 12),
                  _buildColorSelector(),
                  const SizedBox(height: 12),
                  _buildBottomControls(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // [Previous methods remain unchanged until _buildBottomControls]

  Widget _buildPositionSelector() {
    return DropdownButton<String>(
      value: _selectedPosition,
      items: _availablePositions.map((position) {
        return DropdownMenuItem(
          value: position,
          child: Text(position),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _selectedPosition = value!;
        });
      },
    );
  }

  Widget _buildElementControls() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        IconButton(
          icon: const Icon(Icons.rotate_left),
          onPressed: () {
            setState(() {
              if (_selectedElement == 'logo') {
                _logoRotation -= 0.1;
              } else if (_selectedElement == 'text') {
                _textRotation -= 0.1;
              }
            });
          },
        ),
        IconButton(
          icon: const Icon(Icons.rotate_right),
          onPressed: () {
            setState(() {
              if (_selectedElement == 'logo') {
                _logoRotation += 0.1;
              } else if (_selectedElement == 'text') {
                _textRotation += 0.1;
              }
            });
          },
        ),
      ],
    );
  }

  Widget _buildTextCustomization() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _textController,
          decoration: const InputDecoration(labelText: 'Texte personnalisé'),
          onChanged: (value) {
            setState(() {
              _customText = value;
            });
          },
        ),
        DropdownButton<String>(
          value: _selectedFont,
          items: _availableFonts.map((font) {
            return DropdownMenuItem(
              value: font,
              child: Text(font),
            );
          }).toList(),
          onChanged: (value) {
            setState(() {
              _selectedFont = value!;
            });
          },
        ),
      ],
    );
  }

  Widget _buildLogoUpload() {
    return ElevatedButton(
      onPressed: _uploadLogo,
      child: const Text('Télécharger un logo'),
    );
  }

  Widget _buildColorSelector() {
    return Row(
      children: _availableColors.map((color) {
        return GestureDetector(
          onTap: () {
            setState(() {
              _productColor = color;
            });
          },
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 4),
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              border: Border.all(
                color: _productColor == color ? Colors.black : Colors.transparent,
                width: 2,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildBottomControls() {
    final totalPrice = widget.price * _quantity;

    return Column(
      children: [
        Row(
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
                  Text('$_quantity'),
                  IconButton(
                    icon: Icon(Icons.add),
                    onPressed: () => setState(() => _quantity++),
                  ),
                  Spacer(),
                  Text(
                    'Total: ${totalPrice.toStringAsFixed(2)} €',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ],
              ),
            ),
            SizedBox(width: 8),
            ElevatedButton(
              onPressed: _saveCustomization,
              child: Text('Valider'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
        SizedBox(height: 8),
        ElevatedButton.icon(
          onPressed: _showEmailDialog,
          icon: Icon(Icons.email),
          label: Text('Envoyer un devis'),
          style: ElevatedButton.styleFrom(
            minimumSize: Size(double.infinity, 48),
            backgroundColor: Colors.green,
            foregroundColor: Colors.white,
          ),
        ),
      ],
    );
  }

  void _showEmailDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Envoyer le devis'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _clientNameController,
                decoration: InputDecoration(
                  labelText: 'Nom du client',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 10),
              TextField(
                controller: _clientEmailController,
                decoration: InputDecoration(
                  labelText: 'Email du client (optionnel)',
                  border: OutlineInputBorder(),
                  hintText: 'exemple@domaine.com',
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              SizedBox(height: 20),
              Text('Récapitulatif du devis:', style: TextStyle(fontWeight: FontWeight.bold)),
              SizedBox(height: 10),
              _buildQuoteSummary(),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: _sendQuote,
            child: Text('Envoyer'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _sendQuote() async {
    final email = _clientEmailController.text;
    final subject = 'Devis pour ${widget.name}';
    final body = _generateEmailBody();

    // Try to open default mail app first
    final mailtoUri = Uri(
      scheme: 'mailto',
      path: email,
      queryParameters: {
        'subject': subject,
        'body': body,
      },
    );

    try {
      if (await canLaunchUrl(mailtoUri)) {
        await launchUrl(mailtoUri);
      } else {
        // Fallback option - show dialog with copy option
        await _showFallbackOptions(context, subject, body);
      }
    } catch (e) {
      await _showFallbackOptions(context, subject, body);
    }
  }

  Future<void> _showFallbackOptions(BuildContext context, String subject, String body) async {
    return showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Options d\'envoi'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('Aucune application mail n\'est configurée.'),
                SizedBox(height: 20),
                Text('Vous pouvez :'),
                SizedBox(height: 10),
                Text('1. Copier le devis pour le coller dans votre application mail'),
                SizedBox(height: 10),
                Text('2. Configurer une application mail dans les paramètres de votre appareil'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Copier le devis'),
              onPressed: () {
                Clipboard.setData(ClipboardData(
                  text: 'Sujet: $subject\n\n$body'
                ));
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Devis copié dans le presse-papier')),
                );
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('OK'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  String _generateEmailBody() {
    return '''
DEVIS PERSONNALISÉ

Client: ${_clientNameController.text.isNotEmpty ? _clientNameController.text : 'Non spécifié'}

DÉTAILS DU PRODUIT:
- Produit: ${widget.name}
- Type: ${widget.productType}
- Quantité: $_quantity
- Prix unitaire: ${widget.price.toStringAsFixed(2)} €
- Prix total: ${(widget.price * _quantity).toStringAsFixed(2)} €

PERSONNALISATION:
- Couleur: ${_getColorName(_productColor)}
${_customText.isNotEmpty ? '- Texte: $_customText\n' : ''}
${_customText.isNotEmpty ? '- Police: $_selectedFont\n' : ''}
${_customText.isNotEmpty ? '- Couleur texte: ${_getColorName(_textColor)}\n' : ''}
- Logo: ${_customLogo != null ? 'Oui' : 'Non'}
- Position: $_selectedPosition

Valable 30 jours à compter du ${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}

[Vos coordonnées]
[Votre logo/signature]
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
    return 'Couleur personnalisée';
  }

  Widget _buildQuoteSummary() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildQuoteItem('Produit', widget.name),
        _buildQuoteItem('Type', widget.productType),
        _buildQuoteItem('Quantité', '$_quantity'),
        _buildQuoteItem('Prix unitaire', '${widget.price.toStringAsFixed(2)} €'),
        _buildQuoteItem('Prix total', '${(widget.price * _quantity).toStringAsFixed(2)} €'),
        Divider(),
        _buildQuoteItem('Couleur', _getColorName(_productColor)),
        if (_customText.isNotEmpty) _buildQuoteItem('Texte', _customText),
        if (_customText.isNotEmpty) _buildQuoteItem('Police', _selectedFont),
        if (_customText.isNotEmpty) _buildQuoteItem('Couleur texte', _getColorName(_textColor)),
        _buildQuoteItem('Logo', _customLogo != null ? 'Oui' : 'Non'),
        _buildQuoteItem('Position', _selectedPosition),
      ],
    );
  }

  Widget _buildQuoteItem(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('$label:', style: TextStyle(fontWeight: FontWeight.bold)),
          Text(value),
        ],
      ),
    );
  }

  Future<void> _uploadLogo() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _customLogo = File(pickedFile.path);
        _selectedElement = 'logo';
      });
    }
  }

  void _saveCustomization() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Personnalisation enregistrée'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _showColorPicker([bool isProductColor = true]) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isProductColor ? 'Couleur du produit' : 'Couleur du texte'),
        content: SingleChildScrollView(
          child: ColorPicker(
            pickerColor: isProductColor ? _productColor : _textColor,
            onColorChanged: (color) {
              setState(() {
                if (isProductColor) {
                  _productColor = color;
                } else {
                  _textColor = color;
                }
              });
            },
            showLabel: true,
            pickerAreaHeightPercent: 0.8,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }
}