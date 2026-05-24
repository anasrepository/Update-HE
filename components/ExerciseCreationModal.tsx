import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ExerciseCreationModalProps {
  visible: boolean;
  onClose: () => void;
  exerciseName: string;
	description: string;
	exercise_type: string;
	measurement_type: string;
	target_muscle_group: string;
	difficulty_level: string;
}

export const ExerciseCreationModal: React.FC<ExerciseCreationModalProps> = ({
  visible,
  onClose,
  exerciseName,
	description,
	exercise_type,
	measurement_type,
	target_muscle_group,
	difficulty_level
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
            <Text style={styles.workoutText}>You Created Exercise: {exerciseName}</Text>			
			
            <Text style={styles.workoutText}>Description: {description}</Text>
			
			<Text style={styles.workoutText}>Exercise Type: {exercise_type}</Text>
			
			<Text style={styles.workoutText}>Measurement Type: {measurement_type}</Text>
			
			<Text style={styles.workoutText}>Target Muscle Group: {target_muscle_group}</Text>
			
			<Text style={styles.workoutText}>Difficulty Level Type: {difficulty_level}</Text>  
             
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
});