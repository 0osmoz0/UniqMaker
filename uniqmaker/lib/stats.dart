import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class FreelancerStatsPage extends StatelessWidget {
  const FreelancerStatsPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Définition de la palette de couleurs
    const Color primaryOrange = Color(0xFFF07F3C);
    const Color lightOrange = Color(0xFFF8A45D);
    const Color darkOrange = Color(0xFFE05A2A);
    const Color beige = Color(0xFFF5E6D3);
    const Color lightBeige = Color(0xFFFAF3E8);
    const Color darkBeige = Color(0xFFE8D9C0);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Mes Statistiques',
            style: TextStyle(color: Colors.black, fontSize: 20, fontWeight: FontWeight.bold)),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildPersonalProductionSection(primaryOrange, lightOrange, beige),
            const SizedBox(height: 24),
            _buildNetworkProductionSection(darkOrange, beige),
            const SizedBox(height: 24),
            _buildTopProductsSection(primaryOrange, beige),
            const SizedBox(height: 24),
            _buildMonthlySalesChart(primaryOrange, lightOrange),
          ],
        ),
      ),
    );
  }

  Widget _buildPersonalProductionSection(Color primary, Color secondary, Color bg) {
    return Card(
      elevation: 1,
      color: bg,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Ma production (CA personnel)',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: primary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '10 500 €',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: primary,
              ),
            ),
            const SizedBox(height: 16),
            _buildProgressIndicator(0.695, '6 950 € (69.5%)', primary, secondary),
            const SizedBox(height: 12),
            _buildProgressIndicator(0.265, '2 650 € (26.5%)', primary, secondary),
            const SizedBox(height: 12),
            _buildProgressIndicator(0.033, '350 € (3.3%)', primary, secondary),
            const SizedBox(height: 12),
            _buildProgressIndicator(0.007, '70 € (0.7%)', primary, secondary, isLast: true),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressIndicator(double value, String label, Color primary, Color secondary, {bool isLast = false}) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              flex: 2,
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  color: primary.withOpacity(0.8),
                ),
              ),
            ),
            Expanded(
              flex: 5,
              child: LinearProgressIndicator(
                value: value,
                backgroundColor: secondary.withOpacity(0.2),
                color: secondary,
                minHeight: 8,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ],
        ),
        if (!isLast) const SizedBox(height: 8),
      ],
    );
  }

  Widget _buildNetworkProductionSection(Color primary, Color bg) {
    return Card(
      elevation: 1,
      color: bg,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Production de mon réseau',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: primary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '20 500 €',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: primary,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  barTouchData: BarTouchData(enabled: false),
                  titlesData: FlTitlesData(
                    show: true,
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          final months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'];
                          return SideTitleWidget(
                            meta: meta,
                            child: Text(
                              months[value.toInt()],
                              style: TextStyle(
                                color: primary.withOpacity(0.7),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  barGroups: [
                    BarChartGroupData(
                      x: 0,
                      barRods: [
                        BarChartRodData(
                          toY: 7,
                          color: primary,
                          width: 20,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ],
                    ),
                    BarChartGroupData(
                      x: 1,
                      barRods: [
                        BarChartRodData(
                          toY: 6,
                          color: primary,
                          width: 20,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ],
                    ),
                    BarChartGroupData(
                      x: 2,
                      barRods: [
                        BarChartRodData(
                          toY: 5,
                          color: primary,
                          width: 20,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ],
                    ),
                    BarChartGroupData(
                      x: 3,
                      barRods: [
                        BarChartRodData(
                          toY: 4,
                          color: primary,
                          width: 20,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ],
                    ),
                    BarChartGroupData(
                      x: 4,
                      barRods: [
                        BarChartRodData(
                          toY: 3,
                          color: primary,
                          width: 20,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopProductsSection(Color primary, Color bg) {
    final topProducts = [
      {'name': 'Sac en cuir', 'sales': 42, 'revenue': 4200},
      {'name': 'Tote bag', 'sales': 35, 'revenue': 2450},
      {'name': 'Mug personnalisé', 'sales': 28, 'revenue': 840},
      {'name': 'Carnet artisan', 'sales': 15, 'revenue': 750},
      {'name': 'Stylo premium', 'sales': 10, 'revenue': 500},
    ];

    return Card(
      elevation: 1,
      color: bg,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Mes produits les plus vendus',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: primary,
              ),
            ),
            const SizedBox(height: 12),
            ...topProducts.map((product) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: Text(
                      product['name'] as String,
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        color: primary.withOpacity(0.8),
                      ),
                    ),
                  ),
                  Expanded(
                    flex: 2,
                    child: Text(
                      '${product['sales']} ventes',
                      style: TextStyle(
                        color: primary.withOpacity(0.6),
                      ),
                    ),
                  ),
                  Expanded(
                    flex: 2,
                    child: Text(
                      '${product['revenue']} €',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: primary),
                      textAlign: TextAlign.end,
                    ),
                  ),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthlySalesChart(Color primary, Color secondary) {
    return Card(
      elevation: 1,
      color: const Color(0xFFFAF3E8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Évolution mensuelle des ventes',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: primary,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  lineTouchData: LineTouchData(enabled: false),
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    getDrawingHorizontalLine: (value) => FlLine(
                      color: secondary.withOpacity(0.2),
                      strokeWidth: 1,
                    ),
                  ),
                  titlesData: FlTitlesData(
                    show: true,
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          final months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'];
                          return SideTitleWidget(
                            meta: meta,
                            child: Text(
                              months[value.toInt()],
                              style: TextStyle(
                                color: primary.withOpacity(0.7),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          return Text(
                            '${value.toInt()}k',
                            style: TextStyle(
                              color: primary.withOpacity(0.7),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  borderData: FlBorderData(
                    show: true,
                    border: Border.all(
                      color: secondary.withOpacity(0.2),
                      width: 1,
                    ),
                  ),
                  minX: 0,
                  maxX: 4,
                  minY: 0,
                  maxY: 12,
                  lineBarsData: [
                    LineChartBarData(
                      spots: [
                        FlSpot(0, 5),
                        FlSpot(1, 7.5),
                        FlSpot(2, 6),
                        FlSpot(3, 8.5),
                        FlSpot(4, 10.5),
                      ],
                      isCurved: true,
                      color: primary,
                      barWidth: 3,
                      dotData: FlDotData(
                        show: true,
                        getDotPainter: (spot, percent, barData, index) =>
                          FlDotCirclePainter(
                            radius: 4,
                            color: primary,
                            strokeWidth: 2,
                            strokeColor: Colors.white,
                          ),
                      ),
                      belowBarData: BarAreaData(
                        show: true,
                        gradient: LinearGradient(
                          colors: [
                            secondary.withOpacity(0.4),
                            secondary.withOpacity(0.1),
                          ],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}