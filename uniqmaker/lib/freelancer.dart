import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:uniqmaker/envoyer_api.dart';
import 'package:uniqmaker/freelancerdb.dart';
import 'package:uniqmaker/subscribe.dart';

class FreelancerSignupPage extends StatefulWidget {
  const FreelancerSignupPage({super.key});

  @override
  State<FreelancerSignupPage> createState() => _FreelancerSignupPageState();
}

class _FreelancerSignupPageState extends State<FreelancerSignupPage> {
  final _formKey = GlobalKey<FormState>();

  final prenomController = TextEditingController();
  final nomController = TextEditingController();
  final emailController = TextEditingController();
  final motDePasseController = TextEditingController();
  final naissanceController = TextEditingController();

  String? selectedRegion;
  String? selectedProfession;

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

  final List<String> professions = [
    'En poste',
    'Étudiant',
    'Freelancer',
    'Sans emploi',
  ];

  InputDecoration _inputDecoration(String hint) => InputDecoration(
        hintText: hint,
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
      );

  Future<void> _submit() async {
    if (_formKey.currentState!.validate() &&
        selectedRegion != null &&
        selectedProfession != null) {
      final freelancer = Freelancer(
        prenom: prenomController.text,
        nom: nomController.text,
        email: emailController.text,
        motDePasse: motDePasseController.text,
        dateNaissance: naissanceController.text,
        region: selectedRegion!,
        profession: selectedProfession!,
      );

      final box = await Hive.openBox<Freelancer>('freelancers');
      await box.add(freelancer);
      await envoyerFreelancerAuServeur(freelancer);

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Inscription réussie ✅"),
          backgroundColor: Colors.green,
        ),
      );

      _formKey.currentState!.reset();
      setState(() {
        selectedRegion = null;
        selectedProfession = null;
      });

      await Future.delayed(const Duration(seconds: 1));
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const SubscriptionSelectionScreen(),
        ),
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
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                const SizedBox(height: 60),
                Image.asset('assets/logo.png', width: 100, height: 100),
                const SizedBox(height: 30),
                _buildTextField(prenomController, "Prénom"),
                const SizedBox(height: 15),
                _buildTextField(nomController, "Nom de famille"),
                const SizedBox(height: 15),
                _buildTextField(emailController, "Email"),
                const SizedBox(height: 15),
                _buildTextField(motDePasseController, "Mot de passe", isPassword: true),
                const SizedBox(height: 15),
                _buildTextField(naissanceController, "Date de naissance (jj/mm/aa)"),
                const SizedBox(height: 15),
                _buildDropdown(
                  value: selectedRegion,
                  hint: "Région",
                  items: regions,
                  onChanged: (val) => setState(() => selectedRegion = val),
                ),
                const SizedBox(height: 15),
                _buildDropdown(
                  value: selectedProfession,
                  hint: "Profession",
                  items: professions,
                  onChanged: (val) => setState(() => selectedProfession = val),
                ),
                const SizedBox(height: 30),
                ElevatedButton(
                  onPressed: _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF28C36),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    minimumSize: const Size.fromHeight(50),
                  ),
                  child: const Text(
                    "S'inscrire",
                    style: TextStyle(fontSize: 18),
                  ),
                ),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint,
      {bool isPassword = false}) {
    return TextFormField(
      controller: controller,
      obscureText: isPassword,
      style: const TextStyle(color: Colors.white),
      decoration: _inputDecoration(hint),
      validator: (value) => value!.isEmpty ? 'Champ requis' : null,
    );
  }

  Widget _buildDropdown({
    required String? value,
    required String hint,
    required List<String> items,
    required ValueChanged<String?> onChanged,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      decoration: _inputDecoration(hint),
      dropdownColor: const Color(0xFFF2B36D),
      iconEnabledColor: Colors.white,
      style: const TextStyle(color: Colors.white),
      onChanged: onChanged,
      validator: (val) => val == null ? 'Sélection obligatoire' : null,
      items: items
          .map((item) => DropdownMenuItem(
                value: item,
                child: Text(item, style: const TextStyle(color: Colors.white)),
              ))
          .toList(),
    );
  }
}
