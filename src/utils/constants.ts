/**
 * Application-wide constants
 */
export const constants = {
  // AsyncStorage Keys
  storage: {
    AUTH_TOKEN: '@swasthya_sathi:auth_token',
    USER_DATA: '@swasthya_sathi:user_data',
  },
  
  // Vitals Thresholds
  vitals: {
    HEART_RATE: {
      NORMAL_MIN: 60,
      NORMAL_MAX: 100,
      WARNING_MIN: 50,
      WARNING_MAX: 110,
    },
    SPO2: {
      NORMAL_MIN: 95,
      NORMAL_MAX: 100,
      WARNING_MIN: 90,
      WARNING_MAX: 94,
    },
  },
  
  // User Roles
  roles: {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
  } as const,
  
  // Chart Configuration
  chart: {
    HEIGHT: 220,
    Y_AXIS_LABELS: 5,
    DECIMAL_PLACES: 0,
  },
} as const;

export type UserRole = typeof constants.roles[keyof typeof constants.roles];

