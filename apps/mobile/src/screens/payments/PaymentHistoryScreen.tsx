import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { supabase } from '../../services/supabase';
import theme, { COLORS } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

type Transaction = {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: 'card' | 'crypto';
  serviceName: string;
  providerName: string;
};

type SavedPaymentMethod = {
  id: string;
  type: 'card' | 'crypto';
  lastFour?: string;
  cardBrand?: string;
  walletAddress?: string;
  currency?: string;
  isDefault: boolean;
};

const PaymentHistoryScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [activeTab, setActiveTab] = useState<'transactions' | 'methods'>('transactions');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch data from Supabase
      // Mock data for demonstration
      const mockTransactions: Transaction[] = [
        {
          id: 't1',
          date: '2023-07-15T14:30:00',
          amount: 95.00,
          status: 'completed',
          paymentMethod: 'card',
          serviceName: 'Signature Facial',
          providerName: 'Sarah Johnson'
        },
        {
          id: 't2',
          date: '2023-07-03T11:15:00',
          amount: 120.00,
          status: 'completed',
          paymentMethod: 'crypto',
          serviceName: 'Deep Tissue Massage',
          providerName: 'Mark Wilson'
        },
        {
          id: 't3',
          date: '2023-06-28T09:45:00',
          amount: 150.00,
          status: 'completed',
          paymentMethod: 'card',
          serviceName: 'Chemical Peel',
          providerName: 'Sarah Johnson'
        },
        {
          id: 't4',
          date: '2023-06-20T16:00:00',
          amount: 75.00,
          status: 'failed',
          paymentMethod: 'card',
          serviceName: 'Express Facial',
          providerName: 'Emily Brown'
        },
      ];
      
      const mockPaymentMethods: SavedPaymentMethod[] = [
        {
          id: 'pm1',
          type: 'card',
          lastFour: '4242',
          cardBrand: 'Visa',
          isDefault: true
        },
        {
          id: 'pm2',
          type: 'crypto',
          walletAddress: '0x1a2b...3c4d',
          currency: 'ETH',
          isDefault: false
        }
      ];
      
      setTransactions(mockTransactions);
      setSavedPaymentMethods(mockPaymentMethods);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      Alert.alert('Error', 'Failed to load payment data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReceipt = (transactionId: string) => {
    // In a real app, this would navigate to a receipt detail screen
    Alert.alert('Receipt', `Viewing receipt for transaction ${transactionId}`);
  };

  const handleRemovePaymentMethod = (paymentMethodId: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setSavedPaymentMethods(savedPaymentMethods.filter(method => method.id !== paymentMethodId));
          }
        }
      ]
    );
  };

  const handleSetDefaultPaymentMethod = (paymentMethodId: string) => {
    setSavedPaymentMethods(savedPaymentMethods.map(method => ({
      ...method,
      isDefault: method.id === paymentMethodId
    })));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
          <Text style={styles.providerName}>{item.providerName}</Text>
        </View>
        <Text 
          style={[
            styles.transactionAmount, 
            item.status === 'failed' && styles.failedAmount
          ]}
        >
          ${item.amount.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.transactionDetails}>
        <View style={styles.transactionDetail}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{formatDate(item.date)}</Text>
        </View>
        
        <View style={styles.transactionDetail}>
          <Text style={styles.detailLabel}>Payment Method:</Text>
          <View style={styles.paymentMethodTag}>
            {item.paymentMethod === 'card' ? (
              <FontAwesome5 name="credit-card" size={12} color={COLORS.grey600} />
            ) : (
              <FontAwesome5 name="bitcoin" size={12} color={COLORS.grey600} />
            )}
            <Text style={styles.paymentMethodText}>
              {item.paymentMethod === 'card' ? 'Card' : 'Crypto'}
            </Text>
          </View>
        </View>
        
        <View style={styles.transactionDetail}>
          <Text style={styles.detailLabel}>Status:</Text>
          <View style={[
            styles.statusTag,
            item.status === 'completed' && styles.completedStatus,
            item.status === 'pending' && styles.pendingStatus,
            item.status === 'failed' && styles.failedStatus,
          ]}>
            <Text style={[
              styles.statusText,
              item.status === 'completed' && styles.completedStatusText,
              item.status === 'pending' && styles.pendingStatusText,
              item.status === 'failed' && styles.failedStatusText,
            ]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.receiptButton}
        onPress={() => handleViewReceipt(item.id)}
      >
        <Ionicons name="receipt-outline" size={16} color={COLORS.primary} />
        <Text style={styles.receiptButtonText}>View Receipt</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentMethodItem = ({ item }: { item: SavedPaymentMethod }) => (
    <View style={styles.paymentMethodCard}>
      <View style={styles.paymentMethodHeader}>
        {item.type === 'card' ? (
          <View style={styles.cardInfo}>
            <FontAwesome5 name="credit-card" size={20} color={COLORS.grey700} />
            <View style={styles.cardDetails}>
              <Text style={styles.cardBrand}>{item.cardBrand}</Text>
              <Text style={styles.cardNumber}>•••• {item.lastFour}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.walletInfo}>
            <FontAwesome5 name="bitcoin" size={20} color={COLORS.grey700} />
            <View style={styles.walletDetails}>
              <Text style={styles.walletCurrency}>{item.currency} Wallet</Text>
              <Text style={styles.walletAddress}>{item.walletAddress}</Text>
            </View>
          </View>
        )}
        
        {item.isDefault && (
          <View style={styles.defaultTag}>
            <Text style={styles.defaultTagText}>Default</Text>
          </View>
        )}
      </View>
      
      <View style={styles.paymentMethodActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => handleSetDefaultPaymentMethod(item.id)}
          >
            <Text style={styles.setDefaultButtonText}>Set as Default</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemovePaymentMethod(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyTransactions = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={48} color={COLORS.grey400} />
      <Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
      <Text style={styles.emptyStateDescription}>
        Your payment history will appear here once you complete a booking.
      </Text>
    </View>
  );

  const renderEmptyPaymentMethods = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="credit-card" size={48} color={COLORS.grey400} />
      <Text style={styles.emptyStateTitle}>No Payment Methods</Text>
      <Text style={styles.emptyStateDescription}>
        You haven't saved any payment methods yet.
      </Text>
      <Button
        title="Add Payment Method"
        onPress={() => {
          // In a real app, this would navigate to add payment method screen
          Alert.alert('Add Payment Method', 'Navigate to add payment method screen');
        }}
        style={styles.addPaymentMethodButton}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
            Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'methods' && styles.activeTab]}
          onPress={() => setActiveTab('methods')}
        >
          <Text style={[styles.tabText, activeTab === 'methods' && styles.activeTabText]}>
            Payment Methods
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'transactions' ? (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyTransactions}
        />
      ) : (
        <View style={styles.paymentMethodsContainer}>
          <FlatList
            data={savedPaymentMethods}
            renderItem={renderPaymentMethodItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyPaymentMethods}
          />
          
          {savedPaymentMethods.length > 0 && (
            <Button
              title="Add Payment Method"
              onPress={() => {
                // In a real app, this would navigate to add payment method screen
                Alert.alert('Add Payment Method', 'Navigate to add payment method screen');
              }}
              style={styles.addButton}
            />
          )}
        </View>
      )}
    </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.grey600,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  transactionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.grey800,
  },
  providerName: {
    fontSize: 14,
    color: COLORS.grey600,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.grey800,
  },
  failedAmount: {
    color: COLORS.error,
    textDecorationLine: 'line-through',
  },
  transactionDetails: {
    marginBottom: 12,
  },
  transactionDetail: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.grey600,
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.grey800,
  },
  paymentMethodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey100,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  paymentMethodText: {
    fontSize: 12,
    color: COLORS.grey700,
    marginLeft: 4,
  },
  statusTag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: COLORS.grey100,
  },
  completedStatus: {
    backgroundColor: COLORS.success + '20',
  },
  pendingStatus: {
    backgroundColor: COLORS.warning + '20',
  },
  failedStatus: {
    backgroundColor: COLORS.error + '20',
  },
  statusText: {
    fontSize: 12,
    color: COLORS.grey700,
  },
  completedStatusText: {
    color: COLORS.success,
  },
  pendingStatusText: {
    color: COLORS.warning,
  },
  failedStatusText: {
    color: COLORS.error,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey200,
    marginTop: 4,
  },
  receiptButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  paymentMethodsContainer: {
    flex: 1,
  },
  paymentMethodCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetails: {
    marginLeft: 12,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.grey800,
  },
  cardNumber: {
    fontSize: 14,
    color: COLORS.grey600,
    marginTop: 2,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletDetails: {
    marginLeft: 12,
  },
  walletCurrency: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.grey800,
  },
  walletAddress: {
    fontSize: 14,
    color: COLORS.grey600,
    marginTop: 2,
  },
  defaultTag: {
    backgroundColor: COLORS.primary + '20',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  defaultTagText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  paymentMethodActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  setDefaultButton: {
    marginRight: 12,
  },
  setDefaultButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  removeButton: {},
  removeButtonText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.grey800,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: COLORS.grey600,
    textAlign: 'center',
    marginBottom: 24,
  },
  addPaymentMethodButton: {
    marginTop: 16,
  },
  addButton: {
    margin: 16,
  }
});

export default PaymentHistoryScreen;