import 'package:http/http.dart' as http;
import 'dart:convert';
import 'freelancerdb.dart';

Future<void> envoyerFreelancerAuServeur(Freelancer freelancer) async {
  final url = Uri.parse('http://localhost:3000/api/freelancers'); // remplace par ton IP locale ou en ligne

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'prenom': freelancer.prenom,
      'nom': freelancer.nom,
      'email': freelancer.email,
      'motDePasse': freelancer.motDePasse,
      'dateNaissance': freelancer.dateNaissance,
      'region': freelancer.region,
      'profession': freelancer.profession,
    }),
  );

  if (response.statusCode == 200) {
    print('Données envoyées avec succès !');
  } else {
    print('Erreur : ${response.statusCode}');
  }
}
