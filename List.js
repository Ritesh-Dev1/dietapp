import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const List = ({ route }) => {
  const [mealCategory, setMealCategory] = useState('breakfast');
  const [foodList, setFoodList] = useState('');
  const [filteredFoodList, setFilteredFoodList] = useState([]);

  useEffect(() => {
    const loadFoodList = async () => {
      try {
        const storedFoodList = await AsyncStorage.getItem('foodList');
        if (storedFoodList) {
          const parsedFoodList = JSON.parse(storedFoodList);
          setFoodList(parsedFoodList);
          setFilteredFoodList(parsedFoodList[mealCategory] || []);
        }
      } catch (error) {
        console.error('Failed to load food list from local storage', error);
      }
    };

    loadFoodList();
  }, []);

  useEffect(() => {
    if (route.params && route.params.categorizedFoods) {
      const { categorizedFoods, initialCategory } = route.params;
      setFoodList(categorizedFoods);
      const initialCat = initialCategory || 'breakfast';
      setFilteredFoodList(categorizedFoods[initialCat] || []);
      setMealCategory(initialCat);
      saveFoodList(categorizedFoods);
    }
  }, [route.params]);

  const saveFoodList = async (foodList) => {
    try {
      await AsyncStorage.setItem('foodList', JSON.stringify(foodList));
    } catch (error) {
      console.error('Failed to save food list to local storage', error);
    }
  };
  const deleteAllItems = async () => {
   
    setFoodList({});
    setFilteredFoodList([]);
  
    try {
      await AsyncStorage.removeItem('foodList');
    } catch (error) {
      console.error('Failed to remove food list from local storage', error);
    }
  };
  
  const handleMealCategoryClick = (category) => {
    setMealCategory(category);
    setFilteredFoodList(foodList[category] || []);
  };

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity>
      <View style={styles.foodItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
        <View>
          <Text
            onPress={() => Linking.openURL(`https://www.youtube.com/results?search_query=${item.name}`)}
            style={styles.foodLabel}
          >
            {item.name}
          </Text>
          <Text style={styles.mealCategory}>Meal Category: {mealCategory}</Text>
          <Text style={styles.dateTime}>Added: {item.dateTime}</Text>
          
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => deleteAllItems()}>
          <MaterialIcons style={{marginLeft:5}} name="delete" size={30} color="black" />
      </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, mealCategory === 'breakfast' && styles.selectedButton]}
          onPress={() => handleMealCategoryClick('breakfast')}
        >
          <Text style={[styles.buttonText, mealCategory === 'breakfast' && styles.selectedButtonText]}>Breakfast</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, mealCategory === 'lunch' && styles.selectedButton]}
          onPress={() => handleMealCategoryClick('lunch')}
        >
          <Text style={[styles.buttonText, mealCategory === 'lunch' && styles.selectedButtonText]}>Lunch</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, mealCategory === 'dinner' && styles.selectedButton]}
          onPress={() => handleMealCategoryClick('dinner')}
        >
          <Text style={[styles.buttonText, mealCategory === 'dinner' && styles.selectedButtonText]}>Dinner</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.category}>Meal Category: {mealCategory}</Text>
      {filteredFoodList.length > 0 ? (
        <FlatList
          data={filteredFoodList}
          renderItem={renderFoodItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text>No items available for this category.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  selectedButton: {
    backgroundColor: '#2980b9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedButtonText: {
    fontWeight: 'bold',
  },
  category: {
    fontSize: 18,
    marginBottom: 10,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  foodLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealCategory: {
    fontSize: 14,
    color: 'gray',
  },
});

export default List;
