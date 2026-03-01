// MIT-Level Quiz Database - Real-world Security Scenarios
// 10-15 questions per lesson, professor-level complexity

export interface QuizQuestion {
  id: string
  lessonId: number
  phase: number
  question: string
  scenario?: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  tags: string[]
  codeExample?: string
  references?: string[]
}

export const comprehensiveMITQuizzes: QuizQuestion[] = [
  // ========================================
  // PHASE 0, LESSON 1: OSI Model Deep Dive
  // ========================================
  {
    id: 'p0-l1-q1',
    lessonId: 1,
    phase: 0,
    question: 'During a Black Friday sale, your e-commerce site experiences 100,000 simultaneous users. Your CDN reports a 40% cache miss rate, causing origin server overload. Investigation reveals that session cookies are being sent with every static asset request. Which OSI layer is causing this issue, and what\'s the optimal solution?',
    scenario: 'Traffic spike with poor cache efficiency due to cookie handling',
    options: [
      'Layer 7 (Application) - Configure CDN to strip cookies for static assets and cache based on URL only',
      'Layer 4 (Transport) - Increase TCP connection pool size and enable connection multiplexing',
      'Layer 3 (Network) - Add more anycast IP addresses to distribute traffic geographically',
      'Layer 6 (Presentation) - Enable Brotli compression to reduce payload size'
    ],
    correctAnswer: 0,
    explanation: 'The issue occurs at Layer 7 where HTTP cookies prevent CDN caching. Configure cache keys to ignore cookies for static assets (CSS, JS, images). Use Vary headers strategically. This allows the CDN to serve cached content to all users regardless of session state, dramatically improving cache hit ratio from 60% to 95%+.',
    difficulty: 'hard',
    tags: ['osi-model', 'caching', 'cookies', 'performance'],
    references: ['https://www.cloudflare.com/learning/cdn/caching-best-practices/']
  },
  {
    id: 'p0-l1-q2',
    lessonId: 1,
    phase: 0,
    question: 'Your CDN dashboard shows Asian users experiencing 800ms latency while US users see 80ms. The application uses a microservices architecture with 12 API calls per page load. Which OSI layer optimization would provide the most significant improvement?',
    scenario: 'High latency for geographically distributed users with multiple API calls',
    options: [
      'Layer 7 (Application) - Implement GraphQL to batch API calls and use edge workers for data aggregation',
      'Layer 2 (Data Link) - Upgrade network interface cards to 100Gbps Ethernet',
      'Layer 5 (Session) - Implement WebSocket connections for persistent sessions',
      'Layer 3 (Network) - Add more fiber optic cables between continents'
    ],
    correctAnswer: 0,
    explanation: 'The 10x latency difference is due to round-trip time (RTT) multiplied by 12 API calls. Layer 7 optimization with GraphQL reduces 12 requests to 1, and edge workers execute logic closer to users. This cuts latency from 800ms to ~150ms (1 RTT + processing). Layer 3/2 improvements would have minimal impact on RTT physics.',
    difficulty: 'expert',
    tags: ['osi-model', 'latency', 'api-optimization', 'edge-computing'],
    references: ['https://www.cloudflare.com/learning/performance/what-is-latency/']
  },
  {
    id: 'p0-l1-q3',
    lessonId: 1,
    phase: 0,
    question: 'A DDoS attack is sending 500,000 SYN packets per second to your web server. The server CPU is at 15%, but legitimate users cannot connect. At which OSI layer is the attack occurring, and what\'s the correct mitigation strategy?',
    scenario: 'SYN flood attack overwhelming connection handling',
    options: [
      'Layer 4 (Transport) - Deploy SYN cookies, increase backlog queue, and use anycast to distribute attack across data centers',
      'Layer 7 (Application) - Implement CAPTCHA challenges for all incoming connections',
      'Layer 3 (Network) - Block all traffic from the attacking IP ranges using ACLs',
      'Layer 2 (Data Link) - Enable MAC address filtering on the switch'
    ],
    correctAnswer: 0,
    explanation: 'SYN flood is a Layer 4 attack targeting TCP three-way handshake. SYN cookies allow the server to avoid storing connection state until ACK is received. Anycast distributes the attack across global data centers. Blocking IPs (Layer 3) is ineffective for distributed attacks. Layer 7 CAPTCHA cannot engage before TCP completes. CPU is low because attack happens before application logic.',
    difficulty: 'hard',
    tags: ['osi-model', 'ddos', 'syn-flood', 'layer-4'],
    references: ['https://www.cloudflare.com/learning/ddos/syn-flood-ddos-attack/']
  },
  {
    id: 'p0-l1-q4',
    lessonId: 1,
    phase: 0,
    question: 'Your WAF blocks a suspicious POST request with payload: {"user":"admin\'--"}. After investigation, you discover the attacker encoded the payload three times (URL → Base64 → Hex). Which OSI layer is the WAF operating at, and why did it initially fail to detect the attack?',
    scenario: 'Multi-encoding bypass attempt against WAF',
    options: [
      'Layer 7 (Application) - WAF needs recursive decoding rules to normalize payloads at the presentation layer before pattern matching',
      'Layer 6 (Presentation) - The attacker exploited SSL/TLS encryption to hide the payload',
      'Layer 4 (Transport) - TCP segmentation split the attack across multiple packets',
      'Layer 5 (Session) - The session token was hijacked and reused'
    ],
    correctAnswer: 0,
    explanation: 'WAF operates at Layer 7, inspecting HTTP application data. Multi-encoding is a common bypass technique. Modern WAFs must recursively decode payloads (URL decode → Base64 → Hex → etc.) before applying SQL injection patterns. This normalization happens at the "presentation" concern within Layer 7. The WAF must decode "admin%2527%252D%252D" → "admin\'--" to detect the SQL comment injection.',
    difficulty: 'expert',
    tags: ['osi-model', 'waf', 'encoding', 'sql-injection'],
    references: ['https://owasp.org/www-community/attacks/SQL_Injection']
  },
  {
    id: 'p0-l1-q5',
    lessonId: 1,
    phase: 0,
    question: 'A financial trading platform requires end-to-end latency under 10ms. Network analysis shows: Layer 2 (2ms), Layer 3 (3ms), Layer 4 (1ms), Layer 7 (8ms). Which layer should be optimized first for maximum impact?',
    options: [
      'Layer 7 - Optimize HTTP/2 server push, implement edge caching, and use protocol buffers instead of JSON',
      'Layer 3 - Implement MPLS to reduce routing overhead',
      'Layer 2 - Upgrade to fiber optic cables with lower latency',
      'Layer 4 - Replace TCP with QUIC for faster connection establishment'
    ],
    correctAnswer: 0,
    explanation: 'Layer 7 (application) accounts for 57% of total latency (8ms/14ms). HTTP parsing, JSON serialization, and multiple round trips are the bottleneck. Using HTTP/2 push, binary protocols (protobuf), and edge computing can reduce Layer 7 latency to 2-3ms. Layer 2/3 improvements would only save 1-2ms total. This follows Amdahl\'s Law - optimize the largest bottleneck first.',
    difficulty: 'hard',
    tags: ['osi-model', 'latency', 'optimization', 'performance'],
    references: []
  },
  {
    id: 'p0-l1-q6',
    lessonId: 1,
    phase: 0,
    question: 'Your security logs show encrypted traffic that bypasses your Layer 7 inspection. The traffic uses TLS 1.3 with encrypted SNI (ESNI). At which layer can you still enforce security policies without breaking encryption?',
    options: [
      'Layer 4 (Transport) - Analyze connection patterns, rate limiting based on IP/port, and use JA3/JA4 TLS fingerprinting',
      'Layer 7 (Application) - Deploy SSL interception to decrypt and inspect all traffic',
      'Layer 3 (Network) - Block all encrypted traffic at the firewall',
      'Layer 6 (Presentation) - Force downgrade to TLS 1.2 to disable encryption'
    ],
    correctAnswer: 0,
    explanation: 'With TLS 1.3 and ESNI, Layer 7 content is fully encrypted. Layer 4 analysis remains effective: connection rate limiting, IP reputation, port blocking, and TLS fingerprinting (JA3/JA4). JA3 fingerprints identify malware families by their TLS handshake patterns without decryption. SSL interception breaks end-to-end encryption and is considered a security anti-pattern. Privacy-preserving security must operate at Layer 3-4.',
    difficulty: 'expert',
    tags: ['osi-model', 'tls', 'encryption', 'privacy'],
    references: ['https://engineering.salesforce.com/tls-fingerprinting-with-ja3-and-ja3s-247362855967']
  },
  {
    id: 'p0-l1-q7',
    lessonId: 1,
    phase: 0,
    question: 'Your CDN serves video content globally. Players report buffering despite 100Mbps client bandwidth. Packet analysis shows perfect Layer 3/4 delivery but 30% packet loss at Layer 7 (HTTP). What\'s the root cause?',
    scenario: 'Video streaming with application-layer packet loss despite network stability',
    options: [
      'Layer 7 (Application) - TCP congestion control is too aggressive; switch to UDP-based protocols like QUIC or WebRTC',
      'Layer 4 (Transport) - Increase TCP window size to improve throughput',
      'Layer 3 (Network) - Add more CDN edge nodes to reduce distance',
      'Layer 2 (Data Link) - Upgrade network switches to support jumbo frames'
    ],
    correctAnswer: 0,
    explanation: 'The issue is TCP head-of-line blocking. When a single packet is lost, TCP halts delivery of all subsequent packets until retransmission succeeds. For video, this causes buffering. UDP-based protocols (QUIC, WebRTC) allow application-layer recovery - one lost packet doesn\'t block others. QUIC also provides multiplexing without head-of-line blocking. This is why YouTube, Netflix, and Zoom use UDP-based protocols.',
    difficulty: 'hard',
    tags: ['osi-model', 'video', 'tcp', 'quic', 'streaming'],
    references: ['https://www.cloudflare.com/learning/performance/what-is-quic/']
  },
  {
    id: 'p0-l1-q8',
    lessonId: 1,
    phase: 0,
    question: 'An attacker is performing ARP spoofing on your local network to intercept traffic. At which OSI layer does this attack occur, and what\'s the relationship to CDN security?',
    options: [
      'Layer 2 (Data Link) - ARP operates at Layer 2; CDN/TLS (Layer 6-7) encryption protects sensitive data even if Layer 2 is compromised',
      'Layer 3 (Network) - ARP spoofing is an IP-level attack that CDNs can prevent',
      'Layer 7 (Application) - This is an application vulnerability that WAF can block',
      'Layer 4 (Transport) - TCP encryption prevents ARP spoofing'
    ],
    correctAnswer: 0,
    explanation: 'ARP (Address Resolution Protocol) maps IP to MAC addresses at Layer 2. ARP spoofing allows an attacker to intercept traffic on the local network. However, TLS encryption (Layer 6-7) protects data in transit. Even if an attacker intercepts packets at Layer 2, they cannot decrypt HTTPS traffic without the private key. This demonstrates defense-in-depth: security at multiple OSI layers. CDNs use TLS 1.3 to prevent interception attacks.',
    difficulty: 'medium',
    tags: ['osi-model', 'arp', 'layer-2', 'encryption', 'tls'],
    references: []
  },
  {
    id: 'p0-l1-q9',
    lessonId: 1,
    phase: 0,
    question: 'Your web application uses WebSockets for real-time updates. During a Layer 7 DDoS attack, the WAF blocks all WebSocket connections. How can you distinguish legitimate WebSocket traffic from attack traffic?',
    scenario: 'Protecting WebSocket connections during Layer 7 DDoS',
    options: [
      'Layer 7 (Application) - Implement token-based authentication in WebSocket handshake, rate limit per token, and use challenge pages for initial HTTP connections',
      'Layer 4 (Transport) - WebSockets use TCP, so SYN cookies will protect them automatically',
      'Layer 6 (Presentation) - Enable SSL pinning to verify client certificates',
      'Layer 3 (Network) - Whitelist known IP addresses and block all others'
    ],
    correctAnswer: 0,
    explanation: 'WebSockets upgrade from HTTP at Layer 7. Effective protection: 1) Require authenticated token in WebSocket handshake URL (?token=xxx), 2) Challenge page before WebSocket (CAPTCHA/JavaScript challenge), 3) Rate limit per authenticated user/token, 4) Monitor connection patterns (attack bots open many connections). This allows legitimate users through while blocking attack traffic. Layer 4 SYN cookies don\'t help after TCP is established. IP whitelisting doesn\'t scale.',
    difficulty: 'hard',
    tags: ['osi-model', 'websockets', 'ddos', 'authentication'],
    references: []
  },
  {
    id: 'p0-l1-q10',
    lessonId: 1,
    phase: 0,
    question: 'A multinational company needs to comply with GDPR data residency requirements. User data must not leave the EU. At which OSI layers must you implement controls, and how does CDN architecture help?',
    options: [
      'Layers 3 & 7 - Use geo-routing at Layer 3 to direct EU traffic to EU data centers, and implement Layer 7 data residency rules in edge workers',
      'Layer 7 only - Data residency is purely an application concern',
      'Layer 2 only - Implement VLANs to segment EU traffic',
      'Layer 4 only - Use TCP socket binding to EU servers'
    ],
    correctAnswer: 0,
    explanation: 'Data residency requires multi-layer controls: Layer 3 (Network) - anycast routing directs users to geographically appropriate data centers based on IP geolocation. Layer 7 (Application) - edge workers enforce business logic (e.g., EU users can only read/write to EU databases). CDN edge nodes in EU process requests locally without data leaving the region. Modern architecture uses "edge sovereignty" - data processing at the edge in the required jurisdiction.',
    difficulty: 'expert',
    tags: ['osi-model', 'compliance', 'gdpr', 'geo-routing'],
    references: []
  },
  {
    id: 'p0-l1-q11',
    lessonId: 1,
    phase: 0,
    question: 'Your monitoring shows Layer 4 connections succeed (TCP SYN-ACK complete), but Layer 7 requests time out. What\'s the most likely root cause?',
    scenario: 'Connection established but application requests fail',
    options: [
      'Layer 7 (Application) - Origin server is accepting connections but application thread pool is exhausted, causing request queue timeout',
      'Layer 4 (Transport) - TCP window scaling is misconfigured',
      'Layer 3 (Network) - Routing tables are corrupted',
      'Layer 6 (Presentation) - SSL handshake is failing'
    ],
    correctAnswer: 0,
    explanation: 'TCP handshake succeeds (Layer 4), proving network/transport layers work. The issue is at Layer 7 - the application. Common causes: application thread pool exhaustion, database connection pool depletion, or infinite loops in code. The server accepts TCP connections but can\'t process HTTP requests. Solution: increase application workers, optimize database queries, implement circuit breakers, or scale horizontally. This pattern is called "slowloris" when exploited as an attack.',
    difficulty: 'medium',
    tags: ['osi-model', 'debugging', 'application-layer', 'performance'],
    references: []
  },
  {
    id: 'p0-l1-q12',
    lessonId: 1,
    phase: 0,
    question: 'An IoT device manufacturer asks you to design a CDN strategy for firmware updates to 10 million devices. Updates are 50MB and released quarterly. Which OSI layer optimizations are critical?',
    scenario: 'Large-scale IoT firmware distribution via CDN',
    options: [
      'Layers 7 & 3 - Use HTTP range requests (Layer 7) for resumable downloads, anycast (Layer 3) for geographic distribution, and HTTP/2 (Layer 7) for efficient transport',
      'Layer 4 only - TCP is sufficient for file downloads',
      'Layer 2 only - Ethernet optimization is the key',
      'Layer 7 only - HTTP is all that matters for downloads'
    ],
    correctAnswer: 0,
    explanation: 'IoT firmware requires multi-layer optimization: Layer 7 - HTTP range requests (Content-Range header) allow devices to resume failed downloads, saving bandwidth. HTTP/2 reduces connection overhead. Layer 3 - anycast routes devices to nearest CDN node (critical for mobile devices). Layer 4 - TCP with appropriate window sizing for lossy networks. Add: Content-Integrity headers (Layer 7) for security, and rate limiting per device. CDN edge caching prevents origin overload during update campaigns.',
    difficulty: 'hard',
    tags: ['osi-model', 'iot', 'cdn', 'distribution'],
    references: []
  },
  {
    id: 'p0-l1-q13',
    lessonId: 1,
    phase: 0,
    question: 'During a security audit, you discover that your WAF logs show "blocked" events, but attack payloads still reach your origin server. What\'s the likely OSI layer misconfiguration?',
    options: [
      'Layer 7 (Application) - Multiple routes to origin exist; attackers bypass WAF using direct origin IP access or alternative hostnames',
      'Layer 4 (Transport) - TCP sequence numbers are predictable',
      'Layer 3 (Network) - IP spoofing is occurring',
      'Layer 2 (Data Link) - MAC address table overflow attack'
    ],
    correctAnswer: 0,
    explanation: 'The WAF is working (blocking traffic), but attackers found a way around it at Layer 7. Common misconfigurations: 1) Origin server accepts traffic directly (not just from CDN/WAF IPs), 2) Alternative DNS records point to origin, 3) Historical IP addresses still work. Solution: Firewall origin to only accept CDN IP ranges, implement origin authentication (shared secret header), and use Cloudflare Tunnel or similar to hide origin IP completely.',
    difficulty: 'hard',
    tags: ['osi-model', 'waf', 'security', 'bypass'],
    references: []
  },
  {
    id: 'p0-l1-q14',
    lessonId: 1,
    phase: 0,
    question: 'You are designing a real-time gaming platform where 100ms latency causes poor user experience. Players connect via mobile networks with variable latency. At which OSI layers can you optimize to guarantee < 100ms p95 latency?',
    scenario: 'Ultra-low latency gaming platform architecture',
    options: [
      'Layers 3, 4, and 7 - Use anycast for optimal routing (Layer 3), QUIC for faster connection establishment (Layer 4/7), and edge computing for game logic (Layer 7)',
      'Layer 7 only - Application optimization is sufficient',
      'Layer 2 only - Faster network cards will solve the problem',
      'Layer 4 only - UDP will eliminate all latency issues'
    ],
    correctAnswer: 0,
    explanation: 'Ultra-low latency requires holistic optimization: Layer 3 - anycast routing minimizes physical distance (reduces propagation delay). Layer 4/7 - QUIC eliminates TCP handshake (saves 1-2 RTT), has no head-of-line blocking. Layer 7 - edge computing runs game state validation at CDN edge (saves origin round trip ~50ms). Mobile networks have 30-80ms base latency; optimization can achieve 60-90ms p95. Also implement: client-side prediction (Layer 7), UDP for non-critical data (Layer 4).',
    difficulty: 'expert',
    tags: ['osi-model', 'gaming', 'latency', 'real-time'],
    references: []
  },
  {
    id: 'p0-l1-q15',
    lessonId: 1,
    phase: 0,
    question: 'A healthcare application must meet HIPAA compliance for patient data transmission. At which OSI layers must you implement security controls to ensure end-to-end protection?',
    options: [
      'Layers 4, 6, and 7 - TLS 1.3 with PFS (Layer 4-6), encrypted at-rest storage (Layer 7), application-level access controls (Layer 7), and audit logging (Layer 7)',
      'Layer 7 only - Application encryption is sufficient',
      'Layer 6 only - SSL/TLS handles all security',
      'Layer 2 only - Physical network security is enough'
    ],
    correctAnswer: 0,
    explanation: 'HIPAA requires defense-in-depth across multiple OSI layers: Layer 4-6 (Transport/Presentation) - TLS 1.3 with Perfect Forward Secrecy protects data in transit. Layer 7 (Application) - additional encryption at rest, role-based access control (RBAC), audit logs, data minimization, and session timeout. Must also implement: BAA (Business Associate Agreement) with CDN provider, data residency controls, and incident response. Security at each layer provides redundancy if one layer fails.',
    difficulty: 'hard',
    tags: ['osi-model', 'compliance', 'hipaa', 'security'],
    references: []
  },

  // ========================================
  // PHASE 0, LESSON 2: TCP/IP Deep Dive & Three-Way Handshake
  // ========================================
  {
    id: 'p0-l2-q1',
    lessonId: 2,
    phase: 0,
    question: 'Your load balancer shows 10,000 connections in SYN_RECEIVED state, consuming 80% of the connection table. Legitimate users report "connection refused" errors. What is happening, and what\'s the immediate mitigation?',
    scenario: 'SYN flood attack exhausting connection state table',
    options: [
      'SYN flood attack - Enable SYN cookies immediately to avoid storing connection state until ACK arrives, then implement anycast and rate limiting',
      'Normal traffic spike - Just increase the connection table size',
      'DDoS at application layer - Deploy WAF rules',
      'Network congestion - Add more bandwidth'
    ],
    correctAnswer: 0,
    explanation: 'Classic SYN flood: attacker sends SYN packets but never completes handshake with ACK. Server stores half-open connections in SYN_RECEIVED state until timeout (30-60s), exhausting the connection table. SYN cookies eliminate state storage - server encodes connection info in the sequence number of SYN-ACK. When ACK arrives, server decodes and creates connection. Also deploy: rate limiting per source IP, anycast to distribute attack, and increase backlog queue size.',
    difficulty: 'hard',
    tags: ['tcp', 'syn-flood', 'ddos', 'handshake'],
    codeExample: `# Enable SYN cookies on Linux
sysctl -w net.ipv4.tcp_syncookies=1
sysctl -w net.ipv4.tcp_max_syn_backlog=4096`,
    references: ['https://www.cloudflare.com/learning/ddos/syn-flood-ddos-attack/']
  },
  {
    id: 'p0-l2-q2',
    lessonId: 2,
    phase: 0,
    question: 'You notice TCP connections taking 3 full seconds to establish between your US data center and Asian clients (1.5s ping RTT). After handshake, throughput is excellent. What optimization can reduce connection time by 66%?',
    scenario: 'High RTT causing slow TCP handshake for international users',
    options: [
      'Deploy edge nodes in Asia and use TCP Fast Open (TFO) to send data during handshake, reducing 3 RTT to 1 RTT',
      'Increase TCP window size',
      'Use UDP instead of TCP',
      'Compress the handshake packets'
    ],
    correctAnswer: 0,
    explanation: 'Standard TCP handshake requires 3 RTT (SYN → SYN-ACK → ACK → DATA). With 0.5s RTT per direction, that\'s 1.5s total. TCP Fast Open (TFO) allows client to send data in initial SYN packet using a cookie from previous connection, reducing to 1 RTT (0.5s). Also deploy edge nodes closer to users (reduces base RTT). Modern solution: QUIC reduces connection to 0 RTT for repeat visits. For initial visits, anycast + TFO provides fastest connection.',
    difficulty: 'expert',
    tags: ['tcp', 'handshake', 'optimization', 'tfo', 'latency'],
    codeExample: `# Enable TCP Fast Open (Linux)
sysctl -w net.ipv4.tcp_fastopen=3
# 3 = enable for both client and server`,
    references: ['https://datatracker.ietf.org/doc/html/rfc7413']
  },
  {
    id: 'p0-l2-q3',
    lessonId: 2,
    phase: 0,
    question: 'During a security review, you discover your application sends sensitive auth tokens in the SYN packet using TCP Fast Open. What critical security vulnerability does this introduce?',
    options: [
      'TFO SYN packets can be captured and replayed without completing handshake, allowing token theft; sensitive data should only be sent after TLS handshake',
      'SYN packets are not encrypted, but this is normal for TCP',
      'TFO is perfectly secure for all data types',
      'The vulnerability is only theoretical with no real-world risk'
    ],
    correctAnswer: 0,
    explanation: 'Critical vulnerability: TFO SYN packets are sent before the TCP handshake completes, so they can be captured and replayed by an attacker who never completes the connection. Auth tokens in TFO SYN could be stolen and reused. Security rule: NEVER send sensitive data in TFO packets. Send only idempotent, non-sensitive requests (e.g., "GET /index.html"). Sensitive data must be sent after both TCP AND TLS handshakes complete. Modern apps use TFO for static assets only.',
    difficulty: 'expert',
    tags: ['tcp', 'tfo', 'security', 'vulnerability'],
    references: []
  },
  {
    id: 'p0-l2-q4',
    lessonId: 2,
    phase: 0,
    question: 'Your monitoring shows TCP retransmissions spiking to 15% during evening peak hours (bandwidth usage: 60% of capacity). After upgrading to 10Gbps links, retransmissions remain at 15%. What\'s the root cause?',
    scenario: 'High TCP retransmission rate despite low bandwidth utilization',
    options: [
      'Application-layer issue - slow server processing causes TCP receive window to fill up, triggering flow control and retransmissions',
      'Network congestion - need even more bandwidth',
      'TCP window size too small',
      'Faulty network cables causing packet corruption'
    ],
    correctAnswer: 0,
    explanation: 'If retransmissions persist after bandwidth upgrade, the bottleneck is not the network - it\'s the application. Slow database queries, blocking I/O, or CPU exhaustion prevent the server from reading TCP receive buffer fast enough. When receive window fills, TCP stops accepting data and packets are retransmitted. Solution: optimize application performance (faster queries, async I/O, more workers), not bandwidth. Use `netstat -s` to check receive buffer overflows.',
    difficulty: 'hard',
    tags: ['tcp', 'retransmission', 'performance', 'debugging'],
    codeExample: `# Check for receive buffer issues
netstat -s | grep -i "receive buffer errors"`,
    references: []
  },
  {
    id: 'p0-l2-q5',
    lessonId: 2,
    phase: 0,
    question: 'A client reports that file uploads (POST requests) over mobile networks frequently fail at 90% completion. Downloads (GET) work perfectly. TCP dumps show RST packets from the server after 60 seconds. What\'s the issue?',
    scenario: 'Upload failures on mobile with RST after timeout',
    options: [
      'Server-side timeout is too short for slow mobile uplinks; increase timeout and implement chunked upload with resume capability',
      'Mobile networks block POST requests for security',
      'TCP ACK packets are being lost',
      'Client TCP window size is misconfigured'
    ],
    correctAnswer: 0,
    explanation: 'Mobile uplink speeds (1-5 Mbps) are much slower than downlink (10-50 Mbps). Large POST uploads take longer than the server\'s 60s timeout. Server sends RST (reset) to terminate the connection. Solutions: 1) Increase server timeouts for upload endpoints, 2) Implement chunked upload (split into 1MB pieces), 3) Use resumable upload protocols (client can retry from last successful chunk). Modern approach: tus.io protocol for resumable uploads, or multipart upload with S3/R2.',
    difficulty: 'medium',
    tags: ['tcp', 'mobile', 'upload', 'timeout'],
    references: []
  },
  {
    id: 'p0-l2-q6',
    lessonId: 2,
    phase: 0,
    question: 'You implement TCP keepalive with 30-second probes to detect dead connections. Load balancer logs show connections staying open for hours despite no traffic. Why is keepalive failing to close idle connections?',
    options: [
      'TCP keepalive only detects network failure, not idle connections; implement application-layer heartbeat with actual data exchange',
      'Keepalive interval is too long; reduce to 5 seconds',
      'Keepalive is disabled on the client side',
      'TCP keepalive is fundamentally broken and should not be used'
    ],
    correctAnswer: 0,
    explanation: 'Common misconception: TCP keepalive does NOT detect idle connections - it detects dead connections (network failure, crashed client). Keepalive sends empty ACK packets that the OS automatically responds to without involving the application. For idle detection, implement application-layer heartbeat (e.g., WebSocket ping/pong, or periodic API status check). Set idle timeout (e.g., 5 minutes no data → close connection). TCP keepalive is useful for detecting hard failures like powered-off devices.',
    difficulty: 'hard',
    tags: ['tcp', 'keepalive', 'connection-management'],
    codeExample: `// Application-layer WebSocket heartbeat
const ws = new WebSocket('wss://api.example.com');
setInterval(() => ws.ping(), 30000); // Send ping every 30s
ws.on('pong', () => lastPong = Date.now());`,
    references: []
  },
  {
    id: 'p0-l2-q7',
    lessonId: 2,
    phase: 0,
    question: 'Your CDN implements connection pooling, maintaining 1000 persistent TCP connections to origin servers. After a network partition heals, applications report intermittent "connection refused" errors. What TCP state is causing this?',
    scenario: 'Connection pooling issues after network partition recovery',
    options: [
      'TIME_WAIT state - old connections are in 2MSL wait (4 minutes), exhausting ephemeral port range; implement SO_REUSEADDR and connection health checks',
      'SYN_SENT state - handshakes are failing',
      'ESTABLISHED state - connections are working fine',
      'CLOSE_WAIT state - application bug'
    ],
    correctAnswer: 0,
    explanation: 'After network partition, existing connections become invalid but CDN doesn\'t know yet. When connections close, they enter TIME_WAIT state (2 * MSL = 4 minutes by default) to prevent old packets from interfering with new connections. With 1000 connections cycling rapidly, ephemeral ports (typically 28,000 available) get exhausted. Solutions: 1) Enable SO_REUSEADDR to reuse ports immediately, 2) Increase ephemeral port range, 3) Implement connection health checks (send test query), 4) Reduce TIME_WAIT timeout.',
    difficulty: 'expert',
    tags: ['tcp', 'time-wait', 'connection-pooling', 'debugging'],
    codeExample: `# Increase ephemeral port range (Linux)
sysctl -w net.ipv4.ip_local_port_range="1024 65535"
# Enable port reuse
sysctl -w net.ipv4.tcp_tw_reuse=1`,
    references: []
  },
  {
    id: 'p0-l2-q8',
    lessonId: 2,
    phase: 0,
    question: 'An attacker sends TCP packets with the URG (urgent) pointer set, causing your application to crash. What is this attack, and how does it exploit the TCP specification?',
    options: [
      'TCP urgent pointer vulnerability - URG pointer can point outside packet boundary, causing buffer overflow; mitigate with firewall rules to drop URG packets and update vulnerable software',
      'SYN flood - just enable SYN cookies',
      'Normal TCP traffic - no attack occurring',
      'Application bug only - no TCP involvement'
    ],
    correctAnswer: 0,
    explanation: 'Historic vulnerability: TCP URG (urgent) pointer indicates "urgent" data that should be processed immediately. Some implementations had buffer overflow bugs when URG pointer exceeded packet size. Attacker could achieve remote code execution. Modern mitigation: 1) Firewalls drop packets with URG flag (rarely used legitimately), 2) OS TCP stacks fixed the bug, 3) Application shouldn\'t process urgent data differently. This attack (CVE-2004-0230) affected Windows, Linux, and BSD in 2004.',
    difficulty: 'hard',
    tags: ['tcp', 'vulnerability', 'security', 'urgent-pointer'],
    references: []
  },
  {
    id: 'p0-l2-q9',
    lessonId: 2,
    phase: 0,
    question: 'Your microservices architecture makes 50 HTTP requests per user session. Average session latency is 10 seconds (50 * 0.2s per request). How can HTTP/2 and TCP connection reuse improve this?',
    scenario: 'Many HTTP requests per user causing high latency',
    options: [
      'HTTP/2 multiplexing reuses single TCP connection for all 50 requests, eliminating 49 handshakes; reduce latency from 10s to ~1.5s (1 handshake + 50 parallel requests)',
      'HTTP/2 has no impact on latency',
      'Need to use UDP instead of TCP',
      'Increase bandwidth allocation'
    ],
    correctAnswer: 0,
    explanation: 'HTTP/1.1 requires new TCP connection (or waits for existing) per request. 50 requests = 50 handshakes (if sequential) = ~3s just for handshakes (assuming 60ms RTT). HTTP/2 multiplexing: 1 TCP connection carries all 50 requests simultaneously using streams. Latency: 3 RTT for first request (TCP + TLS) + max latency of slowest request. Result: 10s → 1.5s (85% reduction). Also saves server resources (fewer connections). Modern approach: HTTP/3 (QUIC) eliminates head-of-line blocking entirely.',
    difficulty: 'hard',
    tags: ['tcp', 'http2', 'multiplexing', 'optimization'],
    references: []
  },
  {
    id: 'p0-l2-q10',
    lessonId: 2,
    phase: 0,
    question: 'During a DDoS attack, your firewall blocks 1 million SYN packets per second based on source IP reputation. Attack continues unabated. Packet analysis reveals source IPs are legitimate user devices. What attack is occurring?',
    scenario: 'DDoS with legitimate source IPs bypassing reputation-based blocking',
    options: [
      'TCP reflection attack - attacker spoofs victim IPs as source, causing firewall to block legitimate users; implement SYN cookies and challenge-response instead of IP blocking',
      'Standard SYN flood - just increase blocking rate',
      'Application-layer DDoS - WAF rules needed',
      'No attack - just heavy traffic'
    ],
    correctAnswer: 0,
    explanation: 'Sophisticated attack: attacker sends SYN packets with spoofed source IPs of real users. Your firewall sees "attack from user IPs" and blocks them, causing self-inflicted DoS. Blocking IPs is counterproductive. Better defense: 1) SYN cookies (don\'t block, just defer state), 2) JavaScript challenge (humans pass, bots fail), 3) Proof-of-work challenge, 4) Anycast to absorb traffic. Never trust source IP alone during attacks - verify with challenge-response.',
    difficulty: 'expert',
    tags: ['tcp', 'ddos', 'reflection', 'spoofing'],
    references: []
  },
  {
    id: 'p0-l2-q11',
    lessonId: 2,
    phase: 0,
    question: 'A financial trading application requires exactly-once message delivery over TCP. The developer assumes TCP guarantees this. Why is this assumption dangerous?',
    options: [
      'TCP only guarantees at-least-once (retransmits lost packets); network failures can cause duplicate delivery; implement application-layer idempotency with sequence numbers',
      'TCP provides exactly-once delivery automatically',
      'UDP would be better for exactly-once',
      'This is not a problem in practice'
    ],
    correctAnswer: 0,
    explanation: 'Critical misconception: TCP guarantees reliable, ordered delivery BUT not exactly-once semantics. Example: client sends transaction, server receives and processes it, but ACK is lost. Client times out and retransmits - server processes transaction TWICE. For exactly-once, implement application-layer deduplication: assign unique IDs to transactions, track processed IDs server-side, and ignore duplicates. Financial systems use idempotency keys. This is why banking APIs require idempotency-key headers.',
    difficulty: 'expert',
    tags: ['tcp', 'reliability', 'exactly-once', 'idempotency'],
    references: []
  },
  {
    id: 'p0-l2-q12',
    lessonId: 2,
    phase: 0,
    question: 'Your CDN cache servers show 50% connection establishment failures to origin during peak hours. Both servers are healthy with low CPU. Network ping shows 0% packet loss. What TCP parameter is likely misconfigured?',
    scenario: 'High connection failure rate despite healthy servers and network',
    options: [
      'TCP SYN backlog queue is full - increase net.core.somaxconn and application listen() backlog to handle burst of new connections',
      'TCP window size is too small',
      'Bandwidth is insufficient',
      'DNS resolution is failing'
    ],
    correctAnswer: 0,
    explanation: 'When connection rate exceeds SYN backlog queue size, kernel drops new SYN packets and they appear as connection failures. This happens even with low CPU/bandwidth. Default backlog (128) is too small for high-traffic servers. Solution: increase kernel parameter net.core.somaxconn (e.g., 4096) AND application listen() backlog parameter. Modern web servers like Nginx need both configured. Symptoms: connection failures during bursts, but works fine at steady state. Monitor: `netstat -s | grep "listen queue"`.',
    difficulty: 'hard',
    tags: ['tcp', 'backlog', 'connection', 'tuning'],
    codeExample: `# Increase SYN backlog (Linux)
sysctl -w net.core.somaxconn=4096
sysctl -w net.ipv4.tcp_max_syn_backlog=4096
# Nginx config
listen 443 ssl http2 backlog=4096;`,
    references: []
  },
  {
    id: 'p0-l2-q13',
    lessonId: 2,
    phase: 0,
    question: 'An IoT device behind NAT sends heartbeat to your server every 60 seconds. After 5 minutes, the connection appears dead and server cannot send push notifications. What is the issue?',
    scenario: 'IoT devices behind NAT losing connectivity',
    options: [
      'NAT timeout (typically 2-4 minutes) closes connection; reduce heartbeat to 30 seconds or use TCP keepalive with 60s interval',
      'Server firewall is blocking IoT traffic',
      'IoT device hardware is malfunctioning',
      'TCP window size is incompatible'
    ],
    correctAnswer: 0,
    explanation: 'NAT routers maintain connection state table with timeout (typically 2-5 minutes). If no traffic flows, NAT entry expires and connection is closed - but neither endpoint knows. When server tries to send data, it fails. Solutions: 1) Send keepalive data before NAT timeout (heartbeat every 30-60s), 2) Enable TCP keepalive (OS-level), 3) Use application-layer heartbeat. IoT/mobile apps must account for NAT timeout - it\'s a reality of internet architecture. Modern solution: server sends heartbeat to client if needed.',
    difficulty: 'medium',
    tags: ['tcp', 'nat', 'iot', 'keepalive'],
    references: []
  },
  {
    id: 'p0-l2-q14',
    lessonId: 2,
    phase: 0,
    question: 'You discover an attacker can determine which ports are open on your server by analyzing TCP response times, even though your firewall drops packets to closed ports silently. How is this side-channel attack possible?',
    options: [
      'Timing attack - open ports respond with RST (~1ms), closed/filtered ports timeout (~3s); attacker measures response time to identify open ports despite firewall',
      'Firewall is misconfigured and leaking information',
      'This attack is impossible if firewall drops packets',
      'Attacker has compromised the server'
    ],
    correctAnswer: 0,
    explanation: 'Sophisticated timing-based port scan: When firewall drops packets (closed port), no response is sent and attacker times out after 3 seconds. When port is open but application rejects connection, TCP stack sends RST immediately (~1ms). By measuring response time, attacker distinguishes open vs closed ports even with packet-dropping firewall. Mitigation: rate limit RST responses, implement connection throttling, or use stateful firewall to send RST for closed ports (makes timing uniform).',
    difficulty: 'expert',
    tags: ['tcp', 'timing-attack', 'port-scan', 'security'],
    references: []
  },
  {
    id: 'p0-l2-q15',
    lessonId: 2,
    phase: 0,
    question: 'Your distributed database uses TCP connections between nodes. During a network partition, both sides believe the other is dead and elect new leaders. When partition heals, data conflicts occur. How should TCP be used to prevent split-brain?',
    scenario: 'Preventing split-brain scenarios in distributed systems over TCP',
    options: [
      'TCP alone cannot prevent split-brain; implement Raft/Paxos consensus with quorum requirements and fencing tokens at application layer',
      'Use longer TCP keepalive intervals',
      'Enable TCP Fast Open for faster reconnection',
      'Switch to UDP for better partition detection'
    ],
    correctAnswer: 0,
    explanation: 'Fundamental distributed systems problem: TCP cannot distinguish between "slow network" and "network partition". Both sides timeout and elect new leaders (split-brain). TCP is transport-layer and unaware of distributed consensus requirements. Solution requires application-layer consensus: Raft/Paxos algorithms use quorum voting (majority must agree), fencing tokens (prevent old leader from writing), and generation numbers. TCP only provides reliable messaging - business logic must handle partitions. Modern datastores (etcd, Consul) use Raft over TCP.',
    difficulty: 'expert',
    tags: ['tcp', 'distributed-systems', 'split-brain', 'consensus'],
    references: []
  },

  // ========================================
  // PHASE 0, LESSON 3: TCP vs UDP Comparison
  // ========================================
  {
    id: 'p0-l3-q1',
    lessonId: 3,
    phase: 0,
    question: 'Your video conferencing app uses TCP for video streaming. Users report stuttering and freezing during poor network conditions, but audio (UDP) works fine. Your colleague suggests "just increase TCP buffer size." Why would this make the problem worse?',
    scenario: 'TCP head-of-line blocking causing video quality issues',
    options: [
      'TCP head-of-line blocking - increasing buffer delays video MORE; switch to UDP/RTP with forward error correction to handle packet loss gracefully',
      'Buffer size increase will solve the problem',
      'Bandwidth is insufficient, not TCP',
      'Video codec is inefficient'
    ],
    correctAnswer: 0,
    explanation: 'TCP head-of-line blocking: when packet N is lost, TCP holds packets N+1, N+2... until N is retransmitted. For video, this causes buffering (freeze). Larger TCP buffer = longer freeze. UDP allows packet loss - video can skip lost frame and continue (minor glitch vs freeze). Real-time media requires: UDP/RTP for transport, FEC (forward error correction) for minor loss, and adaptive bitrate. WebRTC uses UDP/SRTP. TCP\'s reliability guarantee is actually harmful for real-time applications.',
    difficulty: 'hard',
    tags: ['tcp', 'udp', 'video', 'real-time', 'head-of-line-blocking'],
    codeExample: `// WebRTC uses UDP with error recovery
const pc = new RTCPeerConnection({
  iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
});
// UDP transport, application handles packet loss`,
    references: ['https://www.cloudflare.com/learning/video/what-is-webrtc/']
  },
  {
    id: 'p0-l3-q2',
    lessonId: 3,
    phase: 0,
    question: 'A gaming company asks you to recommend TCP or UDP for their new MMORPG. The game sends: player position (20Hz), chat messages, inventory transactions, and world events. What is the optimal protocol strategy?',
    scenario: 'Mixed-criticality data in online gaming',
    options: [
      'Hybrid approach - UDP for player position (loss acceptable), TCP for chat/transactions (reliability critical); prioritize position over TCP to prevent lag',
      'UDP for everything - games must use UDP',
      'TCP for everything - reliability is always needed',
      'HTTP/2 can handle all gaming needs'
    ],
    correctAnswer: 0,
    explanation: 'Different data has different requirements: Player position (UDP) - send at 20Hz, loss acceptable because next update arrives in 50ms. Stale data is worse than no data. Chat/transactions (TCP) - must be reliable and ordered. Missing inventory item is critical. Hybrid protocol: UDP for time-sensitive state (position, health), TCP for critical events. Prioritize UDP packets over TCP to prevent TCP acknowledgments from delaying position updates. Modern games use custom protocols over UDP (e.g., Valve\'s Steam Sockets).',
    difficulty: 'expert',
    tags: ['tcp', 'udp', 'gaming', 'protocol-design'],
    references: []
  },
  {
    id: 'p0-l3-q3',
    lessonId: 3,
    phase: 0,
    question: 'Your DNS resolver uses UDP for queries (per standard). An attacker sends a 4MB response to your DNS query, fragmenting into 3000 IP packets. What attack is this, and why does UDP enable it?',
    scenario: 'DNS amplification attack exploiting UDP connectionless nature',
    options: [
      'DNS amplification attack - UDP has no handshake, attacker spoofs your IP as source; you receive massive response from legitimate DNS server; use TCP for large queries and implement rate limiting',
      'Normal DNS behavior - 4MB responses are standard',
      'TCP would have the same vulnerability',
      'Attack is not possible with DNSSEC'
    ],
    correctAnswer: 0,
    explanation: 'UDP amplification attack: no handshake means attacker can spoof source IP. Attacker sends small DNS query (60 bytes) with victim\'s IP to open resolver, requesting large TXT record. Legitimate DNS server sends 4MB response to victim (amplification factor 68,000x). Mitigation: 1) DNS servers limit UDP response to 512 bytes (force TCP for large), 2) Rate limit requests per source IP, 3) Block open resolvers from internet. Modern DNS uses TCP for AXFR/large responses and UDP for small queries. DNSSEC adds authenticity but not amplification protection.',
    difficulty: 'hard',
    tags: ['udp', 'dns', 'amplification', 'spoofing', 'ddos'],
    references: ['https://www.cloudflare.com/learning/ddos/dns-amplification-ddos-attack/']
  },
  {
    id: 'p0-l3-q4',
    lessonId: 3,
    phase: 0,
    question: 'Your IoT sensors send telemetry every 10 seconds: temperature (4 bytes), humidity (4 bytes), battery (4 bytes). Current implementation uses HTTP/1.1 (TCP). Calculate overhead and recommend TCP or UDP.',
    scenario: 'Protocol efficiency for small IoT telemetry packets',
    options: [
      'UDP - payload 12 bytes, UDP/IP header 28 bytes (70% overhead); TCP would add 40-byte header + TLS 29+ bytes = 81+ bytes (87% overhead); use CoAP over UDP for efficient IoT',
      'TCP with TLS is more efficient',
      'HTTP/3 over TCP would be optimal',
      'Overhead doesn\'t matter, use TCP for reliability'
    ],
    correctAnswer: 0,
    explanation: 'Overhead analysis for 12-byte payload: TCP: 20 (TCP) + 20 (IP) + 29+ (TLS) + HTTP headers = 80+ bytes overhead (87%). UDP: 8 (UDP) + 20 (IP) = 28 bytes (70%). For IoT with small, frequent messages, UDP is dramatically more efficient. Use CoAP (Constrained Application Protocol) - UDP-based HTTP alternative designed for IoT. Handles reliability at application layer when needed. Also consider: MQTT over TCP for guaranteed delivery, but with higher overhead. For sensors, loss of one reading is acceptable, making UDP ideal.',
    difficulty: 'hard',
    tags: ['tcp', 'udp', 'iot', 'overhead', 'coap'],
    references: []
  },
  {
    id: 'p0-l3-q5',
    lessonId: 3,
    phase: 0,
    question: 'A VPN service advertises "zero-latency overhead" by using UDP instead of TCP. Your client complains that TCP traffic (SSH, HTTPS) through the VPN is slower than direct TCP connections. Why?',
    scenario: 'TCP-over-UDP performance issues in VPN tunnel',
    options: [
      'TCP-over-TCP meltdown (in this case TCP-over-UDP with reliability) - VPN UDP reliability layer conflicts with inner TCP congestion control, causing exponential retransmissions; VPN should use unreliable UDP encapsulation',
      'UDP is always faster than TCP',
      'VPN server is overloaded',
      'Client firewall is interfering'
    ],
    correctAnswer: 0,
    explanation: 'TCP-over-TCP meltdown occurs when reliability is layered twice. Here, VPN adds its own reliability to UDP (trying to be helpful), creating same issue. When inner TCP detects packet loss, it slows down (congestion control). VPN layer also detects loss and retransmits. Both layers back off simultaneously, causing exponential slowdown. Solution: VPN should use unreliable UDP encapsulation and let inner TCP handle reliability. This is why WireGuard (modern VPN) uses simple UDP encapsulation without reliability layer - TCP handles its own reliability.',
    difficulty: 'expert',
    tags: ['tcp', 'udp', 'vpn', 'tunneling', 'performance'],
    references: []
  },
  {
    id: 'p0-l3-q6',
    lessonId: 3,
    phase: 0,
    question: 'Your CDN implements QUIC (UDP-based) as an alternative to TCP for HTTP/3. During testing, 15% of users cannot establish QUIC connections despite modern browsers. What is the likely cause?',
    options: [
      'Corporate firewalls and ISPs block UDP port 443 for security reasons; implement TCP fallback and consider using UDP ports 80/443 with connection migration',
      'QUIC is not yet standardized',
      'Client browsers are outdated',
      'CDN misconfiguration'
    ],
    correctAnswer: 0,
    explanation: 'Common QUIC deployment issue: many enterprise firewalls only allow TCP 80/443 and block all UDP (legacy security policy from when UDP was primarily DNS/gaming). 10-15% UDP blocking rate is typical. Solutions: 1) Always provide TCP fallback (HTTP/2), 2) Use Happy Eyeballs algorithm (race QUIC vs TCP, use whichever connects first), 3) Use UDP port 443 (more likely to be allowed than random ports). Modern networks are improving UDP support as QUIC adoption grows.',
    difficulty: 'medium',
    tags: ['udp', 'quic', 'firewall', 'http3'],
    references: ['https://www.cloudflare.com/learning/performance/what-is-quic/']
  },
  {
    id: 'p0-l3-q7',
    lessonId: 3,
    phase: 0,
    question: 'A stock trading platform requires multicast to send price updates to 10,000 traders simultaneously. Marketing wants TCP for "guaranteed delivery." Why is this technically impossible?',
    options: [
      'TCP is inherently point-to-point (unicast) and cannot multicast; use UDP multicast with application-layer reliability (NACK-based recovery or FEC)',
      'TCP can support multicast with proper configuration',
      'Multicast is not possible at all',
      'Use HTTP/2 server push instead'
    ],
    correctAnswer: 0,
    explanation: 'TCP is fundamentally connection-oriented between two endpoints (unicast). Multicast requires sending one packet that reaches many recipients simultaneously - incompatible with TCP\'s ACK/retransmission model (would need ACKs from all 10,000 recipients). Solution: UDP multicast with application-layer reliability: NACK (recipients request retransmit of missing packets) or FEC (forward error correction - extra parity packets allow recovery). Financial markets use UDP multicast with PGM (Pragmatic General Multicast) for reliable multicast. HTTP/2 push is still unicast (10,000 separate connections).',
    difficulty: 'expert',
    tags: ['tcp', 'udp', 'multicast', 'trading', 'pgm'],
    references: []
  },
  {
    id: 'p0-l3-q8',
    lessonId: 3,
    phase: 0,
    question: 'Your network monitor shows UDP packets with identical payload being sent 3 times (spaced 50ms apart). Is this redundancy a bug or valid technique? What is the trade-off?',
    scenario: 'Redundant UDP transmission pattern analysis',
    options: [
      'Valid technique called "redundant coding" or "packet duplication" - ensures delivery without retransmission delay; trades bandwidth (3x overhead) for latency (no RTT wait); used in ultra-low latency applications',
      'Network bug - investigate packet duplication',
      'DDoS attack using reflected traffic',
      'Misconfigured load balancer'
    ],
    correctAnswer: 0,
    explanation: 'Intentional UDP redundancy technique for ultra-low latency: send same data 3 times (50ms apart). If any copy arrives, success! No retransmission needed. Trade-off: 3x bandwidth for ~1 RTT latency savings. Used in: high-frequency trading (microseconds matter), VoIP (better than retransmit delay), industrial control systems (time-critical). Modern alternative: FEC (Forward Error Correction) - send 1.2x data with parity bits, recover from 20% loss without retransmit. More bandwidth-efficient than duplication.',
    difficulty: 'hard',
    tags: ['udp', 'redundancy', 'latency', 'hft'],
    references: []
  },
  {
    id: 'p0-l3-q9',
    lessonId: 3,
    phase: 0,
    question: 'During a DDoS attack, your firewall rate-limits UDP to 10,000 pps. Legitimate DNS queries (UDP) start failing. When you remove the rate limit, attack overwhelms the server. What is the proper UDP DDoS mitigation strategy?',
    scenario: 'UDP DDoS protection without impacting legitimate traffic',
    options: [
      'Implement stateful UDP tracking with challenge-response for new sources, whitelist known-good IPs, use anycast to distribute attack, and deploy rate limiting per source IP rather than global',
      'Block all UDP traffic during attacks',
      'Increase rate limit to very high value',
      'Switch all services to TCP'
    ],
    correctAnswer: 0,
    explanation: 'UDP DDoS requires sophisticated mitigation: 1) Stateful tracking - track UDP "flows" (source IP/port → dest IP/port), 2) Challenge-response for new sources (send cookie, require response), 3) Per-source-IP rate limiting (not global), 4) Anycast distribution (spread attack across data centers), 5) Whitelist known clients (API keys), 6) UDP proxy at edge (validate before forwarding to origin). Global rate limiting hurts legitimate traffic. Modern CDNs implement UDP intelligence at edge. DNS-specific: use TCP for large responses.',
    difficulty: 'expert',
    tags: ['udp', 'ddos', 'rate-limiting', 'mitigation'],
    references: []
  },
  {
    id: 'p0-l3-q10',
    lessonId: 3,
    phase: 0,
    question: 'You implement a file transfer protocol using UDP for speed. Your code sends 1000 packets, receiving acknowledgment after the last packet. Users report random corruption in files. Why is this design flawed?',
    options: [
      'UDP provides no ordering guarantees - packets can arrive out-of-order; implement sequence numbers and reorder buffer, or acknowledge each packet individually for reliability',
      'UDP packets are corrupted by design',
      'Packet loss is the issue, not ordering',
      'File system is causing corruption'
    ],
    correctAnswer: 0,
    explanation: 'Critical UDP property: packets can arrive out-of-order. Network routes change, causing packet 100 to arrive before packet 99. Without sequence numbers and reordering, file is corrupt. Proper UDP file transfer: 1) Add sequence number to each packet, 2) Receiver buffers and reorders, 3) Acknowledge individual packets (or ranges), 4) Sender retransmits missing packets. This is what TFTP (Trivial FTP), QUIC, and custom UDP protocols do. Alternatively, send checksum/hash of entire file and receiver validates. Never assume UDP packet order!',
    difficulty: 'medium',
    tags: ['udp', 'ordering', 'reliability', 'file-transfer'],
    references: []
  },
  {
    id: 'p0-l3-q11',
    lessonId: 3,
    phase: 0,
    question: 'A hospital\'s medical device sends patient vitals (heart rate, blood pressure) every second via UDP. Network administrator wants to switch to TCP for "reliability." As the security architect, what are the risks of this change?',
    scenario: 'Protocol selection for real-time medical telemetry',
    options: [
      'TCP can cause dangerous delays - if packets are lost, TCP blocks ALL data until retransmit succeeds; outdated vitals are sent late; UDP with loss tolerance and alerting on high loss rate is safer for real-time medical data',
      'TCP is always better for medical data',
      'UDP should never be used in medical applications',
      'Both protocols are equally suitable'
    ],
    correctAnswer: 0,
    explanation: 'Real-time medical telemetry critical decision: UDP with packet loss is safer than TCP with delays. Example: heart rate drops (emergency). If TCP retransmits lost packet from 5 seconds ago, current critical data is blocked. With UDP, you receive data from 1 second ago (slightly stale but actionable). Better approach: UDP with application-layer monitoring - if loss rate >5%, trigger alert. Add redundancy: send critical alerts on separate reliable channel. Medical devices often use UDP for continuous telemetry, TCP for configuration/alarms.',
    difficulty: 'expert',
    tags: ['udp', 'tcp', 'medical', 'real-time', 'safety'],
    references: []
  },
  {
    id: 'p0-l3-q12',
    lessonId: 3,
    phase: 0,
    question: 'Your company implements UDP hole-punching to allow P2P connections between clients behind NAT. 30% of connection attempts fail. Network logs show UDP packets in both directions. What is failing?',
    scenario: 'UDP hole-punching failure despite bidirectional traffic',
    options: [
      'Symmetric NAT - maps each destination to different external port, breaking hole-punching assumptions; implement TURN relay servers for P2P fallback when hole-punching fails',
      'Firewall is blocking all UDP',
      'Clients have incorrect IP addresses',
      'UDP hole-punching is fundamentally broken'
    ],
    correctAnswer: 0,
    explanation: 'UDP hole-punching fails with symmetric NAT. Hole-punching assumes: client A → server creates NAT mapping (external_port_X). Client B connects to A using external_port_X. Symmetric NAT creates DIFFERENT external port for each destination, so B\'s packets arrive at wrong port. Approximately 30% of residential NAT is symmetric. Solution: implement TURN (Traversal Using Relays around NAT) - relay server forwards traffic when P2P fails. WebRTC uses STUN (hole-punching attempt) with TURN fallback. Cost: TURN uses relay bandwidth.',
    difficulty: 'expert',
    tags: ['udp', 'nat', 'hole-punching', 'p2p', 'webrtc'],
    references: []
  },
  {
    id: 'p0-l3-q13',
    lessonId: 3,
    phase: 0,
    question: 'Your distributed database uses UDP for cluster communication to avoid TCP overhead. After network upgrade to 10Gbps, you observe 40% packet loss and database corruption. The old 1Gbps network had 0% loss. What happened?',
    scenario: 'UDP packet loss on high-speed network',
    options: [
      'UDP socket buffer overflow - high-speed network fills receive buffer faster than application processes; increase SO_RCVBUF size and optimize application processing speed',
      'Network equipment is faulty',
      'UDP is not suitable for high-speed networks',
      'Database code has bugs'
    ],
    correctAnswer: 0,
    explanation: 'High-speed UDP trap: 10Gbps means 1.25 million 1KB packets/second. If application processes UDP packets slower than network receives them, socket receive buffer overflows and kernel drops packets silently. This causes database corruption. Solutions: 1) Increase socket buffer (SO_RCVBUF to 32MB+), 2) Multiple receive threads, 3) Batch processing, 4) Use kernel bypass (DPDK) for extreme performance. Check drops: `netstat -su | grep "receive buffer errors"`. TCP has flow control preventing this, but UDP doesn\'t.',
    difficulty: 'hard',
    tags: ['udp', 'performance', 'buffer', 'high-speed'],
    codeExample: `// Increase UDP receive buffer
int sock = socket(AF_INET, SOCK_DGRAM, 0);
int bufsize = 33554432; // 32MB
setsockopt(sock, SOL_SOCKET, SO_RCVBUF, &bufsize, sizeof(bufsize));`,
    references: []
  },
  {
    id: 'p0-l3-q14',
    lessonId: 3,
    phase: 0,
    question: 'An online exam platform uses TCP for submissions. During exam deadline, thousands of students submit simultaneously. Many receive "connection timeout" despite low bandwidth usage and server CPU at 30%. What is the bottleneck?',
    scenario: 'Connection storm during deadline causing TCP issues',
    options: [
      'TCP SYN flood (unintentional) - thousands of handshakes overwhelm server connection rate limit; increase SYN backlog, enable SYN cookies, consider UDP-based submission for this use case',
      'Bandwidth is actually the bottleneck',
      'Database cannot handle the writes',
      'Student devices are too slow'
    ],
    correctAnswer: 0,
    explanation: 'Unintentional connection storm: legitimate students create TCP handshake flood. Even with SYN cookies, the sheer rate of new connections can exhaust resources. TCP handshake requires CPU and connection tracking. Alternative design for deadline scenarios: UDP-based submission with reliability (send + await confirmation), or pre-establish WebSocket connections. Also: implement submission queuing system (submit → queue → process asynchronously) rather than synchronous TCP request/response. Deadline-driven events require UDP-like "fire and confirm" rather than TCP connection-oriented approach.',
    difficulty: 'hard',
    tags: ['tcp', 'connection-storm', 'scale', 'deadline'],
    references: []
  },
  {
    id: 'p0-l3-q15',
    lessonId: 3,
    phase: 0,
    question: 'You are designing a network protocol for Mars rover communication (round-trip time: 40 minutes). Should you use TCP-like or UDP-like approach, and why?',
    scenario: 'Protocol design for extreme high-latency environment',
    options: [
      'UDP-like with application-layer error correction - TCP ACK-based retransmission would waste 40 minutes per lost packet; use forward error correction (FEC) to recover from loss without round trips',
      'TCP is always the correct choice for reliable communication',
      'Use HTTP/3 which solves high-latency problems',
      'Latency does not affect protocol choice'
    ],
    correctAnswer: 0,
    explanation: 'Extreme latency scenario: TCP retransmission wastes 40 minutes per lost packet (send → detect loss → request retransmit → receive). Completely impractical. Solution: UDP-style transmission with Forward Error Correction (FEC) - send extra parity data (e.g., 20% overhead) that allows receiver to reconstruct lost packets mathematically without retransmission. Also: bundle ACKs (acknowledge many packets at once), use large windows, and optimize for throughput over latency. Deep space communication uses similar techniques (NASA DTN protocol). FEC trades bandwidth for latency - perfect for high RTT.',
    difficulty: 'expert',
    tags: ['udp', 'tcp', 'latency', 'fec', 'space'],
    references: []
  }
]
