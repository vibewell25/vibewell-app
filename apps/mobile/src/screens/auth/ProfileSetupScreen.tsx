import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

const ProfileSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfileSetup = async () => {
    // Reset error state
    setError(null);
    
    // Basic validation
    if (!firstName || !lastName) {
      setError('First and last name are required');
      return;
    }
    
    try {
      setLoading(true);
      
      // TODO: Implement profile setup with Supabase
      // This would typically update a user profile table
      
      // For now, just simulate success
      setTimeout(() => {
        Alert.alert(
          'Profile Created',
          'Your profile has been set up successfully!',
          [{ text: 'Continue', onPress: () => navigation.navigate('Home') }]
        );
        setLoading(false);
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to set up profile');
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Help us personalize your experience</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us a bit about yourself..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <Button
          title="Complete Profile"
          onPress={handleProfileSetup}
          isLoading={loading}
          style={styles.button}
        />
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 20,
    fontSize: 14,
  },
  skipButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  skipText: {
    color: COLORS.grey600,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default ProfileSetupScreen; 