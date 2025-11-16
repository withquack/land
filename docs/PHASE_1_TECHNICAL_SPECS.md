# Phase 1 Technical Specifications
## QuackHost Platform Enhancement - Detailed Implementation Guide

---

## 1. One-Click Modpack Deployment

### Architecture
```
User Interface (QuackPlane)
    ↓
Modpack Service API
    ↓
Package Resolution Engine → Dependency Graph Builder
    ↓
Docker Container Orchestrator
    ↓
File System Manager → Mod Installer
    ↓
Server Configuration Generator
    ↓
Health Check & Validation
```

### Technical Implementation

#### Database Schema
```sql
-- Modpacks table
CREATE TABLE modpacks (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    minecraft_version VARCHAR(20) NOT NULL,
    forge_version VARCHAR(20),
    fabric_version VARCHAR(20),
    mod_loader ENUM('forge', 'fabric', 'quilt') NOT NULL,
    total_downloads BIGINT DEFAULT 0,
    last_updated TIMESTAMP NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_mc_version (minecraft_version),
    INDEX idx_slug (slug)
);

-- Modpack versions
CREATE TABLE modpack_versions (
    id UUID PRIMARY KEY,
    modpack_id UUID REFERENCES modpacks(id),
    version_number VARCHAR(20) NOT NULL,
    changelog TEXT,
    download_url VARCHAR(500),
    file_hash VARCHAR(64),
    file_size_bytes BIGINT,
    is_stable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(modpack_id, version_number)
);

-- Modpack dependencies (individual mods)
CREATE TABLE modpack_mods (
    id UUID PRIMARY KEY,
    modpack_version_id UUID REFERENCES modpack_versions(id),
    mod_id VARCHAR(255) NOT NULL,
    mod_name VARCHAR(255) NOT NULL,
    mod_version VARCHAR(50) NOT NULL,
    download_url VARCHAR(500),
    is_required BOOLEAN DEFAULT true,
    file_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User modpack installations
CREATE TABLE modpack_installations (
    id UUID PRIMARY KEY,
    server_id UUID NOT NULL,
    modpack_version_id UUID REFERENCES modpack_versions(id),
    status ENUM('pending', 'downloading', 'installing', 'completed', 'failed') DEFAULT 'pending',
    progress_percentage INT DEFAULT 0,
    error_message TEXT,
    installed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_server (server_id),
    INDEX idx_status (status)
);
```

#### API Endpoints

```typescript
// GET /api/v1/modpacks
// List all available modpacks with pagination and filtering
interface ModpackListResponse {
  data: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    minecraft_version: string;
    mod_loader: 'forge' | 'fabric' | 'quilt';
    total_downloads: number;
    latest_version: string;
    thumbnail_url: string;
    is_verified: boolean;
  }>;
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// POST /api/v1/servers/{serverId}/modpacks/install
// Install a modpack on a server
interface ModpackInstallRequest {
  modpack_version_id: string;
  auto_backup: boolean; // Create backup before installation
  accept_eula: boolean;
  custom_configs?: Record<string, any>; // Optional config overrides
}

interface ModpackInstallResponse {
  installation_id: string;
  status: 'pending' | 'downloading' | 'installing';
  estimated_time_seconds: number;
  websocket_url: string; // For real-time progress updates
}

// GET /api/v1/servers/{serverId}/modpacks/installation/{installationId}
// Check installation status
interface InstallationStatusResponse {
  id: string;
  status: 'pending' | 'downloading' | 'installing' | 'completed' | 'failed';
  progress_percentage: number;
  current_step: string;
  error_message?: string;
  logs: string[];
}

// DELETE /api/v1/servers/{serverId}/modpacks
// Remove modpack (restore to vanilla)
interface ModpackRemoveRequest {
  create_backup: boolean;
  keep_worlds: boolean;
}
```

#### Installation Process Flow

```javascript
// Pseudo-code for modpack installation
async function installModpack(serverId, modpackVersionId, options) {
  const installation = await db.createInstallation({
    server_id: serverId,
    modpack_version_id: modpackVersionId,
    status: 'pending'
  });

  // Start background job
  queue.add('modpack-installation', {
    installationId: installation.id,
    steps: [
      '1. Validate server compatibility',
      '2. Create backup (if requested)',
      '3. Stop server',
      '4. Download modpack files',
      '5. Extract and validate mods',
      '6. Resolve dependencies',
      '7. Update server configuration',
      '8. Install Forge/Fabric loader',
      '9. Verify installation',
      '10. Start server',
      '11. Health check'
    ]
  });

  return installation;
}

// Background worker
async function processModpackInstallation(job) {
  const { installationId } = job.data;

  try {
    // Step 1: Validate
    await updateProgress(installationId, 5, 'Validating server compatibility');
    const server = await getServer(installationId.server_id);
    const modpack = await getModpackVersion(installationId.modpack_version_id);

    if (server.disk_free_mb < modpack.size_mb * 1.5) {
      throw new Error('Insufficient disk space');
    }

    // Step 2: Backup
    if (options.auto_backup) {
      await updateProgress(installationId, 10, 'Creating backup');
      await createBackup(server.id, 'pre-modpack-installation');
    }

    // Step 3: Stop server
    await updateProgress(installationId, 20, 'Stopping server');
    await stopServer(server.id);

    // Step 4: Download
    await updateProgress(installationId, 30, 'Downloading modpack files');
    const downloadPath = await downloadModpack(modpack.download_url);

    // Step 5: Extract
    await updateProgress(installationId, 50, 'Extracting mods');
    await extractModpack(downloadPath, server.path);

    // Step 6: Dependencies
    await updateProgress(installationId, 60, 'Resolving dependencies');
    await resolveDependencies(server.id, modpack);

    // Step 7: Configuration
    await updateProgress(installationId, 70, 'Updating server configuration');
    await updateServerConfig(server.id, modpack.configs);

    // Step 8: Mod loader
    await updateProgress(installationId, 80, 'Installing mod loader');
    if (modpack.mod_loader === 'forge') {
      await installForge(server.id, modpack.forge_version);
    } else if (modpack.mod_loader === 'fabric') {
      await installFabric(server.id, modpack.fabric_version);
    }

    // Step 9: Verify
    await updateProgress(installationId, 90, 'Verifying installation');
    await verifyModpackIntegrity(server.id, modpack);

    // Step 10: Start
    await updateProgress(installationId, 95, 'Starting server');
    await startServer(server.id);

    // Step 11: Health check
    await updateProgress(installationId, 98, 'Running health check');
    await waitForServerReady(server.id, 300); // 5 min timeout

    await updateProgress(installationId, 100, 'Installation complete');
    await db.updateInstallation(installationId, { status: 'completed' });

  } catch (error) {
    await db.updateInstallation(installationId, {
      status: 'failed',
      error_message: error.message
    });
    // Rollback to backup if exists
    if (options.auto_backup) {
      await rollbackToLatestBackup(server.id);
    }
    throw error;
  }
}
```

### Frontend Implementation (React/Alpine.js)

```javascript
// Modpack browser component
<div x-data="modpackBrowser()" x-init="loadModpacks()">
  <!-- Search and filters -->
  <div class="mb-6">
    <input
      type="text"
      x-model="searchQuery"
      @input.debounce.500ms="loadModpacks()"
      placeholder="Search modpacks..."
      class="w-full p-3 bg-gray-800 border border-gray-700 rounded"
    />

    <div class="flex gap-4 mt-4">
      <select x-model="filters.minecraft_version" @change="loadModpacks()">
        <option value="">All Versions</option>
        <option value="1.20.1">1.20.1</option>
        <option value="1.19.4">1.19.4</option>
        <option value="1.18.2">1.18.2</option>
      </select>

      <select x-model="filters.mod_loader" @change="loadModpacks()">
        <option value="">All Loaders</option>
        <option value="forge">Forge</option>
        <option value="fabric">Fabric</option>
        <option value="quilt">Quilt</option>
      </select>
    </div>
  </div>

  <!-- Modpack grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <template x-for="modpack in modpacks" :key="modpack.id">
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition">
        <img :src="modpack.thumbnail_url" class="w-full h-48 object-cover rounded mb-4" />

        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-xl font-semibold" x-text="modpack.name"></h3>
          <span x-show="modpack.is_verified" class="text-blue-400">✓</span>
        </div>

        <p class="text-gray-400 text-sm mb-4" x-text="modpack.description"></p>

        <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span x-text="`MC ${modpack.minecraft_version}`"></span>
          <span x-text="`${modpack.total_downloads.toLocaleString()} downloads`"></span>
        </div>

        <button
          @click="installModpack(modpack.id)"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition"
        >
          Install
        </button>
      </div>
    </template>
  </div>

  <!-- Installation modal -->
  <div x-show="installing" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg p-8 max-w-md w-full">
      <h3 class="text-2xl font-bold mb-4">Installing Modpack</h3>

      <!-- Progress bar -->
      <div class="w-full bg-gray-700 rounded-full h-4 mb-4">
        <div
          class="bg-orange-500 h-4 rounded-full transition-all duration-300"
          :style="`width: ${installProgress}%`"
        ></div>
      </div>

      <p class="text-center text-gray-400 mb-2" x-text="`${installProgress}%`"></p>
      <p class="text-center text-sm text-gray-500" x-text="installStep"></p>

      <div class="mt-6 max-h-48 overflow-y-auto bg-gray-900 p-3 rounded font-mono text-xs">
        <template x-for="log in installLogs" :key="log">
          <div x-text="log" class="text-green-400"></div>
        </template>
      </div>
    </div>
  </div>
</div>

<script>
function modpackBrowser() {
  return {
    modpacks: [],
    searchQuery: '',
    filters: {
      minecraft_version: '',
      mod_loader: ''
    },
    installing: false,
    installProgress: 0,
    installStep: '',
    installLogs: [],
    ws: null,

    async loadModpacks() {
      const params = new URLSearchParams({
        search: this.searchQuery,
        ...this.filters
      });

      const response = await fetch(`/api/v1/modpacks?${params}`);
      const data = await response.json();
      this.modpacks = data.data;
    },

    async installModpack(modpackId) {
      if (!confirm('This will restart your server. Continue?')) return;

      this.installing = true;
      this.installProgress = 0;
      this.installLogs = [];

      try {
        const response = await fetch(`/api/v1/servers/${serverId}/modpacks/install`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modpack_version_id: modpackId,
            auto_backup: true,
            accept_eula: true
          })
        });

        const { installation_id, websocket_url } = await response.json();

        // Connect to WebSocket for real-time updates
        this.ws = new WebSocket(websocket_url);

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.installProgress = data.progress_percentage;
          this.installStep = data.current_step;
          if (data.log) {
            this.installLogs.push(data.log);
          }

          if (data.status === 'completed') {
            setTimeout(() => {
              this.installing = false;
              alert('Modpack installed successfully!');
              window.location.reload();
            }, 2000);
          } else if (data.status === 'failed') {
            alert(`Installation failed: ${data.error_message}`);
            this.installing = false;
          }
        };

      } catch (error) {
        alert(`Error: ${error.message}`);
        this.installing = false;
      }
    }
  };
}
</script>
```

---

## 2. Mobile App Architecture

### Technology Stack
- **Framework**: React Native (cross-platform iOS/Android)
- **State Management**: Redux Toolkit + RTK Query
- **Push Notifications**: Firebase Cloud Messaging
- **Real-time**: Socket.io client
- **Authentication**: JWT with biometric support
- **Offline Support**: Redux Persist + AsyncStorage

### Core Features Module Breakdown

#### 2.1 Authentication Module
```typescript
// src/modules/auth/types.ts
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  biometricEnabled: boolean;
  isAuthenticated: boolean;
}

interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

// src/modules/auth/slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as LocalAuthentication from 'expo-local-authentication';

export const loginWithBiometric = createAsyncThunk(
  'auth/loginWithBiometric',
  async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      throw new Error('Biometric authentication not available');
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login to QuackHost',
      fallbackLabel: 'Use passcode'
    });

    if (result.success) {
      // Retrieve stored token
      const token = await SecureStore.getItemAsync('auth_token');
      return { token };
    }
    throw new Error('Biometric authentication failed');
  }
);
```

#### 2.2 Server Management Module
```typescript
// src/modules/servers/screens/ServerListScreen.tsx
import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useGetServersQuery } from '../api';
import ServerCard from '../components/ServerCard';

export default function ServerListScreen({ navigation }) {
  const { data: servers, isLoading, refetch } = useGetServersQuery();

  return (
    <FlatList
      data={servers}
      renderItem={({ item }) => (
        <ServerCard
          server={item}
          onPress={() => navigation.navigate('ServerDetails', { serverId: item.id })}
        />
      )}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    />
  );
}

// src/modules/servers/components/ServerCard.tsx
export default function ServerCard({ server, onPress }) {
  const statusColor = {
    online: '#22c55e',
    offline: '#ef4444',
    starting: '#f59e0b'
  }[server.status];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{server.name}</Text>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>

      <View style={styles.stats}>
        <StatBadge icon="users" value={`${server.players_online}/${server.players_max}`} />
        <StatBadge icon="cpu" value={`${server.cpu_usage}%`} />
        <StatBadge icon="memory" value={`${server.ram_usage_mb}MB`} />
      </View>

      <View style={styles.actions}>
        <QuickActionButton icon="power" onPress={() => handlePowerAction(server)} />
        <QuickActionButton icon="terminal" onPress={() => openConsole(server)} />
        <QuickActionButton icon="save" onPress={() => createBackup(server)} />
      </View>
    </TouchableOpacity>
  );
}
```

#### 2.3 Push Notifications Service
```typescript
// src/services/notifications.ts
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export async function registerForPushNotifications() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const fcmToken = await messaging().getToken();
    // Send token to backend
    await api.registerPushToken({ token: fcmToken, platform: Platform.OS });
    return fcmToken;
  }
}

// Handle background notifications
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background notification:', remoteMessage);

  // Show local notification
  PushNotification.localNotification({
    channelId: 'quackhost-alerts',
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
    playSound: true,
    soundName: 'default'
  });
});

// Notification types
export const NotificationTypes = {
  SERVER_CRASH: 'server_crash',
  PLAYER_JOIN: 'player_join',
  BACKUP_COMPLETE: 'backup_complete',
  BACKUP_FAILED: 'backup_failed',
  HIGH_CPU: 'high_cpu',
  HIGH_RAM: 'high_ram',
  DISK_FULL: 'disk_full',
  DDOS_ATTACK: 'ddos_attack'
};

// Backend notification payload
interface NotificationPayload {
  type: string;
  server_id: string;
  server_name: string;
  title: string;
  body: string;
  data: Record<string, any>;
  action?: {
    type: 'restart' | 'view_console' | 'view_backup';
    url?: string;
  };
}
```

---

## 3. Discord Bot Integration

### Bot Architecture
```
Discord Bot (discord.js)
    ↓
Command Handler → Slash Commands
    ↓
API Gateway (authenticated requests to QuackHost API)
    ↓
Server Management Service
    ↓
Response Formatter → Discord Embeds
```

### Implementation

```typescript
// src/bot/index.ts
import { Client, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Commands definition
const commands = [
  new SlashCommandBuilder()
    .setName('server')
    .setDescription('Manage your QuackHost servers')
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Check server status')
        .addStringOption(option =>
          option.setName('server')
            .setDescription('Server name or ID')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('restart')
        .setDescription('Restart a server')
        .addStringOption(option =>
          option.setName('server')
            .setDescription('Server name or ID')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('console')
        .setDescription('Execute console command')
        .addStringOption(option =>
          option.setName('server')
            .setDescription('Server name or ID')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(option =>
          option.setName('command')
            .setDescription('Command to execute')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('players')
        .setDescription('List online players')
        .addStringOption(option =>
          option.setName('server')
            .setDescription('Server name or ID')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('backup')
        .setDescription('Create a backup')
        .addStringOption(option =>
          option.setName('server')
            .setDescription('Server name or ID')
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your QuackHost account')
    .addStringOption(option =>
      option.setName('api-key')
        .setDescription('Your QuackHost API key')
        .setRequired(true)
    ),
];

// Command handlers
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'server') {
    await handleServerCommand(interaction);
  } else if (commandName === 'link') {
    await handleLinkCommand(interaction);
  }
});

async function handleServerCommand(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const serverId = interaction.options.getString('server');

  // Get user's API key from database
  const apiKey = await getUserApiKey(interaction.user.id);
  if (!apiKey) {
    return interaction.reply({
      content: '❌ Please link your account first with `/link`',
      ephemeral: true
    });
  }

  try {
    switch (subcommand) {
      case 'status':
        const status = await getServerStatus(apiKey, serverId);
        const embed = createStatusEmbed(status);
        await interaction.reply({ embeds: [embed] });
        break;

      case 'restart':
        await interaction.deferReply();
        await restartServer(apiKey, serverId);
        await interaction.editReply('✅ Server restart initiated');
        break;

      case 'console':
        const command = interaction.options.getString('command');
        await executeConsoleCommand(apiKey, serverId, command);
        await interaction.reply({
          content: `✅ Executed: \`${command}\``,
          ephemeral: true
        });
        break;

      case 'players':
        const players = await getOnlinePlayers(apiKey, serverId);
        const playerEmbed = createPlayersEmbed(players);
        await interaction.reply({ embeds: [playerEmbed] });
        break;

      case 'backup':
        await interaction.deferReply();
        const backup = await createBackup(apiKey, serverId);
        await interaction.editReply(`✅ Backup created: ${backup.id}`);
        break;
    }
  } catch (error) {
    await interaction.reply({
      content: `❌ Error: ${error.message}`,
      ephemeral: true
    });
  }
}

function createStatusEmbed(server) {
  const statusEmoji = {
    online: '🟢',
    offline: '🔴',
    starting: '🟡'
  }[server.status];

  return {
    color: server.status === 'online' ? 0x22c55e : 0xef4444,
    title: `${statusEmoji} ${server.name}`,
    fields: [
      { name: 'Status', value: server.status, inline: true },
      { name: 'Players', value: `${server.players_online}/${server.players_max}`, inline: true },
      { name: 'Uptime', value: formatUptime(server.uptime_seconds), inline: true },
      { name: 'CPU Usage', value: `${server.cpu_usage}%`, inline: true },
      { name: 'RAM Usage', value: `${server.ram_usage_mb}/${server.ram_total_mb} MB`, inline: true },
      { name: 'TPS', value: server.tps?.toFixed(2) || 'N/A', inline: true },
    ],
    timestamp: new Date(),
    footer: { text: 'QuackHost' }
  };
}

// Chat relay feature
async function setupChatRelay(guildId, channelId, serverId, apiKey) {
  const channel = await client.channels.fetch(channelId);

  // WebSocket connection to server console
  const ws = new WebSocket(`wss://api.quackhost.com/servers/${serverId}/console/stream`);

  ws.on('message', (data) => {
    const message = JSON.parse(data);

    // Filter chat messages
    if (message.type === 'chat') {
      channel.send({
        content: `**[${message.player}]** ${message.message}`,
        allowedMentions: { parse: [] } // Prevent mentions
      });
    }
  });

  // Listen to Discord messages and send to server
  client.on('messageCreate', async (msg) => {
    if (msg.channel.id === channelId && !msg.author.bot) {
      await executeConsoleCommand(
        apiKey,
        serverId,
        `say [Discord] ${msg.author.username}: ${msg.content}`
      );
    }
  });
}
```

---

## 4. Advanced Monitoring Dashboard

### Metrics Collection Architecture

```typescript
// Time-series database: InfluxDB or TimescaleDB
// Metrics collection agent runs on each game server

// Agent configuration
interface MetricsConfig {
  collection_interval_seconds: number;
  retention_days: number;
  metrics: {
    system: boolean; // CPU, RAM, Disk, Network
    minecraft: boolean; // TPS, Players, Chunks, Entities
    plugins: boolean; // Per-plugin metrics
    custom: boolean; // User-defined metrics
  };
}

// Metrics schema (InfluxDB line protocol)
/*
cpu_usage,server_id=abc123,host=node-01 value=45.2 1634567890000000000
ram_usage,server_id=abc123,host=node-01 value=2048 1634567890000000000
tps,server_id=abc123 value=19.8 1634567890000000000
player_count,server_id=abc123 value=15 1634567890000000000
chunk_count,server_id=abc123 value=3421 1634567890000000000
entity_count,server_id=abc123,type=hostile value=234 1634567890000000000
plugin_execution_time,server_id=abc123,plugin=EssentialsX value=12.4 1634567890000000000
*/

// Dashboard API endpoints
interface MetricsQuery {
  server_id: string;
  metric: string;
  start_time: string; // ISO 8601
  end_time: string;
  aggregation?: 'mean' | 'max' | 'min' | 'sum';
  interval?: string; // e.g., '1m', '5m', '1h'
}

// GET /api/v1/servers/{serverId}/metrics
async function getMetrics(query: MetricsQuery) {
  const influxQuery = `
    SELECT ${query.aggregation || 'mean'}(value)
    FROM ${query.metric}
    WHERE server_id = '${query.server_id}'
      AND time >= '${query.start_time}'
      AND time <= '${query.end_time}'
    GROUP BY time(${query.interval || '5m'})
  `;

  const results = await influxDB.query(influxQuery);
  return results.map(point => ({
    timestamp: point.time,
    value: point.value
  }));
}
```

### Frontend Dashboard (Chart.js / Recharts)

```javascript
// Real-time metrics component
function MetricsDashboard({ serverId }) {
  const [timeRange, setTimeRange] = useState('1h');
  const [metrics, setMetrics] = useState({});
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Initial load
    loadMetrics();

    // Live updates
    if (isLive) {
      const ws = new WebSocket(`wss://api.quackhost.com/metrics/stream/${serverId}`);
      ws.onmessage = (event) => {
        const metric = JSON.parse(event.data);
        updateMetricInRealtime(metric);
      };
      return () => ws.close();
    } else {
      // Polling fallback
      const interval = setInterval(loadMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [serverId, timeRange, isLive]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* CPU Chart */}
      <MetricChart
        title="CPU Usage"
        data={metrics.cpu}
        color="#3b82f6"
        suffix="%"
        threshold={80}
      />

      {/* RAM Chart */}
      <MetricChart
        title="RAM Usage"
        data={metrics.ram}
        color="#8b5cf6"
        suffix=" MB"
        threshold={metrics.ramTotal * 0.9}
      />

      {/* TPS Chart */}
      <MetricChart
        title="Server TPS"
        data={metrics.tps}
        color="#10b981"
        threshold={18}
        reverse={true} // Alert if below threshold
      />

      {/* Players Chart */}
      <MetricChart
        title="Online Players"
        data={metrics.players}
        color="#f59e0b"
        type="area"
      />

      {/* Network I/O */}
      <MetricChart
        title="Network I/O"
        data={[metrics.network_in, metrics.network_out]}
        labels={['Incoming', 'Outgoing']}
        colors={['#06b6d4', '#ec4899']}
        suffix=" MB/s"
        type="line"
      />

      {/* Disk I/O */}
      <MetricChart
        title="Disk I/O"
        data={[metrics.disk_read, metrics.disk_write]}
        labels={['Read', 'Write']}
        colors={['#14b8a6', '#f43f5e']}
        suffix=" MB/s"
        type="line"
      />
    </div>
  );
}
```

---

## 5. Smart File Editor

### Monaco Editor Integration

```typescript
// Editor component with Minecraft-specific features
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// Custom language definitions for Minecraft configs
monaco.languages.register({ id: 'minecraft-properties' });
monaco.languages.setMonarchTokensProvider('minecraft-properties', {
  tokenizer: {
    root: [
      [/#.*$/, 'comment'],
      [/[a-zA-Z_-][\w-]*/, 'key'],
      [/=/, 'delimiter'],
      [/.*$/, 'value']
    ]
  }
});

// YAML schema for plugin configs
const pluginConfigSchema = {
  type: 'object',
  properties: {
    settings: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        debug: { type: 'boolean' }
      }
    }
  }
};

function FileEditor({ serverId, filePath }) {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    loadFile();
    detectLanguage();
  }, [filePath]);

  function detectLanguage() {
    if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
      setLanguage('yaml');
    } else if (filePath.endsWith('.json')) {
      setLanguage('json');
    } else if (filePath.endsWith('.properties')) {
      setLanguage('minecraft-properties');
    } else if (filePath.endsWith('.conf')) {
      setLanguage('ini');
    }
  }

  async function validateContent(value) {
    try {
      if (language === 'yaml') {
        const parsed = YAML.parse(value);
        // Validate against schema if available
        const schemaErrors = await validateYAML(parsed, filePath);
        setErrors(schemaErrors);
      } else if (language === 'json') {
        JSON.parse(value);
        setErrors([]);
      }
    } catch (error) {
      setErrors([{
        line: error.mark?.line || 0,
        message: error.message
      }]);
    }
  }

  function handleEditorDidMount(editor, monaco) {
    // Auto-completion for common Minecraft properties
    monaco.languages.registerCompletionItemProvider('minecraft-properties', {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          {
            label: 'server-port',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'server-port=25565',
            documentation: 'Server port number (1-65535)'
          },
          {
            label: 'max-players',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'max-players=20',
            documentation: 'Maximum number of players'
          },
          // ... more completions
        ];
        return { suggestions };
      }
    });

    // Hover tooltips
    monaco.languages.registerHoverProvider('minecraft-properties', {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position);
        const documentation = getPropertyDocumentation(word.word);
        return {
          contents: [
            { value: `**${word.word}**` },
            { value: documentation }
          ]
        };
      }
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-gray-400">{filePath}</span>
          {errors.length > 0 && (
            <span className="text-red-400 text-sm">
              {errors.length} error{errors.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={formatDocument} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">
            Format
          </button>
          <button onClick={saveFile} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded">
            Save
          </button>
        </div>
      </div>

      {/* Editor */}
      <Editor
        height="100%"
        language={language}
        value={content}
        onChange={(value) => {
          setContent(value);
          validateContent(value);
        }}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          rulers: [80, 120],
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true
        }}
      />

      {/* Error panel */}
      {errors.length > 0 && (
        <div className="bg-red-900 bg-opacity-20 border-t border-red-800 p-4">
          {errors.map((error, i) => (
            <div key={i} className="text-red-400 text-sm font-mono">
              Line {error.line}: {error.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 6. Server Templates System

### Template Structure

```typescript
interface ServerTemplate {
  id: string;
  name: string;
  description: string;
  category: 'survival' | 'creative' | 'minigames' | 'modded' | 'network';
  thumbnail_url: string;
  minecraft_version: string;

  // Pre-configured files
  files: Array<{
    path: string;
    content: string;
    overwrite: boolean;
  }>;

  // Plugins to install
  plugins: Array<{
    name: string;
    version: string;
    download_url: string;
    config_overrides?: Record<string, any>;
  }>;

  // World files
  world?: {
    download_url: string;
    size_mb: number;
  };

  // Server properties
  server_properties: Record<string, string | number | boolean>;

  // Post-installation commands
  setup_commands: string[];

  // Resource requirements
  minimum_ram_mb: number;
  recommended_ram_mb: number;
  minimum_disk_mb: number;
}

// Example template
const skyblockTemplate: ServerTemplate = {
  id: 'skyblock-1',
  name: 'Skyblock Server',
  description: 'Complete skyblock setup with economy, challenges, and custom islands',
  category: 'survival',
  minecraft_version: '1.20.1',
  files: [
    {
      path: 'bukkit.yml',
      content: `
settings:
  allow-end: false
  spawn-limits:
    monsters: 50
    animals: 15
`,
      overwrite: true
    }
  ],
  plugins: [
    {
      name: 'BentoBox',
      version: '1.24.1',
      download_url: 'https://...',
      config_overrides: {
        'config.yml': {
          island: {
            distance: 200,
            protection-range: 100
          }
        }
      }
    },
    {
      name: 'Vault',
      version: '1.7.3',
      download_url: 'https://...'
    },
    {
      name: 'EssentialsX',
      version: '2.20.1',
      download_url: 'https://...'
    }
  ],
  world: {
    download_url: 'https://cdn.quackhost.com/templates/skyblock-spawn.zip',
    size_mb: 150
  },
  server_properties: {
    'max-players': 50,
    'difficulty': 'normal',
    'spawn-protection': 0,
    'view-distance': 8
  },
  setup_commands: [
    'bentobox reload',
    'essentials reload'
  ],
  minimum_ram_mb: 2048,
  recommended_ram_mb: 4096,
  minimum_disk_mb: 5000
};
```

---

## Performance Targets

### Phase 1 Features
- **Modpack Installation**: < 5 minutes for average modpack (100 mods)
- **Mobile App Load Time**: < 2 seconds to dashboard
- **Dashboard Metrics**: Real-time updates every 5 seconds
- **Discord Bot Response**: < 1 second for status commands
- **File Editor**: < 500ms file load for files under 10MB
- **Template Deployment**: < 3 minutes end-to-end

### Scalability Targets
- Support 10,000+ concurrent mobile app users
- Handle 1 million+ metrics data points per day
- Process 100+ simultaneous modpack installations
- Discord bot serving 50,000+ Discord servers

---

## Security Considerations

1. **API Authentication**: JWT with short expiration + refresh tokens
2. **Rate Limiting**: 100 requests/minute per user, 1000/minute per IP
3. **Input Validation**: Strict validation on all file uploads and console commands
4. **Encryption**: TLS 1.3 for all API traffic, AES-256 for sensitive data at rest
5. **Audit Logging**: Complete audit trail of all destructive actions
6. **Permission System**: Granular RBAC for team members

---

## Development Timeline

- **Week 1-2**: Backend API development
- **Week 3-4**: Modpack system implementation
- **Week 5-6**: Mobile app core features
- **Week 7**: Discord bot development
- **Week 8-9**: Monitoring dashboard & file editor
- **Week 10**: Server templates system
- **Week 11-12**: Testing, bug fixes, optimization
