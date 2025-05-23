import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'nutrition' | 'meditation' | 'sleep' | 'mental';
  icon: string;
}

interface Goal {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  startDate: string;
  endDate: string;
  category: 'fitness' | 'nutrition' | 'mental' | 'sleep';
  milestones: Milestone[];
  recommendations: Recommendation[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  reward: string;
  icon: string;
}

// Mock data for active goals
const activeGoals: Goal[] = [
  {
    id: '1',
    name: 'Increase Daily Steps',
    description: 'Walk more to improve cardiovascular health',
    progress: 70,
    target: 100,
    unit: '%',
    startDate: '2025-03-01',
    endDate: '2025-04-01',
    category: 'fitness',
    milestones: [
      {
        id: '1-1',
        title: 'Reach 5,000 steps daily for a week',
        completed: true,
      },
      {
        id: '1-2',
        title: 'Reach 7,500 steps daily for a week',
        completed: true,
      },
      {
        id: '1-3',
        title: 'Reach 10,000 steps daily for a week',
        completed: false,
        dueDate: '2025-03-25',
      },
    ],
    recommendations: [
      {
        id: 'r1-1',
        title: 'Morning Walk',
        description: 'Take a 15-minute walk each morning before breakfast',
        type: 'workout',
        icon: '🚶‍♀️',
      },
      {
        id: 'r1-2',
        title: 'Walking Meetings',
        description: 'Convert some of your sitting meetings to walking ones',
        type: 'workout',
        icon: '💼',
      },
    ],
  },
  {
    id: '2',
    name: 'Improve Sleep Quality',
    description: 'Develop better sleep habits for overall wellness',
    progress: 45,
    target: 100,
    unit: '%',
    startDate: '2025-03-10',
    endDate: '2025-04-10',
    category: 'sleep',
    milestones: [
      {
        id: '2-1',
        title: 'Establish consistent bedtime for 5 days',
        completed: true,
      },
      {
        id: '2-2',
        title: 'No screen time 1 hour before bed for a week',
        completed: false,
        dueDate: '2025-03-22',
      },
      {
        id: '2-3',
        title: 'Achieve 7+ hours of sleep for 10 consecutive nights',
        completed: false,
        dueDate: '2025-04-05',
      },
    ],
    recommendations: [
      {
        id: 'r2-1',
        title: 'Evening Meditation',
        description: 'Try a 10-minute guided meditation before bed',
        type: 'meditation',
        icon: '🧘‍♂️',
      },
      {
        id: 'r2-2',
        title: 'Sleep Environment',
        description: 'Keep your bedroom cool, dark, and quiet',
        type: 'sleep',
        icon: '🛏️',
      },
    ],
  },
  {
    id: '3',
    name: 'Reduce Stress Levels',
    description: 'Practice mindfulness to lower overall stress',
    progress: 30,
    target: 100,
    unit: '%',
    startDate: '2025-03-15',
    endDate: '2025-04-15',
    category: 'mental',
    milestones: [
      {
        id: '3-1',
        title: 'Complete 5-minute meditation daily for a week',
        completed: true,
      },
      {
        id: '3-2',
        title: 'Practice deep breathing exercises when stressed',
        completed: false,
      },
      {
        id: '3-3',
        title: 'Reduce screen time by 25%',
        completed: false,
      },
    ],
    recommendations: [
      {
        id: 'r3-1',
        title: 'Mindful Breaks',
        description: 'Take 3-minute mindfulness breaks throughout your day',
        type: 'meditation',
        icon: '⏱️',
      },
      {
        id: 'r3-2',
        title: 'Digital Detox',
        description: 'Set aside 2 hours per day without digital devices',
        type: 'mental',
        icon: '📵',
      },
    ],
  },
];

// Mock data for weekly challenges
const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Hydration Hero',
    description: 'Drink at least 8 glasses of water daily',
    progress: 60,
    duration: '7 days',
    reward: '200 points',
    icon: '💧',
  },
  {
    id: '2',
    title: 'Mindful Minutes',
    description: 'Meditate for 10 minutes each day',
    progress: 40,
    duration: '7 days',
    reward: '150 points',
    icon: '🧠',
  },
  {
    id: '3',
    title: 'Stretch It Out',
    description: 'Complete a 5-minute stretching routine daily',
    progress: 20,
    duration: '7 days',
    reward: '150 points',
    icon: '🤸‍♀️',
  },
];

const WellnessPlanScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState<string>(activeGoals[0]?.id || '');
  
  const firstName = user?.user_metadata?.first_name || 'Wellness Seeker';
  
  // Calculate overall progress across all goals
  const overallProgress = Math.round(
    activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / 
    (activeGoals.length || 1)
  );
  
  const selectedGoalData = activeGoals.find(goal => goal.id === selectedGoal);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {firstName}</Text>
          <Text style={styles.subGreeting}>Your personalized wellness journey</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileButtonText}>👤</Text>
        </TouchableOpacity>
      </View>
      
      {/* Plan Overview Card */}
      <View style={styles.planOverviewCard}>
        <View style={styles.progressCircleContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{overallProgress}%</Text>
          </View>
        </View>
        <View style={styles.planMetadata}>
          <Text style={styles.planTitle}>Your Wellness Plan</Text>
          <Text style={styles.planSubtitle}>Created on March 1, 2025</Text>
          <Text style={styles.planUpdate}>Next update: April 1, 2025</Text>
        </View>
      </View>
      
      {/* Goal Tracking Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Goals</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.goalTabsContainer}
        >
          {activeGoals.map(goal => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalTab,
                selectedGoal === goal.id ? styles.activeGoalTab : null
              ]}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <Text 
                style={[
                  styles.goalTabText,
                  selectedGoal === goal.id ? styles.activeGoalTabText : null
                ]}
              >
                {goal.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {selectedGoalData && (
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalName}>{selectedGoalData.name}</Text>
              <Text style={styles.goalDescription}>{selectedGoalData.description}</Text>
            </View>
            
            <View style={styles.goalProgressContainer}>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${selectedGoalData.progress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressPercentage}>
                {selectedGoalData.progress}%
              </Text>
            </View>
            
            <View style={styles.goalDates}>
              <Text style={styles.goalDateText}>
                Started: {new Date(selectedGoalData.startDate).toLocaleDateString()}
              </Text>
              <Text style={styles.goalDateText}>
                Target: {new Date(selectedGoalData.endDate).toLocaleDateString()}
              </Text>
            </View>
            
            <Text style={styles.milestonesTitle}>Milestones</Text>
            {selectedGoalData.milestones.map(milestone => (
              <View key={milestone.id} style={styles.milestoneItem}>
                <View style={[
                  styles.milestoneCheckbox,
                  milestone.completed ? styles.milestoneCompleted : {}
                ]}>
                  {milestone.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                  {milestone.dueDate && (
                    <Text style={styles.milestoneDueDate}>
                      Due by: {new Date(milestone.dueDate).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
            ))}
            
            <Text style={styles.recommendationsTitle}>Recommendations</Text>
            {selectedGoalData.recommendations.map(rec => (
              <View key={rec.id} style={styles.recommendationItem}>
                <Text style={styles.recommendationIcon}>{rec.icon}</Text>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  <Text style={styles.recommendationDescription}>
                    {rec.description}
                  </Text>
                </View>
                <TouchableOpacity style={styles.tryButton}>
                  <Text style={styles.tryButtonText}>Try</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
      
      {/* Weekly Challenges Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Weekly Challenges</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.challengesContainer}
        >
          {challenges.map(challenge => (
            <View key={challenge.id} style={styles.challengeCard}>
              <Text style={styles.challengeIcon}>{challenge.icon}</Text>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
              <View style={styles.challengeProgressContainer}>
                <View style={styles.challengeProgressBarContainer}>
                  <View 
                    style={[
                      styles.challengeProgressBar, 
                      { width: `${challenge.progress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.challengeProgressText}>
                  {challenge.progress}%
                </Text>
              </View>
              <View style={styles.challengeFooter}>
                <Text style={styles.challengeDuration}>{challenge.duration}</Text>
                <Text style={styles.challengeReward}>{challenge.reward}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      
      {/* Adjust Plan Button */}
      <TouchableOpacity style={styles.adjustPlanButton}>
        <Text style={styles.adjustPlanButtonText}>Adjust My Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.grey900,
  },
  subGreeting: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
    marginTop: SPACING.xs,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: FONTS.bodyLarge,
  },
  planOverviewCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  progressCircleContainer: {
    paddingRight: SPACING.md,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.grey900,
  },
  planMetadata: {
    flex: 1,
  },
  planTitle: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.grey900,
    marginBottom: SPACING.xs,
  },
  planSubtitle: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
    marginBottom: SPACING.xs,
  },
  planUpdate: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.primary,
  },
  section: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.h3,
    fontWeight: '600',
    color: COLORS.grey900,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.primary,
    fontWeight: '500',
  },
  goalTabsContainer: {
    marginBottom: SPACING.md,
  },
  goalTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.grey200,
    marginLeft: SPACING.lg,
  },
  activeGoalTab: {
    backgroundColor: COLORS.primary,
  },
  goalTabText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey800,
  },
  activeGoalTabText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  goalCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  goalHeader: {
    marginBottom: SPACING.md,
  },
  goalName: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.grey900,
    marginBottom: SPACING.xs,
  },
  goalDescription: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
  },
  goalProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.grey200,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
  },
  progressPercentage: {
    fontSize: FONTS.bodyMedium,
    fontWeight: 'bold',
    color: COLORS.grey900,
    width: 45,
    textAlign: 'right',
  },
  goalDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  goalDateText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
  },
  milestonesTitle: {
    fontSize: FONTS.bodyMedium,
    fontWeight: '600',
    color: COLORS.grey900,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  milestoneCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.grey400,
    marginRight: SPACING.sm,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONTS.bodySmall,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey800,
    marginBottom: SPACING.xs,
  },
  milestoneDueDate: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
  },
  recommendationsTitle: {
    fontSize: FONTS.bodyMedium,
    fontWeight: '600',
    color: COLORS.grey900,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey100,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: FONTS.bodyMedium,
    fontWeight: '500',
    color: COLORS.grey800,
    marginBottom: SPACING.xs,
  },
  recommendationDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
  },
  tryButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  tryButtonText: {
    fontSize: FONTS.bodySmall,
    fontWeight: '500',
    color: COLORS.grey900,
  },
  challengesContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  challengeCard: {
    width: 240,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  challengeIcon: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  challengeTitle: {
    fontSize: FONTS.bodyLarge,
    fontWeight: '600',
    color: COLORS.grey900,
    marginBottom: SPACING.xs,
  },
  challengeDescription: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
    marginBottom: SPACING.md,
  },
  challengeProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  challengeProgressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.grey200,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
  },
  challengeProgressBar: {
    height: 6,
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.round,
  },
  challengeProgressText: {
    fontSize: FONTS.bodySmall,
    fontWeight: 'bold',
    color: COLORS.grey900,
    width: 35,
    textAlign: 'right',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  challengeDuration: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
  },
  challengeReward: {
    fontSize: FONTS.bodySmall,
    fontWeight: '500',
    color: COLORS.accent,
  },
  adjustPlanButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  adjustPlanButtonText: {
    fontSize: FONTS.bodyMedium,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default WellnessPlanScreen; 