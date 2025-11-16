# QuackHost: Detailed Feature Specifications

## Top 5 Features - Implementation Guide

---

## Feature #1: Server Templates

### Overview
One-click deployment of pre-configured Minecraft servers. Users select a template (Vanilla, Modded SMP, Skyblock, etc.) and get a fully configured server in <2 minutes.

### User Stories
- **As a beginner**, I want to launch a server without learning config files
- **As an experienced admin**, I want to start from a known-good configuration
- **As a content creator**, I want to share my server setup with others

### Technical Architecture

```
┌─────────────┐
│   User UI   │
└─────┬───────┘
      │ Select Template
      ↓
┌─────────────────┐
│ Template Engine │ ← Validates compatibility
└─────┬───────────┘
      │ Clone Template
      ↓
┌──────────────────┐
│ Provisioning API │ ← Creates container
└─────┬────────────┘
      │
      ↓
┌──────────────────┐
│  Game Server     │
└──────────────────┘
```

### Data Model

```typescript
interface ServerTemplate {
  id: string;
  name: string;
  description: string;
  author: string; // "QuackHost Official" or user ID
  category: 'vanilla' | 'modded' | 'minigame' | 'creative' | 'survival';
  minecraftVersion: string;

  // Configuration
  config: {
    serverProperties: Record<string, any>;
    jvmArgs: string[];
    plugins: Plugin[];
    mods: Mod[];
    datapacks: Datapack[];
    worlds: WorldFile[];
  };

  // Metadata
  downloads: number;
  rating: number;
  verified: boolean;
  minMemoryGB: number;
  recommendedMemoryGB: number;

  // Preview
  screenshots: string[];
  thumbnailUrl: string;

  createdAt: Date;
  updatedAt: Date;
}
```

### API Endpoints

```typescript
// List all templates
GET /api/v1/templates
Query params: ?category=modded&version=1.20.1&sort=popular

// Get template details
GET /api/v1/templates/:templateId

// Deploy template to new server
POST /api/v1/servers/:serverId/deploy-template
Body: { templateId: string, customizations?: Partial<ServerTemplate['config']> }

// Create custom template from existing server
POST /api/v1/templates
Body: { sourceServerId: string, name: string, description: string, public: boolean }

// Update template (author only)
PATCH /api/v1/templates/:templateId

// Delete template (author only)
DELETE /api/v1/templates/:templateId
```

### UI/UX Flow

#### Step 1: Template Selection
```
┌────────────────────────────────────────┐
│  Choose Your Server Type               │
├────────────────────────────────────────┤
│                                        │
│  [🌱 Vanilla SMP]  [⚡ Modded Survival] │
│  Basic survival    200+ mods, tech     │
│  ⭐ 4.8 (2.3k)    ⭐ 4.9 (1.1k)       │
│                                        │
│  [🏝️ Skyblock]     [🎮 Minigames]      │
│  Islands & challenges  Pre-built games │
│  ⭐ 4.7 (890)      ⭐ 4.6 (654)       │
│                                        │
│  [🎨 Creative]     [➕ Start Blank]     │
│  Building world    Empty server        │
│  ⭐ 4.5 (432)      ⭐ 4.9 (12k)       │
│                                        │
└────────────────────────────────────────┘
         ↓ Click template
┌────────────────────────────────────────┐
│  Modded Survival Template              │
├────────────────────────────────────────┤
│  [Screenshot carousel]                 │
│                                        │
│  📦 200+ mods including:               │
│  • Create (automation)                 │
│  • Farmer's Delight (farming)         │
│  • Mekanism (tech)                    │
│                                        │
│  💾 Recommended: 6GB RAM               │
│  🎮 Minecraft Version: 1.20.1          │
│  👤 By QuackHost Official              │
│                                        │
│  [Customize] [Deploy Server →]         │
└────────────────────────────────────────┘
```

#### Step 2: Customization (Optional)
```
┌────────────────────────────────────────┐
│  Customize Template                    │
├────────────────────────────────────────┤
│  Server Name: _______________         │
│  Max Players: [20] ▼                   │
│  Difficulty:  [Normal] ▼               │
│                                        │
│  Mods (200 included):                  │
│  ☑ Create                              │
│  ☑ Farmer's Delight                    │
│  ☐ OptiFine (optional)                 │
│  [+ Add More Mods]                     │
│                                        │
│  [Back] [Deploy Server →]              │
└────────────────────────────────────────┘
```

#### Step 3: Deployment
```
┌────────────────────────────────────────┐
│  Deploying Your Server...              │
├────────────────────────────────────────┤
│  ✓ Creating server container           │
│  ✓ Installing Minecraft 1.20.1         │
│  ⏳ Downloading mods (142/200)          │
│  ⏳ Configuring server properties       │
│  ⏳ Starting server                     │
│                                        │
│  [Progress bar: 68%]                   │
│                                        │
│  Estimated time: 45 seconds            │
└────────────────────────────────────────┘
```

### Official Templates (Launch Set)

1. **Vanilla SMP** - Pure survival, no mods
2. **Modded Survival** - 200+ tech/magic mods
3. **Skyblock** - Island challenges
4. **Prison Server** - Rank-up prison
5. **Creative Build** - Flat world, WorldEdit
6. **Minigames Hub** - BedWars, SkyWars, etc.
7. **RPG Adventure** - Quests, custom items
8. **Pixelmon** - Pokemon in Minecraft
9. **Towny Economy** - Town building, economy
10. **Hardcore SMP** - One life, hardcore mode

### Community Templates (User-Generated)

Users can:
- Create templates from their existing servers
- Share publicly or keep private
- Earn revenue if template becomes popular (future marketplace)

### Implementation Phases

**Phase 1 (Week 1-2): Core System**
- Template data model
- Template selection UI
- Deployment engine
- 3 official templates

**Phase 2 (Week 3): Polish**
- Remaining 7 official templates
- Template preview/screenshots
- Customization options
- Error handling

**Phase 3 (Week 4): Community**
- User template creation
- Template sharing
- Rating/review system
- Template categories/search

### Success Metrics
- **Primary**: 80% of new servers use templates
- **Secondary**: <3 minutes average deployment time
- **Tertiary**: 4.5+ average template rating

---

## Feature #2: Performance Insights

### Overview
Automated detection and diagnosis of server performance issues. Identifies laggy chunks, poorly optimized entities, and provides actionable fixes.

### User Stories
- **As a server owner**, I want to know WHY my server is lagging
- **As a non-technical admin**, I want simple explanations, not log files
- **As an experienced admin**, I want detailed profiling data

### Technical Architecture

```
┌──────────────┐
│ Game Server  │ ← Runs profiling agent
└──────┬───────┘
       │ Sends metrics every 30s
       ↓
┌────────────────┐
│ Metrics Collector │ ← Timeseries DB (InfluxDB)
└──────┬─────────┘
       │ Analyzes trends
       ↓
┌────────────────┐
│ Insight Engine │ ← Pattern detection
└──────┬─────────┘
       │ Generates insights
       ↓
┌──────────────┐
│ QuackPlane UI │ ← Displays insights
└──────────────┘
```

### Metrics Collected

**Server-Level**
- TPS (Ticks Per Second) - target: 20
- MSPT (Milliseconds Per Tick) - target: <50
- Memory usage (heap, non-heap)
- CPU usage
- Network I/O
- Disk I/O

**World-Level**
- Chunk load time
- Entity count per chunk
- Tile entity count
- Loaded chunks count

**Entity-Level**
- Entity type distribution
- AI computation time
- Pathfinding performance

### Insight Categories

#### 1. Laggy Chunks
```
⚠️ Performance Issue Detected

Chunk at (-234, 87) is causing lag
• 847 entities (mostly chickens)
• Taking 23ms per tick (should be <2ms)

Solutions:
✓ [Auto-fix] Remove excess chickens
✓ [Manual] Install entity limiter plugin
✓ [Learn More] About entity limits
```

#### 2. Poorly Optimized Plugins
```
⚠️ Plugin Performance Issue

"AwesomeEconomy" is slow
• Using 34% of server tick time
• Known to cause lag on large servers

Solutions:
✓ [Update] New version available (v2.1.3)
✓ [Replace] Try "BetterEconomy" instead
✓ [Configure] Reduce database queries
```

#### 3. Memory Issues
```
⚠️ Memory Warning

Server using 5.8GB of 6GB allocated
• Garbage collection running frequently
• Risk of out-of-memory crash

Solutions:
✓ [Upgrade] Increase to 8GB RAM (+$5/mo)
✓ [Optimize] Reduce view distance
✓ [Clean] Remove unused plugins
```

#### 4. Disk I/O Bottleneck
```
ℹ️ Storage Optimization

World save taking 2.3 seconds
• 12GB world size
• HDD storage (upgrade available)

Solutions:
✓ [Upgrade] SSD storage (+$3/mo, 10x faster)
✓ [Optimize] Enable incremental saves
✓ [Prune] Delete old chunk data
```

### UI Components

#### Performance Dashboard
```
┌─────────────────────────────────────────┐
│  Performance Overview                   │
├─────────────────────────────────────────┤
│  Current TPS: 19.8 / 20.0 ✓            │
│  MSPT: 42ms (Good)                     │
│  Memory: 4.2GB / 6GB (70%)             │
│                                         │
│  [Graph: TPS over last 24h]            │
│                                         │
│  ⚠️ 2 Active Issues                     │
│  ✓ 3 Issues Resolved Today              │
│                                         │
│  [View Details →]                       │
└─────────────────────────────────────────┘
```

#### Issue Details
```
┌─────────────────────────────────────────┐
│  Performance Issues                     │
├─────────────────────────────────────────┤
│  ⚠️ HIGH PRIORITY                       │
│  Laggy chunk at spawn                   │
│  • 847 entities detected                │
│  • Reducing TPS by ~2.1                 │
│  • Affecting 12 online players          │
│                                         │
│  [Auto-Fix Now] [View Details]          │
│  ────────────────────────────────────   │
│  ⚠️ MEDIUM PRIORITY                     │
│  Plugin "EconomyPlus" slow              │
│  • Update available (v3.2.1)            │
│  • Known performance improvements       │
│                                         │
│  [Update Plugin] [Dismiss]              │
│  ────────────────────────────────────   │
│  ✓ RESOLVED                             │
│  Memory usage optimized                 │
│  • Auto-fixed 2 hours ago               │
│  • TPS improved from 17.2 to 19.8       │
│                                         │
│  [View Details]                         │
└─────────────────────────────────────────┘
```

### Auto-Fix Capabilities

**Safe Auto-Fixes** (No confirmation needed)
- Remove excess items on ground
- Kill excess animals in one chunk
- Clear mob spawn queues
- Optimize spawn rates
- Prune old player data

**Confirmable Auto-Fixes**
- Update plugins (show changelog)
- Adjust server properties
- Install optimization plugins
- Upgrade server plan

**Manual-Only**
- Replacing plugins
- Major configuration changes
- Downgrading Minecraft version

### Implementation Details

**Profiling Agent** (Runs on server)
```java
// Lightweight Minecraft plugin
public class QuackProfiler extends JavaPlugin {
    @Override
    public void onEnable() {
        // Register TPS monitor
        getServer().getScheduler().runTaskTimer(this, () -> {
            double tps = calculateTPS();
            sendMetric("server.tps", tps);
        }, 0L, 20L);

        // Register entity counter
        getServer().getScheduler().runTaskTimer(this, () -> {
            for (World world : getServer().getWorlds()) {
                for (Chunk chunk : world.getLoadedChunks()) {
                    int entityCount = chunk.getEntities().length;
                    if (entityCount > 100) {
                        sendAlert("laggy_chunk", chunk.getX(), chunk.getZ(), entityCount);
                    }
                }
            }
        }, 0L, 600L); // Every 30 seconds
    }
}
```

**Insight Engine** (Backend service)
```typescript
class InsightEngine {
  async analyze(serverId: string): Promise<Insight[]> {
    const metrics = await getMetrics(serverId, '24h');
    const insights: Insight[] = [];

    // Check TPS
    const avgTPS = average(metrics.tps);
    if (avgTPS < 18) {
      insights.push({
        severity: 'high',
        type: 'low_tps',
        message: `Server TPS is ${avgTPS.toFixed(1)} (target: 20.0)`,
        solutions: await generateSolutions('low_tps', metrics)
      });
    }

    // Check entity count
    const highEntityChunks = metrics.chunks.filter(c => c.entityCount > 100);
    if (highEntityChunks.length > 0) {
      insights.push({
        severity: 'medium',
        type: 'high_entity_count',
        message: `${highEntityChunks.length} chunks with excessive entities`,
        solutions: [
          { type: 'auto_fix', action: 'clear_excess_entities', safe: true },
          { type: 'plugin', suggestion: 'EntityLimiter' }
        ]
      });
    }

    return insights;
  }
}
```

### Success Metrics
- **Primary**: 50% reduction in "server is laggy" support tickets
- **Secondary**: 70% of users view insights within first week
- **Tertiary**: 40% of users accept auto-fix suggestions

---

## Feature #3: One-Click Mod/Plugin Installer

### Overview
Visual marketplace for browsing and installing mods/plugins. Automatic dependency resolution, compatibility checking, and version management.

### User Stories
- **As a beginner**, I want to install mods without using FTP
- **As a modpack creator**, I want to quickly test mod combinations
- **As an admin**, I want to know if mods will conflict before installing

### Technical Architecture

```
┌──────────────┐
│  QuackPlane  │
└──────┬───────┘
       │ Search "Create Mod"
       ↓
┌────────────────┐
│ Mod Index API  │ ← Scrapes CurseForge/Modrinth
└──────┬─────────┘
       │ Returns mod info + dependencies
       ↓
┌────────────────┐
│ Compatibility  │ ← Checks conflicts
│    Checker     │
└──────┬─────────┘
       │ Downloads mod files
       ↓
┌────────────────┐
│  Game Server   │ ← Installs to /mods folder
└────────────────┘
```

### UI/UX Flow

#### Browse & Search
```
┌─────────────────────────────────────────┐
│  Mods & Plugins                         │
├─────────────────────────────────────────┤
│  🔍 Search: [create mod          ] 🔎  │
│                                         │
│  Filter: [Mods ▼] [1.20.1 ▼] [Tech ▼] │
│  ────────────────────────────────────   │
│  ⚙️ Create                              │
│  Automation, machines, and decoration   │
│  ⭐ 4.9 • 120M downloads • Updated 2d   │
│  [+ Install]                            │
│  ────────────────────────────────────   │
│  🔧 Mekanism                            │
│  Advanced tech mod with machinery       │
│  ⭐ 4.8 • 89M downloads • Updated 5d    │
│  [+ Install]                            │
│  ────────────────────────────────────   │
│  🌾 Farmer's Delight                    │
│  Expanded farming and cooking           │
│  ⭐ 4.7 • 45M downloads • Updated 1w    │
│  [+ Install]                            │
└─────────────────────────────────────────┘
```

#### Mod Details
```
┌─────────────────────────────────────────┐
│  Create Mod                             │
├─────────────────────────────────────────┤
│  [Screenshot Gallery]                   │
│                                         │
│  📝 Description:                        │
│  Create is a mod offering a variety of  │
│  tools and blocks for Building,         │
│  Decoration and Aesthetic Automation.   │
│                                         │
│  ⚙️ Details:                            │
│  • Version: 0.5.1f                      │
│  • Minecraft: 1.20.1                    │
│  • Downloads: 120M                      │
│  • License: MIT                         │
│                                         │
│  📦 Dependencies:                       │
│  ✓ Forge 47.1.0+ (Already installed)    │
│  ⚠️ Flywheel (Not installed)            │
│                                         │
│  ⚠️ Potential Conflicts:                │
│  • BuildCraft (overlapping features)    │
│                                         │
│  [Install Create + Dependencies]        │
└─────────────────────────────────────────┘
```

#### Installation Progress
```
┌─────────────────────────────────────────┐
│  Installing Mods...                     │
├─────────────────────────────────────────┤
│  ✓ Downloading Create Mod (12.3 MB)     │
│  ⏳ Downloading Flywheel (4.1 MB)        │
│  ⏳ Installing dependencies              │
│  ⏳ Restarting server                    │
│                                         │
│  [Progress: 45%]                        │
│                                         │
│  Server will restart automatically      │
└─────────────────────────────────────────┘
```

#### Installed Mods Management
```
┌─────────────────────────────────────────┐
│  Installed Mods (23)                    │
├─────────────────────────────────────────┤
│  Search: [____________]    [+ Add Mod]  │
│  ────────────────────────────────────   │
│  ⚙️ Create v0.5.1f                      │
│  ✓ Up to date • 12.3 MB                 │
│  [Configure] [Update] [Remove]          │
│  ────────────────────────────────────   │
│  🔧 Mekanism v10.4.0                    │
│  ⚠️ Update available (v10.4.5)          │
│  [Update] [Remove]                      │
│  ────────────────────────────────────   │
│  🌾 Farmer's Delight v1.2.3             │
│  ✓ Up to date • 8.7 MB                  │
│  [Configure] [Remove]                   │
│  ────────────────────────────────────   │
│  [Update All] [Export Modpack]          │
└─────────────────────────────────────────┘
```

### Compatibility Checking

**Conflict Detection**
```typescript
interface CompatibilityCheck {
  compatible: boolean;
  conflicts: Conflict[];
  warnings: Warning[];
  dependencies: Dependency[];
}

interface Conflict {
  type: 'hard' | 'soft';
  mod1: string;
  mod2: string;
  reason: string;
  resolution?: string;
}

async function checkCompatibility(
  existingMods: Mod[],
  newMod: Mod
): Promise<CompatibilityCheck> {
  const conflicts: Conflict[] = [];

  // Check for known incompatibilities
  for (const existing of existingMods) {
    const knownConflict = conflictDatabase.find(existing.id, newMod.id);
    if (knownConflict) {
      conflicts.push({
        type: 'hard',
        mod1: existing.name,
        mod2: newMod.name,
        reason: knownConflict.reason,
        resolution: knownConflict.resolution
      });
    }
  }

  // Check Minecraft version compatibility
  if (newMod.minecraftVersion !== server.minecraftVersion) {
    conflicts.push({
      type: 'hard',
      mod1: 'Server',
      mod2: newMod.name,
      reason: `Requires Minecraft ${newMod.minecraftVersion}, server is ${server.minecraftVersion}`
    });
  }

  return {
    compatible: conflicts.filter(c => c.type === 'hard').length === 0,
    conflicts,
    warnings: [],
    dependencies: newMod.dependencies
  };
}
```

### Data Sources

**CurseForge API**
```typescript
// Fetch mod info
GET https://api.curseforge.com/v1/mods/{modId}

// Search mods
GET https://api.curseforge.com/v1/mods/search?gameId=432&searchFilter=create

// Download mod file
GET https://api.curseforge.com/v1/mods/{modId}/files/{fileId}/download-url
```

**Modrinth API**
```typescript
// Fetch mod info
GET https://api.modrinth.com/v2/project/{id}

// Search mods
GET https://api.modrinth.com/v2/search?query=create&facets=[["categories:forge"]]

// Download mod file
GET https://cdn.modrinth.com/data/{id}/versions/{version}/{filename}
```

### Advanced Features

#### Modpack Export
Users can export their mod list as:
- CurseForge modpack
- Modrinth modpack
- MultiMC instance
- JSON manifest

#### Mod Profiles
Save different mod combinations:
- "Tech Pack" (Create, Mekanism, etc.)
- "Magic Pack" (Botania, Thaumcraft, etc.)
- "Vanilla+" (QoL mods only)

Switch between profiles with one click.

#### Auto-Updates
- Check for mod updates daily
- Notify users of available updates
- Option to auto-update (with backup)
- Rollback if update breaks server

### Success Metrics
- **Primary**: 60% of servers install at least 1 mod via UI
- **Secondary**: Average of 8 mods per server
- **Tertiary**: 90% successful install rate (no rollbacks)

---

## Feature #4: Mobile App (MVP)

### Overview
React Native app for iOS and Android. Core features: start/stop/restart server, view console, basic file management, push notifications.

### User Stories
- **As a server owner**, I want to restart my server from my phone
- **As an admin**, I want to see who's online without opening my laptop
- **As a mobile user**, I want push notifications when server goes down

### App Screens

#### 1. Dashboard
```
┌─────────────────────────────────────┐
│ ☰  QuackHost               [🔔] [⚙️] │
├─────────────────────────────────────┤
│                                     │
│  My Servers (3)                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🟢 SMP Server               │   │
│  │ 12/20 players • 19.8 TPS    │   │
│  │ [⏸️ Stop] [🔄 Restart] [>]  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔴 Creative World           │   │
│  │ Offline • 6GB RAM           │   │
│  │ [▶️ Start] [>]              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🟡 Modded Server            │   │
│  │ Starting... 67%             │   │
│  │ [>]                         │   │
│  └─────────────────────────────┘   │
│                                     │
│  [+ Create New Server]              │
│                                     │
└─────────────────────────────────────┘
```

#### 2. Server Details
```
┌─────────────────────────────────────┐
│ ←  SMP Server          [🔔] [⚙️]    │
├─────────────────────────────────────┤
│  Status: 🟢 Online                  │
│  12/20 players • 19.8 TPS           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [⏸️ Stop] [🔄 Restart]      │   │
│  └─────────────────────────────┘   │
│                                     │
│  📊 Performance                     │
│  ┌─────────────────────────────┐   │
│  │ TPS:    ████████████ 19.8   │   │
│  │ Memory: ███████░░░░░ 4.2GB  │   │
│  │ CPU:    ████░░░░░░░░ 34%    │   │
│  └─────────────────────────────┘   │
│                                     │
│  👥 Players Online (12)             │
│  • Steve • Alex • Notch             │
│  • Herobrine • Dream • Technoblade │
│  [View All]                         │
│                                     │
│  📝 Console                         │
│  ┌─────────────────────────────┐   │
│  │ [INFO] Steve joined         │   │
│  │ [INFO] Alex left            │   │
│  │ [WARN] Can't keep up!       │   │
│  └─────────────────────────────┘   │
│  [Open Full Console]                │
│                                     │
│  [Files] [Backups] [Settings]       │
│                                     │
└─────────────────────────────────────┘
```

#### 3. Console (Full Screen)
```
┌─────────────────────────────────────┐
│ ←  Console                     [⏸️] │
├─────────────────────────────────────┤
│  [INFO] Starting server...          │
│  [INFO] Loading spawn area          │
│  [INFO] Done! (3.2s)                │
│  [INFO] Steve joined the game       │
│  [WARN] Can't keep up! Did the      │
│         system time change?         │
│  [INFO] Alex joined the game        │
│  [INFO] <Steve> Hello!              │
│  [INFO] <Alex> Hi there!            │
│  [ERROR] Exception in thread        │
│  [INFO] Steve left the game         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ /say ________________  [>]  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Common Commands:                   │
│  [/list] [/whitelist] [/op]         │
│                                     │
└─────────────────────────────────────┘
```

#### 4. Push Notifications
```
┌─────────────────────────────┐
│  QuackHost                  │
├─────────────────────────────┤
│  ⚠️ SMP Server Offline      │
│                             │
│  Your server crashed at     │
│  2:34 PM. Tap to restart.   │
│                             │
│  [Ignore] [Restart Server]  │
└─────────────────────────────┘
```

### Technical Stack

```
React Native (Expo)
├── Navigation: React Navigation
├── State: Zustand
├── API: Axios + React Query
├── Notifications: Expo Notifications
├── Auth: JWT tokens
└── UI: NativeWind (Tailwind for RN)
```

### API Integration

```typescript
// Server list
GET /api/v1/servers

// Server details
GET /api/v1/servers/:id

// Start server
POST /api/v1/servers/:id/start

// Stop server
POST /api/v1/servers/:id/stop

// Restart server
POST /api/v1/servers/:id/restart

// Console logs (SSE)
GET /api/v1/servers/:id/console/stream

// Send command
POST /api/v1/servers/:id/console/command
Body: { command: "say Hello world" }

// Player list
GET /api/v1/servers/:id/players

// Performance metrics
GET /api/v1/servers/:id/metrics
```

### Push Notifications

**Trigger Events**
- Server goes offline (crash/stop)
- Server comes online
- Player joins (optional, can be noisy)
- Performance issue detected
- Backup completed
- Update available

**Implementation**
```typescript
// Backend sends notification
await sendPushNotification({
  userId: server.ownerId,
  title: `${server.name} is offline`,
  body: 'Your server crashed at 2:34 PM',
  data: {
    serverId: server.id,
    action: 'server_offline'
  }
});

// App handles notification
Notifications.addNotificationResponseReceivedListener(response => {
  const { serverId, action } = response.notification.request.content.data;

  if (action === 'server_offline') {
    navigation.navigate('ServerDetails', { id: serverId });
  }
});
```

### MVP Scope (4 weeks)

**Week 1: Core UI**
- Login/authentication
- Server list
- Server details screen
- Basic styling

**Week 2: Server Controls**
- Start/stop/restart
- Real-time status updates
- Console viewing (read-only)
- Player list

**Week 3: Advanced Features**
- Console commands (write)
- Push notifications
- Performance metrics
- Error handling

**Week 4: Polish & Release**
- Beta testing
- Bug fixes
- App store submission
- Documentation

### Success Metrics
- **Primary**: 30% of users download app within first month
- **Secondary**: 4.0+ stars on app stores
- **Tertiary**: 50% of users use app at least weekly

---

## Feature #5: Smart Backup System

### Overview
Automated, incremental backups stored off-site. One-click restoration with preview. Backup verification to ensure backups actually work.

### User Stories
- **As a server owner**, I want automatic backups without thinking about it
- **As a paranoid admin**, I want backups stored somewhere other than the server
- **As a griefed server owner**, I want to restore to exactly 2 hours ago

### Technical Architecture

```
┌──────────────┐
│ Game Server  │
└──────┬───────┘
       │ Snapshot (rsync)
       ↓
┌────────────────┐
│ Backup Service │ ← Creates incremental backups
└──────┬─────────┘
       │ Uploads
       ↓
┌────────────────┐
│ Object Storage │ ← S3/Backblaze B2
│  (Off-Site)    │
└──────┬─────────┘
       │ Retrieves for restore
       ↓
┌──────────────┐
│ Game Server  │ ← One-click restore
└──────────────┘
```

### Backup Types

**Automatic Backups**
- Every 6 hours (configurable)
- Before server updates
- Before major configuration changes
- Max retention: 30 days

**Manual Backups**
- User-triggered
- Named backups (e.g., "Before Dragon Fight")
- Unlimited retention (within storage quota)

**Incremental Backups**
- Only backs up changed files
- Saves storage space
- Faster backup creation
- Uses hardlinks for efficiency

### UI/UX

#### Backup List
```
┌─────────────────────────────────────────┐
│  Backups                                │
├─────────────────────────────────────────┤
│  Next automatic backup: in 2h 34m       │
│  Storage used: 24.3 GB / 50 GB          │
│                                         │
│  [+ Create Backup Now]                  │
│  ────────────────────────────────────   │
│  📅 Today                               │
│  ────────────────────────────────────   │
│  🔷 Before Dragon Fight (Manual)        │
│  2:34 PM • 12.3 GB                      │
│  [Preview] [Restore] [Download]         │
│  ────────────────────────────────────   │
│  ⚙️ Auto-backup #847                    │
│  8:00 AM • 11.2 GB (+0.8 GB)            │
│  ✓ Verified • 12 players                │
│  [Preview] [Restore] [Download]         │
│  ────────────────────────────────────   │
│  📅 Yesterday                           │
│  ────────────────────────────────────   │
│  ⚙️ Auto-backup #846                    │
│  8:00 PM • 10.4 GB (+0.2 GB)            │
│  ✓ Verified                             │
│  [Preview] [Restore]                    │
│  ────────────────────────────────────   │
│  [Load More]                            │
└─────────────────────────────────────────┘
```

#### Restore Preview
```
┌─────────────────────────────────────────┐
│  Restore Backup Preview                 │
├─────────────────────────────────────────┤
│  Backup: Before Dragon Fight            │
│  Created: Today at 2:34 PM              │
│                                         │
│  📊 Comparison                          │
│  ────────────────────────────────────   │
│  World Size:      12.3 GB → 11.8 GB     │
│  Total Files:     4,823 → 4,791         │
│  Last Player:     Steve → Alex          │
│                                         │
│  ⚠️ Changes Since Backup:               │
│  • 32 new files                         │
│  • 500 MB of new data                   │
│  • 7 players have joined since          │
│                                         │
│  💾 Files That Will Be Lost:            │
│  • /world/playerdata/Steve.dat          │
│  • /world/region/r.0.0.mca (modified)   │
│  • /plugins/Essentials/userdata/*       │
│  [View Full List]                       │
│                                         │
│  ⚠️ Warning: This will overwrite your   │
│  current server. This cannot be undone. │
│                                         │
│  [Cancel] [Create Safety Backup First]  │
│           [Restore Anyway]              │
└─────────────────────────────────────────┘
```

#### Backup Settings
```
┌─────────────────────────────────────────┐
│  Backup Settings                        │
├─────────────────────────────────────────┤
│  Automatic Backups                      │
│  ☑ Enable automatic backups             │
│                                         │
│  Frequency: [Every 6 hours ▼]           │
│  • Every hour (uses more storage)       │
│  • Every 6 hours (recommended)          │
│  • Once daily                           │
│  • Custom schedule                      │
│                                         │
│  Retention: [30 days ▼]                 │
│  ────────────────────────────────────   │
│  What to Backup                         │
│  ☑ World files                          │
│  ☑ Server configurations                │
│  ☑ Plugin data                          │
│  ☑ Mod configurations                   │
│  ☐ Server logs (not recommended)        │
│  ────────────────────────────────────   │
│  Off-Site Storage                       │
│  ☑ Store backups off-site (recommended) │
│  ☐ Also store on server (faster)        │
│  ☐ Download to my computer              │
│  ────────────────────────────────────   │
│  Verification                           │
│  ☑ Verify backups automatically         │
│  Last verified: 2 hours ago ✓           │
│  ────────────────────────────────────   │
│  [Save Settings]                        │
└─────────────────────────────────────────┘
```

### Backup Verification

Periodically test backups to ensure they're not corrupted:

```typescript
async function verifyBackup(backupId: string): Promise<boolean> {
  // 1. Download backup
  const backupData = await downloadBackup(backupId);

  // 2. Check file integrity
  const integrityCheck = await verifyChecksum(backupData);
  if (!integrityCheck.valid) {
    await alertUser('Backup corrupted', backupId);
    return false;
  }

  // 3. Test restore to temporary server (sampling)
  if (shouldFullVerify(backupId)) { // Once per week
    const testServer = await createTempServer();
    const restoreResult = await restoreBackup(testServer.id, backupId);

    if (!restoreResult.success) {
      await alertUser('Backup cannot be restored', backupId);
      return false;
    }

    await deleteTempServer(testServer.id);
  }

  return true;
}
```

### Implementation Details

**Backup Creation (rsync)**
```bash
#!/bin/bash
# Create incremental backup using rsync

BACKUP_DIR="/backups"
LATEST="$BACKUP_DIR/latest"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
NEW_BACKUP="$BACKUP_DIR/$TIMESTAMP"

# Create incremental backup with hardlinks
rsync -a --link-dest="$LATEST" \
  /server/data/ \
  "$NEW_BACKUP/"

# Update 'latest' symlink
ln -nsf "$NEW_BACKUP" "$LATEST"

# Upload to S3
aws s3 sync "$NEW_BACKUP" "s3://quackhost-backups/server-123/$TIMESTAMP/"

# Cleanup old backups (>30 days)
find "$BACKUP_DIR" -maxdepth 1 -type d -mtime +30 -exec rm -rf {} \;
```

**Restore Process**
```typescript
async function restoreBackup(serverId: string, backupId: string) {
  // 1. Stop server
  await stopServer(serverId);

  // 2. Create safety backup
  const safetyBackup = await createBackup(serverId, 'Before Restore');

  // 3. Download backup from S3
  const backupData = await downloadBackup(backupId);

  // 4. Clear current data
  await clearServerData(serverId);

  // 5. Extract backup
  await extractBackup(serverId, backupData);

  // 6. Verify restoration
  const verified = await verifyServerData(serverId);

  if (!verified) {
    // Rollback to safety backup
    await restoreBackup(serverId, safetyBackup.id);
    throw new Error('Restore failed, rolled back');
  }

  // 7. Start server
  await startServer(serverId);

  return { success: true, safetyBackupId: safetyBackup.id };
}
```

### Success Metrics
- **Primary**: 100% of backups are verified and restorable
- **Secondary**: <5 minute restore time for 10GB backup
- **Tertiary**: 0 data loss incidents

---

## Implementation Timeline

```
Week 1-2:  Server Templates
Week 3:    Performance Insights
Week 4:    Mod/Plugin Installer
Week 5-6:  Mobile App
Week 7:    Smart Backups
Week 8:    Testing, polish, launch
```

All features launched within 2 months. 🚀

---

*Feature Specs v1.0*
*Last Updated: November 16, 2025*
