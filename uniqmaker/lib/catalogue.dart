import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'dart:math';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:shimmer/shimmer.dart';
import 'package:confetti/confetti.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/animation.dart';
import 'dart:ui' as ui;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

// 1. Thème personnalisé amélioré avec Material 3
final ThemeData appTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF6C63FF),
    secondary: const Color(0xFFFF6584),
    brightness: Brightness.light,
  ),
  cardTheme: const CardThemeData(
    elevation: 1,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(16)),
    ),
    clipBehavior: Clip.antiAlias, // Corrected parameter
    color: Colors.white, // Replaced surfaceTintColor with color
  ),
  typography: Typography.material2021(), // Corrected textTheme to typography
  elevatedButtonTheme: ElevatedButtonThemeData( // Corrected filledButtonTheme to elevatedButtonTheme
    style: ElevatedButton.styleFrom(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      padding: EdgeInsets.symmetric(vertical: 16, horizontal: 24), // Removed unnecessary const
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide(color: Colors.grey[300]!),
    ),
    filled: true,
    fillColor: Colors.white,
  ),
);

const List<String> categories = [
  "Textile", "Bureau", "Drinkware", "Parapluies", "Sport", "Technologie", "Écologique"
];

// 2. Modèles de données améliorés
@immutable
class ProductCardData {
  final String name;
  final String image;
  final String price;
  final String type;
  final bool isFavorite;

  const ProductCardData({
    required this.name,
    required this.image,
    required this.price,
    required this.type,
    this.isFavorite = false,
  });

  ProductCardData copyWith({
    String? name,
    String? image,
    String? price,
    String? type,
    bool? isFavorite,
  }) {
    return ProductCardData(
      name: name ?? this.name,
      image: image ?? this.image,
      price: price ?? this.price,
      type: type ?? this.type,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}

@immutable
class SuggestionTileData {
  final String name;
  final String image;
  final String desc;
  final String price;
  final String type;
  final double rating;

  const SuggestionTileData({
    required this.name,
    required this.image,
    required this.desc,
    required this.price,
    required this.type,
    this.rating = 4.5,
  });
}

class MultiProductQuote {
  final List<ProductQuoteItem> items = [];
  File? sharedLogo;
  String? sharedText;
  Color sharedTextColor = Colors.black;
  String sharedFont = 'Roboto';

  double get totalPrice {
    return items.fold(0.0, (sum, item) => sum + item.totalPrice);
  }

  void addItem(ProductQuoteItem item) {
    items.add(item);
  }
}

class ProductQuoteItem {
  final String productName;
  final String productType;
  final Color productColor;
  final String imagePath;
  final double basePrice;
  final Map<String, int> sizeQuantities;
  final Map<String, double> sizePrices;
  final String? customText;
  final Color? textColor;
  final String? font;
  final File? customLogo;
  final String position;
  final bool useSharedLogo;
  final bool useSharedText;

  ProductQuoteItem({
    required this.productName,
    required this.productType,
    required this.productColor,
    required this.imagePath,
    required this.basePrice,
    required this.sizeQuantities,
    required this.sizePrices,
    this.customText,
    this.textColor,
    this.font,
    this.customLogo,
    required this.position,
    this.useSharedLogo = false,
    this.useSharedText = false,
  });

  ProductQuoteItem copyWith({
    String? productName,
    String? productType,
    Color? productColor,
    String? imagePath,
    double? basePrice,
    Map<String, int>? sizeQuantities,
    Map<String, double>? sizePrices,
    String? customText,
    Color? textColor,
    String? font,
    File? customLogo,
    String? position,
    bool? useSharedLogo,
    bool? useSharedText,
  }) {
    return ProductQuoteItem(
      productName: productName ?? this.productName,
      productType: productType ?? this.productType,
      productColor: productColor ?? this.productColor,
      imagePath: imagePath ?? this.imagePath,
      basePrice: basePrice ?? this.basePrice,
      sizeQuantities: sizeQuantities ?? Map.from(this.sizeQuantities),
      sizePrices: sizePrices ?? Map.from(this.sizePrices),
      customText: customText ?? this.customText,
      textColor: textColor ?? this.textColor,
      font: font ?? this.font,
      customLogo: customLogo ?? this.customLogo,
      position: position ?? this.position,
      useSharedLogo: useSharedLogo ?? this.useSharedLogo,
      useSharedText: useSharedText ?? this.useSharedText,
    );
  }

  double get totalPrice {
    if (sizeQuantities.values.every((qty) => qty == 0)) return 0;
    
    final averageMultiplier = sizeQuantities.entries.fold(0.0, (sum, entry) {
      return (sum as double? ?? 0.0) + (entry.value * sizePrices[entry.key]!);
    }) / totalQuantity;
    
    return basePrice * averageMultiplier * totalQuantity;
  }

  int get totalQuantity => sizeQuantities.values.reduce((a, b) => a + b);

  bool get hasCustomization => customText != null || customLogo != null;

  Map<String, dynamic> toJson() {
    return {
      'productName': productName,
      'productType': productType,
      'productColor': productColor.value,
      'imagePath': imagePath,
      'basePrice': basePrice,
      'sizeQuantities': sizeQuantities,
      'sizePrices': sizePrices,
      'customText': customText,
      'textColor': textColor?.value,
      'font': font,
      'customLogoPath': customLogo?.path,
      'position': position,
      'useSharedLogo': useSharedLogo,
      'useSharedText': useSharedText,
    };
  }

  factory ProductQuoteItem.fromJson(Map<String, dynamic> json) {
    return ProductQuoteItem(
      productName: json['productName'],
      productType: json['productType'],
      productColor: Color(json['productColor']),
      imagePath: json['imagePath'],
      basePrice: json['basePrice'],
      sizeQuantities: Map<String, int>.from(json['sizeQuantities']),
      sizePrices: Map<String, double>.from(json['sizePrices']),
      customText: json['customText'],
      textColor: json['textColor'] != null ? Color(json['textColor']) : null,
      font: json['font'],
      customLogo: json['customLogoPath'] != null ? File(json['customLogoPath']) : null,
      position: json['position'],
      useSharedLogo: json['useSharedLogo'] ?? false,
      useSharedText: json['useSharedText'] ?? false,
    );
  }
}

class QuoteManager {
  static final QuoteManager _instance = QuoteManager._internal();
  factory QuoteManager() => _instance;
  QuoteManager._internal();

  final List<ProductQuoteItem> _items = [];
  File? _sharedLogo;
  String? _sharedText;
  Color _sharedTextColor = Colors.black;
  String _sharedFont = 'Roboto';

  List<ProductQuoteItem> get items => List.unmodifiable(_items);
  File? get sharedLogo => _sharedLogo;
  String? get sharedText => _sharedText;
  Color get sharedTextColor => _sharedTextColor;
  String get sharedFont => _sharedFont;
  double get totalPrice => _items.fold(0.0, (sum, item) => sum + item.totalPrice);
  int get totalQuantity => _items.fold(0, (sum, item) => sum + item.totalQuantity);

  void addItem(ProductQuoteItem item) {
    _items.add(item);
    _updateSharedCustomizations(item);
    _saveQuote();
  }

  void removeItem(int index) {
    if (index >= 0 && index < _items.length) {
      _items.removeAt(index);
      _saveQuote();
    }
  }

  void updateItem(int index, ProductQuoteItem newItem) {
    if (index >= 0 && index < _items.length) {
      _items[index] = newItem;
      _updateSharedCustomizations(newItem);
      _saveQuote();
    }
  }

  void clearQuote() {
    _items.clear();
    _sharedLogo = null;
    _sharedText = null;
    _saveQuote();
  }

  void updateSharedLogo(File? logo) {
    _sharedLogo = logo;
    for (var item in _items) {
      if (item.useSharedLogo) {
        _items[_items.indexOf(item)] = item.copyWith(customLogo: logo);
      }
    }
    _saveQuote();
  }

  void updateSharedText(String? text, {Color? color, String? font}) {
    _sharedText = text;
    if (color != null) _sharedTextColor = color;
    if (font != null) _sharedFont = font;
    
    for (var item in _items) {
      if (item.useSharedText) {
        _items[_items.indexOf(item)] = item.copyWith(
          customText: text,
          textColor: color ?? item.textColor,
          font: font ?? item.font,
        );
      }
    }
    _saveQuote();
  }

  Future<void> _saveQuote() async {
    final prefs = await SharedPreferences.getInstance();
    final json = jsonEncode({
      'items': _items.map((item) => item.toJson()).toList(),
      'sharedLogoPath': _sharedLogo?.path,
      'sharedText': _sharedText,
      'sharedTextColor': _sharedTextColor.value,
      'sharedFont': _sharedFont,
    });
    await prefs.setString('currentQuote', json);
  }

  Future<void> loadQuote() async {
    final prefs = await SharedPreferences.getInstance();
    final json = prefs.getString('currentQuote');
    if (json != null) {
      final data = jsonDecode(json);
      _items.clear();
      _items.addAll((data['items'] as List).map((item) => ProductQuoteItem.fromJson(item)));
      if (data['sharedLogoPath'] != null) {
        _sharedLogo = File(data['sharedLogoPath']);
      }
      _sharedText = data['sharedText'];
      _sharedTextColor = Color(data['sharedTextColor']);
      _sharedFont = data['sharedFont'];
    }
  }

  void _updateSharedCustomizations(ProductQuoteItem item) {
    if (item.customLogo != null && _sharedLogo == null) {
      _sharedLogo = item.customLogo;
    }
    if (item.customText != null && _sharedText == null) {
      _sharedText = item.customText;
      _sharedTextColor = item.textColor ?? Colors.black;
      _sharedFont = item.font ?? 'Roboto';
    }
  }
}

// 3. Page Catalogue Principale améliorée
class CataloguePage extends StatefulWidget {
  const CataloguePage({super.key});

  @override
  State<CataloguePage> createState() => _CataloguePageState();
}

class _CataloguePageState extends State<CataloguePage> {
  List<ProductCardData> bestSellers = [
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

  void _toggleFavorite(int index) {
    setState(() {
      bestSellers[index] = bestSellers[index].copyWith(
        isFavorite: !bestSellers[index].isFavorite
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: appTheme.colorScheme.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            automaticallyImplyLeading: false,
            expandedHeight: 200,
            floating: true,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                'Catalogue',
                style: TextStyle(
                  color: appTheme.colorScheme.onPrimary,
                  fontWeight: FontWeight.bold,
                  shadows: [Shadow(color: Colors.black45, blurRadius: 4)],
                ),
              ),
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      appTheme.colorScheme.primary,
                      appTheme.colorScheme.secondary,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.search),
                onPressed: () {},
              ),
              const QuoteBadge(),
            ],
          ),
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildSearchBar(),
                const SizedBox(height: 24),
                _buildCategoriesSection(),
                const SizedBox(height: 24),
                _buildBestSellersSection(),
                const SizedBox(height: 24),
                _buildSuggestionsSection(),
                const SizedBox(height: 80),
              ]),
            ),
          ),
        ],
      ),
      floatingActionButton: _buildFloatingActionButton(),
    );
  }

  Widget _buildSearchBar() {
    return SearchBar(
      hintText: 'Rechercher un produit...',
      leading: Icon(Icons.search, color: appTheme.colorScheme.onSurface.withOpacity(0.6)),
      elevation: MaterialStateProperty.all(0),
      backgroundColor: MaterialStateProperty.all(Colors.white),
      shape: MaterialStateProperty.all(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: Colors.grey[300]!),
        ),
      ),
      padding: MaterialStateProperty.all(
        const EdgeInsets.symmetric(horizontal: 16),
      ),
    );
  }

  Widget _buildFloatingActionButton() {
    return FloatingActionButton.extended(
      onPressed: () => Navigator.pushNamed(context, '/client-meeting'),
      icon: const Icon(Icons.calendar_today),
      label: const Text("Prendre RDV"),
      backgroundColor: appTheme.colorScheme.primary,
      foregroundColor: Colors.white,
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    );
  }

  Widget _buildCategoriesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Catégories",
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: categories.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: EdgeInsets.only(right: 12, left: index == 0 ? 0 : 0),
                child: _buildCategoryCard(categories[index]),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryCard(String category) {
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: () => _navigateToCategory(context, category),
      child: Column(
        children: [
          Container(
            width: 70,
            height: 70,
            decoration: BoxDecoration(
              color: appTheme.colorScheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(Icons.category, size: 30, color: appTheme.colorScheme.primary),
          ),
          const SizedBox(height: 8),
          Text(
            category,
            style: const TextStyle(fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildBestSellersSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "Best Sellers",
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            TextButton(
              onPressed: () {},
              child: const Text('Voir tout'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 220,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: bestSellers.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: EdgeInsets.only(right: 16, left: index == 0 ? 0 : 0),
                child: _buildBestSellerCard(bestSellers[index], index),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildBestSellerCard(ProductCardData product, int index) {
    return InkWell(
      onTap: () => _navigateToProductDetail(context, product),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        width: 160,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  child: Image.asset(
                    product.image,
                    height: 120,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        product.price,
                        style: TextStyle(
                          color: appTheme.colorScheme.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Positioned(
              top: 8,
              right: 8,
              child: IconButton(
                icon: Icon(
                  product.isFavorite ? Icons.favorite : Icons.favorite_border,
                  color: product.isFavorite ? Colors.red : Colors.white,
                ),
                onPressed: () {
                  HapticFeedback.selectionClick();
                  _toggleFavorite(index);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuggestionsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Suggestions pour vous",
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 12),
        ...suggestions.map((suggestion) => _buildSuggestionTile(suggestion)).toList(),
      ],
    );
  }

  Widget _buildSuggestionTile(SuggestionTileData data) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => _navigateToProductDetail(context, data),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.asset(
                  data.image,
                  width: 80,
                  height: 80,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data.name,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      data.desc,
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.star, color: Colors.amber, size: 16),
                        Text(
                          data.rating.toString(),
                          style: const TextStyle(fontSize: 14),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Text(
                data.price,
                style: TextStyle(
                  color: appTheme.colorScheme.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _navigateToCategory(BuildContext context, String category) {
    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => CategoryProductsPage(categoryName: category),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(1.0, 0.0);
          const end = Offset.zero;
          const curve = Curves.ease;
          final tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
          return SlideTransition(
            position: animation.drive(tween),
            child: child,
          );
        },
      ),
    );
  }

  void _navigateToProductDetail(BuildContext context, dynamic product) {
    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) {
          if (product is ProductCardData) {
            return ProductDetailPage(
              name: product.name,
              imagePath: product.image,
              price: double.parse(product.price.replaceAll('€', '').trim()),
              productType: product.type,
            );
          } else if (product is SuggestionTileData) {
            return ProductDetailPage(
              name: product.name,
              imagePath: product.image,
              price: double.parse(product.price.replaceAll('€', '').trim()),
              productType: product.type,
            );
          }
          return Container();
        },
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = 0.0;
          const end = 1.0;
          const curve = Curves.easeInOut;
          final tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
          return FadeTransition(
            opacity: animation.drive(tween),
            child: child,
          );
        },
      ),
    );
  }
}

// 4. Page des produits par catégorie améliorée
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
      backgroundColor: appTheme.colorScheme.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 150,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(categoryName, 
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  shadows: [Shadow(color: Colors.black45, blurRadius: 4)],
                ),
              ),
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      appTheme.colorScheme.primary,
                      appTheme.colorScheme.secondary,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
              ),
            ),
          ),
          products.isEmpty
              ? SliverFillRemaining(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off, size: 50, color: Colors.grey[400]),
                        const SizedBox(height: 16),
                        Text(
                          "Aucun produit disponible",
                          style: TextStyle(color: Colors.grey[600]),
                        ),
                      ],
                    ),
                  ),
                )
              : SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      childAspectRatio: 0.75,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) => _buildProductCard(context, products[index]),
                      childCount: products.length,
                    ),
                  ),
                ),
        ],
      ),
    );
  }

  Widget _buildProductCard(BuildContext context, ProductCardData product) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => _navigateToProductDetail(context, product),
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: AssetImage(product.image),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        product.price,
                        style: TextStyle(
                          color: appTheme.colorScheme.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Positioned(
              top: 8,
              right: 8,
              child: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.4),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  product.isFavorite ? Icons.favorite : Icons.favorite_border,
                  color: Colors.white,
                  size: 20,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _navigateToProductDetail(BuildContext context, ProductCardData product) {
    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) {
          return ProductDetailPage(
            name: product.name,
            imagePath: product.image,
            price: double.parse(product.price.replaceAll('€', '').trim()),
            productType: product.type,
          );
        },
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = 0.0;
          const end = 1.0;
          const curve = Curves.easeInOut;
          final tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
          return FadeTransition(
            opacity: animation.drive(tween),
            child: child,
          );
        },
      ),
    );
  }
}

// 5. Page de détail du produit améliorée
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

class _ProductDetailPageState extends State<ProductDetailPage> 
    with SingleTickerProviderStateMixin, RestorationMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late ConfettiController _confettiController;
  
  // État de personnalisation
  Color _productColor = Colors.white;
  File? _customLogo;
  String _customText = '';
  bool _isFavorite = false;
  bool _isSaving = false;
  bool _isHovering = false;
  
  // Position et transformation
  Offset _logoPosition = Offset.zero;
  Offset _textPosition = Offset.zero;
  double _logoScale = 1.0;
  double _textScale = 1.0;
  double _logoRotation = 0;
  double _textRotation = 0;
  
  // Sélection et style
  String? _selectedElement;
  Color _textColor = Colors.black;
  String _selectedFont = 'Roboto';
  String _selectedPosition = 'Poche poitrine';
  String _selectedPlacement = 'Avant';
  
  // Contrôleurs texte
  final RestorableTextEditingController _textController = RestorableTextEditingController();
  final RestorableTextEditingController _clientNameController = RestorableTextEditingController();
  final RestorableTextEditingController _clientEmailController = RestorableTextEditingController();
  final RestorableTextEditingController _clientPhoneController = RestorableTextEditingController();
  final RestorableTextEditingController _clientAddressController = RestorableTextEditingController();
  
  // Prévisualisation
  final GlobalKey _productPreviewKey = GlobalKey();
  
  // Options disponibles
  final List<Color> _availableColors = const [
    Colors.black,
    Colors.white,
    Color(0xFFE30613), // Rouge
    Color(0xFFFFD800), // Jaune
    Color(0xFF007A30), // Vert
    Color(0xFF0038A8), // Bleu
    Color(0xFF6D3B8E), // Violet
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

  // Gestion des tailles
  final Map<String, double> _sizePrices = {
    'XS': 1.0,
    'S': 1.0,
    'M': 1.0,
    'L': 1.1,
    'XL': 1.15,
    'XXL': 1.2,
  };

  final Map<String, int> _sizeQuantities = {
    'XS': 0,
    'S': 0,
    'M': 0,
    'L': 0,
    'XL': 0,
    'XXL': 0,
  };

  final QuoteManager _quoteManager = QuoteManager();
  
  int get _totalQuantity => _sizeQuantities.values.reduce((a, b) => a + b);
  
  double get _averagePriceMultiplier {
    if (_totalQuantity == 0) return 1.0;
    final total = _sizeQuantities.entries.fold(0.0, (sum, entry) {
      return (sum as double? ?? 0) + (entry.value * _sizePrices[entry.key]!);
    }) / _totalQuantity;
    return total / _totalQuantity;
  }
  
  double get _adjustedUnitPrice => widget.price * _averagePriceMultiplier;
  double get _totalPrice => _adjustedUnitPrice * _totalQuantity;

  final Size _productSize = const Size(300, 400);
  bool _isDisposed = false;

  @override
  String get restorationId => 'product_detail_page';

  @override
  void restoreState(RestorationBucket? oldBucket, bool initialRestore) {
    registerForRestoration(_textController, 'custom_text');
    registerForRestoration(_clientNameController, 'client_name');
    registerForRestoration(_clientEmailController, 'client_email');
    registerForRestoration(_clientPhoneController, 'client_phone');
    registerForRestoration(_clientAddressController, 'client_address');
  }

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 0.95, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _confettiController = ConfettiController(duration: const Duration(seconds: 1));
    
    _controller.forward();
    _initializePositions();
    _adaptPositionsForProductType();
    _quoteManager.loadQuote();
  }

  @override
  void dispose() {
    _isDisposed = true;
    _controller.dispose();
    _confettiController.dispose();
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: appTheme.colorScheme.background,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              _buildAppBar(),
              SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    _buildProductInfo(),
                    const SizedBox(height: 24),
                    _buildSizeSelector(),
                    const SizedBox(height: 24),
                    _buildCustomizationSection(),
                    const SizedBox(height: 24),
                    _buildColorSelector(),
                    const SizedBox(height: 24),
                    _buildBottomControls(),
                    const SizedBox(height: 100),
                  ]),
                ),
              ),
            ],
          ),
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
              shouldLoop: false,
              colors: const [
                Colors.green,
                Colors.blue,
                Colors.pink,
                Colors.orange,
                Colors.purple,
              ],
            ),
          ),
        ],
      ),
    );
  }

  SliverAppBar _buildAppBar() {
    return SliverAppBar(
      expandedHeight: 300,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        title: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            color: Colors.black.withOpacity(0.4),
          ),
          child: Text(
            widget.name,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        background: Stack(
          children: [
            Hero(
              tag: 'product-${widget.name}',
              child: ColorFiltered(
                colorFilter: ColorFilter.mode(
                  _productColor.withOpacity(0.9),
                  BlendMode.srcATop,
                ),
                child: Image.asset(
                  widget.imagePath,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withOpacity(0.2),
                    Colors.black.withOpacity(0.4),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      actions: [
        IconButton(
          icon: Icon(
            _isFavorite ? Icons.favorite : Icons.favorite_border,
            color: _isFavorite ? Colors.red : Colors.white,
          ),
          onPressed: () {
            HapticFeedback.selectionClick();
            setState(() => _isFavorite = !_isFavorite);
            if (_isFavorite) _confettiController.play();
          },
        ),
      ],
    );
  }

  Widget _buildProductInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              widget.name,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: appTheme.colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                widget.productType,
                style: TextStyle(
                  color: appTheme.colorScheme.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        RichText(
          text: TextSpan(
            children: [
              TextSpan(
                text: "Prix de base: ",
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              TextSpan(
                text: "${widget.price.toStringAsFixed(2)}€",
                style: TextStyle(
                  color: appTheme.colorScheme.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        const Divider(),
      ],
    );
  }

  Widget _buildSizeSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Tailles disponibles",
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _sizePrices.keys.map((size) {
            return _buildSizeChip(size);
          }).toList(),
        ),
        const SizedBox(height: 16),
        const Divider(),
      ],
    );
  }

  Widget _buildSizeChip(String size) {
    final isSelected = _sizeQuantities[size]! > 0;
    final sizePrice = widget.price * _sizePrices[size]!;
    
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      decoration: BoxDecoration(
        color: isSelected 
          ? appTheme.colorScheme.primary 
          : appTheme.colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected 
            ? appTheme.colorScheme.primary 
            : appTheme.colorScheme.outline.withOpacity(0.2),
        ),
        boxShadow: [
          if (isSelected)
            BoxShadow(
              color: appTheme.colorScheme.primary.withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => setState(() => _selectSize(size)),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                size,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: isSelected 
                    ? Colors.white 
                    : Theme.of(context).colorScheme.onSurface,
                ),
              ),
              Text(
                "${sizePrice.toStringAsFixed(2)}€",
                style: TextStyle(
                  fontSize: 12,
                  color: isSelected 
                    ? Colors.white.withOpacity(0.8) 
                    : Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                ),
              ),
              if (_sizeQuantities[size]! > 0)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.remove, size: 16),
                        color: Colors.white,
                        onPressed: () {
                          HapticFeedback.selectionClick();
                          setState(() => _sizeQuantities[size] = _sizeQuantities[size]! - 1);
                        },
                      ),
                      Text(
                        '${_sizeQuantities[size]}',
                        style: const TextStyle(color: Colors.white),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add, size: 16),
                        color: Colors.white,
                        onPressed: () {
                          HapticFeedback.selectionClick();
                          setState(() => _sizeQuantities[size] = _sizeQuantities[size]! + 1);
                        },
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCustomizationSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Personnalisation",
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 16),
        _buildPositionSelector(),
        const SizedBox(height: 16),
        Container(
          height: 300,
          margin: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Transform(
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.001)
                ..rotateX(0.05),
              alignment: Alignment.center,
              child: _buildProductPreview(),
            ),
          ),
        ),
        const SizedBox(height: 16),
        if (_selectedElement != null) _buildElementControls(),
        const SizedBox(height: 16),
        _buildTextCustomization(),
        const SizedBox(height: 16),
        _buildLogoUpload(),
        const SizedBox(height: 16),
        const Divider(),
      ],
    );
  }

  Widget _buildPositionSelector() {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: appTheme.colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Placement du marquage',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 48,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: _availablePlacements.map((placement) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(placement),
                      selected: _selectedPlacement == placement,
                      onSelected: (selected) {
                        HapticFeedback.selectionClick();
                        setState(() {
                          _selectedPlacement = placement;
                          _updatePositionsBasedOnPlacement();
                        });
                      },
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      showCheckmark: false,
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Position exacte',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 48,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: _availablePositions.map((position) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(position),
                      selected: _selectedPosition == position,
                      onSelected: (selected) {
                        HapticFeedback.selectionClick();
                        setState(() {
                          _selectedPosition = position;
                          _applySmartPositioning();
                        });
                      },
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      showCheckmark: false,
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildElementControls() {
    if (_selectedElement == null) return const SizedBox.shrink();

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: appTheme.colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Modifier ${_selectedElement == 'logo' ? 'le logo' : 'le texte'}',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildControlButton(
                  icon: Icons.zoom_in,
                  label: 'Agrandir',
                  onPressed: () {
                    HapticFeedback.selectionClick();
                    _adjustElementScale(1.1);
                  },
                ),
                _buildControlButton(
                  icon: Icons.zoom_out,
                  label: 'Réduire',
                  onPressed: () {
                    HapticFeedback.selectionClick();
                    _adjustElementScale(0.9);
                  },
                ),
                _buildControlButton(
                  icon: Icons.rotate_left,
                  label: 'Rotation',
                  onPressed: () {
                    HapticFeedback.selectionClick();
                    _adjustElementRotation(-0.1);
                  },
                ),
                if (_selectedElement == 'text')
                  _buildControlButton(
                    icon: Icons.text_fields,
                    label: 'Police',
                    onPressed: _showFontPicker,
                  ),
              ],
            ),
            const SizedBox(height: 12),
            if (_selectedElement == 'text')
              ColorPickerButton(
                color: _textColor,
                onColorChanged: (color) => setState(() => _textColor = color),
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
        IconButton.filled(
          icon: Icon(icon),
          onPressed: onPressed,
          style: IconButton.styleFrom(
            backgroundColor: appTheme.colorScheme.primaryContainer,
            foregroundColor: appTheme.colorScheme.onPrimaryContainer,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: Theme.of(context).textTheme.labelSmall,
        ),
      ],
    );
  }

  Widget _buildTextCustomization() {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: appTheme.colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Personnalisation du texte',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _textController.value,
              decoration: InputDecoration(
                labelText: 'Texte à imprimer',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                filled: true,
                fillColor: Colors.white,
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
              decoration: InputDecoration(
                labelText: 'Police d\'écriture',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                filled: true,
                fillColor: Colors.white,
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
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: appTheme.colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Logo personnalisé',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),
            FilledButton.icon(
              onPressed: _uploadLogo,
              icon: const Icon(Icons.upload),
              label: Text(_customLogo != null ? 'Changer le logo' : 'Ajouter un logo'),
              style: FilledButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
              ),
            ),
            if (_customLogo != null) ...[
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: _removeLogo,
                icon: const Icon(Icons.delete),
                label: const Text('Supprimer le logo'),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 48),
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
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: appTheme.colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Couleur du produit',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),
            Text(
              'Couleurs disponibles:',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: _availableColors.map((color) {
                return GestureDetector(
                  onTap: () {
                    HapticFeedback.selectionClick();
                    setState(() => _productColor = color);
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: color,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: _productColor == color 
                          ? Theme.of(context).colorScheme.onSurface 
                          : Colors.transparent,
                        width: 3,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 6,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: _productColor == color
                      ? Center(
                          child: Icon(
                            Icons.check,
                            color: color.computeLuminance() > 0.5 
                              ? Colors.black 
                              : Colors.white,
                          ),
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
              style: OutlinedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomControls() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _quoteManager.items.isEmpty ? "Total" : "Total partiel",
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                Text(
                  "${_totalPrice.toStringAsFixed(2)}€",
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: appTheme.colorScheme.primary,
                      ),
                ),
                if (_quoteManager.items.isNotEmpty)
                  Text(
                    "Total global: ${_quoteManager.totalPrice.toStringAsFixed(2)}€",
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
              ],
            ),
            Column(
              children: [
                if (_totalQuantity > 0)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: FilledButton(
                      onPressed: _addToQuote,
                      style: FilledButton.styleFrom(
                        backgroundColor: appTheme.colorScheme.secondary,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text("Ajouter à mon devis"),
                    ),
                  ),
                ScaleTransition(
                  scale: _scaleAnimation,
                  child: FilledButton(
                    onPressed: _totalQuantity > 0 ? _showFinalQuoteOptions : null,
                    style: FilledButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                    ),
                    child: Text(
                      _quoteManager.items.isEmpty ? "Demander un devis" : "Voir le devis",
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }

  void _selectSize(String size) {
    setState(() {
      if (_sizeQuantities[size]! > 0) {
        _sizeQuantities[size] = 0;
      } else {
        _sizeQuantities[size] = 1;
      }
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

  void _showColorPicker(bool isProductColor) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isProductColor ? 'Couleur du produit' : 'Couleur du texte'),
        content: SingleChildScrollView(
          child: BlockPicker(
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

  void _showFontPicker() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Choisir une police'),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: _availableFonts.length,
            itemBuilder: (context, index) {
              final font = _availableFonts[index];
              return ListTile(
                title: Text(
                  'Exemple de texte',
                  style: TextStyle(fontFamily: font),
                ),
                onTap: () {
                  setState(() => _selectedFont = font);
                  Navigator.pop(context);
                },
              );
            },
          ),
        ),
      ),
    );
  }

  void _updatePositionsBasedOnPlacement() {
    if (_isDisposed) return;
    
    setState(() {
      final zone = _placementZones[_selectedPlacement]!;
      
      _logoPosition = Offset(
        _productSize.width * (zone.left + zone.width / 2),
        _productSize.height * (zone.top + zone.height / 2),
      );
      
      _textPosition = Offset(
        _productSize.width * (zone.left + zone.width / 2),
        _productSize.height * (zone.top + zone.height / 2),
      );
      
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
      _textController.value.clear();
    });
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

  void _removeLogo() {
    if (_isDisposed) return;
    setState(() {
      _customLogo = null;
      _selectedElement = null;
    });
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

  void _addToQuote() {
    if (_totalQuantity == 0) return;

    final newItem = ProductQuoteItem(
      productName: widget.name,
      productType: widget.productType,
      productColor: _productColor,
      imagePath: widget.imagePath,
      basePrice: widget.price,
      sizeQuantities: Map.from(_sizeQuantities),
      sizePrices: Map.from(_sizePrices),
      customText: _customText.isNotEmpty ? _customText : null,
      textColor: _customText.isNotEmpty ? _textColor : null,
      font: _customText.isNotEmpty ? _selectedFont : null,
      customLogo: _customLogo,
      position: _selectedPosition,
    );

    setState(() {
      _quoteManager.addItem(newItem);
      // Sauvegarder le logo et texte pour réutilisation
      if (_customLogo != null) _quoteManager.updateSharedLogo(_customLogo);
      if (_customText.isNotEmpty) {
        _quoteManager.updateSharedText(_customText, color: _textColor, font: _selectedFont);
      }
      
      // Réinitialiser les quantités pour le prochain produit
      for (var size in _sizeQuantities.keys) {
        _sizeQuantities[size] = 0;
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Produit ajouté au devis'),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  void _showFinalQuoteOptions() {
    if (_quoteManager.items.isEmpty && _totalQuantity == 0) return;

    showModalBottomSheet(
      context: context,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (_totalQuantity > 0) ...[
                FilledButton(
                  onPressed: () {
                    Navigator.pop(context);
                    _addToQuote();
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const QuoteSummaryPage(),
                      ),
                    );
                  },
                  child: const Text('Voir le devis complet'),
                ),
                const SizedBox(height: 12),
              ],
              FilledButton(
                onPressed: () {
                  Navigator.pop(context);
                  if (_totalQuantity > 0) _addToQuote();
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const CataloguePage(),
                    ),
                  );
                },
                child: Text(
                  _quoteManager.items.isEmpty 
                    ? 'Continuer mes achats' 
                    : 'Ajouter un autre produit',
                ),
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Annuler'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _showEmailDialog({bool isMultiProduct = false}) async {
    if (_isDisposed) return;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) {
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom,
            ),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.background,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      isMultiProduct ? 'Devis multi-produits' : 'Demander un devis',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Informations client',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 12),
                    _buildClientInfoForm(),
                    const SizedBox(height: 24),
                    const Text(
                      'Récapitulatif du devis',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 12),
                    if (isMultiProduct) _buildMultiProductQuoteSummary() else _buildQuoteSummary(),
                    const SizedBox(height: 24),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Navigator.of(context).pop(),
                            child: const Text('Annuler'),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: FilledButton(
                            onPressed: _isSaving ? null : () => _sendQuote(context, isMultiProduct: isMultiProduct),
                            child: _isSaving
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(strokeWidth: 2),
                                  )
                                : const Text('Envoyer la demande'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildClientInfoForm() {
    return Column(
      children: [
        TextField(
          controller: _clientNameController.value,
          decoration: InputDecoration(
            labelText: 'Nom complet*',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            filled: true,
            fillColor: Colors.white,
          ),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _clientEmailController.value,
          decoration: InputDecoration(
            labelText: 'Email*',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            filled: true,
            fillColor: Colors.white,
            hintText: 'exemple@domaine.com',
          ),
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _clientPhoneController.value,
          decoration: InputDecoration(
            labelText: 'Téléphone*',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            filled: true,
            fillColor: Colors.white,
            hintText: '06 12 34 56 78',
          ),
          keyboardType: TextInputType.phone,
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _clientAddressController.value,
          decoration: InputDecoration(
            labelText: 'Adresse',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            filled: true,
            fillColor: Colors.white,
            hintText: 'Adresse de livraison',
          ),
          maxLines: 2,
        ),
      ],
    );
  }

  Widget _buildQuoteSummary() {
    final totalPrice = _totalPrice;
    final vat = totalPrice * 0.2;
    final totalWithVat = totalPrice + vat;
    final reference = 'DEV-${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}';

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: appTheme.colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.receipt_long,
                  color: appTheme.colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Text(
                  'DEVIS N°$reference',
                  style: TextStyle(
                    color: appTheme.colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 16),
            Text(
              'Détails du produit',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Table(
              columnWidths: const {0: FlexColumnWidth(2), 1: FlexColumnWidth(3)},
              children: [
                _buildTableRow('Produit', widget.name),
                _buildTableRow('Type', widget.productType),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              'Quantités par taille',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            ..._sizePrices.keys.where((size) => _sizeQuantities[size]! > 0).map((size) {
              final qty = _sizeQuantities[size]!;
              final price = widget.price * _sizePrices[size]!;
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Taille $size (x$qty)'),
                    Text('${(price * qty).toStringAsFixed(2)}€'),
                  ],
                ),
              );
            }).toList(),
            const SizedBox(height: 16),
            Text(
              'Personnalisation',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
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
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 16),
            Text(
              'Total',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Table(
              columnWidths: const {0: FlexColumnWidth(2), 1: FlexColumnWidth(3)},
              children: [
                _buildTableRow('Prix moyen unitaire', '${_adjustedUnitPrice.toStringAsFixed(2)}€'),
                _buildTableRow('Total articles', '$_totalQuantity'),
                _buildTableRow('Sous-total', '${totalPrice.toStringAsFixed(2)}€'),
                _buildTableRow('TVA (20%)', '${vat.toStringAsFixed(2)}€'),
                _buildTableRow('Total TTC', '${totalWithVat.toStringAsFixed(2)}€',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: appTheme.colorScheme.primary,
                    )),
              ],
            ),
            const SizedBox(height: 16),
            const Text('*TVA incluse', style: TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 8),
            const Text('Valable 30 jours', style: TextStyle(fontStyle: FontStyle.italic)),
          ],
        ),
      ),
    );
  }

  Widget _buildMultiProductQuoteSummary() {
    final totalPrice = _quoteManager.totalPrice;
    final vat = totalPrice * 0.2;
    final totalWithVat = totalPrice + vat;
    final reference = 'DEV-${DateTime.now().millisecondsSinceEpoch.toString().substring(4)}';

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: appTheme.colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.receipt_long,
                  color: appTheme.colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Text(
                  'DEVIS N°$reference',
                  style: TextStyle(
                    color: appTheme.colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 16),
            Text(
              'Produits inclus',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            
            ..._quoteManager.items.map((item) => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.productName,
                  style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                ...item.sizeQuantities.entries.where((e) => e.value > 0).map((entry) {
                  final size = entry.key;
                  final qty = entry.value;
                  final price = item.basePrice * item.sizePrices[size]!;
                  return Padding(
                    padding: const EdgeInsets.only(left: 8),
                    child: Text(
                      '- Taille $size: $qty x ${price.toStringAsFixed(2)}€ = ${(price * qty).toStringAsFixed(2)}€',
                    ),
                  );
                }),
                if (item.customText != null) Padding(
                  padding: const EdgeInsets.only(left: 8),
                  child: Text('- Texte: "${item.customText}"'),
                ),
                if (item.customLogo != null) const Padding(
                  padding: EdgeInsets.only(left: 8),
                  child: Text('- Logo personnalisé'),
                ),
                const SizedBox(height: 8),
              ],
            )).toList(),
            
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 16),
            
            Text(
              'Personnalisation partagée',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            if (_quoteManager.sharedText != null) 
              Text('- Texte: "${_quoteManager.sharedText}"'),
            if (_quoteManager.sharedLogo != null)
              const Text('- Logo partagé: Oui'),
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 16),
            
            Text(
              'Total',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Table(
              columnWidths: const {0: FlexColumnWidth(2), 1: FlexColumnWidth(3)},
              children: [
                _buildTableRow('Total articles', _quoteManager.totalQuantity.toString()),
                _buildTableRow('Sous-total', '${_quoteManager.totalPrice.toStringAsFixed(2)}€'),
                _buildTableRow('TVA (20%)', '${vat.toStringAsFixed(2)}€'),
                _buildTableRow('Total TTC', '${totalWithVat.toStringAsFixed(2)}€',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: appTheme.colorScheme.primary,
                    )),
              ],
            ),
            const SizedBox(height: 16),
            const Text('*TVA incluse', style: TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 8),
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

  Future<void> _sendQuote(BuildContext context, {bool isMultiProduct = false}) async {
    if (_isDisposed) return;
    if (_clientNameController.value.text.isEmpty || 
        _clientEmailController.value.text.isEmpty || 
        _clientPhoneController.value.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Veuillez remplir tous les champs obligatoires (*)'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() => _isSaving = true);
    try {
      final email = _clientEmailController.value.text;
      final subject = isMultiProduct 
          ? 'Devis multi-produits pour ${_clientNameController.value.text}'
          : 'Devis ${widget.name} pour ${_clientNameController.value.text}';
      
      final body = isMultiProduct 
          ? _generateMultiProductEmailBody()
          : _generateEmailBody();

      // Option 1: Try to open email app
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
          // Fallback to copy option
          await _showCopyOptions(context, subject, body);
        }
      } catch (e) {
        // Fallback to copy option
        await _showCopyOptions(context, subject, body);
      }

      if (!_isDisposed) {
        Navigator.of(context).pop();
        _showSuccessAnimation();
        
        if (isMultiProduct) {
          _quoteManager.clearQuote();
        }
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

  Future<void> _showCopyOptions(BuildContext context, String subject, String body) async {
    final content = 'Sujet: $subject\n\n$body';
    
    return showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Options d\'envoi'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Impossible d\'ouvrir l\'application email. Vous pouvez copier le devis ci-dessous:'),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: SingleChildScrollView(
                  child: SelectableText(
                    content,
                    style: const TextStyle(fontFamily: 'Courier'),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: () {
                  Clipboard.setData(ClipboardData(text: content));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Devis copié dans le presse-papiers')),
                  );
                  Navigator.of(context).pop();
                },
                child: const Text('Copier le devis'),
              ),
            ],
          ),
          actions: [
            TextButton(
              child: const Text('Fermer'),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        );
      },
    );
  }

  String _generateEmailBody() {
    final totalPrice = _totalPrice;
    final vat = totalPrice * 0.2;
    final totalWithVat = totalPrice + vat;
    final reference = 'DEV-${DateTime.now().millisecondsSinceEpoch.toString().substring(4)}';
    
    final trackingParams = {
      'id': reference,
      'amount': totalWithVat.toStringAsFixed(2),
      'product': widget.name,
      'image': widget.imagePath,
      'quantity': _totalQuantity.toString(),
      'type': widget.productType,
      'color': _productColor.value.toRadixString(16).padLeft(8, '0').substring(2),
      'textColor': _textColor.value.toRadixString(16).padLeft(8, '0').substring(2),
      if (_customText.isNotEmpty) 'text': _customText,
      if (_selectedFont != 'Roboto') 'font': _selectedFont,
    };

    final queryString = Uri(queryParameters: trackingParams).query;
    final trackingUrl = 'https://0osmoz0.github.io/UniqMaker/?$queryString';

    return '''
DEVIS PERSONNALISÉ
==================

Référence: $reference
Date: ${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}

INFORMATIONS CLIENT
-------------------
Nom: ${_clientNameController.value.text}
Email: ${_clientEmailController.value.text}
Téléphone: ${_clientPhoneController.value.text}
${_clientAddressController.value.text.isNotEmpty ? 'Adresse: ${_clientAddressController.value.text}' : ''}

DÉTAILS DU PRODUIT
------------------
Produit: ${widget.name}
Type: ${widget.productType}

QUANTITÉS PAR TAILLE
-------------------
${_sizePrices.keys.where((size) => _sizeQuantities[size]! > 0).map((size) {
  final qty = _sizeQuantities[size]!;
  final price = widget.price * _sizePrices[size]!;
  return 'Taille $size: $qty x ${price.toStringAsFixed(2)}€ = ${(price * qty).toStringAsFixed(2)}€';
}).join('\n')}

Total articles: $_totalQuantity
Prix moyen unitaire: ${_adjustedUnitPrice.toStringAsFixed(2)}€

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

  String _generateMultiProductEmailBody() {
    final totalPrice = _quoteManager.totalPrice;
    final vat = totalPrice * 0.2;
    final totalWithVat = totalPrice + vat;
    final reference = 'DEV-${DateTime.now().millisecondsSinceEpoch.toString().substring(4)}';
    
    final trackingParams = {
      'id': reference,
      'amount': totalWithVat.toStringAsFixed(2),
      'product_count': _quoteManager.items.length.toString(),
      'has_logo': _quoteManager.sharedLogo != null ? '1' : '0',
      'has_text': _quoteManager.sharedText != null ? '1' : '0',
    };

    final queryString = Uri(queryParameters: trackingParams).query;
    final trackingUrl = 'https://0osmoz0.github.io/UniqMaker/?$queryString';

    return '''
DEVIS MULTI-PRODUITS
====================

Référence: $reference
Date: ${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}

INFORMATIONS CLIENT
-------------------
Nom: ${_clientNameController.value.text}
Email: ${_clientEmailController.value.text}
Téléphone: ${_clientPhoneController.value.text}
${_clientAddressController.value.text.isNotEmpty ? 'Adresse: ${_clientAddressController.value.text}' : ''}

DÉTAILS DES PRODUITS
-------------------
${_quoteManager.items.map((item) {
  return '''
Produit: ${item.productName}
Type: ${item.productType}
Couleur: ${_getColorName(item.productColor)}
Quantités: ${item.sizeQuantities.entries.where((e) => e.value > 0).map((e) => '${e.key}: ${e.value}').join(', ')}
${item.customText != null ? 'Texte: "${item.customText}"\nPolice: ${item.font}\nCouleur texte: ${_getColorName(item.textColor!)}' : ''}
${item.customLogo != null ? 'Logo personnalisé: Oui' : ''}
Position: ${item.position}
Prix: ${item.totalPrice.toStringAsFixed(2)}€
-------------------------------------
''';
}).join('\n')}

PERSONNALISATION PARTAGÉE
------------------------
${_quoteManager.sharedText != null ? 'Texte: "${_quoteManager.sharedText}"\nPolice: ${_quoteManager.sharedFont}\nCouleur texte: ${_getColorName(_quoteManager.sharedTextColor)}' : ''}
${_quoteManager.sharedLogo != null ? 'Logo partagé: Oui' : ''}

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

  void _showSuccessAnimation() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        elevation: 0,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.check_circle,
              color: Colors.green,
              size: 100,
            ),
            const SizedBox(height: 16),
            Text(
              'Devis envoyé avec succès!',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: () => Navigator.pop(context),
              style: FilledButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: appTheme.colorScheme.primary,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              ),
              child: const Text('Fermer'),
            ),
          ],
        ),
      ),
    );
  }
}

class QuoteSummaryPage extends StatefulWidget {
  const QuoteSummaryPage({super.key});

  @override
  State<QuoteSummaryPage> createState() => _QuoteSummaryPageState();
}

class _QuoteSummaryPageState extends State<QuoteSummaryPage> {
  final QuoteManager _quoteManager = QuoteManager();
  bool _isEditing = false;
  int? _editingIndex;

  @override
  void initState() {
    super.initState();
    _quoteManager.loadQuote();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Devis Multi-Produits'),
        actions: [
          if (_quoteManager.items.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.email),
              onPressed: _sendQuote,
            ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: _quoteManager.items.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    itemCount: _quoteManager.items.length,
                    itemBuilder: (context, index) {
                      final item = _quoteManager.items[index];
                      return _isEditing && _editingIndex == index
                          ? _buildEditItemCard(item, index)
                          : _buildItemCard(item, index);
                    },
                  ),
          ),
          _buildTotalSection(),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const CataloguePage(),
          ),
        ),
        icon: const Icon(Icons.add),
        label: Text(_quoteManager.items.isEmpty ? 'Ajouter un produit' : 'Ajouter un autre produit'),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.shopping_basket, size: 64, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            'Aucun produit dans votre devis',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          Text(
            'Commencez par ajouter des produits depuis le catalogue',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildItemCard(ProductQuoteItem item, int index) {
    return Card(
      margin: const EdgeInsets.all(8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    item.productName,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () => setState(() {
                    _isEditing = true;
                    _editingIndex = index;
                  }),
                ),
                IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () => _removeItem(index),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Quantités: ${item.sizeQuantities.entries.where((e) => e.value > 0).map((e) => '${e.key}: ${e.value}').join(', ')}',
            ),
            Text('Prix: ${item.totalPrice.toStringAsFixed(2)}€'),
            if (item.hasCustomization) ...[
              const SizedBox(height: 8),
              const Text('Personnalisation:'),
              if (item.customText != null)
                Text('- Texte: "${item.customText}"'),
              if (item.customLogo != null)
                const Text('- Logo personnalisé'),
              Text('- Position: ${item.position}'),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildEditItemCard(ProductQuoteItem item, int index) {
    return Card(
      margin: const EdgeInsets.all(8),
      color: Theme.of(context).colorScheme.primaryContainer.withOpacity(0.1),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Modifier ${item.productName}',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            
            // Quantités par taille
            Text(
              'Quantités:',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            Wrap(
              spacing: 8,
              children: item.sizeQuantities.keys.map((size) {
                return Chip(
                  label: Text('$size: ${item.sizeQuantities[size]}'),
                  deleteIcon: const Icon(Icons.remove),
                  onDeleted: () => _updateQuantity(index, size, -1),
                );
              }).toList(),
            ),
            
            const SizedBox(height: 16),
            
            // Options de personnalisation partagée
            if (_quoteManager.sharedText != null || _quoteManager.sharedLogo != null)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Personnalisation partagée:',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  if (_quoteManager.sharedText != null)
                    CheckboxListTile(
                      title: Text('Utiliser le texte partagé: "${_quoteManager.sharedText}"'),
                      value: item.useSharedText,
                      onChanged: (value) => _toggleSharedText(index, value ?? false),
                    ),
                  if (_quoteManager.sharedLogo != null)
                    CheckboxListTile(
                      title: const Text('Utiliser le logo partagé'),
                      value: item.useSharedLogo,
                      onChanged: (value) => _toggleSharedLogo(index, value ?? false),
                    ),
                ],
              ),
            
            const SizedBox(height: 16),
            
            // Boutons de contrôle
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => setState(() {
                    _isEditing = false;
                    _editingIndex = null;
                  }),
                  child: const Text('Annuler'),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: () => setState(() {
                    _isEditing = false;
                    _editingIndex = null;
                  }),
                  child: const Text('Sauvegarder'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTotalSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(top: BorderSide(color: Theme.of(context).dividerColor)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Total (${_quoteManager.totalQuantity} articles)',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              Text(
                '${_quoteManager.totalPrice.toStringAsFixed(2)}€',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: _quoteManager.items.isEmpty ? null : _sendQuote,
              child: const Text('Demander un devis'),
            ),
          ),
        ],
      ),
    );
  }

  void _removeItem(int index) {
    setState(() {
      _quoteManager.removeItem(index);
      if (_editingIndex == index) {
        _isEditing = false;
        _editingIndex = null;
      }
    });
  }

  void _updateQuantity(int index, String size, int delta) {
    final item = _quoteManager.items[index];
    final newQuantities = Map<String, int>.from(item.sizeQuantities);
    final newValue = (newQuantities[size] ?? 0) + delta;
    
    if (newValue >= 0) {
      newQuantities[size] = newValue;
      setState(() {
        _quoteManager.updateItem(
          index,
          item.copyWith(sizeQuantities: newQuantities),
        );
      });
    }
  }

  void _toggleSharedText(int index, bool value) {
    final item = _quoteManager.items[index];
    setState(() {
      _quoteManager.updateItem(
        index,
        item.copyWith(
          useSharedText: value,
          customText: value ? _quoteManager.sharedText : null,
          textColor: value ? _quoteManager.sharedTextColor : null,
          font: value ? _quoteManager.sharedFont : null,
        ),
      );
    });
  }

  void _toggleSharedLogo(int index, bool value) {
    final item = _quoteManager.items[index];
    setState(() {
      _quoteManager.updateItem(
        index,
        item.copyWith(
          useSharedLogo: value,
          customLogo: value ? _quoteManager.sharedLogo : null,
        ),
      );
    });
  }

  Future<void> _sendQuote() async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Envoyer le devis'),
        content: const Text('Voulez-vous envoyer ce devis par email ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Annuler'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Envoyer'),
          ),
        ],
      ),
    );

    if (result == true) {
      // Créer une page temporaire pour générer le devis
      final quotePage = ProductDetailPage(
        name: 'Devis Multi-Produits',
        imagePath: 'assets/carnet.png',
        price: _quoteManager.totalPrice,
        productType: 'Divers',
      );

      // Obtenir l'état de la page pour accéder aux méthodes
      final quotePageState = quotePage.createState() as _ProductDetailPageState;
      
      // Remplir les informations client (optionnel)
      quotePageState._clientNameController.value.text = 'Client Multi-Produits';
      
      // Générer le corps du devis
      final body = quotePageState._generateMultiProductEmailBody();
      final subject = 'Devis Multi-Produits';

      // Essayer d'envoyer par email
      try {
        final mailtoUri = Uri(
          scheme: 'mailto',
          queryParameters: {
            'subject': subject,
            'body': body,
          },
        );

        if (await canLaunchUrl(mailtoUri)) {
          await launchUrl(mailtoUri);
        } else {
          // Si l'application mail n'est pas disponible, proposer de copier
          await quotePageState._showCopyOptions(context, subject, body);
        }
      } catch (e) {
        // En cas d'erreur, proposer de copier
        await quotePageState._showCopyOptions(context, subject, body);
      }
    }
  }
}

// 6. Widgets personnalisés améliorés
class ColorPickerButton extends StatelessWidget {
  final Color color;
  final ValueChanged<Color> onColorChanged;

  const ColorPickerButton({
    super.key,
    required this.color,
    required this.onColorChanged,
  });

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: () => _showColorPicker(context),
      style: OutlinedButton.styleFrom(
        foregroundColor: color,
        side: BorderSide(color: color),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 16,
            height: 16,
            decoration: BoxDecoration(
              color: color,
              border: Border.all(color: Colors.black),
            ),
          ),
          const SizedBox(width: 8),
          const Text('Couleur du texte'),
        ],
      ),
    );
  }

  void _showColorPicker(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Choisir une couleur'),
        content: SingleChildScrollView(
          child: BlockPicker(
            pickerColor: color,
            onColorChanged: onColorChanged,
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
}

class QuoteBadge extends StatelessWidget {
  const QuoteBadge({super.key});

  @override
  Widget build(BuildContext context) {
    final quoteManager = QuoteManager();
    
    return Badge(
      label: Text(quoteManager.totalQuantity.toString()),
      child: IconButton(
        icon: const Icon(Icons.shopping_basket),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const QuoteSummaryPage(),
            ),
          );
        },
      ),
    );
  }
}

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