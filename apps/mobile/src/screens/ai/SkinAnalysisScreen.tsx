import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../constants/theme';

type SkinConcern = {
  id: string;
  name: string;
  confidence: number;
  description: string;
  recommendations: Recommendation[];
};

type Recommendation = {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'routine' | 'provider';
};

const SkinAnalysisScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<SkinConcern[] | null>(null);
  const [activeTab, setActiveTab] = useState('concerns');
  const scrollViewRef = useRef<ScrollView>(null);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need camera permissions to analyze your skin.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const takePicture = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setAnalyzing(true);
    setResults(null);

    try {
      // In a real app, this would upload the image to a server for AI analysis
      // For demo purposes, we'll simulate an API call with a timeout
      
      setTimeout(() => {
        // Mock skin analysis results
        const mockResults: SkinConcern[] = [
          {
            id: '1',
            name: 'Dryness',
            confidence: 0.85,
            description: 'Your skin appears to be dry in the cheek and forehead areas. This could be due to environmental factors, lack of hydration, or your skin type.',
            recommendations: [
              {
                id: 'r1',
                title: 'Hydrating Serum',
                description: 'Use a hyaluronic acid serum to boost hydration levels in your skin.',
                type: 'product'
              },
              {
                id: 'r2',
                title: 'Moisturizing Routine',
                description: 'Apply moisturizer twice daily and consider using a humidifier at night.',
                type: 'routine'
              }
            ]
          },
          {
            id: '2',
            name: 'Fine Lines',
            confidence: 0.62,
            description: 'Early signs of fine lines are visible around the eyes. This is normal and can be addressed with the right products.',
            recommendations: [
              {
                id: 'r3',
                title: 'Retinol Treatment',
                description: 'A gentle retinol product can help improve cell turnover and reduce the appearance of fine lines.',
                type: 'product'
              },
              {
                id: 'r4',
                title: 'Facial Treatments',
                description: 'Regular facials can help maintain skin elasticity and reduce fine lines.',
                type: 'provider'
              }
            ]
          },
          {
            id: '3',
            name: 'Uneven Skin Tone',
            confidence: 0.78,
            description: 'Some areas of hyperpigmentation and uneven skin tone are detected, likely due to sun exposure.',
            recommendations: [
              {
                id: 'r5',
                title: 'Vitamin C Serum',
                description: 'Daily use of a vitamin C serum can help brighten skin and reduce hyperpigmentation.',
                type: 'product'
              },
              {
                id: 'r6',
                title: 'Sun Protection',
                description: 'Use SPF 30+ daily, even on cloudy days, to prevent further uneven pigmentation.',
                type: 'routine'
              }
            ]
          }
        ];
        
        setResults(mockResults);
        setAnalyzing(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Analysis Failed', 'We couldn\'t analyze your skin. Please try again.');
      setAnalyzing(false);
    }
  };

  const renderWelcomeView = () => (
    <View style={styles.welcomeContainer}>
      <Image 
        source={require('../../../assets/skin-analysis-icon.png')} 
        style={styles.welcomeImage}
        defaultSource={require('../../../assets/skin-analysis-icon.png')}
      />
      <Text style={styles.welcomeTitle}>AI Skin Analysis</Text>
      <Text style={styles.welcomeDescription}>
        Take a selfie or upload a photo to get personalized skin care recommendations based on AI analysis.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Ionicons name="camera" size={20} color={COLORS.white} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={pickImage}>
          <Ionicons name="image" size={20} color={COLORS.primary} style={styles.buttonIcon} />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Upload Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.privacyNote}>
        <Ionicons name="shield-checkmark" size={16} color={COLORS.grey600} />
        <Text style={styles.privacyNoteText}>
          Your photos are analyzed securely and not stored on our servers.
        </Text>
      </View>
    </View>
  );

  const renderAnalyzingView = () => (
    <View style={styles.analyzingContainer}>
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
      <View style={styles.analyzingOverlay}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.analyzingText}>Analyzing your skin...</Text>
        <Text style={styles.analyzingSubtext}>
          Our AI is checking for concerns like dryness, fine lines, acne, and more.
        </Text>
      </View>
    </View>
  );

  const renderResultsView = () => {
    if (!results) return null;
    
    return (
      <View style={styles.resultsContainer}>
        <View style={styles.resultImageContainer}>
          <Image source={{ uri: image! }} style={styles.resultImage} />
          {activeTab === 'concerns' && (
            <View style={styles.concernMarkers}>
              {results.map((concern, index) => (
                <View 
                  key={concern.id}
                  style={[
                    styles.concernMarker,
                    { top: 40 + (index * 30) + '%', left: 30 + (index * 15) + '%' }
                  ]}
                >
                  <Text style={styles.concernMarkerText}>{index + 1}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'concerns' && styles.activeTab]}
            onPress={() => setActiveTab('concerns')}
          >
            <Text style={[styles.tabText, activeTab === 'concerns' && styles.activeTabText]}>
              Concerns
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'recommendations' && styles.activeTab]}
            onPress={() => setActiveTab('recommendations')}
          >
            <Text style={[styles.tabText, activeTab === 'recommendations' && styles.activeTabText]}>
              Recommendations
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.detailsScrollView}
          contentContainerStyle={styles.detailsContainer}
        >
          {activeTab === 'concerns' ? (
            <>
              <Text style={styles.detailsTitle}>Detected Skin Concerns</Text>
              {results.map((concern, index) => (
                <View key={concern.id} style={styles.concernCard}>
                  <View style={styles.concernHeader}>
                    <View style={styles.concernNumber}>
                      <Text style={styles.concernNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.concernName}>{concern.name}</Text>
                    <View style={styles.confidenceContainer}>
                      <Text style={styles.confidenceText}>
                        {Math.round(concern.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.concernDescription}>{concern.description}</Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text style={styles.detailsTitle}>Personalized Recommendations</Text>
              {results.flatMap(concern => 
                concern.recommendations.map(recommendation => (
                  <View key={recommendation.id} style={styles.recommendationCard}>
                    <View style={styles.recommendationHeader}>
                      <View style={[
                        styles.recommendationType,
                        recommendation.type === 'product' ? styles.productType :
                        recommendation.type === 'routine' ? styles.routineType :
                        styles.providerType
                      ]}>
                        <Ionicons 
                          name={
                            recommendation.type === 'product' ? 'flask' :
                            recommendation.type === 'routine' ? 'calendar' : 'person'
                          } 
                          size={16} 
                          color={COLORS.white} 
                        />
                      </View>
                      <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                    </View>
                    <Text style={styles.recommendationDescription}>
                      {recommendation.description}
                    </Text>
                    <View style={styles.recommendationFooter}>
                      <Text style={styles.concernReference}>For {concern.name}</Text>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>
                          {recommendation.type === 'product' ? 'View Products' :
                           recommendation.type === 'routine' ? 'Learn More' : 'Find Provider'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </>
          )}
        </ScrollView>
        
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.secondaryActionButton} onPress={() => {
            setImage(null);
            setResults(null);
          }}>
            <Ionicons name="refresh" size={18} color={COLORS.primary} />
            <Text style={styles.secondaryActionText}>New Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryActionButton}>
            <Ionicons name="clipboard" size={18} color={COLORS.white} />
            <Text style={styles.primaryActionText}>Save Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!image && renderWelcomeView()}
      {image && analyzing && renderAnalyzingView()}
      {image && !analyzing && results && renderResultsView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  welcomeImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.grey800,
  },
  welcomeDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: COLORS.grey600,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyNoteText: {
    marginLeft: 6,
    fontSize: 12,
    color: COLORS.grey600,
  },
  analyzingContainer: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  analyzingText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  analyzingSubtext: {
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  resultImageContainer: {
    height: '35%',
    position: 'relative',
  },
  resultImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  concernMarkers: {
    ...StyleSheet.absoluteFillObject,
  },
  concernMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  concernMarkerText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey200,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.grey600,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  detailsScrollView: {
    flex: 1,
  },
  detailsContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.grey800,
  },
  concernCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  concernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  concernNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  concernNumberText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  concernName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  confidenceContainer: {
    backgroundColor: COLORS.grey100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.grey800,
  },
  concernDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grey700,
  },
  recommendationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationType: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  productType: {
    backgroundColor: '#4CAF50', // Green
  },
  routineType: {
    backgroundColor: '#2196F3', // Blue
  },
  providerType: {
    backgroundColor: '#9C27B0', // Purple
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  recommendationDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grey700,
    marginBottom: 12,
  },
  recommendationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  concernReference: {
    fontSize: 12,
    color: COLORS.grey600,
  },
  actionButton: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey200,
  },
  secondaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },
  secondaryActionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  primaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginLeft: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  primaryActionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default SkinAnalysisScreen; 