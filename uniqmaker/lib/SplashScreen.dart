import 'package:flutter/material.dart';
import 'package:uniqmaker/signup.dart';
import 'package:uniqmaker/login.dart';

class UltimateSplashScreen extends StatefulWidget {
  const UltimateSplashScreen({super.key});

  @override
  State<UltimateSplashScreen> createState() => _UltimateSplashScreenState();
}

class _UltimateSplashScreenState extends State<UltimateSplashScreen> 
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _logoScale;
  late Animation<double> _logoOpacity;
  late Animation<Color?> _bgColor;
  late Animation<double> _buttonsOpacity;
  late Animation<Offset> _buttonsPosition;

  @override
  void initState() {
    super.initState();
    
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    );

    _logoOpacity = Tween(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.5, curve: Curves.easeInOut),
      ),
    );

    _logoScale = Tween(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.3, 0.8, curve: Curves.elasticOut),
      ),
    );

    _bgColor = ColorTween(
      begin: const Color(0xFFFFF3E0),
      end: const Color(0xFFFBE9E7),
    ).animate(_controller);

    _buttonsOpacity = Tween(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.6, 1.0, curve: Curves.easeIn),
      ),
    );

    _buttonsPosition = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.7, 1.0, curve: Curves.easeOut),
      ),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Scaffold(
          backgroundColor: _bgColor.value,
          body: Stack(
            children: [
              // Background gradient
              Container(
                decoration: BoxDecoration(
                  gradient: RadialGradient(
                    colors: [
                      _bgColor.value ?? const Color(0xFFFBE9E7),
                      const Color(0xFFFFE0B2),
                      const Color(0xFFFFAB40),
                    ],
                    center: Alignment.center,
                    radius: 1.5,
                  ),
                ),
              ),

              // Logo with animations
              Center(
                child: Opacity(
                  opacity: _logoOpacity.value,
                  child: Transform.scale(
                    scale: _logoScale.value,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 200,
                          height: 200,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.orange.withOpacity(0.3),
                                blurRadius: 30 * _logoScale.value,
                              ),
                            ],
                          ),
                          child: Center(
                            child: Image.asset(
                              'assets/logo.png',
                              width: 200,
                              height: 200,
                              errorBuilder: (_, __, ___) => const Icon(
                                Icons.auto_awesome,
                                size: 100,
                                color: Colors.orange,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Buttons with border
              Positioned(
                bottom: 60,
                left: 0,
                right: 0,
                child: SlideTransition(
                  position: _buttonsPosition,
                  child: FadeTransition(
                    opacity: _buttonsOpacity,
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _BorderedTextButton(
                            text: 'Connexion',
                            onPressed: () => Navigator.push(
                              context, 
                              MaterialPageRoute(
                                builder: (context) => const FreelancerLoginPage(),
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          _BorderedTextButton(
                            text: 'Inscription',
                            onPressed: () => Navigator.push(
                              context, 
                              MaterialPageRoute(
                                builder: (context) => const HomeScreen(),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }


}

class _BorderedTextButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const _BorderedTextButton({
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        foregroundColor: const Color.fromARGB(221, 255, 255, 255),
        side: const BorderSide(color: Color.fromARGB(137, 255, 255, 255), width: 2),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 120),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}