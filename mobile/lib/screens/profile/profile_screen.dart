import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: AppColors.offWhite,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              const SizedBox(height: 16),

              // Avatar
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.brandOrange.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.brandOrange, width: 2.5),
                ),
                child: Center(
                  child: Text(
                    (user?.displayName ?? 'M')[0].toUpperCase(),
                    style: AppTypography.h1.copyWith(color: AppColors.brandOrange),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Username
              Text(user?.displayName ?? 'Mtumiaji', style: AppTypography.h2),
              const SizedBox(height: 4),

              // Level badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.brandOrange,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Level ${user?.reputationScore ?? 0}',
                  style: AppTypography.caption.copyWith(color: AppColors.white, fontWeight: FontWeight.w600),
                ),
              ),
              const SizedBox(height: 24),

              // Stats row
              Row(
                children: [
                  _StatCard(label: 'Kura', value: '${user?.totalVotes ?? 0}', icon: Icons.how_to_vote_rounded, color: AppColors.brandOrange),
                  const SizedBox(width: 12),
                  _StatCard(label: 'Vipimo', value: '${user?.totalRatings ?? 0}', icon: Icons.star_rounded, color: AppColors.warningYellow),
                  const SizedBox(width: 12),
                  _StatCard(label: 'Pointi', value: '${user?.reputationScore ?? 0}', icon: Icons.diamond_rounded, color: AppColors.infoBlue),
                ],
              ),
              const SizedBox(height: 16),

              // Streak indicator
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColors.brandOrange, AppColors.darkOrange],
                  ),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.local_fire_department_rounded, color: AppColors.white, size: 32),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Streak ya Siku 7', style: AppTypography.h4.copyWith(color: AppColors.white)),
                          Text('Endelea kupiga kura kila siku!', style: AppTypography.bodySm.copyWith(color: AppColors.white.withValues(alpha: 0.8))),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Tuzo Zangu (My Badges) section
              Row(
                children: [
                  Text('Tuzo Zangu', style: AppTypography.h4),
                  const Spacer(),
                  GestureDetector(
                    onTap: () => Navigator.pushNamed(context, '/badges'),
                    child: Text('Zote', style: AppTypography.buttonSm.copyWith(color: AppColors.brandOrange)),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 90,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _BadgeMini(name: 'Mwanzo', icon: Icons.star_rounded, isEarned: true),
                    _BadgeMini(name: 'Mzalendo', icon: Icons.flag_rounded, isEarned: true),
                    _BadgeMini(name: 'Mhakiki', icon: Icons.search_rounded, isEarned: false),
                    _BadgeMini(name: 'Mshawishi', icon: Icons.people_rounded, isEarned: false),
                    _BadgeMini(name: 'Moto', icon: Icons.local_fire_department_rounded, isEarned: false),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Menu items
              _MenuItem(icon: Icons.settings_rounded, label: 'Mipangilio', onTap: () => Navigator.pushNamed(context, '/settings')),
              _MenuItem(icon: Icons.help_outline_rounded, label: 'Msaada', onTap: () {}),
              _MenuItem(icon: Icons.workspace_premium_rounded, label: 'Premium', onTap: () {}),
              _MenuItem(icon: Icons.card_giftcard_rounded, label: 'Referral', onTap: () => Navigator.pushNamed(context, '/referral')),
              _MenuItem(icon: Icons.leaderboard_rounded, label: 'Ubao wa Washindi', onTap: () => Navigator.pushNamed(context, '/leaderboard')),
              _MenuItem(icon: Icons.info_outline_rounded, label: 'Kuhusu', onTap: () {}),
              const SizedBox(height: 16),

              // Logout
              SizedBox(
                width: double.infinity,
                height: 48,
                child: OutlinedButton.icon(
                  onPressed: () => ref.read(authProvider.notifier).logout(),
                  icon: const Icon(Icons.logout_rounded, color: AppColors.errorRed),
                  label: Text('Ondoka', style: AppTypography.button.copyWith(color: AppColors.errorRed)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.errorRed),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.lightGray),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 6),
            Text(value, style: AppTypography.numberSm),
            Text(label, style: AppTypography.caption),
          ],
        ),
      ),
    );
  }
}

class _BadgeMini extends StatelessWidget {
  final String name;
  final IconData icon;
  final bool isEarned;

  const _BadgeMini({required this.name, required this.icon, required this.isEarned});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 72,
      margin: const EdgeInsets.only(right: 12),
      child: Column(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: isEarned ? AppColors.brandOrange.withValues(alpha: 0.15) : AppColors.lightGray.withValues(alpha: 0.5),
              shape: BoxShape.circle,
              border: Border.all(
                color: isEarned ? AppColors.brandOrange : AppColors.lightGray,
                width: 2,
              ),
            ),
            child: Icon(icon, color: isEarned ? AppColors.brandOrange : AppColors.mediumGray, size: 24),
          ),
          const SizedBox(height: 6),
          Text(name, style: AppTypography.caption.copyWith(color: isEarned ? AppColors.deepNavy : AppColors.mediumGray), textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis),
        ],
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _MenuItem({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.lightGray),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppColors.darkGray, size: 22),
            const SizedBox(width: 14),
            Text(label, style: AppTypography.body.copyWith(color: AppColors.deepNavy)),
            const Spacer(),
            const Icon(Icons.chevron_right_rounded, color: AppColors.mediumGray, size: 20),
          ],
        ),
      ),
    );
  }
}
