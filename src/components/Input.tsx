/**
 * Reusable Input Component (styled-components)
 */
import React from 'react';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const Container = styled.View`
  margin-bottom: 16px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const StyledTextInput = styled.TextInput<{ $hasError?: boolean }>`
  border-width: 1px;
  border-color: ${(p) => (p.$hasError ? '#EF4444' : '#D1D5DB')};
  border-radius: 16px;
  padding: 12px 16px;
  font-size: 16px;
  background-color: #ffffff;
`;

const ErrorText = styled.Text`
  color: #EF4444;
  font-size: 14px;
  margin-top: 4px;
`;

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <Container>
      {label ? <Label>{label}</Label> : null}
      <StyledTextInput
        $hasError={!!error}
        placeholderTextColor="#9E9E9E"
        {...props}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Container>
  );
};

