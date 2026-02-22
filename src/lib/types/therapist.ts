import { Review } from './review';

export interface QualificationModel {
  name: string;
  file: string;
}

export interface PricingSnapshotModel {
  currency: string;
  baseFee: number;
}

export interface LocationModel {
  clinicName: string;
  buildingOrStreet: string;
  locality: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: number;
  longitude: number;
  geohash: string;
}

export interface ScheduleSlotModel {
  mode: string;
  time: string;
  durationMinutes: number;
}

export interface WeeklyScheduleModel {
  schedule: Record<string, ScheduleSlotModel[]>;
}

export interface SettingsModel {
  sessionDurationMinutes: number;
  bufferMinutes: number;
  bufferPerSessionType: boolean;
  minAdvanceBookingDays: number;
  maxAdvanceBookingDays: number;
  differentWindowForNew: boolean;
  minAdvanceForNewPatients: number;
  notifyOnNewBooking: boolean;
  notifyOnCancellation: boolean;
  notifyDayBefore: boolean;
  timezoneId: string;
  updatedAt: string;
}

export interface Therapist {
  id: string;
  userId: string;
  type: string;
  name: string;
  avatar: string;
  bio: string;
  gender: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  hcpcId: string;
  languagesSpoken: string[];
  consultationModes: string[];
  conditions: string[];
  symptomsTreated: string[];
  specializations: string[];
  qualifications: QualificationModel[];
  certifications: string[];
  testimonials: string[];
  reviews: Review[];
  highlights: string[];
  ratings: number;
  reviewsCount: number;
  totalRatingSum: number;
  experience: number;
  verified: boolean;
  patients: string;
  pricing: PricingSnapshotModel;
  location: LocationModel;
  workingHours: string;
  weeklyAvailability: string[];
  weeklySchedule: WeeklyScheduleModel;
  highestQualification: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: number;
  degreeCertificateUrls: string[];
  registrationNumber: string;
  licenseExpiryDate: string;
  registrationCertificateUrl: string;
  governmentIdUrl: string;
  insuranceCertificateUrl: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  agreedToScopeOfPractice: boolean;
  therapyMode: string;
  practiceType: string;
  individualSessionFee: number;
  groupSessionFee: number;
  offersSlidingScale: boolean;
  therapeuticModalities: string[];
  treatmentPhilosophy: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedTelemedicine: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  settings: SettingsModel;
  currentStep: number;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
