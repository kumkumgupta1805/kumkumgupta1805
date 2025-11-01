/**
 * Login Screen
 */
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import styled from 'styled-components/native';

const Screen = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: #ffffff;
`;

const Container = styled.View`
  flex-grow: 1;
  justify-content: center;
  padding: 48px 24px;
`;

const TitleWrap = styled.View`
  margin-bottom: 32px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #4B5563;
`;

const FooterRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const FooterText = styled.Text`
  color: #4B5563;
`;

const LinkText = styled.Text`
  color: #3B82F6;
  font-weight: 600;
`;

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      // Navigation will happen automatically via RootNavigator based on auth state
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Container>
          <TitleWrap>
            <Title>Welcome Back</Title>
            <Subtitle>Sign in to continue to Swasthya Sathi</Subtitle>
          </TitleWrap>

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
          />

          <Button title="Sign In" onPress={handleLogin} loading={loading} fullWidth />

          <FooterRow>
            <FooterText>Don't have an account? </FooterText>
            <LinkText onPress={() => navigation.navigate('Signup')}>Sign Up</LinkText>
          </FooterRow>
        </Container>
      </ScrollView>
    </Screen>
  );
};

