# XIE Student Council Web Platform 🎓

<div align="center">

![XIE Logo](https://img.shields.io/badge/XIE-Student%20Council-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)

**A comprehensive web platform for managing fests, events, winners, and communication at Xavier Institute of Engineering**

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Documentation](#documentation) • [Support](#support)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Admin Guide](#admin-guide)
- [Backup System](#backup-system)
- [Email System](#email-system)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 Overview

The **XIE Student Council Web Platform** is a proprietary, full-featured web application designed exclusively for Xavier Institute of Engineering's student council to manage and showcase all college fests, events, winners, and communications in a centralized, efficient manner.

### Purpose

This platform serves as the single source of truth for:
- **Spandan** (Cultural Fest)
- **Transmission** (Technical Fest)
- **Sparx** (Sports Fest)

It automates medal tallying, maintains department standings, facilitates official communication, and preserves event memories through an integrated gallery system.

---

## ✨ Features

### 🏆 For Students & Visitors

#### Event Discovery
- Browse all events across Spandan, Transmission, and Sparx fests
- View detailed event information, rules, and schedules
- Search and filter events by fest, category, or date
- Real-time updates on ongoing events

#### Winners & Recognition
- View complete list of event winners
- Medal breakdown (Gold 🥇, Silver 🥈, Bronze 🥉)
- Winner profiles with photos and achievements
- Historical winner data from previous years

#### Rankings & Leaderboards
- **Class Medal Tally**: Automatic calculation of medals per class
- **Department Standings**: Aggregated class medals by department
- Interactive leaderboard with filtering options
- Visual charts and graphs for standings
- Year-wise comparison data

#### Gallery & Highlights
- High-quality event photos organized by fest and event
- Video highlights and winning moments
- Downloadable media for personal use
- Social sharing capabilities

#### Official Communications
- View official notices and drafts
- Access important announcements
- Download official documents
- Subscribe to email notifications

---

### 🔐 For Admins

#### Fest & Event Management
- Create, update, and delete fests
- Add multiple events under each fest
- Set event categories, dates, and venues
- Manage event status (upcoming, ongoing, completed)
- Bulk import events via CSV

#### Winner Management
- Add winners with medal types
- Upload winner photos
- Edit or remove winner entries
- Auto-calculation of medal tallies
- Manual medal adjustment if needed

#### Media Management
- Upload event photos (bulk upload supported)
- Organize photos by fest/event
- Auto-backup to Google Drive
- Image compression and optimization
- Delete or archive old media

#### Email System
- Compose official drafts and notices
- Rich text editor with formatting options
- Email preview before sending
- Manage recipient lists:
  - Council members
  - Faculty coordinators
  - Class Representatives (CRs)
  - Department heads
  - Custom groups
- Schedule emails for future delivery
- Track email delivery status
- Auto-archive sent emails to Google Drive

#### Backup & Records
- **Google Drive Integration**: Automatic backup of all images and documents
- **Google Sheets Integration**: Real-time sync of records
  - Event results sheet
  - Winner records sheet
  - Medal tally sheet
  - Email logs sheet
- Configure backup frequency
- Restore from backup

#### Analytics & Reports
- View platform usage statistics
- Download reports:
  - Winner lists (PDF/Excel)
  - Medal tallies by class/department
  - Event participation data
  - Email delivery reports
- Visual dashboards with charts
- Export data for external analysis

---

## 🛠 Tech Stack

### Frontend
```
├── React 18.2+ (with TypeScript)
├── Next.js 14+ (App Router)
├── TailwindCSS 3.4+ (Styling)
├── Shadcn/ui (Component Library)
├── Framer Motion (Animations)
├── React Query (Data Fetching)
├── Zustand (State Management)
└── React Hook Form (Form Handling)
```

### Backend
```
├── Node.js 18+ LTS
├── TypeScript 5.0+
├── Express.js 4.18+ (API Server)
├── Supabase (Backend as a Service)
│   ├── PostgreSQL (Database)
│   ├── Authentication
│   ├── Storage (File uploads)
│   └── Real-time subscriptions
└── REST API Architecture
```

### Third-Party Integrations
```
├── EmailJS
│   └── SMTP Email Service
├── Google Drive API
│   ├── File backup
│   └── Document storage
├── Google Sheets API
│   └── Record keeping
├── Sharp (Image Processing)
└── PDF-lib (PDF Generation)
```

### Development Tools
```
├── ESLint (Code Linting)
├── Prettier (Code Formatting)
├── Husky (Git Hooks)
├── Jest (Unit Testing)
├── Playwright (E2E Testing)
└── GitHub Actions (CI/CD)
```

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Student    │  │    Admin     │  │   Faculty    │      │
│  │   Portal     │  │   Dashboard  │  │    Portal    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Next.js App Router                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐           │   │
│  │  │   API    │ │ Server   │ │  Static  │           │   │
│  │  │  Routes  │ │  Actions │ │  Pages   │           │   │
│  │  └──────────┘ └──────────┘ └──────────┘           │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Supabase │  │ EmailJS  │  │  Google  │  │  Image   │   │
│  │ Client   │  │ Service  │  │   APIs   │  │Processor │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │  Supabase  │  │   Google   │  │   Google   │           │
│  │ PostgreSQL │  │   Drive    │  │   Sheets   │           │
│  │  Database  │  │  (Backup)  │  │  (Records) │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → Next.js API Route → Service Layer → Supabase Database
                                       ├→ EmailJS (Notifications)
                                       ├→ Google Drive (Backup)
                                       └→ Google Sheets (Records)
```

---

## 📦 Prerequisites

Before installation, ensure you have the following:

### Required Software
- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Required Accounts & API Keys

1. **Supabase Account**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Note down: Project URL and Anon Public Key

2. **EmailJS Account**
   - Sign up at [emailjs.com](https://www.emailjs.com/)
   - Create email service
   - Create email templates
   - Note down: Service ID, Template ID, Public Key

3. **Google Cloud Project**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable APIs:
     - Google Drive API
     - Google Sheets API
   - Create Service Account
   - Download credentials JSON file

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# This repository is private and proprietary
# Access requires authorization from XIE Student Council

# If authorized, clone the repository
git clone https://github.com/vinaymore69/xie-student-council.git
cd xie-student-council
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install

# This will install:
# - Production dependencies
# - Development dependencies
# - Type definitions
```

### Step 3: Environment Configuration

Create a `.env.local` file in the project root:

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="XIE Student Council"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Google Drive API Configuration
GOOGLE_DRIVE_CLIENT_EMAIL=your_service_account_email
GOOGLE_DRIVE_PRIVATE_KEY=your_service_account_private_key
GOOGLE_DRIVE_FOLDER_ID=your_backup_folder_id

# Google Sheets API Configuration
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_PRIVATE_KEY=your_service_account_private_key

# Admin Configuration
ADMIN_EMAIL=admin@xavierengg.edu.in
ADMIN_PASSWORD_HASH=your_hashed_password

# Security
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Upload Limits
MAX_FILE_SIZE=10485760 # 10MB in bytes
MAX_IMAGES_PER_UPLOAD=20
```

### Step 4: Database Setup

```bash
# Run database migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### Step 5: Start Development Server

```bash
# Start the development server
npm run dev

# The application will be available at:
# http://localhost:3000
```

### Step 6: Verify Installation

1. Open browser and navigate to `http://localhost:3000`
2. Check console for any errors
3. Test basic navigation
4. Login with admin credentials
5. Verify database connection

---

## ⚙️ Configuration

### Supabase Setup

#### 1. Create Database Tables

Run the following SQL in Supabase SQL Editor:

```sql
-- Fests Table
CREATE TABLE fests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Cultural', 'Technical', 'Sports')),
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  poster_url TEXT,
  status VARCHAR(20) DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fest_id UUID REFERENCES fests(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  venue VARCHAR(100),
  event_date DATE,
  event_time TIME,
  rules TEXT,
  coordinator_name VARCHAR(100),
  coordinator_contact VARCHAR(15),
  max_participants INTEGER,
  registration_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Winners Table
CREATE TABLE winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  participant_name VARCHAR(150) NOT NULL,
  class VARCHAR(20) NOT NULL,
  department VARCHAR(50) NOT NULL,
  medal_type VARCHAR(10) CHECK (medal_type IN ('Gold', 'Silver', 'Bronze')),
  team_members TEXT[],
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  fest_id UUID REFERENCES fests(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  drive_backup_url TEXT,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drafts/Notices Table
CREATE TABLE drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'notice',
  file_url TEXT,
  drive_backup_url TEXT,
  published BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Lists Table
CREATE TABLE email_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_name VARCHAR(100) NOT NULL,
  list_type VARCHAR(50) CHECK (list_type IN ('council', 'faculty', 'crs', 'custom')),
  emails TEXT[] NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medal Tally View (Automatically calculated)
CREATE VIEW medal_tally AS
SELECT 
  class,
  department,
  COUNT(*) FILTER (WHERE medal_type = 'Gold') as gold_medals,
  COUNT(*) FILTER (WHERE medal_type = 'Silver') as silver_medals,
  COUNT(*) FILTER (WHERE medal_type = 'Bronze') as bronze_medals,
  COUNT(*) as total_medals
FROM winners
GROUP BY class, department
ORDER BY gold_medals DESC, silver_medals DESC, bronze_medals DESC;

-- Department Standings View
CREATE VIEW department_standings AS
SELECT 
  department,
  SUM(gold_medals) as total_gold,
  SUM(silver_medals) as total_silver,
  SUM(bronze_medals) as total_bronze,
  SUM(total_medals) as total_medals
FROM medal_tally
GROUP BY department
ORDER BY total_gold DESC, total_silver DESC, total_bronze DESC;

-- Create Indexes for Performance
CREATE INDEX idx_events_fest_id ON events(fest_id);
CREATE INDEX idx_winners_event_id ON winners(event_id);
CREATE INDEX idx_winners_class ON winners(class);
CREATE INDEX idx_winners_department ON winners(department);
CREATE INDEX idx_gallery_event_id ON gallery(event_id);
CREATE INDEX idx_gallery_fest_id ON gallery(fest_id);
```

#### 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE fests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_lists ENABLE ROW LEVEL SECURITY;

-- Public read access to fests, events, winners, gallery
CREATE POLICY "Public read access" ON fests FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON winners FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Admin full access" ON fests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON winners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON drafts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON email_lists FOR ALL USING (auth.role() = 'authenticated');
```

#### 3. Configure Storage Buckets

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('event-images', 'event-images', true),
  ('winner-photos', 'winner-photos', true),
  ('draft-documents', 'draft-documents', false);

-- Storage policies
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id IN ('event-images', 'winner-photos'));
CREATE POLICY "Admin upload access" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Google Drive Setup

1. **Create Backup Folder Structure**
```
XIE Student Council Backup/
├── Images/
│   ├── Events/
│   └── Winners/
├── Documents/
│   └── Drafts/
└── Records/
    └── Email Logs/
```

2. **Share folder with service account email**

3. **Copy folder ID from URL**:
```
https://drive.google.com/drive/folders/FOLDER_ID_HERE
```

### Google Sheets Setup

1. **Create Spreadsheet** with sheets:
   - Event Results
   - Winner Records
   - Medal Tally
   - Email Logs

2. **Share with service account email** (Editor access)

3. **Copy Spreadsheet ID** from URL:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```

---

## 📚 API Documentation

### REST API Endpoints

#### Fests

```typescript
GET    /api/fests              // Get all fests
GET    /api/fests/:id          // Get fest by ID
POST   /api/fests              // Create new fest (Admin)
PUT    /api/fests/:id          // Update fest (Admin)
DELETE /api/fests/:id          // Delete fest (Admin)
```

#### Events

```typescript
GET    /api/events             // Get all events
GET    /api/events/:id         // Get event by ID
GET    /api/events/fest/:festId // Get events by fest
POST   /api/events             // Create new event (Admin)
PUT    /api/events/:id         // Update event (Admin)
DELETE /api/events/:id         // Delete event (Admin)
```

#### Winners

```typescript
GET    /api/winners            // Get all winners
GET    /api/winners/:id        // Get winner by ID
GET    /api/winners/event/:eventId // Get winners by event
POST   /api/winners            // Add winner (Admin)
PUT    /api/winners/:id        // Update winner (Admin)
DELETE /api/winners/:id        // Delete winner (Admin)
```

#### Medal Tally

```typescript
GET    /api/tally/class        // Get class medal tally
GET    /api/tally/department   // Get department standings
GET    /api/tally/class/:class // Get specific class tally
```

#### Gallery

```typescript
GET    /api/gallery            // Get all images
GET    /api/gallery/event/:eventId // Get images by event
POST   /api/gallery            // Upload images (Admin)
DELETE /api/gallery/:id        // Delete image (Admin)
```

#### Drafts/Notices

```typescript
GET    /api/drafts             // Get all drafts
GET    /api/drafts/:id         // Get draft by ID
POST   /api/drafts             // Create draft (Admin)
PUT    /api/drafts/:id         // Update draft (Admin)
DELETE /api/drafts/:id         // Delete draft (Admin)
POST   /api/drafts/:id/send    // Send draft via email (Admin)
```

### Example API Request

```typescript
// Fetch all events for Spandan fest
const response = await fetch('/api/events/fest/spandan-2024', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const events = await response.json();
```

---

## 🎮 Usage

### For Students

#### Viewing Events
1. Navigate to homepage
2. Select fest (Spandan/Transmission/Sparx)
3. Browse events and click for details
4. View winners and medal information

#### Checking Rankings
1. Go to "Rankings" or "Leaderboard" page
2. Filter by class or department
3. View medal tally and standings
4. Compare year-over-year performance

#### Browsing Gallery
1. Visit "Gallery" section
2. Filter by fest or event
3. Click images for full view
4. Download or share images

---

## 👨‍💼 Admin Guide

### Logging In

1. Navigate to `/admin/login`
2. Enter admin credentials
3. Complete 2FA if enabled

### Managing Fests

```typescript
// Navigate to Admin Dashboard > Fests

// Create New Fest
1. Click "Add Fest"
2. Fill in details:
   - Name (e.g., "Spandan 2024")
   - Type (Cultural/Technical/Sports)
   - Start and End dates
   - Description
3. Upload poster image
4. Click "Create Fest"

// Edit Fest
1. Find fest in list
2. Click edit icon
3. Modify details
4. Save changes

// Delete Fest
1. Find fest in list
2. Click delete icon
3. Confirm deletion (Warning: This deletes all associated events and winners)
```

### Managing Events

```typescript
// Navigate to Admin Dashboard > Events

// Add Event
1. Click "Add Event"
2. Select parent fest
3. Fill in event details:
   - Event name
   - Category
   - Date and time
   - Venue
   - Rules and description
   - Coordinator information
4. Click "Create Event"

// Bulk Import Events
1. Click "Import Events"
2. Download CSV template
3. Fill in event data
4. Upload CSV file
5. Review and confirm
```

### Adding Winners

```typescript
// Navigate to specific event > Winners tab

// Add Single Winner
1. Click "Add Winner"
2. Enter participant details:
   - Name
   - Class (e.g., "SE COMPS A")
   - Department
   - Medal type (Gold/Silver/Bronze)
   - Team members (if applicable)
3. Upload photo (optional)
4. Click "Save"

// Note: Medal tally updates automatically
```

### Managing Gallery

```typescript
// Navigate to Admin Dashboard > Gallery

// Upload Images
1. Click "Upload Images"
2. Select event/fest
3. Choose multiple images (max 20)
4. Add captions (optional)
5. Click "Upload"
6. Images automatically backup to Google Drive

// Organize Images
1. Select images
2. Use "Move to" dropdown
3. Choose destination event/fest
4. Confirm move
```

### Email System

```typescript
// Navigate to Admin Dashboard > Communications

// Create Draft
1. Click "New Draft"
2. Enter title and content (Rich text editor)
3. Attach files if needed
4. Save as draft

// Send Email
1. Open draft
2. Click "Send Email"
3. Select recipient list:
   - Council members
   - Faculty
   - CRs
   - Custom list
4. Preview email
5. Schedule or send immediately
6. Email auto-archived to Drive
```

### Backup Management

```typescript
// Navigate to Admin Dashboard > Settings > Backups

// Manual Backup
1. Click "Backup Now"
2. Select data to backup:
   - Images
   - Documents
   - Database records
3. Confirm backup
4. View backup status

// Automated Backups
- Images: Backed up on upload
- Documents: Backed up on upload
- Records: Synced to Google Sheets real-time

// Restore from Backup
1. Click "Restore"
2. Select backup date
3. Choose items to restore
4. Confirm restoration
```

---

## 💾 Backup System

### Automated Backups

#### Image Backups
- **When**: Automatically on upload
- **Where**: Google Drive > XIE Student Council Backup > Images/
- **Format**: Original format preserved
- **Naming**: `{timestamp}_{original_filename}`

#### Document Backups
- **When**: On draft creation/update
- **Where**: Google Drive > XIE Student Council Backup > Documents/
- **Format**: PDF and original format
- **Naming**: `{draft_id}_{timestamp}_{title}`

#### Record Syncing
- **When**: Real-time on data change
- **Where**: Google Sheets
- **Sheets**:
  - Event Results: All event data
  - Winner Records: All winner data with medals
  - Medal Tally: Calculated tallies
  - Email Logs: All sent emails

### Manual Backup

```bash
# Run manual backup script
npm run backup

# Backup specific data
npm run backup:images
npm run backup:documents
npm run backup:database
```

### Backup Verification

```typescript
// Check backup status
GET /api/admin/backup/status

Response:
{
  "last_image_backup": "2025-10-19T10:30:00Z",
  "last_document_backup": "2025-10-19T09:15:00Z",
  "sheets_sync_status": "synced",
  "total_backed_up_items": 1247
}
```

---

## 📧 Email System

### EmailJS Configuration

#### Service Setup
1. Log in to EmailJS
2. Add email service (Gmail/Outlook/SMTP)
3. Verify email service

#### Template Creation

Create templates for:

**1. General Notice Template** (`template_notice`)
```
Subject: {{subject}}

Dear Recipients,

{{content}}

---
Best regards,
XIE Student Council
Xavier Institute of Engineering
```

**2. Event Announcement Template** (`template_event`)
```
Subject: {{event_name}} - {{fest_name}}

Dear Students,

We are excited to announce {{event_name}} as part of {{fest_name}}!

Event Details:
- Date: {{event_date}}
- Time: {{event_time}}
- Venue: {{venue}}

{{event_description}}

Register now and participate!

---
XIE Student Council
```

**3. Winner Announcement Template** (`template_winners`)
```
Subject: Congratulations - {{event_name}} Winners

Dear Winners,

Congratulations on your outstanding performance in {{event_name}}!

Winners:
{{winners_list}}

Your achievements make us proud!

---
XIE Student Council
```

### Sending Emails

```typescript
// Example: Send custom email
import emailjs from '@emailjs/browser';

const sendEmail = async (recipientList, subject, content) => {
  const templateParams = {
    to_emails: recipientList.join(','),
    subject: subject,
    content: content,
    from_name: 'XIE Student Council'
  };

  const response = await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    templateParams,
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  );

  // Log to Google Sheets
  await logEmailToSheets(recipientList, subject, response.status);
};
```

### Email Lists Management

```typescript
// Predefined lists stored in database
const emailLists = {
  council: ['council1@xavierengg.edu.in', '...'],
  faculty: ['faculty1@xavierengg.edu.in', '...'],
  crs: ['cr1@xavierengg.edu.in', '...'],
};

// Add custom list via admin panel
POST /api/admin/email-lists
{
  "list_name": "Event Coordinators",
  "emails": ["coord1@example.com", "coord2@example.com"],
  "list_type": "custom"
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: "Supabase connection failed"
**Solution:**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verify Supabase project status at supabase.com
# Ensure IP is not blocked in Supabase settings
```

#### Issue: "Images not uploading"
**Solution:**
```bash
# Check file size (max 10MB by default)
# Verify storage bucket exists in Supabase
# Check storage policies

# Increase limit in .env.local:
MAX_FILE_SIZE=20971520  # 20MB
```

#### Issue: "Email sending failed"
**Solution:**
```bash
# Verify EmailJS credentials
# Check template IDs match
# Ensure email service is verified

# Test with EmailJS dashboard first
# Check browser console for specific errors
```

#### Issue: "Google Drive backup not working"
**Solution:**
```bash
# Verify service account has access to folder
# Check private key format (should include \n for line breaks)
# Ensure folder ID is correct

# Test credentials:
npm run test:drive-connection
```

#### Issue: "Google Sheets sync failed"
**Solution:**
```bash
# Check spreadsheet is shared with service account
# Verify spreadsheet ID
# Ensure sheet names match code expectations

# Test credentials:
npm run test:sheets-connection
```

### Debug Mode

```bash
# Run in debug mode
DEBUG=* npm run dev

# Check logs
tail -f logs/application.log

# Database query logging
NEXT_PUBLIC_DEBUG_DB=true npm run dev
```

### Performance Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Optimize images
npm run optimize:images

# Check database indexes
npm run db:analyze
```

---

## 🔒 Security

### Security Measures Implemented

1. **Authentication**
   - NextAuth.js with secure session handling
   - Password hashing with bcrypt
   - 2FA support (optional)

2. **Authorization**
   - Role-based access control (RBAC)
   - Supabase Row Level Security (RLS)
   - Admin-only routes protected

3. **Data Protection**
   - Environment variables for sensitive data
   - Encrypted API keys
   - HTTPS enforcement in production

4. **Input Validation**
   - Client-side validation with Zod
   - Server-side sanitization
   - SQL injection prevention (Supabase)
   - XSS protection

5. **File Upload Security**
   - File type validation
   - Size limits enforced
   - Malware scanning (optional)
   - Sanitized filenames

6. **API Security**
   - Rate limiting
   - CORS configured
   - CSRF protection
   - Request logging

### Security Best Practices

```typescript
// 1. Never commit .env files
// Add to .gitignore:
.env.local
.env.production

// 2. Rotate API keys regularly
// Update keys every 90 days

// 3. Monitor logs for suspicious activity
// Check logs/security.log daily

// 4. Keep dependencies updated
npm audit
npm audit fix

// 5. Use environment-specific configs
// Different keys for dev/staging/production
```

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Contact: security@xavierengg.edu.in

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

---

## 👥 Contributing

### ⚠️ IMPORTANT: This is Proprietary Software

This codebase is **PROPRIETARY** and **NOT OPEN SOURCE**. Contributing is restricted to authorized XIE Student Council members only.

### Authorized Contributors Only

If you are an authorized contributor:

1. **Get Access**
   - Contact council tech lead
   - Sign NDA if required
   - Receive repository access

2. **Development Workflow**
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature-name

   # Make changes and commit
   git add .
   git commit -m "feat: description of feature"

   # Push to remote
   git push origin feature/your-feature-name

   # Create Pull Request
   # Request review from tech lead
   ```

3. **Commit Convention**
   ```
   feat: new feature
   fix: bug fix
   docs: documentation changes
   style: formatting changes
   refactor: code refactoring
   test: adding tests
   chore: maintenance tasks
   ```

4. **Code Review Process**
   - All PRs require 2 approvals
   - Must pass all tests
   - Must meet code quality standards
   - Must include documentation

5. **Testing Requirements**
   ```bash
   # Run tests before committing
   npm run test
   npm run test:e2e
   npm run lint
   ```

---

## 📄 License

**Copyright © 2025 Xavier Institute of Engineering - Student Council. All Rights Reserved.**

This software and associated documentation files (the "Software") are **PROPRIETARY** and **CONFIDENTIAL**.

### Restrictions

- ❌ No reproduction, distribution, or modification without explicit written permission
- ❌ No commercial use
- ❌ No reverse engineering
- ❌ No public disclosure of source code
- ❌ No derivative works

### Authorized Use

This Software is licensed exclusively to:
- **Xavier Institute of Engineering Student Council**
- For internal use only
- Non-transferable license

### Enforcement

Unauthorized use, reproduction, or distribution will be prosecuted to the fullest extent of applicable law.

For licensing inquiries: licensing@xavierengg.edu.in

---

## 📞 Contact

### Technical Support

**Student Council Tech Team**
- 📧 Email: techsupport@xavierengg.edu.in
- 📞 Phone: +91-XXXX-XXXXXX
- ⏰ Available: Mon-Fri, 9 AM - 5 PM IST

### General Inquiries

**XIE Student Council**
- 📧 Email: council@xavierengg.edu.in
- 🌐 Website: https://xavierengg.edu.in/student-council
- 📍 Address: Xavier Institute of Engineering, Mahim, Mumbai - 400016

### Bug Reports & Feature Requests

For authorized users only:
- 🐛 Bugs: Create private issue on GitHub
- 💡 Features: Email featurerequest@xavierengg.edu.in

### Emergency Contact

For critical system failures:
- 📞 Emergency Hotline: +91-XXXX-XXXXXX
- ⏰ Available: 24/7

---

## 🙏 Acknowledgments

### Development Team

- **Project Lead**: [Name]
- **Backend Developer**: [Name]
- **Frontend Developer**: [Name]
- **UI/UX Designer**: [Name]
- **Database Administrator**: [Name]

### Special Thanks

- Xavier Institute of Engineering Administration
- Student Council 2025
- All event coordinators and volunteers

---

## 📊 Project Status

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-active-success)
![Maintenance](https://img.shields.io/badge/maintenance-active-green)

### Roadmap

- [x] Core platform development
- [x] Authentication & authorization
- [x] Event management system
- [x] Medal tally automation
- [x] Email integration
- [x] Google Drive backup
- [x] Google Sheets integration
- [ ] Mobile app (Planned Q4 2025)
- [ ] Advanced analytics dashboard
- [ ] Event registration system
- [ ] Live scoring integration

---

## 📝 Changelog

### Version 1.0.0 (2025-10-19)
- Initial release
- Complete platform functionality
- All integrations implemented
- Security hardening complete

---

<div align="center">

**Made with ❤️ by XIE Student Council**

© 2025 Xavier Institute of Engineering. All Rights Reserved.

</div>