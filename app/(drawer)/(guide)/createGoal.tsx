import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import ScreenTransition from '@/components/screenTransition';
import { GoalDBModal } from '@/utils/dbFunctions';
import { getCurrentUser } from '@/utils/authState';
import { router } from 'expo-router';

export default function CreateGoal() {
  const [goalType, setGoalType] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [timeline, setTimeline] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const goalTypeOptions = React.useMemo(
    () => [
      { label: 'Weight Goal', value: 'weight' },
      { label: 'Activity Goal', value: 'activity' },
      { label: 'XP Goal', value: 'xpgoal' },
      { label: 'Step Goal', value: 'stepgoal' },
    ],
    []
  );

  const resetForm = () => {
    setGoalType('');
    setTargetValue('');
    setTimeline('');
    setDescription('');
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
      Alert.alert('Error', 'Please enter target date');
      return;
    }

    const parsedDate = new Date(timeline);

    if (isNaN(parsedDate.getTime())) {
      Alert.alert('Error', 'Please enter a valid date, for example 2026-06-30');
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

      console.log('Goal created result:', result);

      Alert.alert(
        'Success',
        `Goal created successfully!\n\nType: ${result.type}\nTarget: ${result.target_value}`,
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              router.push('/(drawer)/(tabs)');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Create goal error:', error);
      Alert.alert('Error', 'Failed to create goal');
    } finally {
      setCreating(false);
    }
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
                    <Picker.Item
                      key={opt.value}
                      label={opt.label}
                      value={opt.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Target Value *</Text>
              <TextInput
                value={targetValue}
                onChangeText={setTargetValue}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                placeholder="e.g., 10000"
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
                textColor="#000000"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Target Date *</Text>
              <TextInput
                value={timeline}
                onChangeText={setTimeline}
                mode="outlined"
                style={styles.input}
                placeholder="YYYY-MM-DD, e.g., 2026-06-30"
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
                textColor="#000000"
              />
            </View>

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
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },

  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 30,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3A2A1F',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#9B8579',
    marginTop: 4,
    textAlign: 'center',
  },

  section: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#3A2A1F',
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#FFFFFF',
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D68D54',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  picker: {
    height: 56,
    fontSize: 14,
    color: '#3A2A1F',
  },

  button: {
    marginTop: 10,
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#D68D54',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    backgroundColor: '#E0E0E0',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});