import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

const EmailVerificationScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {/* Replace with actual email verification icon */}
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>✉️</Text>
          </View>
        </View>
        
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            If you don't see the email in your inbox, please check your spam folder or request a new verification link.
          </Text>
        </View>
        
        <Button
          title="Resend Verification Email"
          variant="outline"
          onPress={() => {
            // Implement resend verification logic
            alert('Verification email resent. Please check your inbox.');
          }}
          style={styles.button}
        />
        
        <Button
          title="Back to Login"
          variant="ghost"
          onPress={() => navigation.navigate('Login')}
          style={styles.backButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.grey900,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.grey600,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.grey700,
    lineHeight: 20,
  },
  button: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  backButton: {
    width: '100%',
  },
});

export default EmailVerificationScreen; 