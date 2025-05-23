import 'package:flutter/material.dart';
import 'package:animated_bottom_navigation_bar/animated_bottom_navigation_bar.dart';
import 'package:uniqmaker/catalogue.dart'; 

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  final iconList = <IconData>[
    Icons.home_rounded,
    Icons.shopping_bag_rounded,
    Icons.bar_chart_rounded,
    Icons.video_collection_rounded,
  ];

  final List<String> labels = [
    "Accueil",
    "Catalogue",
    "Stats",
    "Vidéos",
  ];

  final List<Map<String, String>> categories = [
    {"name": "Sac", "image": "assets/sac.png"},
    {"name": "Textile", "image": "assets/textile.png"},
    {"name": "Tote", "image": "assets/tote.png"},
    {"name": "Carnet", "image": "assets/carnet.png"},
    {"name": "Mug", "image": "assets/mug.png"},
    {"name": "Stylo", "image": "assets/stylo.png"},
  ];

  final List<Map<String, String>> promotions = [
    {"discount": "15%", "image": "assets/sac.png"},
    {"discount": "20%", "image": "assets/tote.png"},
    {"discount": "30%", "image": "assets/mug.png"},
    {"discount": "10%", "image": "assets/stylo.png"},
    {"discount": "50%", "image": "assets/textile.png"},
  ];

  void _onNavBarTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Widget _buildBody() {
    switch (_selectedIndex) {
      case 0:
        return _buildHomeContent();
      case 1:
        return CataloguePage();
      default:
        return const Center(child: Text("Page en cours de construction..."));
    }
  }

  Widget _buildHomeContent() {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Colors.transparent,
        title: const Text(
          "Accueil",
          style: TextStyle(color: Colors.deepOrange, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.only(bottom: 80),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.orange[100],
                    borderRadius: BorderRadius.circular(20),
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Votre slogan ici",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.deepOrange,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                        style: TextStyle(color: Colors.black87),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Colors.deepOrange,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                        child: const Text("Voir le catalogue"),
                      ),
                    ],
                  ),
                ),
              ),

              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16.0),
                child: Text("Catégories", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 8),

              SizedBox(
                height: 140,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: categories.length,
                  itemBuilder: (context, index) {
                    return CategoryCard(
                      name: categories[index]['name']!,
                      imagePath: categories[index]['image']!,
                    );
                  },
                ),
              ),

              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 12),
                child: Text("Promotion d’aujourd’hui", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
              ),

              SizedBox(
                height: 180,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: promotions.length,
                  itemBuilder: (context, index) {
                    return PromoCard(
                      discount: promotions[index]['discount']!,
                      imagePath: promotions[index]['image']!,
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _buildBody(),
      bottomNavigationBar: AnimatedBottomNavigationBar.builder(
        itemCount: iconList.length,
        tabBuilder: (index, isActive) {
          final color = isActive ? Colors.deepOrange : Colors.grey;
          return Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(iconList[index], color: color, size: 26),
              const SizedBox(height: 4),
              Text(
                labels[index],
                style: TextStyle(color: color, fontWeight: FontWeight.w600, fontSize: 12),
              ),
            ],
          );
        },
        backgroundColor: Colors.white,
        activeIndex: _selectedIndex,
        gapLocation: GapLocation.none,
        notchSmoothness: NotchSmoothness.defaultEdge,
        onTap: _onNavBarTapped,
        splashColor: Colors.orange,
        scaleFactor: 1.2,
        elevation: 8,
      ),
    );
  }
}

class CategoryCard extends StatelessWidget {
  final String name;
  final String imagePath;

  const CategoryCard({super.key, required this.name, required this.imagePath});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Action à définir
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: Column(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Container(
                width: 100,
                height: 100,
                color: Colors.grey[300],
                child: Image.asset(imagePath, fit: BoxFit.cover),
              ),
            ),
            const SizedBox(height: 4),
            Text(name, style: const TextStyle(color: Colors.orange)),
          ],
        ),
      ),
    );
  }
}

class PromoCard extends StatelessWidget {
  final String discount;
  final String imagePath;

  const PromoCard({super.key, required this.discount, required this.imagePath});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Container(
              width: 140,
              height: 180,
              color: Colors.grey[200],
              child: Image.asset(imagePath, fit: BoxFit.cover),
            ),
          ),
          Positioned(
            top: 10,
            left: 10,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.deepOrange,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(discount, style: const TextStyle(color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }
}
