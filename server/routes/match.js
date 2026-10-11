import express from 'express';
import { Users } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper to normalize skill names for loose matching (e.g., "python", "Python 3", "react", "React.js")
const normalizeSkill = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const skillMatches = (skillA, skillB) => {
  const normA = normalizeSkill(skillA);
  const normB = normalizeSkill(skillB);
  if (!normA || !normB) return false;
  return normA === normB || normA.includes(normB) || normB.includes(normA);
};

// Calculate schedule overlap score
const checkScheduleOverlap = (availA = {}, availB = {}) => {
  let overlapCount = 0;
  const daysA = [...(availA.weekdays || []), ...(availA.weekends || [])];
  const daysB = [...(availB.weekdays || []), ...(availB.weekends || [])];
  for (const slotA of daysA) {
    if (daysB.some(slotB => slotB.toLowerCase() === slotA.toLowerCase())) {
      overlapCount++;
    }
  }
  return overlapCount > 0 ? 5 : 0;
};

// 1. Reciprocal 2-Way Matchmaker
router.get('/reciprocal', authMiddleware, (req, res) => {
  try {
    const currentUser = Users.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const myOffered = currentUser.offeredSkills || [];
    const myDesired = currentUser.desiredSkills || [];

    const otherUsers = Users.find(u => u._id !== currentUser._id && !u.isSuspended);
    const matches = [];

    for (const partner of otherUsers) {
      const partnerOffered = partner.offeredSkills || [];
      const partnerDesired = partner.desiredSkills || [];

      // Check if partner teaches what I want
      const theyCanTeachMe = [];
      for (const want of myDesired) {
        const wantName = typeof want === 'string' ? want : want.name;
        for (const offer of partnerOffered) {
          const offerName = typeof offer === 'string' ? offer : offer.name;
          if (skillMatches(wantName, offerName)) {
            theyCanTeachMe.push(offer);
          }
        }
      }

      // Check if I can teach what partner wants
      const iCanTeachThem = [];
      for (const myOffer of myOffered) {
        const myOfferName = typeof myOffer === 'string' ? myOffer : myOffer.name;
        for (const partnerWant of partnerDesired) {
          const partnerWantName = typeof partnerWant === 'string' ? partnerWant : partnerWant.name;
          if (skillMatches(myOfferName, partnerWantName)) {
            iCanTeachThem.push(myOffer);
          }
        }
      }

      const isReciprocal = theyCanTeachMe.length > 0 && iCanTeachThem.length > 0;
      const isOneWay = theyCanTeachMe.length > 0 && iCanTeachThem.length === 0;

      if (isReciprocal || isOneWay) {
        // Calculate match percentage score
        let score = isReciprocal ? 75 : 45;

        // Trust score boost (up to 15 points)
        const trust = partner.trustScore || 5.0;
        score += Math.min(15, Math.round((trust / 5) * 15));

        // Schedule overlap
        score += checkScheduleOverlap(currentUser.availability, partner.availability);

        // Experience/proficiency boost
        const topProficiency = theyCanTeachMe[0]?.proficiency || 'Intermediate';
        if (topProficiency === 'Expert') score += 5;
        if (topProficiency === 'Advanced') score += 4;
        if (topProficiency === 'Intermediate') score += 2;

        score = Math.min(100, score);

        const partnerSafe = { ...partner };
        delete partnerSafe.passwordHash;

        matches.push({
          partner: partnerSafe,
          isReciprocal,
          matchScore: score,
          theyTeachYou: theyCanTeachMe,
          youTeachThem: iCanTeachThem
        });
      }
    }

    // Sort by reciprocal first, then match score descending
    matches.sort((a, b) => {
      if (a.isReciprocal && !b.isReciprocal) return -1;
      if (!a.isReciprocal && b.isReciprocal) return 1;
      return b.matchScore - a.matchScore;
    });

    res.json(matches);
  } catch (err) {
    console.error('Match error:', err);
    res.status(500).json({ message: 'Error computing matches' });
  }
});

// 2. Explore / Search All Mentors & Skills
router.get('/explore', (req, res) => {
  try {
    const { search = '', category = '', proficiency = '' } = req.query;
    const users = Users.find(u => !u.isSuspended);

    let results = [];

    users.forEach(u => {
      const offered = u.offeredSkills || [];
      offered.forEach(skill => {
        const skillName = typeof skill === 'string' ? skill : skill.name;
        const skillCategory = skill.category || 'General';
        const skillProficiency = skill.proficiency || 'Intermediate';

        let matchesSearch = true;
        let matchesCategory = true;
        let matchesProficiency = true;

        if (search) {
          const q = search.toLowerCase();
          matchesSearch = skillName.toLowerCase().includes(q) ||
            (u.name && u.name.toLowerCase().includes(q)) ||
            (u.bio && u.bio.toLowerCase().includes(q));
        }

        if (category && category !== 'All') {
          matchesCategory = skillCategory.toLowerCase() === category.toLowerCase();
        }

        if (proficiency && proficiency !== 'All') {
          matchesProficiency = skillProficiency.toLowerCase() === proficiency.toLowerCase();
        }

        if (matchesSearch && matchesCategory && matchesProficiency) {
          const userSafe = { ...u };
          delete userSafe.passwordHash;

          results.push({
            skill: {
              name: skillName,
              category: skillCategory,
              proficiency: skillProficiency,
              description: skill.description || ''
            },
            mentor: userSafe
          });
        }
      });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error exploring skills' });
  }
});

export default router;
