import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:mailer/mailer.dart';
import 'package:mailer/smtp_server.dart';

class ClientMeetingPage extends StatefulWidget {
  @override
  _ClientMeetingPageState createState() => _ClientMeetingPageState();
}

class _ClientMeetingPageState extends State<ClientMeetingPage> {
  final _formKey = GlobalKey<FormState>();
  final _descriptionController = TextEditingController();
  File? _selectedImage;
  File? _selectedFile;
  bool _isSending = false;

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _selectedImage = File(pickedFile.path);
      });
    }
  }

  Future<void> _pickFile() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _selectedFile = File(pickedFile.path);
      });
    }
  }

  Future<void> _submitRequest() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSending = true);

    try {
      // Configuration SMTP avec ton compte Gmail
      final smtpServer = SmtpServer(
        'smtp.gmail.com',
        port: 587,
        username: 'uniqmaker4@gmail.com',
        password: 'urvb oxpl hghm yqkd', // ← remplace par ton mot de passe d'application
        ignoreBadCertificate: false,
        ssl: false,
        allowInsecure: false,
      );

      final message = Message()
        ..from = Address('uniqmaker4@gmail.com', 'UniqMaker')
        ..recipients.add('uniqmaker4@gmail.com') // ← peut être toi-même ou une autre adresse
        ..subject = 'Demande client - ${DateTime.now()}'
        ..text = _descriptionController.text
        ..attachments = [];

      if (_selectedImage != null) {
        message.attachments.add(FileAttachment(_selectedImage!));
      }
      if (_selectedFile != null) {
        message.attachments.add(FileAttachment(_selectedFile!));
      }

      await send(message, smtpServer);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Demande envoyée avec succès!')),
      );

      _formKey.currentState!.reset();
      setState(() {
        _selectedImage = null;
        _selectedFile = null;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur lors de l\'envoi : $e')),
      );
    } finally {
      setState(() => _isSending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Demande particulière')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Description de votre demande', style: TextStyle(fontWeight: FontWeight.bold)),
              SizedBox(height: 8),
              TextFormField(
                controller: _descriptionController,
                maxLines: 5,
                decoration: InputDecoration(
                  hintText: 'Décrivez votre demande...',
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value == null || value.isEmpty ? 'Veuillez décrire votre demande' : null,
              ),
              SizedBox(height: 20),
              Text('Photo (optionnel)', style: TextStyle(fontWeight: FontWeight.bold)),
              _selectedImage == null
                  ? ElevatedButton(onPressed: _pickImage, child: Text('Ajouter une photo'))
                  : Stack(
                      children: [
                        Image.file(_selectedImage!, height: 150, fit: BoxFit.cover),
                        Positioned(
                          top: 8,
                          right: 8,
                          child: IconButton(icon: Icon(Icons.close, color: Colors.red), onPressed: () => setState(() => _selectedImage = null)),
                        ),
                      ],
                    ),
              SizedBox(height: 20),
              Text('Fichier (optionnel)', style: TextStyle(fontWeight: FontWeight.bold)),
              _selectedFile == null
                  ? ElevatedButton(onPressed: _pickFile, child: Text('Joindre un fichier'))
                  : ListTile(
                      leading: Icon(Icons.insert_drive_file),
                      title: Text(_selectedFile!.path.split('/').last),
                      trailing: IconButton(icon: Icon(Icons.close), onPressed: () => setState(() => _selectedFile = null)),
                    ),
              SizedBox(height: 30),
              Center(
                child: ElevatedButton(
                  onPressed: _isSending ? null : _submitRequest,
                  child: _isSending ? CircularProgressIndicator(color: Colors.white) : Text('Envoyer la demande'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
