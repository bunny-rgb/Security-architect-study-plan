# Phase 0 (Network Fundamentals) - Missing Lessons Plan

## Current Status
- ✅ Lesson 1 (Day 1): OSI Model Deep Dive - **FIXED** (added all 7 layers)
- ✅ Lesson 2 (Day 2): TCP/IP Protocol Suite
- ❌ Lesson 3 (Day 3): **MISSING - TCP vs UDP Communication**
- ❌ Lesson 4 (Day 4): **MISSING - DNS Fundamentals**  
- ❌ Lesson 5 (Day 5): **MISSING - DNS Records & Configuration**
- ❌ Lesson 6 (Day 6): **MISSING - HTTP Protocol Deep Dive**
- ❌ Lesson 7 (Day 7): **MISSING - HTTPS & TLS/SSL Handshake**
- ❌ Lesson 8 (Day 8): **MISSING - Network Security Basics**
- ❌ Lesson 9 (Day 9): **MISSING - Ports & Firewalls**
- ❌ Lesson 10 (Day 10): **MISSING - IP Addressing & Subnetting**

## Lessons to Add (8 new lessons)

### Lesson 3: TCP vs UDP Communication (Day 3)
**Image**: `/images/lessons/tcp-vs-udp-communication.png` ✅ Downloaded
**Content**:
- TCP connection-oriented vs UDP connectionless
- Three-way handshake detailed explanation
- When to use TCP vs UDP
- Real-world use cases (gaming, streaming, file transfer)
- Performance comparison
- Security implications

### Lesson 4: DNS Fundamentals (Day 4)
**Content**:
- What is DNS and why it exists
- DNS hierarchy (root, TLD, authoritative servers)
- DNS resolution process
- Recursive vs iterative queries
- DNS caching
- Common DNS attacks (DDoS, cache poisoning, DNS tunneling)

### Lesson 5: DNS Records & Configuration (Day 5)
**Content**:
- A and AAAA records
- CNAME, MX, TXT records
- NS and SOA records
- PTR records for reverse DNS
- SRV records
- DNSSEC for security
- Practical configuration examples

### Lesson 6: HTTP Protocol Deep Dive (Day 6)
**Content**:
- HTTP request/response structure
- HTTP methods (GET, POST, PUT, DELETE, etc.)
- Status codes (2xx, 3xx, 4xx, 5xx)
- Headers and their security implications
- HTTP/1.1 vs HTTP/2 vs HTTP/3
- HTTP cookies and sessions

### Lesson 7: HTTPS & TLS/SSL Handshake (Day 7)
**Image**: `/images/lessons/https-handshake.png` ✅ Downloaded
**Content**:
- TLS/SSL encryption overview
- TLS handshake step-by-step
- Certificate authority chain
- Public/private key cryptography
- Perfect Forward Secrecy
- TLS 1.2 vs TLS 1.3
- Common TLS attacks and mitigations

### Lesson 8: Network Security Basics (Day 8)
**Content**:
- Defense in depth principle
- Network segmentation
- DMZ and perimeter security
- VPNs and tunneling
- IDS vs IPS
- Security best practices

### Lesson 9: Ports & Firewalls (Day 9)
**Content**:
- Well-known ports (80, 443, 22, 21, etc.)
- Port scanning and detection
- Firewall types (packet filter, stateful, application)
- Firewall rules and ACLs
- Best practices for port security

### Lesson 10: IP Addressing & Subnetting (Day 10)
**Content**:
- IPv4 address structure
- Public vs private IP addresses
- CIDR notation
- Subnetting calculations
- IPv6 basics
- NAT and PAT

## Image Mapping Updates

Need to update `/home/user/webapp/app/lesson/[id]/page.tsx`:

```typescript
const LESSON_IMAGES: Record<number, string[]> = {
  1: ['/images/lessons/osi-model.png', '/images/lessons/application-layer.png', ...], // OSI
  2: ['/images/lessons/tcp-handshake.png', '/images/lessons/transport-layer.png'], // TCP/IP
  3: ['/images/lessons/tcp-vs-udp-communication.png'], // TCP vs UDP  
  4: [], // DNS Fundamentals
  5: [], // DNS Records
  6: [], // HTTP
  7: ['/images/lessons/https-handshake.png'], // HTTPS
  8: [], // Network Security
  9: [], // Ports & Firewalls
  10: [], // IP Addressing
}
```

## Quiz Questions

Each lesson needs 10-15 MIT-level questions. Need to add to `lib/comprehensiveMITQuizzes.ts`:
- 120+ new questions total (8 lessons × 15 questions each)

## Implementation Priority

1. **HIGH**: Add Lesson 3 (TCP vs UDP) - User specifically requested
2. **HIGH**: Add Lesson 7 (HTTPS Handshake) - User specifically requested  
3. **MEDIUM**: Add Lessons 4-6 (DNS, HTTP)
4. **MEDIUM**: Add Lessons 8-10 (Security, Ports, IP)
5. **LOW**: Create quiz questions for all new lessons

## Next Steps

1. Create lesson 3 (TCP vs UDP) with comprehensive content
2. Create lesson 7 (HTTPS Handshake) with comprehensive content
3. Update image mapping in lesson page component
4. Test navigation flow
5. Add remaining lessons (4,5,6,8,9,10)
6. Create quiz questions
7. Test full Phase 0 completion → Phase 1 unlock
