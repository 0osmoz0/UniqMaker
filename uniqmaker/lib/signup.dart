import 'package:flutter/material.dart';
import 'package:uniqmaker/freelancer.dart';
import 'package:uniqmaker/user_side.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String? selectedRole;

  void _navigateBasedOnRole() {
    if (selectedRole == 'User') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const UserScreen()),
      );
    } else if (selectedRole == 'Freelancer') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const FreelancerScreen()),
      );
    } else {
      // Optionnel: afficher un message si aucun choix n'est fait
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez sélectionner un rôle')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0, -0.2),
            radius: 1.2,
            colors: [
              Color(0xFFFFE5C2),
              Color(0xFFF2B36D),
            ],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 50),
              Column(
                children: [
                  Image.asset(
                    'assets/logo.png',
                    width: 150,
                    height: 150,
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  "Pourquoi êtes-vous là ?",
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Column(
                children: [
                  RadioListTile<String>(
                    title: const Text(
                      "User",
                      style: TextStyle(color: Colors.white),
                    ),
                    value: "User",
                    groupValue: selectedRole,
                    activeColor: Color(0xFFF28C36),
                    onChanged: (value) {
                      setState(() {
                        selectedRole = value;
                      });
                    },
                  ),
                  RadioListTile<String>(
                    title: const Text(
                      "Freelancer",
                      style: TextStyle(color: Colors.white),
                    ),
                    value: "Freelancer",
                    groupValue: selectedRole,
                    activeColor: Color(0xFFF28C36),
                    onChanged: (value) {
                      setState(() {
                        selectedRole = value;
                      });
                    },
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton(
                  onPressed: _navigateBasedOnRole,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    elevation: 0,
                    shadowColor: Colors.transparent,
                    padding: EdgeInsets.zero,
                  ),
                  child: const Text(
                    "continuer",
                    style: TextStyle(
                      color: Color(0xFFF28C36),
                      fontSize: 20,
                    ),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}