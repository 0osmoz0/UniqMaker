import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  File? profileImageFile;
  String name = 'Sophie Martin';
  String bio = 'Créatrice de produits artisanaux';

  Future<void> _pickImage(bool isProfile) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        profileImageFile = File(pickedFile.path);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    const Color primaryOrange = Color(0xFFF07F3C);
    const Color lightOrange = Color(0xFFF8A45D);
    const Color darkOrange = Color(0xFFE05A2A);
    const Color beige = Color(0xFFF5E6D3);
    const Color lightBeige = Color(0xFFFAF3E8);

    return Scaffold(
      backgroundColor: lightBeige,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 280.0,
            pinned: true,
            backgroundColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text('Mon Profil',
                  style: TextStyle(color: Colors.white, fontSize: 18)),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [primaryOrange, lightOrange],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                  ),
                  Positioned(
                    top: -50,
                    left: -50,
                    child: _buildCircle(180, Colors.white.withOpacity(0.1)),
                  ),
                  Positioned(
                    bottom: -40,
                    right: -30,
                    child: _buildCircle(100, Colors.white.withOpacity(0.15)),
                  ),
                  Positioned(
                    top: 80,
                    left: 0,
                    right: 0,
                    child: CustomPaint(
                      painter: WavePainter(),
                      size: const Size(double.infinity, 80),
                    ),
                  ),
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        GestureDetector(
                          onTap: () => _pickImage(true),
                          child: CircleAvatar(
                            radius: 50,
                            backgroundImage: profileImageFile != null
                                ? FileImage(profileImageFile!)
                                : const AssetImage('assets/profile.jpg')
                                    as ImageProvider,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(name,
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text(bio,
                            style: const TextStyle(
                                color: Colors.white, fontSize: 14)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.edit, color: Colors.white),
                onPressed: () {
                  // Implémente la modification ici
                },
              ),
            ],
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  _buildInfoCard(beige, primaryOrange),
                  const SizedBox(height: 20),
                  _buildStatsSection(primaryOrange, lightOrange, beige),
                  const SizedBox(height: 20),
                  _buildBadgesSection(beige, primaryOrange),
                  const SizedBox(height: 20),
                  _buildRecentProducts(primaryOrange, beige),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard(Color bgColor, Color textColor) {
    return Card(
      color: bgColor,
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildInfoRow(Icons.email, 'sophie.martin@example.com', textColor),
            const Divider(height: 20),
            _buildInfoRow(Icons.phone, '+33 6 12 34 56 78', textColor),
            const Divider(height: 20),
            _buildInfoRow(Icons.location_on, 'Paris, France', textColor),
            const Divider(height: 20),
            _buildInfoRow(Icons.work, 'Freelance depuis 2020', textColor),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text, Color color) {
    return Row(
      children: [
        Icon(icon, color: color.withOpacity(0.8)),
        const SizedBox(width: 16),
        Expanded(child: Text(text, style: TextStyle(color: color))),
      ],
    );
  }

  Widget _buildStatsSection(Color primary, Color secondary, Color bg) {
    return Card(
      color: bg,
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Mes Statistiques',
                style: TextStyle(
                    fontSize: 18, fontWeight: FontWeight.bold, color: primary)),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem('10500 €', 'CA 2023', primary),
                _buildStatItem('42', 'Produits vendus', primary),
                _buildStatItem('4.8', 'Note moyenne', primary),
              ],
            ),
            const SizedBox(height: 16),
            LinearProgressIndicator(
              value: 0.75,
              backgroundColor: secondary.withOpacity(0.2),
              color: secondary,
              minHeight: 8,
              borderRadius: BorderRadius.circular(4),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Objectif annuel',
                    style: TextStyle(color: primary.withOpacity(0.8))),
                Text('75%',
                    style:
                        TextStyle(color: primary, fontWeight: FontWeight.bold)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String value, String label, Color color) {
    return Column(
      children: [
        Text(value,
            style: TextStyle(
                fontSize: 20, fontWeight: FontWeight.bold, color: color)),
        const SizedBox(height: 4),
        Text(label,
            style: TextStyle(fontSize: 12, color: color.withOpacity(0.6))),
      ],
    );
  }

  Widget _buildBadgesSection(Color bg, Color color) {
    final badges = [
      {'icon': Icons.star, 'label': 'Vendeur ⭐'},
      {'icon': Icons.local_fire_department, 'label': 'Top ventes 🔥'},
      {'icon': Icons.verified, 'label': 'Profil vérifié ✅'},
    ];

    return Card(
      color: bg,
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Badges gagnés',
                style: TextStyle(
                    fontSize: 18, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 12,
              runSpacing: 8,
              children: badges
                  .map((badge) => Chip(
                        avatar: Icon(badge['icon'] as IconData, size: 18),
                        label: Text(badge['label'] as String),
                        backgroundColor: Colors.white,
                        elevation: 1,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(color: color.withOpacity(0.3)),
                        ),
                      ))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentProducts(Color primary, Color bg) {
    final recentProducts = [
      {'name': 'Sac en cuir', 'date': '15/05/2023', 'price': '89 €'},
      {'name': 'Tote bag', 'date': '12/05/2023', 'price': '45 €'},
      {'name': 'Mug personnalisé', 'date': '08/05/2023', 'price': '22 €'},
      {'name': 'Carnet artisan', 'date': '02/05/2023', 'price': '35 €'},
    ];

    return Card(
      color: bg,
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Produits récents',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: primary)),
                TextButton(
                  onPressed: () {
                    // Voir tout
                  },
                  child: Text('Voir tout', style: TextStyle(color: primary)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ...recentProducts.map((product) => ListTile(
                  leading: Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.shopping_bag, color: Colors.grey),
                  ),
                  title: Text(product['name']!,
                      style: TextStyle(
                          fontWeight: FontWeight.w500,
                          color: primary.withOpacity(0.8))),
                  subtitle: Text(product['date']!,
                      style: TextStyle(color: primary.withOpacity(0.5))),
                  trailing: Text(product['price']!,
                      style: TextStyle(
                          fontWeight: FontWeight.bold, color: primary)),
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildCircle(double size, Color color) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(shape: BoxShape.circle, color: color),
    );
  }
}

class WavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.white.withOpacity(0.1);
    final path = Path();
    path.lineTo(0, size.height * 0.7);
    path.quadraticBezierTo(
        size.width * 0.25, size.height, size.width * 0.5, size.height * 0.7);
    path.quadraticBezierTo(
        size.width * 0.75, size.height * 0.4, size.width, size.height * 0.6);
    path.lineTo(size.width, 0);
    path.close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
