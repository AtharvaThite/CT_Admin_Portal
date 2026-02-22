export type ProfileType = 'self' | 'guardian';

export interface HealthHistoryModel {
  currentConditions: string[];
  pastConditions: string[];
  surgeries: string[];
  familyHistory: string[];
}

export interface MedicationModel {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
}

export interface AllergiesModel {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

export interface GuardianInfoModel {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface DependentInfoModel {
  name: string;
  age: number;
  relationship: string;
}

export interface UserProfile {
  userId: string;
  profileType: ProfileType;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: string;
  pronouns: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  healthHistory: HealthHistoryModel | null;
  medications: MedicationModel[];
  allergies: AllergiesModel[];
  uploadedDocuments: string[];
  documentPaths: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  alternateContactName: string;
  alternateContactPhone: string;
  alternateContactRelationship: string;
  guardianInfo: GuardianInfoModel | null;
  dependentInfo: DependentInfoModel | null;
  preferredTherapyType: string;
  sessionFormat: string;
  timePreference: string;
  acceptedTerms: boolean;
  notificationsEnabled: boolean;
  dataProcessingConsent: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  anonymousDataResearch: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
