// MIT-Level Quiz Questions - Real-world scenarios and deep knowledge testing
// Each question tests practical application, not just memorization

export interface QuizQuestion {
  id: number
  lessonId: number
  question: string
  scenario?: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'medium' | 'hard' | 'expert'
  tags: string[]
}

export const comprehensiveQuizzes: QuizQuestion[] = [
  // Phase 0: Network Fundamentals - Lesson 1 (OSI Model)
  {
    id: 1,
    lessonId: 1,
    question: "A client reports that HTTPS connections to your web application are failing, but HTTP works fine. The server certificate is valid and properly configured. Network traces show the TLS handshake completes successfully, but the connection drops immediately after. At which OSI layer is the issue MOST likely occurring?",
    scenario: "You're debugging a production issue where users can access http://example.com but https://example.com fails. Wireshark shows successful TCP handshake and TLS negotiation, but no application data is exchanged.",
    options: [
      "Layer 4 (Transport) - TCP connection is unstable",
      "Layer 6 (Presentation) - TLS cipher suite mismatch after handshake",
      "Layer 7 (Application) - Web server not configured to handle HTTPS on port 443",
      "Layer 5 (Session) - Session establishment failing post-encryption"
    ],
    correctAnswer: 2,
    explanation: "Since the TLS handshake completes successfully (Layer 6 working), but no data is exchanged, the issue is at Layer 7. The most likely cause is that the web server application isn't properly listening or configured for HTTPS on port 443, even though the TLS layer works. This is a common misconfiguration where nginx/Apache handles TLS but the backend application server isn't properly configured.",
    difficulty: 'hard',
    tags: ['osi-model', 'tls', 'debugging', 'networking']
  },
  {
    id: 2,
    lessonId: 1,
    question: "Your CDN is experiencing intermittent connection issues. Analysis shows that 15% of requests fail with 'Connection Reset' errors. The pattern shows failures occur primarily during peak traffic (>10,000 req/s). Which layer and mechanism is MOST likely being exhausted?",
    scenario: "Peak traffic: 10,000+ req/s, 15% connection resets, random clients affected, no pattern based on geography or client type.",
    options: [
      "Layer 7 - HTTP connection pool exhaustion",
      "Layer 4 - TCP connection table full, SYN packets being dropped",
      "Layer 3 - IP routing table overflow",
      "Layer 4 - TCP window size too small for high bandwidth"
    ],
    correctAnswer: 1,
    explanation: "Connection resets during high traffic typically indicate Layer 4 TCP connection table exhaustion. When the server's connection table fills up (tracked by netstat), new SYN packets are dropped, causing connection resets. This is different from HTTP connection pool exhaustion (Layer 7) which would show as timeout errors, not resets. The solution involves tuning kernel parameters like net.core.somaxconn and net.ipv4.tcp_max_syn_backlog.",
    difficulty: 'expert',
    tags: ['osi-model', 'tcp', 'performance', 'scaling']
  },
  {
    id: 3,
    lessonId: 1,
    question: "A DDoS attack is targeting your application. Your network team reports blocking 1 million packets/second at the edge, but your application servers are still overloaded. Investigation shows legitimate traffic is only 100k req/s. What's the MOST likely attack vector based on OSI layer analysis?",
    options: [
      "Layer 3 (Network) - IP fragment floods bypassing edge filtering",
      "Layer 7 (Application) - Slowloris attack keeping connections open",
      "Layer 4 (Transport) - SYN flood exhausting connection tables",
      "Layer 7 (Application) - HTTP flood with valid requests hitting expensive endpoints"
    ],
    correctAnswer: 3,
    explanation: "If the edge is successfully blocking 1M packets/sec but servers are still overloaded with only 100k req/s legitimate traffic, the attack is likely Layer 7 HTTP floods targeting expensive endpoints (e.g., search queries, database operations). These pass through Layer 3/4 protection because they're valid HTTP requests. The solution requires Layer 7 WAF rules to rate-limit expensive operations, implement caching, or use challenge pages for suspicious patterns.",
    difficulty: 'expert',
    tags: ['ddos', 'osi-model', 'security', 'waf']
  },
  {
    id: 4,
    lessonId: 1,
    question: "You're implementing a new API gateway that needs to inspect and modify HTTP headers. At which OSI layer should your solution operate, and what's the trade-off?",
    scenario: "Requirements: Inspect Authorization headers, add custom headers (X-Request-ID), modify Cache-Control, maintain sub-10ms latency.",
    options: [
      "Layer 4 - Faster but can't inspect HTTP headers",
      "Layer 7 - Can inspect/modify headers but adds latency and requires SSL termination",
      "Layer 6 - Inspect after TLS decrypt but before HTTP parsing",
      "Layer 5 - Session layer proxying with header injection"
    ],
    correctAnswer: 1,
    explanation: "HTTP header inspection requires Layer 7 (Application) processing. You must terminate SSL/TLS to read headers, parse HTTP, modify headers, and re-encrypt. This adds latency (typically 5-50ms) compared to Layer 4 load balancing which just forwards TCP streams. The trade-off is functionality vs performance. Modern solutions like Cloudflare Workers or AWS ALB minimize this latency through edge computing, but it's still higher than Layer 4.",
    difficulty: 'hard',
    tags: ['osi-model', 'api-gateway', 'architecture', 'performance']
  },
  {
    id: 5,
    lessonId: 1,
    question: "Your security team wants to implement 'defense in depth' across OSI layers. Which combination provides the MOST comprehensive protection?",
    options: [
      "Layer 3: IP filtering, Layer 7: WAF - covers network and application",
      "Layer 3: IP filtering, Layer 4: SYN cookies, Layer 7: WAF and rate limiting",
      "Layer 4: TCP proxying, Layer 7: Input validation - covers transport and application",
      "Layer 7: WAF and authentication only - application layer is sufficient"
    ],
    correctAnswer: 1,
    explanation: "True defense in depth requires protection at multiple layers: Layer 3 (IP filtering/geo-blocking), Layer 4 (SYN cookies for TCP protection, connection rate limiting), and Layer 7 (WAF for application attacks, rate limiting for API abuse). Each layer catches different attack types: Layer 3 stops volumetric attacks, Layer 4 prevents connection exhaustion, Layer 7 blocks application exploits. Relying on a single layer leaves gaps that attackers can exploit.",
    difficulty: 'medium',
    tags: ['security', 'defense-in-depth', 'osi-model', 'best-practices']
  },

  // Phase 0: Network Fundamentals - Lesson 2 (TCP/IP)
  {
    id: 6,
    lessonId: 2,
    question: "You're experiencing mysterious connection timeouts after exactly 60 seconds for long-running API requests. TCP keep-alive is enabled. What's the MOST likely root cause?",
    scenario: "API endpoint takes 90 seconds to process. Clients report timeout after 60s. Server logs show request processing completes successfully. No firewall rules blocking port 443.",
    options: [
      "TCP keep-alive interval (60s) is triggering connection reset",
      "Load balancer idle timeout (60s) is terminating inactive connections",
      "Client socket timeout set to 60 seconds",
      "Server TCP FIN_WAIT timeout is 60 seconds"
    ],
    correctAnswer: 1,
    explanation: "This is a classic load balancer idle timeout issue. Most cloud load balancers (AWS ALB: 60s default, Azure LB: 4min default, Google Cloud LB: 600s) terminate connections with no data transfer after the idle timeout. TCP keep-alive doesn't help because the load balancer terminates at Layer 7 before keep-alive packets are sent. Solutions: 1) Increase LB idle timeout, 2) Send periodic data (heartbeat) during processing, 3) Use async patterns (webhook/polling) for long operations.",
    difficulty: 'expert',
    tags: ['tcp', 'load-balancer', 'debugging', 'timeouts']
  },
  {
    id: 7,
    lessonId: 2,
    question: "In a TCP connection, you observe the following sequence: SYN → SYN-ACK → ACK → [DATA] → FIN → FIN-ACK → ACK → RST. What security concern does the RST indicate?",
    options: [
      "Normal connection termination, no security concern",
      "Possible TCP hijacking attempt - unexpected RST after graceful close",
      "Firewall intervention blocking the connection",
      "Client forcefully closing due to timeout"
    ],
    correctAnswer: 1,
    explanation: "After a proper FIN/FIN-ACK/ACK sequence (graceful close), a RST packet is suspicious. This could indicate: 1) TCP hijacking attempt (attacker injecting RST), 2) Security appliance resetting connection after detecting malicious payload, or 3) Bug in network stack. In normal operation, RST should only appear for forceful closes or errors, not after graceful shutdown. This pattern warrants investigation for potential man-in-the-middle attacks or compromised network equipment.",
    difficulty: 'expert',
    tags: ['tcp', 'security', 'packet-analysis', 'attacks']
  },
  {
    id: 8,
    lessonId: 2,
    question: "Your application uses HTTP/2 over TCP. During a network congestion event, HTTP/2 performs WORSE than HTTP/1.1. Why?",
    scenario: "Network experiencing 5% packet loss. HTTP/1.1 clients loading pages in 3 seconds, HTTP/2 clients taking 8 seconds for same content.",
    options: [
      "HTTP/2 multiplexing causes head-of-line blocking at TCP layer during packet loss",
      "HTTP/2 header compression (HPACK) fails during network congestion",
      "HTTP/2 requires more round trips for connection establishment",
      "TCP congestion control penalizes HTTP/2 more than HTTP/1.1"
    ],
    correctAnswer: 0,
    explanation: "This is the famous HTTP/2 over TCP head-of-line blocking problem. HTTP/2 multiplexes multiple streams over a single TCP connection. When a packet is lost, TCP's in-order delivery blocks ALL streams (not just the affected one) until the lost packet is retransmitted. HTTP/1.1 with multiple parallel connections is less affected because packet loss only blocks one connection. This is why QUIC (HTTP/3) was created - it uses UDP and independent streams to avoid this issue. The problem is at the TCP layer, not HTTP/2 itself.",
    difficulty: 'expert',
    tags: ['tcp', 'http2', 'performance', 'networking']
  },
  {
    id: 9,
    lessonId: 2,
    question: "You need to defend against SYN flood attacks. Your server can handle 100K connections but receives 1M SYN packets/second during attacks. Which defense is MOST effective while maintaining legitimate user access?",
    options: [
      "Increase kernel parameter net.ipv4.tcp_max_syn_backlog to 1M",
      "Enable SYN cookies (net.ipv4.tcp_syncookies=1) to handle unlimited SYN requests",
      "Rate limit SYN packets to 100/second per source IP",
      "Deploy dedicated firewall to drop SYN packets from suspicious IPs"
    ],
    correctAnswer: 1,
    explanation: "SYN cookies is the correct answer. It's a clever technique that encodes connection state in the TCP sequence number, allowing the server to handle unlimited SYN requests without storing state. When the client sends ACK, the server reconstructs the connection from the sequence number. This is stateless and doesn't consume memory. Increasing tcp_max_syn_backlog just delays the problem. Rate limiting (option 3) might block legitimate users during attacks. Firewall rules (option 4) are easily bypassed with distributed attacks from many IPs. SYN cookies is the industry-standard defense.",
    difficulty: 'hard',
    tags: ['tcp', 'security', 'ddos', 'syn-flood']
  },
  {
    id: 10,
    lessonId: 2,
    question: "Analysis of your TCP connections shows: RTT=50ms, bandwidth=1Gbps, but throughput is only 100Mbps. Packet loss is 0%. What's limiting your throughput?",
    scenario: "Cross-country connection (California to New York), 50ms RTT, modern network, no packet loss, TCP window size=64KB.",
    options: [
      "Network congestion causing hidden packet loss",
      "TCP window size too small (BDP limitation) - increase to ~6MB",
      "Application layer processing bottleneck",
      "Router QoS policies throttling traffic"
    ],
    correctAnswer: 1,
    explanation: "This is a classic Bandwidth-Delay Product (BDP) problem. TCP throughput is limited by: Window Size / RTT. With 64KB window and 50ms RTT: (64KB * 8) / 0.05s = ~10Mbps theoretical max. To achieve 1Gbps with 50ms RTT, you need: (1Gbps * 0.05s) / 8 = ~6MB window. Modern kernels support TCP window scaling, but it must be enabled and tuned (net.ipv4.tcp_window_scaling=1, net.core.rmem_max/wmem_max). This is why long-distance high-bandwidth connections need careful TCP tuning.",
    difficulty: 'expert',
    tags: ['tcp', 'performance', 'bandwidth', 'tuning']
  },

  // Continue with more questions for other lessons...
  // Phase 1: Web Security - Lesson 11
  {
    id: 31,
    lessonId: 11,
    question: "Your JWT-based authentication system is compromised. An attacker can forge valid tokens despite using HS256 algorithm and a strong secret. Code review shows: jwt.verify(token, publicKey). What's the vulnerability?",
    scenario: "Using jsonwebtoken library, HS256 algorithm, 256-bit secret. Attacker submits token with 'alg': 'none' and it's accepted.",
    options: [
      "Secret key leaked through git repository",
      "Algorithm confusion - token using 'none' algorithm bypasses signature verification",
      "Timing attack on HMAC comparison allowing secret recovery",
      "JWT token not checking expiration (exp claim)"
    ],
    correctAnswer: 1,
    explanation: "This is the famous JWT algorithm confusion vulnerability (CVE-2015-9235). When jwt.verify() is called with a public key but the token specifies 'alg':'none', some libraries skip signature verification entirely. The fix: Always specify allowed algorithms explicitly: jwt.verify(token, secret, {algorithms: ['HS256']}). Never trust the 'alg' field from the token header alone. This vulnerability has affected major platforms and highlights why security libraries must be used correctly.",
    difficulty: 'expert',
    tags: ['jwt', 'authentication', 'security', 'vulnerabilities']
  },
  {
    id: 32,
    lessonId: 11,
    question: "You implement CORS to allow api.example.com to accept requests from app.example.com. Configuration: Access-Control-Allow-Origin: *. What critical security flaw exists?",
    options: [
      "Credentials (cookies) can't be sent with wildcard origin",
      "Any website can now read sensitive API responses, bypassing SOP",
      "Preflight requests will fail for complex requests",
      "CSP policies will block the wildcard origin"
    ],
    correctAnswer: 1,
    explanation: "Using Access-Control-Allow-Origin: * with an authenticated API is a critical vulnerability. While the wildcard prevents credentials from being sent, if your API also has endpoints that don't require authentication, ANY website can read those responses. Better: Use specific origins (Access-Control-Allow-Origin: https://app.example.com) and if multiple origins are needed, dynamically validate and echo the Origin header. Never use * for APIs handling sensitive data, even if endpoints require authentication, as it's easy to accidentally expose public endpoints.",
    difficulty: 'hard',
    tags: ['cors', 'security', 'api', 'web-security']
  },
  {
    id: 33,
    lessonId: 11,
    question: "Your SPA application stores JWT tokens in localStorage. A security audit flags this as XSS vulnerable. What's the recommended secure alternative and trade-off?",
    scenario: "React SPA, needs to send JWT with API requests, must handle token refresh, users complain about frequent re-login.",
    options: [
      "HttpOnly cookies + SameSite=Strict (protects XSS, but CSRF vulnerable without additional measures)",
      "sessionStorage instead of localStorage (same XSS risk, shorter lifetime)",
      "IndexedDB with encryption (still accessible via XSS)",
      "Store in Redux state only (lost on refresh, poor UX)"
    ],
    correctAnswer: 0,
    explanation: "HttpOnly cookies are the most secure option for JWTs. XSS can't access them via JavaScript (document.cookie). Combined with SameSite=Strict/Lax, you get CSRF protection. The trade-off: You need CSRF tokens for state-changing operations, and need to carefully configure CORS. Alternative approach: Use short-lived JWT in memory + refresh token in HttpOnly cookie. This pattern (used by Auth0, Okta) balances security and UX. The key insight: Nothing in browser storage (localStorage, sessionStorage, IndexedDB) is safe from XSS - only HttpOnly cookies provide protection.",
    difficulty: 'expert',
    tags: ['jwt', 'xss', 'security', 'authentication']
  },

  // Phase 2: CDN & Edge - Lesson 21  
  {
    id: 61,
    lessonId: 21,
    question: "Your CDN cache hit rate is 60%, but your origin servers are still overloaded during traffic spikes. Analysis shows 40% cache misses are caused by query parameters (?utm_source, ?fbclid). What's the optimal solution?",
    scenario: "E-commerce site, 1M requests/min, marketing adds UTM parameters, same content served regardless of UTM values.",
    options: [
      "Configure CDN to ignore all query parameters (risky - might break functionality)",
      "Custom cache key: ignore specific marketing parameters while keeping functional ones",
      "Increase TTL to reduce misses (doesn't address root cause)",
      "Implement query parameter sorting to normalize cache keys"
    ],
    correctAnswer: 1,
    explanation: "The optimal solution is custom cache key configuration to ignore marketing parameters (utm_*, fbclid, gclid) while keeping functional ones (product_id, page). This requires careful analysis of which parameters affect content. Cloudflare example: Cache Key Template: ignore query strings matching ^(utm_|fbclid|gclid). Ignoring ALL parameters can break search/filter functionality. Increasing TTL doesn't solve the cache fragmentation problem. Parameter sorting helps but doesn't eliminate unnecessary variations. This single change can increase hit rate from 60% to 90%+, dramatically reducing origin load.",
    difficulty: 'expert',
    tags: ['cdn', 'caching', 'performance', 'optimization']
  },
  {
    id: 62,
    lessonId: 21,
    question: "During a DDoS attack, your CDN is caching error pages (503 Service Unavailable) from your overwhelmed origin, making the outage worse. What's the correct CDN configuration to prevent this?",
    options: [
      "Never cache any 5xx responses",
      "Cache 5xx responses with very short TTL (10 seconds) to protect origin",
      "Use stale-while-revalidate to serve stale content during origin issues",
      "Implement custom error pages at CDN edge, don't fetch from origin"
    ],
    correctAnswer: 3,
    explanation: "The best solution is edge-generated error pages that never reach the origin. When origin is down, CDN should return cached content (if available) or a custom error page generated at the edge. Never caching 5xx can overload origin during recovery. Caching 5xx with short TTL still propagates errors. Stale-while-revalidate helps but origin still gets requests. Best practice: Configure CDN to serve stale content for extended periods (stale-if-error) during origin failures, and use edge functions to generate friendly error pages. This is how major platforms (GitHub, Stack Overflow) handle outages gracefully.",
    difficulty: 'expert',
    tags: ['cdn', 'reliability', 'ddos', 'error-handling']
  },

  // Add more questions for remaining lessons...
  // Total: 150+ questions across all lessons (10-15 per lesson)
]

// Export question count per lesson for tracking
export const questionsPerLesson: Record<number, number> = {
  1: 5,  // OSI Model - 5 questions shown above
  2: 5,  // TCP/IP - 5 questions shown above
  11: 3, // JWT/Auth - 3 questions shown above
  21: 2, // CDN - 2 questions shown above
  // ... continue for all lessons
}

export const getQuestionsForLesson = (lessonId: number): QuizQuestion[] => {
  return comprehensiveQuizzes.filter(q => q.lessonId === lessonId)
}

export const getTotalQuestions = (): number => {
  return comprehensiveQuizzes.length
}
