import 'package:flutter/material.dart';
import 'package:signature/signature.dart';
import 'package:flutter/services.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:uniqmaker/freelancerHome.dart';
import 'package:open_file/open_file.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

class ContractSignatureScreen extends StatefulWidget {
  const ContractSignatureScreen({super.key});

  @override
  State<ContractSignatureScreen> createState() => _ContractSignatureScreenState();
}

class _ContractSignatureScreenState extends State<ContractSignatureScreen> {
  final SignatureController _signatureController = SignatureController(
    penStrokeWidth: 3,
    penColor: Colors.black,
  );
  bool _isContractGenerated = false;
  bool _isContractRead = false;
  File? _generatedContract;

  @override
  void dispose() {
    _signatureController.dispose();
    super.dispose();
  }

  Future<void> _generateContract() async {
    try {
      final pdf = pw.Document();
      pdf.addPage(
        pw.Page(
          build: (pw.Context context) {
            return pw.Column(
              children: [
                pw.Header(level: 0, text: 'Contrat Uniqmaker'),
                pw.Paragraph(text: 'Ceci est votre contrat officiel avec Uniqmaker.'),
                pw.Paragraph(text: 'En signant ce document, vous acceptez les termes et conditions.'),
                pw.SizedBox(height: 20),
                pw.Header(level: 1, text: 'Détails du contrat'),
              ],
            );
          },
        ),
      );

      final output = await getTemporaryDirectory();
      final file = File('${output.path}/contrat_uniqmaker.pdf');
      await file.writeAsBytes(await pdf.save());

      setState(() {
        _generatedContract = file;
        _isContractGenerated = true;
        _isContractRead = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Contrat généré avec succès')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur lors de la génération: $e')),
      );
    }
  }

  Future<void> _viewContract() async {
    if (_generatedContract != null) {
      await OpenFile.open(_generatedContract!.path);
      setState(() {
        _isContractRead = true;
      });
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
              const SizedBox(height: 60),
              Image.asset(
                'assets/logo.png',
                width: 100,
                height: 100,
                errorBuilder: (_, __, ___) => const Icon(Icons.description, size: 100, color: Colors.white),
              ),
              const SizedBox(height: 40),
              const Text(
                "Signez votre contrat",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 30),

              if (!_isContractGenerated)
                ElevatedButton(
                  onPressed: _generateContract,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF28C36),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text("Générer le contrat"),
                ),

              if (_isContractGenerated) ...[
                ElevatedButton(
                  onPressed: _viewContract,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text("Lire et approuver"),
                ),
                const SizedBox(height: 20),
                const Text(
                  "Veuillez lire le contrat avant de signer",
                  style: TextStyle(color: Colors.white),
                ),
              ],

              const SizedBox(height: 30),

              if (_isContractRead) ...[
                Container(
                  height: 200,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                  child: Signature(
                    controller: _signatureController,
                    backgroundColor: Colors.transparent,
                  ),
                ),
                const SizedBox(height: 20),
              ],

              if (_isContractRead) ...[
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () async {
                          if (_signatureController.isNotEmpty) {
                            final signature = await _signatureController.toPngBytes();
                            if (signature != null) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Contrat signé avec succès')),
                              );

                              // Redirige vers la HomePage
                              Future.delayed(const Duration(milliseconds: 800), () {
                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(builder: (context) => const HomePage()),
                                );
                              });
                            }
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Veuillez signer le contrat')),
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFF28C36),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text("Signer"),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () => _signatureController.clear(),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red.shade400,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text("Effacer"),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 30),
              ],
            ],
          ),
        ),
      ),
    );
  }
}