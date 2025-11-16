# QuackAI Feature Specifications
## AI-Powered Server Intelligence System

**Version:** 1.0
**Status:** Design Complete - Ready for Development
**Target Release:** Q2 2025
**Last Updated:** November 2025

---

## EXECUTIVE SUMMARY

QuackAI is the core differentiator that transforms QuackHost from a traditional hosting provider into an intelligent, self-managing platform. It uses machine learning, predictive analytics, and automation to optimize server performance, prevent issues, and enhance user experience.

**Key Value Propositions:**
- **Predictive:** Prevent crashes before they happen (95% accuracy)
- **Automated:** Self-optimizing servers require zero manual tuning
- **Intelligent:** AI understands game-specific optimization patterns
- **Proactive:** Alerts users before problems impact players

---

## 1. FEATURE OVERVIEW

### 1.1 Core Features (MVP - Q2 2025)

| Feature | Description | Impact |
|---------|-------------|--------|
| **Crash Prediction** | Predict server crashes 5-30 minutes in advance | Prevent 80% of unplanned downtime |
| **Auto-Optimization** | Automatically tune JVM/server settings for peak performance | +25% average TPS improvement |
| **Resource Alerts** | Smart notifications when resources need attention | Reduce manual monitoring by 90% |
| **Performance Insights** | AI-generated reports on server health and optimization opportunities | Increase user engagement |

### 1.2 Advanced Features (Phase 2 - Q4 2025)

| Feature | Description | Impact |
|---------|-------------|--------|
| **Player Behavior Analysis** | Detect griefing, cheating, unusual patterns | Reduce moderation time by 70% |
| **Mod Conflict Detection** | Identify incompatible plugins before they break servers | Prevent 60% of config-related crashes |
| **Predictive Scaling** | Auto-scale resources based on predicted player demand | Reduce costs by 30% |
| **Security Anomaly Detection** | Identify potential security threats in real-time | Catch exploits 10x faster |

### 1.3 Premium Features (Phase 3 - 2026)

| Feature | Description | Tier |
|---------|-------------|------|
| **Custom ML Models** | Train models on your specific server patterns | Enterprise |
| **Multi-Server Orchestration** | AI manages entire server networks | QuackAI Pro |
| **Natural Language Commands** | "Make my server faster" → automated optimization | QuackAI Pro |
| **Content Generation** | AI-generated quests, NPCs, events | QuackAI Premium |

---

## 2. DETAILED FEATURE SPECIFICATIONS

### 2.1 Crash Prediction System

#### **Overview**
Uses LSTM neural networks trained on millions of server hours to predict crashes before they occur.

#### **User Experience**

**Dashboard Widget:**
```
┌─────────────────────────────────────────┐
│ 🛡️ QuackAI Crash Prevention            │
├─────────────────────────────────────────┤
│                                         │
│  Crash Risk: ⚠️ MEDIUM (35%)           │
│                                         │
│  📊 [=========>        ] 35%            │
│                                         │
│  Predicted in: 12 minutes               │
│                                         │
│  ⚡ Recommended Actions:                │
│  1. Reduce entity count (-200 mobs)     │
│  2. Restart server during low traffic   │
│  3. Update Plugin X to v2.4.1           │
│                                         │
│  [Auto-Fix] [Schedule Restart] [Ignore] │
└─────────────────────────────────────────┘
```

**Alert Notifications:**
```
PUSH: "⚠️ QuackHost Alert"
"Your Minecraft server has a 65% crash risk in the next 15 minutes.
Tap to auto-fix or schedule a safe restart."
```

#### **Technical Implementation**

**Data Collection:**
```python
# Metrics collected every 10 seconds
metrics = {
    'timestamp': unix_timestamp,
    'server_id': 'uuid',
    'cpu_usage': 75.2,  # percentage
    'ram_usage': 3.8,   # GB
    'tps': 18.4,        # ticks per second
    'player_count': 42,
    'entity_count': 1850,
    'chunk_load_time': 45,  # ms
    'gc_time': 120,     # ms (garbage collection)
    'network_io': 2.5,  # MB/s
    'disk_io': 1.2,     # MB/s
    'plugin_count': 25,
    'error_count': 3,   # errors in last minute
    'warning_count': 12
}
```

**ML Model:**
```python
# LSTM Neural Network Architecture
model = Sequential([
    LSTM(128, return_sequences=True, input_shape=(timesteps, features)),
    Dropout(0.3),
    LSTM(64, return_sequences=True),
    Dropout(0.3),
    LSTM(32),
    Dense(16, activation='relu'),
    Dense(1, activation='sigmoid')  # Output: crash probability
])

# Training Data
# - 5M+ server hours of data
# - 100K+ crash events
# - Balanced dataset (oversampling crashes)

# Prediction Windows
predictions = {
    '5min': model.predict(last_30_datapoints),
    '10min': model.predict(last_60_datapoints),
    '30min': model.predict(last_180_datapoints)
}
```

**Auto-Fix Actions:**
```javascript
// Automated remediation based on crash cause
const autoFix = {
  'high_memory': () => {
    clearUnusedChunks()
    forceGarbageCollection()
    reduceMobSpawnRate(0.7)
  },

  'high_cpu': () => {
    optimizeRedstoneUpdates()
    throttleEntityUpdates()
    reduceViewDistance(2)
  },

  'plugin_error': async () => {
    const problematicPlugin = identifyBadPlugin()
    await safelyDisablePlugin(problematicPlugin)
    notifyUser(`Disabled ${problematicPlugin} to prevent crash`)
  },

  'memory_leak': () => {
    scheduleRestart('next_low_traffic_window')
    notifyPlayers('Server restart scheduled in 10 minutes')
  }
}
```

#### **Success Metrics**
- Prediction accuracy: >90% (target: 95%)
- False positive rate: <10%
- Average warning time: 15 minutes
- Auto-fix success rate: >80%
- Crashes prevented: 80% reduction

---

### 2.2 Auto-Optimization Engine

#### **Overview**
Reinforcement learning agent that continuously tunes server parameters for optimal performance.

#### **User Experience**

**Optimization Dashboard:**
```
┌─────────────────────────────────────────┐
│ 🚀 QuackAI Performance Optimizer        │
├─────────────────────────────────────────┤
│                                         │
│  Current Performance: ⭐⭐⭐⭐☆         │
│                                         │
│  TPS: 19.2 (Target: 20)                 │
│  Latency: 45ms (Excellent)              │
│  Memory Efficiency: 82% (Good)          │
│                                         │
│  📈 Improvements This Week:             │
│  • +3.2 TPS (auto-tuned)                │
│  • -15ms latency (chunk optimization)   │
│  • -800MB RAM (entity cleanup)          │
│                                         │
│  🎯 Next Optimization:                  │
│  "Increase view distance to 10 chunks"  │
│  Expected improvement: +0.5 TPS         │
│                                         │
│  [Apply Now] [Schedule] [Learn More]    │
└─────────────────────────────────────────┘
```

**Before/After Comparison:**
```
┌──────────────┬────────────┬────────────┬──────────┐
│ Metric       │ Before     │ After      │ Change   │
├──────────────┼────────────┼────────────┼──────────┤
│ TPS          │ 16.5       │ 19.8       │ +20.0%   │
│ RAM Usage    │ 4.2 GB     │ 3.4 GB     │ -19.0%   │
│ CPU Usage    │ 82%        │ 68%        │ -17.1%   │
│ Chunk Load   │ 120ms      │ 65ms       │ -45.8%   │
│ Player Lag   │ 85ms       │ 42ms       │ -50.6%   │
└──────────────┴────────────┴────────────┴──────────┘
```

#### **Technical Implementation**

**Optimization Parameters:**
```yaml
# Minecraft Server Optimization Space (45+ parameters)
parameters:
  # JVM Settings
  - name: heap_size
    range: [1024, 16384]  # MB
    current: 4096

  - name: gc_algorithm
    options: ['G1GC', 'ZGC', 'Shenandoah']
    current: 'G1GC'

  - name: gc_threads
    range: [1, 8]
    current: 4

  # Server Settings
  - name: view_distance
    range: [3, 32]
    current: 10

  - name: simulation_distance
    range: [3, 32]
    current: 8

  - name: max_entities_per_chunk
    range: [50, 500]
    current: 200

  - name: mob_spawn_range
    range: [2, 16]
    current: 8

  # Network Settings
  - name: network_compression_threshold
    range: [64, 1024]
    current: 256

  - name: max_tick_time
    range: [60000, -1]
    current: 60000
```

**Reinforcement Learning Agent:**
```python
# PPO (Proximal Policy Optimization) Agent
from ray.rllib.algorithms.ppo import PPO

# State Space (what the AI observes)
observation_space = {
    'current_tps': float,  # 0-20
    'ram_usage_pct': float,  # 0-100
    'cpu_usage_pct': float,  # 0-100
    'player_count': int,  # 0-1000
    'entity_count': int,  # 0-10000
    'chunk_count': int,  # 0-50000
    'average_latency': float,  # ms
    'error_rate': float,  # errors/min
    'time_of_day': int,  # 0-23 (hour)
    'day_of_week': int,  # 0-6
    'current_config': dict  # 45 parameters
}

# Action Space (what the AI can change)
action_space = {
    'adjust_heap_size': (-1024, +1024),  # MB delta
    'change_view_distance': (-2, +2),
    'modify_entity_limit': (-50, +50),
    'tune_gc_threads': (-2, +2),
    # ... 45 possible actions
}

# Reward Function (what the AI optimizes for)
def calculate_reward(state, action, next_state):
    reward = 0

    # Primary goal: maximize TPS
    tps_improvement = next_state['tps'] - state['tps']
    reward += tps_improvement * 10

    # Secondary goal: minimize resource usage
    ram_reduction = state['ram_usage_pct'] - next_state['ram_usage_pct']
    reward += ram_reduction * 2

    # Penalty: if TPS drops below acceptable
    if next_state['tps'] < 18:
        reward -= 50

    # Penalty: if players experience lag
    if next_state['average_latency'] > 100:
        reward -= 20

    # Bonus: improved player experience
    if next_state['average_latency'] < 50 and next_state['tps'] > 19:
        reward += 30

    return reward

# Training
config = {
    'env': GameServerEnv,
    'num_workers': 16,
    'framework': 'torch',
    'train_batch_size': 4000,
    'sgd_minibatch_size': 128,
    'num_sgd_iter': 30,
}

agent = PPO(config=config)

# Train on simulated + real server data
for epoch in range(1000):
    result = agent.train()
    print(f"Epoch {epoch}: Reward = {result['episode_reward_mean']}")
```

**Optimization Process:**
```javascript
// Continuous optimization loop
async function optimizationLoop(serverId) {
  while (true) {
    // 1. Collect current metrics
    const currentState = await collectMetrics(serverId)

    // 2. Get AI recommendation
    const recommendation = await quackAI.getOptimization(currentState)

    // 3. Simulate impact (test in sandbox)
    const prediction = await simulateImpact(recommendation)

    // 4. If improvement > threshold, apply
    if (prediction.tps_improvement > 0.5) {
      await applyOptimization(serverId, recommendation)
      await notifyUser(serverId, {
        type: 'optimization_applied',
        changes: recommendation,
        expected_improvement: prediction
      })
    }

    // 5. Monitor results for 1 hour
    await sleep(3600000)
    const actualResults = await measureImpact(serverId, recommendation)

    // 6. Send feedback to ML model
    await quackAI.recordOutcome(recommendation, actualResults)

    // 7. Wait for next optimization cycle (24h)
    await sleep(86400000)
  }
}
```

#### **Safety Mechanisms**

```typescript
// Prevent dangerous optimizations
const safetyChecks = {
  // Never reduce resources too aggressively
  validateResourceChange: (current, proposed) => {
    const maxReduction = 0.3  // Max 30% reduction at once
    if ((current - proposed) / current > maxReduction) {
      return false
    }
    return true
  },

  // Always maintain minimum performance
  ensureMinimumPerformance: (metrics) => {
    return metrics.tps >= 18 &&
           metrics.ram_available >= 512 && // Min 512MB free
           metrics.player_latency <= 150
  },

  // Rollback if optimization fails
  autoRollback: async (serverId, optimization) => {
    const before = await getMetricsSnapshot(serverId)
    await applyOptimization(serverId, optimization)
    await sleep(300000)  // Wait 5 minutes
    const after = await getMetricsSnapshot(serverId)

    if (after.tps < before.tps - 1) {
      console.warn('Optimization degraded performance, rolling back')
      await rollback(serverId, optimization)
      return false
    }
    return true
  }
}
```

#### **Success Metrics**
- Average TPS improvement: +25%
- RAM efficiency gain: +20%
- User satisfaction: >90% approve of optimizations
- Rollback rate: <5%
- Time to optimal config: <24 hours for new servers

---

### 2.3 Player Behavior Analysis

#### **Overview**
ML-powered system to detect griefing, cheating, toxic behavior, and other anomalies.

#### **User Experience**

**Moderation Dashboard:**
```
┌─────────────────────────────────────────┐
│ 🛡️ QuackAI Behavior Monitor            │
├─────────────────────────────────────────┤
│                                         │
│  🚨 Alerts (Last 24h): 3                │
│                                         │
│  ⚠️ HIGH RISK PLAYER                    │
│  Player: xXGrieferXx                    │
│  Risk Score: 87/100                     │
│  Detected: Mass block destruction       │
│  Evidence: Destroyed 5,000 blocks in 2m │
│                                         │
│  [View Replay] [Ban] [Kick] [Warn]      │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│  ⚠️ MEDIUM RISK                         │
│  Player: SuspiciousPlayer               │
│  Risk Score: 62/100                     │
│  Detected: Unusual movement (fly hack?) │
│                                         │
│  [Investigate] [Dismiss]                │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│  📊 Overall Server Health: ✅ Good       │
│  Toxic Chat: 2% (Normal: <5%)           │
│  PvP Griefing: 0 incidents              │
│  Exploit Attempts: 1 blocked            │
│                                         │
└─────────────────────────────────────────┘
```

#### **Detection Categories**

| Category | Indicators | Action |
|----------|----------|--------|
| **Griefing** | Mass block destruction, lava/TNT spam, base destruction | Alert mod, temp ban option |
| **Cheating** | Impossible movement, instant mining, x-ray patterns | Auto-kick, evidence collection |
| **Toxicity** | Hate speech, harassment, spam | Chat warnings, mute |
| **Account Sharing** | Multiple IPs, unusual login patterns | Security alert |
| **Exploiting** | Item duplication, unauthorized commands | Auto-prevent, log |

#### **Technical Implementation**

```python
# Anomaly Detection Models

# 1. Movement Analysis (Fly/Speed Hacks)
class MovementAnomalyDetector:
    def analyze(self, player_data):
        features = {
            'avg_speed': calculate_speed(player_data.positions),
            'vertical_velocity': calculate_vertical_speed(player_data),
            'impossible_jumps': count_impossible_jumps(player_data),
            'collision_violations': count_no_clip_events(player_data)
        }

        # Isolation Forest for anomaly detection
        score = self.model.predict([features])
        return {
            'is_anomaly': score < 0,
            'risk_score': abs(score) * 100,
            'evidence': self.get_evidence(player_data)
        }

# 2. Block Interaction Analysis (Griefing/X-Ray)
class BlockInteractionDetector:
    def analyze(self, player_data, timeframe='5m'):
        features = {
            'blocks_destroyed': count_blocks_destroyed(player_data, timeframe),
            'blocks_placed': count_blocks_placed(player_data, timeframe),
            'rare_ore_ratio': calculate_ore_ratio(player_data),  # X-ray detection
            'destruction_pattern': analyze_pattern(player_data),  # Random vs structured
            'valuable_blocks': count_valuable_blocks(player_data)
        }

        # Rule-based + ML hybrid
        if features['blocks_destroyed'] > 1000:  # Threshold
            if features['destruction_pattern'] == 'random_widespread':
                return {'type': 'griefing', 'confidence': 0.95}

        if features['rare_ore_ratio'] > 0.7:  # Normal is ~0.1
            return {'type': 'xray', 'confidence': 0.90}

        return {'type': 'normal', 'confidence': 1.0}

# 3. Chat Toxicity Detection
class ChatModerationAI:
    def __init__(self):
        # Use pre-trained transformer model
        self.model = pipeline('text-classification',
                              model='unitary/toxic-bert')

    def analyze(self, message):
        result = self.model(message)[0]

        return {
            'is_toxic': result['label'] == 'toxic',
            'confidence': result['score'],
            'categories': self.categorize_toxicity(message),
            'recommended_action': self.suggest_action(result)
        }

    def suggest_action(self, result):
        if result['score'] > 0.9:
            return 'auto_mute'
        elif result['score'] > 0.7:
            return 'warning'
        else:
            return 'log_only'
```

#### **Success Metrics**
- Griefing detection accuracy: >85%
- Cheat detection accuracy: >90%
- False positive rate: <5%
- Moderation time saved: 70%
- Player report validation: 95% match AI alerts

---

### 2.4 Smart Resource Alerts

#### **User Experience**

**Alert Types:**

```
🔴 CRITICAL
"Your server will run out of disk space in 2 hours.
Backups are consuming 15GB. Delete old backups or upgrade storage."
[Auto-Cleanup Old Backups] [Upgrade Storage]

🟠 WARNING
"RAM usage has been >90% for 30 minutes.
Consider upgrading to QuackPro plan for better performance."
[Optimize Now] [Upgrade Plan]

🟡 INFO
"Your server is using 40% less CPU this week.
You could downgrade to save $15/month without performance impact."
[Review Plan Options]

🟢 SUCCESS
"QuackAI automatically optimized your server.
TPS improved from 17.2 to 19.5. No action needed!"
[View Details]
```

**Alert Intelligence:**
```javascript
// Smart alert deduplication and prioritization
class SmartAlertSystem {
  async sendAlert(alert) {
    // 1. Check if similar alert sent recently
    if (await this.isDuplicate(alert, timeWindow='1h')) {
      return  // Don't spam user
    }

    // 2. Aggregate multiple related alerts
    const relatedAlerts = await this.findRelated(alert)
    if (relatedAlerts.length > 2) {
      alert = this.combineAlerts([alert, ...relatedAlerts])
    }

    // 3. Determine urgency and channel
    const urgency = this.calculateUrgency(alert)
    const channel = this.selectChannel(urgency)

    // Critical → Push + SMS + Email
    // Warning → Push + Email
    // Info → Dashboard only

    // 4. Include AI-suggested actions
    alert.actions = await this.suggestActions(alert)

    // 5. Send via appropriate channel
    await this.deliver(alert, channel)
  }
}
```

---

## 3. PRICING & TIERS

### 3.1 Feature Availability

| Feature | Free | QuackAI Basic ($10/mo) | QuackAI Pro ($25/mo) | Enterprise |
|---------|------|----------------------|---------------------|------------|
| Crash Prediction | ✅ 10min warning | ✅ 30min warning | ✅ 60min warning | ✅ Custom |
| Auto-Optimization | ❌ | ✅ Weekly | ✅ Daily | ✅ Real-time |
| Performance Insights | ✅ Basic | ✅ Detailed | ✅ Advanced | ✅ Custom |
| Player Behavior | ❌ | ✅ Basic | ✅ Advanced | ✅ Custom ML |
| Smart Alerts | ✅ Email only | ✅ Push + Email | ✅ All channels | ✅ + Slack/Discord |
| Mod Conflict Detection | ❌ | ✅ | ✅ | ✅ |
| Predictive Scaling | ❌ | ❌ | ✅ | ✅ |
| Natural Language Commands | ❌ | ❌ | ✅ | ✅ |
| API Access | ❌ | ✅ Limited | ✅ Full | ✅ Unlimited |
| Custom ML Models | ❌ | ❌ | ❌ | ✅ |

---

## 4. IMPLEMENTATION PLAN

### Phase 1: MVP (Q1-Q2 2025) - 6 months

**Sprint 1-2 (Month 1): Data Infrastructure**
- ✅ Set up InfluxDB time-series database
- ✅ Deploy metrics collection agents (Telegraf)
- ✅ Build data pipeline (Kafka)
- ✅ Create data warehouse (PostgreSQL)

**Sprint 3-4 (Month 2): ML Infrastructure**
- ✅ Set up ML training environment (GPU cluster)
- ✅ Implement MLflow for model management
- ✅ Build feature engineering pipeline
- ✅ Create model serving infrastructure (TensorFlow Serving)

**Sprint 5-8 (Months 3-4): Core Models**
- ✅ Develop crash prediction model (LSTM)
- ✅ Train on 1M+ hours of server data
- ✅ Build auto-optimization agent (PPO)
- ✅ Validate models (95% accuracy target)

**Sprint 9-12 (Months 5-6): Product Integration**
- ✅ Build QuackAI API endpoints
- ✅ Integrate into QuackPlane UI
- ✅ Implement alert system
- ✅ Beta testing with 100 servers
- ✅ Public launch

### Phase 2: Advanced Features (Q3-Q4 2025) - 6 months

- ✅ Player behavior analysis
- ✅ Mod conflict detection
- ✅ Predictive scaling
- ✅ Security anomaly detection
- ✅ Multi-game support expansion

### Phase 3: Premium Features (2026) - 12 months

- ✅ Natural language interface
- ✅ Custom ML model training
- ✅ Content generation AI
- ✅ Multi-server orchestration
- ✅ Advanced analytics

---

## 5. SUCCESS METRICS & MONITORING

### 5.1 Product Metrics

| Metric | Target | Current | Measurement |
|--------|--------|---------|-------------|
| Crash Prediction Accuracy | 95% | TBD | Precision/Recall |
| Auto-Opt TPS Improvement | +25% | TBD | Before/After avg |
| Alert Actionability | 80% | TBD | Actions taken / Alerts sent |
| Feature Adoption | 70% | TBD | Active users / Total users |
| Customer Satisfaction | 4.5/5 | TBD | Post-optimization survey |

### 5.2 Business Metrics

| Metric | Target | Impact |
|--------|--------|--------|
| QuackAI Conversion | 40% | Free → Paid AI tier |
| ARPU Increase | +$15 | AI upsells |
| Churn Reduction | -30% | Better performance → retention |
| Support Ticket Reduction | -50% | AI handles issues proactively |
| NPS Improvement | +15 pts | AI-driven value |

---

## 6. TECHNICAL REQUIREMENTS

### 6.1 Infrastructure

**Compute:**
- 5x p3.2xlarge (GPU instances) for training
- 10x c6i.xlarge for inference
- Auto-scaling based on load

**Storage:**
- InfluxDB cluster: 10TB (time-series data)
- PostgreSQL: 5TB (structured data)
- S3: Unlimited (model artifacts, logs)

**Services:**
- Kafka: Event streaming
- Redis: Real-time caching
- MLflow: Model versioning
- TensorFlow Serving: Model deployment

### 6.2 Data Requirements

**Training Data:**
- 5M+ server hours (historical)
- 100K+ crash events
- 10M+ player sessions
- 1B+ chat messages (toxicity training)

**Real-time Data:**
- 100K+ servers × 10-second intervals
- ~1M data points per second
- 100TB/month incoming data

### 6.3 Team Requirements

**Year 1:**
- 2x ML Engineers
- 1x Data Engineer
- 1x Backend Engineer (API)
- 1x Frontend Engineer (UI integration)

**Year 2:**
- +2 ML Engineers (specialized models)
- +1 Data Scientist (analytics)
- +1 MLOps Engineer

---

## 7. COMPETITIVE ADVANTAGE

### 7.1 Why Competitors Can't Copy This

1. **Data Moat:** 5M+ hours of proprietary training data
2. **Network Effects:** More servers → better models → more servers
3. **Technical Complexity:** Requires deep ML + gaming expertise
4. **Cost Barrier:** $2M+ investment in infrastructure & talent
5. **Time to Market:** 12-18 months to replicate (first-mover advantage)

### 7.2 Defensibility

- Proprietary algorithms (trade secrets)
- Continuous improvement (models get better daily)
- Integration depth (embedded in platform)
- Brand association (QuackAI = smart hosting)

---

## 8. FUTURE VISION (2026+)

### 8.1 QuackAI 3.0: The Autonomous Platform

**"Your server runs itself. You focus on your community."**

- **Fully Autonomous:** Zero manual configuration needed
- **Self-Healing:** Prevents 99% of issues before they impact users
- **Predictive:** Knows what your players want before you do
- **Generative:** Creates custom content tailored to your community

### 8.2 Moonshot Features

- **AI Game Master:** Dynamic quests, events, NPCs powered by LLMs
- **Community Intelligence:** Understands player sentiment, suggests events
- **Cross-Server Learning:** Optimizations from 1M servers benefit everyone
- **Natural Language Everything:** Manage entire server by chatting with AI

---

**Document Status:** ✅ Ready for Implementation
**Owner:** QuackAI Team
**Review:** Quarterly
**Confidential:** Internal Use Only

🦆 **Let's build the future of game server hosting.**
