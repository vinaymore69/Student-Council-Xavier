// test-seed.js - Complete Firebase seeding script
// Run with: node test-seed.js

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ============================================================================
// SEED DATA
// ============================================================================

const seedData = {
  // Config
  config: {
    medals: {
      goldPoints: 3,
      silverPoints: 2,
      bronzePoints: 1,
      medalNames: ['Gold', 'Silver', 'Bronze']
    }
  },

  // Admins (replace with your actual admin UID after creating user in Authentication)
  admins: [
    {
      uid: 'SjqSv73kt7PtxRl5X8mJQ0cYAjB3', // Get this from Firebase Auth
      name: 'Admin User',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // Users/Students
  users: [
    {
      uid: 'user1',
      name: 'Rahul Sharma',
      email: 'rahul@college.edu',
      phone: '+919812345601',
      departmentId: 'comp_eng',
      departmentName: 'Computer Engineering',
      classId: 'd3a',
      className: 'Diploma 3rd Year A',
      rollNo: 'CE-190',
      role: 'student',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      uid: 'user2',
      name: 'Priya Patel',
      email: 'priya@college.edu',
      phone: '+919812345602',
      departmentId: 'mech_eng',
      departmentName: 'Mechanical Engineering',
      classId: 'd3b',
      className: 'Diploma 3rd Year B',
      rollNo: 'ME-145',
      role: 'student',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      uid: 'user3',
      name: 'Amit Kumar',
      email: 'amit@college.edu',
      phone: '+919812345603',
      departmentId: 'comp_eng',
      departmentName: 'Computer Engineering',
      classId: 'd2a',
      className: 'Diploma 2nd Year A',
      rollNo: 'CE-234',
      role: 'student',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      uid: 'user4',
      name: 'Sneha Desai',
      email: 'sneha@college.edu',
      phone: '+919812345604',
      departmentId: 'civil_eng',
      departmentName: 'Civil Engineering',
      classId: 'd3a',
      className: 'Diploma 3rd Year A',
      rollNo: 'CV-167',
      role: 'student',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      uid: 'user5',
      name: 'Vikram Singh',
      email: 'vikram@college.edu',
      phone: '+919812345605',
      departmentId: 'mech_eng',
      departmentName: 'Mechanical Engineering',
      classId: 'd3a',
      className: 'Diploma 3rd Year A',
      rollNo: 'ME-189',
      role: 'student',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      uid: 'user6',
      name: 'Anjali Mehta',
      email: 'anjali@college.edu',
      phone: '+919812345606',
      departmentId: 'comp_eng',
      departmentName: 'Computer Engineering',
      classId: 'd3b',
      className: 'Diploma 3rd Year B',
      rollNo: 'CE-201',
      role: 'student',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // Event Types
  eventTypes: [
    {
      typeId: 'cultural',
      name: 'Spandan',
      typeCategory: 'Cultural',
      description: 'Annual cultural fest showcasing talent',
      slug: 'spandan',
      currentEditionId: '2024',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      typeId: 'sports',
      name: 'Khel Mahotsav',
      typeCategory: 'Sports',
      description: 'Inter-department sports competition',
      slug: 'khel-mahotsav',
      currentEditionId: '2024',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      typeId: 'technical',
      name: 'Technovation',
      typeCategory: 'Technical',
      description: 'Technical symposium and project showcase',
      slug: 'technovation',
      currentEditionId: '2024',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // Editions for each event type
  editions: {
    cultural: {
      editionId: '2024',
      title: 'Spandan 2024',
      year: 2024,
      bannerUrl: 'https://example.com/spandan-banner.jpg',
      startDate: admin.firestore.Timestamp.fromDate(new Date('2024-03-15')),
      endDate: admin.firestore.Timestamp.fromDate(new Date('2024-03-17')),
      venue: 'Main Auditorium',
      isPublished: true,
      meta: { totalCompetitions: 2 },
      createdBy: 'REPLACE_WITH_YOUR_ADMIN_UID',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    sports: {
      editionId: '2024',
      title: 'Khel Mahotsav 2024',
      year: 2024,
      bannerUrl: 'https://example.com/sports-banner.jpg',
      startDate: admin.firestore.Timestamp.fromDate(new Date('2024-02-10')),
      endDate: admin.firestore.Timestamp.fromDate(new Date('2024-02-15')),
      venue: 'Sports Complex',
      isPublished: true,
      meta: { totalCompetitions: 2 },
      createdBy: 'REPLACE_WITH_YOUR_ADMIN_UID',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    technical: {
      editionId: '2024',
      title: 'Technovation 2024',
      year: 2024,
      bannerUrl: 'https://example.com/tech-banner.jpg',
      startDate: admin.firestore.Timestamp.fromDate(new Date('2024-04-20')),
      endDate: admin.firestore.Timestamp.fromDate(new Date('2024-04-22')),
      venue: 'Tech Lab Complex',
      isPublished: true,
      meta: { totalCompetitions: 2 },
      createdBy: 'REPLACE_WITH_YOUR_ADMIN_UID',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  },

  // Competitions
  competitions: {
    cultural: [
      {
        competitionId: 'solo_singing',
        title: 'Solo Singing',
        shortDesc: 'Showcase your vocal talent',
        detailedDesc: 'Open singing competition for all students. Choose any genre and mesmerize the audience.',
        dateTime: admin.firestore.Timestamp.fromDate(new Date('2024-03-15T14:00:00')),
        durationMinutes: 10,
        venue: 'Auditorium A',
        rules: ['No live instruments allowed', 'Maximum 5 minutes per performance', 'Original or cover songs allowed'],
        codeOfConduct: 'Maintain decorum and respect fellow participants',
        prizeDetails: '1st: ₹5000, 2nd: ₹3000, 3rd: ₹2000',
        socials: { instagram: '@spandan_cultural', facebook: 'spandan.official' },
        contacts: [{ name: 'Coordinator Alice', phone: '+919812340001' }],
        bannerUrl: 'https://example.com/solo-singing.jpg',
        galleryUrls: [],
        entryFee: 100,
        maxParticipants: 50,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        competitionId: 'group_dance',
        title: 'Group Dance',
        shortDesc: 'Dance as a team and win big',
        detailedDesc: 'Group dance competition with 4-8 members per team. Any dance form welcome.',
        dateTime: admin.firestore.Timestamp.fromDate(new Date('2024-03-16T16:00:00')),
        durationMinutes: 15,
        venue: 'Main Stage',
        rules: ['4-8 members per team', 'Maximum 8 minutes performance', 'Props allowed'],
        codeOfConduct: 'No offensive content or gestures',
        prizeDetails: '1st: ₹10000, 2nd: ₹6000, 3rd: ₹4000',
        socials: { instagram: '@spandan_cultural', facebook: 'spandan.official' },
        contacts: [{ name: 'Coordinator Bob', phone: '+919812340002' }],
        bannerUrl: 'https://example.com/group-dance.jpg',
        galleryUrls: [],
        entryFee: 500,
        maxParticipants: 20,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ],
    sports: [
      {
        competitionId: 'cricket',
        title: 'Cricket Tournament',
        shortDesc: 'Inter-department cricket championship',
        detailedDesc: '20-overs format. Department teams compete for the trophy.',
        dateTime: admin.firestore.Timestamp.fromDate(new Date('2024-02-12T09:00:00')),
        durationMinutes: 180,
        venue: 'Cricket Ground',
        rules: ['11 players per team', '20 overs per side', 'Standard ICC rules apply'],
        codeOfConduct: 'Fair play and sportsmanship',
        prizeDetails: '1st: Trophy + ₹15000, 2nd: ₹8000, 3rd: ₹5000',
        socials: { instagram: '@khel_mahotsav', facebook: 'khel.sports' },
        contacts: [{ name: 'Sports Coordinator', phone: '+919812340003' }],
        bannerUrl: 'https://example.com/cricket.jpg',
        galleryUrls: [],
        entryFee: 0,
        maxParticipants: 100,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        competitionId: 'athletics_100m',
        title: '100m Sprint',
        shortDesc: 'Race to glory in 100 meters',
        detailedDesc: 'Individual 100m sprint race. Fastest wins!',
        dateTime: admin.firestore.Timestamp.fromDate(new Date('2024-02-13T10:00:00')),
        durationMinutes: 5,
        venue: 'Athletics Track',
        rules: ['Individual event', 'Standard athletics rules', 'Heats followed by finals'],
        codeOfConduct: 'No performance-enhancing substances',
        prizeDetails: '1st: Gold Medal + ₹3000, 2nd: Silver Medal + ₹2000, 3rd: Bronze Medal + ₹1000',
        socials: { instagram: '@khel_mahotsav', facebook: 'khel.sports' },
        contacts: [{ name: 'Track Coach', phone: '+919812340004' }],
        bannerUrl: 'https://example.com/athletics.jpg',
        galleryUrls: [],
        entryFee: 0,
        maxParticipants: 50,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ],
    technical: [
      {
        competitionId: 'hackathon',
        title: '24-Hour Hackathon',
        shortDesc: 'Code, innovate, and win',
        detailedDesc: 'Build a working prototype in 24 hours. Teams of 2-4 members.',
        dateTime: admin.firestore.Timestamp.fromDate(new Date('2024-04-20T18:00:00')),
        durationMinutes: 1440,
        venue: 'Computer Lab 1-3',
        rules: ['2-4 members per team', 'Any tech stack allowed', 'Original work only'],
        codeOfConduct: 'No plagiarism. Respect organizers and participants.',
        prizeDetails: '1st: ₹25000 + Internship opportunities, 2nd: ₹15000, 3rd: ₹10000',
        socials: { instagram: '@technovation_fest', facebook: 'technovation.official' },
        contacts: [{ name: 'Tech Lead', phone: '+919812340005' }],
        bannerUrl: 'https://example.com/hackathon.jpg',
        galleryUrls: [],
        entryFee: 200,
        maxParticipants: 100,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        competitionId: 'project_expo',
        title: 'Project Expo',
        shortDesc: 'Showcase your innovative projects',
        detailedDesc: 'Present your engineering projects to industry experts and professors.',
        dateTime: admin.firestore.Timestamp.fromDate(new Date('2024-04-22T11:00:00')),
        durationMinutes: 300,
        venue: 'Exhibition Hall',
        rules: ['Working prototype required', '10 minute presentation + 5 minute Q&A', 'Individual or team (max 3)'],
        codeOfConduct: 'Academic integrity must be maintained',
        prizeDetails: '1st: ₹15000, 2nd: ₹10000, 3rd: ₹7000',
        socials: { instagram: '@technovation_fest', facebook: 'technovation.official' },
        contacts: [{ name: 'Faculty Coordinator', phone: '+919812340006' }],
        bannerUrl: 'https://example.com/project-expo.jpg',
        galleryUrls: [],
        entryFee: 150,
        maxParticipants: 75,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ]
  },

  // Sample Results (will be added WITHOUT tallyApplied flag to trigger Cloud Function)
  results: {
    cultural: {
      solo_singing: {
        resultId: 'result_solo_singing_1',
        competitionId: 'solo_singing',
        submittedBy: 'REPLACE_WITH_YOUR_ADMIN_UID',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isFinal: true,
        placements: [
          { place: 1, participantUserId: 'user1', participantName: 'Rahul Sharma' },
          { place: 2, participantUserId: 'user2', participantName: 'Priya Patel' },
          { place: 3, participantUserId: 'user3', participantName: 'Amit Kumar' }
        ],
        tallyApplied: false,
        appliedSnapshot: null,
        notes: 'Excellent performances by all'
      },
      group_dance: {
        resultId: 'result_group_dance_1',
        competitionId: 'group_dance',
        submittedBy: 'REPLACE_WITH_YOUR_ADMIN_UID',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isFinal: true,
        placements: [
          { place: 1, participantUserId: 'user4', participantName: 'Sneha Desai' },
          { place: 2, participantUserId: 'user5', participantName: 'Vikram Singh' },
          { place: 3, participantUserId: 'user6', participantName: 'Anjali Mehta' }
        ],
        tallyApplied: false,
        appliedSnapshot: null,
        notes: 'Outstanding choreography'
      }
    },
    sports: {
      cricket: {
        resultId: 'result_cricket_1',
        competitionId: 'cricket',
        submittedBy: 'REPLACE_WITH_YOUR_ADMIN_UID',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isFinal: true,
        placements: [
          { place: 1, participantUserId: 'user1', participantName: 'Rahul Sharma' },
          { place: 2, participantUserId: 'user4', participantName: 'Sneha Desai' },
          { place: 3, participantUserId: 'user2', participantName: 'Priya Patel' }
        ],
        tallyApplied: false,
        appliedSnapshot: null,
        notes: 'Thrilling final match'
      },
      athletics_100m: {
        resultId: 'result_athletics_1',
        competitionId: 'athletics_100m',
        submittedBy: 'REPLACE_WITH_YOUR_ADMIN_UID',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isFinal: true,
        placements: [
          { place: 1, participantUserId: 'user3', participantName: 'Amit Kumar' },
          { place: 2, participantUserId: 'user5', participantName: 'Vikram Singh' },
          { place: 3, participantUserId: 'user1', participantName: 'Rahul Sharma' }
        ],
        tallyApplied: false,
        appliedSnapshot: null,
        notes: 'Record-breaking time'
      }
    },
    technical: {
      hackathon: {
        resultId: 'result_hackathon_1',
        competitionId: 'hackathon',
        submittedBy: 'REPLACE_WITH_YOUR_ADMIN_UID',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isFinal: true,
        placements: [
          { place: 1, participantUserId: 'user6', participantName: 'Anjali Mehta' },
          { place: 2, participantUserId: 'user1', participantName: 'Rahul Sharma' },
          { place: 3, participantUserId: 'user4', participantName: 'Sneha Desai' }
        ],
        tallyApplied: false,
        appliedSnapshot: null,
        notes: 'Innovative solutions presented'
      },
      project_expo: {
        resultId: 'result_project_1',
        competitionId: 'project_expo',
        submittedBy: 'REPLACE_WITH_YOUR_ADMIN_UID',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isFinal: true,
        placements: [
          { place: 1, participantUserId: 'user2', participantName: 'Priya Patel' },
          { place: 2, participantUserId: 'user3', participantName: 'Amit Kumar' },
          { place: 3, participantUserId: 'user5', participantName: 'Vikram Singh' }
        ],
        tallyApplied: false,
        appliedSnapshot: null,
        notes: 'Impressive prototypes'
      }
    }
  }
};

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Seed Config
    console.log('📝 Seeding config...');
    await db.doc('config/medals').set(seedData.config.medals);
    console.log('✅ Config seeded\n');

    // 2. Seed Admins (IMPORTANT: Replace UID first!)
    console.log('👤 Seeding admins...');
    if (seedData.admins[0].uid === 'REPLACE_WITH_YOUR_ADMIN_UID') {
      console.log('⚠️  WARNING: Please replace REPLACE_WITH_YOUR_ADMIN_UID with your actual admin UID from Firebase Auth');
      console.log('   Skipping admin seeding...\n');
    } else {
      for (const admin of seedData.admins) {
        await db.doc(`admins/${admin.uid}`).set(admin);
      }
      console.log('✅ Admins seeded\n');
    }

    // 3. Seed Users
    console.log('👥 Seeding users...');
    for (const user of seedData.users) {
      await db.doc(`users/${user.uid}`).set(user);
    }
    console.log(`✅ ${seedData.users.length} users seeded\n`);

    // 4. Seed Event Types
    console.log('🎯 Seeding event types...');
    for (const eventType of seedData.eventTypes) {
      await db.doc(`eventTypes/${eventType.typeId}`).set(eventType);
    }
    console.log(`✅ ${seedData.eventTypes.length} event types seeded\n`);

    // 5. Seed Editions
    console.log('📅 Seeding editions...');
    for (const [typeId, edition] of Object.entries(seedData.editions)) {
      await db.doc(`eventTypes/${typeId}/editions/${edition.editionId}`).set(edition);
      
      // Also create currentEditions denormalized doc
      await db.doc(`currentEditions/${typeId}`).set({
        typeId,
        editionId: edition.editionId,
        title: edition.title,
        year: edition.year,
        bannerUrl: edition.bannerUrl,
        isPublished: edition.isPublished,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log('✅ Editions and currentEditions seeded\n');

    // 6. Seed Competitions
    console.log('🏆 Seeding competitions...');
    let totalComps = 0;
    for (const [typeId, competitions] of Object.entries(seedData.competitions)) {
      for (const comp of competitions) {
        await db.doc(`eventTypes/${typeId}/editions/2024/competitions/${comp.competitionId}`).set(comp);
        totalComps++;
      }
    }
    console.log(`✅ ${totalComps} competitions seeded\n`);

    // 7. Seed Results (This will trigger Cloud Functions!)
    console.log('🎖️  Seeding results (will trigger tally calculations)...');
    for (const [typeId, competitions] of Object.entries(seedData.results)) {
      for (const [compId, result] of Object.entries(competitions)) {
        await db.doc(
          `eventTypes/${typeId}/editions/2024/competitions/${compId}/results/${result.resultId}`
        ).set(result);
        console.log(`   ✓ Result added for ${compId}`);
      }
    }
    console.log('✅ All results seeded\n');

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Config: 1 document`);
    console.log(`   - Users: ${seedData.users.length} documents`);
    console.log(`   - Event Types: ${seedData.eventTypes.length} documents`);
    console.log(`   - Editions: ${Object.keys(seedData.editions).length} documents`);
    console.log(`   - Competitions: ${totalComps} documents`);
    console.log(`   - Results: ${Object.values(seedData.results).reduce((sum, type) => sum + Object.keys(type).length, 0)} documents`);
    console.log('\n💡 Next steps:');
    console.log('   1. Check Firebase Console to see tallies being calculated');
    console.log('   2. Query tallies: eventTypes/{typeId}/editions/2024/tallies/departments');
    console.log('   3. Query tallies: eventTypes/{typeId}/editions/2024/tallies/classes');
    console.log('   4. Check Cloud Function logs for tally application');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// ============================================================================
// VERIFICATION FUNCTIONS
// ============================================================================

async function verifyAllTallies() {
  console.log('\n🔍 COMPREHENSIVE TALLY VERIFICATION\n');
  console.log('═'.repeat(80));

  const types = ['cultural', 'sports', 'technical'];
  const editionId = '2024';

  // ==============================================================
  // 1. EVENT-SPECIFIC TALLIES
  // ==============================================================
  
  console.log('\n📊 EVENT-SPECIFIC TALLIES\n');

  for (const typeId of types) {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`🎯 ${typeId.toUpperCase()} EVENT - ${editionId}`);
    console.log('─'.repeat(80));

    // Department tallies
    console.log('\n🏢 Department Rankings:');
    const deptSnapshot = await db
      .collection(`eventTypes/${typeId}/editions/${editionId}/tallies`)
      .doc('departments')
      .collection('departmentsList')
      .orderBy('points', 'desc')
      .get();

    if (deptSnapshot.empty) {
      console.log('   No department tallies found.');
    } else {
      deptSnapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. ${data.departmentName || doc.id}`);
        console.log(`      🥇 ${data.gold || 0}  🥈 ${data.silver || 0}  🥉 ${data.bronze || 0}  ⭐ ${data.points || 0} pts`);
      });
    }

    // Class tallies
    console.log('\n🎓 Class Rankings:');
    const classSnapshot = await db
      .collection(`eventTypes/${typeId}/editions/${editionId}/tallies`)
      .doc('classes')
      .collection('classesList')
      .orderBy('points', 'desc')
      .get();

    if (classSnapshot.empty) {
      console.log('   No class tallies found.');
    } else {
      classSnapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. ${data.className || doc.id}`);
        console.log(`      🥇 ${data.gold || 0}  🥈 ${data.silver || 0}  🥉 ${data.bronze || 0}  ⭐ ${data.points || 0} pts`);
      });
    }
  }

  // ==============================================================
  // 2. GLOBAL OVERALL TALLIES (Across all events)
  // ==============================================================
  
  console.log('\n\n' + '═'.repeat(80));
  console.log('🌍 GLOBAL OVERALL TALLIES (All Events Combined)');
  console.log('═'.repeat(80));

  console.log('\n🏆 Overall Department Championship:');
  const globalDeptSnapshot = await db
    .collection('globalTallies/overall/departments')
    .orderBy('points', 'desc')
    .get();

  if (globalDeptSnapshot.empty) {
    console.log('   No global department tallies found.');
  } else {
    globalDeptSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n   ${index + 1}. ${data.departmentName || doc.id}`);
      console.log(`      Total: 🥇 ${data.gold || 0}  🥈 ${data.silver || 0}  🥉 ${data.bronze || 0}  ⭐ ${data.points || 0} pts`);
      
      if (data.events) {
        console.log('      Event Breakdown:');
        for (const [eventType, eventData] of Object.entries(data.events)) {
          console.log(`        ${eventType}: 🥇 ${eventData.gold}  🥈 ${eventData.silver}  🥉 ${eventData.bronze}  ⭐ ${eventData.points} pts`);
        }
      }
    });
  }

  console.log('\n\n🏆 Overall Class Championship:');
  const globalClassSnapshot = await db
    .collection('globalTallies/overall/classes')
    .orderBy('points', 'desc')
    .get();

  if (globalClassSnapshot.empty) {
    console.log('   No global class tallies found.');
  } else {
    globalClassSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n   ${index + 1}. ${data.className || doc.id}`);
      console.log(`      Total: 🥇 ${data.gold || 0}  🥈 ${data.silver || 0}  🥉 ${data.bronze || 0}  ⭐ ${data.points || 0} pts`);
      
      if (data.events) {
        console.log('      Event Breakdown:');
        for (const [eventType, eventData] of Object.entries(data.events)) {
          console.log(`        ${eventType}: 🥇 ${eventData.gold}  🥈 ${eventData.silver}  🥉 ${eventData.bronze}  ⭐ ${eventData.points} pts`);
        }
      }
    });
  }

  // ==============================================================
  // 3. YEAR-WISE TALLIES
  // ==============================================================
  
  console.log('\n\n' + '═'.repeat(80));
  console.log('📅 YEAR-WISE TALLIES');
  console.log('═'.repeat(80));

 // ✅ CORRECT
const yearsSnapshot = await db.collection('globalTallies').doc('years').collection('yearsList').get();

  if (yearsSnapshot.empty) {
    console.log('\n   No year-wise tallies found.');
  } else {
    for (const yearDoc of yearsSnapshot.docs) {
      const yearData = yearDoc.data();
      const year = yearDoc.id;

      console.log(`\n${'─'.repeat(80)}`);
      console.log(`📆 YEAR ${year}`);
      console.log('─'.repeat(80));
      console.log(`Total Medals: 🥇 ${yearData.totalGold}  🥈 ${yearData.totalSilver}  🥉 ${yearData.totalBronze}  ⭐ ${yearData.totalPoints} pts\n`);

      // Year Department Rankings
      console.log('🏢 Department Rankings:');
     const yearDeptSnapshot = await db
  .collection('globalTallies').doc('years').collection('yearsList').doc(year).collection('departments')
        .orderBy('points', 'desc')
        .get();

      yearDeptSnapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. ${data.departmentName || doc.id}`);
        console.log(`      🥇 ${data.gold || 0}  🥈 ${data.silver || 0}  🥉 ${data.bronze || 0}  ⭐ ${data.points || 0} pts`);
      });

      // Year Class Rankings
      console.log('\n🎓 Class Rankings:');
      const yearClassSnapshot = await db
  .collection('globalTallies').doc('years').collection('yearsList').doc(year).collection('classes')
        .orderBy('points', 'desc')
        .get();

      yearClassSnapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. ${data.className || doc.id}`);
        console.log(`      🥇 ${data.gold || 0}  🥈 ${data.silver || 0}  🥉 ${data.bronze || 0}  ⭐ ${data.points || 0} pts`);
      });
    }
  }

  console.log('\n' + '═'.repeat(80));
  console.log('✅ VERIFICATION COMPLETE');
  console.log('═'.repeat(80) + '\n');
}
// ============================================================================
// MANUAL TALLY CALCULATION
// ============================================================================

async function calculateAllTallies() {
  console.log('\n🧮 Calculating ALL tallies (Overall, Event-wise, Year-wise)...\n');

  const configDoc = await db.doc('config/medals').get();
  const medalConfig = configDoc.data();
  const pointsMap = {
    1: medalConfig.goldPoints || 3,
    2: medalConfig.silverPoints || 2,
    3: medalConfig.bronzePoints || 1
  };

  const types = ['cultural', 'sports', 'technical'];
  const editionId = '2024'; // You can make this dynamic

  // Global tallies across all events
  const globalDepartmentTallies = {};
  const globalClassTallies = {};
  const globalYearTallies = {};

  for (const typeId of types) {
    console.log(`📊 Processing ${typeId}...`);
    
    // Event-specific tallies
    const eventDepartmentTallies = {};
    const eventClassTallies = {};

    const competitionsRef = db.collection(`eventTypes/${typeId}/editions/${editionId}/competitions`);
    const competitionsSnapshot = await competitionsRef.get();

    for (const compDoc of competitionsSnapshot.docs) {
      const resultsRef = compDoc.ref.collection('results');
      const resultsSnapshot = await resultsRef.get();

      for (const resultDoc of resultsSnapshot.docs) {
        const result = resultDoc.data();
        
        if (!result.isFinal) continue;

        for (const placement of result.placements || []) {
          if (placement.place > 3) continue;

          const points = pointsMap[placement.place] || 0;
          const userDoc = await db.doc(`users/${placement.participantUserId}`).get();
          if (!userDoc.exists) continue;

          const userData = userDoc.data();
          const medalType = placement.place === 1 ? 'gold' : placement.place === 2 ? 'silver' : 'bronze';

          // ==============================================================
          // 1. EVENT-SPECIFIC TALLIES (Per Event Type)
          // ==============================================================
          
          // Event Department Tally
          if (userData.departmentId) {
            if (!eventDepartmentTallies[userData.departmentId]) {
              eventDepartmentTallies[userData.departmentId] = {
                departmentId: userData.departmentId,
                departmentName: userData.departmentName,
                gold: 0, silver: 0, bronze: 0, points: 0
              };
            }
            eventDepartmentTallies[userData.departmentId][medalType]++;
            eventDepartmentTallies[userData.departmentId].points += points;
          }

          // Event Class Tally
          if (userData.classId) {
            if (!eventClassTallies[userData.classId]) {
              eventClassTallies[userData.classId] = {
                classId: userData.classId,
                className: userData.className,
                gold: 0, silver: 0, bronze: 0, points: 0
              };
            }
            eventClassTallies[userData.classId][medalType]++;
            eventClassTallies[userData.classId].points += points;
          }

          // ==============================================================
          // 2. GLOBAL OVERALL TALLIES (Across All Events)
          // ==============================================================
          
          // Global Department Tally
          if (userData.departmentId) {
            if (!globalDepartmentTallies[userData.departmentId]) {
              globalDepartmentTallies[userData.departmentId] = {
                departmentId: userData.departmentId,
                departmentName: userData.departmentName,
                gold: 0, silver: 0, bronze: 0, points: 0,
                events: {}
              };
            }
            globalDepartmentTallies[userData.departmentId][medalType]++;
            globalDepartmentTallies[userData.departmentId].points += points;
            
            // Track per-event breakdown
            if (!globalDepartmentTallies[userData.departmentId].events[typeId]) {
              globalDepartmentTallies[userData.departmentId].events[typeId] = {
                gold: 0, silver: 0, bronze: 0, points: 0
              };
            }
            globalDepartmentTallies[userData.departmentId].events[typeId][medalType]++;
            globalDepartmentTallies[userData.departmentId].events[typeId].points += points;
          }

          // Global Class Tally
          if (userData.classId) {
            if (!globalClassTallies[userData.classId]) {
              globalClassTallies[userData.classId] = {
                classId: userData.classId,
                className: userData.className,
                gold: 0, silver: 0, bronze: 0, points: 0,
                events: {}
              };
            }
            globalClassTallies[userData.classId][medalType]++;
            globalClassTallies[userData.classId].points += points;
            
            // Track per-event breakdown
            if (!globalClassTallies[userData.classId].events[typeId]) {
              globalClassTallies[userData.classId].events[typeId] = {
                gold: 0, silver: 0, bronze: 0, points: 0
              };
            }
            globalClassTallies[userData.classId].events[typeId][medalType]++;
            globalClassTallies[userData.classId].events[typeId].points += points;
          }

          // ==============================================================
          // 3. YEAR-WISE TALLIES
          // ==============================================================
          
          const year = parseInt(editionId);
          if (!globalYearTallies[year]) {
            globalYearTallies[year] = {
              year: year,
              departments: {},
              classes: {},
              totalGold: 0,
              totalSilver: 0,
              totalBronze: 0,
              totalPoints: 0
            };
          }

          // Year Department Tally
          if (userData.departmentId) {
            if (!globalYearTallies[year].departments[userData.departmentId]) {
              globalYearTallies[year].departments[userData.departmentId] = {
                departmentId: userData.departmentId,
                departmentName: userData.departmentName,
                gold: 0, silver: 0, bronze: 0, points: 0
              };
            }
            globalYearTallies[year].departments[userData.departmentId][medalType]++;
            globalYearTallies[year].departments[userData.departmentId].points += points;
          }

          // Year Class Tally
          if (userData.classId) {
            if (!globalYearTallies[year].classes[userData.classId]) {
              globalYearTallies[year].classes[userData.classId] = {
                classId: userData.classId,
                className: userData.className,
                gold: 0, silver: 0, bronze: 0, points: 0
              };
            }
            globalYearTallies[year].classes[userData.classId][medalType]++;
            globalYearTallies[year].classes[userData.classId].points += points;
          }

          // Year totals
          globalYearTallies[year][`total${medalType.charAt(0).toUpperCase() + medalType.slice(1)}`]++;
          globalYearTallies[year].totalPoints += points;
        }

        // Mark result as applied
        await resultDoc.ref.update({ tallyApplied: true });
      }
    }

    // ==============================================================
    // WRITE EVENT-SPECIFIC TALLIES
    // ==============================================================
    
    console.log(`   Writing event-specific tallies for ${typeId}...`);
    
    // Write event department tallies
    for (const [deptId, tally] of Object.entries(eventDepartmentTallies)) {
      await db.collection(`eventTypes/${typeId}/editions/${editionId}/tallies`)
        .doc('departments')
        .collection('departmentsList')
        .doc(deptId)
        .set(tally);
    }

    // Write event class tallies
    for (const [classId, tally] of Object.entries(eventClassTallies)) {
      await db.collection(`eventTypes/${typeId}/editions/${editionId}/tallies`)
        .doc('classes')
        .collection('classesList')
        .doc(classId)
        .set(tally);
    }

    console.log(`   ✅ ${typeId} event tallies written`);
  }

  // ==============================================================
  // WRITE GLOBAL OVERALL TALLIES (Across all events)
  // ==============================================================
  
  console.log('\n📊 Writing global overall tallies...');
  
  // Write global department tallies
  for (const [deptId, tally] of Object.entries(globalDepartmentTallies)) {
    await db.collection('globalTallies/overall/departments')
      .doc(deptId)
      .set({
        ...tally,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
  }

  // Write global class tallies
  for (const [classId, tally] of Object.entries(globalClassTallies)) {
    await db.collection('globalTallies/overall/classes')
      .doc(classId)
      .set({
        ...tally,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
  }

  console.log('   ✅ Global overall tallies written');

  // ==============================================================
  // WRITE YEAR-WISE TALLIES
  // ==============================================================
  
  console.log('\n📅 Writing year-wise tallies...');
  
  for (const [year, yearData] of Object.entries(globalYearTallies)) {
    // Write year summary
    // ✅ CORRECT
await db.collection('globalTallies').doc('years').collection('yearsList').doc(year.toString()).set({
      year: parseInt(year),
      totalGold: yearData.totalGold,
      totalSilver: yearData.totalSilver,
      totalBronze: yearData.totalBronze,
      totalPoints: yearData.totalPoints,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Write year department tallies
    for (const [deptId, tally] of Object.entries(yearData.departments)) {
      // ✅ CORRECT
await db.collection('globalTallies').doc('years').collection('yearsList').doc(year.toString()).collection('departments')
  .doc(deptId)
        .set({
          ...tally,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    // Write year class tallies
    for (const [classId, tally] of Object.entries(yearData.classes)) {
      await db.collection('globalTallies').doc('years').collection('yearsList').doc(year.toString()).collection('classes')
  .doc(classId)
        .set({
          ...tally,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }
  }

  console.log('   ✅ Year-wise tallies written');
  console.log('\n🎉 All tallies calculated and stored!\n');
}


// ============================================================================
// CLEAN DATABASE (USE WITH CAUTION!)
// ============================================================================

async function cleanDatabase() {
  console.log('🧹 Cleaning database...\n');
  
  const collections = [
    'config',
    'admins',
    'users',
    'eventTypes',
    'currentEditions',
    'teams',
    'registrations'
  ];
  
  for (const collection of collections) {
    const snapshot = await db.collection(collection).get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log(`✅ Cleaned ${collection} (${snapshot.size} docs)`);
  }
  
  console.log('\n✅ Database cleaned!\n');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

const args = process.argv.slice(2);
const command = args[0];

(async () => {
  try {
    if (command === 'clean') {
      await cleanDatabase();
    } else if (command === 'verify') {
      await verifyAllTallies();
    } else if (command === 'calculate') {
      await calculateAllTallies();
      await verifyAllTallies();
    } else if (command === 'seed') {
      await seedDatabase();
      console.log('\n⏳ Calculating all tallies...');
      await calculateAllTallies();
      await verifyAllTallies();
    } else {
      console.log('Usage:');
      console.log('  node test-seed.js seed       - Seed database and calculate all tallies');
      console.log('  node test-seed.js calculate  - Calculate all tallies from existing data');
      console.log('  node test-seed.js verify     - Verify all tallies (event, overall, year-wise)');
      console.log('  node test-seed.js clean      - Clean database (USE WITH CAUTION!)');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();