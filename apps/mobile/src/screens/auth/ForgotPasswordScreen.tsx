import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async () => {
    // Reset error state
    setError(null);
    
    // Basic validation
    if (!email) {
      setError('Email is required');
      return;
    }
    
    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert(
        'Reset Link Sent',
        'Please check your email for password reset instructions.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email to receive a password reset link</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <Button
          title="Send Reset Link"
          onPress={handleResetPassword}
          isLoading={loading}
          style={styles.button}
        />
        
        <Button
          title="Back to Login"
          onPress={() => navigation.navigate('Login')}
          variant="ghost"
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
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.grey900,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.grey600,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.grey900,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.grey300,
  },
  button: {
    marginTop: 10,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 0,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 20,
    fontSize: 14,
  },
});

export default ForgotPasswordScreen; 