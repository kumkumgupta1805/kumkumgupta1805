/**
 * Status Card Component for displaying vitals with color-coded status (styled-components)
 */
import React from 'react';
import styled from 'styled-components/native';
import { constants } from '../utils/constants';

interface StatusCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  subtitle?: string;
}

const colorsByStatus = {
  normal: { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46', value: '#059669' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', value: '#D97706' },
  critical: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', value: '#DC2626' },
};

const Card = styled.View<{ $status: keyof typeof colorsByStatus }>`
  background-color: ${(p) => colorsByStatus[p.$status].bg};
  border: 2px solid ${(p) => colorsByStatus[p.$status].border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
`;

const Title = styled.Text<{ $status: keyof typeof colorsByStatus }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => colorsByStatus[p.$status].text};
  margin-bottom: 4px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 4px;
`;

const Value = styled.Text<{ $status: keyof typeof colorsByStatus }>`
  font-size: 28px;
  font-weight: 700;
  color: ${(p) => colorsByStatus[p.$status].value};
`;

const Unit = styled.Text<{ $status: keyof typeof colorsByStatus }>`
  font-size: 18px;
  margin-left: 8px;
  color: ${(p) => colorsByStatus[p.$status].text};
`;

const Subtitle = styled.Text<{ $status: keyof typeof colorsByStatus }>`
  font-size: 12px;
  color: ${(p) => colorsByStatus[p.$status].text};
  opacity: 0.75;
`;

export const StatusCard: React.FC<StatusCardProps> = ({ title, value, unit, status, subtitle }) => {
  return (
    <Card $status={status}>
      <Title $status={status}>{title}</Title>
      <Row>
        <Value $status={status}>{value}</Value>
        <Unit $status={status}>{unit}</Unit>
      </Row>
      {subtitle ? <Subtitle $status={status}>{subtitle}</Subtitle> : null}
    </Card>
  );
};

/**
 * Get status based on vitals values
 */
export const getVitalStatus = (
  heartRate: number,
  spo2: number
): 'normal' | 'warning' | 'critical' => {
  const { HEART_RATE, SPO2 } = constants.vitals;

  if (
    heartRate < HEART_RATE.WARNING_MIN ||
    heartRate > HEART_RATE.WARNING_MAX ||
    spo2 < SPO2.WARNING_MIN
  ) {
    return 'critical';
  }

  if (
    heartRate < HEART_RATE.NORMAL_MIN ||
    heartRate > HEART_RATE.NORMAL_MAX ||
    spo2 < SPO2.NORMAL_MIN
  ) {
    return 'warning';
  }

  return 'normal';
};

