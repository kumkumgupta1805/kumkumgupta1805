/**
 * Signup Screen
 */
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { UserRole } from '../../utils/constants';
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

const Row = styled.View`
  flex-direction: row;
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

const Gap = styled.View`
  height: 16px;
`;

const LinkText = styled.Text`
  color: #3B82F6;
  font-weight: 600;
`;

export const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(email.trim(), password, role);
      // Navigation will happen automatically via RootNavigator based on auth state
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Container>
          <TitleWrap>
            <Title>Create Account</Title>
            <Subtitle>Join Swasthya Sathi to monitor your health</Subtitle>
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
          />

          <Gap />
          <Subtitle>Account Type</Subtitle>
          <Gap />
          <Row>
            <Button
              title="Patient"
              onPress={() => setRole('patient')}
              variant={role === 'patient' ? 'primary' : 'secondary'}
              fullWidth
            />
            <Gap style={{ width: 8, height: 0 }} />
            <Button
              title="Doctor"
              onPress={() => setRole('doctor')}
              variant={role === 'doctor' ? 'primary' : 'secondary'}
              fullWidth
            />
          </Row>

          <Gap />
          <Button title="Sign Up" onPress={handleSignup} loading={loading} fullWidth />

          <FooterRow>
            <FooterText>Already have an account? </FooterText>
            <LinkText onPress={() => navigation.navigate('Login')}>Sign In</LinkText>
          </FooterRow>
        </Container>
      </ScrollView>
    </Screen>
  );
};

