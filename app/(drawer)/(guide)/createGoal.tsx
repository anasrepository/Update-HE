import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { TextInput, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import ScreenTransition from '@/components/screenTransition';
import { GoalDBModal } from '@/utils/dbFunctions';
import { getCurrentUser } from '@/utils/authState';
import { router } from 'expo-router';
import { GoalCreationModal } from '@/components/GoalCreationModal';

export default function CreateGoal() {
  const [goalType, setGoalType] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [timeline, setTimeline] = useState(''); // Stores the YYYY-MM-DD string
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  
  // Date Picker States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const goalTypeOptions = React.useMemo(
    () => [
      { label: 'Weight Goal', value: 'weight' },
      { label: 'Activity Goal', value: 'activity' },
      { label: 'XP Goal', value: 'xpgoal' },
      { label: 'Step Goal', value: 'stepgoal' },
    ],
    []
  );
  
  const [creationModal, setCreationModal] = useState<{
    visible: boolean;
    goal_type: string;
    target_value: string;
    timeline: string;
    target_date: string;
  }>({
    visible: false,
    goal_type: '',
    target_value: '',
    timeline: '',
    target_date: ''
  });

  const resetForm = () => {
    setGoalType('');
    setTargetValue('');
    setTimeline('');
    setDescription('');
    setSelectedDate(new Date());
  };

// Handle Date Selection Changes
  const onDateChange = (event: any, date?: Date) => {
    // For Web, extract the date string value from target directly
    if (Platform.OS === 'web' && event?.target?.value) {
      const webValue = event.target.value; // Format: YYYY-MM-DD
      setTimeline(webValue);
      setSelectedDate(new Date(webValue));
      return;
    }

    // Native Mobile Handling
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      
      // Format date to YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setTimeline(`${year}-${month}-${day}`);
    }
  };


  const createGoal = async () => {
    if (!goalType.trim()) {
      Alert.alert('Error', 'Please select goal type');
      return;
    }

    if (!targetValue.trim()) {
      Alert.alert('Error', 'Please enter target value');
      return;
    }

    if (isNaN(Number(targetValue)) || Number(targetValue) < 0) {
      Alert.alert('Error', 'Target value must be a valid positive number');
      return;
    }

    if (!timeline.trim()) {
      Alert.alert('Error', 'Please select a target date');
      return;
    }

    try {
      setCreating(true);
      const user = await getCurrentUser();

      if (!user || !user.id) {
        Alert.alert('Error', 'No authenticated user found');
        return;
      }

      const goalData = {
        type: goalType.trim(),
        target_value: Number(targetValue),
        timeline: timeline.trim(),
        description: description.trim() || null,
      };

      console.log('Goal Data before insert:', goalData);
      const result = await GoalDBModal.insert(goalData);

      setCreationModal({
        visible: true,
        goal_type: result.type,
        target_value: result.target_value,
        target_date: result.target_date || result.timeline,
        timeline: ''
      });

    } catch (error) {
      console.error('Create goal error:', error);
      Alert.alert('Error', 'Failed to create goal');
    } finally {
      setCreating(false);
    }
  };
  
  const closeCreationModal = () => {
    setCreationModal({
      visible: false,
      goal_type: '',
      target_value: '',
      target_date: '',
      timeline: ''
    });
    resetForm();
    router.push('/(drawer)/(tabs)');
  };

  return (
    <ScreenTransition type="zoom">
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Create Goal</Text>
              <Text style={styles.headerSubtitle}>
                Set your health, activity, XP, or step goal
              </Text>
            </View>

            {/* Goal Type */}
            <View style={styles.section}>
              <Text style={styles.label}>Goal Type *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={goalType}
                  onValueChange={(itemValue) => setGoalType(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select goal type..." value="" />
                  {goalTypeOptions.map((opt) => (
                    <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Target Value */}
            <View style={styles.section}>
              <Text style={styles.label}>Target Value *</Text>
              <TextInput
                value={targetValue}
                
				onChangeText={(text) => {
				  const integerOnly = text.replace(/[^0-9]/g, '');
				  setTargetValue(integerOnly);
				}}	
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                placeholder="e.g., 10000"
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
                textColor="#000000"
              />
            </View>

           

   {/* Target Date (Interactive Field) */}
            <View style={styles.section}>
              <Text style={styles.label}>Target Date *</Text>
              
              {Platform.OS === 'web' ? (
                // Web specific native HTML5 input injection
                <input
                  type="date"
                  value={timeline}
                  min={new Date().toISOString().split('T')[0]} // Blocks past dates
                  onChange={(e) => onDateChange(e)}
				  onKeyDown={(e) => e.preventDefault()}
				  onPaste={(e) => e.preventDefault()}  
                  style={{
                    height: 52,
                    borderColor: '#D68D54',
                    borderWidth: 1,
                    borderRadius: 6,
                    paddingHorizontal: 12,
                    fontSize: 16,
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                // Native Mobile Input trigger
                <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                  <View pointerEvents="none">
                    <TextInput
                      value={timeline}
                      mode="outlined"
                      style={styles.input}
                      placeholder="Select future date from calendar..."
                      outlineColor="#D68D54"
                      activeOutlineColor="#D68D54"
                      textColor="#000000"
                      editable={false}
                      right={<TextInput.Icon icon="calendar" color="#D68D54" />}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Inline Calendar Renderer (Only for Native Mobile Devices) */}
            {showDatePicker && Platform.OS !== 'web' && (
              <View style={Platform.OS === 'ios' ? styles.iosDatePickerContainer : null}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()} 
                  onChange={onDateChange}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity 
                    style={styles.iosDoneButton} 
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.iosDoneButtonText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}         

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                placeholder="Describe your goal..."
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
                textColor="#000000"
              />
            </View>
      
            <GoalCreationModal
              visible={creationModal.visible}
              onClose={closeCreationModal}
              target_value={creationModal.target_value}
              goal_type={creationModal.goal_type}
              target_date={creationModal.target_date}
            />

            <TouchableOpacity
              style={[styles.button, creating && styles.buttonDisabled]}
              onPress={createGoal}
              disabled={creating}
            >
              <Ionicons name="flag" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>
                {creating ? 'Saving...' : 'Save Goal'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </PaperProvider>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F4' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 30, alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#3A2A1F' },
  headerSubtitle: { fontSize: 14, color: '#9B8579', marginTop: 4, textAlign: 'center' },
  section: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 6, color: '#3A2A1F', fontWeight: '600' },
  input: { backgroundColor: '#FFFFFF' },
  pickerContainer: { borderWidth: 1, borderColor: '#D68D54', borderRadius: 6, backgroundColor: '#FFFFFF', height: 56, justifyContent: 'center', paddingHorizontal: 10 },
  picker: { height: 56, fontSize: 14, color: '#3A2A1F' },
  button: { marginTop: 10, flexDirection: 'row', height: 52, borderRadius: 12, backgroundColor: '#D68D54', alignItems: 'center', justifyContent: 'center' },
  buttonDisabled: { backgroundColor: '#E0E0E0' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  // Optional iOS specific styles for modal wrapper
  iosDatePickerContainer: { backgroundColor: '#FFFFFF', padding: 10, marginTop: -10, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
  iosDoneButton: { alignment: 'center', padding: 10, backgroundColor: '#D68D54', borderRadius: 6, marginTop: 5 },
  iosDoneButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' }
});