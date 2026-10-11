import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

async function seed() {
  console.log('🌱 Seeding Skill Exchange Platform database...');

  const salt = await bcrypt.genSalt(10);
  const studentPasswordHash = await bcrypt.hash('student123', salt);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);

  const users = [
    {
      _id: 'user_admin',
      name: 'System Administrator',
      email: 'admin@skillexchange.edu',
      passwordHash: adminPasswordHash,
      university: 'Skill Exchange University',
      bio: 'Platform safety, skill taxonomy, and community administrator.',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
      role: 'admin',
      isSuspended: false,
      offeredSkills: [],
      desiredSkills: [],
      hoursTaught: 0,
      hoursLearned: 0,
      trustScore: 5.0,
      totalReviews: 0,
      badges: ['Platform Admin'],
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      _id: 'user_aarav',
      name: 'Aarav Patel',
      email: 'aarav@skillexchange.edu',
      passwordHash: studentPasswordHash,
      university: 'Tech Institute of Science',
      bio: 'Computer Science senior passionate about AI, backend APIs, and Python. Looking to upskill in visual and UI/UX design for personal projects.',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav',
      role: 'student',
      isSuspended: false,
      offeredSkills: [
        { name: 'Python', category: 'Programming', proficiency: 'Advanced', description: 'Data analysis, pandas, Flask/FastAPI, script automation.' },
        { name: 'Machine Learning', category: 'Data Science', proficiency: 'Intermediate', description: 'Scikit-learn, classification models, neural network basics.' }
      ],
      desiredSkills: [
        { name: 'UI/UX Design', category: 'Design', goal: 'Design clean mobile and web wireframes' },
        { name: 'Figma', category: 'Design', goal: 'Master component libraries and interactive prototypes' }
      ],
      availability: {
        weekdays: ['Evening (6:00 PM - 8:00 PM)'],
        weekends: ['Morning (10:00 AM - 1:00 PM)']
      },
      hoursTaught: 6.5,
      hoursLearned: 4.0,
      trustScore: 4.9,
      totalReviews: 4,
      badges: ['Knowledge Mentor', 'Reciprocal Champion', 'First Exchange'],
      createdAt: '2026-02-10T10:00:00.000Z'
    },
    {
      _id: 'user_maya',
      name: 'Maya Chen',
      email: 'maya@skillexchange.edu',
      passwordHash: studentPasswordHash,
      university: 'School of Design & Arts',
      bio: 'Graphic and product design major. I love crafting intuitive digital experiences. Excited to learn Python scripting to automate design tokens!',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Maya',
      role: 'student',
      isSuspended: false,
      offeredSkills: [
        { name: 'UI/UX Design', category: 'Design', proficiency: 'Expert', description: 'User personas, heuristic evaluations, responsive layouts.' },
        { name: 'Figma', category: 'Design', proficiency: 'Advanced', description: 'Auto-layout, responsive tokens, interactive high-fidelity mocks.' },
        { name: 'Graphic Design', category: 'Creative', proficiency: 'Advanced', description: 'Brand identity, typography, Photoshop & Illustrator.' }
      ],
      desiredSkills: [
        { name: 'Python', category: 'Programming', goal: 'Learn syntax and scripting for data processing' },
        { name: 'Web Development', category: 'Programming', goal: 'HTML/CSS/JS fundamentals for creative coders' }
      ],
      availability: {
        weekdays: ['Evening (6:00 PM - 8:00 PM)'],
        weekends: ['Afternoon (2:00 PM - 5:00 PM)']
      },
      hoursTaught: 8.0,
      hoursLearned: 5.5,
      trustScore: 5.0,
      totalReviews: 6,
      badges: ['Master Educator', '5-Star Peer', 'Reciprocal Champion'],
      createdAt: '2026-02-12T14:30:00.000Z'
    },
    {
      _id: 'user_liam',
      name: 'Liam Smith',
      email: 'liam@skillexchange.edu',
      passwordHash: studentPasswordHash,
      university: 'Metro Engineering College',
      bio: 'Full-stack developer building modern React apps. Planning to study abroad in Spain next semester and eager to practice conversational Spanish!',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Liam',
      role: 'student',
      isSuspended: false,
      offeredSkills: [
        { name: 'React.js', category: 'Programming', proficiency: 'Advanced', description: 'Hooks, state management, Tailwind, full-stack SPAs.' },
        { name: 'JavaScript', category: 'Programming', proficiency: 'Advanced', description: 'ES6+, async/await, DOM manipulation, clean code.' },
        { name: 'Node.js', category: 'Backend', proficiency: 'Intermediate', description: 'Express REST APIs, middleware, authentication.' }
      ],
      desiredSkills: [
        { name: 'Spanish', category: 'Languages', goal: 'Conversational fluency and travel phrases' },
        { name: 'French', category: 'Languages', goal: 'Pronunciation and beginner vocabulary' }
      ],
      availability: {
        weekdays: ['Afternoon (4:00 PM - 6:00 PM)'],
        weekends: ['Morning (10:00 AM - 1:00 PM)']
      },
      hoursTaught: 5.0,
      hoursLearned: 3.0,
      trustScore: 4.8,
      totalReviews: 3,
      badges: ['Knowledge Mentor', 'First Exchange'],
      createdAt: '2026-02-15T09:15:00.000Z'
    },
    {
      _id: 'user_sofia',
      name: 'Sofia Rodriguez',
      email: 'sofia@skillexchange.edu',
      passwordHash: studentPasswordHash,
      university: 'Department of Modern Languages',
      bio: 'Native Spanish speaker and literature student. Wanting to learn React and modern web development to build an online interactive digital library.',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sofia',
      role: 'student',
      isSuspended: false,
      offeredSkills: [
        { name: 'Spanish', category: 'Languages', proficiency: 'Expert', description: 'Native conversation, grammar, business & cultural contexts.' },
        { name: 'Creative Writing', category: 'Writing', proficiency: 'Advanced', description: 'Storytelling, essay structure, editing.' }
      ],
      desiredSkills: [
        { name: 'React.js', category: 'Programming', goal: 'Building personal portfolio and interactive reading website' },
        { name: 'JavaScript', category: 'Programming', goal: 'Fundamental web programming' }
      ],
      availability: {
        weekdays: ['Afternoon (4:00 PM - 6:00 PM)'],
        weekends: ['Morning (10:00 AM - 1:00 PM)']
      },
      hoursTaught: 7.0,
      hoursLearned: 6.0,
      trustScore: 5.0,
      totalReviews: 5,
      badges: ['Knowledge Mentor', '5-Star Peer', 'Reciprocal Champion'],
      createdAt: '2026-02-18T11:00:00.000Z'
    },
    {
      _id: 'user_elena',
      name: 'Elena Rostova',
      email: 'elena@skillexchange.edu',
      passwordHash: studentPasswordHash,
      university: 'Polytechnic Institute',
      bio: 'Competitive programmer and C++ enthusiast. Preparing for conference presentations and seeking guidance on public speaking and stage presence.',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Elena',
      role: 'student',
      isSuspended: false,
      offeredSkills: [
        { name: 'Data Structures & Algorithms', category: 'Programming', proficiency: 'Expert', description: 'Trees, graphs, dynamic programming, time-complexity analysis.' },
        { name: 'C++', category: 'Programming', proficiency: 'Advanced', description: 'STL, memory management, low-level optimization.' }
      ],
      desiredSkills: [
        { name: 'Public Speaking', category: 'Communication', goal: 'Overcome stage anxiety and structure speech slides' }
      ],
      availability: {
        weekdays: ['Evening (6:00 PM - 8:00 PM)'],
        weekends: ['Weekend Anytime']
      },
      hoursTaught: 4.0,
      hoursLearned: 2.0,
      trustScore: 4.9,
      totalReviews: 2,
      badges: ['Knowledge Mentor', 'First Exchange'],
      createdAt: '2026-02-20T16:45:00.000Z'
    },
    {
      _id: 'user_marcus',
      name: 'Marcus Johnson',
      email: 'marcus@skillexchange.edu',
      passwordHash: studentPasswordHash,
      university: 'School of Communications',
      bio: 'Collegiate debate captain. I help students structure persuasive arguments and speak with confidence. Wanting to learn Algorithms for tech interviews.',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Marcus',
      role: 'student',
      isSuspended: false,
      offeredSkills: [
        { name: 'Public Speaking', category: 'Communication', proficiency: 'Expert', description: 'Vocal modulation, body language, pitching, debate rebuttals.' }
      ],
      desiredSkills: [
        { name: 'Data Structures & Algorithms', category: 'Programming', goal: 'Prepare for technical internship rounds' },
        { name: 'Python', category: 'Programming', goal: 'LeetCode practice' }
      ],
      availability: {
        weekdays: ['Evening (6:00 PM - 8:00 PM)'],
        weekends: ['Weekend Anytime']
      },
      hoursTaught: 9.0,
      hoursLearned: 4.5,
      trustScore: 4.9,
      totalReviews: 4,
      badges: ['Master Educator', 'Reciprocal Champion'],
      createdAt: '2026-02-22T08:30:00.000Z'
    }
  ];

  const requests = [
    {
      _id: 'req_1',
      senderId: 'user_aarav',
      receiverId: 'user_maya',
      requestedSkill: 'Figma',
      offeredSkill: 'Python',
      message: 'Hey Maya! I saw you want to learn Python scripting. I would love to teach you Python in exchange for Figma auto-layout tips!',
      proposedDate: '2026-10-15T18:00:00.000Z',
      status: 'accepted',
      createdAt: '2026-10-01T12:00:00.000Z'
    },
    {
      _id: 'req_2',
      senderId: 'user_marcus',
      receiverId: 'user_elena',
      requestedSkill: 'Data Structures & Algorithms',
      offeredSkill: 'Public Speaking',
      message: 'Hi Elena! I can help you hone your tech conference presentation if you can guide me through binary search and graph algorithms.',
      proposedDate: '2026-10-16T19:00:00.000Z',
      status: 'pending',
      createdAt: '2026-10-08T15:20:00.000Z'
    }
  ];

  const sessions = [
    {
      _id: 'sess_1',
      requestId: 'req_1',
      mentorId: 'user_maya',
      learnerId: 'user_aarav',
      skillName: 'Figma Design System & Auto-Layout',
      reciprocalSkill: 'Python Automation',
      scheduledStartTime: '2026-10-05T18:00:00.000Z',
      durationMinutes: 60,
      meetingUrl: 'https://meet.jit.si/skill-swap-figma-aarav-maya',
      status: 'completed',
      mentorConfirmed: true,
      learnerConfirmed: true,
      createdAt: '2026-10-01T12:05:00.000Z'
    },
    {
      _id: 'sess_2',
      requestId: 'req_1',
      mentorId: 'user_aarav',
      learnerId: 'user_maya',
      skillName: 'Python for Design Automation',
      reciprocalSkill: 'Figma',
      scheduledStartTime: '2026-10-07T18:00:00.000Z',
      durationMinutes: 60,
      meetingUrl: 'https://meet.jit.si/skill-swap-python-maya-aarav',
      status: 'completed',
      mentorConfirmed: true,
      learnerConfirmed: true,
      createdAt: '2026-10-01T12:05:00.000Z'
    },
    {
      _id: 'sess_3',
      requestId: 'req_custom_1',
      mentorId: 'user_sofia',
      learnerId: 'user_liam',
      skillName: 'Conversational Spanish (Intermediate)',
      reciprocalSkill: 'React.js',
      scheduledStartTime: '2026-10-14T16:30:00.000Z',
      durationMinutes: 60,
      meetingUrl: 'https://meet.jit.si/skill-swap-spanish-liam-sofia',
      status: 'scheduled',
      mentorConfirmed: false,
      learnerConfirmed: false,
      createdAt: '2026-10-09T09:00:00.000Z'
    }
  ];

  const reviews = [
    {
      _id: 'rev_1',
      sessionId: 'sess_1',
      reviewerId: 'user_aarav',
      reviewerName: 'Aarav Patel',
      revieweeId: 'user_maya',
      skillName: 'Figma Design System & Auto-Layout',
      rating: 5,
      comment: 'Maya was incredible! She broke down Figma auto-layout and nested components with great real-world examples. 10/10 mentor!',
      aspects: ['Clear Explanations', 'Super Patient', 'Inspiring Examples'],
      createdAt: '2026-10-05T19:15:00.000Z'
    },
    {
      _id: 'rev_2',
      sessionId: 'sess_2',
      reviewerId: 'user_maya',
      reviewerName: 'Maya Chen',
      revieweeId: 'user_aarav',
      skillName: 'Python for Design Automation',
      rating: 5,
      comment: 'Aarav made Python feel so approachable. We wrote a quick script to organize my SVG assets in just one hour.',
      aspects: ['Practical Focus', 'Great Problem Solver', 'Well Prepared'],
      createdAt: '2026-10-07T19:20:00.000Z'
    }
  ];

  const notifications = [
    {
      _id: 'notif_1',
      userId: 'user_aarav',
      title: 'Session Completed!',
      message: 'Your Python session with Maya Chen was completed. 1 hour credited to your teaching record.',
      type: 'session',
      link: '/sessions',
      read: true,
      createdAt: '2026-10-07T19:00:00.000Z'
    },
    {
      _id: 'notif_2',
      userId: 'user_elena',
      title: 'New Skill Exchange Request! 🎉',
      message: 'Marcus Johnson sent you a request for Data Structures & Algorithms.',
      type: 'request',
      link: '/requests',
      read: false,
      createdAt: '2026-10-08T15:20:00.000Z'
    }
  ];

  const reports = [
    {
      _id: 'rep_1',
      reporterId: 'user_marcus',
      reporterName: 'Marcus Johnson',
      targetUserId: 'user_spam_test',
      sessionId: '',
      reason: 'Spam promotional messages',
      details: 'Sent unsolicited crypto links in request message.',
      status: 'pending',
      createdAt: '2026-10-09T11:00:00.000Z'
    }
  ];

  const database = {
    users,
    requests,
    sessions,
    reviews,
    notifications,
    reports
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), 'utf-8');
  console.log('✅ Database successfully seeded with 7 users, requests, sessions, reviews, and notifications!');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
