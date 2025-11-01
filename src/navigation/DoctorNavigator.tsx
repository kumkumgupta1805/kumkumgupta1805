/**
 * Doctor Navigator (Stack)
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DoctorDashboard } from '../screens/doctor/DoctorDashboard';
import { PatientDetails } from '../screens/doctor/PatientDetails';

const Stack = createStackNavigator();

export const DoctorNavigator: React.FC = () => {
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
        name="DoctorDashboard"
        component={DoctorDashboard}
        options={{ title: 'My Patients' }}
      />
      <Stack.Screen
        name="PatientDetails"
        component={PatientDetails}
        options={({ route }) => ({ title: route.params?.patientName || 'Patient Details' })}
      />
    </Stack.Navigator>
  );
};

