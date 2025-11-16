# QuackHost API Specification
## Developer-First Game Server Management

**Version**: 1.0.0
**Base URL**: `https://api.quackhost.com/v1`
**Authentication**: Bearer Token (JWT)
**Date**: 2025-11-16

---

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Core Concepts](#core-concepts)
4. [API Endpoints](#api-endpoints)
5. [Webhooks](#webhooks)
6. [SDKs & Libraries](#sdks--libraries)
7. [Rate Limiting](#rate-limiting)
8. [Examples & Tutorials](#examples--tutorials)

---

## Introduction

The QuackHost API is a RESTful API that allows you to programmatically manage game servers, automate deployments, and integrate with your existing workflows.

### Design Principles

- **Developer-First**: Everything is API accessible
- **RESTful**: Standard HTTP methods and status codes
- **Type-Safe**: Full TypeScript definitions
- **Documented**: OpenAPI 3.0 specification
- **Consistent**: Predictable patterns across all endpoints
- **Versioned**: Backward compatibility guaranteed

### Base URL

```
Production:  https://api.quackhost.com/v1
Staging:     https://api-staging.quackhost.com/v1
```

---

## Authentication

### API Keys

Generate API keys from your dashboard: `https://quackhost.com/dashboard/api-keys`

**Types of keys**:
- **Read-only**: Can only GET resources
- **Read-write**: Full CRUD access
- **Admin**: All operations including billing

### Authentication Header

```http
Authorization: Bearer qh_live_abc123...
```

### Example Request

```bash
curl https://api.quackhost.com/v1/servers \
  -H "Authorization: Bearer qh_live_abc123..." \
  -H "Content-Type: application/json"
```

### Response Format

All API responses follow this structure:

```json
{
  "data": { ... },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2025-11-16T12:00:00Z"
  }
}
```

### Error Response Format

```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      }
    ]
  },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2025-11-16T12:00:00Z"
  }
}
```

---

## Core Concepts

### Resources

The API is organized around these main resources:

- **Servers**: Game server instances
- **Plans**: Resource configurations
- **Backups**: Server backups
- **Files**: File management
- **Metrics**: Performance data
- **Users**: Team and permissions
- **Billing**: Subscriptions and invoices

### Idempotency

All POST, PATCH, and DELETE requests support idempotency using the `Idempotency-Key` header:

```http
Idempotency-Key: unique-key-123
```

### Pagination

List endpoints support pagination:

```
GET /v1/servers?page=2&limit=50
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 50,
    "total": 237,
    "total_pages": 5,
    "has_next": true,
    "has_prev": true
  }
}
```

---

## API Endpoints

### Servers

#### Create Server

```http
POST /v1/servers
```

**Request Body**:
```json
{
  "name": "My Minecraft Server",
  "game": "minecraft",
  "plan_id": "plan_abc123",
  "region": "us-east",
  "version": "1.20.4",
  "config": {
    "max_players": 20,
    "difficulty": "normal",
    "gamemode": "survival",
    "pvp": true
  }
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": "srv_abc123",
    "name": "My Minecraft Server",
    "game": "minecraft",
    "status": "provisioning",
    "plan_id": "plan_abc123",
    "region": "us-east",
    "version": "1.20.4",
    "ip_address": null,
    "port": null,
    "created_at": "2025-11-16T12:00:00Z",
    "updated_at": "2025-11-16T12:00:00Z",
    "config": {
      "max_players": 20,
      "difficulty": "normal",
      "gamemode": "survival",
      "pvp": true
    }
  }
}
```

---

#### List Servers

```http
GET /v1/servers
```

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 25, max: 100)
- `status` (string): Filter by status (running, stopped, etc.)
- `game` (string): Filter by game type
- `region` (string): Filter by region

**Example**:
```http
GET /v1/servers?status=running&game=minecraft&page=1&limit=50
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "srv_abc123",
      "name": "My Minecraft Server",
      "game": "minecraft",
      "status": "running",
      "ip_address": "198.51.100.50",
      "port": 25565,
      "player_count": 5,
      "max_players": 20,
      "created_at": "2025-11-16T12:00:00Z"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 3,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

---

#### Get Server

```http
GET /v1/servers/:id
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "srv_abc123",
    "name": "My Minecraft Server",
    "game": "minecraft",
    "status": "running",
    "plan": {
      "id": "plan_abc123",
      "name": "Community",
      "cpu_cores": 3,
      "memory_gb": 4,
      "storage_gb": 40
    },
    "region": "us-east",
    "version": "1.20.4",
    "ip_address": "198.51.100.50",
    "port": 25565,
    "player_count": 5,
    "max_players": 20,
    "uptime_seconds": 86400,
    "created_at": "2025-11-15T12:00:00Z",
    "updated_at": "2025-11-16T12:00:00Z",
    "last_started_at": "2025-11-15T12:05:00Z",
    "config": {
      "max_players": 20,
      "difficulty": "normal",
      "gamemode": "survival",
      "pvp": true,
      "motd": "Welcome to my server!"
    }
  }
}
```

---

#### Update Server

```http
PATCH /v1/servers/:id
```

**Request Body**:
```json
{
  "name": "My Updated Server",
  "config": {
    "max_players": 30,
    "difficulty": "hard"
  }
}
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "srv_abc123",
    "name": "My Updated Server",
    ...
  }
}
```

---

#### Delete Server

```http
DELETE /v1/servers/:id
```

**Response** (204 No Content)

---

#### Server Actions

**Start Server**:
```http
POST /v1/servers/:id/start
```

**Stop Server**:
```http
POST /v1/servers/:id/stop
```

**Restart Server**:
```http
POST /v1/servers/:id/restart
```

**Response** (202 Accepted):
```json
{
  "data": {
    "id": "srv_abc123",
    "status": "starting",
    "action_id": "act_xyz789"
  }
}
```

**Kill Server** (force stop):
```http
POST /v1/servers/:id/kill
```

**Reinstall Server**:
```http
POST /v1/servers/:id/reinstall
```

---

#### Server Console

**Get Console Output**:
```http
GET /v1/servers/:id/console
```

**Query Parameters**:
- `lines` (integer): Number of recent lines (default: 100, max: 1000)
- `since` (timestamp): Get logs since timestamp

**Response** (200 OK):
```json
{
  "data": {
    "lines": [
      "[12:00:01] [Server thread/INFO]: Starting minecraft server version 1.20.4",
      "[12:00:02] [Server thread/INFO]: Loading properties",
      "[12:00:03] [Server thread/INFO]: Done (1.234s)! For help, type \"help\""
    ],
    "timestamp": "2025-11-16T12:00:00Z"
  }
}
```

**Execute Command**:
```http
POST /v1/servers/:id/console/command
```

**Request Body**:
```json
{
  "command": "say Hello, world!"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "command": "say Hello, world!",
    "executed_at": "2025-11-16T12:00:00Z"
  }
}
```

---

### Backups

#### Create Backup

```http
POST /v1/servers/:id/backups
```

**Request Body**:
```json
{
  "name": "Before update",
  "description": "Backup before updating to 1.20.4"
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": "bak_abc123",
    "server_id": "srv_abc123",
    "name": "Before update",
    "description": "Backup before updating to 1.20.4",
    "size_bytes": 1073741824,
    "status": "completed",
    "created_at": "2025-11-16T12:00:00Z",
    "completed_at": "2025-11-16T12:02:30Z"
  }
}
```

---

#### List Backups

```http
GET /v1/servers/:id/backups
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "bak_abc123",
      "name": "Before update",
      "size_bytes": 1073741824,
      "created_at": "2025-11-16T12:00:00Z"
    },
    ...
  ]
}
```

---

#### Restore from Backup

```http
POST /v1/servers/:id/restore/:backup_id
```

**Response** (202 Accepted):
```json
{
  "data": {
    "server_id": "srv_abc123",
    "backup_id": "bak_abc123",
    "status": "restoring",
    "action_id": "act_xyz789"
  }
}
```

---

#### Download Backup

```http
GET /v1/servers/:id/backups/:backup_id/download
```

**Response** (302 Redirect to S3 presigned URL)

---

### Files

#### List Files

```http
GET /v1/servers/:id/files
```

**Query Parameters**:
- `path` (string): Directory path (default: "/")

**Example**:
```http
GET /v1/servers/:id/files?path=/plugins
```

**Response** (200 OK):
```json
{
  "data": {
    "path": "/plugins",
    "files": [
      {
        "name": "EssentialsX.jar",
        "path": "/plugins/EssentialsX.jar",
        "type": "file",
        "size_bytes": 524288,
        "modified_at": "2025-11-15T10:00:00Z"
      },
      {
        "name": "config",
        "path": "/plugins/config",
        "type": "directory",
        "modified_at": "2025-11-16T08:00:00Z"
      }
    ]
  }
}
```

---

#### Get File Contents

```http
GET /v1/servers/:id/files/content
```

**Query Parameters**:
- `path` (string, required): File path

**Example**:
```http
GET /v1/servers/:id/files/content?path=/server.properties
```

**Response** (200 OK):
```
max-players=20
difficulty=normal
gamemode=survival
pvp=true
motd=Welcome to my server!
```

---

#### Upload File

```http
POST /v1/servers/:id/files/upload
```

**Content-Type**: `multipart/form-data`

**Form Data**:
- `file` (file): The file to upload
- `path` (string): Destination path

**Response** (201 Created):
```json
{
  "data": {
    "name": "plugin.jar",
    "path": "/plugins/plugin.jar",
    "size_bytes": 1048576
  }
}
```

---

#### Update File

```http
PUT /v1/servers/:id/files/content
```

**Query Parameters**:
- `path` (string, required): File path

**Request Body** (raw text):
```
max-players=30
difficulty=hard
gamemode=survival
pvp=true
motd=Welcome to my updated server!
```

**Response** (200 OK):
```json
{
  "data": {
    "path": "/server.properties",
    "updated_at": "2025-11-16T12:00:00Z"
  }
}
```

---

#### Delete File

```http
DELETE /v1/servers/:id/files
```

**Query Parameters**:
- `path` (string, required): File/directory path

**Response** (204 No Content)

---

### Metrics

#### Get Server Metrics

```http
GET /v1/servers/:id/metrics
```

**Query Parameters**:
- `start` (timestamp): Start time (default: 1 hour ago)
- `end` (timestamp): End time (default: now)
- `interval` (string): Data interval (1m, 5m, 15m, 1h, 1d)

**Example**:
```http
GET /v1/servers/:id/metrics?start=2025-11-16T10:00:00Z&end=2025-11-16T12:00:00Z&interval=5m
```

**Response** (200 OK):
```json
{
  "data": {
    "server_id": "srv_abc123",
    "interval": "5m",
    "metrics": [
      {
        "timestamp": "2025-11-16T10:00:00Z",
        "cpu_percent": 45.2,
        "memory_used_mb": 2048,
        "memory_total_mb": 4096,
        "disk_used_gb": 15.3,
        "disk_total_gb": 40,
        "network_in_mbps": 5.2,
        "network_out_mbps": 3.8,
        "player_count": 12,
        "tps": 19.8
      },
      ...
    ]
  }
}
```

---

#### Get Latest Metrics

```http
GET /v1/servers/:id/metrics/latest
```

**Response** (200 OK):
```json
{
  "data": {
    "server_id": "srv_abc123",
    "timestamp": "2025-11-16T12:00:00Z",
    "cpu_percent": 45.2,
    "memory_used_mb": 2048,
    "memory_percent": 50,
    "disk_used_gb": 15.3,
    "disk_percent": 38.25,
    "player_count": 12,
    "max_players": 20,
    "tps": 19.8,
    "uptime_seconds": 86400
  }
}
```

---

### Plans

#### List Plans

```http
GET /v1/plans
```

**Query Parameters**:
- `game` (string): Filter by game type

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "plan_starter",
      "name": "Starter",
      "game": "minecraft",
      "cpu_cores": 2,
      "memory_gb": 2,
      "storage_gb": 20,
      "max_players": 10,
      "price_monthly_cents": 1200,
      "features": [
        "Community support",
        "Daily backups",
        "API access"
      ]
    },
    {
      "id": "plan_community",
      "name": "Community",
      "game": "minecraft",
      "cpu_cores": 3,
      "memory_gb": 4,
      "storage_gb": 40,
      "max_players": 30,
      "price_monthly_cents": 2400,
      "features": [
        "Priority support",
        "Hourly backups",
        "Advanced analytics",
        "API access"
      ]
    }
  ]
}
```

---

### Users & Teams

#### Get Current User

```http
GET /v1/users/me
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "username": "johndoe",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

---

#### Create Team Member

```http
POST /v1/teams/members
```

**Request Body**:
```json
{
  "email": "teammate@example.com",
  "role": "developer",
  "permissions": [
    "servers:read",
    "servers:write",
    "backups:create"
  ]
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": "mem_abc123",
    "email": "teammate@example.com",
    "role": "developer",
    "status": "pending",
    "invited_at": "2025-11-16T12:00:00Z"
  }
}
```

---

### Billing

#### Get Subscription

```http
GET /v1/billing/subscription
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "sub_abc123",
    "status": "active",
    "plan": {
      "id": "plan_community",
      "name": "Community",
      "price_monthly_cents": 2400
    },
    "current_period_start": "2025-11-01T00:00:00Z",
    "current_period_end": "2025-12-01T00:00:00Z",
    "cancel_at_period_end": false
  }
}
```

---

#### List Invoices

```http
GET /v1/billing/invoices
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "inv_abc123",
      "amount_cents": 2400,
      "status": "paid",
      "created_at": "2025-11-01T00:00:00Z",
      "paid_at": "2025-11-01T00:05:00Z",
      "pdf_url": "https://..."
    }
  ]
}
```

---

## Webhooks

Subscribe to events happening in your account.

### Event Types

- `server.created`
- `server.started`
- `server.stopped`
- `server.deleted`
- `backup.created`
- `backup.completed`
- `backup.failed`
- `payment.succeeded`
- `payment.failed`

### Webhook Endpoint

Configure webhook URL in dashboard or via API:

```http
POST /v1/webhooks
```

**Request Body**:
```json
{
  "url": "https://yourapp.com/webhooks/quackhost",
  "events": [
    "server.created",
    "server.started",
    "backup.completed"
  ],
  "secret": "your_webhook_secret"
}
```

### Webhook Payload

```json
{
  "id": "evt_abc123",
  "type": "server.started",
  "created_at": "2025-11-16T12:00:00Z",
  "data": {
    "id": "srv_abc123",
    "name": "My Minecraft Server",
    "status": "running",
    "ip_address": "198.51.100.50",
    "port": 25565
  }
}
```

### Signature Verification

Webhooks are signed with HMAC SHA-256:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// In your webhook handler
const signature = req.headers['x-quackhost-signature'];
const isValid = verifyWebhook(
  req.rawBody,
  signature,
  'your_webhook_secret'
);
```

---

## SDKs & Libraries

### Official SDKs

#### Node.js / TypeScript

```bash
npm install @quackhost/sdk
```

```typescript
import { QuackHost } from '@quackhost/sdk';

const client = new QuackHost({
  apiKey: process.env.QUACKHOST_API_KEY,
});

// Create a server
const server = await client.servers.create({
  name: 'My Minecraft Server',
  game: 'minecraft',
  plan_id: 'plan_community',
  region: 'us-east',
});

console.log(`Server created: ${server.id}`);
console.log(`Status: ${server.status}`);

// Wait for server to be ready
await client.servers.waitForStatus(server.id, 'running');

console.log(`Server ready at ${server.ip_address}:${server.port}`);

// Execute console command
await client.servers.executeCommand(server.id, 'say Hello!');

// Get metrics
const metrics = await client.servers.getLatestMetrics(server.id);
console.log(`CPU: ${metrics.cpu_percent}%`);
console.log(`Players: ${metrics.player_count}/${metrics.max_players}`);
```

---

#### Python

```bash
pip install quackhost
```

```python
from quackhost import QuackHost

client = QuackHost(api_key='your_api_key')

# Create a server
server = client.servers.create(
    name='My Minecraft Server',
    game='minecraft',
    plan_id='plan_community',
    region='us-east'
)

print(f"Server created: {server.id}")
print(f"Status: {server.status}")

# Wait for server to be ready
client.servers.wait_for_status(server.id, 'running')

print(f"Server ready at {server.ip_address}:{server.port}")

# Execute console command
client.servers.execute_command(server.id, 'say Hello!')

# Get metrics
metrics = client.servers.get_latest_metrics(server.id)
print(f"CPU: {metrics.cpu_percent}%")
print(f"Players: {metrics.player_count}/{metrics.max_players}")
```

---

#### Go

```bash
go get github.com/quackhost/quackhost-go
```

```go
package main

import (
    "fmt"
    "github.com/quackhost/quackhost-go"
)

func main() {
    client := quackhost.NewClient("your_api_key")

    // Create a server
    server, err := client.Servers.Create(&quackhost.CreateServerParams{
        Name:   "My Minecraft Server",
        Game:   "minecraft",
        PlanID: "plan_community",
        Region: "us-east",
    })
    if err != nil {
        panic(err)
    }

    fmt.Printf("Server created: %s\n", server.ID)
    fmt.Printf("Status: %s\n", server.Status)

    // Wait for server to be ready
    err = client.Servers.WaitForStatus(server.ID, "running")
    if err != nil {
        panic(err)
    }

    fmt.Printf("Server ready at %s:%d\n", server.IPAddress, server.Port)
}
```

---

## Rate Limiting

### Limits

**Default Limits**:
- **Free tier**: 100 requests/minute
- **Paid plans**: 1,000 requests/minute
- **Enterprise**: 10,000 requests/minute

### Headers

Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1700140800
```

### Exceeded Response

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "API rate limit exceeded",
    "retry_after": 60
  }
}
```

**Status Code**: 429 Too Many Requests

---

## Examples & Tutorials

### Example 1: Automated Deployment

```typescript
import { QuackHost } from '@quackhost/sdk';

async function deployServer() {
  const client = new QuackHost({
    apiKey: process.env.QUACKHOST_API_KEY,
  });

  // 1. Create server
  console.log('Creating server...');
  const server = await client.servers.create({
    name: 'Production Minecraft Server',
    game: 'minecraft',
    plan_id: 'plan_professional',
    region: 'us-east',
    version: '1.20.4',
    config: {
      max_players: 100,
      difficulty: 'hard',
      gamemode: 'survival',
    },
  });

  console.log(`Server created: ${server.id}`);

  // 2. Wait for provisioning
  console.log('Waiting for server to start...');
  await client.servers.waitForStatus(server.id, 'running');

  // 3. Upload plugins
  console.log('Uploading plugins...');
  await client.files.upload(server.id, {
    path: '/plugins/EssentialsX.jar',
    file: './plugins/EssentialsX.jar',
  });

  // 4. Upload world
  console.log('Uploading world...');
  await client.files.uploadDirectory(server.id, {
    path: '/world',
    directory: './world',
  });

  // 5. Configure server
  console.log('Configuring server...');
  await client.files.updateContent(server.id, {
    path: '/server.properties',
    content: generateServerProperties({
      maxPlayers: 100,
      motd: 'Production Server - Welcome!',
    }),
  });

  // 6. Restart to apply config
  console.log('Restarting server...');
  await client.servers.restart(server.id);
  await client.servers.waitForStatus(server.id, 'running');

  // 7. Create initial backup
  console.log('Creating backup...');
  const backup = await client.backups.create(server.id, {
    name: 'Initial deployment',
  });

  console.log(`✅ Deployment complete!`);
  console.log(`Server: ${server.ip_address}:${server.port}`);
  console.log(`Backup: ${backup.id}`);
}

deployServer().catch(console.error);
```

---

### Example 2: Monitoring & Alerts

```typescript
import { QuackHost } from '@quackhost/sdk';

async function monitorServer(serverId: string) {
  const client = new QuackHost({
    apiKey: process.env.QUACKHOST_API_KEY,
  });

  // Check metrics every 30 seconds
  setInterval(async () => {
    const metrics = await client.servers.getLatestMetrics(serverId);

    // Alert on high CPU
    if (metrics.cpu_percent > 90) {
      await sendAlert({
        title: 'High CPU Usage',
        message: `Server CPU at ${metrics.cpu_percent}%`,
        severity: 'warning',
      });
    }

    // Alert on low TPS
    if (metrics.tps < 15) {
      await sendAlert({
        title: 'Low TPS',
        message: `Server TPS at ${metrics.tps}`,
        severity: 'critical',
      });
    }

    // Alert on server down
    const server = await client.servers.get(serverId);
    if (server.status !== 'running') {
      await sendAlert({
        title: 'Server Down',
        message: `Server status: ${server.status}`,
        severity: 'critical',
      });

      // Auto-restart
      await client.servers.start(serverId);
    }

    // Log metrics
    console.log({
      cpu: `${metrics.cpu_percent}%`,
      memory: `${metrics.memory_percent}%`,
      players: `${metrics.player_count}/${metrics.max_players}`,
      tps: metrics.tps,
    });
  }, 30000);
}
```

---

### Example 3: Scheduled Backups

```typescript
import { QuackHost } from '@quackhost/sdk';
import cron from 'node-cron';

const client = new QuackHost({
  apiKey: process.env.QUACKHOST_API_KEY,
});

// Daily backup at 3 AM
cron.schedule('0 3 * * *', async () => {
  const servers = await client.servers.list();

  for (const server of servers) {
    console.log(`Creating backup for ${server.name}...`);

    try {
      const backup = await client.backups.create(server.id, {
        name: `Daily backup ${new Date().toISOString()}`,
      });

      console.log(`✅ Backup created: ${backup.id}`);

      // Delete backups older than 30 days
      const backups = await client.backups.list(server.id);
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

      for (const oldBackup of backups) {
        if (new Date(oldBackup.created_at).getTime() < thirtyDaysAgo) {
          await client.backups.delete(server.id, oldBackup.id);
          console.log(`🗑️  Deleted old backup: ${oldBackup.id}`);
        }
      }
    } catch (error) {
      console.error(`❌ Backup failed for ${server.name}:`, error);
    }
  }
});

console.log('Backup scheduler started');
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 202 | Accepted - Request accepted, processing async |
| 204 | No Content - Request succeeded, no body |
| 400 | Bad Request - Invalid request |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - Valid API key but insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Temporary outage |

---

## Support

- **Documentation**: https://docs.quackhost.com
- **API Status**: https://status.quackhost.com
- **Support**: support@quackhost.com
- **Discord**: https://discord.gg/quackhost
- **GitHub**: https://github.com/quackhost

---

**Version**: 1.0.0
**Last Updated**: 2025-11-16
**License**: MIT (for SDKs)
