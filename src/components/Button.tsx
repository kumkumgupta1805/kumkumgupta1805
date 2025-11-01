/**
 * Reusable Button Component (styled-components)
 */
import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const colorsByVariant = {
  primary: { bg: '#3B82F6', text: '#FFFFFF' },
  secondary: { bg: '#E5E7EB', text: '#111827' },
  danger: { bg: '#EF4444', text: '#FFFFFF' },
};

const ButtonWrapper = styled.TouchableOpacity<{
  $variant: keyof typeof colorsByVariant;
  $fullWidth?: boolean;
  $disabled?: boolean;
}>`
  border-radius: 16px;
  padding: 16px 24px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => colorsByVariant[p.$variant].bg};
  width: ${(p) => (p.$fullWidth ? '100%' : 'auto')};
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
  elevation: 2;
`;

const ButtonText = styled.Text<{ $variant: keyof typeof colorsByVariant }>`
  font-weight: 600;
  font-size: 16px;
  color: ${(p) => colorsByVariant[p.$variant].text};
`;

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const isDisabled = disabled || loading;
  return (
    <ButtonWrapper onPress={onPress} disabled={isDisabled} $variant={variant} $fullWidth={fullWidth} $disabled={isDisabled}>
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#111827' : '#FFFFFF'} />
      ) : (
        <ButtonText $variant={variant}>{title}</ButtonText>
      )}
    </ButtonWrapper>
  );
};

