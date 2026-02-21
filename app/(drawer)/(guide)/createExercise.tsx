import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenTransition from '@/components/screenTransition';
import { ExerciseDBModal } from '@/utils/dbFunctions';

export default function CreateExercise() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [measurementType, setMeasurementType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [creating, setCreating] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setType('');
    setMeasurementType('');
    setDifficulty('');
    setMuscleGroup('');
  };

  const createExercise = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Exercise name is required');
      return;
    }

    if (!type.trim() || !measurementType.trim()) {
      Alert.alert('Error', 'Type and measurement type are required');
      return;
    }

    try {
      setCreating(true);

      const exerciseData = {
        name: name.trim(),
        description: description.trim() || null,
        type: type.trim(),
        measurement_type: measurementType.trim(),
        difficulty_level: difficulty.trim() || null,
        target_muscle_group: muscleGroup.trim() || null
      };

      await ExerciseDBModal.insert(exerciseData);

      Alert.alert(
        'Success',
        'Exercise added successfully',
        [{ text: 'OK', onPress: resetForm }]
      );

    } catch (error) {
      console.error('Insert exercise error:', error);
      Alert.alert('Error', 'Failed to add exercise');
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
              <Text style={styles.headerTitle}>Create Exercise</Text>
              <Text style={styles.headerSubtitle}>Add a new exercise to database</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
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
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Type *</Text>
              <TextInput
                value={type}
                onChangeText={setType}
                mode="outlined"
                style={styles.input}
                placeholder="strength / cardio"
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Measurement Type *</Text>
              <TextInput
                value={measurementType}
                onChangeText={setMeasurementType}
                mode="outlined"
                style={styles.input}
                placeholder="reps / duration"
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Difficulty Level</Text>
              <TextInput
                value={difficulty}
                onChangeText={setDifficulty}
                mode="outlined"
                style={styles.input}
                placeholder="beginner / intermediate / advanced"
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Target Muscle Group</Text>
              <TextInput
                value={muscleGroup}
                onChangeText={setMuscleGroup}
                mode="outlined"
                style={styles.input}
                placeholder="chest / legs / full-body"
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, creating && styles.buttonDisabled]}
              onPress={createExercise}
              disabled={creating}
            >
              <Ionicons name="add-circle" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>
                {creating ? 'Saving...' : 'Save Exercise'}
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