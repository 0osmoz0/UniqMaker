import 'package:flutter/material.dart';

class SubscriptionSelectionScreen extends StatefulWidget {
  const SubscriptionSelectionScreen({super.key});

  @override
  State<SubscriptionSelectionScreen> createState() => _SubscriptionSelectionScreenState();
}

class _SubscriptionSelectionScreenState extends State<SubscriptionSelectionScreen> {
  String? selectedPlan;

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
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Logo + back arrow
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                    Image.asset(
                      'assets/logo.png',
                      width: 100,
                      height: 100,
                    ),
                    const SizedBox(width: 48), // espace équivalent au bouton
                  ],
                ),
                const SizedBox(height: 16),
                const Text(
                  'Choisissez votre abonnement',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 24),

                // Option Mensuelle
                _SubscriptionRadio(
                  title: 'Mensuel',
                  price: '9,99€/mois',
                  isSelected: selectedPlan == 'monthly',
                  onTap: () => setState(() => selectedPlan = 'monthly'),
                ),
                const SizedBox(height: 16),

                // Option Annuelle
                _SubscriptionRadio(
                  title: 'Annuel',
                  price: '99€/an',
                  isSelected: selectedPlan == 'yearly',
                  isPopular: true,
                  onTap: () => setState(() => selectedPlan = 'yearly'),
                ),
                const Spacer(),

                ElevatedButton(
                  onPressed: selectedPlan != null
                      ? () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => PaymentScreen(
                                plan: selectedPlan!,
                                planPrice: selectedPlan == 'monthly' ? 9.99 : 99.0,
                              ),
                            ),
                          );
                        }
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFF28C36),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 2,
                  ),
                  child: const Text(
                    'Continuer',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SubscriptionRadio extends StatelessWidget {
  final String title;
  final String price;
  final bool isSelected;
  final bool isPopular;
  final VoidCallback onTap;

  const _SubscriptionRadio({
    required this.title,
    required this.price,
    required this.isSelected,
    this.isPopular = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white.withOpacity(0.9) : Colors.white.withOpacity(0.6),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? Color(0xFFF28C36) : Colors.white70,
            width: 2,
          ),
        ),
        child: Row(
          children: [
            Radio<String>(
              value: title,
              groupValue: isSelected ? title : null,
              onChanged: (_) => onTap(),
              activeColor: Color(0xFFF28C36),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF333333),
                    ),
                  ),
                  Text(
                    price,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF333333),
                    ),
                  ),
                  if (isPopular)
                    Container(
                      margin: const EdgeInsets.only(top: 6),
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.amber.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        'Le plus populaire',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.amber.shade900,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class PaymentScreen extends StatelessWidget {
  final String plan;
  final double planPrice;

  const PaymentScreen({
    super.key,
    required this.plan,
    required this.planPrice,
  });

  @override
  Widget build(BuildContext context) {
    final double vat = planPrice * 0.2;
    final double total = planPrice + vat;

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
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Top Bar
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                    Image.asset(
                      'assets/logo.png',
                      width: 100,
                      height: 100,
                    ),
                    const SizedBox(width: 48),
                  ],
                ),
                const SizedBox(height: 16),
                const Text(
                  'Résumé de la commande',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.9),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      _buildSummaryRow('Abonnement ${plan == 'monthly' ? 'mensuel' : 'annuel'}', '${planPrice.toStringAsFixed(2)} €'),
                      const Divider(),
                      _buildSummaryRow('TVA (20%)', '${vat.toStringAsFixed(2)} €'),
                      const Divider(),
                      _buildSummaryRow('Total', '${total.toStringAsFixed(2)} €', isTotal: true),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                const Text(
                  'Informations de paiement',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 16),
                _buildInput('Nom sur la carte'),
                const SizedBox(height: 16),
                _buildInput('Numéro de carte', keyboardType: TextInputType.number),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: _buildInput('Date d\'expiration')),
                    const SizedBox(width: 16),
                    Expanded(child: _buildInput('Code de sécurité', keyboardType: TextInputType.number)),
                  ],
                ),
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Paiement en cours de traitement...')),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFF28C36),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text('Payer maintenant', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInput(String label, {TextInputType? keyboardType}) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: label,
        filled: true,
        fillColor: Colors.white,
        border: const OutlineInputBorder(),
      ),
      keyboardType: keyboardType,
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 16, fontWeight: isTotal ? FontWeight.bold : FontWeight.normal)),
          Text(value, style: TextStyle(fontSize: 16, fontWeight: isTotal ? FontWeight.bold : FontWeight.normal)),
        ],
      ),
    );
  }
}
