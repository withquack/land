# QuackHost 1000x - API Specification

**Version:** 1.0.0
**Base URL:** `https://api.quackhost.net`
**Protocol:** HTTPS only
**Authentication:** Bearer tokens (JWT)

---

## Overview

The QuackHost API enables developers to programmatically manage game servers, access AI features, interact with the marketplace, and build integrations. This is the "Stripe for gaming infrastructure" - powerful, simple, and developer-first.

### Key Features

- **GraphQL Primary:** Single endpoint, flexible queries, real-time subscriptions
- **REST Fallback:** Traditional REST API for simpler use cases
- **Real-time Events:** WebSocket subscriptions for live updates
- **Webhook System:** React to events in your own infrastructure
- **Rate Limited:** Fair usage policies with tiered limits
- **Well-Documented:** Interactive docs, code examples, SDKs

---

## Authentication

### API Keys

Create API keys in the QuackHost dashboard:

```bash
curl https://api.quackhost.net/v1/auth/me \
  -H "Authorization: Bearer qh_live_abc123..."
```

### Key Types

| Type | Prefix | Use Case |
|------|--------|----------|
| Live | `qh_live_` | Production |
| Test | `qh_test_` | Development/Testing |
| Restricted | `qh_rstr_` | Limited permissions |

### Authentication Header

```
Authorization: Bearer qh_live_abc123...
```

---

## GraphQL API

**Endpoint:** `https://api.quackhost.net/graphql`

### Schema Overview

```graphql
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
```

### Full Schema

```graphql
# ============================================
# QUERIES
# ============================================

type Query {
  # User & Account
  me: User!
  user(id: ID!): User

  # Servers
  server(id: ID!): Server
  servers(
    filter: ServerFilter
    sort: SortOption
    pagination: PaginationInput
  ): ServerConnection!

  # AI Features
  aiServerRecommendations(goal: ServerGoal!): [ServerTemplate!]!
  aiChurnPrediction(serverId: ID!): ChurnPrediction!
  aiRevenueOptimization(serverId: ID!): RevenueOptimization!

  # Marketplace
  marketplaceListing(id: ID!): MarketplaceListing
  marketplaceListings(
    filter: MarketplaceFilter
    sort: SortOption
    pagination: PaginationInput
  ): ListingConnection!

  # Analytics
  serverAnalytics(
    serverId: ID!
    timeRange: TimeRangeInput!
  ): Analytics!

  # Billing
  invoice(id: ID!): Invoice
  invoices(pagination: PaginationInput): InvoiceConnection!
}

# ============================================
# MUTATIONS
# ============================================

type Mutation {
  # Server Management
  createServer(input: CreateServerInput!): Server!
  updateServer(id: ID!, input: UpdateServerInput!): Server!
  deleteServer(id: ID!): DeleteServerResult!
  startServer(id: ID!): Server!
  stopServer(id: ID!): Server!
  restartServer(id: ID!): Server!

  # AI-Powered Server Creation
  createServerFromPrompt(prompt: String!): ServerCreationJob!

  # Server Configuration
  installPlugin(serverId: ID!, pluginId: ID!): InstallPluginResult!
  removePlugin(serverId: ID!, pluginId: ID!): RemovePluginResult!
  updateServerSettings(serverId: ID!, settings: ServerSettingsInput!): Server!

  # Backups
  createBackup(serverId: ID!, name: String): Backup!
  restoreBackup(serverId: ID!, backupId: ID!): RestoreBackupResult!

  # Monetization
  setupMonetization(
    serverId: ID!
    config: MonetizationConfigInput!
  ): MonetizationSetup!

  # Marketplace
  createListing(input: CreateListingInput!): MarketplaceListing!
  updateListing(id: ID!, input: UpdateListingInput!): MarketplaceListing!
  deleteListing(id: ID!): Boolean!
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

  # Team Management
  inviteTeamMember(
    serverId: ID!
    email: String!
    role: TeamRole!
  ): TeamInvite!
  removeTeamMember(serverId: ID!, userId: ID!): Boolean!
}

# ============================================
# SUBSCRIPTIONS
# ============================================

type Subscription {
  # Server Events
  serverStatus(serverId: ID!): ServerStatusUpdate!
  playerJoined(serverId: ID!): PlayerEvent!
  playerLeft(serverId: ID!): PlayerEvent!
  serverLogs(serverId: ID!): LogEntry!

  # AI Insights (real-time)
  aiInsights(serverId: ID!): AIInsight!

  # Marketplace
  listingSold(sellerId: ID!): MarketplaceTransaction!
}

# ============================================
# TYPES
# ============================================

type User {
  id: ID!
  email: String!
  username: String!
  displayName: String
  avatarUrl: String
  servers: [Server!]!
  wallet: Wallet!
  createdAt: DateTime!
  emailVerified: Boolean!
}

type Server {
  id: ID!
  name: String!
  game: Game!
  status: ServerStatus!
  address: String!
  port: Int!
  version: String
  maxPlayers: Int!
  currentPlayers: Int!
  owner: User!
  teamMembers: [TeamMember!]!
  plugins: [Plugin!]!
  uptime: ServerUptime!
  analytics: Analytics
  aiInsights: [AIInsight!]!
  backups: [Backup!]!
  monetization: MonetizationSetup
  createdAt: DateTime!
  lastStart: DateTime
}

enum ServerStatus {
  STARTING
  RUNNING
  STOPPING
  STOPPED
  UPDATING
  ERROR
}

type Game {
  id: ID!
  name: String!
  type: GameType!
  supportedVersions: [String!]!
  iconUrl: String
}

enum GameType {
  MINECRAFT
  VALHEIM
  TERRARIA
  ARK
  RUST
}

type Plugin {
  id: ID!
  name: String!
  version: String!
  description: String
  author: String
  enabled: Boolean!
  compatibilityScore: Float
}

type ServerUptime {
  totalSeconds: Int!
  last24Hours: Float!
  last7Days: Float!
  last30Days: Float!
}

# AI Features

type ServerTemplate {
  id: ID!
  name: String!
  description: String!
  game: Game!
  plugins: [Plugin!]!
  settings: JSON!
  confidenceScore: Float!
  estimatedSetupTime: String!
}

type ChurnPrediction {
  serverId: ID!
  predictions: [PlayerChurnPrediction!]!
  overallChurnRisk: Float!
  recommendations: [String!]!
}

type PlayerChurnPrediction {
  playerUsername: String!
  playerId: ID!
  churnProbability: Float!
  riskLevel: RiskLevel!
  retentionActions: [RetentionAction!]!
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

type RetentionAction {
  action: String!
  expectedImpact: Float!
  difficulty: ActionDifficulty!
}

enum ActionDifficulty {
  EASY
  MEDIUM
  HARD
}

type RevenueOptimization {
  currentMonthlyRevenue: Float!
  optimizedPricing: [PricingRecommendation!]!
  expectedRevenueIncrease: Float!
  implementationSteps: [String!]!
}

type PricingRecommendation {
  product: String!
  currentPrice: Float!
  recommendedPrice: Float!
  expectedImpact: Float!
  reason: String!
}

type AIInsight {
  id: ID!
  serverId: ID!
  type: InsightType!
  title: String!
  description: String!
  confidence: Float!
  actionable: Boolean!
  suggestedAction: String
  createdAt: DateTime!
  applied: Boolean!
}

enum InsightType {
  CHURN_PREDICTION
  GROWTH_OPPORTUNITY
  REVENUE_OPTIMIZATION
  PERFORMANCE_ISSUE
  PLUGIN_RECOMMENDATION
  SECURITY_ALERT
}

# Marketplace

type MarketplaceListing {
  id: ID!
  seller: SellerProfile!
  title: String!
  description: String!
  assetType: AssetType!
  price: Float!
  currency: String!
  game: String!
  gameVersion: String
  includedPlugins: [String!]!
  category: String
  tags: [String!]!
  thumbnailUrl: String
  screenshotUrls: [String!]!
  videoUrl: String
  purchaseCount: Int!
  ratingAverage: Float!
  ratingCount: Int!
  viewCount: Int!
  reviews(limit: Int): [MarketplaceReview!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum AssetType {
  TEMPLATE
  WORLD
  PLUGIN_BUNDLE
  PLUGIN
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

enum TransactionStatus {
  PENDING
  COMPLETED
  REFUNDED
  FAILED
}

type MarketplaceReview {
  id: ID!
  listing: MarketplaceListing!
  reviewer: User!
  rating: Int!
  reviewText: String
  helpfulCount: Int!
  sellerResponse: String
  createdAt: DateTime!
}

# Monetization

type MonetizationSetup {
  serverId: ID!
  enabled: Boolean!
  stripeAccountId: String
  storeUrl: String!
  products: [MonetizationProduct!]!
  revenueStats: RevenueStats!
}

type MonetizationProduct {
  id: ID!
  name: String!
  description: String!
  price: Float!
  currency: String!
  type: ProductType!
  minecraftCommand: String
  salesCount: Int!
}

enum ProductType {
  RANK
  ITEM
  COSMETIC
  CURRENCY
  SUBSCRIPTION
}

type RevenueStats {
  totalRevenue: Float!
  thisMonthRevenue: Float!
  lastMonthRevenue: Float!
  platformFees: Float!
  netRevenue: Float!
}

# Analytics

type Analytics {
  serverId: ID!
  timeRange: TimeRange!
  players: PlayerAnalytics!
  revenue: RevenueAnalytics!
  performance: PerformanceAnalytics!
}

type PlayerAnalytics {
  totalPlayers: Int!
  newPlayers: Int!
  returningPlayers: Int!
  averageSessionDuration: Float!
  peakConcurrent: Int!
  churnRate: Float!
}

type RevenueAnalytics {
  totalRevenue: Float!
  averageRevenuePerPlayer: Float!
  conversionRate: Float!
  topProducts: [ProductSales!]!
}

type ProductSales {
  product: MonetizationProduct!
  salesCount: Int!
  revenue: Float!
}

type PerformanceAnalytics {
  averageTPS: Float!
  averageCPU: Float!
  averageMemory: Float!
  uptime: Float!
  crashCount: Int!
}

# Team Management

type TeamMember {
  user: User!
  role: TeamRole!
  permissions: [Permission!]!
  joinedAt: DateTime!
}

enum TeamRole {
  OWNER
  ADMIN
  MODERATOR
  DEVELOPER
  BUILDER
}

enum Permission {
  MANAGE_SERVER
  START_STOP_SERVER
  INSTALL_PLUGINS
  MANAGE_FILES
  VIEW_ANALYTICS
  MANAGE_TEAM
  MANAGE_BILLING
}

type TeamInvite {
  id: ID!
  serverId: ID!
  email: String!
  role: TeamRole!
  invitedBy: User!
  status: InviteStatus!
  expiresAt: DateTime!
  createdAt: DateTime!
}

enum InviteStatus {
  PENDING
  ACCEPTED
  REJECTED
  EXPIRED
}

# Backups

type Backup {
  id: ID!
  serverId: ID!
  name: String!
  size: Int!
  createdAt: DateTime!
  downloadUrl: String
  automated: Boolean!
}

# Billing

type Invoice {
  id: ID!
  amount: Float!
  currency: String!
  status: InvoiceStatus!
  description: String!
  pdfUrl: String
  createdAt: DateTime!
  paidAt: DateTime
}

enum InvoiceStatus {
  DRAFT
  OPEN
  PAID
  VOID
  UNCOLLECTIBLE
}

type Wallet {
  balance: Float!
  currency: String!
  transactions: [WalletTransaction!]!
}

type WalletTransaction {
  id: ID!
  amount: Float!
  type: TransactionType!
  description: String!
  createdAt: DateTime!
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  EARNING
  SPENDING
  REFUND
}

# ============================================
# INPUTS
# ============================================

input CreateServerInput {
  name: String!
  game: GameType!
  version: String
  maxPlayers: Int
  aiOptimizations: Boolean
}

input UpdateServerInput {
  name: String
  maxPlayers: Int
}

input ServerFilter {
  game: GameType
  status: ServerStatus
  ownerId: ID
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

input TimeRangeInput {
  from: DateTime!
  to: DateTime!
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

input UpdateListingInput {
  title: String
  description: String
  price: Float
  category: String
  tags: [String!]
  screenshotUrls: [String!]
}

input MonetizationConfigInput {
  products: [MonetizationProductInput!]!
}

input MonetizationProductInput {
  name: String!
  description: String!
  price: Float!
  type: ProductType!
  minecraftCommand: String
}

input PaginationInput {
  page: Int
  limit: Int
}

input SortOption {
  field: String!
  order: SortOrder!
}

enum SortOrder {
  ASC
  DESC
}

input ServerGoal {
  type: String!
  description: String!
}

input ServerSettingsInput {
  maxPlayers: Int
  difficulty: String
  pvp: Boolean
  gamemode: String
}

# ============================================
# CUSTOM SCALARS
# ============================================

scalar DateTime
scalar JSON

# ============================================
# CONNECTIONS & PAGINATION
# ============================================

type ServerConnection {
  edges: [ServerEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ServerEdge {
  node: Server!
  cursor: String!
}

type ListingConnection {
  edges: [ListingEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ListingEdge {
  node: MarketplaceListing!
  cursor: String!
}

type InvoiceConnection {
  edges: [InvoiceEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type InvoiceEdge {
  node: Invoice!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# ============================================
# RESULTS & JOBS
# ============================================

type ServerCreationJob {
  id: ID!
  status: JobStatus!
  progress: Int!
  server: Server
  error: String
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

type DeleteServerResult {
  success: Boolean!
  message: String
}

type InstallPluginResult {
  success: Boolean!
  plugin: Plugin
  message: String
}

type RemovePluginResult {
  success: Boolean!
  message: String
}

type RestoreBackupResult {
  success: Boolean!
  server: Server
  message: String
}

type PurchaseResult {
  success: Boolean!
  transaction: MarketplaceTransaction
  server: Server
  message: String
}

# ============================================
# SUBSCRIPTIONS PAYLOADS
# ============================================

type ServerStatusUpdate {
  serverId: ID!
  status: ServerStatus!
  playerCount: Int!
  timestamp: DateTime!
}

type PlayerEvent {
  serverId: ID!
  playerUsername: String!
  playerId: ID
  timestamp: DateTime!
}

type LogEntry {
  serverId: ID!
  level: LogLevel!
  message: String!
  timestamp: DateTime!
}

enum LogLevel {
  DEBUG
  INFO
  WARN
  ERROR
}

type TimeRange {
  from: DateTime!
  to: DateTime!
}
```

---

## REST API (Fallback)

**Base URL:** `https://api.quackhost.net/v1`

### Authentication

```bash
curl https://api.quackhost.net/v1/servers \
  -H "Authorization: Bearer qh_live_abc123..."
```

### Endpoints

#### Servers

```
GET    /servers
POST   /servers
GET    /servers/:id
PATCH  /servers/:id
DELETE /servers/:id
POST   /servers/:id/start
POST   /servers/:id/stop
POST   /servers/:id/restart
GET    /servers/:id/logs
```

#### AI Features

```
POST   /ai/create-server
  Body: { "prompt": "Create a medieval survival server" }

GET    /ai/insights/:serverId
POST   /ai/apply-recommendation/:recommendationId
GET    /ai/churn-prediction/:serverId
GET    /ai/revenue-optimization/:serverId
```

#### Marketplace

```
GET    /marketplace/listings
GET    /marketplace/listings/:id
POST   /marketplace/listings
PATCH  /marketplace/listings/:id
DELETE /marketplace/listings/:id
POST   /marketplace/purchase
  Body: { "listingId": "...", "deployToServerId": "..." }
```

#### Analytics

```
GET    /analytics/:serverId
  Query: ?from=2025-11-01&to=2025-11-16&metrics=players,revenue
```

#### Billing

```
GET    /billing/invoices
GET    /billing/invoices/:id
GET    /billing/usage
```

### Example Requests

#### Create Server

```bash
curl -X POST https://api.quackhost.net/v1/servers \
  -H "Authorization: Bearer qh_live_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Awesome Server",
    "game": "minecraft",
    "version": "1.20.4",
    "maxPlayers": 50
  }'
```

Response:

```json
{
  "id": "srv_abc123",
  "name": "My Awesome Server",
  "game": "minecraft",
  "status": "starting",
  "address": "play-abc123.quackhost.net",
  "port": 25565,
  "maxPlayers": 50,
  "currentPlayers": 0,
  "createdAt": "2025-11-16T10:30:00Z"
}
```

#### AI Server Creation

```bash
curl -X POST https://api.quackhost.net/v1/ai/create-server \
  -H "Authorization: Bearer qh_live_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a prison server with custom mines and ranking system"
  }'
```

Response:

```json
{
  "jobId": "job_xyz789",
  "status": "processing",
  "progress": 25,
  "estimatedCompletion": "47 seconds",
  "server": null
}
```

---

## SDKs

### Official SDKs

- **Node.js/TypeScript:** `npm install @quackhost/sdk`
- **Python:** `pip install quackhost`
- **Go:** `go get github.com/quackhost/go-sdk`
- **Java:** Maven/Gradle package available
- **Ruby:** `gem install quackhost`

### TypeScript SDK Example

```typescript
import { QuackHost } from '@quackhost/sdk';

const quack = new QuackHost({
  apiKey: process.env.QUACKHOST_API_KEY,
});

// Create server with AI
const server = await quack.ai.createServer({
  prompt: "Create a survival server with economy, no PvP, medieval theme",
});

console.log(`Server created: ${server.id}`);
console.log(`Address: ${server.address}:${server.port}`);

// Subscribe to real-time events
quack.servers.subscribe(server.id, (event) => {
  if (event.type === 'player_join') {
    console.log(`Player joined: ${event.player.username}`);
  }
});

// Get AI insights
const insights = await quack.ai.getInsights(server.id);
for (const insight of insights) {
  console.log(`[${insight.type}] ${insight.title}`);
  if (insight.actionable) {
    console.log(`  Action: ${insight.suggestedAction}`);
  }
}
```

---

## Webhooks

### Setup

Configure webhooks in the QuackHost dashboard or via API:

```bash
curl -X POST https://api.quackhost.net/v1/webhooks \
  -H "Authorization: Bearer qh_live_abc123..." \
  -d '{
    "url": "https://yourdomain.com/webhooks/quackhost",
    "events": ["server.created", "player.joined", "ai.insight"]
  }'
```

### Events

| Event | Description |
|-------|-------------|
| `server.created` | New server created |
| `server.deleted` | Server deleted |
| `server.started` | Server started |
| `server.stopped` | Server stopped |
| `player.joined` | Player joined server |
| `player.left` | Player left server |
| `ai.insight` | New AI insight generated |
| `marketplace.sale` | Listing sold |
| `payment.succeeded` | Payment succeeded |
| `payment.failed` | Payment failed |

### Webhook Payload Example

```json
{
  "id": "evt_abc123",
  "type": "player.joined",
  "createdAt": "2025-11-16T10:30:00Z",
  "data": {
    "serverId": "srv_abc123",
    "player": {
      "username": "Steve",
      "uuid": "069a79f4-44e9-4726-a5be-fca90e38aaf5"
    }
  }
}
```

### Signature Verification

```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express.js example
app.post('/webhooks/quackhost', (req, res) => {
  const signature = req.headers['x-quackhost-signature'];
  const isValid = verifyWebhook(
    JSON.stringify(req.body),
    signature,
    process.env.WEBHOOK_SECRET
  );

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  const event = req.body;
  console.log(`Received event: ${event.type}`);

  res.status(200).send('OK');
});
```

---

## Rate Limits

### Limits by Tier

| Tier | Requests/Minute | Burst |
|------|-----------------|-------|
| Free | 60 | 100 |
| Pro | 600 | 1,000 |
| Enterprise | 6,000 | 10,000 |

### Rate Limit Headers

```
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 599
X-RateLimit-Reset: 1700000000
```

### Handling Rate Limits

```typescript
async function makeRequest() {
  try {
    const response = await quack.servers.list();
    return response;
  } catch (error) {
    if (error.statusCode === 429) {
      const retryAfter = error.headers['retry-after'];
      await sleep(retryAfter * 1000);
      return makeRequest(); // Retry
    }
    throw error;
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Server name must be between 3 and 50 characters",
    "param": "name",
    "type": "validation_error"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `invalid_request` | 400 | Invalid request parameters |
| `authentication_failed` | 401 | Invalid API key |
| `permission_denied` | 403 | Insufficient permissions |
| `not_found` | 404 | Resource not found |
| `rate_limit_exceeded` | 429 | Too many requests |
| `server_error` | 500 | Internal server error |

---

## Pagination

### Cursor-Based Pagination

```graphql
query {
  servers(pagination: { limit: 10 }) {
    edges {
      node {
        id
        name
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Next Page

```graphql
query {
  servers(pagination: { limit: 10, after: "cursor_abc123" }) {
    # ...
  }
}
```

---

## Best Practices

### 1. Use GraphQL for Complex Queries

```graphql
# Get exactly what you need in one request
query {
  server(id: "srv_abc123") {
    name
    status
    currentPlayers
    analytics(timeRange: { from: "2025-11-01", to: "2025-11-16" }) {
      players {
        totalPlayers
        averageSessionDuration
      }
    }
    aiInsights {
      title
      suggestedAction
    }
  }
}
```

### 2. Subscribe to Real-Time Updates

```typescript
// Instead of polling, use subscriptions
quack.subscriptions.serverStatus(serverId, (update) => {
  console.log(`Status: ${update.status}, Players: ${update.playerCount}`);
});
```

### 3. Handle Idempotency

```bash
curl -X POST https://api.quackhost.net/v1/servers \
  -H "Idempotency-Key: unique-key-123" \
  -d '{ "name": "My Server" }'
```

### 4. Batch Operations

```graphql
mutation {
  server1: createServer(input: { name: "Server 1" }) { id }
  server2: createServer(input: { name: "Server 2" }) { id }
  server3: createServer(input: { name: "Server 3" }) { id }
}
```

---

## Interactive Documentation

Explore the API interactively:

- **GraphQL Playground:** https://api.quackhost.net/graphql
- **REST Docs:** https://docs.quackhost.net/api
- **Postman Collection:** https://docs.quackhost.net/postman

---

**Version:** 1.0.0
**Last Updated:** 2025-11-16
**Changelog:** https://docs.quackhost.net/changelog
