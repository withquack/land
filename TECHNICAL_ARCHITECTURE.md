# Technical Architecture: Multi-Game Platform
## QuackHost Gaming Infrastructure Platform

**Version:** 1.0
**Last Updated:** 2025-Q1
**Status:** Design Phase

---

## Executive Summary

This document outlines the technical architecture for transforming QuackHost from a Minecraft-only hosting platform into a universal gaming infrastructure platform supporting multiple games, dynamic pricing, marketplace functionality, and developer APIs.

### Key Principles
1. **Game-Agnostic Design**: Abstract game-specific logic behind common interfaces
2. **Horizontal Scalability**: Support 10,000+ concurrent servers
3. **Developer-First**: Public API as a first-class citizen
4. **Cost Optimization**: Dynamic resource allocation based on actual usage
5. **Security by Default**: Zero-trust architecture with defense in depth

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
├─────────────┬──────────────┬──────────────┬────────────────────┤
│   Web UI    │  Mobile App  │   CLI Tool   │  Third-party Apps  │
│ (QuackPlane)│  (iOS/And.)  │   (quack)    │   (via API)       │
└─────────────┴──────────────┴──────────────┴────────────────────┘
                               │
                               │ HTTPS/WebSocket
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  REST API    │  │  GraphQL     │  │  WebSocket   │         │
│  │  Gateway     │  │  Gateway     │  │  Gateway     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                   │                │
│         │    Auth/Rate Limiting/DDoS Protection│                │
│         └──────────────────┴───────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Server     │  │  Marketplace │  │   Analytics  │         │
│  │  Management  │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Billing    │  │   Webhook    │  │     User     │         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Container  │  │    Queue     │  │    Cache     │         │
│  │ Orchestrator │  │  (RabbitMQ)  │  │   (Redis)    │         │
│  │ (Kubernetes) │  └──────────────┘  └──────────────┘         │
│  └──────────────┘                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Database   │  │    Storage   │  │  Monitoring  │         │
│  │ (PostgreSQL) │  │  (S3/Block)  │  │ (Prometheus) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Compute Layer                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Game Server Containers (Docker)                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │Minecraft │  │ Terraria │  │ Valheim  │  │   Rust   │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Game Server Abstraction

#### Game Server Interface
```typescript
/**
 * Universal interface that all game servers must implement
 * This abstraction allows QuackHost to support any game
 */
interface GameServer {
  // Lifecycle Management
  start(): Promise<void>
  stop(): Promise<void>
  restart(): Promise<void>
  getStatus(): Promise<ServerStatus>

  // Player Management
  getPlayers(): Promise<Player[]>
  kickPlayer(playerId: string): Promise<void>
  banPlayer(playerId: string, reason?: string): Promise<void>

  // Command Execution
  executeCommand(command: string): Promise<CommandResult>

  // Configuration
  getConfig(): Promise<Config>
  updateConfig(config: Partial<Config>): Promise<void>

  // File Management
  listFiles(path: string): Promise<File[]>
  readFile(path: string): Promise<string>
  writeFile(path: string, content: string): Promise<void>
  uploadFile(path: string, stream: ReadableStream): Promise<void>

  // Metrics
  getMetrics(): Promise<ServerMetrics>
  streamLogs(): Promise<ReadableStream<LogEntry>>
}

interface ServerStatus {
  state: 'starting' | 'running' | 'stopping' | 'stopped' | 'crashed'
  uptime: number // seconds
  playerCount: number
  maxPlayers: number
  version: string
  gameMode?: string
}

interface ServerMetrics {
  cpu: number // percentage
  ram: number // MB
  ramLimit: number // MB
  tps: number // ticks per second (game-specific)
  networkIn: number // MB/s
  networkOut: number // MB/s
}

interface Player {
  id: string
  name: string
  joinedAt: Date
  ip?: string // only available to admins
}
```

#### Game Registry
```typescript
/**
 * Registry of all supported games
 * Allows dynamic game registration without code changes
 */
class GameRegistry {
  private games: Map<string, GameDefinition>

  register(game: GameDefinition): void {
    this.games.set(game.id, game)
  }

  get(gameId: string): GameDefinition | null {
    return this.games.get(gameId) || null
  }

  list(): GameDefinition[] {
    return Array.from(this.games.values())
  }
}

interface GameDefinition {
  id: string // 'minecraft', 'terraria', etc.
  name: string
  icon: string // URL to icon
  containerImage: string // Docker image
  defaultPort: number
  portRange?: [number, number] // if game needs multiple ports

  // Resource requirements
  minRam: number // MB
  recommendedRam: number // MB
  ramPerPlayer: number // MB per concurrent player

  // Pricing multiplier (1.0 = standard, 1.5 = 50% more expensive)
  pricingMultiplier: number

  // Game-specific features
  supportsMods: boolean
  supportsPlugins: boolean
  supportsBackups: boolean

  // Version management
  availableVersions: string[]
  defaultVersion: string

  // Implementation
  serverClass: typeof GameServer
}
```

#### Example: Minecraft Implementation
```typescript
class MinecraftServer implements GameServer {
  private container: DockerContainer
  private config: MinecraftConfig

  async start(): Promise<void> {
    await this.container.start()
    await this.waitForStartup()
  }

  async stop(): Promise<void> {
    // Graceful shutdown: send "stop" command, wait up to 30s
    await this.executeCommand('stop')
    await this.container.waitForExit(30000)

    // Force kill if still running
    if (await this.container.isRunning()) {
      await this.container.kill()
    }
  }

  async getPlayers(): Promise<Player[]> {
    const result = await this.executeCommand('list')
    return this.parsePlayerList(result.output)
  }

  async getMetrics(): Promise<ServerMetrics> {
    const [containerMetrics, tps] = await Promise.all([
      this.container.getMetrics(),
      this.getTPS() // Parse from server logs
    ])

    return {
      cpu: containerMetrics.cpu,
      ram: containerMetrics.ram,
      ramLimit: containerMetrics.ramLimit,
      tps,
      networkIn: containerMetrics.networkIn,
      networkOut: containerMetrics.networkOut
    }
  }

  private async getTPS(): Promise<number> {
    // Minecraft-specific: run /tps command or parse from debug output
    const result = await this.executeCommand('tps')
    return this.parseTPS(result.output)
  }
}
```

---

### 2. Container Orchestration

#### Kubernetes Architecture
```yaml
# Game Server Deployment Template
apiVersion: apps/v1
kind: Deployment
metadata:
  name: game-server-{{server_id}}
  namespace: game-servers
  labels:
    app: game-server
    game: {{game_type}}
    user: {{user_id}}
    tier: {{pricing_tier}}
spec:
  replicas: 1
  selector:
    matchLabels:
      server-id: {{server_id}}
  template:
    metadata:
      labels:
        server-id: {{server_id}}
    spec:
      containers:
      - name: game-server
        image: {{game_image}}:{{version}}
        resources:
          requests:
            memory: {{ram_mb}}Mi
            cpu: {{cpu_cores}}
          limits:
            memory: {{ram_limit_mb}}Mi
            cpu: {{cpu_limit_cores}}
        ports:
        - containerPort: {{game_port}}
          protocol: {{protocol}} # TCP or UDP
        volumeMounts:
        - name: server-data
          mountPath: /data
        - name: backups
          mountPath: /backups
        env:
        - name: SERVER_ID
          value: "{{server_id}}"
        - name: GAME_VERSION
          value: "{{version}}"
        - name: MAX_PLAYERS
          value: "{{max_players}}"
      volumes:
      - name: server-data
        persistentVolumeClaim:
          claimName: server-data-{{server_id}}
      - name: backups
        persistentVolumeClaim:
          claimName: server-backups-{{server_id}}
```

#### Auto-Scaling Strategy
```typescript
/**
 * Auto-scaling for game servers based on player load
 * Increases/decreases resources dynamically
 */
class AutoScaler {
  async evaluateServer(serverId: string): Promise<ScalingAction> {
    const server = await this.getServer(serverId)
    const metrics = await server.getMetrics()
    const billing = await this.getBillingModel(serverId)

    // Only scale on pay-per-player pricing
    if (billing.model !== 'pay-per-player') {
      return { action: 'none' }
    }

    const currentRam = metrics.ram
    const ramLimit = metrics.ramLimit
    const utilization = currentRam / ramLimit

    // Scale up if > 85% RAM usage
    if (utilization > 0.85) {
      const newRam = Math.ceil(ramLimit * 1.5)
      return {
        action: 'scale-up',
        newRam,
        reason: `RAM utilization at ${(utilization * 100).toFixed(1)}%`
      }
    }

    // Scale down if < 50% RAM usage for 30 minutes
    if (utilization < 0.5 && await this.lowUtilizationFor(serverId, 30 * 60)) {
      const newRam = Math.ceil(ramLimit * 0.75)
      const minRam = server.gameDefinition.minRam

      if (newRam >= minRam) {
        return {
          action: 'scale-down',
          newRam,
          reason: `RAM utilization at ${(utilization * 100).toFixed(1)}%`
        }
      }
    }

    return { action: 'none' }
  }
}
```

---

### 3. Data Architecture

#### Database Schema (PostgreSQL)
```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  email_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE
);

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  rate_limit INTEGER DEFAULT 1000 -- requests per hour
);

-- Game Servers
CREATE TABLE games (
  id VARCHAR(50) PRIMARY KEY, -- 'minecraft', 'terraria', etc.
  name VARCHAR(255) NOT NULL,
  icon_url VARCHAR(500),
  container_image VARCHAR(500) NOT NULL,
  default_port INTEGER NOT NULL,
  min_ram_mb INTEGER NOT NULL,
  recommended_ram_mb INTEGER NOT NULL,
  ram_per_player_mb INTEGER NOT NULL,
  pricing_multiplier DECIMAL(3,2) DEFAULT 1.0,
  supports_mods BOOLEAN DEFAULT FALSE,
  supports_plugins BOOLEAN DEFAULT FALSE,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id VARCHAR(50) REFERENCES games(id),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'stopped', -- starting, running, stopping, stopped, crashed
  version VARCHAR(50),
  ram_mb INTEGER NOT NULL,
  cpu_cores DECIMAL(3,2) NOT NULL,
  storage_gb INTEGER NOT NULL,
  max_players INTEGER,
  port INTEGER,
  ip_address VARCHAR(45),
  region VARCHAR(50) DEFAULT 'us-east-1',
  pricing_model VARCHAR(20) DEFAULT 'fixed', -- fixed, pay-per-player
  created_at TIMESTAMP DEFAULT NOW(),
  last_started_at TIMESTAMP,
  last_stopped_at TIMESTAMP
);

CREATE INDEX idx_servers_user_id ON servers(user_id);
CREATE INDEX idx_servers_status ON servers(status);

-- Server Metrics (Time-series data - use TimescaleDB extension)
CREATE TABLE server_metrics (
  time TIMESTAMPTZ NOT NULL,
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  cpu_percent DECIMAL(5,2),
  ram_mb INTEGER,
  ram_limit_mb INTEGER,
  tps DECIMAL(5,2), -- ticks per second
  player_count INTEGER,
  network_in_mbps DECIMAL(10,2),
  network_out_mbps DECIMAL(10,2)
);

SELECT create_hypertable('server_metrics', 'time');
CREATE INDEX idx_server_metrics_server_id ON server_metrics(server_id, time DESC);

-- Player Activity
CREATE TABLE player_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  player_id VARCHAR(255) NOT NULL, -- Game-specific player ID
  player_name VARCHAR(255) NOT NULL,
  joined_at TIMESTAMP NOT NULL,
  left_at TIMESTAMP,
  ip_address INET
);

CREATE INDEX idx_player_sessions_server_id ON player_sessions(server_id);
CREATE INDEX idx_player_sessions_player_id ON player_sessions(player_id);

-- Billing
CREATE TABLE billing_plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ram_mb INTEGER NOT NULL,
  storage_gb INTEGER NOT NULL,
  max_players INTEGER NOT NULL,
  price_cents INTEGER NOT NULL, -- monthly price in cents
  backup_frequency VARCHAR(20), -- hourly, daily, etc.
  priority_support BOOLEAN DEFAULT FALSE
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) REFERENCES billing_plans(id),
  status VARCHAR(20) DEFAULT 'active', -- active, cancelled, suspended
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  cancelled_at TIMESTAMP
);

-- Pay-per-player billing
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  player_count INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_records_server_timestamp ON usage_records(server_id, timestamp);

-- Marketplace
CREATE TABLE marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- mod, plugin, map, texture_pack, config
  game_id VARCHAR(50) REFERENCES games(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  price_cents INTEGER DEFAULT 0, -- 0 for free
  file_url VARCHAR(500),
  file_size_bytes BIGINT,
  version VARCHAR(50),
  compatible_versions TEXT[], -- array of compatible game versions
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_marketplace_items_game_type ON marketplace_items(game_id, type);
CREATE INDEX idx_marketplace_items_featured ON marketplace_items(featured, rating DESC);

CREATE TABLE marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  server_id UUID REFERENCES servers(id) ON DELETE SET NULL,
  price_paid_cents INTEGER NOT NULL,
  stripe_payment_id VARCHAR(255),
  purchased_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(item_id, user_id)
);

-- Webhooks
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  secret VARCHAR(255) NOT NULL,
  events TEXT[] NOT NULL, -- array of event types to subscribe to
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_triggered_at TIMESTAMP
);

CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  delivered_at TIMESTAMP DEFAULT NOW(),
  retry_count INTEGER DEFAULT 0
);

CREATE INDEX idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id, delivered_at DESC);
```

#### Caching Strategy (Redis)
```typescript
/**
 * Redis caching for frequently accessed data
 */
class CacheService {
  private redis: Redis

  // Cache server status (30 second TTL)
  async cacheServerStatus(serverId: string, status: ServerStatus): Promise<void> {
    await this.redis.setex(
      `server:${serverId}:status`,
      30,
      JSON.stringify(status)
    )
  }

  // Cache player list (10 second TTL)
  async cachePlayerList(serverId: string, players: Player[]): Promise<void> {
    await this.redis.setex(
      `server:${serverId}:players`,
      10,
      JSON.stringify(players)
    )
  }

  // Cache API responses (60 second TTL)
  async cacheAPIResponse(key: string, data: any): Promise<void> {
    await this.redis.setex(
      `api:${key}`,
      60,
      JSON.stringify(data)
    )
  }

  // Rate limiting (using sliding window)
  async checkRateLimit(apiKey: string, limit: number): Promise<boolean> {
    const key = `ratelimit:${apiKey}`
    const now = Date.now()
    const window = 3600000 // 1 hour in milliseconds

    // Remove old entries
    await this.redis.zremrangebyscore(key, 0, now - window)

    // Count requests in current window
    const count = await this.redis.zcard(key)

    if (count >= limit) {
      return false // Rate limit exceeded
    }

    // Add current request
    await this.redis.zadd(key, now, `${now}:${Math.random()}`)
    await this.redis.expire(key, Math.ceil(window / 1000))

    return true
  }
}
```

---

### 4. API Architecture

#### REST API Design
```typescript
/**
 * API Routes (OpenAPI 3.0 compliant)
 */
const apiRoutes = {
  // Authentication
  'POST /api/v1/auth/login': loginHandler,
  'POST /api/v1/auth/register': registerHandler,
  'POST /api/v1/auth/refresh': refreshTokenHandler,

  // API Keys
  'GET /api/v1/api-keys': listAPIKeysHandler,
  'POST /api/v1/api-keys': createAPIKeyHandler,
  'DELETE /api/v1/api-keys/:id': deleteAPIKeyHandler,

  // Servers
  'GET /api/v1/servers': listServersHandler,
  'POST /api/v1/servers': createServerHandler,
  'GET /api/v1/servers/:id': getServerHandler,
  'PATCH /api/v1/servers/:id': updateServerHandler,
  'DELETE /api/v1/servers/:id': deleteServerHandler,

  // Server Control
  'POST /api/v1/servers/:id/start': startServerHandler,
  'POST /api/v1/servers/:id/stop': stopServerHandler,
  'POST /api/v1/servers/:id/restart': restartServerHandler,
  'POST /api/v1/servers/:id/command': executeCommandHandler,

  // Server Data
  'GET /api/v1/servers/:id/status': getServerStatusHandler,
  'GET /api/v1/servers/:id/players': getPlayersHandler,
  'GET /api/v1/servers/:id/metrics': getMetricsHandler,
  'GET /api/v1/servers/:id/logs': getLogsHandler,

  // Files
  'GET /api/v1/servers/:id/files': listFilesHandler,
  'GET /api/v1/servers/:id/files/*path': readFileHandler,
  'PUT /api/v1/servers/:id/files/*path': writeFileHandler,
  'DELETE /api/v1/servers/:id/files/*path': deleteFileHandler,

  // Backups
  'GET /api/v1/servers/:id/backups': listBackupsHandler,
  'POST /api/v1/servers/:id/backups': createBackupHandler,
  'POST /api/v1/backups/:id/restore': restoreBackupHandler,
  'DELETE /api/v1/backups/:id': deleteBackupHandler,

  // Marketplace
  'GET /api/v1/marketplace/items': browseMarketplaceHandler,
  'GET /api/v1/marketplace/items/:id': getMarketplaceItemHandler,
  'POST /api/v1/marketplace/items': createMarketplaceItemHandler,
  'POST /api/v1/marketplace/purchase': purchaseItemHandler,
  'POST /api/v1/marketplace/install': installItemHandler,

  // Webhooks
  'GET /api/v1/webhooks': listWebhooksHandler,
  'POST /api/v1/webhooks': createWebhookHandler,
  'DELETE /api/v1/webhooks/:id': deleteWebhookHandler,
  'POST /api/v1/webhooks/:id/test': testWebhookHandler,

  // Analytics
  'GET /api/v1/servers/:id/analytics': getAnalyticsHandler,
  'GET /api/v1/analytics/usage': getUsageAnalyticsHandler,
  'GET /api/v1/analytics/costs': getCostAnalyticsHandler
}
```

#### Rate Limiting & Security
```typescript
/**
 * API Gateway middleware
 */
class APIGateway {
  async authenticate(req: Request): Promise<User | null> {
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      return null
    }

    if (authHeader.startsWith('Bearer sk_')) {
      // API Key authentication
      return await this.authenticateAPIKey(authHeader.slice(7))
    } else if (authHeader.startsWith('Bearer ey')) {
      // JWT authentication
      return await this.authenticateJWT(authHeader.slice(7))
    }

    return null
  }

  async rateLimit(user: User, req: Request): Promise<boolean> {
    const limit = user.apiKeyLimit || 1000 // requests per hour
    return await this.cache.checkRateLimit(user.id, limit)
  }

  async handleRequest(req: Request): Promise<Response> {
    // 1. Authenticate
    const user = await this.authenticate(req)
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // 2. Rate limit
    const allowed = await this.rateLimit(user, req)
    if (!allowed) {
      return new Response('Rate limit exceeded', { status: 429 })
    }

    // 3. Route to handler
    const handler = this.getHandler(req.method, req.url)
    if (!handler) {
      return new Response('Not found', { status: 404 })
    }

    // 4. Execute handler
    try {
      return await handler(req, user)
    } catch (error) {
      console.error('API error:', error)
      return new Response('Internal server error', { status: 500 })
    }
  }
}
```

---

### 5. Real-Time Features

#### WebSocket Architecture
```typescript
/**
 * WebSocket server for real-time updates
 */
class WebSocketServer {
  private connections: Map<string, WebSocket> = new Map()

  async handleConnection(ws: WebSocket, user: User): Promise<void> {
    const connectionId = crypto.randomUUID()
    this.connections.set(connectionId, ws)

    ws.on('message', async (message) => {
      const data = JSON.parse(message.toString())

      switch (data.type) {
        case 'subscribe':
          await this.subscribe(connectionId, data.serverId)
          break
        case 'unsubscribe':
          await this.unsubscribe(connectionId, data.serverId)
          break
      }
    })

    ws.on('close', () => {
      this.connections.delete(connectionId)
    })
  }

  async broadcastServerUpdate(serverId: string, update: any): Promise<void> {
    const subscribers = await this.getSubscribers(serverId)

    for (const connectionId of subscribers) {
      const ws = this.connections.get(connectionId)
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'server_update',
          serverId,
          data: update
        }))
      }
    }
  }

  async broadcastPlayerJoin(serverId: string, player: Player): Promise<void> {
    await this.broadcastServerUpdate(serverId, {
      event: 'player_joined',
      player
    })
  }
}
```

---

## Security Architecture

### 1. Authentication & Authorization
- JWT tokens for user sessions (15 min expiry, refresh tokens valid for 30 days)
- API keys for programmatic access (SHA-256 hashed, rate-limited)
- OAuth 2.0 for third-party integrations
- 2FA support (TOTP)

### 2. Network Security
- All traffic over HTTPS (TLS 1.3)
- DDoS protection (Cloudflare/AWS Shield)
- WAF rules for common attacks
- IP-based rate limiting

### 3. Data Security
- Encryption at rest (AES-256)
- Encryption in transit (TLS)
- Database credentials in secrets manager
- Regular security audits

### 4. Server Isolation
- Each game server runs in isolated container
- Network policies restrict inter-server communication
- Resource quotas prevent resource exhaustion
- Security scanning of container images

---

## Performance Optimization

### 1. Database Optimization
- Connection pooling (max 100 connections)
- Query optimization (all queries < 100ms)
- Indexes on frequently queried fields
- Partitioning for large tables (metrics, logs)

### 2. Caching Strategy
- Redis for hot data (status, players, metrics)
- CDN for static assets (images, game files)
- API response caching (60s TTL)
- Browser caching for UI assets

### 3. Horizontal Scaling
- Stateless API servers (auto-scale based on CPU)
- Load balancing (round-robin with health checks)
- Database read replicas for analytics queries
- Queue-based async processing for heavy operations

---

## Monitoring & Observability

### Metrics Collection
```typescript
// Prometheus metrics
const serverCountGauge = new Gauge({
  name: 'quackhost_servers_total',
  help: 'Total number of game servers',
  labelNames: ['status', 'game']
})

const apiRequestDuration = new Histogram({
  name: 'quackhost_api_request_duration_seconds',
  help: 'API request duration',
  labelNames: ['method', 'path', 'status']
})

const playerCountGauge = new Gauge({
  name: 'quackhost_players_online',
  help: 'Number of players online',
  labelNames: ['server_id', 'game']
})
```

### Alerting Rules
- Server crash rate > 5% in 5 minutes
- API error rate > 1% in 1 minute
- Database query time > 500ms
- Disk usage > 90%
- CPU usage > 90% for 5 minutes

---

## Disaster Recovery

### Backup Strategy
1. **Database**: Daily full backups, hourly incremental backups
2. **Game Server Data**: Continuous backups to S3 (versioned)
3. **Configuration**: Git-tracked, versioned
4. **Retention**: 30 days for server data, 90 days for databases

### Failover Plan
1. Multi-region deployment (primary + failover)
2. RTO: 4 hours
3. RPO: 1 hour
4. Automated health checks and failover

---

## Migration Path

### Phase 1: Abstraction Layer (Week 1-2)
- Implement GameServer interface
- Migrate Minecraft to use interface
- Unit tests for abstraction layer

### Phase 2: Multi-Game Support (Week 3-4)
- Add Terraria and Valheim implementations
- Game registry system
- Template system for new games

### Phase 3: Dynamic Pricing (Week 5-6)
- Usage tracking system
- Billing integration (Stripe metered billing)
- Real-time cost estimation

### Phase 4: Marketplace (Week 7-10)
- Database schema and backend API
- Frontend UI for browsing/purchasing
- Payment processing
- Content moderation system

### Phase 5: Public API (Week 11-12)
- API gateway setup
- Rate limiting and authentication
- Documentation (Swagger/OpenAPI)
- SDK generation (Python, JavaScript, Go)

---

## Conclusion

This architecture supports:
- **Scalability**: 10,000+ concurrent servers
- **Flexibility**: Easy to add new games
- **Developer-Friendly**: Full API access
- **Cost-Efficient**: Dynamic resource allocation
- **Reliable**: 99.9% uptime SLA

The modular design allows incremental implementation, minimizing risk while delivering value quickly.
