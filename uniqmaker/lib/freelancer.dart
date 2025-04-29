import 'package:flutter/material.dart';
import 'contrat.dart';

class FreelancerScreen extends StatelessWidget {
  const FreelancerScreen ({super.key});

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
              const SizedBox(height: 60),
              Image.asset(
                'assets/logo.png', // Remplace par ton chemin correct
                width: 100,
                height: 100,
              ),
              const SizedBox(height: 50),
              // Prénom
              TextField(
                decoration: InputDecoration(
                  hintText: 'prénom',
                  hintStyle: TextStyle(color: Colors.grey[600]),
                  filled: true,
                  fillColor: Colors.transparent,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white, width: 2),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white, width: 2),
                  ),
                ),
                style: const TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 20),
              // Nom de famille
              TextField(
                decoration: InputDecoration(
                  hintText: 'nom de famille',
                  hintStyle: TextStyle(color: Colors.grey[600]),
                  filled: true,
                  fillColor: Colors.transparent,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white, width: 2),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white, width: 2),
                  ),
                ),
                style: const TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 30),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder:(context) => FreelancerScreen2(),));
                  },
                  child: const Text(
                    "continuer",
                    style: TextStyle(
                      color: Color(0xFFF28C36),
                      fontSize: 18,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}


class FreelancerScreen2 extends StatelessWidget {
  const FreelancerScreen2 ({super.key});

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
              const SizedBox(height: 60),
              Image.asset(
                'assets/logo.png', // Remplace par ton chemin correct
                width: 100,
                height: 100,
              ),
              const SizedBox(height: 50),
              // Prénom
              TextField(
                decoration: InputDecoration(
                  hintText: 'email',
                  hintStyle: TextStyle(color: Colors.grey[600]),
                  filled: true,
                  fillColor: Colors.transparent,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white, width: 2),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white, width: 2),
                  ),
                ),
                style: const TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 20),
              // Nom de famille
              TextField(
                decoration: InputDecoration(
                  hintText: 'mot de passe',
                  hintStyle: TextStyle(color: Colors.grey[600]),
                  filled: true,
                  fillColor: Colors.transparent,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white, width: 2),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white, width: 2),
                  ),
                ),
                style: const TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 30),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder:(context) => FreelancerInfoScreen(),));
                  },
                  child: const Text(
                    "continuer",
                    style: TextStyle(
                      color: Color(0xFFF28C36),
                      fontSize: 18,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class FreelancerInfoScreen extends StatefulWidget {
  const FreelancerInfoScreen({super.key});

  @override
  State<FreelancerInfoScreen> createState() => _UserInfoScreenState();
}

class _UserInfoScreenState extends State<FreelancerInfoScreen> {
  final TextEditingController _birthDateController = TextEditingController();
  String? selectedRegion;

  final List<String> regions = [
    "Auvergne-Rhône-Alpes",
    "Bourgogne-Franche-Comté",
    "Bretagne",
    "Centre-Val de Loire",
    "Corse",
    "Grand Est",
    "Hauts-de-France",
    "Île-de-France",
    "Normandie",
    "Nouvelle-Aquitaine",
    "Occitanie",
    "Pays de la Loire",
    "Provence-Alpes-Côte d’Azur",
    "Guadeloupe",
    "Martinique",
    "Guyane",
    "La Réunion",
    "Mayotte"
  ];

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
              const SizedBox(height: 60),
              Image.asset(
                'assets/logo.png', // Remplace ce chemin si besoin
                width: 100,
                height: 100,
              ),
              const SizedBox(height: 50),

              // Date de naissance
              TextField(
                controller: _birthDateController,
                keyboardType: TextInputType.datetime,
                decoration: InputDecoration(
                  hintText: 'date de naissance  (jj/mm/aa)',
                  hintStyle: TextStyle(color: Colors.grey[600]),
                  filled: true,
                  fillColor: Colors.transparent,
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide:
                        const BorderSide(color: Colors.white, width: 2),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide:
                        const BorderSide(color: Colors.white, width: 2),
                  ),
                ),
                style: const TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 25),

              // Dropdown de région
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 15),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.white, width: 2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: DropdownButton<String>(
                  isExpanded: true,
                  value: selectedRegion,
                  hint: const Text(
                    'selectionnez une région',
                    style: TextStyle(color: Colors.grey),
                  ),
                  dropdownColor: const Color(0xFFF2B36D),
                  icon: const Icon(Icons.arrow_drop_down, color: Colors.orange),
                  underline: const SizedBox(),
                  onChanged: (String? newValue) {
                    setState(() {
                      selectedRegion = newValue;
                    });
                  },
                  items: regions.map((region) {
                    return DropdownMenuItem<String>(
                      value: region,
                      child: Text(
                        region,
                        style: const TextStyle(color: Colors.white),
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 30),

              // Bouton continuer
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    // Action pour continuer
                    Navigator.push(context, MaterialPageRoute(builder:(context) => ProfessionSelectionScreen(),));
                  },
                  child: const Text(
                    "continuer",
                    style: TextStyle(
                      color: Color(0xFFF28C36),
                      fontSize: 18,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class ProfessionSelectionScreen extends StatefulWidget {
  const ProfessionSelectionScreen({super.key});

  @override
  State<ProfessionSelectionScreen> createState() => _ProfessionSelectionScreenState();
}

class _ProfessionSelectionScreenState extends State<ProfessionSelectionScreen> {
  String? selectedOption;

  final List<String> options = [
    'En poste',
    'Étudiant',
    'Freelancer',
    'Sans emploi',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
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
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Image.asset(
                  'assets/logo.png', // Remplace ce chemin par le bon s’il est différent
                  width: 150,
                  height: 150,
                ),
              ),
              const SizedBox(height: 40),
              ...options.map((option) => Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: _OptionCard(
                  text: option,
                  isSelected: selectedOption == option,
                  onTap: () {
                    setState(() {
                      selectedOption = option;
                    });
                  },
                ),
              )),
              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: selectedOption != null ? () {
                  // Action pour continuer
                  Navigator.push(context, MaterialPageRoute(builder:(context) => SubscriptionSelectionScreen(),));
                } : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF28C36),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Continuer',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OptionCard extends StatelessWidget {
  final String text;
  final bool isSelected;
  final VoidCallback onTap;

  const _OptionCard({
    required this.text,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0x33FFFFFF) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? Color(0xFFF28C36) : Colors.white,
            width: 2,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? Color(0xFFF28C36) : Colors.white,
                  width: 2,
                ),
              ),
              child: isSelected
                  ? const Icon(
                      Icons.check,
                      size: 16,
                      color: Color(0xFFF28C36),
                    )
                  : null,
            ),
            const SizedBox(width: 16),
            Text(
              text,
              style: TextStyle(
                fontSize: 16,
                color: Colors.white,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
