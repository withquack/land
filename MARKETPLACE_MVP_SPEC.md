# Marketplace MVP Specification
## QuackHost Creator Economy Platform

**Version:** 1.0
**Target Launch:** Q1 2025 (Week 5-6)
**Team:** 4 engineers, 1 designer, 1 community manager

---

## Vision

Transform QuackHost into a two-sided marketplace where mod creators, plugin developers, and map makers can monetize their work while server owners discover and easily install quality content.

**Thesis:** Game server owners spend 60% of their time finding, downloading, and configuring mods/plugins. Creators have no good way to monetize their work. QuackHost Marketplace solves both problems.

---

## Success Metrics (90 days post-launch)

| Metric | Target | Stretch Goal |
|--------|--------|--------------|
| Gross Merchandise Value (GMV) | $15,000 | $30,000 |
| Items Listed | 100+ | 200+ |
| Active Creators | 20 | 50 |
| Buyer Conversion Rate | 25% | 40% |
| Average Transaction | $5 | $8 |
| QuackHost Revenue (30%) | $4,500 | $9,000 |

---

## User Personas

### Persona 1: Content Creator "Sarah"
- **Background:** Makes Minecraft plugins as a hobby, has 5K downloads on Spigot
- **Pain Points:** No monetization, users expect free support, hard to build audience
- **Goals:** Earn $500-1000/month from plugins, get feedback from paying users
- **Why Marketplace:** Built-in distribution, payment processing, QuackHost handles hosting

### Persona 2: Server Owner "Mike"
- **Background:** Runs a 50-player Minecraft server, spends $40/month on hosting
- **Pain Points:** Wastes hours finding good plugins, manual installation, compatibility issues
- **Goals:** Professional server setup in < 1 hour, reliable content that "just works"
- **Why Marketplace:** One-click install, curated quality, integrated with QuackHost

---

## MVP Feature Set

### Phase 1: Core Marketplace (Weeks 1-2)

#### For Creators
1. **Creator Application**
   - Simple form: name, email, PayPal/Stripe account
   - Auto-approval for verified emails
   - Manual review for new accounts

2. **Upload Interface**
   - Drag & drop file upload
   - Required fields:
     - Name
     - Description (Markdown supported)
     - Category (Mod, Plugin, Map, Texture Pack, Config)
     - Game type
     - Compatible versions
     - Price (free or $1-99)
   - Optional fields:
     - Screenshots (up to 5)
     - Video URL
     - GitHub link
     - Installation instructions

3. **Creator Dashboard**
   - Sales graph (last 30 days)
   - Earnings (total, this month)
   - Download count
   - Reviews & ratings
   - Payout status

#### For Buyers
1. **Browse Interface**
   - Grid view of items (card layout)
   - Filters:
     - Game type
     - Category
     - Price (Free, Paid, Under $5, $5-$20, $20+)
     - Rating (4+ stars, 3+, All)
     - Compatibility (game version)
   - Sort by:
     - Newest
     - Most Downloaded
     - Highest Rated
     - Price (Low to High, High to Low)

2. **Item Detail Page**
   - Hero image/screenshot
   - Description
   - Screenshots gallery
   - Installation instructions
   - Compatibility information
   - Reviews & ratings section
   - Related items
   - Creator profile link
   - "Buy Now" or "Free Download" button

3. **Purchase Flow**
   - Add to cart
   - Checkout (Stripe integration)
   - Instant download after payment
   - Receipt via email

4. **Installation**
   - **Manual**: Download .zip → upload to server via QuackPlane file manager
   - **Automatic (v1.1)**: One-click install to selected server
   - Installation guide displayed after purchase

#### Admin/Moderation
1. **Content Review Queue**
   - All items require approval before going live
   - Review checklist:
     - No malware (virus scan)
     - No stolen content
     - No inappropriate content
     - Actually works as described
   - Approve/Reject with feedback

2. **Analytics Dashboard**
   - Total GMV
   - Top-selling items
   - Top creators
   - Conversion funnel
   - Revenue by category

---

### Technical Implementation

#### Backend API Endpoints
```typescript
// Creator Management
POST   /api/v1/marketplace/apply         // Apply to become creator
GET    /api/v1/marketplace/creator/me    // Get creator profile
PATCH  /api/v1/marketplace/creator/me    // Update creator profile

// Item Management
GET    /api/v1/marketplace/items         // List all items (public)
GET    /api/v1/marketplace/items/:id     // Get item details (public)
POST   /api/v1/marketplace/items         // Create new item (creators only)
PATCH  /api/v1/marketplace/items/:id     // Update item (creator only)
DELETE /api/v1/marketplace/items/:id     // Delete item (creator only)

// Purchases
POST   /api/v1/marketplace/purchase      // Purchase an item
GET    /api/v1/marketplace/purchases     // List my purchases
GET    /api/v1/marketplace/download/:id  // Download purchased item

// Reviews
GET    /api/v1/marketplace/items/:id/reviews    // Get reviews for item
POST   /api/v1/marketplace/items/:id/reviews    // Create review
PATCH  /api/v1/marketplace/reviews/:id          // Update review
DELETE /api/v1/marketplace/reviews/:id          // Delete review

// Creator Earnings
GET    /api/v1/marketplace/earnings              // Get earnings
POST   /api/v1/marketplace/payout                // Request payout
```

#### Database Schema
```sql
-- Creators
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  website_url VARCHAR(500),
  github_url VARCHAR(500),
  payout_method VARCHAR(20) DEFAULT 'stripe', -- stripe, paypal
  payout_email VARCHAR(255) NOT NULL,
  stripe_account_id VARCHAR(255),
  paypal_email VARCHAR(255),
  total_earnings_cents INTEGER DEFAULT 0,
  pending_earnings_cents INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Items (already defined in architecture, adding a few fields)
ALTER TABLE marketplace_items ADD COLUMN installation_guide TEXT;
ALTER TABLE marketplace_items ADD COLUMN screenshots JSONB DEFAULT '[]'; -- array of image URLs
ALTER TABLE marketplace_items ADD COLUMN video_url VARCHAR(500);
ALTER TABLE marketplace_items ADD COLUMN demo_url VARCHAR(500);

-- Purchases (already defined)

-- Earnings & Payouts
CREATE TABLE creator_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id),
  purchase_id UUID REFERENCES marketplace_purchases(id),
  amount_cents INTEGER NOT NULL, -- 70% of purchase price
  platform_fee_cents INTEGER NOT NULL, -- 30% of purchase price
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, refunded
  payout_id UUID REFERENCES creator_payouts(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE creator_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id),
  amount_cents INTEGER NOT NULL,
  method VARCHAR(20), -- stripe, paypal
  transaction_id VARCHAR(255), -- Stripe/PayPal transaction ID
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
  requested_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

#### File Storage
```typescript
/**
 * S3 bucket structure for marketplace files
 */
const S3_BUCKET = 'quackhost-marketplace'

const fileStructure = {
  // Item files (protected, download requires purchase verification)
  'items/{item_id}/{version}/{filename}': 'actual mod/plugin files',

  // Screenshots (public)
  'screenshots/{item_id}/{uuid}.{ext}': 'item screenshots',

  // Avatars (public)
  'avatars/{creator_id}/{uuid}.{ext}': 'creator avatars',

  // Thumbnails (public, generated)
  'thumbnails/{item_id}/{size}/{uuid}.{ext}': 'generated thumbnails'
}

/**
 * Download authentication
 */
async function generateDownloadURL(itemId: string, userId: string): Promise<string> {
  // Verify purchase
  const purchase = await db.query(
    'SELECT * FROM marketplace_purchases WHERE item_id = $1 AND buyer_id = $2',
    [itemId, userId]
  )

  if (!purchase) {
    throw new Error('Item not purchased')
  }

  // Generate signed URL (expires in 1 hour)
  const item = await db.query('SELECT * FROM marketplace_items WHERE id = $1', [itemId])
  const s3Url = await s3.getSignedUrl('getObject', {
    Bucket: S3_BUCKET,
    Key: `items/${itemId}/${item.version}/${item.filename}`,
    Expires: 3600 // 1 hour
  })

  return s3Url
}
```

#### Payment Processing
```typescript
/**
 * Stripe integration for marketplace purchases
 */
class MarketplacePayments {
  private stripe: Stripe

  async purchaseItem(itemId: string, userId: string): Promise<Purchase> {
    const item = await this.getItem(itemId)
    const user = await this.getUser(userId)

    // Create Stripe Payment Intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: item.price_cents,
      currency: 'usd',
      customer: user.stripe_customer_id,
      metadata: {
        item_id: itemId,
        user_id: userId,
        type: 'marketplace_purchase'
      },
      application_fee_amount: Math.floor(item.price_cents * 0.3) // 30% platform fee
    })

    // Record purchase (pending until payment confirms)
    const purchase = await db.insert('marketplace_purchases', {
      item_id: itemId,
      buyer_id: userId,
      price_paid_cents: item.price_cents,
      stripe_payment_id: paymentIntent.id,
      status: 'pending'
    })

    return purchase
  }

  async handlePaymentSuccess(paymentIntentId: string): Promise<void> {
    // Update purchase status
    await db.update(
      'marketplace_purchases',
      { stripe_payment_id: paymentIntentId },
      { status: 'completed', purchased_at: new Date() }
    )

    // Create creator earning
    const purchase = await db.query(
      'SELECT * FROM marketplace_purchases WHERE stripe_payment_id = $1',
      [paymentIntentId]
    )

    const item = await this.getItem(purchase.item_id)
    const creatorShare = Math.floor(purchase.price_paid_cents * 0.7) // 70% to creator
    const platformFee = purchase.price_paid_cents - creatorShare // 30% to platform

    await db.insert('creator_earnings', {
      creator_id: item.creator_id,
      purchase_id: purchase.id,
      amount_cents: creatorShare,
      platform_fee_cents: platformFee,
      status: 'pending'
    })

    // Send confirmation email
    await this.sendPurchaseConfirmation(purchase)
  }

  async processCreatorPayout(creatorId: string): Promise<void> {
    // Get all pending earnings
    const earnings = await db.query(
      'SELECT * FROM creator_earnings WHERE creator_id = $1 AND status = \'pending\'',
      [creatorId]
    )

    const totalCents = earnings.reduce((sum, e) => sum + e.amount_cents, 0)

    // Minimum payout: $50
    if (totalCents < 5000) {
      throw new Error('Minimum payout is $50')
    }

    const creator = await this.getCreator(creatorId)

    // Create Stripe transfer
    const transfer = await this.stripe.transfers.create({
      amount: totalCents,
      currency: 'usd',
      destination: creator.stripe_account_id,
      description: `QuackHost Marketplace earnings - ${earnings.length} sales`
    })

    // Record payout
    const payout = await db.insert('creator_payouts', {
      creator_id: creatorId,
      amount_cents: totalCents,
      method: 'stripe',
      transaction_id: transfer.id,
      status: 'completed',
      completed_at: new Date()
    })

    // Update earnings status
    await db.update(
      'creator_earnings',
      { creator_id: creatorId, status: 'pending' },
      { status: 'paid', payout_id: payout.id }
    )
  }
}
```

---

### UI/UX Design

#### Browse Page Wireframe
```
┌─────────────────────────────────────────────────────┐
│  QuackHost Marketplace                    [Search]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Filters ▼               Sort: Most Downloaded ▼    │
│  ┌────────────┐                                     │
│  │ Game Type  │         ┌──────┐ ┌──────┐ ┌──────┐│
│  │ □ Minecraft│         │      │ │      │ │      ││
│  │ □ Terraria │         │ Mod  │ │ Mod  │ │ Mod  ││
│  │ □ Valheim  │         │ Name │ │ Name │ │ Name ││
│  │            │         │ ★4.5 │ │ ★4.8 │ │ ★4.2 ││
│  │ Category   │         │ $5   │ │ FREE │ │ $12  ││
│  │ □ Mods     │         └──────┘ └──────┘ └──────┘│
│  │ □ Plugins  │                                     │
│  │ □ Maps     │         ┌──────┐ ┌──────┐ ┌──────┐│
│  │            │         │      │ │      │ │      ││
│  │ Price      │         │ Map  │ │Plugin│ │Config││
│  │ □ Free     │         │ Name │ │ Name │ │ Name ││
│  │ □ Paid     │         │ ★4.9 │ │ ★4.1 │ │ ★5.0 ││
│  │ □ Under $5 │         │ $15  │ │ $3   │ │ FREE ││
│  │            │         └──────┘ └──────┘ └──────┘│
│  └────────────┘                                     │
│                     [Load More]                     │
└─────────────────────────────────────────────────────┘
```

#### Item Detail Page
```
┌─────────────────────────────────────────────────────┐
│  ← Back to Marketplace                              │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐                               │
│  │                  │  Epic Survival Plugin          │
│  │   Hero Image     │  by CreatorName                │
│  │                  │  ★★★★★ 4.8 (124 reviews)       │
│  │                  │                                │
│  └──────────────────┘  $8.99  [Purchase Now]        │
│                                                      │
│  [Screenshot] [Screenshot] [Screenshot]             │
│                                                      │
│  Description                                         │
│  ─────────────────────────────────────────────────  │
│  This plugin adds advanced survival mechanics...    │
│                                                      │
│  Features                                            │
│  • Custom crafting recipes                          │
│  • Temperature system                               │
│  • Seasonal events                                  │
│                                                      │
│  Installation                                        │
│  1. Download the .jar file                          │
│  2. Upload to /plugins/ directory                   │
│  3. Restart server                                  │
│                                                      │
│  Compatible with: Minecraft 1.19, 1.20              │
│                                                      │
│  Reviews                                             │
│  ─────────────────────────────────────────────────  │
│  ★★★★★ "Amazing plugin!" - User123                  │
│  Best survival plugin I've used. Worth every penny! │
│                                                      │
│  ★★★★☆ "Great but needs..." - ServerOwner           │
│  Really good overall, would love to see...          │
│                                                      │
│  [Write a Review]                                   │
└─────────────────────────────────────────────────────┘
```

---

## Content Moderation

### Approval Process
1. Creator uploads item → Status: "Pending Review"
2. Automated checks run:
   - Virus scan (ClamAV)
   - File type validation
   - Size limits (max 100MB)
3. Manual review by QuackHost team:
   - Does it work as described?
   - Is it original content (not stolen)?
   - Is pricing reasonable?
   - Screenshots/description accurate?
4. Approve → Status: "Live" or Reject → Email creator with feedback

### Quality Standards
**Auto-Reject If:**
- Contains malware/viruses
- File size > 100MB
- Not a valid mod/plugin file
- Explicit/offensive content

**Manual Review Required For:**
- First-time creators
- Price > $20
- Controversial content (weapons, violence themes)

### Post-Launch Moderation
- User reports (spam, malware, stolen content)
- Review flagging (inappropriate reviews)
- Creator appeals for rejected items

---

## Creator Onboarding

### Day 1: Application
1. Creator clicks "Become a Creator"
2. Fills out form:
   - Display name
   - Bio
   - PayPal/Stripe account
   - Agree to Creator Terms (70/30 split, etc.)
3. Email verification
4. Auto-approval if email matches existing GitHub/known creator

### Day 2-3: First Upload
1. Email: "Welcome to QuackHost Marketplace"
2. Link to creator dashboard
3. Guided upload flow with tips:
   - "Add screenshots to increase sales by 3x"
   - "Items with videos get 50% more views"
   - "Free items build your reputation"
4. Submit for review

### Day 4-5: Going Live
1. Email: "Your item is live!"
2. Marketing support:
   - Featured in "New This Week"
   - Tweet from @QuackHost
   - Discord announcement
3. Creator dashboard tutorial

### Ongoing: Community
- Creator Discord channel
- Monthly creator spotlight
- Best practices guide
- Analytics insights ("Optimize your listings")

---

## Launch Strategy

### Pre-Launch (Weeks 1-2)
1. **Recruit 20 Creators**
   - Reach out to top mod creators on Spigot, CurseForge
   - Offer: Featured placement, $100 bonus for first 10 creators
   - Goal: 50 items ready for launch day

2. **Beta Testing**
   - Invite 50 customers to test marketplace
   - Gather feedback on UX
   - Fix bugs

### Launch Day
1. **Email Campaign**
   - Subject: "Introducing QuackHost Marketplace"
   - Highlight: 50+ items, easy installation, support creators
   - CTA: Browse marketplace

2. **Social Media Blitz**
   - Twitter announcement thread
   - Reddit posts in r/admincraft, r/Terraria
   - Discord announcement
   - YouTube video tour

3. **Press Coverage**
   - Press release to gaming media
   - Reach out to Minecraft/gaming YouTubers

### Post-Launch (Week 1-4)
1. **Creator Spotlight Series**
   - Interview top creator each week
   - Blog post + video
   - Cross-promote on their channels

2. **Promotional Events**
   - "Free Weekend" - Free items highlighted
   - "Creator Month" - 85/15 split for limited time
   - Bundle deals

3. **Iteration Based on Feedback**
   - Weekly review of analytics
   - User feedback surveys
   - A/B testing (price points, layouts)

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| No creators sign up | HIGH | Pre-recruit 20 creators before launch |
| Low purchase conversion | HIGH | Start with 30-50% free items to build trust |
| Payment fraud | MEDIUM | Stripe Radar for fraud detection |
| Stolen/malware content | HIGH | Manual review + virus scanning |
| Creator payout issues | MEDIUM | Thorough testing of payout flow |
| Poor item quality | MEDIUM | Strict approval standards |

---

## Future Enhancements (Post-MVP)

### V1.1 (Month 2-3)
- One-click install to server
- Automatic updates for purchased items
- Bundle support (buy 3 plugins, save 20%)
- Gift cards

### V1.2 (Month 4-6)
- Subscription items (monthly access)
- Creator analytics (views, conversion rate)
- Custom licensing (server count limits)
- Affiliate program

### V2.0 (Month 7-12)
- Creator SDK (test items before uploading)
- In-game marketplace (browse from game client)
- Creator competitions
- QuackHost exclusive items

---

## Success Definition

MVP is successful if after 90 days:
1. ✅ $15K+ GMV
2. ✅ 20+ active creators (published at least 1 item)
3. ✅ 25%+ buyer conversion rate
4. ✅ 4+ star average rating
5. ✅ NPS > 50 from creators
6. ✅ < 5% refund rate
7. ✅ Zero security incidents (malware, stolen content)

If we hit these metrics, proceed to V1.1. If not, iterate based on feedback.
