/**
 * Weekly Report Screen
 */
import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getWeeklyVitals } from '../../services/api';
import { Vitals } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { constants } from '../../utils/constants';
import styled from 'styled-components/native';

const screenWidth = Dimensions.get('window').width;

const Screen = styled.View`
  flex: 1;
  background-color: #F9FAFB;
`;

const Body = styled.View`
  padding: 24px 16px 16px 16px;
`;

const Section = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  elevation: 1;
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

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
`;

const Muted = styled.Text`
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 8px;
`;

export const WeeklyReport: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [vitals, setVitals] = useState<Vitals[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userData } = useAuth();

  const loadWeeklyVitals = async () => {
    try {
      if (!userData?.uid) return;
      
      const weeklyData = await getWeeklyVitals(userData.uid);
      setVitals(weeklyData);
    } catch (error) {
      console.error('Error loading weekly vitals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeeklyVitals();
  }, [userData?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    loadWeeklyVitals();
  };

  if (loading || vitals.length === 0) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Muted>Loading weekly report...</Muted>
      </Screen>
    );
  }

  // Prepare data for charts
  const labels = vitals.map((v, index) => {
    const date = new Date(v.timestamp);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const heartRateData = vitals.map(v => v.heartRate);
  const spo2Data = vitals.map(v => v.spo2);

  // Calculate averages
  const avgHeartRate = Math.round(
    heartRateData.reduce((sum, val) => sum + val, 0) / heartRateData.length
  );
  const avgSpo2 = Math.round(
    spo2Data.reduce((sum, val) => sum + val, 0) / spo2Data.length
  );

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <Screen>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Body>
          <Title>Weekly Report</Title>
          <Subtitle>Last 7 days overview</Subtitle>

          <Section>
            <SectionTitle>Heart Rate (BPM)</SectionTitle>
            <Muted>Average: {avgHeartRate} BPM</Muted>
            <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: heartRateData,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 48}
            height={constants.chart.HEIGHT}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
          />
          </Section>

          <Section>
            <SectionTitle>SpO₂ (Blood Oxygen) %</SectionTitle>
            <Muted>Average: {avgSpo2}%</Muted>
            <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: spo2Data,
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 48}
            height={constants.chart.HEIGHT}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            yAxisLabel=""
            yAxisSuffix="%"
            yAxisInterval={1}
          />
          </Section>
        </Body>
      </ScrollView>
    </Screen>
  );
};

