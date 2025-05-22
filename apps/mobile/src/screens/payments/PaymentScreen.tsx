import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Linking
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { supabase } from '../../services/supabase';
import theme, { COLORS } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

type PaymentScreenRouteProp = {
  params: {
    amount: number;
    serviceName: string;
    providerName: string;
    bookingId: string;
  };
};

type PaymentMethod = 'card' | 'crypto' | null;

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<PaymentScreenRouteProp>();
  const { amount, serviceName, providerName, bookingId } = route.params;
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Calculate fees and total
  const serviceFee = amount * 0.05; // 5% service fee
  const total = amount + serviceFee;

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handleStripePayment = async () => {
    setProcessingPayment(true);
    try {
      // In a real implementation, this would call the Stripe API
      // to create a payment intent and show the payment sheet
      
      // Mock successful payment
      setTimeout(() => {
        setProcessingPayment(false);
        handlePaymentSuccess();
      }, 2000);
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      setProcessingPayment(false);
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    }
  };

  const handleCryptoPayment = async () => {
    setProcessingPayment(true);
    try {
      // In a real implementation, this would call the Coinbase Commerce API
      // to create a charge and redirect to the payment page
      
      // Mock opening Coinbase Commerce page
      const coinbaseCommerceUrl = 'https://commerce.coinbase.com/checkout/example';
      
      const canOpen = await Linking.canOpenURL(coinbaseCommerceUrl);
      if (canOpen) {
        await Linking.openURL(coinbaseCommerceUrl);
        // In a real app, you would then listen for webhook events to confirm payment
        
        // For demo purposes, we'll just simulate a successful payment after delay
        setTimeout(() => {
          setProcessingPayment(false);
          handlePaymentSuccess();
        }, 5000);
      } else {
        throw new Error('Cannot open Coinbase Commerce');
      }
    } catch (error) {
      console.error('Error processing crypto payment:', error);
      setProcessingPayment(false);
      Alert.alert('Payment Failed', 'There was an error processing your crypto payment. Please try again.');
    }
  };

  const handlePaymentSuccess = () => {
    // In a real app, this would update the booking status in the database
    Alert.alert(
      'Payment Successful',
      'Your booking has been confirmed.',
      [
        {
          text: 'View Booking',
          onPress: () => navigation.navigate('Bookings')
        }
      ]
    );
  };

  const handlePayNow = () => {
    if (selectedPaymentMethod === 'card') {
      handleStripePayment();
    } else if (selectedPaymentMethod === 'crypto') {
      handleCryptoPayment();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <View style={styles.bookingDetails}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Service:</Text>
          <Text style={styles.detailValue}>{serviceName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Provider:</Text>
          <Text style={styles.detailValue}>{providerName}</Text>
        </View>
      </View>

      <View style={styles.paymentSummary}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service amount</Text>
          <Text style={styles.summaryValue}>${amount.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service fee</Text>
          <Text style={styles.summaryValue}>${serviceFee.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.paymentMethods}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        
        <TouchableOpacity
          style={[
            styles.paymentMethodCard,
            selectedPaymentMethod === 'card' && styles.selectedPaymentMethod
          ]}
          onPress={() => handleSelectPaymentMethod('card')}
        >
          <View style={styles.paymentMethodContent}>
            <FontAwesome5 name="credit-card" size={24} color={COLORS.grey700} />
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodTitle}>Credit or Debit Card</Text>
              <Text style={styles.paymentMethodSubtitle}>Pay securely with Stripe</Text>
            </View>
          </View>
          {selectedPaymentMethod === 'card' && (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.paymentMethodCard,
            selectedPaymentMethod === 'crypto' && styles.selectedPaymentMethod
          ]}
          onPress={() => handleSelectPaymentMethod('crypto')}
        >
          <View style={styles.paymentMethodContent}>
            <FontAwesome5 name="bitcoin" size={24} color={COLORS.grey700} />
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodTitle}>Cryptocurrency</Text>
              <Text style={styles.paymentMethodSubtitle}>BTC, ETH, USDC and more</Text>
            </View>
          </View>
          {selectedPaymentMethod === 'crypto' && (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={processingPayment ? "Processing..." : "Pay Now"}
          disabled={!selectedPaymentMethod || processingPayment}
          isLoading={processingPayment}
          onPress={handlePayNow}
          fullWidth
        />
      </View>

      <View style={styles.securityInfo}>
        <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.grey600} />
        <Text style={styles.securityText}>
          Your payment information is processed securely. We do not store your credit card details.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey300,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.grey800,
  },
  bookingDetails: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.grey800,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.grey600,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.grey800,
  },
  paymentSummary: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.grey600,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.grey800,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey300,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.grey800,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  paymentMethods: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.grey300,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.grey100,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodInfo: {
    marginLeft: 12,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.grey800,
  },
  paymentMethodSubtitle: {
    fontSize: 12,
    color: COLORS.grey600,
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  securityText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: COLORS.grey600,
  },
});

export default PaymentScreen; 