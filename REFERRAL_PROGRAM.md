# QuackHost Viral Referral Program
**Engineered for Exponential Growth**

Date: 2025-11-16
Version: 1.0
Status: Ready to Build

---

## 🎯 OBJECTIVE

Design a referral program that achieves a **viral coefficient >1.0**, meaning each user brings >1 new user, resulting in exponential growth.

**Goal**: 40% of new signups from referrals by Month 6

**Math**: If viral coefficient = 1.2
- 100 users → 120 new users (1st cycle)
- 120 users → 144 new users (2nd cycle)
- 144 users → 173 new users (3rd cycle)
- **Result**: 10x growth in 12 cycles (3-4 months)

---

## 📊 REFERRAL MECHANICS

### Reward Structure

**For Referrers (People who invite friends)**:
| Milestone | Reward | Value |
|-----------|--------|-------|
| 1 referral | $5 credit | $5 |
| 5 referrals | Free month (Pro plan) | $15 |
| 10 referrals | 3 months free | $45 |
| 25 referrals | Free year | $180 |
| 50 referrals | Free 2 years | $360 |
| 100 referrals | **Lifetime free** | $∞ |

**For Referees (People who get invited)**:
- 20% off first month
- OR Free 1-week trial extension (14 days instead of 7)
- No credit card required to start

**Why This Works**:
1. **Immediate value**: $5 credit for first referral (instant gratification)
2. **Progressive rewards**: Each tier unlocks better rewards (gamification)
3. **Ultimate goal**: Lifetime free = holy grail (aspirational)
4. **Win-win**: Both parties benefit (not zero-sum)

---

## 🔧 TECHNICAL IMPLEMENTATION

### Referral Code Generation

```javascript
// Generate unique referral code for each user
function generateReferralCode(userId) {
  // Format: QUACK-XXXX (e.g., QUACK-J8K2)
  const prefix = 'QUACK';
  const randomPart = generateRandomString(4, 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789');

  return `${prefix}-${randomPart}`;
}

// Alternative: Vanity codes for Pro users
function createVanityCode(username) {
  // Format: QUACK-USERNAME (e.g., QUACK-ALEX)
  return `QUACK-${username.toUpperCase()}`;
}
```

### Referral Tracking System

```javascript
// Database Schema
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id),  -- Person who invited
  referee_id UUID REFERENCES users(id),   -- Person who was invited
  referral_code VARCHAR(20) NOT NULL,
  status VARCHAR(20),  -- pending, qualified, rewarded
  qualified_at TIMESTAMP,  -- When referee became paying customer
  reward_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  reward_type VARCHAR(50),  -- credit, free_month, free_year, lifetime
  reward_value DECIMAL(10,2),
  status VARCHAR(20),  -- pending, applied, expired
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

// Track referral attribution
CREATE TABLE referral_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  referral_code VARCHAR(20),
  source VARCHAR(100),  -- url, social, email, etc.
  clicked_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);
```

### Referral Flow

```javascript
// Step 1: User clicks referral link
// URL: https://quackhost.com/signup?ref=QUACK-J8K2

// Track click
async function trackReferralClick(req) {
  const { ref } = req.query;
  const { ip, userAgent } = req;

  // Store in cookie (30-day expiry)
  res.cookie('referral_code', ref, {
    maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
    httpOnly: true,
    secure: true
  });

  // Track attribution
  await createAttribution({
    referral_code: ref,
    source: req.headers.referer,
    ip_address: ip,
    user_agent: userAgent
  });
}

// Step 2: User signs up
async function handleSignup(userData, req) {
  const referralCode = req.cookies.referral_code;

  // Create user
  const newUser = await createUser(userData);

  // Link referral
  if (referralCode) {
    const referrer = await getUserByReferralCode(referralCode);

    if (referrer) {
      await createReferral({
        referrer_id: referrer.id,
        referee_id: newUser.id,
        referral_code: referralCode,
        status: 'pending'
      });

      // Apply referee discount (20% off first month)
      await applyDiscount(newUser.id, {
        type: 'percentage',
        value: 20,
        duration: 1  // 1 month
      });
    }
  }

  return newUser;
}

// Step 3: Referee converts to paying customer
async function handlePayment(userId, planId) {
  // Process payment
  await processPayment(userId, planId);

  // Check if this user was referred
  const referral = await getReferralByRefereeId(userId);

  if (referral && referral.status === 'pending') {
    // Mark referral as qualified
    await updateReferral(referral.id, {
      status: 'qualified',
      qualified_at: new Date()
    });

    // Reward the referrer
    await rewardReferrer(referral.referrer_id);
  }
}

// Step 4: Distribute rewards
async function rewardReferrer(referrerId) {
  const referrer = await getUser(referrerId);
  const qualifiedReferrals = await getQualifiedReferralsCount(referrerId);

  // Determine reward based on milestone
  let reward;

  if (qualifiedReferrals === 1) {
    reward = { type: 'credit', value: 5 };
  } else if (qualifiedReferrals === 5) {
    reward = { type: 'free_month', value: 15 };
  } else if (qualifiedReferrals === 10) {
    reward = { type: 'free_months', value: 45, months: 3 };
  } else if (qualifiedReferrals === 25) {
    reward = { type: 'free_year', value: 180 };
  } else if (qualifiedReferrals === 100) {
    reward = { type: 'lifetime_free', value: Infinity };
  } else {
    // Default: $5 credit for each referral
    reward = { type: 'credit', value: 5 };
  }

  // Apply reward
  await applyReward(referrerId, reward);

  // Send notification
  await sendEmail(referrer.email, {
    subject: `You earned a reward! (${qualifiedReferrals} referrals)`,
    template: 'referral_reward',
    data: {
      referrals_count: qualifiedReferrals,
      reward: reward,
      next_milestone: getNextMilestone(qualifiedReferrals)
    }
  });
}
```

---

## 🎮 GAMIFICATION MECHANICS

### Referral Dashboard

**Key Elements**:
1. **Referral Link**: Easy to copy, shareable
2. **Referral Stats**:
   - Total invites sent
   - Signups (clicked → signed up)
   - Qualified (signed up → paid)
   - Conversion rate
3. **Progress Bar**: Visual progress to next milestone
4. **Leaderboard**: Top 10 referrers (public or opt-in)
5. **Earnings**: Total credits earned

**UI Mockup**:
```
┌─────────────────────────────────────────────────────┐
│  🦆 Your Referral Dashboard                         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Your Referral Link:                                │
│  ┌────────────────────────────────────────┐         │
│  │ https://quackhost.com/signup?ref=...  │ [Copy] │
│  └────────────────────────────────────────┘         │
│                                                      │
│  Share on: [Twitter] [Discord] [Email]              │
│                                                      │
├─────────────────────────────────────────────────────┤
│  📊 Your Stats                                       │
│                                                      │
│  Invites Sent: 15                                   │
│  Signups: 8 (53% conversion)                        │
│  Qualified: 6 (paid customers)                      │
│  Total Earnings: $30 in credits                     │
│                                                      │
├─────────────────────────────────────────────────────┤
│  🎯 Next Milestone: 10 Referrals (4 to go!)        │
│                                                      │
│  Progress: [████████░░] 60%                         │
│                                                      │
│  Unlock: 3 Months Free ($45 value)                  │
│                                                      │
├─────────────────────────────────────────────────────┤
│  🏆 Leaderboard (This Month)                        │
│                                                      │
│  1. @ServerKing     - 47 referrals                  │
│  2. @MinecraftPro   - 32 referrals                  │
│  3. @GamerHost      - 28 referrals                  │
│  ...                                                 │
│  15. YOU (@username) - 6 referrals                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

### Leaderboard Competition

**Monthly Contests**:
- **Top 3 referrers win**:
  - 1st place: $500 credit + Featured on homepage
  - 2nd place: $250 credit
  - 3rd place: $100 credit

- **Random draw**: Everyone who refers 5+ gets entered (win $50 credit)

**Seasonal Challenges**:
- Summer: "Beach Invasion" - Refer 20 people, win custom merch
- Holiday: "12 Days of Quack" - Daily rewards for referrals

---

## 📣 PROMOTION STRATEGY

### In-App Promotion

**Where to Show Referral CTA**:
1. **After Signup**: "Invite friends, get $5 credit!"
2. **Dashboard**: Persistent banner at top
3. **After Server Creation**: "Love QuackHost? Share with friends!"
4. **Email Signature**: Auto-append referral link
5. **Support Interactions**: After resolving ticket, suggest referral

**Email Campaign**:
- Day 7: "You've been with us for a week! Share the love?"
- Day 30: "Happy 1-month anniversary! Invite friends for rewards"
- Quarterly: "Your referral stats + special bonus this month"

---

### Social Sharing Tools

**Pre-Written Messages** (one-click sharing):

**Twitter/X**:
```
Just launched my game server with @QuackHost!
🦆 Easy setup, great performance, awesome support.

Get 20% off your first month: https://quackhost.com/signup?ref=QUACK-J8K2

#Minecraft #GameServer #QuackHost
```

**Discord**:
```
Hey @everyone! I'm hosting my Minecraft server with QuackHost
and it's been amazing. Super easy setup and really affordable.

If you're thinking about hosting a server, use my link for 20% off:
https://quackhost.com/signup?ref=QUACK-J8K2
```

**Reddit** (community-friendly):
```
For anyone looking for Minecraft server hosting, I've been using
QuackHost for the past month and it's been great. Easy control
panel, good performance, and responsive support.

They have a free trial if you want to test it out: [referral link]
```

**Email Template**:
```
Subject: Check out QuackHost for game server hosting

Hey [Name],

I know you mentioned wanting to start a Minecraft server.
I've been using QuackHost for mine and it's been awesome!

- Super easy to set up (literally 5 minutes)
- Affordable ($5-15/month)
- Great control panel
- Reliable uptime

You can get 20% off your first month with this link:
https://quackhost.com/signup?ref=QUACK-J8K2

Let me know if you have questions!

[Your Name]
```

---

## 📈 OPTIMIZATION & TESTING

### A/B Tests to Run

**Test 1: Referral Reward Amount**:
- **Variant A**: $5 credit per referral
- **Variant B**: $10 credit per referral
- **Metric**: Viral coefficient
- **Hypothesis**: Higher reward → more shares

**Test 2: Referee Incentive**:
- **Variant A**: 20% off first month
- **Variant B**: Free 2-week trial (vs 1 week)
- **Metric**: Referral signup rate
- **Hypothesis**: Free trial extension > discount

**Test 3: Milestone Structure**:
- **Variant A**: Current (1, 5, 10, 25, 100)
- **Variant B**: Lower bar (1, 3, 7, 15, 50)
- **Metric**: Referrals per user
- **Hypothesis**: Achievable goals → more motivation

**Test 4: Social Proof**:
- **Variant A**: Show leaderboard
- **Variant B**: Hide leaderboard
- **Metric**: Referral participation rate
- **Hypothesis**: Competition drives engagement

---

### Key Metrics to Track

**Referral Funnel**:
```
1,000 users see referral dashboard
  ↓ 30% copy referral link (300 users)
    ↓ Each shares with avg 5 people (1,500 impressions)
      ↓ 20% click link (300 clicks)
        ↓ 40% sign up (120 signups)
          ↓ 25% convert to paid (30 customers)

Viral Coefficient = 30 new paying customers / 1,000 users = 0.03

Goal: Increase to 1.0 (each user brings 1+ paying customer)
```

**Key Metrics**:
- **Invitation Rate**: % of users who share link
- **K-factor (Viral Coefficient)**: New users per existing user
- **Referral Conversion Rate**: Clicks → Signups → Paid
- **Time to Qualify**: Days from signup to first payment
- **Fraud Rate**: % of referrals flagged as suspicious

**Targets**:
- Invitation Rate: >30%
- K-factor: >1.0 (exponential growth)
- Referral CVR: >10%
- Time to Qualify: <7 days
- Fraud Rate: <2%

---

## 🚨 FRAUD PREVENTION

### Common Fraud Patterns

1. **Self-Referral**:
   - User creates multiple accounts to refer themselves
   - **Detection**: Same IP, device fingerprint, payment method
   - **Prevention**: Require referee to make payment before reward

2. **Bot/Fake Signups**:
   - Automated signups to game system
   - **Detection**: Unusual signup patterns, disposable emails
   - **Prevention**: CAPTCHA, email verification, phone verification (optional)

3. **Chargeback Abuse**:
   - User pays, referrer gets reward, user chargebacks
   - **Detection**: High chargeback rate for referees
   - **Prevention**: Delay reward payout until chargeback window expires (60 days)

4. **Referral Link Spam**:
   - Posting links in forums/Discord without context
   - **Detection**: Community reports, admin review
   - **Prevention**: Terms of service violation = ban from program

### Fraud Detection System

```javascript
// Fraud scoring algorithm
async function calculateFraudScore(referral) {
  let score = 0;

  // Same IP address
  if (hasSameIP(referral.referrer_id, referral.referee_id)) {
    score += 50;
  }

  // Same payment method
  if (hasSamePaymentMethod(referral.referrer_id, referral.referee_id)) {
    score += 40;
  }

  // Disposable email
  if (isDisposableEmail(referral.referee_email)) {
    score += 30;
  }

  // Suspicious activity pattern
  if (hasUnusualActivityPattern(referral.referee_id)) {
    score += 20;
  }

  // High chargeback rate
  if (hasHighChargebackRate(referral.referrer_id)) {
    score += 60;
  }

  // Decision
  if (score >= 100) {
    await flagReferral(referral.id, 'high_fraud_risk');
    await blockReward(referral.referrer_id);
  } else if (score >= 60) {
    await flagReferral(referral.id, 'medium_fraud_risk');
    await delayReward(referral.referrer_id, 30);  // days
  }

  return score;
}
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Week 1-2: Backend Development
- [ ] Create database schema (referrals, rewards, attribution)
- [ ] Build referral code generation system
- [ ] Implement tracking (clicks, signups, conversions)
- [ ] Build reward distribution logic
- [ ] Set up fraud detection

### Week 3-4: Frontend Development
- [ ] Design referral dashboard UI
- [ ] Build referral link sharing widget
- [ ] Create progress tracking visuals
- [ ] Implement leaderboard
- [ ] Add in-app CTAs for referrals

### Week 5-6: Integration & Testing
- [ ] Integrate with signup flow
- [ ] Integrate with payment system
- [ ] Email notifications (rewards, milestones)
- [ ] Social sharing buttons (Twitter, Discord, email)
- [ ] End-to-end testing

### Week 7-8: Launch & Optimize
- [ ] Soft launch to 100 beta users
- [ ] Monitor metrics, fix bugs
- [ ] Public launch with announcement
- [ ] Run first A/B test
- [ ] Iterate based on data

---

## 🎯 SUCCESS SCENARIOS

### Conservative Scenario (K-factor = 0.5)
- 1,000 users → 500 referrals → 250 paid customers
- **Growth**: 25% from referrals
- **Timeline**: 12 months to double user base

### Target Scenario (K-factor = 1.0)
- 1,000 users → 1,000 referrals → 1,000 paid customers
- **Growth**: 100% from referrals (sustainable growth)
- **Timeline**: 6 months to double user base

### Optimistic Scenario (K-factor = 1.5)
- 1,000 users → 1,500 referrals → 1,500 paid customers
- **Growth**: 150% from referrals (**exponential growth**)
- **Timeline**: 3 months to double, 9 months to 10x

**If we hit K=1.5**:
- Month 1: 100 users
- Month 2: 250 users (2.5x)
- Month 3: 625 users (6.25x)
- Month 4: 1,563 users (15.6x)
- Month 6: 9,766 users (97x!)

---

## 💰 COST-BENEFIT ANALYSIS

### Program Costs

**Rewards Given Out** (assume 1,000 qualified referrals):
- 1,000 × $5 credit = $5,000
- 200 × Free month ($15) = $3,000
- 100 × 3 months free ($45) = $4,500
- 40 × Free year ($180) = $7,200
- 10 × Lifetime free (est. $500) = $5,000
- **Total Rewards**: ~$25,000

**Development & Operations**:
- Engineering time: $10,000
- Fraud prevention: $2,000/month
- Support overhead: $1,000/month
- **Total Dev/Ops**: ~$20,000 first year

**Total Program Cost**: $45,000/year

### Program Benefits

**Revenue from Referred Customers**:
- 1,000 referred customers
- $15 ARPU/month
- 12-month average retention
- **Gross Revenue**: $180,000/year

**Less Rewards**: -$25,000
**Less Ops**: -$20,000
**Net Revenue**: $135,000/year

**ROI**: 3.0x (300% return)

---

## 🎬 CONCLUSION

A well-designed referral program is the **cheapest and most sustainable** growth channel:

- **Lower CAC**: $0-5 vs $25-40 for paid ads
- **Higher LTV**: Referred customers stay 2x longer (trust factor)
- **Compounding Growth**: Each cohort brings new cohorts
- **Brand Building**: Word-of-mouth creates authenticity

**Timeline**: Build in 8 weeks, launch in Month 3, achieve K>1.0 by Month 6

**Investment**: $30k development + $25k rewards = $55k total

**Return**: $135k net revenue in Year 1 (2.5x ROI)

---

**Next Action**: Start building referral dashboard THIS WEEK. Test with beta users in 4 weeks. 🚀

