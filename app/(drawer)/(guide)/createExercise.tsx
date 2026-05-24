import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenTransition from '@/components/screenTransition';
import { Dropdown } from 'react-native-paper-dropdown';
import { Picker} from '@react-native-picker/picker';
import { ExerciseDBModal } from '@/utils/dbFunctions';
import { ExerciseCreationModal } from '@/components/ExerciseCreationModal';
import { completeWorkoutPlan } from '@/utils/workoutService';
import { router, useLocalSearchParams } from "expo-router";


export default function CreateExercise() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [measurementType, setMeasurementType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [creating, setCreating] = useState(false);
  const [type, setType] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [showTypeDropDown, setShowTypeDropDown] = useState(false);  
  const [creationModal, setCreationModal] = useState<{
        visible: boolean;
        exerciseName: string;
        description: string;
        exercise_type: string;
        measurement_type: string;
        target_muscle_group: string;
        difficulty_level: string;
    }>({
        visible: false,
        exerciseName: '',
		description: '',
        exercise_type: '',
        measurement_type: '',
        target_muscle_group: '',
        difficulty_level: ''
    });

  const resetForm = () => {
    setName('');
    setDescription('');
    setExerciseType('');
    setMeasurementType('');
    setDifficulty('');
    setMuscleGroup('');
  };
  //console.log("Dropdown: ", Dropdown); // for testing
  const exerciseTypeOptions = React.useMemo(() => [
  {label:"Strength", value:"strength"},
  {label:"Flexibility", value:"flexibility"},
  {label:"Balance", value:"balance"},
  {label:"Mobility", value:"mobility"},
  {label:"Cardio", value: "cardio"},
  {label:"Endurance", value:"endurance"},
  {label:"Sport", value:"sport"},
  {label:"Plyometric", value:"plyometric"}
  ],[]);
  
  const measurementTypeOptions = React.useMemo(() => [
  {label:"Reps", value:"reps"},
  {label:"Duration", value: "duration"}
  ],[]);
  
  const difficultyOptions = React.useMemo(() => [
  {label:"Beginner", value:"beginner"},
  {label:"Intermediate", value: "intermediate"},
  {label:"Advanced", value: "advanced"}
  ],[]);
  
  const muscleGroupOptions = React.useMemo(() => [
  {label:"Chest", value:"chest"},
  {label:"Legs", value: "legs"},
  {label:"Arms", value: "arms"},
  {label:"Shoulders", value: "shoulders"},
  {label:"Upper Back", value: "upper-back"},
  {label:"Lower Back", value: "lower-back"},
  {label:"Full-body", value: "full-body"}
  ],[]);

  const createExercise = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Exercise name is required');
      return;
    }

    if (!exerciseType.trim() || !measurementType.trim()) {
      Alert.alert('Error', 'Type and measurement type are required');
      return;
    }

    try {
      setCreating(true);

      const exerciseData = {
        name: name.trim(),
        description: description.trim() || null,
        type: exerciseType.trim(),
        measurement_type: measurementType.trim(),
        difficulty_level: difficulty.trim() || null,
        target_muscle_group: muscleGroup.trim() || null
      };

      const result = await ExerciseDBModal.insert(exerciseData);
	  //console.log("Exercise created", result);
	  
	  // Show completion modal
		setCreationModal({
			visible: true,
			exerciseName: result.name,
			description: result.description,
			exercise_type: result.type,
			measurement_type: result.measurement_type,
			target_muscle_group: result.target_muscle_group,
			difficulty_level: result.difficulty_level
		});

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
  
      // Close completion modal and navigate back
    const closeCreationModal = () => {
        setCreationModal({
            visible: false,
            exerciseName: '',
            description: '',
			exercise_type: '',
			measurement_type: '',
			target_muscle_group: '',
			difficulty_level: ''
        });
		// navigate to home screen after successful creation of exercise
        router.push('/(drawer)/(tabs)');
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
			  <Text style={styles.label}>Exercise Type *</Text>
			  <View style={styles.pickerContainer}>
				<Picker
				  selectedValue={exerciseType}
				  onValueChange={(itemValue) => setExerciseType(itemValue)}
				  style={styles.picker}
				>
				  <Picker.Item label="Select exercise type..." value="" />
				  {exerciseTypeOptions.map(opt => (
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
			  <Text style={styles.label}>Measurement Type *</Text>
			  <View style={styles.pickerContainer}>
				<Picker
				  selectedValue={measurementType}
				  onValueChange={(itemValue) => setMeasurementType(itemValue)}
				  style={styles.picker}
				>
				  <Picker.Item label="Select measurement type..." value="" />
				  {measurementTypeOptions.map(opt => (
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
			  <Text style={styles.label}>Difficulty Level *</Text>
			  <View style={styles.pickerContainer}>
			  
				<Picker
				  selectedValue={difficulty}
				  onValueChange={(itemValue) => setDifficulty(itemValue)}
				  style={styles.picker}
				>
				  <Picker.Item label="Select difficulty level..." value="" />
				  {difficultyOptions.map(opt => (
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
			  <Text style={styles.label}>Target Muscle Group *</Text>
			  <View style={styles.pickerContainer}>
				<Picker
				  selectedValue={muscleGroup}
				  onValueChange={(itemValue) => setMuscleGroup(itemValue)}
				  style={styles.picker}
				  
				>
				  <Picker.Item label="Select muscle group..." value="" />
				  {muscleGroupOptions.map(opt => (
					<Picker.Item
					  key={opt.value}
					  label={opt.label}
					  value={opt.value}
					/>
				  ))}
				</Picker>
			  </View>
			</View>

            <TouchableOpacity
              style={[styles.button, creating && styles.buttonDisabled]}
              onPress={createExercise}
              
            >
              <Ionicons name="add-circle" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>
                {creating ? 'Saving...' : 'Save Exercise'}
              </Text>
            </TouchableOpacity>

          </ScrollView>
		  
		  <ExerciseCreationModal
                visible={creationModal.visible}
                onClose={closeCreationModal}
                exerciseName={creationModal.exerciseName}
                description={creationModal.description}
                exercise_type={creationModal.exercise_type}
                measurement_type={creationModal.measurement_type}
                target_muscle_group={creationModal.target_muscle_group}
                difficulty_level={creationModal.difficulty_level}

            />
		  
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
	pickerItem: {
	  fontSize: 14,
	  height: 56,
	  color: '#3A2A1F',
	},
  
});