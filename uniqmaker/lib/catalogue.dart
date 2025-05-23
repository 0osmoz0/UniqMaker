import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:uniqmaker/ProfilePage.dart';

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
            builder: (context) => ProductDetailPage(name: name, imagePath: imagePath, price: price),
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
            builder: (context) => ProductDetailPage(name: name, imagePath: imagePath, price: price),
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
                          price: product["price"]!,
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
  final String price;

  const ProductDetailPage({
    Key? key,
    required this.name,
    required this.imagePath,
    required this.price,
  }) : super(key: key);

  @override
  _ProductDetailPageState createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  int _quantity = 1;
  Color? _selectedColor;
  String? _uploadedLogoPath;
  Offset _logoPosition = Offset(150, 200);
  Offset _textPosition = Offset(100, 300);
  bool _isFavorite = false;
  String _customText = '';
  final TextEditingController _textController = TextEditingController();

  final List<Color> _availableColors = [
    Colors.black,
    Colors.white,
    const Color(0xFFE30613),
    const Color(0xFFFFD800),
    const Color(0xFF007A30),
    const Color(0xFF0038A8),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.name, style: const TextStyle(color: Colors.black)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
        actions: [
          IconButton(
            icon: Icon(
              _isFavorite ? Icons.favorite : Icons.favorite_border,
              color: _isFavorite ? Colors.red : Colors.black,
            ),
            onPressed: () => setState(() => _isFavorite = !_isFavorite),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            GestureDetector(
              onTap: () => _showVisualization(context),
              child: Container(
                height: 400,
                width: double.infinity,
                color: Colors.grey[200],
                child: Stack(
                  children: [
                    Center(
                      child: ColorFiltered(
                        colorFilter: _selectedColor != null
                            ? ColorFilter.mode(_selectedColor!, BlendMode.srcATop)
                            : const ColorFilter.mode(Colors.transparent, BlendMode.dst),
                        child: Image.asset(
                          widget.imagePath,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                    if (_uploadedLogoPath != null)
                      Positioned(
                        left: _logoPosition.dx,
                        top: _logoPosition.dy,
                        child: GestureDetector(
                          onPanUpdate: (details) {
                            setState(() {
                              _logoPosition += details.delta;
                            });
                          },
                          child: Image.file(
                            File(_uploadedLogoPath!),
                            width: 100,
                            height: 100,
                            fit: BoxFit.contain,
                          ),
                        ),
                      ),
                    if (_customText.isNotEmpty)
                      Positioned(
                        left: _textPosition.dx,
                        top: _textPosition.dy,
                        child: GestureDetector(
                          onPanUpdate: (details) {
                            setState(() {
                              _textPosition += details.delta;
                            });
                          },
                          child: Text(
                            _customText,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            _buildColorSelector(),
            const SizedBox(height: 16),
            _buildQuantitySelector(),
            const SizedBox(height: 16),
            _buildLogoUpload(),
            const SizedBox(height: 16),
            _buildTextEditor(),
            const SizedBox(height: 16),
            _buildVisualizationButton(),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildColorSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Couleur du t-shirt:", style: TextStyle(fontSize: 18)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 10,
          children: _availableColors.map((color) {
            return GestureDetector(
              onTap: () => setState(() => _selectedColor = color),
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: _selectedColor == color ? Colors.black : Colors.transparent,
                    width: 2,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildQuantitySelector() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text("Quantité:", style: TextStyle(fontSize: 18)),
        const SizedBox(width: 10),
        IconButton(
          icon: const Icon(Icons.remove),
          onPressed: () => setState(() {
            if (_quantity > 1) _quantity--;
          }),
        ),
        Text('$_quantity', style: const TextStyle(fontSize: 18)),
        IconButton(
          icon: const Icon(Icons.add),
          onPressed: () => setState(() => _quantity++),
        ),
      ],
    );
  }

  Widget _buildLogoUpload() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Logo personnalisé:", style: TextStyle(fontSize: 18)),
        const SizedBox(height: 8),
        _uploadedLogoPath != null
            ? Row(
                children: [
                  Image.file(File(_uploadedLogoPath!), width: 80, height: 80),
                  const SizedBox(width: 10),
                  TextButton(
                    onPressed: _uploadLogo,
                    child: const Text("Changer"),
                  ),
                  TextButton(
                    onPressed: () => setState(() => _uploadedLogoPath = null),
                    child: const Text("Supprimer", style: TextStyle(color: Colors.red)),
                  ),
                ],
              )
            : ElevatedButton.icon(
                onPressed: _uploadLogo,
                icon: const Icon(Icons.upload),
                label: const Text("Ajouter un logo"),
              ),
      ],
    );
  }

  Widget _buildTextEditor() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Texte personnalisé:", style: TextStyle(fontSize: 18)),
        const SizedBox(height: 8),
        TextField(
          controller: _textController,
          decoration: InputDecoration(
            border: OutlineInputBorder(),
            hintText: 'Votre texte ici...',
            suffixIcon: IconButton(
              icon: const Icon(Icons.check),
              onPressed: () => setState(() {
                _customText = _textController.text;
              }),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildVisualizationButton() {
    return ElevatedButton(
      onPressed: () => _showVisualization(context),
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 12),
      ),
      child: const Text("Visualiser le produit", style: TextStyle(fontSize: 16)),
    );
  }

  Future<void> _uploadLogo() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        _uploadedLogoPath = image.path;
      });
    }
  }

  void _showVisualization(BuildContext context) {
  Navigator.of(context).push(
    MaterialPageRoute(
      builder: (_) => Scaffold(
        appBar: AppBar(title: const Text('Visualisation')),
        body: StatefulBuilder(
          builder: (context, setModalState) {
            Offset logoPos = _logoPosition;
            Offset textPos = _textPosition;

            return Stack(
              children: [
                Container(
                  color: _selectedColor ?? Colors.grey[200],
                  width: double.infinity,
                  child: Stack(
                    children: [
                      Center(
                        child: ColorFiltered(
                          colorFilter: _selectedColor != null
                              ? ColorFilter.mode(_selectedColor!, BlendMode.srcATop)
                              : const ColorFilter.mode(Colors.transparent, BlendMode.dst),
                          child: Image.asset(widget.imagePath, fit: BoxFit.contain),
                        ),
                      ),

                      if (_uploadedLogoPath != null)
                        Positioned(
                          left: logoPos.dx,
                          top: logoPos.dy,
                          child: GestureDetector(
                            onPanUpdate: (details) {
                              setModalState(() => logoPos += details.delta);
                              setState(() => _logoPosition = logoPos);
                            },
                            child: Image.file(
                              File(_uploadedLogoPath!),
                              width: 100,
                              height: 100,
                            ),
                          ),
                        ),

                      if (_customText.isNotEmpty)
                        Positioned(
                          left: textPos.dx,
                          top: textPos.dy,
                          child: GestureDetector(
                            onPanUpdate: (details) {
                              setModalState(() => textPos += details.delta);
                              setState(() => _textPosition = textPos);
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.7),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                _customText,
                                style: const TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
    ),
  );
}
}
