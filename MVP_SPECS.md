# MVP Feature Specifications

Detailed specifications for the Top 5 Priority features to ship in first 90 days.

---

## 1. Pricing Page

**Priority Score**: 9.2
**Timeline**: Week 1
**Owner**: Design + Frontend
**Dependencies**: None

### Objective
Create a transparent, compelling pricing page that converts visitors to customers.

### User Stories
- As a potential customer, I want to see clear pricing so I can decide if QuackHost fits my budget
- As a potential customer, I want to compare different tiers so I can pick the right plan
- As a potential customer, I want to see what games are supported so I know if my game is available

### Requirements

#### Functional Requirements
1. Display 3-4 pricing tiers clearly
2. Show what's included in each tier
3. Highlight most popular tier
4. Support monthly/annual billing toggle (annual = 2 months free)
5. FAQ section answering common pricing questions
6. "Launch your server" CTA button on each tier
7. Mobile-responsive design

#### Non-Functional Requirements
- Page load time < 1.5s
- Lighthouse score > 95
- A/B testable (different pricing displays)
- SEO optimized for "minecraft server hosting pricing"

### Design Mockup

```
┌────────────────────────────────────────────────────┐
│                  QuackHost Pricing                  │
│          Simple, transparent, no surprises          │
│                                                     │
│    [Monthly] / [Annual (Save 17%)]  ← Toggle       │
│                                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐│
│  │  Basic  │  │Standard │  │ Premium │  │ Custom ││
│  │         │  │ ⭐POPULAR│  │         │  │        ││
│  │  $15/mo │  │  $30/mo │  │  $60/mo │  │ Contact││
│  │         │  │         │  │         │  │        ││
│  │ 2GB RAM │  │ 4GB RAM │  │ 8GB RAM │  │ Custom ││
│  │ 2 vCPU  │  │ 4 vCPU  │  │ 8 vCPU  │  │ specs  ││
│  │ 10GB SSD│  │ 25GB SSD│  │ 50GB SSD│  │        ││
│  │ 10 slots│  │ 25 slots│  │ 50 slots│  │        ││
│  │ 5 backups│ │20 backups│ │∞ backups│  │        ││
│  │         │  │         │  │         │  │        ││
│  │[Launch] │  │[Launch] │  │[Launch] │  │[Contact││
│  └─────────┘  └─────────┘  └─────────┘  └────────┘│
│                                                     │
│  ✓ DDoS Protection        ✓ 99.9% Uptime SLA       │
│  ✓ Automatic Backups      ✓ 24/7 Support           │
│  ✓ One-Click Modpacks     ✓ Full FTP Access        │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Frequently Asked Questions                  │  │
│  │  ▼ What payment methods do you accept?       │  │
│  │  ▼ Can I upgrade/downgrade anytime?          │  │
│  │  ▼ Do you offer refunds?                     │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

### Pricing Strategy

```yaml
Basic:
  price: $15/mo ($150/yr)
  ram: 2GB
  cpu: 2 vCPU
  storage: 10GB
  players: 10
  backups: 5 rolling
  support: Email (24h response)

Standard:
  price: $30/mo ($300/yr)
  ram: 4GB
  cpu: 4 vCPU
  storage: 25GB
  players: 25
  backups: 20 rolling
  support: Priority email (12h response)

Premium:
  price: $60/mo ($600/yr)
  ram: 8GB
  cpu: 8 vCPU
  storage: 50GB
  players: 50
  backups: Unlimited
  support: Priority + live chat

Enterprise:
  price: Custom
  specs: Custom
  support: Dedicated account manager
  sla: Custom SLA
```

### Success Metrics
- **Primary**: Conversion rate (visitor → signup) > 3%
- **Secondary**: Time on page > 45 seconds
- **Bounce rate**: < 60%
- **Most popular tier**: Standard (targeting 60% of sales)

### Implementation Tasks
- [ ] Design pricing card components
- [ ] Build pricing calculator (for annual toggle)
- [ ] Add FAQ accordion (Alpine.js)
- [ ] Implement analytics tracking
- [ ] A/B test: 3 tiers vs 4 tiers
- [ ] SEO optimization

### Open Questions
- Should we show competitor comparison?
- Offer free tier? (10 players, 1GB RAM, limited features)
- Display current promotions/discounts?

---

## 2. Multi-Game Support

**Priority Score**: 8.5
**Timeline**: Weeks 3-10
**Owner**: Backend + DevOps
**Dependencies**: Kubernetes cluster, Docker images

### Objective
Support 3 games beyond Minecraft: Valheim, Palworld, Terraria

### User Stories
- As a gamer, I want to host a Valheim server so my friends and I can play together
- As a multi-game community, I want to manage servers for different games from one dashboard
- As a server owner, I want to switch my server between games easily

### Requirements

#### Supported Games (MVP)
1. **Minecraft** (Java & Bedrock)
2. **Valheim**
3. **Palworld**
4. **Terraria**

#### Functional Requirements
1. User can select game type during server creation
2. Game-specific configuration options displayed
3. One-click server creation for each game
4. Console access works for all games
5. File manager supports game-specific file structures
6. Backups work for all game types

#### Non-Functional Requirements
- Server provisioning time < 2 minutes for all games
- Support same resource tiers across games
- Unified billing regardless of game type

### Technical Approach

#### Game Abstraction Layer

```typescript
interface GameServer {
  // Common interface for all games
  type: GameType;
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;
  getStatus(): Promise<ServerStatus>;
  executeCommand(cmd: string): Promise<string>;
  getPlayerCount(): Promise<number>;
  getConfig(): Promise<GameConfig>;
  updateConfig(config: GameConfig): Promise<void>;
}

enum GameType {
  MINECRAFT_JAVA = 'minecraft-java',
  MINECRAFT_BEDROCK = 'minecraft-bedrock',
  VALHEIM = 'valheim',
  PALWORLD = 'palworld',
  TERRARIA = 'terraria',
}
```

#### Docker Images

```dockerfile
# minecraft-java
FROM openjdk:17-slim
RUN apt-get update && apt-get install -y wget
WORKDIR /server
COPY start.sh /start.sh
CMD ["/start.sh"]

# valheim
FROM cm2network/steamcmd:latest
WORKDIR /valheim
RUN steamcmd +login anonymous +app_update 896660 validate +quit
CMD ["./valheim_server.x86_64"]

# palworld
FROM steamcmd/steamcmd:latest
WORKDIR /palworld
RUN steamcmd +login anonymous +app_update 2394010 validate +quit
CMD ["./PalServer.sh"]

# terraria
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y wget unzip
WORKDIR /terraria
RUN wget https://terraria.org/api/download/pc-dedicated-server/terraria-server.zip
CMD ["./TerrariaServer.bin.x86_64"]
```

#### Game-Specific Configurations

```typescript
// Minecraft
interface MinecraftConfig {
  serverProperties: {
    'server-port': number;
    'max-players': number;
    difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
    gamemode: 'survival' | 'creative' | 'adventure';
    'pvp': boolean;
    'view-distance': number;
  };
  javaOpts: string;
  version: string;
  type: 'vanilla' | 'paper' | 'spigot' | 'forge';
}

// Valheim
interface ValheimConfig {
  worldName: string;
  serverName: string;
  password: string;
  publicServer: boolean;
  port: number;
  worldSavePath: string;
}

// Palworld
interface PalworldConfig {
  serverName: string;
  serverPassword: string;
  publicPort: number;
  maxPlayers: number;
  difficulty: 'Normal' | 'Hard';
  dayTimeSpeedRate: number;
  nightTimeSpeedRate: number;
}

// Terraria
interface TerrariaConfig {
  worldName: string;
  worldPath: string;
  maxPlayers: number;
  port: number;
  password: string;
  difficulty: 0 | 1 | 2 | 3; // Normal, Expert, Master, Journey
}
```

### UI Changes

#### Server Creation Flow

```
Step 1: Select Game
┌────────────────────────────────────┐
│  Choose your game:                  │
│                                     │
│  [🎮 Minecraft]  [⚔️  Valheim]      │
│  [🦖 Palworld]   [🌟 Terraria]      │
│                                     │
│  More games coming soon!            │
└────────────────────────────────────┘

Step 2: Select Plan
┌────────────────────────────────────┐
│  Minecraft Server Plans:            │
│                                     │
│  ○ Basic ($15/mo)  - 10 players    │
│  ◉ Standard ($30/mo) - 25 players  │
│  ○ Premium ($60/mo) - 50 players   │
└────────────────────────────────────┘

Step 3: Configure
┌────────────────────────────────────┐
│  Server Name: [My Awesome Server]  │
│  Version: [1.20.4 ▼]               │
│  Game Mode: [Survival ▼]           │
│  Difficulty: [Normal ▼]            │
│  Max Players: [25]                 │
│                                     │
│  [Advanced Settings ▼]             │
└────────────────────────────────────┘

Step 4: Review & Launch
┌────────────────────────────────────┐
│  Order Summary:                     │
│  Game: Minecraft Java               │
│  Plan: Standard ($30/mo)            │
│  Region: US-East                    │
│                                     │
│  [🚀 Launch Server]                │
└────────────────────────────────────┘
```

### Success Metrics
- **Primary**: 30% of new servers are non-Minecraft games
- **Server creation success rate**: > 95% for all games
- **Time to provision**: < 2min average across all games
- **Customer satisfaction**: NPS > 50 for each game type

### Implementation Tasks

**Phase 1: Foundation (Weeks 3-5)**
- [ ] Design game abstraction layer
- [ ] Build Kubernetes templates for each game
- [ ] Create Docker images for each game
- [ ] Test server lifecycle (start/stop/restart)

**Phase 2: Integration (Weeks 6-8)**
- [ ] Update API to support game selection
- [ ] Add game-specific config UIs
- [ ] Implement file manager for each game
- [ ] Build console parser for each game

**Phase 3: Polish (Weeks 9-10)**
- [ ] Write documentation for each game
- [ ] Create one-click setup templates
- [ ] Add game-specific metrics
- [ ] Test backup/restore for all games

### Risks & Mitigation
- **Risk**: Game updates break our servers
  - **Mitigation**: Pin game versions, allow user override
- **Risk**: Different games have different resource needs
  - **Mitigation**: Game-specific resource recommendations
- **Risk**: Support overhead for new games
  - **Mitigation**: Comprehensive docs, community forums

---

## 3. QuackPlane Core Features

**Priority Score**: 8.3
**Timeline**: Weeks 3-12 (parallel with multi-game)
**Owner**: Full-stack team
**Dependencies**: API, Kubernetes

### Objective
Build the essential control panel features that let users manage their servers.

### User Stories
- As a server owner, I want to start/stop my server so I can control when it's running
- As a server owner, I want to view the console so I can see what's happening
- As a server owner, I want to upload files so I can add mods/plugins
- As a server owner, I want to restore from backup so I can recover from issues

### Core Features

#### 3.1 Dashboard

**Purpose**: Overview of all servers at a glance

**Features**:
- List of all user's servers
- Server status (running, stopped, error)
- Quick actions (start, stop, restart, delete)
- Resource usage graphs
- Recent activity log

**UI Layout**:
```
┌────────────────────────────────────────────────────┐
│  QuackPlane Dashboard                    [+ New]   │
├────────────────────────────────────────────────────┤
│  My Servers (3)                                    │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │ 🎮 Minecraft Server #1        ● Running      │ │
│  │ 12/25 players online                         │ │
│  │ CPU: 45%  RAM: 2.1GB/4GB                     │ │
│  │ [Console] [Files] [Backups] [⚙️ Settings]    │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │ ⚔️  Valheim Server             ● Stopped     │ │
│  │ 0/10 players online                          │ │
│  │ [▶️ Start] [Files] [⚙️ Settings]              │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
│  Recent Activity:                                  │
│  • Server #1 restarted - 2 hours ago              │
│  • Backup created - 1 day ago                     │
│  • mod_xyz.jar uploaded - 2 days ago              │
└────────────────────────────────────────────────────┘
```

#### 3.2 Console

**Purpose**: Real-time server console access

**Features**:
- Live console output (WebSocket)
- Execute commands
- Auto-scroll
- Search console history
- Export logs

**Technical Implementation**:
```typescript
// WebSocket connection
const ws = new WebSocket(`wss://api.quackhost.com/v1/servers/${serverId}/console`);

ws.onmessage = (event) => {
  const logLine = JSON.parse(event.data);
  appendToConsole(logLine);
};

// Send command
function sendCommand(cmd: string) {
  ws.send(JSON.stringify({ type: 'command', data: cmd }));
}
```

**UI**:
```
┌────────────────────────────────────────────────────┐
│  Console - Minecraft Server #1                     │
├────────────────────────────────────────────────────┤
│  [2024-11-16 10:23:45] [Server thread/INFO]:      │
│  Starting Minecraft server on *:25565              │
│  [2024-11-16 10:23:46] [Server thread/INFO]:      │
│  Preparing level "world"                           │
│  [2024-11-16 10:23:52] [Server thread/INFO]:      │
│  Done (6.234s)! For help, type "help"             │
│  [2024-11-16 10:24:15] [User Authenticator/INFO]: │
│  UUID of player Steve is abc-123-def-456          │
│  [2024-11-16 10:24:15] [Server thread/INFO]:      │
│  Steve joined the game                             │
│  ▼ Auto-scroll ☑️   [Search] [Export]              │
├────────────────────────────────────────────────────┤
│  > /say Hello world                   [Send]      │
└────────────────────────────────────────────────────┘
```

#### 3.3 File Manager

**Purpose**: Manage server files without FTP

**Features**:
- Browse directory tree
- Upload files (drag & drop)
- Download files
- Edit text files (configs, scripts)
- Delete files/folders
- Create new files/folders
- Search files

**UI**:
```
┌────────────────────────────────────────────────────┐
│  File Manager - Minecraft Server #1                │
├────────────────────────────────────────────────────┤
│  📁 server/                        [↑ Upload]      │
│    📁 plugins/                                     │
│      📄 plugin1.jar                 1.2 MB         │
│      📄 plugin2.jar                 850 KB         │
│    📁 world/                                       │
│      📄 level.dat                   5 KB           │
│      📁 region/                                    │
│    📁 config/                                      │
│      📄 server.properties           2 KB  [Edit]   │
│      📄 bukkit.yml                  1 KB  [Edit]   │
│    📄 server.jar                    45 MB          │
│    📄 eula.txt                      150 B  [Edit]  │
│                                                     │
│  💡 Drag files here to upload                      │
└────────────────────────────────────────────────────┘
```

**Technical Implementation**:
```typescript
// File upload (chunked for large files)
async function uploadFile(file: File, path: string) {
  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  const chunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < chunks; i++) {
    const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', i.toString());
    formData.append('totalChunks', chunks.toString());
    formData.append('path', path);

    await fetch(`/api/v1/servers/${serverId}/files/upload`, {
      method: 'POST',
      body: formData,
    });
  }
}

// File editor
function openFileEditor(path: string) {
  // Fetch file content
  const content = await fetch(`/api/v1/servers/${serverId}/files?path=${path}`);

  // Show Monaco editor (VSCode editor)
  showEditor(content, {
    language: detectLanguage(path),
    onSave: (newContent) => saveFile(path, newContent),
  });
}
```

#### 3.4 Backup & Restore

**Purpose**: Protect server data

**Features**:
- Manual backup creation
- Scheduled backups (cron)
- List backups with timestamps
- Download backup
- Restore from backup
- Delete old backups

**UI**:
```
┌────────────────────────────────────────────────────┐
│  Backups - Minecraft Server #1                     │
├────────────────────────────────────────────────────┤
│  Schedule: [Daily at 3:00 AM ▼]  [Enable ☑️]       │
│  Retention: Keep last [7] backups                  │
│                                                     │
│  [+ Create Backup Now]                             │
│                                                     │
│  Recent Backups:                                   │
│  ┌────────────────────────────────────────────┐   │
│  │ 📦 2024-11-16 03:00:15    1.2 GB           │   │
│  │    [Restore] [Download] [Delete]           │   │
│  └────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────┐   │
│  │ 📦 2024-11-15 03:00:12    1.1 GB           │   │
│  │    [Restore] [Download] [Delete]           │   │
│  └────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────┐   │
│  │ 📦 2024-11-14 03:00:09    1.1 GB           │   │
│  │    [Restore] [Download] [Delete]           │   │
│  └────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

**Restore Flow**:
```
1. User clicks [Restore]
2. Show confirmation modal:
   ┌──────────────────────────────────────┐
   │  ⚠️  Restore from backup?            │
   │                                      │
   │  This will REPLACE all current       │
   │  server files with the backup from:  │
   │  2024-11-15 03:00:12                 │
   │                                      │
   │  Your server will be stopped and     │
   │  restarted. This may take a few      │
   │  minutes.                            │
   │                                      │
   │  [Cancel]  [Yes, Restore]            │
   └──────────────────────────────────────┘
3. Stop server
4. Download backup from S3
5. Extract to server directory
6. Start server
7. Show success notification
```

#### 3.5 Server Settings

**Purpose**: Configure server options

**Features**:
- General settings (name, game version)
- Resource limits (RAM, CPU)
- Network settings (port, domain)
- Game-specific configs
- Startup commands
- Environment variables

**UI**:
```
┌────────────────────────────────────────────────────┐
│  Settings - Minecraft Server #1                    │
├────────────────────────────────────────────────────┤
│  General                                           │
│    Server Name: [My Awesome Server_____]          │
│    Game Version: [1.20.4 ▼]                       │
│    Region: [US-East ▼]                            │
│                                                     │
│  Resources                                         │
│    Plan: Standard (4GB RAM, 4 vCPU)               │
│    [Upgrade Plan]                                  │
│                                                     │
│  Network                                           │
│    IP Address: 12.34.56.78 (read-only)            │
│    Port: [25565]                                   │
│    Custom Domain: [server.example.com_]           │
│                                                     │
│  Game Configuration                                │
│    Max Players: [25]                              │
│    Game Mode: [Survival ▼]                        │
│    Difficulty: [Normal ▼]                         │
│    PVP: [Enabled ☑️]                               │
│    View Distance: [10] chunks                     │
│                                                     │
│  Advanced                                          │
│    Java Options: [-Xmx3600M -Xms3600M____]        │
│    Startup Command: [java -jar server.jar___]     │
│                                                     │
│  Danger Zone                                       │
│    [🗑️  Delete Server]                             │
│                                                     │
│  [Save Changes]                                    │
└────────────────────────────────────────────────────┘
```

### Success Metrics
- **User activation**: 80% of signups create a server within 24h
- **Feature adoption**: 70% use console, 60% use file manager, 50% use backups
- **Support tickets**: < 0.5 tickets per server per month
- **User satisfaction**: NPS > 40

### Implementation Tasks

**Week 3-4: Foundation**
- [ ] Build dashboard page with server list
- [ ] Implement start/stop/restart actions
- [ ] Show server status in real-time

**Week 5-6: Console**
- [ ] WebSocket server for console streaming
- [ ] Console UI component
- [ ] Command execution
- [ ] Log search and export

**Week 7-9: File Manager**
- [ ] File tree API endpoint
- [ ] File upload (chunked)
- [ ] File download
- [ ] File editor (Monaco)
- [ ] Drag & drop UI

**Week 10-11: Backups**
- [ ] Manual backup creation
- [ ] Scheduled backups (cron jobs)
- [ ] Backup listing
- [ ] Restore functionality
- [ ] Backup retention policies

**Week 12: Settings & Polish**
- [ ] Settings page with all options
- [ ] Server deletion flow
- [ ] Resource upgrade flow
- [ ] Help documentation
- [ ] Onboarding tutorial

---

## 4. REST API v1

**Priority Score**: 7.8
**Timeline**: Weeks 6-12 (parallel with QuackPlane)
**Owner**: Backend team
**Dependencies**: Core services

### Objective
Provide a comprehensive API for developers to programmatically manage servers.

### User Stories
- As a developer, I want to create servers via API so I can automate deployments
- As a power user, I want to script server management so I can batch operations
- As an integration partner, I want to white-label QuackHost into my platform

### API Design Principles
1. **RESTful**: Follow REST conventions
2. **Versioned**: /v1/, /v2/ for backwards compatibility
3. **Consistent**: Same patterns across all endpoints
4. **Well-documented**: OpenAPI/Swagger spec
5. **Secure**: API key authentication, rate limiting

### Authentication

```http
# API Key in header
GET /v1/servers
Authorization: Bearer qh_live_abc123xyz456...
```

**API Key Management**:
- Users create keys in dashboard
- Scoped permissions (read-only, read-write)
- Rate limits per key
- Key rotation recommended every 90 days

### Core Endpoints

#### Servers

```http
# List servers
GET /v1/servers
Response: 200 OK
{
  "data": [
    {
      "id": "srv_123abc",
      "name": "My Server",
      "game": "minecraft-java",
      "status": "running",
      "ip": "12.34.56.78",
      "port": 25565,
      "players": {
        "online": 12,
        "max": 25
      },
      "plan": "standard",
      "created_at": "2024-11-01T12:00:00Z"
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "per_page": 10
  }
}

# Create server
POST /v1/servers
Request:
{
  "name": "New Server",
  "game": "valheim",
  "plan": "standard",
  "region": "us-east",
  "config": {
    "worldName": "MyWorld",
    "password": "secret123"
  }
}
Response: 201 Created
{
  "id": "srv_456def",
  "status": "provisioning",
  "estimated_ready": "2024-11-16T10:30:00Z"
}

# Get server
GET /v1/servers/:id
Response: 200 OK
{
  "id": "srv_123abc",
  "name": "My Server",
  "status": "running",
  ...
}

# Update server
PATCH /v1/servers/:id
Request:
{
  "name": "Renamed Server",
  "config": {
    "maxPlayers": 30
  }
}
Response: 200 OK

# Delete server
DELETE /v1/servers/:id
Response: 204 No Content

# Start server
POST /v1/servers/:id/start
Response: 200 OK
{ "status": "starting" }

# Stop server
POST /v1/servers/:id/stop
Response: 200 OK
{ "status": "stopping" }

# Restart server
POST /v1/servers/:id/restart
Response: 200 OK
{ "status": "restarting" }
```

#### Files

```http
# List files
GET /v1/servers/:id/files?path=/plugins
Response: 200 OK
{
  "files": [
    {
      "name": "plugin1.jar",
      "type": "file",
      "size": 1245632,
      "modified_at": "2024-11-15T08:30:00Z"
    },
    {
      "name": "configs",
      "type": "directory",
      "modified_at": "2024-11-14T12:00:00Z"
    }
  ]
}

# Read file
GET /v1/servers/:id/files/content?path=/server.properties
Response: 200 OK
Content-Type: text/plain
server-port=25565
max-players=25
...

# Write file
PUT /v1/servers/:id/files/content?path=/server.properties
Request:
Content-Type: text/plain
server-port=25565
max-players=30
...
Response: 200 OK

# Delete file
DELETE /v1/servers/:id/files?path=/old-plugin.jar
Response: 204 No Content

# Upload file
POST /v1/servers/:id/files/upload
Request:
Content-Type: multipart/form-data
file: [binary data]
path: /plugins/new-plugin.jar
Response: 201 Created
```

#### Backups

```http
# List backups
GET /v1/servers/:id/backups
Response: 200 OK
{
  "backups": [
    {
      "id": "bak_789ghi",
      "size_bytes": 1234567890,
      "created_at": "2024-11-16T03:00:00Z",
      "status": "completed"
    }
  ]
}

# Create backup
POST /v1/servers/:id/backups
Response: 202 Accepted
{
  "id": "bak_101jkl",
  "status": "creating"
}

# Restore backup
POST /v1/servers/:id/backups/:backup_id/restore
Response: 202 Accepted
{
  "status": "restoring",
  "estimated_completion": "2024-11-16T10:35:00Z"
}

# Delete backup
DELETE /v1/servers/:id/backups/:backup_id
Response: 204 No Content
```

#### Metrics

```http
# Get metrics
GET /v1/servers/:id/metrics?start=2024-11-16T00:00:00Z&end=2024-11-16T12:00:00Z
Response: 200 OK
{
  "metrics": {
    "cpu_percent": [
      { "time": "2024-11-16T00:00:00Z", "value": 45.2 },
      { "time": "2024-11-16T00:05:00Z", "value": 48.1 },
      ...
    ],
    "memory_mb": [...],
    "players_online": [...]
  }
}
```

### Rate Limiting

```http
# Rate limit headers in response
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1700140800

# When rate limited
Response: 429 Too Many Requests
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Try again in 30 seconds.",
    "retry_after": 30
  }
}
```

**Limits**:
- Free tier: 100 req/hour
- Paid tier: 1000 req/hour
- Enterprise: 10000 req/hour

### Error Handling

```http
# Consistent error format
Response: 4xx or 5xx
{
  "error": {
    "code": "server_not_found",
    "message": "Server with ID srv_123 not found",
    "details": {
      "server_id": "srv_123"
    },
    "docs_url": "https://docs.quackhost.com/errors/server_not_found"
  }
}
```

**Error Codes**:
- 400: `invalid_request`, `validation_error`
- 401: `unauthorized`, `invalid_api_key`
- 403: `forbidden`, `insufficient_permissions`
- 404: `server_not_found`, `file_not_found`
- 429: `rate_limit_exceeded`
- 500: `internal_error`
- 503: `service_unavailable`

### SDK & Tools

**Node.js SDK**:
```javascript
const QuackHost = require('@quackhost/sdk');

const client = new QuackHost({ apiKey: 'qh_live_...' });

// Create server
const server = await client.servers.create({
  name: 'My Server',
  game: 'minecraft-java',
  plan: 'standard',
});

// Start server
await client.servers.start(server.id);

// Get metrics
const metrics = await client.servers.getMetrics(server.id, {
  start: '2024-11-16T00:00:00Z',
  end: '2024-11-16T12:00:00Z',
});
```

**CLI Tool**:
```bash
# Install
npm install -g @quackhost/cli

# Configure
quackhost configure --api-key qh_live_...

# List servers
quackhost servers list

# Create server
quackhost servers create \
  --name "My Server" \
  --game minecraft-java \
  --plan standard

# Start server
quackhost servers start srv_123

# View logs
quackhost servers logs srv_123 --follow
```

### Documentation

**Interactive Docs**: https://docs.quackhost.com/api
- OpenAPI/Swagger UI
- Try it out with your API key
- Code examples in multiple languages
- Comprehensive guides

**Coverage**:
- Getting started
- Authentication
- Rate limiting
- Error handling
- Webhook events
- Best practices
- Example integrations

### Success Metrics
- **API adoption**: 100 developers using API in first 3 months
- **API usage**: 10% of operations via API
- **Community projects**: 3+ open-source integrations
- **Developer satisfaction**: 4.5+ star rating on API quality

### Implementation Tasks

**Week 6-7: Foundation**
- [ ] Design API endpoints (OpenAPI spec)
- [ ] Implement authentication middleware
- [ ] Build rate limiting system
- [ ] Error handling framework

**Week 8-9: Core Endpoints**
- [ ] Server CRUD endpoints
- [ ] Server lifecycle (start/stop/restart)
- [ ] File management endpoints
- [ ] Backup endpoints

**Week 10: Metrics & Advanced**
- [ ] Metrics endpoints
- [ ] WebSocket for console
- [ ] Pagination & filtering
- [ ] Search functionality

**Week 11: SDKs & Tools**
- [ ] Node.js SDK
- [ ] CLI tool
- [ ] Python SDK (if time permits)

**Week 12: Documentation**
- [ ] OpenAPI spec complete
- [ ] Interactive docs site
- [ ] Getting started guide
- [ ] Code examples
- [ ] Video tutorials

---

## 5. One-Click Modpack Deployment

**Priority Score**: 7.5
**Timeline**: Weeks 4-8
**Owner**: DevOps + Frontend
**Dependencies**: Multi-game support, file manager

### Objective
Allow users to deploy popular Minecraft modpacks with one click.

### User Stories
- As a player, I want to instantly play All The Mods 9 without manual setup
- As a server owner, I want to switch modpacks without losing my subscription
- As a community, I want pre-configured modpacks that just work

### Supported Modpacks (MVP)

```yaml
Minecraft Java Modpacks:
  1. All The Mods 9 (ATM9)
     - Version: 0.2.60
     - Minecraft: 1.20.1
     - Forge: 47.2.0
     - Mods: 400+
     - Min RAM: 6GB (recommend 8GB)

  2. RLCraft
     - Version: 2.9.3
     - Minecraft: 1.12.2
     - Forge: 14.23.5.2860
     - Mods: 120+
     - Min RAM: 4GB (recommend 6GB)

  3. Create: Above & Beyond
     - Version: 1.4
     - Minecraft: 1.16.5
     - Forge: 36.2.39
     - Mods: 250+
     - Min RAM: 4GB (recommend 6GB)

  4. Vault Hunters
     - Version: 3.13.3
     - Minecraft: 1.18.2
     - Forge: 40.2.9
     - Mods: 100+
     - Min RAM: 6GB (recommend 8GB)

  5. FTB Skies
     - Version: 1.1.1
     - Minecraft: 1.19.2
     - Forge: 43.3.5
     - Mods: 200+
     - Min RAM: 6GB (recommend 8GB)
```

### User Flow

```
Step 1: Modpack Selection
┌────────────────────────────────────────────────────┐
│  Choose a Modpack                                  │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │   ATM9   │  │ RLCraft  │  │  Create  │         │
│  │          │  │          │  │  Above & │         │
│  │  [Select]│  │  [Select]│  │  Beyond  │  ...    │
│  │          │  │          │  │  [Select]│         │
│  │ Req: 8GB │  │ Req: 6GB │  │ Req: 6GB │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                     │
│  Or install vanilla Minecraft [Select]             │
└────────────────────────────────────────────────────┘

Step 2: Plan Selection (with recommendations)
┌────────────────────────────────────────────────────┐
│  ATM9 requires at least 8GB RAM                    │
│                                                     │
│  ○ Standard (4GB) - Too small ❌                   │
│  ◉ Premium (8GB) - Recommended ✅                  │
│  ○ Custom (16GB) - Butter smooth ✅                │
│                                                     │
│  [Continue]                                        │
└────────────────────────────────────────────────────┘

Step 3: Server Details
┌────────────────────────────────────────────────────┐
│  Server Name: [My ATM9 Server_____]               │
│  Region: [US-East ▼]                              │
│                                                     │
│  Modpack: All The Mods 9 v0.2.60                  │
│  Minecraft: 1.20.1                                │
│  Estimated setup time: 5 minutes                   │
│                                                     │
│  [🚀 Create Server]                                │
└────────────────────────────────────────────────────┘

Step 4: Provisioning (progress bar)
┌────────────────────────────────────────────────────┐
│  Setting up your server...                        │
│                                                     │
│  ✓ Creating server infrastructure                 │
│  ✓ Downloading modpack (1.2 GB)                   │
│  ⏳ Installing 400+ mods...                        │
│  ⏳ Configuring server settings                    │
│  ⏳ Starting server                                │
│                                                     │
│  Progress: ████████░░░░░░░░░░ 45%                │
│  Time remaining: ~3 minutes                        │
└────────────────────────────────────────────────────┘

Step 5: Success!
┌────────────────────────────────────────────────────┐
│  🎉 Your server is ready!                          │
│                                                     │
│  Server IP: play.quackhost.com:25565              │
│  Modpack: All The Mods 9                          │
│                                                     │
│  Next steps:                                       │
│  1. Download the ATM9 client modpack              │
│  2. Install via CurseForge or ATLauncher          │
│  3. Connect to play.quackhost.com:25565           │
│                                                     │
│  [View Console] [Manage Server]                   │
└────────────────────────────────────────────────────┘
```

### Technical Implementation

#### Modpack Storage

```
S3 Bucket: quackhost-modpacks

/minecraft-java/
  /atm9/
    /0.2.60/
      server-files.zip (1.2 GB)
      manifest.json
      server.properties.template
      README.md
  /rlcraft/
    /2.9.3/
      server-files.zip (850 MB)
      manifest.json
      ...
```

#### Manifest Format

```json
{
  "name": "All The Mods 9",
  "version": "0.2.60",
  "minecraft_version": "1.20.1",
  "forge_version": "47.2.0",
  "mod_loader": "forge",
  "min_ram_gb": 8,
  "recommended_ram_gb": 12,
  "server_files": {
    "url": "s3://quackhost-modpacks/minecraft-java/atm9/0.2.60/server-files.zip",
    "size_bytes": 1258291200,
    "sha256": "abc123..."
  },
  "java_opts": "-Xmx{RAM}M -Xms{RAM}M -XX:+UseG1GC",
  "startup_command": "java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.20.1-47.2.0/unix_args.txt nogui",
  "default_config": {
    "server-port": 25565,
    "max-players": 20,
    "view-distance": 8,
    "difficulty": "normal"
  },
  "client_download": {
    "curseforge": "https://www.curseforge.com/minecraft/modpacks/all-the-mods-9",
    "modrinth": "https://modrinth.com/modpack/atm9"
  }
}
```

#### Deployment Process

```typescript
async function deployModpack(serverId: string, modpackId: string, version: string) {
  // 1. Get modpack manifest
  const manifest = await getModpackManifest(modpackId, version);

  // 2. Validate server resources
  const server = await getServer(serverId);
  if (server.ramMb < manifest.min_ram_gb * 1024) {
    throw new Error(`Server needs at least ${manifest.min_ram_gb}GB RAM`);
  }

  // 3. Stop server if running
  if (server.status === 'running') {
    await stopServer(serverId);
  }

  // 4. Download modpack files from S3
  await downloadModpackFiles(manifest.server_files.url, serverId);

  // 5. Extract files to server directory
  await extractModpackFiles(serverId);

  // 6. Apply server configuration
  await applyModpackConfig(serverId, manifest.default_config);

  // 7. Update server startup command
  await updateServerStartup(serverId, manifest.startup_command, manifest.java_opts);

  // 8. Start server
  await startServer(serverId);

  // 9. Monitor first startup (may take 5-10 min)
  await waitForServerReady(serverId, { timeout: 600000 });

  return {
    status: 'ready',
    client_download: manifest.client_download
  };
}
```

### Modpack Updates

**Auto-Update Feature**:
- Notify users when new modpack version available
- One-click update (creates backup first)
- Option to stay on current version
- Rollback if update fails

```
┌────────────────────────────────────────────────────┐
│  🔔 Update Available                               │
│                                                     │
│  All The Mods 9 v0.2.61 is now available          │
│  Your version: 0.2.60                             │
│                                                     │
│  What's new:                                       │
│  • Added 5 new mods                               │
│  • Fixed memory leak issue                        │
│  • Updated 20+ existing mods                      │
│                                                     │
│  ⚠️  A backup will be created before updating      │
│                                                     │
│  [Update Now] [Remind Me Later] [Skip This Update]│
└────────────────────────────────────────────────────┘
```

### Success Metrics
- **Adoption**: 40% of new servers use modpacks
- **Success rate**: > 95% successful deployments
- **Time to ready**: < 5 minutes average
- **User satisfaction**: NPS > 60 for modpack users

### Implementation Tasks

**Week 4-5: Infrastructure**
- [ ] Create S3 bucket for modpacks
- [ ] Build modpack manifest format
- [ ] Upload top 5 modpacks
- [ ] Test deployment automation

**Week 6-7: UI & Integration**
- [ ] Modpack selection UI
- [ ] Plan recommendation logic
- [ ] Progress tracking during deployment
- [ ] Client download instructions

**Week 8: Polish & Testing**
- [ ] Update notification system
- [ ] Automated testing for each modpack
- [ ] Documentation and guides
- [ ] Video tutorials for popular modpacks

---

## Cross-Feature Integration

These 5 features work together:

```
Pricing Page
    ↓ (user selects plan)
Server Creation
    ↓ (optionally select modpack)
Multi-Game Support
    ↓ (provisions server)
QuackPlane
    ↓ (manage server)
API
    ↓ (automation/integration)
```

## Success Criteria for MVP Launch

**Must Have** (Launch Blockers):
- ✅ Pricing page live with 3+ tiers
- ✅ Can create Minecraft server in < 2 min
- ✅ Multi-game support (3+ games)
- ✅ QuackPlane core features working
- ✅ REST API with documentation
- ✅ At least 3 one-click modpacks
- ✅ 99%+ provisioning success rate
- ✅ Payment processing works
- ✅ Email notifications

**Nice to Have** (Can ship after launch):
- Mobile app
- Advanced analytics
- Plugin marketplace
- Automated optimization
- Discord integration

**Metrics to Track**:
- Signup to first server: < 10 minutes
- Server uptime: > 99.5%
- Support tickets: < 0.5 per customer
- NPS: > 40
- Activation rate: > 70%

---

## Timeline Summary

```
Week 1-2:   Pricing page, setup infrastructure
Week 3-5:   QuackPlane foundation, multi-game start
Week 4-8:   Modpack deployment system
Week 6-9:   QuackPlane core features complete
Week 6-12:  REST API development
Week 10-12: Polish, testing, documentation
Week 13:    Launch! 🚀
```

Total: 3 months to MVP with all 5 tier-1 features shipped.
