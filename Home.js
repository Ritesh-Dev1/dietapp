import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const navigation = useNavigation();
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [activity, setActivity] = useState(null);
  const [dietType, setDietType] = useState(null);
  const [openActivity, setOpenActivity] = useState(false);
  const [openDietType, setOpenDietType] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAge = await AsyncStorage.getItem('age');
        const storedHeight = await AsyncStorage.getItem('height');
        const storedWeight = await AsyncStorage.getItem('weight');

        if (storedAge) setAge(storedAge);
        if (storedHeight) setHeight(storedHeight);
        if (storedWeight) setWeight(storedWeight);
      } catch (error) {
        console.error('Failed to load data from local storage', error);
      }
    };

    loadData();
  }, []);

  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem('age', age);
      await AsyncStorage.setItem('height', height);
      await AsyncStorage.setItem('weight', weight);
    } catch (error) {
      console.error('Failed to save data to local storage', error);
    }
  };

  const calculateBMR = () => {
    if (!age || !height || !weight || !gender || !activity) {
      alert('Please fill all the fields');
      return null;
    }

    const bmr = gender.toLowerCase() === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const calorieNeeds = Math.round(bmr * parseFloat(activity));
    return calorieNeeds;
  };

  const handleCreate = () => {
    const calorieNeeds = calculateBMR();
    if (calorieNeeds !== null) {
      saveUserData();
      navigation.navigate('Foods', { calorieNeeds, dietType });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Own Diet</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter height (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Enter weight (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter gender"
          value={gender}
          onChangeText={setGender}
        />
      </View>
      <DropDownPicker
        open={openActivity}
        value={activity}
        items={[
          { label: 'Sedentary (little or no exercise)', value: '1.2' },
          { label: 'Lightly active (light exercise/sports 1-3 days/week)', value: '1.375' },
          { label: 'Moderately active (moderate exercise/sports 3-5 days/week)', value: '1.55' },
          { label: 'Very active (hard exercise/sports 6-7 days a week)', value: '1.725' },
          { label: 'Super active (very hard exercise/sports & a physical job)', value: '1.9' },
        ]}
        setOpen={setOpenActivity}
        setValue={setActivity}
        placeholder="Select Activity Level"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownList}
        containerStyle={[styles.fullWidthDropdownContainer, { zIndex: 2000 }]}
        direction="AUTO"
      />
      <DropDownPicker
        open={openDietType}
        value={dietType}
        items={[
          { label: 'Vegetarian', value: 'vegetarian' },
          { label: 'Non-Vegetarian', value: 'non-vegetarian' },
        ]}
        setOpen={setOpenDietType}
        setValue={setDietType}
        placeholder="Select Diet Type"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownList}
        containerStyle={[styles.fullWidthDropdownContainer, { zIndex: 1000, marginTop: 10 }]}
        direction="AUTO"
      />
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50',
  },
  input: {
    width: '48%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ecf0f1',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    height: 40,
    width: '48%',
  },
  fullWidthDropdownContainer: {
    height: 40,
    marginBottom: 10,
    width: '100%',
  },
  dropdown: {
    height: 40,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  dropdownList: {
    borderColor: '#3498db',
  },
});

export default Home;
