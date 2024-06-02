import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { TextInput } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Workout = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [muscleTarget, setMuscleTarget] = useState('chest');

  const fetchExercises = async (target) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://workoutapi-mtf3.onrender.com/api/v1/workout?Target_Muscle=${target}`);
      setExercises(response.data.rows);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises(muscleTarget);
  }, [muscleTarget]);

  const renderExerciseItem = ({ item }) => (
    <View style={styles.exerciseItem}>
      <View style={styles.textContainer}>
        <Text style={styles.exerciseName}>{item.Exercise}</Text>
        <Text style={styles.exerciseDetail}>Difficulty Level: {item.Difficulty_Level}</Text>
        <Text style={styles.exerciseDetail}>Target Muscle: {item.Target_Muscle}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(item.Link)}>
          <Text style={styles.exerciseLink}>Watch Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Text style={styles.title}>Workout Exercises</Text>
        <TextInput
          style={styles.inputSearch}
          placeholderTextColor="gray" 
          placeholder="Search by muscle..."
          onChangeText={ setMuscleTarget}
          value={muscleTarget}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
        ) : (
          <FlatList
            data={exercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseDetail: {
    fontSize: 14,
    color: 'gray',
  },
  exerciseLink: {
    fontSize: 14,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputSearch: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginBottom: 16,
  },
  placeholder: {
    color: 'gray',
    marginBottom: 8, // Adjust as needed
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 16,
  },
});

export default Workout;
