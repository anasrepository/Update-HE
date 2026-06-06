import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface WorkoutCreationModalProps {
  visible: boolean;
  onClose: () => void;
  name: string;
	description: string;
	difficulty_level: string;
	w_reward: number;
	exercises: any[];
}

export const WorkoutCreationModal: React.FC<WorkoutCreationModalProps> = ({
  visible,
  onClose,
  name,
	description,
	difficulty_level,
	w_reward,
	exercises
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#D68D54', '#B25B28']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="trophy" size={60} color="white" />
            </View>
            
            <Text style={styles.congratsText}>Success!</Text>
            <Text style={styles.workoutText}>You Created Workout: {name}</Text>			
			
            <Text style={styles.workoutText}>Description: {description}</Text>
			
			<Text style={styles.workoutText}>Difficulty Level: {difficulty_level}</Text>
			
			<Text style={styles.workoutText}>Total Reward Points: {w_reward}</Text>
			
			
			<Text style={styles.workoutText}>Exercises Data:</Text>

{exercises && exercises.length > 0 ? (
  exercises.map((exercise, index) => (
    <View key={index} style={styles.exerciseBox}>
      <Text style={styles.exerciseText}>
        {index + 1}. {exercise.name || `Exercise ID: ${exercise.exercise_id}`}
      </Text>

      {exercise.description && (
        <Text style={styles.exerciseDetail}>
          Description: {exercise.description}
        </Text>
      )}

      {exercise.type && (
        <Text style={styles.exerciseDetail}>
          Type: {exercise.type}
        </Text>
      )}

      {exercise.difficulty_level && (
        <Text style={styles.exerciseDetail}>
          Difficulty: {exercise.difficulty_level}
        </Text>
      )}
    </View>
  ))
) : (
  <Text style={styles.exerciseDetail}>No exercise data available.</Text>
)}
			
             
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Awesome!</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    padding: 30,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  workoutText: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
	fontWeight: '600',
    marginBottom: 20,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },


  chestnutIcon: {
    fontSize: 28,
  },

  closeButton: {
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#B25B28',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  
 exerciseBox: {
  backgroundColor: 'rgba(255,255,255,0.2)',
  padding: 10,
  borderRadius: 10,
  marginVertical: 6,
  width: '90%',
},

exerciseText: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: 'bold',
  textAlign: 'center',
},

exerciseDetail: {
  color: '#FFFFFF',
  fontSize: 13,
  textAlign: 'center',
  marginTop: 3,
}, 
  
  
});