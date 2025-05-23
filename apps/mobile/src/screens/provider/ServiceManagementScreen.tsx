import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import { theme } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
  bookingCount: number;
};

const serviceCategories = [
  "Facial Treatments",
  "Massage Therapy",
  "Hair Styling",
  "Nail Care",
  "Makeup Services",
  "Waxing",
  "Body Treatments",
  "Wellness Coaching",
];

const ServiceManagementScreen = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be a Supabase query
      // Mock data for demonstration
      const mockServices: Service[] = [
        {
          id: "s1",
          title: "Signature Facial",
          description: "A customized facial treatment designed to address your specific skin concerns. Includes cleansing, exfoliation, extraction, mask, and moisturizing.",
          duration: 60,
          price: 95,
          category: "Facial Treatments",
          isActive: true,
          bookingCount: 42,
        },
        {
          id: "s2",
          title: "Deep Tissue Massage",
          description: "A therapeutic massage that focuses on realigning deeper layers of muscles and connective tissue. Perfect for chronic pain and tension.",
          duration: 90,
          price: 120,
          category: "Massage Therapy",
          isActive: true,
          bookingCount: 38,
        },
        {
          id: "s3",
          title: "Chemical Peel",
          description: "A treatment that uses a chemical solution to remove the top layers of skin, revealing smoother, less wrinkled skin underneath.",
          duration: 45,
          price: 150,
          category: "Facial Treatments",
          isActive: true,
          bookingCount: 27,
        },
        {
          id: "s4",
          title: "Express Facial",
          description: "A quick but effective facial treatment for clients on the go. Includes cleansing, exfoliation, and moisturizing.",
          duration: 30,
          price: 60,
          category: "Facial Treatments",
          isActive: false,
          bookingCount: 15,
        },
      ];
      
      setServices(mockServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', 'Failed to load services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = () => {
    setCurrentService({
      title: '',
      description: '',
      price: 0,
      duration: 60,
      category: '',
      isActive: true,
    });
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleDeleteService = (serviceId: string) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, this would delete from Supabase
              setServices(services.filter(service => service.id !== serviceId));
              Alert.alert('Success', 'Service deleted successfully');
            } catch (error) {
              console.error('Error deleting service:', error);
              Alert.alert('Error', 'Failed to delete service. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleToggleStatus = async (serviceId: string, isActive: boolean) => {
    try {
      // In a real app, this would update the service in Supabase
      setServices(services.map(service => 
        service.id === serviceId ? { ...service, isActive } : service
      ));
    } catch (error) {
      console.error('Error updating service status:', error);
      Alert.alert('Error', 'Failed to update service status. Please try again.');
    }
  };

  const handleSaveService = async () => {
    if (!currentService.title || !currentService.description || !currentService.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (isEditing) {
        // Update existing service
        setServices(services.map(service => 
          service.id === currentService.id ? { ...service, ...currentService } as Service : service
        ));
        Alert.alert('Success', 'Service updated successfully');
      } else {
        // Create new service
        const newService: Service = {
          id: `s${services.length + 1}`, // In a real app, this would be generated by the database
          title: currentService.title!,
          description: currentService.description!,
          price: currentService.price || 0,
          duration: currentService.duration || 60,
          category: currentService.category!,
          isActive: currentService.isActive || true,
          bookingCount: 0,
        };
        
        setServices([...services, newService]);
        Alert.alert('Success', 'Service created successfully');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error saving service:', error);
      Alert.alert('Error', 'Failed to save service. Please try again.');
    }
  };

  const renderServiceModal = () => {
    if (!isModalVisible) return null;
    
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Service' : 'Add New Service'}
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Service Title *</Text>
              <TextInput
                style={styles.input}
                value={currentService.title}
                onChangeText={(text) => setCurrentService({...currentService, title: text})}
                placeholder="e.g. Signature Facial"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={currentService.description}
                onChangeText={(text) => setCurrentService({...currentService, description: text})}
                placeholder="Describe what this service includes and its benefits"
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Price ($) *</Text>
                <TextInput
                  style={styles.input}
                  value={currentService.price?.toString()}
                  onChangeText={(text) => setCurrentService({...currentService, price: parseFloat(text) || 0})}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Duration (min) *</Text>
                <TextInput
                  style={styles.input}
                  value={currentService.duration?.toString()}
                  onChangeText={(text) => setCurrentService({...currentService, duration: parseInt(text) || 60})}
                  keyboardType="numeric"
                  placeholder="60"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <Text style={currentService.category ? styles.inputText : styles.placeholderText}>
                  {currentService.category || 'Select a category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              
              {showCategoryPicker && (
                <View style={styles.pickerContainer}>
                  <ScrollView style={styles.picker}>
                    {serviceCategories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.pickerItem,
                          currentService.category === category && styles.pickerItemSelected
                        ]}
                        onPress={() => {
                          setCurrentService({...currentService, category});
                          setShowCategoryPicker(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          currentService.category === category && styles.pickerItemTextSelected
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Active Status</Text>
                <Switch
                  value={currentService.isActive}
                  onValueChange={(value) => setCurrentService({...currentService, isActive: value})}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={theme.colors.white}
                />
              </View>
              <Text style={styles.helpText}>
                Active services can be booked by clients
              </Text>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={() => setIsModalVisible(false)}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
            <Button
              title={isEditing ? "Update Service" : "Create Service"}
              onPress={handleSaveService}
              style={styles.saveButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddService}
        >
          <Ionicons name="add" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.servicesList}>
        {services.length > 0 ? (
          services.map((service) => (
            <View 
              key={service.id} 
              style={[styles.serviceCard, !service.isActive && styles.inactiveCard]}
            >
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <View style={styles.serviceActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditService(service)}
                  >
                    <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteService(service.id)}
                  >
                    <MaterialIcons name="delete" size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={styles.serviceCategory}>{service.category}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              
              <View style={styles.serviceFooter}>
                <View style={styles.serviceDetails}>
                  <Text style={styles.servicePrice}>${service.price}</Text>
                  <Text style={styles.serviceDuration}>{service.duration} min</Text>
                  <Text style={styles.bookingCount}>{service.bookingCount} bookings</Text>
                </View>
                
                <View style={styles.statusContainer}>
                  <Switch
                    value={service.isActive}
                    onValueChange={(value) => handleToggleStatus(service.id, value)}
                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                    thumbColor={theme.colors.white}
                  />
                  <Text style={styles.statusText}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="spa" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>No Services Yet</Text>
            <Text style={styles.emptyStateText}>
              Add your first service to start accepting bookings
            </Text>
            <Button
              title="Add Service"
              onPress={handleAddService}
              style={styles.emptyStateButton}
            />
          </View>
        )}
      </ScrollView>
      
      {renderServiceModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesList: {
    flex: 1,
    padding: 16,
  },
  serviceCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inactiveCard: {
    opacity: 0.7,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.text,
    flex: 1,
  },
  serviceActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  serviceCategory: {
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 16,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginRight: 12,
  },
  serviceDuration: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 12,
  },
  bookingCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    width: '50%',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    justifyContent: 'space-between',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  placeholderText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    color: theme.colors.text,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: theme.colors.background,
  },
  picker: {
    maxHeight: 150,
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pickerItemSelected: {
    backgroundColor: theme.colors.primaryLight,
  },
  pickerItemText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  pickerItemTextSelected: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
});

export default ServiceManagementScreen; 