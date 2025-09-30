# E-Learning LMS - Complete System Design

## 🏗️ High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A1[Web Browser]
        A2[Mobile Browser]
        A3[Desktop App]
    end
    
    subgraph "Frontend - Next.js Application"
        B1[App Router]
        B2[Redux Store]
        B3[NextAuth.js]
        B4[Tailwind CSS]
        B5[Socket.io Client]
        B6[RTK Query]
    end
    
    subgraph "API Gateway & Load Balancer"
        C1[Nginx/Vercel Edge]
        C2[Rate Limiter]
        C3[CORS Handler]
    end
    
    subgraph "Backend - Express.js Server"
        D1[Express Router]
        D2[JWT Middleware]
        D3[Socket.io Server]
        D4[Multer Upload]
        D5[Error Handler]
    end
    
    subgraph "Business Logic Layer"
        E1[User Controller]
        E2[Course Controller]
        E3[Order Controller]
        E4[Analytics Controller]
        E5[Notification Controller]
        E6[Layout Controller]
    end
    
    subgraph "Data Access Layer"
        F1[User Service]
        F2[Course Service]
        F3[Order Service]
        F4[Email Service]
        F5[File Upload Service]
    end
    
    subgraph "Database Layer"
        G1[(MongoDB Atlas)]
        G2[(Redis Cache)]
    end
    
    subgraph "External Services"
        H1[Cloudinary CDN]
        H2[Stripe Payments]
        H3[Gmail SMTP]
        H4[Google OAuth]
        H5[GitHub OAuth]
        H6[VdoCipher]
    end
    
    subgraph "Monitoring & Analytics"
        I1[Vercel Analytics]
        I2[Render Logs]
        I3[Error Tracking]
    end
    
    A1 --> B1
    A2 --> B1
    A3 --> B1
    
    B1 --> C1
    B2 --> B6
    B3 --> H4
    B3 --> H5
    B5 --> D3
    B6 --> C1
    
    C1 --> D1
    C2 --> D1
    C3 --> D1
    
    D1 --> E1
    D1 --> E2
    D1 --> E3
    D1 --> E4
    D1 --> E5
    D1 --> E6
    
    E1 --> F1
    E2 --> F2
    E3 --> F3
    E4 --> F4
    E5 --> F5
    E6 --> F1
    
    F1 --> G1
    F1 --> G2
    F2 --> G1
    F2 --> G2
    F3 --> G1
    F4 --> H3
    F5 --> H1
    
    E3 --> H2
    F5 --> H6
    
    D1 --> I2
    B1 --> I1
    D5 --> I3
```

## 🔄 Data Flow Architecture

```mermaid
flowchart TD
    subgraph "User Interface Layer"
        A[User Action] --> B[React Component]
        B --> C[Redux Action]
    end
    
    subgraph "State Management"
        C --> D[RTK Query]
        D --> E[API Call]
    end
    
    subgraph "Network Layer"
        E --> F[HTTP Request]
        F --> G[API Gateway]
        G --> H[Express Router]
    end
    
    subgraph "Authentication Layer"
        H --> I{Authenticated?}
        I -->|No| J[Return 401]
        I -->|Yes| K[JWT Validation]
        K --> L[Extract User Info]
    end
    
    subgraph "Business Logic"
        L --> M[Controller Method]
        M --> N[Input Validation]
        N --> O[Business Rules]
        O --> P[Service Layer]
    end
    
    subgraph "Caching Layer"
        P --> Q{Check Redis Cache}
        Q -->|Hit| R[Return Cached Data]
        Q -->|Miss| S[Query Database]
    end
    
    subgraph "Data Persistence"
        S --> T[(MongoDB)]
        T --> U[Update Cache]
        U --> V[Return Data]
    end
    
    subgraph "Response Flow"
        R --> W[Format Response]
        V --> W
        W --> X[Send HTTP Response]
        X --> Y[Update Redux State]
        Y --> Z[Re-render UI]
    end
    
    J --> X
```

## 🔐 Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant A as API Gateway
    participant S as Server
    participant DB as Database
    participant R as Redis
    participant O as OAuth Provider
    participant E as Email Service
    
    Note over U,E: Registration Flow
    U->>C: Fill Registration Form
    C->>A: POST /register
    A->>S: Forward Request
    S->>S: Validate Input
    S->>DB: Create User (unverified)
    S->>E: Send Verification Email
    S->>R: Store Activation Token
    S-->>A: Success Response
    A-->>C: Registration Successful
    C-->>U: Show Success Message
    
    Note over U,E: Email Verification
    U->>C: Click Email Link
    C->>A: POST /activate-user
    A->>S: Forward Request
    S->>R: Validate Token
    S->>DB: Update User Status
    S->>R: Clear Token
    S-->>A: Account Activated
    A-->>C: Activation Success
    C-->>U: Redirect to Login
    
    Note over U,E: Login Flow
    U->>C: Enter Credentials
    C->>A: POST /login
    A->>S: Forward Request
    S->>DB: Validate Credentials
    S->>R: Store User Session
    S->>S: Generate JWT Tokens
    S-->>A: Tokens + User Data
    A-->>C: Set Secure Cookies
    C->>C: Update Redux State
    C-->>U: Redirect to Dashboard
    
    Note over U,E: OAuth Flow
    U->>C: Click OAuth Button
    C->>O: Redirect to Provider
    O-->>C: Authorization Code
    C->>A: POST /social-auth
    A->>S: Forward Request
    S->>DB: Create/Update User
    S->>R: Store Session
    S-->>A: Tokens + User Data
    A-->>C: Set Cookies
    C-->>U: Dashboard Access
```

## 🎯 Microservices Architecture

```mermaid
graph TB
    subgraph "Frontend Services"
        F1[Authentication Module]
        F2[Course Management Module]
        F3[User Dashboard Module]
        F4[Payment Module]
        F5[Admin Panel Module]
        F6[Profile Module]
    end
    
    subgraph "Backend Microservices"
        B1[User Service]
        B2[Course Service]
        B3[Order Service]
        B4[Notification Service]
        B5[Analytics Service]
        B6[Layout Service]
    end
    
    subgraph "Shared Services"
        S1[Authentication Service]
        S2[Email Service]
        S3[File Upload Service]
        S4[Payment Service]
        S5[Cache Service]
    end
    
    subgraph "Data Layer"
        D1[(User Database)]
        D2[(Course Database)]
        D3[(Order Database)]
        D4[(Analytics Database)]
        D5[(Session Cache)]
    end
    
    F1 --> B1
    F2 --> B2
    F3 --> B1
    F4 --> B3
    F5 --> B1
    F5 --> B2
    F5 --> B5
    F6 --> B1
    
    B1 --> S1
    B1 --> S2
    B2 --> S3
    B3 --> S4
    B4 --> S2
    
    B1 --> D1
    B2 --> D2
    B3 --> D3
    B5 --> D4
    
    S1 --> D5
    S5 --> D5
```

## 🗄️ Database Design & Relationships

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        object avatar
        string role
        boolean isVerified
        array courses
        date createdAt
        date updatedAt
    }
    
    COURSE {
        ObjectId _id PK
        string name
        string description
        number price
        number estimatedPrice
        object thumbnail
        string tags
        string level
        string demoUrl
        array benefits
        array prerequisites
        array courseData
        number ratings
        number purchased
        array reviews
        date createdAt
        date updatedAt
    }
    
    ORDER {
        ObjectId _id PK
        ObjectId courseId FK
        ObjectId userId FK
        object paymentInfo
        string status
        date createdAt
        date updatedAt
    }
    
    NOTIFICATION {
        ObjectId _id PK
        string title
        string message
        string status
        ObjectId userId FK
        date createdAt
        date updatedAt
    }
    
    LAYOUT {
        ObjectId _id PK
        string type
        object faq
        object categories
        object banner
        date createdAt
        date updatedAt
    }
    
    REVIEW {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId courseId FK
        number rating
        string comment
        array commentReplies
        date createdAt
        date updatedAt
    }
    
    COMMENT {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId courseId FK
        string question
        array questionReplies
        date createdAt
        date updatedAt
    }
    
    USER ||--o{ COURSE : "creates (admin)"
    USER ||--o{ ORDER : "places"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ REVIEW : "writes"
    USER ||--o{ COMMENT : "posts"
    COURSE ||--o{ ORDER : "generates"
    COURSE ||--o{ REVIEW : "has"
    COURSE ||--o{ COMMENT : "contains"
```

## 🌐 Network Architecture & CDN

```mermaid
graph TD
    subgraph "Global CDN Layer"
        A1[Cloudflare/Vercel Edge]
        A2[Static Assets Cache]
        A3[Image Optimization]
    end
    
    subgraph "Load Balancer"
        B1[Primary Load Balancer]
        B2[Health Check]
        B3[SSL Termination]
    end
    
    subgraph "Application Servers"
        C1[Server Instance 1]
        C2[Server Instance 2]
        C3[Server Instance N]
    end
    
    subgraph "Database Cluster"
        D1[MongoDB Primary]
        D2[MongoDB Secondary 1]
        D3[MongoDB Secondary 2]
        D4[Redis Master]
        D5[Redis Replica]
    end
    
    subgraph "External Services"
        E1[Cloudinary CDN]
        E2[Stripe API]
        E3[Email Service]
        E4[OAuth Providers]
    end
    
    A1 --> B1
    A2 --> B1
    A3 --> B1
    
    B1 --> C1
    B1 --> C2
    B1 --> C3
    
    C1 --> D1
    C2 --> D1
    C3 --> D1
    
    C1 --> D4
    C2 --> D4
    C3 --> D4
    
    D1 --> D2
    D1 --> D3
    D4 --> D5
    
    C1 --> E1
    C1 --> E2
    C1 --> E3
    C1 --> E4
```

## 🔧 Development & Deployment Pipeline

```mermaid
flowchart LR
    subgraph "Development"
        A1[Local Development]
        A2[Feature Branch]
        A3[Code Review]
    end
    
    subgraph "CI/CD Pipeline"
        B1[GitHub Actions]
        B2[Build & Test]
        B3[Security Scan]
        B4[Docker Build]
    end
    
    subgraph "Staging Environment"
        C1[Staging Deploy]
        C2[Integration Tests]
        C3[Performance Tests]
    end
    
    subgraph "Production Environment"
        D1[Production Deploy]
        D2[Health Checks]
        D3[Monitoring]
    end
    
    subgraph "Monitoring & Alerting"
        E1[Application Logs]
        E2[Performance Metrics]
        E3[Error Tracking]
        E4[Uptime Monitoring]
    end
    
    A1 --> A2
    A2 --> A3
    A3 --> B1
    
    B1 --> B2
    B2 --> B3
    B3 --> B4
    
    B4 --> C1
    C1 --> C2
    C2 --> C3
    
    C3 --> D1
    D1 --> D2
    D2 --> D3
    
    D3 --> E1
    D3 --> E2
    D3 --> E3
    D3 --> E4
```

## 📱 Mobile-First Architecture

```mermaid
graph TD
    subgraph "Client Devices"
        A1[Desktop Browser]
        A2[Tablet Browser]
        A3[Mobile Browser]
        A4[PWA App]
    end
    
    subgraph "Responsive Frontend"
        B1[Next.js App Router]
        B2[Tailwind CSS Grid]
        B3[Progressive Enhancement]
        B4[Service Worker]
    end
    
    subgraph "Adaptive Backend"
        C1[API Rate Limiting]
        C2[Response Compression]
        C3[Image Optimization]
        C4[Lazy Loading]
    end
    
    subgraph "Performance Optimization"
        D1[Code Splitting]
        D2[Bundle Optimization]
        D3[Caching Strategy]
        D4[Preloading]
    end
    
    A1 --> B1
    A2 --> B1
    A3 --> B1
    A4 --> B1
    
    B1 --> C1
    B2 --> C2
    B3 --> C3
    B4 --> C4
    
    C1 --> D1
    C2 --> D2
    C3 --> D3
    C4 --> D4
```

## 🛡️ Security Architecture

```mermaid
graph TB
    subgraph "Frontend Security"
        A1[Input Sanitization]
        A2[XSS Protection]
        A3[CSRF Protection]
        A4[Content Security Policy]
    end
    
    subgraph "Transport Security"
        B1[HTTPS/TLS 1.3]
        B2[Certificate Pinning]
        B3[HSTS Headers]
        B4[Secure Cookies]
    end
    
    subgraph "API Security"
        C1[JWT Authentication]
        C2[Rate Limiting]
        C3[Input Validation]
        C4[Output Encoding]
    end
    
    subgraph "Database Security"
        D1[Connection Encryption]
        D2[Access Control]
        D3[Query Sanitization]
        D4[Backup Encryption]
    end
    
    subgraph "Infrastructure Security"
        E1[Firewall Rules]
        E2[Network Segmentation]
        E3[Intrusion Detection]
        E4[Security Monitoring]
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> B3
    A4 --> B4
    
    B1 --> C1
    B2 --> C2
    B3 --> C3
    B4 --> C4
    
    C1 --> D1
    C2 --> D2
    C3 --> D3
    C4 --> D4
    
    D1 --> E1
    D2 --> E2
    D3 --> E3
    D4 --> E4
```

## 📊 Analytics & Monitoring Architecture

```mermaid
graph LR
    subgraph "Data Collection"
        A1[User Events]
        A2[System Metrics]
        A3[Error Logs]
        A4[Performance Data]
    end
    
    subgraph "Data Processing"
        B1[Event Streaming]
        B2[Data Aggregation]
        B3[Real-time Processing]
        B4[Batch Processing]
    end
    
    subgraph "Data Storage"
        C1[Time-series DB]
        C2[Analytics DB]
        C3[Log Storage]
        C4[Metrics Store]
    end
    
    subgraph "Visualization"
        D1[Real-time Dashboard]
        D2[Custom Reports]
        D3[Alert System]
        D4[Performance Insights]
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> B3
    A4 --> B4
    
    B1 --> C1
    B2 --> C2
    B3 --> C3
    B4 --> C4
    
    C1 --> D1
    C2 --> D2
    C3 --> D3
    C4 --> D4
```

## 🔄 Real-time Communication Architecture

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant C1 as Client 1
    participant S as Socket.io Server
    participant R as Redis Pub/Sub
    participant C2 as Client 2
    participant U2 as User 2
    
    Note over U1,U2: Real-time Notification System
    
    U1->>C1: Trigger Action (Question/Comment)
    C1->>S: Emit Event
    S->>R: Publish to Channel
    R->>S: Broadcast to Subscribers
    S->>C2: Emit to Connected Users
    C2->>U2: Display Notification
    
    Note over U1,U2: Live Updates
    
    S->>C1: Course Update Event
    S->>C2: Course Update Event
    C1->>U1: Update UI
    C2->>U2: Update UI
    
    Note over U1,U2: Connection Management
    
    C1->>S: Connect
    S->>S: Store User Session
    S->>R: Subscribe to User Channel
    
    C1->>S: Disconnect
    S->>S: Clean Up Session
    S->>R: Unsubscribe from Channel
```