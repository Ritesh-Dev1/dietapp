import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Home from './Home';
import ResultScreen from './ResultScreen';
import List from './List';
import Workout from './workout';  // Ensure correct import for the workout component

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const DietStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    <Stack.Screen name="Foods" component={ResultScreen} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Diet') {
              iconName = 'food-bank';
            } else if (route.name === 'List') {
              iconName = 'format-list-bulleted';
            } else if (route.name === 'Workout') {
              iconName = 'fitness-center';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Diet" component={DietStack} />
        <Tab.Screen name="List" component={List} />
        <Tab.Screen name="Workout" component={Workout} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
