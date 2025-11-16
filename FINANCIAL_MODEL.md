# QuackHost Financial Model & Projections

## Executive Summary

**Business Model**: SaaS subscription for game server hosting
**Revenue Model**: Tiered monthly/annual subscriptions
**Target**: $15k MRR in 3 months, $150k MRR in 12 months
**Unit Economics**: LTV:CAC ratio of 3:1, 70% gross margins
**Fundraising**: $500k seed round to reach profitability

---

## Revenue Model

### Pricing Tiers

```yaml
Basic Plan:
  Monthly: $15
  Annual: $150 ($12.50/mo, 2 months free)
  RAM: 2GB
  CPU: 2 vCPU
  Storage: 10GB
  Players: 10
  Target: Casual server owners, small friends group

Standard Plan:
  Monthly: $30
  Annual: $300 ($25/mo, 2 months free)
  RAM: 4GB
  CPU: 4 vCPU
  Storage: 25GB
  Players: 25
  Target: Active communities, modded servers

Premium Plan:
  Monthly: $60
  Annual: $600 ($50/mo, 2 months free)
  RAM: 8GB
  CPU: 8 vCPU
  Storage: 50GB
  Players: 50
  Target: Large communities, content creators

Enterprise:
  Monthly: $500-$5000+
  Custom specs and pricing
  White-label options
  Dedicated support
  Target: Gaming networks, studios
```

### Revenue Mix Projections

**Month 3** (500 customers, $15k MRR):
- Basic (30%): 150 customers × $15 = $2,250
- Standard (55%): 275 customers × $30 = $8,250
- Premium (13%): 65 customers × $60 = $3,900
- Enterprise (2%): 10 customers × $50 avg = $500
- **Total MRR**: $14,900

**Month 6** (1,500 customers, $50k MRR):
- Basic (25%): 375 customers × $15 = $5,625
- Standard (55%): 825 customers × $30 = $24,750
- Premium (17%): 255 customers × $60 = $15,300
- Enterprise (3%): 45 customers × $100 avg = $4,500
- **Total MRR**: $50,175

**Month 12** (5,000 customers, $150k MRR):
- Basic (20%): 1,000 customers × $15 = $15,000
- Standard (50%): 2,500 customers × $30 = $75,000
- Premium (25%): 1,250 customers × $60 = $75,000
- Enterprise (5%): 250 customers × $200 avg = $50,000
- **Total MRR**: $215,000 (overshot target)

**Adjusted Month 12** (4,500 customers, $150k MRR):
- Basic (20%): 900 customers × $15 = $13,500
- Standard (50%): 2,250 customers × $30 = $67,500
- Premium (25%): 1,125 customers × $60 = $67,500
- Enterprise (5%): 225 customers × $50 avg = $11,250
- **Total MRR**: $159,750

### Annual vs Monthly Mix

```
Month 1-3: 10% annual, 90% monthly
Month 4-6: 20% annual, 80% monthly
Month 7-12: 30% annual, 70% monthly
Year 2+: 40% annual, 60% monthly

Benefits of annual:
- Lower churn
- Better cash flow
- Higher LTV
- Discount is worth it (2 months free = 17% off)
```

---

## Growth Projections

### Customer Acquisition

```
Month 1:  100 customers (+100)
Month 2:  250 customers (+150)
Month 3:  500 customers (+250)
Month 4:  750 customers (+250)
Month 5:  1,000 customers (+250)
Month 6:  1,500 customers (+500)
Month 7:  2,000 customers (+500)
Month 8:  2,500 customers (+500)
Month 9:  3,200 customers (+700)
Month 10: 4,000 customers (+800)
Month 11: 4,750 customers (+750)
Month 12: 5,500 customers (+750)
```

**Growth Rate**:
- Month 1-3: 100% MoM (early growth)
- Month 4-6: 30-50% MoM (scaling)
- Month 7-12: 20-30% MoM (mature growth)

**Acquisition Channels**:
```
Organic (SEO, content, viral): 60%
Paid (Google, social ads): 30%
Referrals: 10%
Partnerships: Bonus on top
```

### Monthly Recurring Revenue (MRR)

```
Month 1:  $3,000
Month 2:  $7,500
Month 3:  $15,000
Month 4:  $22,500
Month 5:  $30,000
Month 6:  $50,000
Month 7:  $70,000
Month 8:  $90,000
Month 9:  $115,000
Month 10: $140,000
Month 11: $165,000
Month 12: $190,000
```

**ARR (Annual Run Rate)**:
- Month 3: $180k
- Month 6: $600k
- Month 12: $2.3M

### Churn Assumptions

```
Month 1 churn: 20% (lots of trials, testing)
Month 2 churn: 15% (still figuring it out)
Month 3+ churn: 10% monthly average

Annual plan churn: 5% (much stickier)

Weighted average churn:
- Month 1-3: 15%
- Month 4-6: 12% (more annual customers)
- Month 7-12: 10% (retention improving)
```

**Churn Prevention Measures**:
- Proactive support for struggling users
- Win-back campaigns
- Exit surveys and follow-ups
- Feature improvements based on feedback

**Target**: Reduce to 7% monthly churn by end of Year 1

---

## Unit Economics

### Customer Acquisition Cost (CAC)

**Blended CAC Target**: $30

**By Channel**:
```
Organic (SEO, content): $10 CAC
  - Content cost: $2k/month
  - Customers from organic: 200/month by Month 6
  - CAC = $2,000 / 200 = $10

Paid (Google Ads, social): $50 CAC
  - Ad spend: $10k/month
  - Customers from paid: 200/month by Month 6
  - CAC = $10,000 / 200 = $50

Referrals: $20 CAC
  - Referral bonus: $10 credit × 2 = $20
  - Customers from referrals: 50/month

Weighted Average:
= (200×$10 + 200×$50 + 50×$20) / 450
= ($2,000 + $10,000 + $1,000) / 450
= $13,000 / 450
= $28.89 CAC
```

**CAC Payback Period**: 2.5 months
- ARPU = $33/month
- CAC = $30
- Payback = $30 / $33 = 0.9 months
- With churn: ~2.5 months

### Lifetime Value (LTV)

**Calculation**:
```
ARPU (Average Revenue Per User) = $33/month
  - Weighted average of all plans
  - (20%×$15) + (50%×$30) + (25%×$60) + (5%×$50) = $32.50

Average customer lifetime = 1 / churn rate
  - Monthly churn: 10%
  - Lifetime: 1 / 0.10 = 10 months

Gross Margin: 70%
  - Revenue: $33/month
  - COGS: $10/month (infrastructure cost per server)
  - Gross margin: ($33 - $10) / $33 = 70%

LTV = ARPU × Gross Margin × Lifetime
LTV = $33 × 0.70 × 10
LTV = $231
```

**LTV:CAC Ratio**: $231 / $30 = **7.7:1**

This is excellent! Target is 3:1, we're beating that.

### Monthly Cohort Analysis

Example: Month 3 cohort (500 customers)

```
Month 3:  500 customers, $15,000 MRR
Month 4:  425 customers, $12,750 MRR (15% churn)
Month 5:  370 customers, $11,100 MRR (13% churn)
Month 6:  333 customers, $9,990 MRR (10% churn)
Month 7:  300 customers, $9,000 MRR (10% churn)
Month 8:  270 customers, $8,100 MRR (10% churn)
Month 9:  243 customers, $7,290 MRR (10% churn)
Month 10: 219 customers, $6,561 MRR (10% churn)
Month 11: 197 customers, $5,905 MRR (10% churn)
Month 12: 177 customers, $5,314 MRR (10% churn)

Total revenue from this cohort over 10 months: $91,010
Average per customer: $182 over 10 months
```

---

## Cost Structure

### Cost of Goods Sold (COGS)

**Infrastructure per server**:
```
Compute (Kubernetes pod): $8/month
  - c6i.xlarge instance can run ~10 servers
  - Instance cost: $80/month
  - Per server: $8/month

Storage (EBS + S3 backups): $1.50/month
  - 10GB EBS: $1/month
  - Backups in S3: $0.50/month

Network (bandwidth): $0.50/month
  - Minimal for game traffic
  - Cloudflare CDN is free tier

Total COGS per server: $10/month
```

**Gross Margin**:
```
Basic: ($15 - $10) / $15 = 33% gross margin
Standard: ($30 - $10) / $30 = 67% gross margin
Premium: ($60 - $10) / $60 = 83% gross margin
Enterprise: ($500 - $20) / $500 = 96% gross margin

Weighted average: 70% gross margin
```

**Monthly COGS**:
```
Month 3:  500 servers × $10 = $5,000
Month 6:  1,500 servers × $10 = $15,000
Month 12: 5,000 servers × $10 = $50,000
```

### Operating Expenses (OpEx)

#### Personnel (Biggest expense)

```
Month 1-3 (4 people):
  - 3 Engineers @ $120k = $360k/year = $90k/quarter
  - 1 PM/Designer @ $100k = $25k/quarter
  Total: $115k/quarter = $38k/month

Month 4-6 (7 people):
  - 5 Engineers @ $120k = $600k/year = $150k/quarter
  - 1 PM @ $100k = $25k/quarter
  - 1 Designer @ $80k = $20k/quarter
  Total: $195k/quarter = $65k/month

Month 7-9 (10 people):
  - 7 Engineers @ $120k = $210k/quarter
  - 1 Product Manager @ $100k = $25k/quarter
  - 1 Designer @ $80k = $20k/quarter
  - 1 Sales Rep @ $100k OTE = $25k/quarter
  Total: $280k/quarter = $93k/month

Month 10-12 (14 people):
  - 9 Engineers @ $120k = $270k/quarter
  - 1 Product Manager @ $100k = $25k/quarter
  - 1 Designer @ $80k = $20k/quarter
  - 2 Sales Reps @ $100k OTE = $50k/quarter
  - 1 Customer Success @ $70k = $17.5k/quarter
  Total: $382k/quarter = $127k/month
```

#### Marketing & Sales

```
Month 1-3:
  - Content creation: $5k/month
  - Paid ads: $5k/month (testing)
  - Tools (analytics, SEO): $1k/month
  Total: $11k/month

Month 4-6:
  - Content creation: $10k/month
  - Paid ads: $15k/month (scaling)
  - Tools: $2k/month
  - Community events: $3k/month
  Total: $30k/month

Month 7-12:
  - Content creation: $15k/month
  - Paid ads: $30k/month (scaling)
  - Tools: $3k/month
  - Community events: $5k/month
  - PR/partnerships: $5k/month
  Total: $58k/month
```

#### Infrastructure & Tools

```
Month 1-3:
  - AWS/infrastructure: $3k/month
  - SaaS tools: $2k/month
  Total: $5k/month

Month 4-6:
  - AWS/infrastructure: $10k/month
  - SaaS tools: $3k/month
  Total: $13k/month

Month 7-12:
  - AWS/infrastructure: $30k/month
  - SaaS tools: $5k/month
  Total: $35k/month
```

#### Other Operating Expenses

```
Legal & accounting: $2k/month
Office/misc: $1k/month
Customer support tools: $1k/month
Total: $4k/month (constant)
```

### Monthly Operating Expense Summary

```
Month 1:
  Personnel: $38k
  Marketing: $11k
  Infrastructure: $5k
  COGS: $1k (100 servers)
  Other: $4k
  Total: $59k

Month 3:
  Personnel: $38k
  Marketing: $11k
  Infrastructure: $5k
  COGS: $5k (500 servers)
  Other: $4k
  Total: $63k

Month 6:
  Personnel: $65k
  Marketing: $30k
  Infrastructure: $13k
  COGS: $15k (1,500 servers)
  Other: $4k
  Total: $127k

Month 12:
  Personnel: $127k
  Marketing: $58k
  Infrastructure: $35k
  COGS: $50k (5,000 servers)
  Other: $4k
  Total: $274k
```

---

## Profit & Loss Statement

### Monthly P&L

```
Month 1:
Revenue:      $3,000
COGS:         $1,000
Gross Profit: $2,000 (67% margin)
OpEx:         $58,000
Net Income:   -$56,000 (burning)

Month 3:
Revenue:      $15,000
COGS:         $5,000
Gross Profit: $10,000 (67% margin)
OpEx:         $58,000
Net Income:   -$48,000

Month 6:
Revenue:      $50,000
COGS:         $15,000
Gross Profit: $35,000 (70% margin)
OpEx:         $112,000
Net Income:   -$77,000

Month 12:
Revenue:      $190,000
COGS:         $50,000
Gross Profit: $140,000 (74% margin)
OpEx:         $224,000
Net Income:   -$84,000

Month 18 (projection):
Revenue:      $400,000
COGS:         $100,000
Gross Profit: $300,000 (75% margin)
OpEx:         $280,000
Net Income:   +$20,000 (PROFITABLE!)
```

### Cumulative P&L (Year 1)

```
Total Revenue: $600k
  - Ramp from $3k to $190k MRR
  - Average ~$50k/month

Total COGS: $180k
  - 30% of revenue

Gross Profit: $420k

Total OpEx: $1.1M
  - Personnel: $700k
  - Marketing: $330k
  - Infrastructure: $130k
  - Other: $48k

Net Income: -$680k (loss in year 1)

Cash burn: ~$57k/month average
```

### Break-Even Analysis

**Break-even MRR**: $300k
- OpEx at scale: $280k/month
- COGS (10k servers): $100k/month
- Total monthly burn: $380k
- Need $380k MRR to break even

**Time to break-even**: Month 18
- If growth continues at 20% MoM
- Month 12: $190k MRR
- Month 18: $570k MRR (profitable)

**Path to profitability**:
1. Reach $190k MRR by Month 12
2. Control OpEx growth (hire strategically)
3. Improve unit economics (lower CAC, higher retention)
4. Achieve break-even by Month 18
5. Profitability after Month 18

---

## Cash Flow & Fundraising

### Fundraising Plan

**Seed Round: $500k**

**Use of Funds**:
```
Personnel (50%): $250k
  - Salaries for 4-14 people over 12 months
  - Ramp from 4 to 14 employees

Marketing & Sales (25%): $125k
  - Content creation
  - Paid acquisition
  - Community building
  - Tools & analytics

Infrastructure (15%): $75k
  - AWS hosting costs
  - SaaS tools
  - Security & compliance

Operations (10%): $50k
  - Legal & accounting
  - Misc expenses
  - Buffer for unexpected

Total: $500k
```

**Runway**:
```
Month 1-6 burn: $60k/month avg = $360k
Month 7-12 burn: $84k/month avg = $504k
Total burn: $864k

Funding: $500k
Revenue (cash collected): $400k in year 1
Total cash available: $900k

Runway: 12+ months
```

**Why $500k is enough**:
1. Get to $190k MRR (product-market fit)
2. Prove unit economics work
3. Build traction for Series A
4. Revenue offsets burn after Month 6

### Series A Fundraising

**Timeline**: Month 10-12 (start raising)
**Target**: $10M at $40M pre-money valuation
**Traction needed**:
- $150k+ MRR
- Growing 20%+ MoM
- LTV:CAC > 3:1
- NRR > 100%
- Clear path to $10M ARR

**Use of Series A funds**:
- Scale marketing (10x ad spend)
- Build out sales team (10+ reps)
- International expansion
- Enterprise features
- M&A (acquire competitors)

### Cash Flow Projections

```
Month 1:
  Starting cash: $500k
  Revenue: $3k
  Expenses: $59k
  Net: -$56k
  Ending cash: $444k

Month 3:
  Starting cash: $332k
  Revenue: $15k
  Expenses: $63k
  Net: -$48k
  Ending cash: $284k

Month 6:
  Starting cash: $50k
  Revenue: $50k
  Expenses: $127k
  Net: -$77k
  Ending cash: -$27k (need bridge)

Month 6 (adjusted with better revenue):
  Starting cash: $100k
  Revenue: $50k
  Annual contracts (prepaid): +$150k one-time
  Expenses: $127k
  Net: +$73k
  Ending cash: $173k

Month 12:
  Starting cash: $50k
  Revenue: $190k
  Expenses: $274k
  Net: -$84k
  Ending cash: -$34k

Series A closes Month 11: +$10M
Month 12 cash: $9.9M
```

**Key Insight**: Need to drive annual contracts for cash flow
- Annual plans provide upfront cash
- Reduces need for bridge financing
- Helps reach Series A on strong footing

---

## Sensitivity Analysis

### Best Case Scenario

**Assumptions**:
- Growth 50% faster (150 customers/month instead of 100)
- Lower churn (7% instead of 10%)
- Higher ARPU ($40 instead of $33)
- Lower CAC ($20 instead of $30)

**Results**:
- Month 12 MRR: $350k (instead of $190k)
- Month 12 customers: 8,000 (instead of 5,000)
- Profitability: Month 12 (instead of Month 18)
- Series A valuation: $100M (instead of $40M)

### Base Case (Most Likely)

**Assumptions**:
- Growth as modeled above
- 10% monthly churn
- $33 ARPU
- $30 CAC

**Results**:
- Month 12 MRR: $190k
- Month 12 customers: 5,000
- Profitability: Month 18
- Series A valuation: $40M

### Worst Case Scenario

**Assumptions**:
- Growth 50% slower
- High churn (15%)
- Lower ARPU ($28)
- Higher CAC ($50)

**Results**:
- Month 12 MRR: $80k
- Month 12 customers: 2,500
- Profitability: Month 30+
- May need bridge round before Series A

**Mitigation**:
- Cut marketing spend if CAC too high
- Focus on retention over acquisition
- Reduce team size if needed
- Extend runway by controlling costs

---

## Key Metrics to Track

### Weekly Metrics

1. **New customers** (by channel)
2. **MRR** (growth week-over-week)
3. **Churn** (customers lost)
4. **CAC** (by channel)
5. **Active servers** (usage metric)

### Monthly Metrics

1. **MRR growth rate**
2. **Customer count**
3. **ARPU**
4. **LTV:CAC ratio**
5. **Gross margin**
6. **Net burn rate**
7. **Months of runway**
8. **NPS**

### Quarterly Metrics

1. **ARR**
2. **Customer cohort retention**
3. **Net Revenue Retention**
4. **Rule of 40** (growth + profit margin)
5. **Magic Number** (sales efficiency)

### SaaS Metrics Benchmarks

```
Good SaaS metrics:
- Monthly churn: < 5%
- CAC payback: < 12 months
- LTV:CAC: > 3:1
- Gross margin: > 70%
- Net Revenue Retention: > 100%
- Rule of 40: > 40%

Our targets:
- Monthly churn: 10% → 7% (working on it)
- CAC payback: 2.5 months ✅
- LTV:CAC: 7.7:1 ✅
- Gross margin: 70% ✅
- NRR: 110% (target)
- Rule of 40: 20% growth + (-40%) margin = -20% (pre-revenue)

By Month 12:
- Rule of 40: 50% growth + (-20%) margin = 30% (getting there)
```

---

## Fundraising Deck Metrics

### Slide 1: Traction

"We've grown from 0 to $190k MRR in 12 months"
- Chart showing hockey stick growth
- 5,000 customers
- Growing 20% MoM

### Slide 2: Unit Economics

"Strong unit economics with 7:1 LTV:CAC"
- LTV: $231
- CAC: $30
- Payback: 2.5 months
- 70% gross margins

### Slide 3: Retention

"Customers love us - 90% monthly retention"
- Cohort retention curves
- NPS: 55
- Net Revenue Retention: 110%

### Slide 4: Market

"$2B market growing 15% annually"
- TAM: $2B
- SAM: $500M
- SOM: $50M (Year 3)

### Slide 5: Ask

"Raising $10M Series A to scale to $10M ARR"
- Use of funds
- 18-month plan
- Projected ARR: $10M by Month 30
- Path to profitability

---

## Financial Model Summary

### Year 1 Targets

```
MRR:
  - Start: $0
  - Month 12: $190k
  - ARR: $2.3M

Customers:
  - Start: 0
  - Month 12: 5,000

Unit Economics:
  - CAC: $30
  - LTV: $231
  - LTV:CAC: 7.7:1
  - Gross Margin: 70%

Burn:
  - Total: $680k net loss
  - Funding: $500k
  - Revenue: $400k cash collected
  - Runway: 12+ months
```

### Year 2 Targets

```
MRR:
  - Start: $190k
  - End: $800k
  - ARR: $9.6M

Customers:
  - Start: 5,000
  - End: 25,000

Profitability:
  - Break-even: Month 18
  - Profitable from Month 19+

Team:
  - Start: 14 people
  - End: 40 people

Series A:
  - Raise: $10M
  - Valuation: $40M pre
  - Use: Scale marketing, sales, international
```

### Year 3 Targets

```
ARR: $30M
Customers: 80,000
EBITDA margin: 20%
Team: 100 people
Series B: $50M at $200M valuation
```

---

## Investment Thesis

### Why QuackHost Will Win

1. **Large, growing market**
   - $2B+ gaming infrastructure market
   - 20M+ community servers globally
   - Growing 15% YoY

2. **Strong product differentiation**
   - Multi-game support (not just Minecraft)
   - Modern tech stack (Kubernetes, AI)
   - Developer-first (API, SDK, CLI)

3. **Excellent unit economics**
   - 7:1 LTV:CAC ratio
   - 70% gross margins
   - 2.5 month payback

4. **Experienced team**
   - Deep gaming + infrastructure expertise
   - Previous exits
   - Can execute quickly

5. **Clear path to $100M+ ARR**
   - Year 1: $2M ARR
   - Year 2: $10M ARR
   - Year 3: $30M ARR
   - Year 5: $100M ARR

### Use of Funds (Seed $500k)

```
Engineering (50%): $250k
  - Build core product
  - Multi-game support
  - API development

Marketing (25%): $125k
  - Content & SEO
  - Paid acquisition
  - Community building

Operations (25%): $125k
  - Infrastructure
  - Legal, accounting
  - Tools & misc
```

### Milestones (Next 12 Months)

```
Month 3: $15k MRR, 500 customers
  - Product launched
  - Multi-game working
  - API v1 shipped

Month 6: $50k MRR, 1,500 customers
  - Product-market fit
  - Paid acquisition working
  - Mobile app launched

Month 9: $100k MRR, 3,000 customers
  - Start Series A fundraising
  - International expansion
  - Enterprise features

Month 12: $190k MRR, 5,000 customers
  - Close Series A ($10M)
  - Profitable unit economics proven
  - Ready to scale
```

---

## Conclusion

QuackHost has **strong financial fundamentals**:

✅ **Large market**: $2B+ and growing
✅ **Differentiated product**: Multi-game, API-first, modern UX
✅ **Strong unit economics**: 7:1 LTV:CAC, 70% margins
✅ **Clear path to profitability**: Break-even Month 18
✅ **Scalable model**: SaaS with network effects

**Investment ask**: $500k seed round
**Use**: Build product, acquire customers, prove model
**Target**: $190k MRR, 5,000 customers in 12 months
**Next step**: Raise $10M Series A to scale to $10M ARR

This is a **venture-scale opportunity** to build the **AWS of gaming communities**.

**Let's build it.** 🚀
