/**
 * Patient Navigator (Stack)
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PatientDashboard } from '../screens/patient/PatientDashboard';
import { WeeklyReport } from '../screens/patient/WeeklyReport';

const Stack = createStackNavigator();

export const PatientNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#212121',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="PatientDashboard"
        component={PatientDashboard}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="WeeklyReport"
        component={WeeklyReport}
        options={{ title: 'Weekly Report' }}
      />
    </Stack.Navigator>
  );
};

