import 'dart:convert';
import 'package:http/http.dart' as http;
import 'freelancerdb.dart';  // Pour accéder au modèle Freelancer

Future<void> envoyerFreelancerAuServeur(Freelancer freelancer) async {
  final url = Uri.parse('http://localhost:3000/api/freelancers'); // Mets ici l'URL de ton API

  final Map<String, dynamic> data = {
    'prenom': freelancer.prenom,
    'nom': freelancer.nom,
    'email': freelancer.email,
    'motDePasse': freelancer.motDePasse,
    'dateNaissance': freelancer.dateNaissance,
    'region': freelancer.region,
    'profession': freelancer.profession,
  };

  final response = await http.post(
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonEncode(data),
  );

  if (response.statusCode == 200 || response.statusCode == 201) {
    // Succès
    print('Données envoyées avec succès');
  } else {
    // Erreur
    throw Exception('Erreur lors de l’envoi des données : ${response.statusCode}');
  }
}
