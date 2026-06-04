import { Question } from "@/types"

export const fallbackQuestions: Question[] = [
  // General Security Concepts (10)
  {
    id: "fb_001", type: "mcq", domain: "General Security Concepts",
    text: "Which security principle ensures that users are granted only the access necessary to perform their job functions?",
    answers: [
      { id: "a", text: "Separation of duties", isCorrect: false },
      { id: "b", text: "Least privilege", isCorrect: true },
      { id: "c", text: "Defense in depth", isCorrect: false },
      { id: "d", text: "Zero trust", isCorrect: false },
    ],
    explanation: "Least privilege ensures users have only the minimum permissions needed to perform their tasks, limiting potential damage from errors or misuse.",
  },
  {
    id: "fb_006", type: "mcq", domain: "General Security Concepts",
    text: "Which of the following is an example of multifactor authentication?",
    answers: [
      { id: "a", text: "Password and security question", isCorrect: false },
      { id: "b", text: "Password and SMS code", isCorrect: true },
      { id: "c", text: "Username and password", isCorrect: false },
      { id: "d", text: "Two security questions", isCorrect: false },
    ],
    explanation: "MFA requires factors from two or more categories: something you know (password), something you have (SMS code), or something you are (biometric).",
  },
  {
    id: "fb_011", type: "mcq", domain: "General Security Concepts",
    text: "What does the CIA triad represent in information security?",
    answers: [
      { id: "a", text: "Confidentiality, Integrity, Availability", isCorrect: true },
      { id: "b", text: "Control, Isolation, Authentication", isCorrect: false },
      { id: "c", text: "Certificate, Identity, Access", isCorrect: false },
      { id: "d", text: "Classification, Inspection, Authorization", isCorrect: false },
    ],
    explanation: "The CIA triad consists of Confidentiality (data privacy), Integrity (data accuracy), and Availability (data accessibility when needed).",
  },
  {
    id: "fb_012", type: "mcq", domain: "General Security Concepts",
    text: "Which access control model allows the data owner to decide who has access to files?",
    answers: [
      { id: "a", text: "Mandatory Access Control (MAC)", isCorrect: false },
      { id: "b", text: "Role-Based Access Control (RBAC)", isCorrect: false },
      { id: "c", text: "Discretionary Access Control (DAC)", isCorrect: true },
      { id: "d", text: "Attribute-Based Access Control (ABAC)", isCorrect: false },
    ],
    explanation: "DAC allows the owner of a resource to determine who can access it. MAC uses system-enforced labels, RBAC uses job roles, and ABAC uses attributes.",
  },
  {
    id: "fb_013", type: "mcq", domain: "General Security Concepts",
    text: "What is the primary purpose of non-repudiation?",
    answers: [
      { id: "a", text: "Preventing unauthorized access", isCorrect: false },
      { id: "b", text: "Ensuring data is not altered in transit", isCorrect: false },
      { id: "c", text: "Preventing a party from denying their actions", isCorrect: true },
      { id: "d", text: "Keeping data secret from unauthorized parties", isCorrect: false },
    ],
    explanation: "Non-repudiation ensures that a person or system cannot deny having performed an action, typically achieved through digital signatures and audit logs.",
  },
  {
    id: "fb_014", type: "mcq", domain: "General Security Concepts",
    text: "What type of control is a security awareness training program?",
    answers: [
      { id: "a", text: "Technical control", isCorrect: false },
      { id: "b", text: "Physical control", isCorrect: false },
      { id: "c", text: "Administrative control", isCorrect: true },
      { id: "d", text: "Detective control", isCorrect: false },
    ],
    explanation: "Administrative controls (managerial controls) include policies, procedures, and training that govern behavior. Security awareness training is a classic example.",
  },
  {
    id: "fb_015", type: "mcq", domain: "General Security Concepts",
    text: "Which of the following best describes the zero trust security model?",
    answers: [
      { id: "a", text: "Trust internal users, verify external users", isCorrect: false },
      { id: "b", text: "Never trust, always verify", isCorrect: true },
      { id: "c", text: "Trust based on IP address", isCorrect: false },
      { id: "d", text: "Trust everyone inside the network perimeter", isCorrect: false },
    ],
    explanation: "Zero trust assumes no user, device, or network is inherently trustworthy. Every access request must be authenticated and authorized regardless of origin.",
  },
  {
    id: "fb_016", type: "mcq", domain: "General Security Concepts",
    text: "What is the primary difference between identification and authentication?",
    answers: [
      { id: "a", text: "They are the same process", isCorrect: false },
      { id: "b", text: "Identification claims identity; authentication proves it", isCorrect: true },
      { id: "c", text: "Authentication comes before identification", isCorrect: false },
      { id: "d", text: "Identification requires biometrics", isCorrect: false },
    ],
    explanation: "Identification is claiming an identity (username). Authentication is proving that identity is genuine (password, biometric, token).",
  },
  {
    id: "fb_017", type: "mcq", domain: "General Security Concepts",
    text: "A mantrap at a building entrance is an example of which type of control?",
    answers: [
      { id: "a", text: "Technical", isCorrect: false },
      { id: "b", text: "Administrative", isCorrect: false },
      { id: "c", text: "Physical", isCorrect: true },
      { id: "d", text: "Corrective", isCorrect: false },
    ],
    explanation: "Physical security controls include barriers, locks, guards, biometric readers, and mantraps that physically restrict access to facilities.",
  },
  {
    id: "fb_018", type: "mcq", domain: "General Security Concepts",
    text: "What is the purpose of separation of duties?",
    answers: [
      { id: "a", text: "Ensuring no single person has complete control over a critical process", isCorrect: true },
      { id: "b", text: "Reducing the number of employees needed", isCorrect: false },
      { id: "c", text: "Increasing工作效率 by combining roles", isCorrect: false },
      { id: "d", text: "Eliminating the need for background checks", isCorrect: false },
    ],
    explanation: "Separation of duties divides critical functions among multiple people to prevent fraud and errors. No single person should have control over all phases of a sensitive process.",
  },

  // Threats, Vulnerabilities, and Mitigations (10)
  {
    id: "fb_002", type: "mcq", domain: "Threats, Vulnerabilities, and Mitigations",
    text: "An employee receives a fraudulent email appearing to be from the company's IT department requesting their password. This is an example of:",
    answers: [
      { id: "a", text: "Phishing", isCorrect: true },
      { id: "b", text: "Tailgating", isCorrect: false },
      { id: "c", text: "Shoulder surfing", isCorrect: false },
      { id: "d", text: "Impersonation", isCorrect: false },
    ],
    explanation: "Phishing is a social engineering attack where attackers send deceptive emails to trick recipients into revealing sensitive information.",
  },
  {
    id: "fb_007", type: "mcq", domain: "Threats, Vulnerabilities, and Mitigations",
    text: "Which type of malware is self-replicating and spreads without requiring user interaction?",
    answers: [
      { id: "a", text: "Trojan horse", isCorrect: false },
      { id: "b", text: "Ransomware", isCorrect: false },
      { id: "c", text: "Worm", isCorrect: true },
      { id: "d", text: "Spyware", isCorrect: false },
    ],
    explanation: "A worm is self-replicating malware that spreads automatically across networks by exploiting vulnerabilities without requiring user action.",
  },
  {
    id: "fb_019", type: "mcq", domain: "Threats, Vulnerabilities, and Mitigations",
    text: "A security analyst notices a server receiving a high volume of ICMP echo requests from multiple sources. This is likely:",
    answers: [
      { id: "a", text: "A ping sweep", isCorrect: false },
      { id: "b", text: "A Smurf attack", isCorrect: false },
      { id: "c", text: "A DDoS attack using ICMP flood", isCorrect: true },
      { id: "d", text: "Normal network traffic", isCorrect: false },
    ],
    explanation: "An ICMP flood DDoS attack overwhelms the target with ping requests from many sources, consuming bandwidth and processing resources.",
  },
  {
    id: "fb_020", type: "mcq", domain: "Threats, Vulnerabilities, and Mitigations",
    text: "What is the best defense against SQL injection attacks?",
    answers: [
      { id: "a", text: "Network firewall", isCorrect: false },
      { id: "b", text: "Parameterized queries", isCorrect: true },
      { id: "c", text: "Antivirus software", isCorrect: false },
      { id: "d", text: "Encryption of the database", isCorrect: false },
    ],
    explanation: "Parameterized queries (prepared statements) separate SQL code from user input, preventing attackers from injecting malicious SQL commands.",
  },
  {
    id: "fb_021", type: "mcq", domain: "Threats, Vulnerabilities, and Mitigations",
    text: "An attacker calls an employee pretending to be from the help desk and asks for their password. This is:",
    answers: [
      { id: "a", text: "Phishing", isCorrect: false },
      { id: "b", text: "Vishing", isCorrect: true },
      { id: "c", text: "Smishing", isCorrect: false },
      { id: "d", text: "Whaling", isCorrect: false },
    ],
    explanation: "Vishing (voice phishing) uses phone calls to trick victims into revealing sensitive information. Smishing uses SMS, phishing uses email.",
  },
  {
    id: "fb_022", type: "mcq", domain: "Threats, Vulnerabilities, and Mitigations",
    text: "Which vulnerability is most commonly associated with improper input validation in web applications?",
    answers: [
      { id: "a", text: "Buffer overflow", isCorrect: false },
      { id: "b", text: "Cross-site scripting (XSS)", isCorrect: true },
      { id: "c", text: "ARP poisoning", isCorrect: false },
      { id: "d", text: "DNS spoofing", isCorrect: false },
    ],
    explanation: "XSS occurs when user input is not properly validated and is rendered as code in a web page, allowing attackers to execute scripts in victims' browsers.",
  },
  {
    id: "fb_023", type: "mcq", domain: "Threats, Vulnerabilities, and Mitigations",
    text: "An attacker captures encrypted traffic and later uses it to gain unauthorized access. This is:",
    answers: [
      { id: "a", text: "Replay attack", isCorrect: true },
      { id: "b", text: "Man-in-the-middle attack", isCorrect: false },
      { id: "c", text: "Pass-the-hash attack", isCorrect: false },
      { id: "d", text: "Downgrade attack", isCorrect: false },
    ],
    explanation: "A replay attack captures valid data transmissions and retransmits them to trick the receiver into accepting unauthorized commands or access.",
  },
  {
    id: "fb_024", type: "mcq", domain: "Threats, Vulnerabilities, and Mitigations",
    text: "Which tool would be used to identify open ports on a network system?",
    answers: [
      { id: "a", text: "Vulnerability scanner", isCorrect: false },
      { id: "b", text: "Port scanner", isCorrect: true },
      { id: "c", text: "Packet analyzer", isCorrect: false },
      { id: "d", text: "SIEM", isCorrect: false },
    ],
    explanation: "A port scanner (like Nmap) probes systems to identify which ports are open, listening, and what services are running on them.",
  },
  {
    id: "fb_025", type: "mcq", domain: "Threats, Vulnerabilities, and Mitigations",
    text: "What is the primary difference between a vulnerability scan and a penetration test?",
    answers: [
      { id: "a", text: "A vulnerability scan is automated; a pen test actively exploits vulnerabilities", isCorrect: true },
      { id: "b", text: "They are identical processes", isCorrect: false },
      { id: "c", text: "A pen test is always automated", isCorrect: false },
      { id: "d", text: "A vulnerability scan requires more time", isCorrect: false },
    ],
    explanation: "Vulnerability scans are automated checks for known vulnerabilities. Penetration tests go further by actively attempting to exploit vulnerabilities to assess real-world impact.",
  },
  {
    id: "fb_026", type: "mcq", domain: "Threats, Vulnerabilities, and Mitigations",
    text: "An attacker uses a technique that sends fraudulent emails targeting senior executives. This is known as:",
    answers: [
      { id: "a", text: "Spear phishing", isCorrect: false },
      { id: "b", text: "Whaling", isCorrect: true },
      { id: "c", text: "Vishing", isCorrect: false },
      { id: "d", text: "Pharming", isCorrect: false },
    ],
    explanation: "Whaling specifically targets senior executives (the big fish). Spear phishing targets specific individuals, while whaling focuses on C-level executives.",
  },

  // Security Architecture (10)
  {
    id: "fb_003", type: "mcq", domain: "Security Architecture",
    text: "Which network security device monitors traffic and can actively block threats based on signatures and anomalies?",
    answers: [
      { id: "a", text: "IDS", isCorrect: false },
      { id: "b", text: "IPS", isCorrect: true },
      { id: "c", text: "Proxy server", isCorrect: false },
      { id: "d", text: "Load balancer", isCorrect: false },
    ],
    explanation: "An Intrusion Prevention System (IPS) is inline with traffic and can actively block malicious activity, unlike an IDS which only alerts.",
  },
  {
    id: "fb_008", type: "mcq", domain: "Security Architecture",
    text: "What is the primary purpose of network segmentation?",
    answers: [
      { id: "a", text: "Improving network speed", isCorrect: false },
      { id: "b", text: "Containing breaches and limiting lateral movement", isCorrect: true },
      { id: "c", text: "Reducing hardware costs", isCorrect: false },
      { id: "d", text: "Eliminating the need for firewalls", isCorrect: false },
    ],
    explanation: "Network segmentation divides a network into smaller segments, limiting an attacker's ability to move laterally if one segment is compromised.",
  },
  {
    id: "fb_027", type: "mcq", domain: "Security Architecture",
    text: "Which cloud service model gives the customer the MOST control over the underlying infrastructure?",
    answers: [
      { id: "a", text: "Software as a Service (SaaS)", isCorrect: false },
      { id: "b", text: "Platform as a Service (PaaS)", isCorrect: false },
      { id: "c", text: "Infrastructure as a Service (IaaS)", isCorrect: true },
      { id: "d", text: "Function as a Service (FaaS)", isCorrect: false },
    ],
    explanation: "IaaS provides virtualized computing resources where the customer manages OS, applications, and security while the provider manages the physical infrastructure.",
  },
  {
    id: "fb_028", type: "mcq", domain: "Security Architecture",
    text: "What is the primary security benefit of a VPN?",
    answers: [
      { id: "a", text: "Faster internet speeds", isCorrect: false },
      { id: "b", text: "Encrypted communication over public networks", isCorrect: true },
      { id: "c", text: "Replacing antivirus software", isCorrect: false },
      { id: "d", text: "Eliminating the need for firewalls", isCorrect: false },
    ],
    explanation: "A VPN (Virtual Private Network) creates an encrypted tunnel protecting data confidentiality and integrity as it traverses public networks like the internet.",
  },
  {
    id: "fb_029", type: "mcq", domain: "Security Architecture",
    text: "A company wants to place its public web server in a segmented network zone that isolates it from the internal network. This zone is called:",
    answers: [
      { id: "a", text: "VLAN", isCorrect: false },
      { id: "b", text: "DMZ", isCorrect: true },
      { id: "c", text: "VPN", isCorrect: false },
      { id: "d", text: "SAN", isCorrect: false },
    ],
    explanation: "A DMZ (Demilitarized Zone) is a network segment that sits between the internet and the internal network, hosting public-facing services while protecting internal resources.",
  },
  {
    id: "fb_030", type: "mcq", domain: "Security Architecture",
    text: "Which type of firewall operates at the application layer and can inspect packet payloads?",
    answers: [
      { id: "a", text: "Packet filter firewall", isCorrect: false },
      { id: "b", text: "Stateful firewall", isCorrect: false },
      { id: "c", text: "Next-generation firewall (NGFW)", isCorrect: true },
      { id: "d", text: "Stateless firewall", isCorrect: false },
    ],
    explanation: "NGFWs combine traditional firewall capabilities with application-level inspection, intrusion prevention, and threat intelligence to provide deep packet inspection.",
  },
  {
    id: "fb_031", type: "mcq", domain: "Security Architecture",
    text: "What is the purpose of a load balancer in a network architecture?",
    answers: [
      { id: "a", text: "Blocking malicious traffic", isCorrect: false },
      { id: "b", text: "Distributing traffic across multiple servers", isCorrect: true },
      { id: "c", text: "Encrypting all network traffic", isCorrect: false },
      { id: "d", text: "Monitoring for intrusions", isCorrect: false },
    ],
    explanation: "A load balancer distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed, improving availability and performance.",
  },
  {
    id: "fb_032", type: "mcq", domain: "Security Architecture",
    text: "Which of the following is a security concern specific to containerized environments?",
    answers: [
      { id: "a", text: "Physical theft of servers", isCorrect: false },
      { id: "b", text: "Kernel sharing between containers reduces isolation", isCorrect: true },
      { id: "c", text: "Containers cannot be patched", isCorrect: false },
      { id: "d", text: "Containers require dedicated hardware", isCorrect: false },
    ],
    explanation: "Containers share the host OS kernel, so a kernel exploit could potentially escape container isolation and affect other containers or the host system.",
  },
  {
    id: "fb_033", type: "mcq", domain: "Security Architecture",
    text: "What is the primary purpose of using a salt when hashing passwords?",
    answers: [
      { id: "a", text: "To make passwords stronger", isCorrect: false },
      { id: "b", text: "To prevent rainbow table attacks", isCorrect: true },
      { id: "c", text: "To speed up the hashing process", isCorrect: false },
      { id: "d", text: "To encrypt the password", isCorrect: false },
    ],
    explanation: "A salt is a random value added to each password before hashing, ensuring identical passwords produce different hashes and preventing precomputed rainbow table attacks.",
  },
  {
    id: "fb_034", type: "mcq", domain: "Security Architecture",
    text: "An organization wants to ensure it can recover IT systems within 4 hours of a disaster. This is defining the:",
    answers: [
      { id: "a", text: "Recovery Point Objective (RPO)", isCorrect: false },
      { id: "b", text: "Recovery Time Objective (RTO)", isCorrect: true },
      { id: "c", text: "Service Level Agreement (SLA)", isCorrect: false },
      { id: "d", text: "Annualized Loss Expectancy (ALE)", isCorrect: false },
    ],
    explanation: "RTO defines the maximum acceptable time to restore systems after a disruption. RPO defines the maximum acceptable data loss measured in time.",
  },

  // Security Operations (10)
  {
    id: "fb_004", type: "mcq", domain: "Security Operations",
    text: "What is the FIRST step in the incident response process according to NIST?",
    answers: [
      { id: "a", text: "Containment", isCorrect: false },
      { id: "b", text: "Eradication", isCorrect: false },
      { id: "c", text: "Preparation", isCorrect: true },
      { id: "d", text: "Recovery", isCorrect: false },
    ],
    explanation: "Preparation is the first phase, establishing policies, tools, and training before any incident occurs so the team is ready to respond effectively.",
  },
  {
    id: "fb_009", type: "mcq", domain: "Security Operations",
    text: "Which tool would a SOC analyst use to aggregate and correlate logs from multiple sources?",
    answers: [
      { id: "a", text: "Vulnerability scanner", isCorrect: false },
      { id: "b", text: "SIEM", isCorrect: true },
      { id: "c", text: "Port scanner", isCorrect: false },
      { id: "d", text: "Packet analyzer", isCorrect: false },
    ],
    explanation: "A Security Information and Event Management (SIEM) system collects, aggregates, and correlates log data from multiple sources to detect security incidents.",
  },
  {
    id: "fb_035", type: "mcq", domain: "Security Operations",
    text: "What is the purpose of a playbook in security operations?",
    answers: [
      { id: "a", text: "Documenting network topology", isCorrect: false },
      { id: "b", text: "Providing step-by-step incident response procedures", isCorrect: true },
      { id: "c", text: "Tracking employee vacation time", isCorrect: false },
      { id: "d", text: "Replacing the need for a SIEM", isCorrect: false },
    ],
    explanation: "A playbook documents standardized, repeatable procedures for responding to specific types of security incidents, ensuring consistent and efficient response.",
  },
  {
    id: "fb_036", type: "mcq", domain: "Security Operations",
    text: "A user receives an MFA push notification that they did not initiate. What should they do?",
    answers: [
      { id: "a", text: "Approve it to stop the notifications", isCorrect: false },
      { id: "b", text: "Deny it and report to the security team", isCorrect: true },
      { id: "c", text: "Ignore it", isCorrect: false },
      { id: "d", text: "Change their password after approving", isCorrect: false },
    ],
    explanation: "MFA fatigue attacks bombard users with push notifications hoping they'll approve. Users should always deny unsolicited requests and report them to security.",
  },
  {
    id: "fb_037", type: "mcq", domain: "Security Operations",
    text: "Which phase of incident response involves removing malware from affected systems?",
    answers: [
      { id: "a", text: "Containment", isCorrect: false },
      { id: "b", text: "Eradication", isCorrect: true },
      { id: "c", text: "Recovery", isCorrect: false },
      { id: "d", text: "Lessons learned", isCorrect: false },
    ],
    explanation: "Eradication removes the threat from affected systems (deleting malware, closing vulnerabilities). Containment isolates the threat first, recovery restores operations after.",
  },
  {
    id: "fb_038", type: "mcq", domain: "Security Operations",
    text: "What is the primary benefit of automated patch management?",
    answers: [
      { id: "a", text: "Eliminating all security vulnerabilities", isCorrect: false },
      { id: "b", text: "Reducing the window of vulnerability exposure", isCorrect: true },
      { id: "c", text: "Replacing antivirus software", isCorrect: false },
      { id: "d", text: "Increasing system complexity", isCorrect: false },
    ],
    explanation: "Automated patch management ensures patches are applied quickly and consistently across systems, minimizing the time systems remain vulnerable to known exploits.",
  },
  {
    id: "fb_039", type: "mcq", domain: "Security Operations",
    text: "Which of the following is a key function of a Data Loss Prevention (DLP) system?",
    answers: [
      { id: "a", text: "Preventing unauthorized data exfiltration", isCorrect: true },
      { id: "b", text: "Blocking all incoming email", isCorrect: false },
      { id: "c", text: "Replacing the need for encryption", isCorrect: false },
      { id: "d", text: "Scanning for network vulnerabilities", isCorrect: false },
    ],
    explanation: "DLP systems monitor, detect, and block unauthorized attempts to transfer sensitive data outside the organization, whether via email, USB, cloud uploads, or other channels.",
  },
  {
    id: "fb_040", type: "mcq", domain: "Security Operations",
    text: "A SOC analyst is reviewing an alert about a user logging in from an unusual geographic location. What type of analysis is this?",
    answers: [
      { id: "a", text: "Indicators of compromise (IOC) analysis", isCorrect: false },
      { id: "b", text: "User and Entity Behavior Analytics (UEBA)", isCorrect: true },
      { id: "c", text: "Malware analysis", isCorrect: false },
      { id: "d", text: "Forensic analysis", isCorrect: false },
    ],
    explanation: "UEBA uses machine learning to establish baseline behavior patterns and detect anomalies like unusual login locations, times, or access patterns that may indicate compromise.",
  },
  {
    id: "fb_041", type: "mcq", domain: "Security Operations",
    text: "What is the purpose of chain of custody in forensic investigations?",
    answers: [
      { id: "a", text: "Speeding up the investigation process", isCorrect: false },
      { id: "b", text: "Maintaining evidence integrity and admissibility in court", isCorrect: true },
      { id: "c", text: "Reducing storage requirements for evidence", isCorrect: false },
      { id: "d", text: "Automating evidence collection", isCorrect: false },
    ],
    explanation: "Chain of custody documents every person who handled evidence, when, and what changes were made. This ensures evidence is admissible and hasn't been tampered with.",
  },
  {
    id: "fb_042", type: "mcq", domain: "Security Operations",
    text: "Which type of log would contain information about failed login attempts?",
    answers: [
      { id: "a", text: "System log", isCorrect: false },
      { id: "b", text: "Security log", isCorrect: true },
      { id: "c", text: "Application log", isCorrect: false },
      { id: "d", text: "Audit log", isCorrect: false },
    ],
    explanation: "Security logs record authentication events including successful and failed login attempts, account changes, and security policy violations.",
  },

  // Security Program Management and Oversight (10)
  {
    id: "fb_005", type: "mcq", domain: "Security Program Management and Oversight",
    text: "A company purchases cyber insurance to cover potential losses from a data breach. This is an example of:",
    answers: [
      { id: "a", text: "Risk avoidance", isCorrect: false },
      { id: "b", text: "Risk acceptance", isCorrect: false },
      { id: "c", text: "Risk mitigation", isCorrect: false },
      { id: "d", text: "Risk transference", isCorrect: true },
    ],
    explanation: "Risk transference shifts the financial impact of a risk to a third party (insurance company) through purchasing an insurance policy.",
  },
  {
    id: "fb_010", type: "mcq", domain: "Security Program Management and Oversight",
    text: "Which regulation specifically protects the privacy of healthcare information in the United States?",
    answers: [
      { id: "a", text: "GDPR", isCorrect: false },
      { id: "b", text: "PCI DSS", isCorrect: false },
      { id: "c", text: "HIPAA", isCorrect: true },
      { id: "d", text: "SOX", isCorrect: false },
    ],
    explanation: "HIPAA (Health Insurance Portability and Accountability Act) sets standards for protecting sensitive patient health information from disclosure without consent.",
  },
  {
    id: "fb_043", type: "mcq", domain: "Security Program Management and Oversight",
    text: "Which risk response strategy involves eliminating the risk entirely by discontinuing the risky activity?",
    answers: [
      { id: "a", text: "Risk acceptance", isCorrect: false },
      { id: "b", text: "Risk avoidance", isCorrect: true },
      { id: "c", text: "Risk mitigation", isCorrect: false },
      { id: "d", text: "Risk transference", isCorrect: false },
    ],
    explanation: "Risk avoidance eliminates the risk by choosing not to engage in the risky activity. For example, deciding not to collect certain data to avoid privacy compliance risks.",
  },
  {
    id: "fb_044", type: "mcq", domain: "Security Program Management and Oversight",
    text: "In risk management, what is the formula for calculating risk?",
    answers: [
      { id: "a", text: "Risk = Asset × Threat", isCorrect: false },
      { id: "b", text: "Risk = Vulnerability × Impact", isCorrect: false },
      { id: "c", text: "Risk = Likelihood × Impact", isCorrect: true },
      { id: "d", text: "Risk = Threat × Vulnerability", isCorrect: false },
    ],
    explanation: "Risk is calculated as the likelihood (probability) of a threat exploiting a vulnerability multiplied by the impact (consequence) if it occurs.",
  },
  {
    id: "fb_045", type: "mcq", domain: "Security Program Management and Oversight",
    text: "What is the primary purpose of a Business Continuity Plan (BCP)?",
    answers: [
      { id: "a", text: "Restoring IT systems after a disaster", isCorrect: false },
      { id: "b", text: "Ensuring critical business functions continue during disruption", isCorrect: true },
      { id: "c", text: "Replacing all hardware annually", isCorrect: false },
      { id: "d", text: "Training employees on security policies", isCorrect: false },
    ],
    explanation: "A BCP focuses on maintaining critical business operations during and after disruption, while a Disaster Recovery Plan focuses specifically on IT restoration.",
  },
  {
    id: "fb_046", type: "mcq", domain: "Security Program Management and Oversight",
    text: "Which compliance framework applies to organizations that handle credit card information?",
    answers: [
      { id: "a", text: "HIPAA", isCorrect: false },
      { id: "b", text: "PCI DSS", isCorrect: true },
      { id: "c", text: "GDPR", isCorrect: false },
      { id: "d", text: "SOX", isCorrect: false },
    ],
    explanation: "PCI DSS (Payment Card Industry Data Security Standard) applies to any organization that stores, processes, or transmits credit card data.",
  },
  {
    id: "fb_047", type: "mcq", domain: "Security Program Management and Oversight",
    text: "What is the difference between a security policy and a standard?",
    answers: [
      { id: "a", text: "A policy is technical; a standard is managerial", isCorrect: false },
      { id: "b", text: "A policy is high-level intent; a standard has mandatory requirements", isCorrect: true },
      { id: "c", text: "Standards are optional; policies are mandatory", isCorrect: false },
      { id: "d", text: "They are interchangeable terms", isCorrect: false },
    ],
    explanation: "A policy states management's high-level intent. Standards provide specific mandatory requirements or rules that support and implement the policy.",
  },
  {
    id: "fb_048", type: "mcq", domain: "Security Program Management and Oversight",
    text: "What is the PRIMARY purpose of security awareness training?",
    answers: [
      { id: "a", text: "Eliminating all security incidents", isCorrect: false },
      { id: "b", text: "Reducing human error and improving security culture", isCorrect: true },
      { id: "c", text: "Replacing technical security controls", isCorrect: false },
      { id: "d", text: "Meeting regulatory requirements only", isCorrect: false },
    ],
    explanation: "Security awareness training reduces the risk of human error by educating employees about threats and secure behaviors. It's a critical administrative control.",
  },
  {
    id: "fb_049", type: "mcq", domain: "Security Program Management and Oversight",
    text: "Which type of audit is conducted by an external firm to verify compliance with regulations?",
    answers: [
      { id: "a", text: "Internal audit", isCorrect: false },
      { id: "b", text: "External audit", isCorrect: true },
      { id: "c", text: "Forensic audit", isCorrect: false },
      { id: "d", text: "Self-assessment", isCorrect: false },
    ],
    explanation: "External audits are conducted by independent third-party firms to objectively verify compliance with regulations, standards, or contractual requirements.",
  },
  {
    id: "fb_050", type: "mcq", domain: "Security Program Management and Oversight",
    text: "What is the primary goal of a third-party risk assessment?",
    answers: [
      { id: "a", text: "Reducing vendor costs", isCorrect: false },
      { id: "b", text: "Evaluating security risks posed by vendors and partners", isCorrect: true },
      { id: "c", text: "Replacing internal security controls", isCorrect: false },
      { id: "d", text: "Eliminating all vendor relationships", isCorrect: false },
    ],
    explanation: "Third-party risk assessments evaluate the security posture of vendors, suppliers, and partners to identify and mitigate risks from external relationships.",
  },
]

export function getFallbackQuestions(count: number, answeredIds: Set<string>): Question[] {
  const shuffled = [...fallbackQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length)).map(shuffleAnswers)
}

function shuffleAnswers(q: Question): Question {
  const ids = ["a", "b", "c", "d"]
  const correctAnswer = q.answers.find((a) => a.isCorrect)!
  const wrongAnswers = q.answers.filter((a) => !a.isCorrect)
  const all = [...wrongAnswers]
  const correctIdx = Math.floor(Math.random() * 4)
  all.splice(correctIdx, 0, correctAnswer)
  return {
    ...q,
    answers: all.map((a, i) => ({ id: ids[i], text: a.text, isCorrect: a.isCorrect })),
  }
}
