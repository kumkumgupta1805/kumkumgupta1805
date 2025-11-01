/**
 * Patient Dashboard Screen
 */
import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { StatusCard, getVitalStatus } from '../../components/StatusCard';
import { getLatestVitals } from '../../services/api';
import { Vitals } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components/native';

const Screen = styled.View`
  flex: 1;
  background-color: #F9FAFB;
`;

const Header = styled.View`
  margin-bottom: 24px;
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

const Body = styled.View`
  padding: 24px 16px 16px 16px;
`;

const PrimaryCTA = styled.TouchableOpacity`
  background-color: #3B82F6;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  elevation: 2;
`;

const PrimaryCTAText = styled.Text`
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;

export const PatientDashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [vitals, setVitals] = useState<Vitals | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userData } = useAuth();

  const loadVitals = async () => {
    try {
      if (!userData?.uid) return;
      
      const latestVitals = await getLatestVitals(userData.uid);
      setVitals(latestVitals);
    } catch (error) {
      console.error('Error loading vitals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVitals();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadVitals, 30000);
    return () => clearInterval(interval);
  }, [userData?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    loadVitals();
  };

  if (loading || !vitals) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Subtitle>Loading vitals...</Subtitle>
      </Screen>
    );
  }

  const status = getVitalStatus(vitals.heartRate, vitals.spo2);

  return (
    <Screen>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Body>
          <Header>
            <Title>Welcome Back</Title>
            <Subtitle>Your health vitals at a glance</Subtitle>
          </Header>

          <StatusCard
            title="Heart Rate"
            value={vitals.heartRate}
            unit="BPM"
            status={status}
            subtitle={`Last updated: ${new Date(vitals.timestamp).toLocaleTimeString()}`}
          />

          <StatusCard
            title="SpO₂ (Blood Oxygen)"
            value={vitals.spo2}
            unit="%"
            status={status}
            subtitle="Oxygen saturation level"
          />

          <PrimaryCTA onPress={() => navigation.navigate('WeeklyReport')}>
            <PrimaryCTAText>View Weekly Report</PrimaryCTAText>
          </PrimaryCTA>
        </Body>
      </ScrollView>
    </Screen>
  );
};

