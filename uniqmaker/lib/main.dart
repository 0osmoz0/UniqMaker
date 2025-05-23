import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'package:uniqmaker/SplashScreen.dart';
import 'package:uniqmaker/freelancerdb.dart'; // Ton modèle Hive
import 'package:uniqmaker/login.dart'; // Ta page login
import 'package:uniqmaker/signup.dart'; // Ta page signup
import 'package:uniqmaker/freelancerHome.dart'; // Ta page d’accueil

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Hive.initFlutter();
  Hive.registerAdapter(FreelancerAdapter());
  await Hive.openBox<Freelancer>('freelancers');

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'UniqMaker',
      initialRoute: '/', // Route de démarrage
      routes: {
        '/': (context) => const UltimateSplashScreen(),
        '/login': (context) => const FreelancerLoginPage(),
        '/signup': (context) => const HomeScreen(),
        '/HomePage': (context) => const HomePage(),
      },
    );
  }
}
