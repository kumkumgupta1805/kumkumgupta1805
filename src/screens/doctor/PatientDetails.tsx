/**
 * Patient Details Screen (Doctor View)
 */
import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { StatusCard, getVitalStatus } from '../../components/StatusCard';
import { Button } from '../../components/Button';
import { getLatestVitals, getWeeklyVitals, getAlertLogs, deactivateBuzzer } from '../../services/api';
import { Vitals, AlertLog } from '../../services/api';
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

const Section = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  elevation: 1;
`;

const Muted = styled.Text`
  font-size: 12px;
  color: #6B7280;
`;

export const PatientDetails: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { patientId, patientName } = route.params;
  const [latestVitals, setLatestVitals] = useState<Vitals | null>(null);
  const [weeklyVitals, setWeeklyVitals] = useState<Vitals[]>([]);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [buzzerLoading, setBuzzerLoading] = useState(false);

  const loadData = async () => {
    try {
      const [vitals, weekly, logs] = await Promise.all([
        getLatestVitals(patientId),
        getWeeklyVitals(patientId),
        getAlertLogs(patientId),
      ]);

      setLatestVitals(vitals);
      setWeeklyVitals(weekly);
      setAlertLogs(logs);
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [patientId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleDeactivateBuzzer = async () => {
    Alert.alert(
      'Deactivate Buzzer',
      'Are you sure you want to deactivate the buzzer for this patient?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            setBuzzerLoading(true);
            try {
              const result = await deactivateBuzzer(patientId);
              Alert.alert('Success', result.message);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to deactivate buzzer');
            } finally {
              setBuzzerLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || !latestVitals) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Subtitle style={{ marginTop: 16 }}>Loading patient data...</Subtitle>
      </Screen>
    );
  }

  const status = getVitalStatus(latestVitals.heartRate, latestVitals.spo2);

  // Prepare chart data
  const labels = weeklyVitals.map((v) => {
    const date = new Date(v.timestamp);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const heartRateData = weeklyVitals.map((v) => v.heartRate);
  const spo2Data = weeklyVitals.map((v) => v.spo2);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
  };

  return (
    <Screen>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Body>
          <Title>{patientName}</Title>
          <Subtitle>Patient ID: {patientId}</Subtitle>

        {/* Current Vitals */}
        <StatusCard
          title="Heart Rate"
          value={latestVitals.heartRate}
          unit="BPM"
          status={status}
          subtitle={`Last updated: ${formatTime(latestVitals.timestamp)}`}
        />

        <StatusCard
          title="SpO₂ (Blood Oxygen)"
          value={latestVitals.spo2}
          unit="%"
          status={status}
          subtitle="Oxygen saturation level"
        />

        {/* Deactivate Buzzer Button */}
        <Button
          title="Deactivate Buzzer"
          onPress={handleDeactivateBuzzer}
          variant="danger"
          loading={buzzerLoading}
          fullWidth
          className="mb-6"
        />

        {/* Historical Trend */}
        {weeklyVitals.length > 0 && (
          <Section>
            <Subtitle style={{ fontWeight: '600', color: '#111827', marginBottom: 8 }}>
              Weekly Trend - Heart Rate
            </Subtitle>
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
            />
          </Section>
        )}

        <Section>
          <Subtitle style={{ fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Alert Logs
          </Subtitle>
          {alertLogs.length === 0 ? (
            <Subtitle style={{ textAlign: 'center', paddingVertical: 16 }}>No alerts recorded</Subtitle>
          ) : (
            alertLogs.map((log) => (
              <Section key={log.id} style={{ paddingVertical: 12, marginBottom: 0, backgroundColor: 'transparent', elevation: 0 }}>
                <styled.View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                  <styled.View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      marginRight: 12,
                      marginTop: 8,
                      backgroundColor:
                        log.type === 'critical' ? '#EF4444' : log.type === 'warning' ? '#F59E0B' : '#3B82F6',
                    }}
                  />
                  <styled.View style={{ flex: 1 }}>
                    <Subtitle style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                      {log.message}
                    </Subtitle>
                    <Muted>{formatTime(log.timestamp)}</Muted>
                  </styled.View>
                </styled.View>
              </Section>
            ))
          )}
        </Section>
        </Body>
      </ScrollView>
    </Screen>
  );
};

