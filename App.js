import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens (we'll create these next)
import HomeScreen from './app/screens/HomeScreen';
import CalendarScreen from './app/screens/CalendarScreen';
import TasksScreen from './app/screens/TasksScreen';
import PomodoroScreen from './app/screens/PomodoroScreen';
import SettingsScreen from './app/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Ana Sayfa') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Takvim') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Görevler') {
                iconName = focused ? 'list' : 'list-outline';
              } else if (route.name === 'Pomodoro') {
                iconName = focused ? 'timer' : 'timer-outline';
              } else if (route.name === 'Ayarlar') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4285F4',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
          <Tab.Screen name="Takvim" component={CalendarScreen} />
          <Tab.Screen name="Görevler" component={TasksScreen} />
          <Tab.Screen name="Pomodoro" component={PomodoroScreen} />
          <Tab.Screen name="Ayarlar" component={SettingsScreen} />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});