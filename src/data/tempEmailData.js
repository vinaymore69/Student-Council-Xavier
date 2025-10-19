// src/data/tempEmailData.js

// Temporary Students Data
export const TEMP_STUDENTS = [
  {
    id: 'S001',
    name: 'Vinay More',
    email: 'vinaymore0110@gmail.com',
    roll_no: 'CS2021001',
    department: 'Computer Science',
    year: 3
  },
  {
    id: 'S002',
    name: 'Rahul Sharma',
    email: 'atharvapanchal95@gmail.com',
    roll_no: 'CS2021002',
    department: 'Computer Science',
    year: 3
  },
  {
    id: 'S003',
    name: 'Priya Patel',
    email: 'parthbagwe6@gamail.com',
    roll_no: 'CS2021003',
    department: 'Computer Science',
    year: 3
  },
  {
    id: 'S004',
    name: 'Amit Kumar',
    email: 'amit.kumar@student.edu',
    roll_no: 'EC2021001',
    department: 'Electronics',
    year: 2
  },
  {
    id: 'S005',
    name: 'Sneha Desai',
    email: 'sneha.desai@student.edu',
    roll_no: 'EC2021002',
    department: 'Electronics',
    year: 2
  },
  {
    id: 'S006',
    name: 'Rohan Joshi',
    email: 'rohan.joshi@student.edu',
    roll_no: 'ME2021001',
    department: 'Mechanical',
    year: 4
  },
  {
    id: 'S007',
    name: 'Anjali Gupta',
    email: 'anjali.gupta@student.edu',
    roll_no: 'ME2021002',
    department: 'Mechanical',
    year: 4
  },
  {
    id: 'S008',
    name: 'Vikram Singh',
    email: 'vikram.singh@student.edu',
    roll_no: 'IT2021001',
    department: 'Information Technology',
    year: 2
  },
  {
    id: 'S009',
    name: 'Pooja Reddy',
    email: 'pooja.reddy@student.edu',
    roll_no: 'IT2021002',
    department: 'Information Technology',
    year: 2
  },
  {
    id: 'S010',
    name: 'Karan Mehta',
    email: 'karan.mehta@student.edu',
    roll_no: 'CS2020001',
    department: 'Computer Science',
    year: 4
  },
  {
    id: 'S011',
    name: 'Neha Kapoor',
    email: 'neha.kapoor@student.edu',
    roll_no: 'CS2022001',
    department: 'Computer Science',
    year: 2
  },
  {
    id: 'S012',
    name: 'Sanjay Yadav',
    email: 'sanjay.yadav@student.edu',
    roll_no: 'EC2022001',
    department: 'Electronics',
    year: 1
  },
  {
    id: 'S013',
    name: 'Divya Nair',
    email: 'divya.nair@student.edu',
    roll_no: 'ME2022001',
    department: 'Mechanical',
    year: 3
  },
  {
    id: 'S014',
    name: 'Arjun Verma',
    email: 'arjun.verma@student.edu',
    roll_no: 'IT2022001',
    department: 'Information Technology',
    year: 3
  },
  {
    id: 'S015',
    name: 'Kavita Pillai',
    email: 'kavita.pillai@student.edu',
    roll_no: 'CS2021004',
    department: 'Computer Science',
    year: 3
  }
];

// Temporary Faculty Data
export const TEMP_FACULTY = [
  {
    id: 'F001',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@faculty.edu',
    faculty_id: 'FAC001',
    department: 'Computer Science',
    designation: 'Professor & HOD'
  },
  {
    id: 'F002',
    name: 'Dr. Sunita Sharma',
    email: 'sunita.sharma@faculty.edu',
    faculty_id: 'FAC002',
    department: 'Computer Science',
    designation: 'Associate Professor'
  },
  {
    id: 'F003',
    name: 'Prof. Manish Patel',
    email: 'manish.patel@faculty.edu',
    faculty_id: 'FAC003',
    department: 'Computer Science',
    designation: 'Assistant Professor'
  },
  {
    id: 'F004',
    name: 'Dr. Anita Deshmukh',
    email: 'anita.deshmukh@faculty.edu',
    faculty_id: 'FAC004',
    department: 'Electronics',
    designation: 'Professor & HOD'
  },
  {
    id: 'F005',
    name: 'Prof. Suresh Reddy',
    email: 'suresh.reddy@faculty.edu',
    faculty_id: 'FAC005',
    department: 'Electronics',
    designation: 'Associate Professor'
  },
  {
    id: 'F006',
    name: 'Dr. Meera Iyer',
    email: 'meera.iyer@faculty.edu',
    faculty_id: 'FAC006',
    department: 'Mechanical',
    designation: 'Professor & HOD'
  },
  {
    id: 'F007',
    name: 'Prof. Anil Joshi',
    email: 'anil.joshi@faculty.edu',
    faculty_id: 'FAC007',
    department: 'Mechanical',
    designation: 'Assistant Professor'
  },
  {
    id: 'F008',
    name: 'Dr. Priya Menon',
    email: 'priya.menon@faculty.edu',
    faculty_id: 'FAC008',
    department: 'Information Technology',
    designation: 'Professor & HOD'
  },
  {
    id: 'F009',
    name: 'Prof. Deepak Gupta',
    email: 'deepak.gupta@faculty.edu',
    faculty_id: 'FAC009',
    department: 'Information Technology',
    designation: 'Associate Professor'
  },
  {
    id: 'F010',
    name: 'Dr. Kavita Singh',
    email: 'kavita.singh@faculty.edu',
    faculty_id: 'FAC010',
    department: 'Computer Science',
    designation: 'Assistant Professor'
  }
];

// Temporary Email History Data
export const TEMP_EMAIL_HISTORY = [
  {
    id: 1,
    subject: 'Important: Final Exam Schedule Released',
    description: 'Dear Students, The final examination schedule for the current semester has been released. Please check the notice board and college website for detailed information. Make sure to prepare accordingly.',
    attachment: 'exam_schedule.pdf',
    recipients: [
      { id: 'S001', name: 'Vinay More', email: 'vinaymore0110@gmail.com', type: 'students' },
      { id: 'S002', name: 'Rahul Sharma', email: 'rahul.sharma@student.edu', type: 'students' },
      { id: 'S003', name: 'Priya Patel', email: 'priya.patel@student.edu', type: 'students' }
    ],
    scheduledAt: null,
    sentAt: '2025-01-15 10:30:00',
    sentBy: 'vinaymore69',
    status: 'sent',
    createdAt: '2025-01-15 10:25:00'
  },
  {
    id: 2,
    subject: 'Faculty Meeting - Curriculum Update',
    description: 'Dear Faculty Members, A meeting has been scheduled to discuss the curriculum updates for the upcoming academic year. Your presence is mandatory. Please review the attached agenda before the meeting.',
    attachment: 'meeting_agenda.pdf',
    recipients: [
      { id: 'F001', name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@faculty.edu', type: 'faculty' },
      { id: 'F002', name: 'Dr. Sunita Sharma', email: 'sunita.sharma@faculty.edu', type: 'faculty' },
      { id: 'F004', name: 'Dr. Anita Deshmukh', email: 'anita.deshmukh@faculty.edu', type: 'faculty' }
    ],
    scheduledAt: '2025-01-25 14:00:00',
    sentAt: null,
    sentBy: 'vinaymore69',
    status: 'scheduled',
    createdAt: '2025-01-16 09:15:00'
  },
  {
    id: 3,
    subject: 'Workshop: AI and Machine Learning',
    description: 'We are organizing a 3-day workshop on Artificial Intelligence and Machine Learning. This is a great opportunity to enhance your skills. Limited seats available. Register now!',
    attachment: null,
    recipients: [
      { id: 'S001', name: 'Vinay More', email: 'vinaymore0110@gmail.com', type: 'students' },
      { id: 'S010', name: 'Karan Mehta', email: 'karan.mehta@student.edu', type: 'students' },
      { id: 'S015', name: 'Kavita Pillai', email: 'kavita.pillai@student.edu', type: 'students' }
    ],
    scheduledAt: null,
    sentAt: '2025-01-14 16:45:00',
    sentBy: 'vinaymore69',
    status: 'sent',
    createdAt: '2025-01-14 16:40:00'
  },
  {
    id: 4,
    subject: 'Reminder: Submit Project Reports',
    description: 'This is a reminder to all students to submit their project reports by the end of this week. Late submissions will not be accepted. Please ensure all documentation is complete.',
    attachment: 'project_guidelines.pdf',
    recipients: [
      { id: 'S006', name: 'Rohan Joshi', email: 'rohan.joshi@student.edu', type: 'students' },
      { id: 'S007', name: 'Anjali Gupta', email: 'anjali.gupta@student.edu', type: 'students' }
    ],
    scheduledAt: null,
    sentAt: '2025-01-13 11:20:00',
    sentBy: 'vinaymore69',
    status: 'sent',
    createdAt: '2025-01-13 11:15:00'
  },
  {
    id: 5,
    subject: 'Cultural Fest Registration Open',
    description: 'The annual cultural fest is here! Register your teams for various events including dance, music, drama, and art competitions. Exciting prizes to be won!',
    attachment: 'cultural_fest_brochure.pdf',
    recipients: [
      { id: 'S002', name: 'Rahul Sharma', email: 'rahul.sharma@student.edu', type: 'students' },
      { id: 'S003', name: 'Priya Patel', email: 'priya.patel@student.edu', type: 'students' },
      { id: 'S004', name: 'Amit Kumar', email: 'amit.kumar@student.edu', type: 'students' },
      { id: 'S005', name: 'Sneha Desai', email: 'sneha.desai@student.edu', type: 'students' }
    ],
    scheduledAt: null,
    sentAt: '2025-01-12 14:00:00',
    sentBy: 'vinaymore69',
    status: 'sent',
    createdAt: '2025-01-12 13:55:00'
  },
  {
    id: 6,
    subject: 'System Maintenance Notice',
    description: 'The college portal will undergo scheduled maintenance this weekend. Services will be unavailable from Saturday 10 PM to Sunday 6 AM. Plan accordingly.',
    attachment: null,
    recipients: [
      { id: 'S001', name: 'Vinay More', email: 'vinaymore0110@gmail.com', type: 'students' },
      { id: 'F001', name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@faculty.edu', type: 'faculty' }
    ],
    scheduledAt: '2025-01-20 18:00:00',
    sentAt: null,
    sentBy: 'vinaymore69',
    status: 'scheduled',
    createdAt: '2025-01-16 10:30:00'
  },
  {
    id: 7,
    subject: 'Test Email - Failed',
    description: 'This is a test email that failed to send due to network issues.',
    attachment: null,
    recipients: [
      { id: 'S011', name: 'Neha Kapoor', email: 'neha.kapoor@student.edu', type: 'students' }
    ],
    scheduledAt: null,
    sentAt: null,
    sentBy: 'vinaymore69',
    status: 'failed',
    createdAt: '2025-01-11 09:00:00'
  }
];