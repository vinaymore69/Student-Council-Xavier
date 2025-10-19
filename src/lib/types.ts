// src/lib/types.ts

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  classId: string;
  className: string;
  rollNo: string;
  role: 'student' | 'admin';
  createdAt: any;
  updatedAt: any;
}

export interface Placement {
  place: number;
  participantUserId: string;
  participantName: string;
}

export interface Result {
  id?: string;
  resultId: string;
  competitionId: string;
  submittedBy: string;
  createdAt: any;
  isFinal: boolean;
  placements: Placement[];
  tallyApplied: boolean;
  appliedSnapshot: any;
  notes: string;
}

export interface Competition {
  id?: string;
  competitionId: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  dateTime: any;
  durationMinutes: number;
  venue: string;
  rules: string[];
  codeOfConduct: string;
  prizeDetails: string;
  socials: {
    instagram?: string;
    facebook?: string;
  };
  contacts: Array<{ name: string; phone: string }>;
  bannerUrl: string;
  galleryUrls: string[];
  entryFee: number;
  maxParticipants: number;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface EventType {
  id?: string;
  typeId: string;
  name: string;
  typeCategory: string;
  description: string;
  slug: string;
  currentEditionId: string;
  createdAt: any;
}

export interface FileMetadata {
  id?: string;
  fileName: string;
  fileType: 'image' | 'document' | 'video';
  fileUrl: string;
  filePath: string;
  eventType: string;
  editionId: string;
  competitionId: string;
  tags: string[];
  description: string;
  uploadedAt: any;
  uploadedBy: string;
}

export interface Tally {
  id?: string;
  departmentId?: string;
  departmentName?: string;
  classId?: string;
  className?: string;
  gold: number;
  silver: number;
  bronze: number;
  points: number;
}