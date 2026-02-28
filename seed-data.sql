-- =====================================================
-- PHASE 0: NETWORKING FOUNDATIONS (Days 1-12)
-- =====================================================

-- Day 1: OSI Model Fundamentals
INSERT INTO lessons (title, slug, phase, phase_name, day_number, reading_time_min, difficulty, content, objectives, key_takeaways, micro_lab, prerequisites) VALUES
('OSI Model: The 7 Layers of Networking', 'osi-model-basics', 0, 'Networking Foundations', 1, 12, 'beginner',
'# OSI Model: The 7 Layers of Networking

The **OSI (Open Systems Interconnection) model** is a conceptual framework that standardizes network communication into 7 layers. Each layer has specific responsibilities and communicates with the layers directly above and below it.

## The 7 Layers (Bottom to Top)

### Layer 1: Physical
- **Purpose**: Transmits raw bits over physical medium
- **Examples**: Ethernet cables, fiber optics, Wi-Fi radio waves
- **Key concept**: Voltage levels, light pulses, radio frequencies

### Layer 2: Data Link
- **Purpose**: Node-to-node data transfer, error detection
- **Examples**: MAC addresses, switches, ARP
- **Key concept**: Frames, MAC addressing, collision detection

### Layer 3: Network
- **Purpose**: Routing packets between networks
- **Examples**: IP addresses, routers, ICMP
- **Key concept**: Logical addressing, path determination

### Layer 4: Transport
- **Purpose**: End-to-end communication, reliability
- **Examples**: TCP, UDP, ports
- **Key concept**: Segmentation, flow control, error recovery

### Layer 5: Session
- **Purpose**: Managing connections between applications
- **Examples**: NetBIOS, RPC
- **Key concept**: Session establishment, maintenance, termination

### Layer 6: Presentation
- **Purpose**: Data translation, encryption, compression
- **Examples**: SSL/TLS, JPEG, ASCII
- **Key concept**: Data formatting, encryption/decryption

### Layer 7: Application
- **Purpose**: Network services to applications
- **Examples**: HTTP, DNS, SMTP, FTP
- **Key concept**: User interface, application protocols

## Why It Matters for Security

- **Layer 3 attacks**: IP spoofing, routing attacks
- **Layer 4 attacks**: SYN floods, port scanning
- **Layer 7 attacks**: HTTP floods, application exploits
- **Defense-in-depth**: Security at multiple layers

## Real-World Application

When you visit a website:
1. **Application (L7)**: Browser sends HTTP request
2. **Transport (L4)**: TCP ensures reliable delivery
3. **Network (L3)**: IP routes packets to destination
4. **Data Link (L2)**: Frames sent over Ethernet/Wi-Fi
5. **Physical (L1)**: Electrical/optical signals transmitted',
'["Understand the purpose of each OSI layer", "Recognize layer-specific protocols", "Map security threats to OSI layers", "Apply OSI model to troubleshooting"]',
'["OSI has 7 layers from Physical to Application", "Each layer serves a specific function", "Security threats target different layers", "Understanding OSI helps with network troubleshooting"]',
'{"title": "OSI Layer Identification", "steps": ["Open your browser DevTools (F12)", "Go to Network tab", "Visit any website", "Identify: HTTP (L7), TCP (L4), IP (L3) in request headers"], "expected_outcome": "You should see HTTP protocol, TCP port numbers, and IP addresses - each representing different OSI layers"}',
'[]');

