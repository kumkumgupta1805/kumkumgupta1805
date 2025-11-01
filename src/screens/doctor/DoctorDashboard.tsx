/**
 * Doctor Dashboard Screen
 */
import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { getDoctorPatients } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components/native';

interface Patient {
  id: string;
  name: string;
  email: string;
  lastUpdated: Date;
  status: 'normal' | 'warning' | 'critical';
}

const Screen = styled.View`
  flex: 1;
  background-color: #F9FAFB;
`;

const Body = styled.View`
  padding: 24px 16px 16px 16px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #4B5563;
`;

const Card = styled.TouchableOpacity`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  elevation: 1;
`;

const Dot = styled.View<{ $bg: string }>`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin-right: 16px;
  background-color: ${(p) => p.$bg};
`;

const Name = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const Email = styled.Text`
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 4px;
`;

const Badge = styled.Text<{ $bg: string; $fg: string }>`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: ${(p) => p.$bg};
  color: ${(p) => p.$fg};
`;

const Muted = styled.Text`
  font-size: 12px;
  color: #6B7280;
`;

const Flex = styled.View`
  flex: 1;
`;

export const DoctorDashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userData } = useAuth();

  const loadPatients = async () => {
    try {
      if (!userData?.uid) return;
      
      const patientList = await getDoctorPatients(userData.uid);
      setPatients(patientList);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPatients();
    
    // Refresh every 60 seconds
    const interval = setInterval(loadPatients, 60000);
    return () => clearInterval(interval);
  }, [userData?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPatients();
  };

  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading && patients.length === 0) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Subtitle>Loading patients...</Subtitle>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Body>
          <Title>My Patients</Title>
          <Subtitle>
            {patients.length} patient{patients.length !== 1 ? 's' : ''} assigned
          </Subtitle>

          {patients.length === 0 ? (
            <Card activeOpacity={1}>
              <Subtitle>No patients assigned yet</Subtitle>
            </Card>
          ) : (
            patients.map((patient) => {
              const status = patient.status;
              const dot = status === 'normal' ? '#10B981' : status === 'warning' ? '#F59E0B' : '#EF4444';
              const badgeBg = status === 'normal' ? '#D1FAE5' : status === 'warning' ? '#FEF3C7' : '#FEE2E2';
              const badgeFg = status === 'normal' ? '#065F46' : status === 'warning' ? '#92400E' : '#991B1B';
              return (
                <Card
                  key={patient.id}
                  onPress={() => navigation.navigate('PatientDetails', { patientId: patient.id, patientName: patient.name })}
                >
                  <Dot $bg={dot} />
                  <Flex>
                    <Name>{patient.name}</Name>
                    <Email>{patient.email}</Email>
                    <Muted>Updated {formatTimeAgo(patient.lastUpdated)}</Muted>
                  </Flex>
                  <Badge $bg={badgeBg} $fg={badgeFg}>{patient.status.toUpperCase()}</Badge>
                </Card>
              );
            })
          )}
        </Body>
      </ScrollView>
    </Screen>
  );
};

