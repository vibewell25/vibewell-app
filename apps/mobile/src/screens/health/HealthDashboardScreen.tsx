import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

// Add type definitions for our data
interface HealthMetric {
  id: string;
  name: string;
  value: string;
  target: string;
  icon: string;
  trend: 'up' | 'down' | 'steady';
  unit: string;
}

interface HealthInsight {
  id: string;
  title: string;
  description: string;
  actionable: boolean;
  action?: string;
}

interface ConnectedApp {
  id: string;
  name: string;
  connected: boolean;
  icon: string;
}

// Updated mock data with proper typing
const healthMetrics: HealthMetric[] = [
  {
    id: '1',
    name: 'Steps',
    value: '8,742',
    target: '10,000',
    icon: '👣',
    trend: 'up',
    unit: 'steps',
  },
  {
    id: '2',
    name: 'Sleep',
    value: '7.5',
    target: '8',
    icon: '😴',
    trend: 'steady',
    unit: 'hours',
  },
  {
    id: '3',
    name: 'Heart Rate',
    value: '72',
    target: '60-100',
    icon: '❤️',
    trend: 'down',
    unit: 'bpm',
  },
  {
    id: '4',
    name: 'Stress',
    value: '42',
    target: '< 50',
    icon: '🧘‍♀️',
    trend: 'up',
    unit: 'score',
  },
];

// Updated health insights with proper typing
const healthInsights: HealthInsight[] = [
  {
    id: '1',
    title: 'Stress Level Increased',
    description: 'Your stress level has been higher than usual for the past 3 days. Consider adding meditation sessions to your routine.',
    actionable: true,
    action: 'Try a meditation session',
  },
  {
    id: '2',
    title: 'Sleep Pattern Improved',
    description: 'Your sleep quality has improved by 15% this week. Keep maintaining a consistent bedtime routine.',
    actionable: false,
  },
  {
    id: '3',
    title: 'Activity Recommendation',
    description: 'Based on your schedule today, we recommend a 20-minute walk around 3 PM to boost your energy levels.',
    actionable: true,
    action: 'Schedule reminder',
  },
];

// Updated connected apps with proper typing
const connectedApps: ConnectedApp[] = [
  {
    id: 'apple-health',
    name: 'Apple Health',
    connected: true,
    icon: '🍎',
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    connected: false,
    icon: '⌚',
  },
  {
    id: 'google-fit',
    name: 'Google Fit',
    connected: false,
    icon: '🏃‍♂️',
  },
];

const HealthDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('daily');
  
  const firstName = user?.user_metadata?.first_name || 'Wellness Seeker';

  const renderMetricCard = (metric: HealthMetric) => (
    <TouchableOpacity key={metric.id} style={styles.metricCard}>
      <View style={styles.metricIconContainer}>
        <Text style={styles.metricIcon}>{metric.icon}</Text>
      </View>
      <Text style={styles.metricName}>{metric.name}</Text>
      <Text style={styles.metricValue}>{metric.value} <Text style={styles.metricUnit}>{metric.unit}</Text></Text>
      <View style={styles.metricTargetContainer}>
        <Text style={styles.metricTargetLabel}>Target: </Text>
        <Text style={styles.metricTarget}>{metric.target}</Text>
      </View>
      <View style={[styles.metricTrend, getTrendStyle(metric.trend).trend]}>
        <Text style={styles.trendIcon}>{getTrendIcon(metric.trend)}</Text>
      </View>
    </TouchableOpacity>
  );

  const getTrendStyle = (trend: 'up' | 'down' | 'steady') => {
    switch(trend) {
      case 'up':
        return { trend: { backgroundColor: COLORS.success } };
      case 'down':
        return { trend: { backgroundColor: COLORS.error } };
      default:
        return { trend: { backgroundColor: COLORS.info } };
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'steady') => {
    switch(trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {firstName}</Text>
          <Text style={styles.subGreeting}>Here's your health overview</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileButtonText}>👤</Text>
        </TouchableOpacity>
      </View>
      
      {/* Connected Apps Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Health Apps</Text>
        <View style={styles.connectedAppsContainer}>
          {connectedApps.map((app) => (
            <TouchableOpacity 
              key={app.id} 
              style={[
                styles.appConnectorCard,
                app.connected ? styles.connectedApp : styles.disconnectedApp
              ]}
              onPress={() => {
                if (!app.connected) {
                  alert(`Connecting to ${app.name}...`);
                }
              }}
            >
              <Text style={styles.appIcon}>{app.icon}</Text>
              <Text style={styles.appName}>{app.name}</Text>
              <Text style={styles.connectionStatus}>
                {app.connected ? 'Connected' : 'Connect'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Health Metrics Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Metrics</Text>
        <View style={styles.metricsGrid}>
          {healthMetrics.map(renderMetricCard)}
        </View>
      </View>
      
      {/* Data Visualization */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Trends</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
            onPress={() => setActiveTab('daily')}
          >
            <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
            onPress={() => setActiveTab('weekly')}
          >
            <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
            onPress={() => setActiveTab('monthly')}
          >
            <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'yearly' && styles.activeTab]}
            onPress={() => setActiveTab('yearly')}
          >
            <Text style={[styles.tabText, activeTab === 'yearly' && styles.activeTabText]}>Yearly</Text>
          </TouchableOpacity>
        </View>
        
        {/* Chart Placeholder */}
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>Chart visualization will be implemented here</Text>
          <Text style={styles.placeholderSubtext}>Showing {activeTab} data</Text>
        </View>
      </View>
      
      {/* Health Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Insights</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.insightsContainer}
        >
          {healthInsights.map((insight) => (
            <View key={insight.id} style={styles.insightCard}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              {insight.actionable && (
                <TouchableOpacity style={styles.insightActionButton}>
                  <Text style={styles.insightActionText}>{insight.action}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
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
  connectedAppsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
  },
  appConnectorCard: {
    width: '30%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  connectedApp: {
    backgroundColor: COLORS.primaryLight,
  },
  disconnectedApp: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey300,
  },
  appIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  appName: {
    fontSize: FONTS.bodySmall,
    fontWeight: '500',
    color: COLORS.grey800,
    marginBottom: SPACING.xs,
  },
  connectionStatus: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
    position: 'relative',
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  metricIcon: {
    fontSize: 20,
  },
  metricName: {
    fontSize: FONTS.bodyMedium,
    fontWeight: '500',
    color: COLORS.grey700,
    marginBottom: SPACING.xs,
  },
  metricValue: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.grey900,
  },
  metricUnit: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
  },
  metricTargetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  metricTargetLabel: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
  },
  metricTarget: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey800,
    fontWeight: '500',
  },
  metricTrend: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendIcon: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.grey200,
    borderRadius: BORDER_RADIUS.round,
    padding: SPACING.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.round,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  tabText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
  },
  activeTabText: {
    color: COLORS.grey900,
    fontWeight: '500',
  },
  chartPlaceholder: {
    backgroundColor: COLORS.white,
    height: 200,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
  },
  placeholderSubtext: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey500,
    marginTop: SPACING.xs,
  },
  insightsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  insightCard: {
    width: 280,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  insightTitle: {
    fontSize: FONTS.bodyMedium,
    fontWeight: '600',
    color: COLORS.grey800,
    marginBottom: SPACING.xs,
  },
  insightDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
    marginBottom: SPACING.md,
  },
  insightActionButton: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    alignSelf: 'flex-start',
  },
  insightActionText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey900,
    fontWeight: '500',
  },
});

export default HealthDashboardScreen; 