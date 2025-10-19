// Temporary student data
export const TEMP_STUDENTS = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@college.edu",
    class: "FE",
    division: "A",
    department: "Computer Science",
    rollNo: "CS2024001"
  },
  {
    id: 2,
    name: "Diya Patel",
    email: "diya.patel@college.edu",
    class: "SE",
    division: "B",
    department: "Computer Science",
    rollNo: "CS2023045"
  },
  {
    id: 3,
    name: "Arjun Desai",
    email: "arjun.desai@college.edu",
    class: "TE",
    division: "A",
    department: "Information Technology",
    rollNo: "IT2022032"
  },
  {
    id: 4,
    name: "Ananya Singh",
    email: "ananya.singh@college.edu",
    class: "BE",
    division: "C",
    department: "Electronics",
    rollNo: "EC2021018"
  },
  {
    id: 5,
    name: "Rohan Mehta",
    email: "rohan.mehta@college.edu",
    class: "FE",
    division: "B",
    department: "Mechanical",
    rollNo: "ME2024089"
  }
];

// Temporary faculty data
export const TEMP_FACULTY = [
  {
    id: 101,
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@college.edu",
    department: "Computer Science",
    designation: "Professor",
    collegeId: "FAC001"
  },
  {
    id: 102,
    name: "Prof. Priya Sharma",
    email: "priya.sharma@college.edu",
    department: "Information Technology",
    designation: "Associate Professor",
    collegeId: "FAC012"
  },
  {
    id: 103,
    name: "Dr. Amit Verma",
    email: "amit.verma@college.edu",
    department: "Electronics",
    designation: "HOD",
    collegeId: "FAC023"
  },
  {
    id: 104,
    name: "Prof. Sneha Iyer",
    email: "sneha.iyer@college.edu",
    department: "Mechanical",
    designation: "Assistant Professor",
    collegeId: "FAC034"
  }
];

// Temporary email history
export const TEMP_EMAIL_HISTORY = [
  {
    id: 1,
    subject: "Welcome to Tech Nova 2024",
    description: "We are excited to have you join us for this year's technical festival. Get ready for amazing workshops, competitions, and networking opportunities!",
    recipients: [
      { name: "Aarav Sharma", email: "aarav.sharma@college.edu" },
      { name: "Diya Patel", email: "diya.patel@college.edu" }
    ],
    status: "sent",
    sentAt: "2025-01-15 10:30:00",
    createdAt: "2025-01-15 10:25:00",
    attachment: null
  },
  {
    id: 2,
    subject: "Workshop Schedule - Day 1",
    description: "Please find attached the detailed schedule for Day 1 workshops. Make sure to register for your preferred sessions.",
    recipients: [
      { name: "Arjun Desai", email: "arjun.desai@college.edu" },
      { name: "Ananya Singh", email: "ananya.singh@college.edu" },
      { name: "Rohan Mehta", email: "rohan.mehta@college.edu" }
    ],
    status: "sent",
    sentAt: "2025-01-16 14:20:00",
    createdAt: "2025-01-16 14:15:00",
    attachment: "workshop_schedule_day1.pdf"
  },
  {
    id: 3,
    subject: "Competition Results Announcement",
    description: "Congratulations to all participants! The results for today's coding competition are now available on the portal.",
    recipients: [
      { name: "Dr. Rajesh Kumar", email: "rajesh.kumar@college.edu" },
      { name: "Prof. Priya Sharma", email: "priya.sharma@college.edu" }
    ],
    status: "sent",
    sentAt: "2025-01-17 18:00:00",
    createdAt: "2025-01-17 17:55:00",
    attachment: null
  },
  {
    id: 4,
    subject: "Reminder: Registration Deadline",
    description: "This is a reminder that the registration deadline for tomorrow's hackathon is tonight at 11:59 PM. Don't miss out!",
    recipients: [
      { name: "Aarav Sharma", email: "aarav.sharma@college.edu" },
      { name: "Diya Patel", email: "diya.patel@college.edu" },
      { name: "Arjun Desai", email: "arjun.desai@college.edu" }
    ],
    status: "partial",
    sentAt: "2025-01-18 20:30:00",
    createdAt: "2025-01-18 20:25:00",
    attachment: null
  },
  {
    id: 5,
    subject: "Certificate Distribution Notice",
    description: "Certificates for all event participants will be distributed on the last day. Please collect them from the registration desk.",
    recipients: [
      { name: "Ananya Singh", email: "ananya.singh@college.edu" }
    ],
    status: "scheduled",
    scheduledAt: "2025-01-20 09:00:00",
    createdAt: "2025-01-19 15:00:00",
    attachment: null
  }
];

// Types for TypeScript
export interface Student {
  id: number;
  name: string;
  email: string;
  class: string;
  division: string;
  department: string;
  rollNo: string;
}

export interface Faculty {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  collegeId: string;
}

export interface Recipient {
  name: string;
  email: string;
}

export interface EmailHistoryEntry {
  id: number;
  subject: string;
  description: string;
  recipients: Recipient[];
  status: 'sent' | 'failed' | 'partial' | 'scheduled';
  sentAt?: string;
  scheduledAt?: string;
  createdAt: string;
  attachment?: string | null;
}