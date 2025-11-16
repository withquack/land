# QuackHost Marketplace - MVP Specification

**Version:** 1.0
**Target Launch:** Phase 1 (Month 3)
**Status:** Specification

---

## Executive Summary

The QuackHost Marketplace transforms server hosting from a service into a **platform economy**, where creators can buy, sell, and monetize their work. This is the "Shopify" or "App Store" moment for game servers.

**Core Value Proposition:**
- **For Sellers:** Turn your server-building skills into passive income
- **For Buyers:** Launch a professional server in 60 seconds
- **For QuackHost:** 20% transaction fee creates aligned growth incentives

---

## MVP Scope

### What's In MVP (Phase 1)

✅ **Asset Types:**
- Server Templates (pre-configured servers)
- World Files (spawn areas, maps)
- Plugin Bundles (curated plugin collections)

✅ **Core Features:**
- Browse and search marketplace
- One-click purchase and deployment
- Creator profiles and ratings
- Transaction processing (Stripe Connect)
- 20% platform fee

✅ **Key Metrics:**
- Transaction volume (GMV)
- Seller count
- Average listing price
- Repeat purchase rate

### What's NOT in MVP (Future Phases)

❌ Custom plugins/mods marketplace
❌ Escrow services for custom work
❌ Creator subscriptions
❌ Royalty system for derivatives
❌ API access for marketplace

---

## User Flows

### Flow 1: Buyer - Purchasing a Server Template

```
1. User browses marketplace
   ↓
2. Finds template: "Medieval Survival Server - Complete Setup"
   ↓
3. Views template details:
   - Screenshots (spawn area, features)
   - Included plugins (15 plugins listed)
   - Reviews & ratings (4.8/5 stars, 234 reviews)
   - Price ($29.99)
   ↓
4. Clicks "Purchase & Deploy"
   ↓
5. Payment processed (Stripe)
   - QuackHost takes 20% ($6)
   - Creator gets 80% ($23.99)
   ↓
6. Server automatically deployed
   - Template applied to new server
   - Plugins installed
   - World files imported
   - Ready to join in 47 seconds
   ↓
7. User receives:
   - Server IP address
   - QuackPlane dashboard access
   - Template customization guide
```

### Flow 2: Seller - Listing a Server Template

```
1. Creator clicks "Sell on Marketplace"
   ↓
2. Completes seller onboarding:
   - Stripe Connect account setup
   - Tax information (W-9/W-8BEN)
   - Profile creation
   ↓
3. Creates new listing:
   - Upload template files
   - Add screenshots/videos
   - Write description
   - Set price ($9.99 - $299.99)
   - Choose category
   ↓
4. Template validation:
   - AI scans for malicious code
   - Checks plugin compatibility
   - Validates world files
   - Tests deployment (automated)
   ↓
5. Listing review (manual for MVP, AI in future):
   - QuackHost team reviews (24-48 hours)
   - Checks quality and completeness
   ↓
6. Listing goes live:
   - Appears in marketplace
   - Creator dashboard shows analytics
   ↓
7. Ongoing management:
   - Update template files
   - Respond to reviews
   - Track sales and earnings
   - Request payouts (monthly)
```

---

## Database Schema

### Marketplace Tables

```sql
-- Marketplace Listings
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- 'template', 'world', 'plugin_bundle'
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    -- Metadata
    game VARCHAR(50) NOT NULL,
    game_version VARCHAR(20),
    included_plugins TEXT[], -- Array of plugin names
    category VARCHAR(50),
    tags TEXT[],

    -- Media
    thumbnail_url TEXT,
    screenshot_urls TEXT[],
    video_url TEXT,

    -- Files
    template_file_url TEXT NOT NULL, -- S3/R2 URL to template zip
    file_size_bytes BIGINT,

    -- Stats
    purchase_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, delisted
    moderation_notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    approved_at TIMESTAMP,

    CONSTRAINT positive_price CHECK (price >= 0.99)
);

CREATE INDEX idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX idx_marketplace_listings_price ON marketplace_listings(price);

-- Marketplace Transactions
CREATE TABLE marketplace_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES marketplace_listings(id) NOT NULL,
    buyer_id UUID REFERENCES users(id) NOT NULL,
    seller_id UUID REFERENCES users(id) NOT NULL,

    -- Pricing
    listing_price DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL, -- 20% of listing_price
    seller_payout DECIMAL(10, 2) NOT NULL, -- 80% of listing_price
    currency VARCHAR(3) DEFAULT 'USD',

    -- Payment
    stripe_payment_intent_id VARCHAR(100),
    stripe_transfer_id VARCHAR(100), -- Transfer to seller

    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, refunded, failed

    -- Deployment
    deployed_to_server_id UUID REFERENCES servers(id),
    deployment_status VARCHAR(20), -- pending, completed, failed

    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_marketplace_transactions_buyer ON marketplace_transactions(buyer_id);
CREATE INDEX idx_marketplace_transactions_seller ON marketplace_transactions(seller_id);
CREATE INDEX idx_marketplace_transactions_listing ON marketplace_transactions(listing_id);

-- Reviews and Ratings
CREATE TABLE marketplace_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES marketplace_listings(id) NOT NULL,
    transaction_id UUID REFERENCES marketplace_transactions(id) NOT NULL,
    reviewer_id UUID REFERENCES users(id) NOT NULL,

    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,

    -- Helpful votes
    helpful_count INTEGER DEFAULT 0,

    -- Seller response
    seller_response TEXT,
    seller_responded_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- One review per transaction
    UNIQUE(transaction_id)
);

CREATE INDEX idx_marketplace_reviews_listing ON marketplace_reviews(listing_id);

-- Seller Profiles
CREATE TABLE marketplace_sellers (
    user_id UUID PRIMARY KEY REFERENCES users(id),

    -- Stripe Connect
    stripe_account_id VARCHAR(100) UNIQUE,
    stripe_onboarding_completed BOOLEAN DEFAULT FALSE,

    -- Profile
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    website_url TEXT,

    -- Stats
    total_sales INTEGER DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    listing_count INTEGER DEFAULT 0,

    -- Status
    verified BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Seller Payouts
CREATE TABLE marketplace_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES marketplace_sellers(user_id) NOT NULL,

    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    stripe_payout_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed

    created_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP
);
```

---

## API Endpoints

### Marketplace API (GraphQL)

```graphql
# Queries
type Query {
  # Browse marketplace
  marketplaceListings(
    filter: MarketplaceFilter
    sort: SortOption
    pagination: Pagination
  ): ListingConnection!

  # Get single listing
  marketplaceListing(id: ID!): MarketplaceListing

  # Seller dashboard
  myListings: [MarketplaceListing!]!
  mySales: [MarketplaceTransaction!]!
  myEarnings: EarningsSummary!

  # Buyer history
  myPurchases: [MarketplaceTransaction!]!
}

# Mutations
type Mutation {
  # Seller actions
  createListing(input: CreateListingInput!): MarketplaceListing!
  updateListing(id: ID!, input: UpdateListingInput!): MarketplaceListing!
  deleteListing(id: ID!): Boolean!

  # Buyer actions
  purchaseListing(
    listingId: ID!
    deployToServerId: ID
  ): PurchaseResult!

  # Reviews
  submitReview(
    transactionId: ID!
    rating: Int!
    reviewText: String
  ): MarketplaceReview!

  # Seller setup
  setupSellerAccount(input: SellerAccountInput!): SellerAccount!
  requestPayout: PayoutRequest!
}

# Types
type MarketplaceListing {
  id: ID!
  seller: SellerProfile!
  title: String!
  description: String!
  assetType: AssetType!
  price: Float!
  currency: String!

  # Metadata
  game: String!
  gameVersion: String
  includedPlugins: [String!]!
  category: String
  tags: [String!]!

  # Media
  thumbnailUrl: String
  screenshotUrls: [String!]!
  videoUrl: String

  # Stats
  purchaseCount: Int!
  ratingAverage: Float!
  ratingCount: Int!
  viewCount: Int!

  # Reviews
  reviews(limit: Int): [MarketplaceReview!]!

  createdAt: DateTime!
  updatedAt: DateTime!
}

type MarketplaceTransaction {
  id: ID!
  listing: MarketplaceListing!
  buyer: User!
  seller: SellerProfile!

  listingPrice: Float!
  platformFee: Float!
  sellerPayout: Float!

  status: TransactionStatus!
  deployedToServer: Server

  createdAt: DateTime!
  completedAt: DateTime
}

type SellerProfile {
  userId: ID!
  displayName: String!
  bio: String
  avatarUrl: String
  websiteUrl: String

  totalSales: Int!
  totalRevenue: Float!
  averageRating: Float!
  listingCount: Int!

  verified: Boolean!
  featured: Boolean!

  listings(limit: Int): [MarketplaceListing!]!
}

type EarningsSummary {
  totalEarnings: Float!
  thisMonthEarnings: Float!
  pendingPayout: Float!
  lifetimeSales: Int!
  averageTransactionValue: Float!
}

enum AssetType {
  TEMPLATE
  WORLD
  PLUGIN_BUNDLE
}

enum TransactionStatus {
  PENDING
  COMPLETED
  REFUNDED
  FAILED
}

input MarketplaceFilter {
  assetType: AssetType
  game: String
  category: String
  tags: [String!]
  minPrice: Float
  maxPrice: Float
  minRating: Float
}

input CreateListingInput {
  title: String!
  description: String!
  assetType: AssetType!
  price: Float!
  game: String!
  gameVersion: String
  includedPlugins: [String!]
  category: String
  tags: [String!]
  templateFileUrl: String!
  thumbnailUrl: String
  screenshotUrls: [String!]
  videoUrl: String
}
```

---

## Template File Format

### Structure

Templates are packaged as `.quacktemplate` files (ZIP archives):

```
medieval-survival.quacktemplate/
├── manifest.json           # Template metadata
├── plugins/                # Plugin JAR files
│   ├── Vault.jar
│   ├── EssentialsX.jar
│   └── ...
├── world/                  # World files
│   ├── level.dat
│   ├── region/
│   └── ...
├── config/                 # Plugin configurations
│   ├── Vault/
│   ├── EssentialsX/
│   └── ...
├── server.properties       # Server properties
└── README.md              # Setup instructions
```

### manifest.json

```json
{
  "version": "1.0",
  "name": "Medieval Survival Server",
  "description": "Complete medieval-themed survival server with economy",
  "author": "QuackBuilder123",
  "game": "minecraft",
  "gameVersion": "1.20.4",
  "plugins": [
    {
      "name": "Vault",
      "version": "1.7.3",
      "source": "https://www.spigotmc.org/resources/vault.34315/",
      "required": true
    },
    {
      "name": "EssentialsX",
      "version": "2.20.1",
      "source": "https://essentialsx.net/",
      "required": true
    }
  ],
  "settings": {
    "maxPlayers": 50,
    "difficulty": "normal",
    "pvp": false,
    "gamemode": "survival"
  },
  "tags": ["medieval", "economy", "survival", "no-pvp"],
  "screenshots": [
    "screenshots/spawn.png",
    "screenshots/marketplace.png"
  ],
  "installation_notes": "Server is ready to use out of the box. Customize economy prices in config/Vault/config.yml"
}
```

---

## Revenue Model

### Pricing Strategy

| Asset Type | Price Range | Platform Fee | Seller Payout |
|------------|-------------|--------------|---------------|
| Server Template | $9.99 - $99.99 | 20% | 80% |
| World File | $4.99 - $49.99 | 20% | 80% |
| Plugin Bundle | $14.99 - $149.99 | 20% | 80% |

### Example Transaction

**Listing:** "Medieval Survival Server" - $29.99

```
Buyer pays:        $29.99
Platform fee (20%): $6.00
Seller receives:   $23.99

Stripe fees (~3%): $0.90
Net to QuackHost:  $5.10
Net to Seller:     $23.09
```

### Revenue Projections

**Conservative MVP Estimates (Month 3-6):**

- Active listings: 100
- Monthly transactions: 500
- Average transaction: $25
- Monthly GMV: $12,500
- Platform revenue (20%): $2,500
- After Stripe fees: ~$2,350/month

**Growth Scenario (Year 1):**

- Active listings: 1,000
- Monthly transactions: 5,000
- Average transaction: $30
- Monthly GMV: $150,000
- Platform revenue (20%): $30,000
- Annual platform revenue: $360,000

---

## Quality Control

### Template Validation Process

1. **Automated Checks** (Instant):
   - Virus/malware scan
   - File structure validation
   - manifest.json schema validation
   - Plugin compatibility check
   - World file corruption check
   - File size limits (max 5GB)

2. **AI Quality Score** (30 seconds):
   - Description quality
   - Screenshot quality
   - Configuration completeness
   - Predicted user satisfaction

3. **Manual Review** (24-48 hours) - MVP only:
   - QuackHost team reviews
   - Tests deployment
   - Checks for copyright issues
   - Verifies quality standards

4. **Approval / Rejection**:
   - Approved → goes live
   - Rejected → feedback provided

### Seller Requirements

To sell on marketplace:
- ✅ Account in good standing (7+ days old)
- ✅ Stripe Connect account verified
- ✅ Tax information submitted
- ✅ Profile completed
- ✅ Agree to seller terms

### Quality Standards

Templates must:
- Be original work (no copyright violations)
- Include complete setup instructions
- Have working configurations
- Include at least 1 screenshot
- Have accurate descriptions
- Not contain malicious code

---

## MVP Implementation Plan

### Week 1-2: Database & Backend

- [ ] Create database schema
- [ ] Set up Stripe Connect for sellers
- [ ] Build GraphQL API
- [ ] Implement file upload (S3/R2)
- [ ] Template validation pipeline

### Week 3-4: Seller Features

- [ ] Seller onboarding flow
- [ ] Create listing form
- [ ] Upload template files
- [ ] Seller dashboard
- [ ] Manual review admin panel

### Week 5-6: Buyer Features

- [ ] Marketplace browse/search
- [ ] Listing detail pages
- [ ] Purchase flow
- [ ] Auto-deployment system
- [ ] Review system

### Week 7-8: Polish & Launch

- [ ] UI/UX improvements
- [ ] Testing (unit, integration, e2e)
- [ ] Security audit
- [ ] Documentation
- [ ] Soft launch (invite-only)
- [ ] Public launch

---

## Success Metrics

### Phase 1 (Month 3-6) Goals

| Metric | Target | Measurement |
|--------|--------|-------------|
| Active Listings | 50+ | Count of approved listings |
| Monthly Transactions | 200+ | Completed purchases |
| Monthly GMV | $5,000+ | Gross merchandise value |
| Seller Count | 25+ | Active sellers with ≥1 listing |
| Average Rating | 4.0+ | Average of all listing ratings |
| Repeat Purchase Rate | 20%+ | % buyers who purchase 2+ templates |

### Key Performance Indicators

1. **GMV Growth Rate:** Target 20% MoM growth
2. **Seller Retention:** 80% sellers active after 3 months
3. **Buyer Satisfaction:** 85%+ positive reviews
4. **Template Quality:** <5% rejection rate
5. **Deployment Success:** 95%+ successful deployments

---

## Risk Management

### Potential Risks

1. **Copyright Infringement**
   - *Risk:* Sellers upload stolen content
   - *Mitigation:* Manual review, DMCA process, seller verification

2. **Malicious Code**
   - *Risk:* Templates contain malware
   - *Mitigation:* Automated scanning, sandboxed testing, security audits

3. **Low Quality Templates**
   - *Risk:* Poor quality damages marketplace reputation
   - *Mitigation:* Quality standards, ratings/reviews, manual curation

4. **Seller Fraud**
   - *Risk:* Fake sellers, money laundering
   - *Mitigation:* Stripe Connect verification, transaction monitoring

5. **Deployment Failures**
   - *Risk:* Templates fail to deploy correctly
   - *Mitigation:* Automated testing, refund policy, support team

### Refund Policy

- 7-day money-back guarantee
- Automatic refunds if deployment fails
- Seller keeps payout if review posted
- Platform absorbs costs for legitimate refunds

---

## Future Enhancements (Post-MVP)

1. **Custom Work Marketplace** (Phase 2)
   - Hire builders, developers, moderators
   - Escrow system
   - Milestone-based payments

2. **Plugin Store** (Phase 3)
   - Individual plugins for sale
   - Auto-updates
   - License management

3. **Subscription Templates** (Phase 3)
   - Monthly updated templates
   - Exclusive content
   - Creator subscriptions

4. **Royalty System** (Phase 4)
   - Earn from derivative works
   - Attribution tracking
   - Revenue sharing chains

5. **API Marketplace** (Phase 4)
   - Programmatic access
   - Integration marketplace
   - Webhook store

---

## Appendix: Competitive Analysis

### Existing Solutions

| Platform | Model | Fee | Pros | Cons |
|----------|-------|-----|------|------|
| SpigotMC | Free/Premium | 15% | Large library | Outdated UX |
| BuiltByBit | Marketplace | 10% | Active community | No auto-deploy |
| Envato Market | Marketplace | 12.5% | Professional | Not gaming-focused |

### QuackHost Differentiators

1. ✅ **One-Click Deployment:** Only platform with instant deployment
2. ✅ **AI Quality Scoring:** Automated quality assurance
3. ✅ **Integrated Hosting:** Purchase + host in one place
4. ✅ **Revenue Share Model:** Aligned incentives with creators
5. ✅ **Modern UX:** Best-in-class user experience

---

**Document Version:** 1.0
**Last Updated:** 2025-11-16
**Next Review:** 2025-12-01
