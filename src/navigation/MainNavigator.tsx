import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '@screens/main/HomeScreen';
import MapScreen from '@screens/main/MapScreen';
import FavoritesScreen from '@screens/main/FavoritesScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import VenueDetailScreen from '@screens/venue/VenueDetailScreen';
import MenuScreen from '@screens/venue/MenuScreen';
import SettingsScreen from '@screens/profile/SettingsScreen';

import {colors} from '@constants/colors';

export type MainTabParamList = {
  HomeTab: undefined;
  MapTab: undefined;
  FavoritesTab: undefined;
  ProfileTab: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  VenueDetail: {venueId: string};
  Menu: {venueId: string};
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'HomeTab':
              iconName = 'home';
              break;
            case 'MapTab':
              iconName = 'map';
              break;
            case 'FavoritesTab':
              iconName = 'favorite';
              break;
            case 'ProfileTab':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: colors.border.light,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VenueDetail"
        component={VenueDetailScreen}
        options={{
          title: 'Venue Details',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          title: 'Menu',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;