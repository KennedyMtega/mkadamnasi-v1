import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import 'widgets/create_vote_form.dart';
import 'widgets/create_rating_form.dart';

class CreateScreen extends ConsumerWidget {
  const CreateScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: AppColors.offWhite,
        appBar: AppBar(
          backgroundColor: AppColors.white,
          elevation: 0,
          title: Text('Unda', style: AppTypography.h3),
          centerTitle: true,
          bottom: TabBar(
            labelColor: AppColors.brandOrange,
            unselectedLabelColor: AppColors.mediumGray,
            indicatorColor: AppColors.brandOrange,
            indicatorWeight: 3,
            labelStyle: AppTypography.buttonSm,
            tabs: const [
              Tab(text: 'Unda Kura'),
              Tab(text: 'Unda Kipimo'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            CreateVoteForm(),
            CreateRatingForm(),
          ],
        ),
      ),
    );
  }
}
