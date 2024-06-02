import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import axios from 'axios';
import CircularProgress from 'react-native-circular-progress-indicator';

const ResultScreen = ({ route, navigation }) => {
  const { calorieNeeds, dietType } = route.params;
  const [foods, setFoods] = useState([]);
  const [categorizedFoods, setCategorizedFoods] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [remainingCalories, setRemainingCalories] = useState(calorieNeeds);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Fetch data from the API using Axios
    axios
      .get('https://foodapi-gm0a.onrender.com/api/v1/foods', {
        params: {
          food_type: `${dietType}`,
          calorie_from: calorieNeeds / 5,
          calorie_to: calorieNeeds,
        },
      })
      .then((response) => {
        setFoods(response.data.rows);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const progress = calculateProgress();
    if (progress >=75 && !isComplete) {
      setIsComplete(true);
      Alert.alert("Your daily calorie intake is complete!");
    }
  }, [remainingCalories]);

  const addToCategory = (item, category) => {
    const currentDateTime = new Date().toLocaleString();
    const updatedFoods = {
      ...categorizedFoods,
      [category]: [
        ...categorizedFoods[category],
        { ...item, imageUrl: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}`, dateTime: currentDateTime },
      ],
    };
    setCategorizedFoods(updatedFoods);
    setRemainingCalories(remainingCalories - item.calorie);
    navigation.navigate('List', { categorizedFoods: updatedFoods, initialCategory: category });
  };

  const calculateProgress = () => {
    return ((calorieNeeds - remainingCalories) / calorieNeeds) * 100;
  };

  const getProgressColor = (progress) => {
    if (progress === 0) {
      return 'red';
    } else if (progress >= 75) {
      return '#53FC26';
    }
    return '#C70039'; // Default color for values between 1% and 74%
  };

  const renderItem = ({ item }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodName}>{item.name}</Text>
      <Text>Calories: {item.calorie}</Text>
      <Text>Fat: {item.fat}g</Text>
      <Text>Protein: {item.protien_per_gram}g</Text>
      <Text>Carbohydrates: {item.carbohydrate}g</Text>
      <Text>Sugar: {item.sugar}g</Text>
      <Text>Fibre: {item.fibre}g</Text>
      <View style={styles.buttonContainer}>
        <Button title="Breakfast" onPress={() => addToCategory(item, 'breakfast')} />
        <Button title="Lunch" onPress={() => addToCategory(item, 'lunch')} />
        <Button title="Dinner" onPress={() => addToCategory(item, 'dinner')} />
      </View>
    </View>
  );

  const progress = calculateProgress();

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>Calorie Needs: {calorieNeeds}</Text>
      <CircularProgress
        value={isComplete ? 100 : progress}
        inActiveStrokeColor={'#2ecc71'}
        inActiveStrokeOpacity={0.2}
        progressValueColor={'black'}
        valueSuffix={'%'}
        radius={40}
        duration={500}
        activeStrokeWidth={15}
        activeStrokeColor={getProgressColor(progress)}
        inActiveStrokeWidth={15}
        progressColor={getProgressColor(progress)}
      />
      <Text style={styles.resultText}>Remaining Calories: {remainingCalories}</Text>
      <FlatList
        data={foods}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
  },
  list: {
    width: '100%',
  },
  foodItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ResultScreen;
