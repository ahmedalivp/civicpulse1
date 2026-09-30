export const CONFIG = {
  // Locality info (defaults per AGENTS.md rule 3)
  localityName: process.env.LOCALITY || 'Riverside Ward',
  localePrimary: process.env.LOCALE_PRIMARY || 'en',
  emergencyNumber: process.env.EMERGENCY_NUMBER || '911',
  
  // Tunables from PRODUCT_REFERENCE.md
  escalation: {
    minAgeHours: 24,
    reminderDays: [7, 14, 30],
  },
  images: {
    maxEdgePx: 1600,
    compressionQuality: 0.8,
  }
};
