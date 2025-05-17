// PARTIE MODIFIÉE SELON TA DEMANDE

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:uniqmaker/ProfilePage.dart';


class ExercisesListPage extends StatelessWidget {
  const ExercisesListPage({super.key});

  final List<Exercise> exercises = const [
    Exercise(
      id: 1,
      title: 'Chapitre 1 : Introduction à la vente',
      description: 'Comprendre les fondamentaux de la vente.',
      questions: [
        Question(
          text: 'Quel est le but principal de la vente ?',
          choices: [
            'Augmenter le chiffre d’affaires',
            'Satisfaire les besoins du client',
            'Faire de la publicité',
            'Avoir un stock important',
          ],
          correctAnswerIndex: 1,
        ),
        Question(
          text: 'Quelle est la première étape d’un processus de vente ?',
          choices: [
            'Négociation',
            'Fermeture',
            'Prospection',
            'Relance',
          ],
          correctAnswerIndex: 2,
        ),
      ],
      resources: [
        Resource(
          type: ResourceType.article,
          title: 'Qu’est-ce que la vente ?',
          url: 'https://www.actionco.fr/Thematique/strategie-commerciale-1218/Breves/Definition-de-la-vente-217930.htm',
        ),
        Resource(
          type: ResourceType.video,
          title: 'Fondamentaux de la vente - YouTube',
          url: 'https://www.youtube.com/watch?v=8KZstG0tX34&list=PL9F-SyinVB59s_ImlmXoy1VXrPvhggyiU',
        ),
      ],
    ),
    Exercise(
      id: 2,
      title: 'Chapitre 2 : Techniques de vente',
      description: 'Approfondir les méthodes pour convaincre un client.',
      questions: [
        Question(
          text: 'Quelle technique consiste à poser des questions pour cerner le besoin ?',
          choices: ['Méthode SONCAS', 'Méthode CAP', 'Méthode QQOQCCP', 'Méthode SPIN'],
          correctAnswerIndex: 3,
        ),
        Question(
          text: 'Que signifie le "S" dans SONCAS ?',
          choices: ['Sécurité', 'Satisfaction', 'Service', 'Sincérité'],
          correctAnswerIndex: 0,
        ),
      ],
      resources: [
        Resource(
          type: ResourceType.pdf,
          title: 'Méthodes de vente efficaces (PDF)',
          url: 'https://ressources.aunege.fr/nuxeo/site/esupversions/04c1a56a-bf85-4d1c-96e7-46c2b94e96b1',
        ),
      ],
    ),
    Exercise(
      id: 3,
      title: 'Chapitre 3 : Négociation commerciale',
      description: 'Gérer une négociation avec succès.',
      questions: [
        Question(
          text: 'Quel est l’objectif principal d’une négociation ?',
          choices: ['Conclure rapidement', 'Gagner à tout prix', 'Trouver un accord mutuel', 'Impressionner le client'],
          correctAnswerIndex: 2,
        ),
        Question(
          text: 'Quand faut-il faire des concessions ?',
          choices: [
            'En début d’entretien',
            'Quand le client menace de partir',
            'Quand c’est justifié pour les deux parties',
            'Dès que le client est mécontent'
          ],
          correctAnswerIndex: 2,
        ),
      ],
      resources: [
        Resource(
          type: ResourceType.article,
          title: 'Les bases de la négociation',
          url: 'https://www.lecoindesentrepreneurs.fr/negociation-commerciale/',
        ),
      ],
    ),
    Exercise(
      id: 4,
      title: 'Chapitre 4 : Relation client',
      description: 'Fidéliser et comprendre le client.',
      questions: [
        Question(
          text: 'Quel outil est souvent utilisé pour gérer les relations clients ?',
          choices: ['Excel', 'ERP', 'CRM', 'Google Drive'],
          correctAnswerIndex: 2,
        ),
        Question(
          text: 'Pourquoi la relation client est-elle importante ?',
          choices: [
            'Pour vendre plus rapidement',
            'Pour fidéliser le client',
            'Pour réduire les coûts',
            'Pour éviter les concurrents',
          ],
          correctAnswerIndex: 1,
        ),
      ],
      resources: [
        Resource(
          type: ResourceType.video,
          title: 'Comprendre la relation client',
          url: 'https://www.youtube.com/watch?v=k8oKM5BNFwE',
        ),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text(
          'QCM Commerce & Vente',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: GestureDetector(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => const ProfilePage()));
              },
              child: const CircleAvatar(
                radius: 20,
                backgroundImage: AssetImage('assets/profile.jpg'),
              ),
            ),
          ),
        ],
        centerTitle: true,
      ),
      body: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: exercises.length,
        itemBuilder: (context, index) {
          final exercise = exercises[index];
          return Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            color: Colors.orange[50],
            margin: const EdgeInsets.only(bottom: 16),
            child: ListTile(
              title: Text(exercise.title,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              subtitle: Text(exercise.description),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => QcmPage(exercise: exercise),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class QcmPage extends StatefulWidget {
  final Exercise exercise;
  const QcmPage({super.key, required this.exercise});

  @override
  State<QcmPage> createState() => _QcmPageState();
}

class _QcmPageState extends State<QcmPage> {
  final Map<int, int> selectedAnswers = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.exercise.title)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(widget.exercise.description, style: const TextStyle(fontSize: 16)),
          const SizedBox(height: 24),
          for (int i = 0; i < widget.exercise.questions.length; i++)
            _buildQuestion(i, widget.exercise.questions[i]),
          const SizedBox(height: 32),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
            ),
            onPressed: _submitAnswers,
            child: const Text('Soumettre mes réponses'),
          ),
          const SizedBox(height: 24),
          if (widget.exercise.resources.isNotEmpty)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Ressources associées :',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                ...widget.exercise.resources.map((r) => ListTile(
                      leading: Icon(r.icon, color: r.color),
                      title: Text(r.title),
                      onTap: () => launchUrl(Uri.parse(r.url)),
                    )),
              ],
            ),
        ],
      ),
    );
  }

  Widget _buildQuestion(int index, Question question) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Q${index + 1}. ${question.text}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            for (int i = 0; i < question.choices.length; i++)
              RadioListTile<int>(
                title: Text(question.choices[i]),
                value: i,
                groupValue: selectedAnswers[index],
                onChanged: (value) {
                  setState(() {
                    selectedAnswers[index] = value!;
                  });
                },
              ),
          ],
        ),
      ),
    );
  }

  void _submitAnswers() {
    int correct = 0;
    for (int i = 0; i < widget.exercise.questions.length; i++) {
      if (selectedAnswers[i] == widget.exercise.questions[i].correctAnswerIndex) {
        correct++;
      }
    }

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Résultat'),
        content: Text('Vous avez ${correct} bonne(s) réponse(s) sur ${widget.exercise.questions.length}.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}

// === DATA CLASSES ===

class Exercise {
  final int id;
  final String title;
  final String description;
  final List<Question> questions;
  final List<Resource> resources;

  const Exercise({
    required this.id,
    required this.title,
    required this.description,
    required this.questions,
    this.resources = const [],
  });
}

class Question {
  final String text;
  final List<String> choices;
  final int correctAnswerIndex;

  const Question({
    required this.text,
    required this.choices,
    required this.correctAnswerIndex,
  });
}

enum ResourceType { video, pdf, article }

class Resource {
  final ResourceType type;
  final String title;
  final String url;

  const Resource({
    required this.type,
    required this.title,
    required this.url,
  });

  IconData get icon {
    switch (type) {
      case ResourceType.video:
        return Icons.video_library;
      case ResourceType.pdf:
        return Icons.picture_as_pdf;
      case ResourceType.article:
        return Icons.article;
    }
  }

  Color get color {
    switch (type) {
      case ResourceType.video:
        return Colors.red;
      case ResourceType.pdf:
        return Colors.redAccent;
      case ResourceType.article:
        return Colors.blue;
    }
  }
}
