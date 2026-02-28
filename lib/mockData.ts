// Mock data for development
export const mockUser = {
  id: 'user_demo_001',
  username: 'learner',
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
}

export const mockLessons = [
  {
    id: 1,
    title: 'OSI Model & Network Layers',
    slug: 'osi-model',
    phase: 0,
    day: 1,
    difficulty: 'beginner',
    reading_time_min: 12,
    content: `# Understanding the OSI Model

The OSI (Open Systems Interconnection) model is a conceptual framework that standardizes network communication into 7 distinct layers. Understanding this model is fundamental to security architecture.

## The 7 Layers

### Layer 7: Application Layer
This is where users interact with the network. HTTP, HTTPS, FTP, SMTP all operate here.

**Security Concerns:**
- SQL injection attacks
- Cross-site scripting (XSS)
- API vulnerabilities
- Authentication bypass

### Layer 6: Presentation Layer
Handles data encryption, compression, and translation.

**Security Concerns:**
- SSL/TLS vulnerabilities
- Man-in-the-middle attacks
- Certificate validation issues

### Layer 5: Session Layer
Manages sessions between applications.

**Security Concerns:**
- Session hijacking
- Session fixation
- Cookie theft

### Layer 4: Transport Layer
TCP and UDP operate here, managing end-to-end communication.

**Security Concerns:**
- SYN flood attacks
- Port scanning
- TCP hijacking

### Layer 3: Network Layer
IP addresses and routing happen here.

**Security Concerns:**
- IP spoofing
- Routing attacks
- ICMP floods

### Layer 2: Data Link Layer
MAC addresses and switching operate at this layer.

**Security Concerns:**
- ARP spoofing
- MAC flooding
- VLAN hopping

### Layer 1: Physical Layer
The actual hardware - cables, fiber, radio waves.

**Security Concerns:**
- Physical access attacks
- Wire tapping
- Signal interference

## Why This Matters for CDN/WAF

Understanding where attacks happen in the OSI model helps you:
1. Choose the right security controls
2. Understand WAF rule placement
3. Optimize CDN caching strategies
4. Debug connectivity issues
5. Design defense-in-depth architectures

Most CDN and WAF solutions operate at Layers 3-7, with the majority of protections at Layer 7 (application layer).`,
    objectives: `- Understand all 7 layers of the OSI model
- Identify security threats at each layer
- Apply OSI knowledge to CDN/WAF architecture
- Recognize attack vectors by layer`,
    key_takeaways: `- OSI model has 7 layers from Physical to Application
- Most attacks happen at Layer 7 (application)
- CDNs and WAFs primarily protect Layers 3-7
- Understanding layers helps you choose the right security controls
- Defense-in-depth means protecting multiple layers`,
    micro_lab: `## Hands-On Exercise

1. Open your browser's developer tools (F12)
2. Visit any website and go to the Network tab
3. Refresh the page
4. Click on any request and examine:
   - Headers (Layer 7 - Application)
   - Protocol (HTTP/HTTPS)
   - IP address (Layer 3 - Network)
   - Port number (Layer 4 - Transport)

Try to identify which OSI layer each piece of information belongs to!`,
    prerequisites: null
  },
  {
    id: 2,
    title: 'TCP/IP Protocol Suite',
    slug: 'tcp-ip-protocols',
    phase: 0,
    day: 2,
    difficulty: 'beginner',
    reading_time_min: 15,
    content: `# TCP/IP: The Foundation of the Internet

TCP/IP isn't just one protocol - it's a suite of protocols that power the entire internet. Understanding how data flows through these protocols is essential for security architecture.

## The TCP Three-Way Handshake

Every TCP connection starts with a handshake:

1. **SYN** - Client sends synchronization request
2. **SYN-ACK** - Server acknowledges and sends its own SYN
3. **ACK** - Client acknowledges, connection established

### Why Security Matters Here

**SYN Flood Attack:**
Attackers send thousands of SYN packets but never complete the handshake. This exhausts server resources.

**Mitigation with WAF/CDN:**
- SYN cookies
- Rate limiting
- Connection tracking

## UDP vs TCP

### TCP (Transmission Control Protocol)
- Connection-oriented
- Reliable delivery
- Ordered packets
- Error checking
- Used for: HTTP, HTTPS, SSH, FTP

### UDP (User Datagram Protocol)
- Connectionless
- Fast but unreliable
- No ordering guarantee
- Used for: DNS, video streaming, gaming

### Security Implications

TCP is vulnerable to:
- Connection hijacking
- SYN floods
- Slowloris attacks

UDP is vulnerable to:
- Amplification attacks (DNS, NTP)
- Spoofing (no handshake to verify)

## IP Addressing

### IPv4
- 32-bit addresses (e.g., 192.168.1.1)
- ~4.3 billion addresses
- Running out of space

### IPv6
- 128-bit addresses
- Virtually unlimited addresses
- Better security features built-in

## How CDNs Use This Knowledge

1. **Connection Pooling**: Reuse TCP connections
2. **HTTP/2 Multiplexing**: Multiple requests over one TCP connection
3. **Anycast Routing**: Single IP, multiple servers
4. **DDoS Mitigation**: Detect and block malicious TCP/UDP patterns`,
    objectives: `- Master TCP three-way handshake
- Understand TCP vs UDP trade-offs
- Recognize common protocol attacks
- Apply knowledge to CDN architecture`,
    key_takeaways: `- TCP is reliable but can be attacked (SYN floods)
- UDP is fast but easily spoofed
- Three-way handshake is critical for TCP
- CDNs optimize TCP connections for performance
- Understanding protocols helps detect attacks`,
    micro_lab: `## Packet Analysis Exercise

Use this command to watch TCP connections on your system:

\`\`\`bash
# On Mac/Linux
netstat -an | grep ESTABLISHED

# Count SYN packets (requires root)
sudo tcpdump -i any 'tcp[tcpflags] & tcp-syn != 0'
\`\`\`

Observe:
- How many TCP connections are open?
- Which ports are they using?
- Can you identify the protocol (HTTP=80, HTTPS=443)?`,
    prerequisites: 'OSI Model basics'
  }
]

export const mockQuizQuestions = [
  {
    id: 1,
    lesson_id: 1,
    question: 'At which OSI layer do most CDN and WAF protections operate?',
    type: 'multiple_choice',
    options: ['Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)', 'Layer 2 (Data Link)'],
    correct_answer: 'C',
    explanation: 'Most CDN and WAF protections operate at Layer 7 (Application layer) because this is where HTTP/HTTPS traffic flows and where most web attacks occur, including SQL injection, XSS, and API vulnerabilities.',
    points: 10
  },
  {
    id: 2,
    lesson_id: 1,
    question: 'Which of the following are security concerns at the Transport Layer (Layer 4)? Select all that apply.',
    type: 'multiple_correct',
    options: ['SYN flood attacks', 'SQL injection', 'Port scanning', 'TCP hijacking'],
    correct_answer: ['A', 'C', 'D'],
    explanation: 'SYN floods, port scanning, and TCP hijacking all occur at Layer 4. SQL injection is a Layer 7 (Application) attack that targets databases through web applications.',
    points: 15
  }
]

export const mockProgress = {
  user: mockUser,
  overall: {
    total_lessons: 50,
    completed_lessons: 5,
    completion_percentage: 10,
    current_streak: 3,
    longest_streak: 5,
    total_time_spent_minutes: 180
  },
  domains: [
    { domain: 'Networking', score: 75, lessons_count: 10, completed: 3 },
    { domain: 'Web Security', score: 60, lessons_count: 10, completed: 2 },
    { domain: 'CDN Architecture', score: 0, lessons_count: 10, completed: 0 },
    { domain: 'WAF Security', score: 0, lessons_count: 10, completed: 0 },
    { domain: 'Incident Response', score: 0, lessons_count: 10, completed: 0 }
  ],
  weak_topics: [
    { domain: 'CDN Architecture', score: 0 },
    { domain: 'WAF Security', score: 0 }
  ],
  readiness_level: {
    level: 'Beginner',
    score: 10,
    next_level: 'Intermediate',
    requirements: 'Complete 25% of lessons and maintain 7-day streak'
  },
  recent_achievements: []
}

export const mockDailyPlan = {
  date: new Date().toISOString().split('T')[0],
  lesson: mockLessons[0],
  completed: false,
  quiz_completed: false
}

export const mockIncidents = [
  {
    id: 1,
    title: 'Credential Stuffing Attack on Login',
    slug: 'credential-stuffing-login',
    category: 'Bot Attack',
    difficulty: 'intermediate',
    description: 'A large-scale credential stuffing attack is targeting your login endpoint with 10,000+ requests per minute using stolen credentials from a data breach.',
    time_limit_minutes: 10,
    required_phase: 1,
    initial_state: {
      situation: 'Your monitoring alerts you to 10,000+ login attempts per minute from distributed IPs. Success rate is 2%, indicating valid credentials are being used.',
      metrics: {
        'Requests/min': '10,234',
        'Success Rate': '2%',
        'Unique IPs': '1,547',
        'Affected Users': '156'
      },
      available_actions: [
        { id: 'rate_limit', action: 'Apply rate limiting (10 req/min per IP)', description: 'May affect legitimate users' },
        { id: 'captcha', action: 'Enable CAPTCHA on login', description: 'Impacts user experience' },
        { id: 'block_ips', action: 'Block all attacking IPs', description: 'Distributed attack, new IPs will appear' },
        { id: 'mfa', action: 'Force MFA for affected accounts', description: 'Best long-term solution' }
      ]
    },
    decision_tree: {},
    optimal_actions: {
      path: ['captcha', 'mfa'],
      explanation: 'The optimal response is to enable CAPTCHA immediately to stop the automated attack, then force MFA for all affected accounts. Rate limiting alone won\'t stop distributed attacks, and blocking IPs is a cat-and-mouse game.'
    },
    learning_objectives: 'Understand credential stuffing attacks, learn rate limiting strategies, practice incident response under pressure'
  }
]
