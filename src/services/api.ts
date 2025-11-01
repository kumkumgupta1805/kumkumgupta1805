/**
 * API Service - Placeholder for AWS API calls
 * Currently returns mock data simulating AWS responses
 */

export interface Vitals {
  heartRate: number; // BPM
  spo2: number; // %
  timestamp: Date;
}

export interface PatientVitals {
  patientId: string;
  vitals: Vitals[];
}

export interface AlertLog {
  id: string;
  patientId: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

/**
 * Get latest vitals for a patient
 */
export const getLatestVitals = async (patientId: string): Promise<Vitals> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data - replace with actual AWS API call
  return {
    heartRate: Math.floor(Math.random() * 40) + 65, // 65-105 BPM
    spo2: Math.floor(Math.random() * 10) + 90, // 90-100%
    timestamp: new Date(),
  };
};

/**
 * Get weekly vitals data for a patient
 */
export const getWeeklyVitals = async (patientId: string): Promise<Vitals[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock data for last 7 days
  const days = 7;
  const vitals: Vitals[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    vitals.push({
      heartRate: Math.floor(Math.random() * 35) + 70, // 70-105 BPM
      spo2: Math.floor(Math.random() * 8) + 92, // 92-100%
      timestamp: date,
    });
  }
  
  return vitals;
};

/**
 * Get alert logs for a patient
 */
export const getAlertLogs = async (patientId: string): Promise<AlertLog[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock alert logs
  return [
    {
      id: '1',
      patientId,
      type: 'info',
      message: 'Regular checkup completed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      patientId,
      type: 'warning',
      message: 'Heart rate slightly elevated',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: '3',
      patientId,
      type: 'info',
      message: 'Vitals recorded',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];
};

/**
 * Deactivate buzzer for a patient
 */
export const deactivateBuzzer = async (patientId: string): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock response - replace with actual AWS API call
  console.log(`[API] Deactivating buzzer for patient: ${patientId}`);
  
  return {
    success: true,
    message: 'Buzzer deactivated successfully',
  };
};

/**
 * Get list of patients assigned to a doctor
 */
export const getDoctorPatients = async (doctorId: string): Promise<Array<{
  id: string;
  name: string;
  email: string;
  lastUpdated: Date;
  status: 'normal' | 'warning' | 'critical';
}>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock patient list
  return [
    {
      id: 'patient1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      status: 'normal' as const,
    },
    {
      id: 'patient2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      lastUpdated: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: 'warning' as const,
    },
    {
      id: 'patient3',
      name: 'Amit Patel',
      email: 'amit@example.com',
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'critical' as const,
    },
    {
      id: 'patient4',
      name: 'Sneha Reddy',
      email: 'sneha@example.com',
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'normal' as const,
    },
  ];
};

