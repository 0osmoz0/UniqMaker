import 'package:flutter/material.dart';

class CataloguePage extends StatelessWidget {
  final List<String> categories = [
    "Textile", "Bureau", "Drinkware", "Parapluies", "Sport", "Technologie", "Écologique"
  ];

  final List<Map<String, String>> bestSellers = [
    {"name": "T-shirt Bio", "image": "assets/textile.png", "price": "12€"},
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
        title: const Text("Catalogue", style: TextStyle(fontWeight: FontWeight.w600)),
        backgroundColor: Colors.deepOrange,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: CircleAvatar(
              backgroundImage: AssetImage("assets/profile.jpg"),
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
                onPressed: () {},
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
                return ProductCard(
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

class ProductCard extends StatelessWidget {
  final String name;
  final String imagePath;
  final String price;

  const ProductCard({
    super.key,
    required this.name,
    required this.imagePath,
    required this.price,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
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
      child: InkWell(
        onTap: () {},
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              child: Image.asset(imagePath, height: 100, width: double.infinity, fit: BoxFit.cover),
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

  const SuggestionTile({
    super.key,
    required this.name,
    required this.imagePath,
    required this.desc,
    required this.price,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
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
    );
  }
}
