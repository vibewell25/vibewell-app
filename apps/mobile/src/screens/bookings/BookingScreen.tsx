import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

// Mock data for available time slots
const availableTimeSlots = {
  morning: [
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
  ],
  afternoon: [
    { id: '4', time: '12:00 PM', available: true },
    { id: '5', time: '01:00 PM', available: false },
    { id: '6', time: '02:00 PM', available: true },
    { id: '7', time: '03:00 PM', available: true },
  ],
  evening: [
    { id: '8', time: '04:00 PM', available: true },
    { id: '9', time: '05:00 PM', available: true },
    { id: '10', time: '06:00 PM', available: false },
  ],
};

// Generate calendar days for the current month
const generateCalendarDays = () => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  const days = [];
  
  // Add empty slots for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ day: '', date: null, isCurrentMonth: false });
  }
  
  // Add days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i);
    days.push({
      day: i.toString(),
      date,
      isCurrentMonth: true,
      isToday: i === today.getDate(),
      isPast: date < new Date(today.setHours(0, 0, 0, 0)),
    });
  }
  
  return days;
};

const BookingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const calendarDays = generateCalendarDays();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };
  
  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };
  
  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTimeSlot) {
      Alert.alert('Error', 'Please select both a date and time slot');
      return;
    }
    
    const selectedTime = Object.values(availableTimeSlots)
      .flat()
      .find(slot => slot.id === selectedTimeSlot)?.time;
    
    Alert.alert(
      'Confirm Booking',
      `Do you want to book an appointment on ${selectedDate.toDateString()} at ${selectedTime}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            // Here we would make an API call to book the appointment
            Alert.alert(
              'Booking Confirmed',
              `Your appointment has been scheduled for ${selectedDate.toDateString()} at ${selectedTime}.`,
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book an Appointment</Text>
        <Text style={styles.subtitle}>Select a date and time that works for you</Text>
      </View>
      
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={handlePreviousMonth}>
            <Text style={styles.calendarNavButton}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.calendarMonth}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={styles.calendarNavButton}>▶</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekdaysContainer}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Text key={index} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.daysContainer}>
          {calendarDays.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                item.isToday && styles.todayCell,
                selectedDate && item.date && 
                  selectedDate.toDateString() === item.date.toDateString() && 
                  styles.selectedDayCell,
                item.isPast && styles.pastDayCell,
                !item.isCurrentMonth && styles.inactiveCell,
              ]}
              disabled={!item.isCurrentMonth || item.isPast}
              onPress={() => handleDateSelect(item.date)}
            >
              <Text style={[
                styles.dayText,
                item.isToday && styles.todayText,
                selectedDate && item.date && 
                  selectedDate.toDateString() === item.date.toDateString() && 
                  styles.selectedDayText,
                item.isPast && styles.pastDayText,
                !item.isCurrentMonth && styles.inactiveDayText,
              ]}>
                {item.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Time Slots */}
      {selectedDate && (
        <View style={styles.timeSlotsContainer}>
          <Text style={styles.timeSlotsTitle}>Available Time Slots</Text>
          <Text style={styles.selectedDateText}>
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          
          <View style={styles.timeSlotSection}>
            <Text style={styles.timeSlotSectionTitle}>Morning</Text>
            <View style={styles.timeSlotGrid}>
              {availableTimeSlots.morning.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlot,
                    !slot.available && styles.unavailableTimeSlot,
                    selectedTimeSlot === slot.id && styles.selectedTimeSlot,
                  ]}
                  disabled={!slot.available}
                  onPress={() => handleTimeSlotSelect(slot.id)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    !slot.available && styles.unavailableTimeSlotText,
                    selectedTimeSlot === slot.id && styles.selectedTimeSlotText,
                  ]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.timeSlotSection}>
            <Text style={styles.timeSlotSectionTitle}>Afternoon</Text>
            <View style={styles.timeSlotGrid}>
              {availableTimeSlots.afternoon.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlot,
                    !slot.available && styles.unavailableTimeSlot,
                    selectedTimeSlot === slot.id && styles.selectedTimeSlot,
                  ]}
                  disabled={!slot.available}
                  onPress={() => handleTimeSlotSelect(slot.id)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    !slot.available && styles.unavailableTimeSlotText,
                    selectedTimeSlot === slot.id && styles.selectedTimeSlotText,
                  ]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.timeSlotSection}>
            <Text style={styles.timeSlotSectionTitle}>Evening</Text>
            <View style={styles.timeSlotGrid}>
              {availableTimeSlots.evening.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlot,
                    !slot.available && styles.unavailableTimeSlot,
                    selectedTimeSlot === slot.id && styles.selectedTimeSlot,
                  ]}
                  disabled={!slot.available}
                  onPress={() => handleTimeSlotSelect(slot.id)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    !slot.available && styles.unavailableTimeSlotText,
                    selectedTimeSlot === slot.id && styles.selectedTimeSlotText,
                  ]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.bookButton,
              (!selectedDate || !selectedTimeSlot) && styles.disabledButton
            ]}
            disabled={!selectedDate || !selectedTimeSlot}
            onPress={handleBookAppointment}
          >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.grey900,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
  },
  calendarContainer: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  calendarMonth: {
    fontSize: FONTS.h3,
    fontWeight: '600',
    color: COLORS.grey900,
  },
  calendarNavButton: {
    fontSize: FONTS.h3,
    color: COLORS.primary,
    padding: SPACING.sm,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONTS.bodySmall,
    fontWeight: '500',
    color: COLORS.grey600,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dayText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey900,
  },
  todayCell: {
    backgroundColor: COLORS.grey100,
    borderRadius: BORDER_RADIUS.round,
  },
  todayText: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  selectedDayCell: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
  },
  selectedDayText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  pastDayCell: {
    opacity: 0.5,
  },
  pastDayText: {
    color: COLORS.grey400,
  },
  inactiveCell: {
    opacity: 0,
  },
  inactiveDayText: {
    color: 'transparent',
  },
  timeSlotsContainer: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    ...SHADOWS.small,
  },
  timeSlotsTitle: {
    fontSize: FONTS.h3,
    fontWeight: '600',
    color: COLORS.grey900,
    marginBottom: SPACING.xs,
  },
  selectedDateText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
    marginBottom: SPACING.md,
  },
  timeSlotSection: {
    marginBottom: SPACING.lg,
  },
  timeSlotSectionTitle: {
    fontSize: FONTS.bodyMedium,
    fontWeight: '600',
    color: COLORS.grey700,
    marginBottom: SPACING.sm,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    backgroundColor: COLORS.grey100,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    minWidth: 90,
    alignItems: 'center',
  },
  unavailableTimeSlot: {
    backgroundColor: COLORS.grey200,
    opacity: 0.5,
  },
  selectedTimeSlot: {
    backgroundColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey800,
  },
  unavailableTimeSlotText: {
    color: COLORS.grey500,
  },
  selectedTimeSlotText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  disabledButton: {
    backgroundColor: COLORS.grey300,
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: FONTS.bodyMedium,
    fontWeight: '600',
  },
});

export default BookingScreen; 