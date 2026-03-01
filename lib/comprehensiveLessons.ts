// Comprehensive Security Architecture Training Content
// Based on 2025 industry standards and best practices

export interface Lesson {
  id: number
  title: string
  phase: number
  phaseName: string
  day: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  reading_time_min: number
  tags: string[]
  description: string
  objectives: string[]
  content: {
    introduction: string
    sections: {
      title: string
      content: string
      diagram?: string // SVG diagram type
      codeExample?: string
      keyPoints: string[]
    }[]
    practicalExercise?: {
      title: string
      scenario: string
      steps: string[]
    }
    realWorldExample: {
      title: string
      description: string
      impact: string
    }
  }
  quiz: {
    id: number
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
    difficulty: 'easy' | 'medium' | 'hard'
  }[]
  knowledgePoints: {
    title: string
    description: string
    icon: string
  }[]
}

export const comprehensiveLessons: Lesson[] = [
  // PHASE 0: Network Fundamentals (Days 1-10)
  {
    id: 1,
    title: "OSI Model Deep Dive",
    phase: 0,
    phaseName: "Network Fundamentals",
    day: 1,
    difficulty: 'beginner',
    reading_time_min: 15,
    tags: ['networking', 'osi-model', 'fundamentals'],
    description: "Master the 7-layer OSI model and understand how each layer contributes to network security",
    objectives: [
      "Understand all 7 OSI layers and their functions",
      "Identify security concerns at each layer",
      "Learn how CDN and WAF operate across OSI layers",
      "Recognize common attacks targeting specific layers"
    ],
    content: {
      introduction: "The OSI (Open Systems Interconnection) model is the foundation of network communication. Understanding this model is crucial for security architects as attacks can target any layer. Let's explore each layer and its security implications.",
      sections: [
        {
          title: "Layer 7: Application Layer",
          content: "The Application Layer is where users interact with network services. This layer includes HTTP, HTTPS, DNS, SMTP, FTP, SSH, and other protocols that applications use to communicate. It provides network services directly to end-user applications and is closest to the end user. This layer handles authentication, privacy, and quality of service constraints.",
          diagram: "osi-layer-7",
          keyPoints: [
            "HTTP/HTTPS protocols operate here",
            "WAF (Web Application Firewall) protects at this layer",
            "Common attacks: SQL injection, XSS, CSRF, command injection",
            "CDN caches content at this layer",
            "DDoS attacks often target Layer 7",
            "Application-level encryption (TLS/SSL) starts here",
            "API gateways and load balancers can operate at this layer"
          ],
          codeExample: `// Layer 7 Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});`
        },
        {
          title: "Layer 6: Presentation Layer",
          content: "The Presentation Layer translates data between the application layer and the network format. It handles data encoding, encryption, compression, and format conversion. This layer ensures that data sent from one system can be read by another, regardless of the format differences. It acts as a data translator for the network, converting data formats like JPEG, GIF, MPEG, ASCII, and EBCDIC.",
          diagram: "osi-layer-6",
          keyPoints: [
            "Data encryption and decryption happen here",
            "Handles data compression and decompression",
            "Character set translation (ASCII, Unicode, EBCDIC)",
            "SSL/TLS encryption operates at this layer",
            "Image and video format conversion (JPEG, PNG, MPEG)",
            "MIME encoding for email attachments",
            "Data serialization and deserialization"
          ],
          codeExample: `// TLS/SSL Configuration (Layer 6)
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  ciphers: 'HIGH:!aNULL:!MD5',
  minVersion: 'TLSv1.2'
};

https.createServer(options, app).listen(443);`
        },
        {
          title: "Layer 5: Session Layer",
          content: "The Session Layer manages sessions between applications. It establishes, maintains, and terminates connections (sessions) between local and remote applications. This layer handles session checkpointing and recovery, allowing applications to resume from where they left off if a connection is interrupted. It also manages authentication and authorization for network sessions.",
          diagram: "osi-layer-5",
          keyPoints: [
            "Establishes, maintains, and terminates sessions",
            "Session authentication and authorization",
            "Session checkpointing and recovery",
            "Manages dialog control (half-duplex or full-duplex)",
            "Token management for preventing simultaneous access",
            "RPC (Remote Procedure Call) operates here",
            "NetBIOS and PPTP protocols use this layer"
          ],
          codeExample: `// Session Management Example
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true, 
    maxAge: 3600000, // 1 hour
    httpOnly: true,
    sameSite: 'strict'
  },
  rolling: true // Extend session on activity
}));`
        },
        {
          title: "Layer 4: Transport Layer",
          content: "The Transport Layer provides end-to-end communication services for applications. It handles segmentation, flow control, error correction, and ensures data integrity. The two main protocols are TCP (Transmission Control Protocol) for reliable, connection-oriented communication and UDP (User Datagram Protocol) for fast, connectionless transmission. This layer manages port numbers to identify applications and provides multiplexing capabilities.",
          diagram: "osi-layer-4",
          keyPoints: [
            "TCP provides reliable, connection-oriented communication with flow control",
            "UDP offers fast, connectionless transmission for real-time applications",
            "Port numbers identify applications (0-65535)",
            "SYN flood attacks target TCP handshake",
            "Port scanning occurs at this layer",
            "Load balancers can operate at Layer 4",
            "Handles segmentation and reassembly of data",
            "Provides error detection and correction"
          ],
          codeExample: `# TCP SYN Flood Protection
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# TCP Connection States
netstat -tan | awk '{print $6}' | sort | uniq -c`
        },
        {
          title: "Layer 3: Network Layer",
          content: "The Network Layer is responsible for packet forwarding, routing, and addressing across multiple networks. It determines the best path for data to travel from source to destination using logical addressing (IP addresses). This layer handles fragmentation and reassembly of packets, manages routing tables, and implements protocols like IP (Internet Protocol), ICMP (Internet Control Message Protocol), and routing protocols (BGP, OSPF, RIP).",
          diagram: "osi-layer-3",
          keyPoints: [
            "IP addressing and routing happen here (IPv4 and IPv6)",
            "Determines the best path using routing algorithms",
            "Packet fragmentation and reassembly",
            "DDoS attacks can target this layer with packet floods",
            "BGP hijacking is a Layer 3 threat",
            "Geo-blocking and IP filtering operate at this layer",
            "CDN edge servers use Anycast routing",
            "ICMP for ping and traceroute diagnostics"
          ],
          codeExample: `# IP Routing and Filtering
# Block specific IP ranges
iptables -A INPUT -s 192.168.1.0/24 -j DROP

# Enable IP forwarding
sysctl -w net.ipv4.ip_forward=1

# View routing table
ip route show`
        },
        {
          title: "Layer 2: Data Link Layer",
          content: "The Data Link Layer provides node-to-node data transfer between two directly connected nodes. It detects and possibly corrects errors that may occur in the Physical layer. This layer is divided into two sublayers: MAC (Media Access Control) which controls how devices gain access to the medium and permission to transmit data, and LLC (Logical Link Control) which provides flow control and error checking. Switches operate at this layer using MAC addresses.",
          diagram: "osi-layer-2",
          keyPoints: [
            "Uses MAC addresses (48-bit hardware addresses) for identification",
            "Frames data packets with headers and trailers",
            "Error detection using CRC (Cyclic Redundancy Check)",
            "Flow control between directly connected nodes",
            "Switches and bridges operate at this layer",
            "VLANs (Virtual LANs) are configured at Layer 2",
            "ARP (Address Resolution Protocol) maps IP to MAC addresses",
            "Common attacks: ARP spoofing, MAC flooding, VLAN hopping"
          ],
          codeExample: `# Layer 2 Security
# View MAC address table
arp -a

# Enable port security on switch (Cisco)
interface GigabitEthernet0/1
 switchport mode access
 switchport port-security
 switchport port-security maximum 2
 switchport port-security violation restrict
 switchport port-security mac-address sticky`
        },
        {
          title: "Layer 1: Physical Layer",
          content: "The Physical Layer defines the hardware elements involved in data transmission, including cables, switches, network interface cards, and the electrical signals or light pulses that represent bits. It specifies the physical and electrical specifications of the data connection, including voltage levels, timing, data rates, maximum transmission distances, and physical connectors. This layer converts digital bits into electrical, radio, or optical signals.",
          diagram: "osi-layer-1",
          keyPoints: [
            "Defines physical medium: copper, fiber optic, wireless",
            "Specifies voltage levels and signal timing",
            "Determines data transmission rates (bandwidth)",
            "Defines physical connectors (RJ45, fiber connectors)",
            "Hub and repeater devices operate at this layer",
            "Handles bit synchronization between devices",
            "Physical security is critical at this layer",
            "Attacks: cable cutting, eavesdropping, physical tampering"
          ],
          codeExample: `# Physical Layer Diagnostics
# Check network interface status
ethtool eth0

# View physical link status
ip link show

# Monitor physical errors
netstat -i

# Cable testing (requires physical access)
# - Check for proper termination
# - Verify cable category (Cat5e, Cat6, etc.)
# - Test signal strength and attenuation`
        }
      ],
      practicalExercise: {
        title: "Identify OSI Layers in Action",
        scenario: "You're monitoring network traffic for a web application. Analyze the different layers involved in a simple HTTPS request.",
        steps: [
          "Open browser DevTools Network tab",
          "Visit any HTTPS website",
          "Examine the request headers (Layer 7)",
          "Check the connection protocol (Layer 4 - TCP)",
          "Note the IP addresses (Layer 3)",
          "Understand the full stack involved"
        ]
      },
      realWorldExample: {
        title: "Cloudflare's Multi-Layer DDoS Protection",
        description: "In 2023, Cloudflare mitigated a 71 million requests-per-second DDoS attack, the largest HTTP DDoS attack on record. This attack targeted Layer 7 (Application Layer).",
        impact: "By understanding OSI layers, Cloudflare's WAF could distinguish between legitimate traffic and attack traffic, protecting the customer without impacting real users."
      }
    },
    quiz: [
      {
        id: 1,
        question: "At which OSI layer does a Web Application Firewall (WAF) primarily operate?",
        options: [
          "Layer 4 (Transport)",
          "Layer 3 (Network)",
          "Layer 7 (Application)",
          "Layer 2 (Data Link)"
        ],
        correctAnswer: 2,
        explanation: "WAFs operate at Layer 7 (Application Layer) to inspect HTTP/HTTPS traffic and protect against application-level attacks like SQL injection and XSS.",
        difficulty: 'medium'
      },
      {
        id: 2,
        question: "Which attack specifically targets the TCP handshake process?",
        options: [
          "SQL Injection",
          "SYN Flood",
          "DNS Spoofing",
          "ARP Poisoning"
        ],
        correctAnswer: 1,
        explanation: "SYN Flood attacks target the TCP three-way handshake at Layer 4 by sending numerous SYN requests without completing the handshake, exhausting server resources.",
        difficulty: 'medium'
      },
      {
        id: 3,
        question: "What protocol does the Transport Layer use for real-time video streaming?",
        options: [
          "TCP only",
          "UDP only",
          "HTTP/2",
          "Both TCP and UDP"
        ],
        correctAnswer: 1,
        explanation: "Real-time video streaming typically uses UDP because it prioritizes speed over reliability. Dropping a few packets is acceptable for smooth playback.",
        difficulty: 'easy'
      }
    ],
    knowledgePoints: [
      {
        title: "Master of Layers",
        description: "You've unlocked a deep understanding of how network communication works!",
        icon: "layers"
      },
      {
        title: "Security Vision",
        description: "You can now identify security threats across all network layers!",
        icon: "shield-check"
      }
    ]
  },

  {
    id: 2,
    title: "TCP/IP Protocol Suite",
    phase: 0,
    phaseName: "Network Fundamentals",
    day: 2,
    difficulty: 'beginner',
    reading_time_min: 18,
    tags: ['networking', 'tcp-ip', 'protocols'],
    description: "Deep dive into TCP/IP protocols, the backbone of internet communication",
    objectives: [
      "Understand TCP three-way handshake",
      "Learn TCP vs UDP differences",
      "Identify security vulnerabilities in TCP/IP",
      "Master connection state management"
    ],
    content: {
      introduction: "TCP/IP is the fundamental protocol suite powering the internet. As a security architect, understanding TCP/IP internals helps you defend against various attacks and optimize your security architecture.",
      sections: [
        {
          title: "TCP Three-Way Handshake",
          content: "The TCP handshake establishes a reliable connection between client and server through three steps: SYN, SYN-ACK, and ACK.",
          diagram: "tcp-handshake",
          keyPoints: [
            "SYN: Client initiates connection",
            "SYN-ACK: Server acknowledges and responds",
            "ACK: Client confirms connection established",
            "Sequence numbers prevent replay attacks",
            "SYN cookies defend against SYN floods"
          ],
          codeExample: `// Monitoring TCP connections
netstat -tan | grep ESTABLISHED
# Shows active TCP connections

# TCP connection states:
# SYN_SENT, SYN_RECEIVED, ESTABLISHED, FIN_WAIT, CLOSE_WAIT, TIME_WAIT`
        },
        {
          title: "TCP vs UDP: When to Use Each",
          content: "TCP provides reliability while UDP prioritizes speed. Security architects must choose the right protocol for each use case.",
          keyPoints: [
            "TCP: Reliable, ordered delivery (web, email, file transfers)",
            "UDP: Fast, low-overhead (DNS, VoIP, streaming)",
            "TCP vulnerable to SYN floods and slowloris attacks",
            "UDP used in amplification attacks (DNS, NTP, memcached)",
            "QUIC protocol combines TCP reliability with UDP speed"
          ]
        },
        {
          title: "TCP Security Vulnerabilities",
          content: "TCP's stateful nature creates attack opportunities. Understanding these vulnerabilities is essential for defense.",
          keyPoints: [
            "SYN Flood: Exhausts connection table",
            "TCP Reset Attack: Terminates connections",
            "TCP Session Hijacking: Steals active sessions",
            "Slowloris: Keeps connections open slowly",
            "Connection exhaustion attacks"
          ],
          codeExample: `// Rate limiting TCP connections
# Limit new connections per IP
iptables -A INPUT -p tcp --dport 80 -m connlimit \\
  --connlimit-above 20 --connlimit-mask 32 -j REJECT

# Protect against SYN floods
sysctl -w net.ipv4.tcp_syncookies=1
sysctl -w net.ipv4.tcp_max_syn_backlog=2048`
        }
      ],
      practicalExercise: {
        title: "Analyze TCP Traffic with Wireshark",
        scenario: "Use Wireshark to capture and analyze a TCP handshake, then identify the three-way handshake packets.",
        steps: [
          "Install Wireshark (or use tcpdump)",
          "Start packet capture on your network interface",
          "Visit any website to generate TCP traffic",
          "Filter for TCP handshake: tcp.flags.syn==1",
          "Identify SYN, SYN-ACK, and ACK packets",
          "Examine sequence and acknowledgment numbers"
        ]
      },
      realWorldExample: {
        title: "Mirai Botnet TCP Attacks",
        description: "The Mirai botnet (2016) compromised IoT devices to launch massive DDoS attacks. It exploited weak credentials and used TCP SYN floods to overwhelm targets.",
        impact: "Mirai generated traffic peaks of 1.2 Tbps, taking down major services like Dyn DNS. This highlighted the importance of TCP connection rate limiting and proper IoT security."
      }
    },
    quiz: [
      {
        id: 4,
        question: "What is the purpose of sequence numbers in TCP?",
        options: [
          "To speed up data transfer",
          "To prevent replay attacks and ensure ordered delivery",
          "To compress data packets",
          "To encrypt the connection"
        ],
        correctAnswer: 1,
        explanation: "TCP sequence numbers ensure packets arrive in order and prevent replay attacks by making each packet unique. Attackers can't reuse old packets.",
        difficulty: 'medium'
      },
      {
        id: 5,
        question: "Which defense mechanism helps protect against SYN flood attacks?",
        options: [
          "SSL/TLS encryption",
          "SYN cookies",
          "DNS caching",
          "Content compression"
        ],
        correctAnswer: 1,
        explanation: "SYN cookies allow servers to avoid storing connection state until the handshake completes, preventing SYN flood attacks from exhausting resources.",
        difficulty: 'hard'
      },
      {
        id: 6,
        question: "Why do streaming services prefer UDP over TCP?",
        options: [
          "UDP is more secure",
          "UDP is more reliable",
          "UDP has lower latency and no retransmission delays",
          "UDP encrypts data automatically"
        ],
        correctAnswer: 2,
        explanation: "UDP doesn't wait for retransmissions like TCP, making it ideal for real-time streaming where occasional packet loss is acceptable for smooth playback.",
        difficulty: 'easy'
      }
    ],
    knowledgePoints: [
      {
        title: "Protocol Expert",
        description: "You've mastered the TCP/IP protocol suite!",
        icon: "network"
      },
      {
        title: "Attack Detector",
        description: "You can now recognize TCP-based attacks and defend against them!",
        icon: "radar"
      }
    ]
  },

  // Add 8 more Phase 0 lessons here (DNS, Subnetting, Routing, etc.)
  // For brevity, I'll add key lessons from each phase

  {
    id: 11,
    title: "CDN Architecture Fundamentals",
    phase: 2,
    phaseName: "CDN & Edge Computing",
    day: 11,
    difficulty: 'intermediate',
    reading_time_min: 20,
    tags: ['cdn', 'edge', 'performance'],
    description: "Learn how Content Delivery Networks work and why they're critical for security and performance",
    objectives: [
      "Understand CDN architecture and edge networks",
      "Learn caching strategies and cache keys",
      "Master CDN security features",
      "Optimize content delivery performance"
    ],
    content: {
      introduction: "Content Delivery Networks (CDNs) are distributed networks of servers that cache and deliver content from locations closest to users. Modern CDNs like Cloudflare also provide crucial security services.",
      sections: [
        {
          title: "CDN Architecture Overview",
          content: "A CDN consists of origin servers, edge servers, and Points of Presence (PoPs) worldwide. When a user requests content, the CDN routes them to the nearest edge server.",
          diagram: "cdn-architecture",
          keyPoints: [
            "Edge servers cache content near users",
            "Anycast routing directs traffic to nearest PoP",
            "Origin shield protects backend servers",
            "Reduced latency improves user experience",
            "DDoS attacks are absorbed at the edge"
          ],
          codeExample: `// Cloudflare Cache Control
app.get('/api/products', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600, s-maxage=7200');
  res.set('CDN-Cache-Control', 'max-age=7200');
  res.json({ products: [...] });
});

// Different caching for authenticated vs public
if (req.headers.authorization) {
  res.set('Cache-Control', 'private, no-cache');
} else {
  res.set('Cache-Control', 'public, max-age=3600');
}`
        },
        {
          title: "Cache Keys and Strategies",
          content: "Cache keys determine what content is cached and how it's retrieved. Proper cache key configuration is essential for both performance and security.",
          keyPoints: [
            "Default cache key: URL + query string",
            "Custom cache keys for personalization",
            "Ignore query strings selectively",
            "Cache based on cookies (carefully!)",
            "Cache poisoning attacks target cache keys"
          ],
          codeExample: `// Cache Key Configuration Examples
// Cloudflare Workers cache key
const cacheKey = new URL(request.url);
cacheKey.searchParams.delete('utm_source'); // Ignore marketing params
cacheKey.searchParams.delete('utm_medium');

// Custom cache key with user segment
if (request.headers.get('X-User-Segment') === 'premium') {
  cacheKey.searchParams.set('segment', 'premium');
}

const cache = await caches.default;
let response = await cache.match(cacheKey);`
        },
        {
          title: "CDN Security Features",
          content: "Modern CDNs provide multiple security layers including DDoS protection, WAF, bot management, and rate limiting.",
          keyPoints: [
            "DDoS mitigation absorbs attacks at the edge",
            "WAF blocks malicious requests before origin",
            "Bot management identifies and blocks bad bots",
            "SSL/TLS termination at the edge",
            "Rate limiting prevents abuse"
          ]
        }
      ],
      practicalExercise: {
        title: "Configure CDN Caching Rules",
        scenario: "You're setting up a CDN for an e-commerce site. Configure caching for different content types.",
        steps: [
          "Identify cacheable resources (images, CSS, JS)",
          "Set long cache times for static assets (1 year)",
          "Use short cache times for dynamic content (5 min)",
          "Configure cache bypass for authenticated requests",
          "Implement cache purging for product updates",
          "Test cache hit ratios"
        ]
      },
      realWorldExample: {
        title: "GitHub's CDN Strategy",
        description: "GitHub uses Cloudflare CDN to serve static assets and protect against DDoS attacks. During the 2018 1.35 Tbps DDoS attack, Cloudflare's edge network absorbed the traffic.",
        impact: "The CDN prevented the attack from reaching GitHub's origin servers, keeping the platform online for millions of developers worldwide."
      }
    },
    quiz: [
      {
        id: 31,
        question: "What is the primary benefit of Anycast routing in CDNs?",
        options: [
          "It encrypts traffic automatically",
          "It routes users to the nearest available edge server",
          "It compresses content to save bandwidth",
          "It blocks DDoS attacks automatically"
        ],
        correctAnswer: 1,
        explanation: "Anycast routing uses the same IP address across multiple locations, and BGP routing automatically directs users to the nearest edge server based on network proximity.",
        difficulty: 'medium'
      },
      {
        id: 32,
        question: "What type of attack exploits CDN cache keys to serve malicious content?",
        options: [
          "SQL Injection",
          "Cache Poisoning",
          "XSS",
          "CSRF"
        ],
        correctAnswer: 1,
        explanation: "Cache poisoning attacks manipulate cache keys or headers to store malicious content in the CDN cache, which is then served to other users.",
        difficulty: 'hard'
      },
      {
        id: 33,
        question: "Why should authenticated user requests bypass CDN cache?",
        options: [
          "To improve performance",
          "To prevent users from seeing each other's private data",
          "To reduce server load",
          "To save bandwidth"
        ],
        correctAnswer: 1,
        explanation: "Caching authenticated requests could expose private user data to other users. Always use 'Cache-Control: private, no-cache' for personalized content.",
        difficulty: 'easy'
      }
    ],
    knowledgePoints: [
      {
        title: "CDN Master",
        description: "You understand how CDNs accelerate and secure web applications!",
        icon: "globe"
      },
      {
        title: "Caching Strategist",
        description: "You can design efficient caching strategies for any application!",
        icon: "database"
      }
    ]
  },

  {
    id: 21,
    title: "WAF Rules and Configuration",
    phase: 3,
    phaseName: "WAF & Bot Management",
    day: 21,
    difficulty: 'intermediate',
    reading_time_min: 25,
    tags: ['waf', 'security', 'rules'],
    description: "Master Web Application Firewall configuration, rule creation, and tuning",
    objectives: [
      "Understand WAF rule syntax and logic",
      "Configure managed and custom rules",
      "Tune rules to reduce false positives",
      "Implement rate limiting and bot detection"
    ],
    content: {
      introduction: "Web Application Firewalls (WAFs) are your first line of defense against web attacks. Learning to configure and tune WAF rules is essential for protecting applications without blocking legitimate traffic.",
      sections: [
        {
          title: "WAF Rule Anatomy",
          content: "WAF rules consist of conditions (when to match) and actions (what to do). Understanding rule structure helps you create effective protections.",
          diagram: "waf-rule-structure",
          keyPoints: [
            "Conditions: Request properties to match (URL, headers, body)",
            "Operators: Equals, contains, regex, IP match, geo match",
            "Actions: Block, challenge, allow, log",
            "Rate limiting: Count requests per time window",
            "Rule priorities determine evaluation order"
          ],
          codeExample: `// Cloudflare WAF Custom Rule Examples

// Block SQL injection attempts
(http.request.uri.query contains "UNION SELECT" or
 http.request.uri.query contains "' OR '1'='1") and
not (cf.threat_score < 10)

// Rate limit API endpoints
(http.request.uri.path contains "/api/") and
(rate_limit:10:60s) // 10 requests per 60 seconds

// Allow only specific countries
not (ip.geoip.country in {"US" "CA" "GB" "DE"})

// Block known bad bots
(cf.bot_management.score < 30) and
(http.request.uri.path contains "/checkout")

// Challenge suspicious traffic
(cf.threat_score > 50 or cf.bot_management.verified_bot eq false)`
        },
        {
          title: "Managed Rule Sets",
          content: "Managed rule sets provide pre-configured protection against common attacks. They're maintained by security teams and updated regularly.",
          keyPoints: [
            "OWASP Core Rule Set: Protects against Top 10 vulnerabilities",
            "Cloudflare Managed Ruleset: Blocks known attack patterns",
            "Zero-Day Protection: Defends against emerging threats",
            "Bot Management: Identifies and blocks malicious bots",
            "DDoS Protection: Mitigates volumetric attacks"
          ]
        },
        {
          title: "Reducing False Positives",
          content: "WAF rules can block legitimate traffic (false positives). Tuning rules requires careful analysis and testing.",
          keyPoints: [
            "Monitor WAF logs for blocked legitimate requests",
            "Use 'Log' action before blocking to test rules",
            "Whitelist known good IPs and User-Agents",
            "Adjust sensitivity levels for managed rules",
            "Create exception rules for specific paths"
          ],
          codeExample: `// Exception rule for admin panel
(http.request.uri.path starts_with "/admin") and
(ip.src in {203.0.113.0/24}) // Internal network
// Action: Skip WAF rules

// Whitelist verified search bots
(cf.bot_management.verified_bot eq true) and
(http.user_agent contains "Googlebot" or
 http.user_agent contains "Bingbot")
// Action: Allow

// Reduce sensitivity for specific path
(http.request.uri.path eq "/api/search") and
(cf.waf.score < 50) // Less strict than default
// Action: Allow`
        }
      ],
      practicalExercise: {
        title: "Create WAF Rules for E-Commerce Site",
        scenario: "Configure WAF rules to protect a shopping site from common attacks while allowing legitimate customers.",
        steps: [
          "Enable OWASP Core Rule Set",
          "Create rate limiting rule for checkout (5 attempts/min)",
          "Block requests with SQL injection patterns",
          "Allow legitimate search bots",
          "Challenge traffic with high threat scores",
          "Monitor logs for false positives",
          "Whitelist your office IP for testing"
        ]
      },
      realWorldExample: {
        title: "Capital One Data Breach Prevention",
        description: "In 2019, Capital One suffered a breach due to misconfigured WAF rules. The attacker exploited SSRF vulnerability to access AWS metadata service.",
        impact: "Proper WAF configuration with custom rules to block metadata service access could have prevented this breach affecting 100M customers. This case highlights the importance of WAF tuning and understanding your infrastructure."
      }
    },
    quiz: [
      {
        id: 61,
        question: "What is the recommended approach before deploying a new WAF rule in block mode?",
        options: [
          "Deploy immediately to production",
          "Test in 'Log' mode first to check for false positives",
          "Wait for an attack to occur",
          "Disable all other rules"
        ],
        correctAnswer: 1,
        explanation: "Always test new rules in 'Log' mode first. This allows you to monitor blocked requests without impacting users, helping you identify and fix false positives before enabling block mode.",
        difficulty: 'medium'
      },
      {
        id: 62,
        question: "Which WAF rule operator would you use to match multiple countries?",
        options: [
          "contains",
          "equals",
          "in",
          "matches"
        ],
        correctAnswer: 2,
        explanation: "The 'in' operator checks if a value is in a list. For geo-blocking, use: ip.geoip.country in {\"US\" \"CA\" \"GB\"} to match multiple countries.",
        difficulty: 'easy'
      },
      {
        id: 63,
        question: "What action should you take when WAF blocks legitimate traffic from your API clients?",
        options: [
          "Disable the WAF entirely",
          "Create an exception rule or whitelist the IP range",
          "Tell clients to stop using your API",
          "Ignore the issue"
        ],
        correctAnswer: 1,
        explanation: "Create exception rules for known legitimate traffic. You can whitelist IP ranges, create path-specific exceptions, or use custom rules to allow traffic while maintaining protection.",
        difficulty: 'medium'
      }
    ],
    knowledgePoints: [
      {
        title: "WAF Warrior",
        description: "You can configure and tune WAF rules like a pro!",
        icon: "shield"
      },
      {
        title: "Rule Master",
        description: "You understand the balance between security and usability!",
        icon: "balance"
      }
    ]
  },

  {
    id: 41,
    title: "Incident Response Playbook",
    phase: 4,
    phaseName: "Incident Response",
    day: 41,
    difficulty: 'advanced',
    reading_time_min: 30,
    tags: ['incident-response', 'soc', 'security-operations'],
    description: "Learn the NIST incident response framework and build your own playbooks",
    objectives: [
      "Master the 6-phase incident response lifecycle",
      "Create incident response playbooks",
      "Understand roles and responsibilities in IR",
      "Practice incident triage and escalation"
    ],
    content: {
      introduction: "Incident response is what separates a minor security event from a catastrophic breach. The NIST framework provides a proven methodology for detecting, containing, and recovering from security incidents.",
      sections: [
        {
          title: "The Incident Response Lifecycle",
          content: "NIST defines six phases: Preparation, Detection & Analysis, Containment, Eradication, Recovery, and Post-Incident Activity. Let's explore each phase.",
          diagram: "incident-response-lifecycle",
          keyPoints: [
            "Preparation: Build IR team, tools, and playbooks",
            "Detection: Identify and validate security events",
            "Containment: Limit damage and prevent spread",
            "Eradication: Remove threat from environment",
            "Recovery: Restore systems to normal operation",
            "Lessons Learned: Improve processes and defenses"
          ]
        },
        {
          title: "Incident Classification and Triage",
          content: "Not all incidents are equal. Proper classification helps you prioritize response efforts and allocate resources effectively.",
          keyPoints: [
            "Severity levels: Critical, High, Medium, Low",
            "Impact assessment: Data, systems, reputation",
            "Urgency: Active exploit, widespread, contained",
            "Incident types: Malware, DDoS, data breach, insider threat",
            "Escalation criteria: When to involve executives, legal, PR"
          ],
          codeExample: `// Incident Classification Matrix
const classifyIncident = (incident) => {
  const score = {
    dataExposed: incident.dataExposed ? 40 : 0,
    activeExploit: incident.active ? 30 : 0,
    criticalSystem: incident.criticalSystem ? 20 : 0,
    publicFacing: incident.publicFacing ? 10 : 0
  };

  const total = Object.values(score).reduce((a, b) => a + b, 0);

  if (total >= 70) return { severity: 'CRITICAL', sla: '15min' };
  if (total >= 50) return { severity: 'HIGH', sla: '1hr' };
  if (total >= 30) return { severity: 'MEDIUM', sla: '4hr' };
  return { severity: 'LOW', sla: '24hr' };
};

// Example usage
const incident = {
  dataExposed: true,
  active: true,
  criticalSystem: true,
  publicFacing: true
};

const classification = classifyIncident(incident);
// Result: { severity: 'CRITICAL', sla: '15min' }`
        },
        {
          title: "Building Incident Response Playbooks",
          content: "Playbooks are step-by-step guides for responding to specific incident types. They ensure consistent, effective responses.",
          keyPoints: [
            "Define incident type and scope",
            "List initial response steps",
            "Specify containment actions",
            "Document investigation procedures",
            "Include communication templates",
            "Define recovery checkpoints"
          ],
          codeExample: `// DDoS Attack Playbook Example
{
  "incident_type": "DDoS Attack",
  "severity": "HIGH",
  "detection_indicators": [
    "Traffic spike > 10x normal",
    "Server response time > 5s",
    "CDN bandwidth alert",
    "Multiple 503 errors"
  ],
  "immediate_actions": [
    "Enable DDoS protection mode on CDN",
    "Increase rate limiting aggressiveness",
    "Activate challenge pages for suspicious IPs",
    "Scale backend infrastructure",
    "Notify stakeholders"
  ],
  "investigation": [
    "Analyze traffic patterns and source IPs",
    "Check for amplification attacks (DNS, NTP)",
    "Review WAF logs for application-layer attacks",
    "Identify attack vector and motivation"
  ],
  "containment": [
    "Block attacking IP ranges at edge",
    "Implement geo-blocking if needed",
    "Enable bot challenge for all traffic",
    "Reduce session timeouts"
  ],
  "recovery": [
    "Gradually relax protection measures",
    "Monitor for attack resumption",
    "Restore normal rate limits",
    "Document lessons learned"
  ]
}`
        }
      ],
      practicalExercise: {
        title: "Simulate DDoS Incident Response",
        scenario: "Your e-commerce site is experiencing a sudden traffic spike. 95% of requests are timing out. Walk through the IR process.",
        steps: [
          "Detection: Confirm DDoS attack via monitoring alerts",
          "Classification: Assess severity (HIGH - revenue impact)",
          "Containment: Enable CDN DDoS mode, rate limiting",
          "Investigation: Analyze attack source and vector",
          "Communication: Update status page, notify stakeholders",
          "Eradication: Block malicious IPs and patterns",
          "Recovery: Verify normal operations restored",
          "Post-Incident: Document timeline and improvements"
        ]
      },
      realWorldExample: {
        title: "Dyn DNS DDoS Attack (2016)",
        description: "The Mirai botnet attacked Dyn DNS, affecting major sites like Twitter, Netflix, and Reddit. Dyn's IR team followed their playbooks to contain and mitigate the attack.",
        impact: "Effective incident response limited downtime to ~12 hours. The team's preparation, clear communication, and systematic approach minimized impact on customers."
      }
    },
    quiz: [
      {
        id: 121,
        question: "What is the first phase of the NIST incident response lifecycle?",
        options: [
          "Detection & Analysis",
          "Preparation",
          "Containment",
          "Recovery"
        ],
        correctAnswer: 1,
        explanation: "Preparation is the first phase. It involves building your IR team, creating playbooks, setting up monitoring tools, and establishing communication channels before an incident occurs.",
        difficulty: 'easy'
      },
      {
        id: 122,
        question: "When should you escalate a security incident to executive leadership?",
        options: [
          "For every incident, no matter how small",
          "Only after the incident is fully resolved",
          "When there's data breach, legal implications, or significant business impact",
          "Never escalate to executives"
        ],
        correctAnswer: 2,
        explanation: "Escalate to executives for critical incidents involving data breaches, legal/compliance issues, significant business impact, or potential PR concerns. Use your classification matrix to guide decisions.",
        difficulty: 'medium'
      },
      {
        id: 123,
        question: "What is the purpose of the 'Lessons Learned' phase?",
        options: [
          "To assign blame for the incident",
          "To improve IR processes and prevent future incidents",
          "To document which employees made mistakes",
          "To calculate the financial cost"
        ],
        correctAnswer: 1,
        explanation: "Lessons learned focus on improving your security posture and IR processes. It's a blameless review to identify what went well, what didn't, and how to be better prepared next time.",
        difficulty: 'easy'
      }
    ],
    knowledgePoints: [
      {
        title: "Incident Commander",
        description: "You can lead incident response efforts like a seasoned professional!",
        icon: "commander"
      },
      {
        title: "Crisis Manager",
        description: "You understand how to stay calm and systematic under pressure!",
        icon: "timer"
      }
    ]
  }
];

// Export lesson count for progress tracking
export const totalLessons = 50; // We'll have 50 lessons total
export const lessonsByPhase = {
  0: 10, // Network Fundamentals
  1: 10, // Web Security
  2: 10, // CDN & Edge
  3: 10, // WAF & Bot Management
  4: 10  // Incident Response
};
