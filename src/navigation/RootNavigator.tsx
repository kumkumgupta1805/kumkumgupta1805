/**
 * Root Navigator - Handles role-based routing
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { PatientNavigator } from './PatientNavigator';
import { DoctorNavigator } from './DoctorNavigator';
import { constants } from '../utils/constants';

const LoadingWrap = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const LoadingText = styled.Text`
  color: #4B5563;
  margin-top: 16px;
`;

export const RootNavigator: React.FC = () => {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <LoadingWrap>
        <ActivityIndicator size="large" color="#2196F3" />
        <LoadingText>Loading...</LoadingText>
      </LoadingWrap>
    );
  }

  return (
    <NavigationContainer>
      {!user || !userData ? (
        <AuthNavigator />
      ) : userData.role === constants.roles.PATIENT ? (
        <PatientNavigator />
      ) : userData.role === constants.roles.DOCTOR ? (
        <DoctorNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

