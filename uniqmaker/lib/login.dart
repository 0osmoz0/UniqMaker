import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:collection/collection.dart'; // pour firstWhereOrNull
import 'package:uniqmaker/freelancerdb.dart';

class FreelancerLoginPage extends StatefulWidget {
  const FreelancerLoginPage({Key? key}) : super(key: key);

  @override
  State<FreelancerLoginPage> createState() => _FreelancerLoginPageState();
}

class _FreelancerLoginPageState extends State<FreelancerLoginPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController motDePasseController = TextEditingController();

  bool isLoading = false;
  String? errorMessage;

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      errorMessage = null;
      isLoading = true;
    });

    final email = emailController.text.trim().toLowerCase();
    final motDePasse = motDePasseController.text;

    try {
      final box = await Hive.openBox<Freelancer>('freelancers');

      // Recherche d’un freelancer avec email (insensible à la casse) et mot de passe exact
      final freelancer = box.values
          .cast<Freelancer>()
          .firstWhereOrNull((f) =>
              f.email.trim().toLowerCase() == email && f.motDePasse == motDePasse);

      if (freelancer == null) {
        setState(() {
          errorMessage = "Email ou mot de passe incorrect";
          isLoading = false;
        });
        return;
      }

      // Ici, si tu as un appel serveur à faire, fais-le. Sinon, direct la suite:
      final apiResponse = await verifierConnexionServeur(email, motDePasse);

      if (!apiResponse) {
        setState(() {
          errorMessage = "Erreur de connexion au serveur";
          isLoading = false;
        });
        return;
      }

      // Succès : on navigue vers la page d’accueil ou autre
      setState(() {
        errorMessage = null;
        isLoading = false;
      });

      Navigator.pushReplacementNamed(context, '/HomePage', arguments: freelancer);
    } catch (e) {
      setState(() {
        errorMessage = "Erreur inattendue : $e";
        isLoading = false;
      });
    }
  }

  Future<bool> verifierConnexionServeur(String email, String mdp) async {
    // Simule un appel API, à remplacer par la vraie logique
    await Future.delayed(const Duration(seconds: 1));
    return true;
  }

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
        child: Center(
          child: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  const SizedBox(height: 30),
                  Image.asset('assets/logo.png', width: 100, height: 100),
                  const SizedBox(height: 30),
                  TextFormField(
                    controller: emailController,
                    decoration: _inputDecoration("Email"),
                    style: const TextStyle(color: Colors.white),
                    validator: (value) =>
                        (value == null || value.isEmpty) ? 'Champ requis' : null,
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 15),
                  TextFormField(
                    controller: motDePasseController,
                    decoration: _inputDecoration("Mot de passe"),
                    obscureText: true,
                    style: const TextStyle(color: Colors.white),
                    validator: (value) =>
                        (value == null || value.length < 4) ? 'Min. 4 caractères' : null,
                  ),
                  const SizedBox(height: 15),
                  if (errorMessage != null)
                    Text(
                      errorMessage!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  const SizedBox(height: 15),
                  ElevatedButton(
                    onPressed: isLoading ? null : _login,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF28C36),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : const Text(
                            "Se connecter",
                            style: TextStyle(fontSize: 18),
                          ),
                  ),
                  const SizedBox(height: 20),
                  TextButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/signup');
                    },
                    child: const Text(
                      "Pas encore inscrit ? Créez un compte",
                      style: TextStyle(color: Colors.white70),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
