import 'package:hive/hive.dart';

part 'freelancerdb.g.dart';

@HiveType(typeId: 0)
class Freelancer extends HiveObject {
  @HiveField(0)
  String prenom;

  @HiveField(1)
  String nom;

  @HiveField(2)
  String email;

  @HiveField(3)
  String motDePasse;

  @HiveField(4)
  String dateNaissance;

  @HiveField(5)
  String region;

  @HiveField(6)
  String profession;

  Freelancer({
    required this.prenom,
    required this.nom,
    required this.email,
    required this.motDePasse,
    required this.dateNaissance,
    required this.region,
    required this.profession,
  });
}
