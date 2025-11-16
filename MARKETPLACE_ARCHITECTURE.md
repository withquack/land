# QuackHost Creator Marketplace
**Technical Architecture & Implementation Plan**

Date: 2025-11-16
Version: 1.0
Status: Design Phase

---

## 🎯 VISION

Build an App Store-like ecosystem where:
- Plugin developers earn passive income
- Server owners discover & install add-ons effortlessly
- QuackHost creates network effects & revenue streams

**Goal**: 10,000+ plugins, $100k/month marketplace revenue by Year 2

---

## 📐 SYSTEM ARCHITECTURE

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    QuackHost Marketplace                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Web Store  │    │ QuackPlane   │    │   API/SDK    │  │
│  │  (Browse/Buy)│◄──►│  (Install)   │◄──►│ (Developers) │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
│         └────────────────────┼────────────────────┘          │
│                              │                               │
│  ┌───────────────────────────▼────────────────────────┐     │
│  │          Marketplace Core Services                 │     │
│  ├────────────────────────────────────────────────────┤     │
│  │  • Plugin Catalog          • Payment Processing    │     │
│  │  • Version Management      • Revenue Distribution  │     │
│  │  • Review System           • Analytics & Metrics   │     │
│  │  • Search & Discovery      • Security Scanning     │     │
│  └────────────────────────────────────────────────────┘     │
│                              │                               │
│  ┌───────────────────────────▼────────────────────────┐     │
│  │              Infrastructure Layer                  │     │
│  ├────────────────────────────────────────────────────┤     │
│  │  • CDN (CloudFlare)        • Database (PostgreSQL) │     │
│  │  • Object Storage (S3)     • Cache (Redis)         │     │
│  │  • Container Registry      • Message Queue (RabbitMQ)│   │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ TECH STACK

### Frontend
- **Web Store**: Astro + React (for interactive components)
- **QuackPlane Integration**: Embedded React components
- **Styling**: Tailwind CSS (match existing design)
- **State Management**: Zustand or Jotai (lightweight)

### Backend
- **API**: Node.js + Express.js (or Fastify for performance)
- **Database**: PostgreSQL (relational data: plugins, users, transactions)
- **Cache**: Redis (plugin metadata, search results)
- **Object Storage**: AWS S3 / Cloudflare R2 (plugin files, icons)
- **CDN**: CloudFlare (fast global distribution)
- **Message Queue**: RabbitMQ (async tasks: installs, updates)

### DevOps
- **Container**: Docker (containerized services)
- **Orchestration**: Kubernetes (if scale needed)
- **CI/CD**: GitHub Actions (automated testing & deployment)
- **Monitoring**: Prometheus + Grafana (metrics)
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

### Payment Processing
- **Stripe**: Primary payment processor
- **PayPal**: Alternative payment method
- **Crypto**: Coinbase Commerce (optional, for crypto payments)

### Security
- **Plugin Scanning**: ClamAV (malware detection)
- **Code Analysis**: SonarQube (static analysis)
- **Sandboxing**: Docker (isolated plugin testing)
- **Vulnerability DB**: NVD / Snyk (dependency scanning)

---

## 📊 DATA MODEL

### Core Entities

```sql
-- Plugins Table
CREATE TABLE plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,  -- e.g., "essentials-x"
  name VARCHAR(255) NOT NULL,
  tagline TEXT,
  description TEXT,
  icon_url VARCHAR(500),
  category_id UUID REFERENCES categories(id),
  game_type VARCHAR(50),  -- minecraft, rust, etc.
  developer_id UUID REFERENCES users(id),
  price_type VARCHAR(20),  -- free, paid, freemium
  price_amount DECIMAL(10,2),
  license VARCHAR(50),  -- MIT, GPL, proprietary, etc.
  downloads_count INTEGER DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  status VARCHAR(20),  -- pending, approved, rejected, suspended
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Plugin Versions Table
CREATE TABLE plugin_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_id UUID REFERENCES plugins(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL,  -- semver: 1.2.3
  changelog TEXT,
  download_url VARCHAR(500),
  file_hash VARCHAR(64),  -- SHA-256 hash for integrity
  file_size_bytes BIGINT,
  game_version VARCHAR(50),  -- compatible game version
  dependencies JSONB,  -- [{name: "vault", version: ">=1.7"}]
  security_scan_status VARCHAR(20),  -- pending, passed, failed
  downloads_count INTEGER DEFAULT 0,
  is_latest BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(plugin_id, version)
);

-- Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  parent_id UUID REFERENCES categories(id),  -- for nested categories
  sort_order INTEGER DEFAULT 0
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_id UUID REFERENCES plugins(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  content TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(plugin_id, user_id)  -- one review per user per plugin
);

-- Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plugin_id UUID REFERENCES plugins(id),
  plugin_version_id UUID REFERENCES plugin_versions(id),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),  -- stripe, paypal, crypto
  payment_id VARCHAR(255),  -- external payment ID
  developer_revenue DECIMAL(10,2),  -- 70% of amount
  platform_revenue DECIMAL(10,2),  -- 30% of amount
  status VARCHAR(20),  -- pending, completed, refunded
  created_at TIMESTAMP DEFAULT NOW()
);

-- Installs Table (track who has what)
CREATE TABLE plugin_installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  server_id UUID REFERENCES servers(id),
  plugin_id UUID REFERENCES plugins(id),
  plugin_version_id UUID REFERENCES plugin_versions(id),
  status VARCHAR(20),  -- active, paused, uninstalled
  installed_at TIMESTAMP DEFAULT NOW(),
  last_updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(server_id, plugin_id)
);

-- Analytics Table (aggregated data)
CREATE TABLE plugin_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_id UUID REFERENCES plugins(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  installs INTEGER DEFAULT 0,
  uninstalls INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  UNIQUE(plugin_id, date)
);
```

---

## 🔧 KEY FEATURES & IMPLEMENTATION

### 1. Plugin Discovery & Search

**Requirements**:
- Full-text search across plugin names, descriptions, tags
- Filter by category, game type, price, rating
- Sort by popularity, rating, newest, price
- Autocomplete search suggestions
- Related plugins recommendations

**Implementation**:
```javascript
// Search API Endpoint
POST /api/v1/marketplace/search
{
  "query": "economy plugin",
  "filters": {
    "game_type": "minecraft",
    "category": "economy",
    "price_type": "free",
    "rating_min": 4.0
  },
  "sort": "downloads_desc",
  "page": 1,
  "limit": 20
}

// Response
{
  "results": [
    {
      "id": "uuid",
      "slug": "vault",
      "name": "Vault",
      "tagline": "Economy API for Minecraft",
      "icon_url": "https://cdn.quackhost.com/plugins/vault/icon.png",
      "price": 0,
      "rating": 4.8,
      "downloads": 1250000,
      "developer": {
        "name": "MilkBowl",
        "verified": true
      }
    }
  ],
  "total": 156,
  "page": 1,
  "pages": 8
}
```

**Tech**:
- PostgreSQL Full-Text Search (pg_trgm extension)
- Or Elasticsearch for advanced search (if scale requires)
- Redis caching for popular searches (TTL: 5 minutes)

---

### 2. One-Click Plugin Installation

**User Flow**:
1. User browses marketplace
2. Clicks "Install to Server"
3. Selects target server from dropdown
4. Confirms installation
5. Background job installs plugin
6. User gets notification when complete

**Implementation**:
```javascript
// Install API
POST /api/v1/servers/:serverId/plugins/install
{
  "plugin_id": "uuid",
  "version": "1.2.3",  // optional, defaults to latest
  "config": {  // optional pre-configuration
    "enabled": true,
    "settings": {...}
  }
}

// Background Job (RabbitMQ)
async function installPluginJob(serverId, pluginId, version) {
  try {
    // 1. Download plugin from S3/CDN
    const pluginFile = await downloadPlugin(pluginId, version);

    // 2. Verify file integrity (SHA-256 hash)
    if (!verifyHash(pluginFile)) {
      throw new Error('File integrity check failed');
    }

    // 3. Stop server (if running)
    await stopServer(serverId);

    // 4. Copy plugin to server plugins/ directory
    await deployPlugin(serverId, pluginFile);

    // 5. Start server
    await startServer(serverId);

    // 6. Mark install as complete
    await updateInstallStatus(serverId, pluginId, 'active');

    // 7. Send notification to user
    await notifyUser(serverId, `Plugin ${pluginId} installed successfully`);

  } catch (error) {
    await handleInstallError(serverId, pluginId, error);
  }
}
```

**Challenges**:
- **Downtime**: Server must restart to load new plugin
  - *Solution*: Hot-reload if game supports it, otherwise quick restart
- **Compatibility**: Plugin may conflict with existing plugins
  - *Solution*: Dependency checking before install + rollback mechanism
- **Configuration**: Plugins need initial config
  - *Solution*: Provide sensible defaults + post-install wizard

---

### 3. Plugin Updates & Management

**Auto-Update Feature**:
- Users opt-in to auto-updates
- Check for updates daily (cron job)
- Install updates during low-traffic hours
- Create backup before update
- Rollback if update fails

**Implementation**:
```javascript
// Update Checker (runs daily)
async function checkPluginUpdates() {
  const servers = await getServersWithAutoUpdateEnabled();

  for (const server of servers) {
    const installedPlugins = await getInstalledPlugins(server.id);

    for (const plugin of installedPlugins) {
      const latestVersion = await getLatestPluginVersion(plugin.id);

      if (semver.gt(latestVersion.version, plugin.version)) {
        // Schedule update job
        await scheduleUpdate(server.id, plugin.id, latestVersion);
      }
    }
  }
}

// Update Job
async function updatePluginJob(serverId, pluginId, newVersion) {
  // 1. Create backup of current plugin + config
  await createBackup(serverId, pluginId);

  // 2. Stop server
  await stopServer(serverId);

  // 3. Replace plugin file
  await replacePlugin(serverId, pluginId, newVersion);

  // 4. Start server
  await startServer(serverId);

  // 5. Health check
  const healthy = await healthCheck(serverId, timeout: 60);

  if (!healthy) {
    // Rollback to backup
    await rollbackPlugin(serverId, pluginId);
  } else {
    // Update successful
    await updatePluginVersion(serverId, pluginId, newVersion);
  }
}
```

---

### 4. Developer Portal & Submission

**Developer Workflow**:
1. Sign up / login as developer
2. Create new plugin listing
3. Upload plugin file (.jar for Minecraft, .cs for Rust)
4. Fill metadata (name, description, category, price)
5. Submit for review
6. QuackHost reviews (security scan + manual check)
7. Approve or reject
8. If approved, plugin goes live

**Submission API**:
```javascript
POST /api/v1/developer/plugins
Content-Type: multipart/form-data

{
  "name": "EconomyPlus",
  "slug": "economy-plus",
  "tagline": "Advanced economy system for Minecraft",
  "description": "...",
  "category_id": "uuid",
  "game_type": "minecraft",
  "price_type": "paid",
  "price_amount": 9.99,
  "license": "proprietary",
  "file": <binary>,  // .jar file
  "version": "1.0.0",
  "game_version": "1.20+",
  "dependencies": [
    {"name": "Vault", "version": ">=1.7.0"}
  ]
}
```

**Review Process**:
1. **Automated Security Scan**:
   - ClamAV malware scan
   - Dependency vulnerability check (Snyk)
   - Code obfuscation detection
   - Suspicious API usage check

2. **Manual Review**:
   - Code quality check (if open source)
   - Functionality test (spin up test server)
   - Documentation completeness
   - Licensing verification

3. **Approval Decision**:
   - Approve → Plugin goes live
   - Reject → Email developer with reasons
   - Request Changes → Developer resubmits

**Review SLA**:
- Free plugins: 7 days
- Paid plugins: 3 days (priority)
- Enterprise: 1 day (premium support)

---

### 5. Payment & Revenue Distribution

**Payment Flow**:
1. User buys plugin ($10)
2. Stripe processes payment
3. QuackHost receives $10
4. Revenue split:
   - Developer: $7 (70%)
   - QuackHost: $3 (30%)
5. Developer gets paid monthly (if >$50 balance)

**Implementation**:
```javascript
// Purchase API
POST /api/v1/marketplace/purchase
{
  "plugin_id": "uuid",
  "payment_method": "stripe",
  "stripe_token": "tok_...",
  "server_id": "uuid"  // install immediately after purchase
}

// Revenue Split Logic
async function processPayment(pluginId, amount, userId) {
  const plugin = await getPlugin(pluginId);
  const developer = await getUser(plugin.developer_id);

  // Create Stripe charge
  const charge = await stripe.charges.create({
    amount: amount * 100,  // cents
    currency: 'usd',
    source: stripeToken,
    description: `Purchase: ${plugin.name}`,
    metadata: {
      plugin_id: pluginId,
      user_id: userId
    }
  });

  // Calculate split
  const platformFee = amount * 0.30;  // 30%
  const developerRevenue = amount * 0.70;  // 70%

  // Record transaction
  await createTransaction({
    user_id: userId,
    plugin_id: pluginId,
    amount: amount,
    platform_revenue: platformFee,
    developer_revenue: developerRevenue,
    payment_id: charge.id,
    status: 'completed'
  });

  // Update developer balance
  await incrementDeveloperBalance(plugin.developer_id, developerRevenue);

  // Grant access to plugin
  await grantPluginAccess(userId, pluginId);

  return { success: true, transaction_id: charge.id };
}

// Monthly Payout (Stripe Connect)
async function monthlyDeveloperPayouts() {
  const developers = await getDevelopersWithBalance(minBalance: 50);

  for (const dev of developers) {
    try {
      // Transfer to developer's Stripe account
      const transfer = await stripe.transfers.create({
        amount: dev.balance * 100,
        currency: 'usd',
        destination: dev.stripe_account_id,
        description: `QuackHost marketplace earnings - ${getCurrentMonth()}`
      });

      // Reset balance
      await updateDeveloperBalance(dev.id, 0);

      // Send payout confirmation email
      await sendPayoutEmail(dev.email, dev.balance, transfer.id);

    } catch (error) {
      await logPayoutError(dev.id, error);
    }
  }
}
```

**Revenue Share Options**:
- Standard: 70% developer, 30% platform
- Exclusive: 80% developer, 20% platform (plugin only on QuackHost)
- Enterprise: Custom deals for high-volume developers

---

### 6. Analytics & Insights

**Developer Dashboard Metrics**:
- Total downloads (all-time, last 30 days)
- Active installs (currently using your plugin)
- Revenue (total, monthly, daily)
- Conversion rate (views → downloads → purchases)
- Review statistics (avg rating, review count)
- Version adoption (% users on each version)

**Implementation**:
```javascript
// Analytics API
GET /api/v1/developer/plugins/:pluginId/analytics
  ?start_date=2025-10-01
  &end_date=2025-11-01
  &metrics=downloads,revenue,installs

// Response
{
  "plugin_id": "uuid",
  "period": {
    "start": "2025-10-01",
    "end": "2025-11-01"
  },
  "metrics": {
    "downloads": {
      "total": 1250,
      "change": "+15%",
      "chart": [
        {"date": "2025-10-01", "value": 35},
        {"date": "2025-10-02", "value": 42},
        ...
      ]
    },
    "revenue": {
      "total": 450.00,
      "change": "+22%",
      "chart": [...]
    },
    "active_installs": {
      "total": 3200,
      "change": "+8%"
    }
  }
}
```

**Platform-Wide Analytics**:
- Most popular plugins (by downloads, revenue)
- Trending plugins (biggest growth in last 7 days)
- Category performance
- User acquisition funnel (view → install → purchase)

---

## 🔒 SECURITY & TRUST

### Plugin Vetting Process

1. **Automated Scans**:
   - Malware detection (ClamAV)
   - Known vulnerability checks (NVD database)
   - Suspicious code patterns (obfuscation, network calls)
   - License compliance

2. **Sandboxed Testing**:
   - Run plugin in isolated Docker container
   - Monitor resource usage (CPU, memory, network)
   - Check for malicious behavior
   - Verify functionality

3. **Manual Review** (for paid/popular plugins):
   - Code audit (if source available)
   - Documentation review
   - Support quality check
   - Update frequency

4. **Community Reporting**:
   - Users can flag suspicious plugins
   - Automatic suspension if >10 reports
   - Investigation within 24 hours

### Trust Signals
- **Verified Developer**: Email + identity verified
- **Open Source**: Source code publicly available
- **Active Support**: Responds to issues within 48h
- **Regular Updates**: Updated in last 90 days
- **High Rating**: 4.5+ stars with 50+ reviews

---

## 🚀 MVP LAUNCH PLAN

### Phase 1: Core Marketplace (Months 1-3)

**Features**:
- Plugin listing and search
- Basic install/uninstall
- Free plugins only (no payments yet)
- Simple review system
- Developer portal (manual approval)

**Tech Debt Acceptable**:
- No auto-updates (manual only)
- Basic search (no Elasticsearch)
- Single region (no CDN)
- Manual security reviews

**Launch Criteria**:
- 50 plugins available
- 10 verified developers
- 100 test installs
- <2 second page load
- Zero critical bugs

---

### Phase 2: Monetization (Months 4-6)

**Features**:
- Paid plugins (Stripe integration)
- Revenue distribution (manual monthly payouts)
- Purchase analytics
- Refund system (30-day money-back)

**Launch Criteria**:
- Stripe account verified
- Legal terms (ToS, refund policy)
- Tax compliance (1099 for US devs)
- First $1,000 in sales

---

### Phase 3: Automation & Scale (Months 7-12)

**Features**:
- Auto-updates
- Advanced search (Elasticsearch)
- CDN distribution
- Automated security scanning
- Developer analytics dashboard

**Launch Criteria**:
- 500+ plugins
- 50+ developers
- 10,000+ installs/month
- $10k marketplace revenue/month

---

## 📈 SUCCESS METRICS

### Developer Metrics
- **Developers onboarded**: 100 (Year 1)
- **Plugins published**: 500 (Year 1)
- **Active developers** (published in last 90 days): 50 (Year 1)

### User Metrics
- **Plugin installs**: 50,000 (Year 1)
- **Active plugin users**: 5,000 servers (Year 1)
- **Avg plugins per server**: 3

### Revenue Metrics
- **GMV (Gross Merchandise Value)**: $100k (Year 1)
- **Platform revenue** (30%): $30k (Year 1)
- **Avg transaction size**: $8

### Quality Metrics
- **Avg plugin rating**: 4.5+ stars
- **Plugin approval rate**: 80%
- **Malware detection rate**: 0 (zero malicious plugins published)

---

## ✅ IMPLEMENTATION CHECKLIST

### Infrastructure
- [ ] Set up PostgreSQL database
- [ ] Configure Redis cache
- [ ] Set up S3/R2 for file storage
- [ ] Configure CDN (CloudFlare)
- [ ] Deploy RabbitMQ for job queue
- [ ] Set up monitoring (Prometheus + Grafana)

### Backend Development
- [ ] Build REST API (Express.js)
- [ ] Implement authentication (JWT)
- [ ] Create database schema and migrations
- [ ] Build search functionality
- [ ] Implement file upload/download
- [ ] Create background job workers
- [ ] Build payment integration (Stripe)
- [ ] Set up security scanning pipeline

### Frontend Development
- [ ] Design marketplace UI/UX (Figma)
- [ ] Build plugin listing page
- [ ] Create plugin detail page
- [ ] Build search and filters
- [ ] Implement shopping cart & checkout
- [ ] Create developer dashboard
- [ ] Build admin panel

### Testing & QA
- [ ] Unit tests (80% coverage)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Security penetration testing
- [ ] Load testing (1000 concurrent users)
- [ ] Beta testing with 50 users

### Launch
- [ ] Write developer documentation
- [ ] Create submission guidelines
- [ ] Prepare launch announcement
- [ ] Onboard first 10 developers
- [ ] Seed with 50 plugins
- [ ] Launch marketing campaign

---

## 🎯 CONCLUSION

The QuackHost Marketplace will become the **primary moat** that defends against competitors. Network effects make it impossible to replicate:

- More plugins → More users choose QuackHost
- More users → More developers publish plugins
- More developers → Better quality & variety
- Better marketplace → More plugins

**Timeline**: MVP in 3 months, monetization in 6 months, scale in 12 months

**Investment Required**: $50k (2 engineers × 6 months)

**Expected Return**: $300k/year marketplace revenue by Year 2

---

**Next Action**: Build Phase 1 MVP. Start recruiting developers TODAY. 🚀

