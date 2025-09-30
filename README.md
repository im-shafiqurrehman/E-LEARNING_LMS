# E-Learning LMS Platform - Case Study

## 🎓 Project Overview

**E-Learning LMS (Learning Management System)** is a comprehensive full-stack web application built with modern technologies to provide an interactive online learning experience. The platform supports real-time communication, secure payment processing, admin management capabilities, and a responsive design for both instructors and students.

## 🏗️ Project Architecture

```
E-Learning LMS
│
├── client/                 # Next.js Frontend Application
│   ├── app/               # App Router (Next.js 13+)
│   │   ├── components/    # Reusable React Components
│   │   ├── hooks/         # Custom React Hooks
│   │   ├── utils/         # Utility Functions
│   │   └── styles/        # Global Styles
│   ├── pages/             # API Routes & Legacy Pages
│   ├── public/            # Static Assets
│   └── redux/             # State Management
│       └── features/      # Redux Slices & APIs
│
├── server/                # Node.js Backend Application
│   ├── controllers/       # Route Controllers
│   ├── models/           # Database Models (MongoDB)
│   ├── routes/           # API Routes
│   ├── services/         # Business Logic Services
│   ├── utils/            # Utility Functions & Middleware
│   │   └── middleware/   # Custom Middleware
│   └── mails/            # Email Templates
│
└── diagrams/             # System Architecture Documentation
    ├── system-architecture.md
    ├── database-architecture.md
    └── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.1 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **Authentication**: NextAuth.js
- **UI Components**: Custom components with Tailwind
- **Icons**: React Icons
- **Forms**: Formik + Yup validation
- **Notifications**: React Hot Toast
- **Video Player**: Custom video player implementation

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT + Bcrypt
- **File Upload**: Cloudinary
- **Email**: Nodemailer with EJS templates
- **Payment**: Stripe
- **Real-time**: Socket.io
- **Security**: CORS, Rate Limiting, Helmet

### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: MongoDB Atlas
- **CDN**: Cloudinary
- **Version Control**: Git & GitHub

---

## 🎯 System Design

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Side"
        A[Next.js Frontend] --> B[Redux Store]
        A --> C[NextAuth.js]
        A --> D[Tailwind CSS]
        B --> E[RTK Query]
    end
    
    subgraph "Server Side"
        F[Express.js API] --> G[MongoDB]
        F --> H[Redis Cache]
        F --> I[Socket.io]
        F --> J[Cloudinary]
        F --> K[Stripe]
        F --> L[Nodemailer]
    end
    
    subgraph "External Services"
        M[MongoDB Atlas]
        N[Redis Cloud]
        O[Cloudinary CDN]
        P[Stripe Payments]
        Q[Email Service]
        R[Google OAuth]
        S[GitHub OAuth]
    end
    
    A <--> F
    G --> M
    H --> N
    J --> O
    K --> P
    L --> Q
    C --> R
    C --> S
```

### Request Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client (Next.js)
    participant A as API Gateway
    participant S as Server (Express)
    participant R as Redis
    participant DB as MongoDB
    participant E as External Services
    
    U->>C: User Action
    C->>A: HTTP Request
    A->>S: Forward Request
    S->>R: Check Cache
    alt Cache Hit
        R-->>S: Return Cached Data
    else Cache Miss
        S->>DB: Query Database
        DB-->>S: Return Data
        S->>R: Update Cache
    end
    S->>E: External API Calls (if needed)
    E-->>S: Response
    S-->>A: JSON Response
    A-->>C: Response
    C-->>U: Update UI
```

### Microservices Architecture

```mermaid
graph LR
    subgraph "Frontend Services"
        A[Authentication Service]
        B[Course Management]
        C[User Dashboard]
        D[Payment Interface]
        E[Admin Panel]
    end
    
    subgraph "Backend Services"
        F[Auth Controller]
        G[Course Controller]
        H[User Controller]
        I[Order Controller]
        J[Analytics Controller]
        K[Notification Controller]
    end
    
    subgraph "Data Layer"
        L[User Model]
        M[Course Model]
        N[Order Model]
        O[Notification Model]
        P[Layout Model]
    end
    
    A --> F
    B --> G
    C --> H
    D --> I
    E --> J
    
    F --> L
    G --> M
    H --> L
    I --> N
    J --> O
    K --> P
```

---

## 🗄️ Database Design (ERD)

### Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string avatar
        string role
        boolean isVerified
        array courses
        Date createdAt
        Date updatedAt
    }
    
    COURSE {
        ObjectId _id PK
        string name
        string description
        string price
        string estimatedPrice
        string thumbnail
        string tags
        string level
        string demoUrl
        array benefits
        array prerequisites
        array courseData
        number ratings
        number purchased
        ObjectId userId FK
        array reviews
        Date createdAt
        Date updatedAt
    }
    
    ORDER {
        ObjectId _id PK
        ObjectId courseId FK
        ObjectId userId FK
        object payment_info
        Date createdAt
        Date updatedAt
    }
    
    NOTIFICATION {
        ObjectId _id PK
        string title
        string message
        string status
        ObjectId userId FK
        Date createdAt
        Date updatedAt
    }
    
    LAYOUT {
        ObjectId _id PK
        string type
        object faq
        object categories
        object banner
        Date createdAt
        Date updatedAt
    }
    
    REVIEW {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId courseId FK
        number rating
        string comment
        array commentReplies
        Date createdAt
        Date updatedAt
    }
    
    USER ||--o{ COURSE : creates
    USER ||--o{ ORDER : places
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ REVIEW : writes
    COURSE ||--o{ ORDER : generates
    COURSE ||--o{ REVIEW : has
```

### Database Schema Details

#### User Model
```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: 'admin' | 'user';
  isVerified: boolean;
  courses: Array<{courseId: string}>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Course Model
```typescript
interface ICourse {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags: string;
  level: string;
  demoUrl: string;
  benefits: Array<{title: string}>;
  prerequisites: Array<{title: string}>;
  courseData: Array<{
    videoUrl: string;
    title: string;
    videoSection: string;
    description: string;
    videoLength: number;
    videoPlayer: string;
    links: Array<{title: string; url: string}>;
    suggestion: string;
    questions: Array<IComment>;
  }>;
  ratings: number;
  purchased: number;
  reviews: Array<IReview>;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## ✨ Key Features

### 🔐 User Management
- **User Registration & Login**: Email/password and social authentication
- **Profile Management**: Update profile information and avatar
- **Role-based Access Control**: Admin and regular user roles
- **Email Verification**: Secure account activation process

### 📚 Course Management
- **Course Creation**: Rich course creation with videos, descriptions, and resources
- **Course Categories**: Organized course categorization
- **Course Preview**: Demo videos and detailed course information
- **Course Progress Tracking**: Track learning progress and completion

### 💳 Payment System
- **Stripe Integration**: Secure payment processing
- **Multiple Payment Methods**: Credit cards, digital wallets
- **Order Management**: Complete order history and invoicing
- **Payment Verification**: Secure payment confirmation

### 👨‍💼 Admin Dashboard
- **User Management**: View and manage all users
- **Course Analytics**: Detailed course performance metrics
- **Order Analytics**: Sales and revenue tracking
- **Content Management**: Manage site content and settings

### 🎨 User Experience
- **Responsive Design**: Mobile-first responsive layout
- **Dark/Light Mode**: Theme switching capability
- **Real-time Notifications**: Live updates and notifications
- **Interactive UI**: Modern and intuitive user interface

### 🔧 Technical Features
- **Real-time Communication**: Socket.io for live features
- **Caching Strategy**: Redis for improved performance
- **File Upload**: Cloudinary integration for media management
- **Email System**: Automated email notifications
- **API Documentation**: Comprehensive API endpoints

---

## 🔒 Authentication System

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Server
    participant DB as Database
    participant R as Redis
    participant E as Email Service
    
    Note over U,E: Registration Flow
    U->>C: Register with email/password
    C->>S: POST /register
    S->>DB: Create user (unverified)
    S->>E: Send verification email
    S->>R: Store activation token
    S-->>C: Registration success
    
    Note over U,E: Email Verification
    U->>C: Click verification link
    C->>S: POST /activate-user
    S->>R: Validate token
    S->>DB: Mark user as verified
    S-->>C: Account activated
    
    Note over U,E: Login Flow
    U->>C: Login with credentials
    C->>S: POST /login
    S->>DB: Validate credentials
    S->>R: Store user session
    S-->>C: JWT tokens + user data
    C->>C: Store tokens in cookies
```

### JWT Token Strategy

- **Access Token**: Short-lived (5 minutes) for API requests
- **Refresh Token**: Long-lived (3 days) for token renewal
- **Secure Cookies**: HttpOnly, Secure, SameSite configuration
- **Token Rotation**: Automatic token refresh mechanism

### Social Authentication

- **Google OAuth**: Google account integration
- **GitHub OAuth**: GitHub account integration
- **Automatic Account Creation**: Seamless social login process

---

## 🌐 API Endpoints

### Authentication Endpoints
```
POST   /api/v1/register          # User registration
POST   /api/v1/activate-user     # Email verification
POST   /api/v1/login            # User login
POST   /api/v1/social-auth      # Social authentication
GET    /api/v1/logout           # User logout
GET    /api/v1/refresh          # Token refresh
GET    /api/v1/me               # Get user info
```

### User Management
```
PUT    /api/v1/update-user-info      # Update profile
PUT    /api/v1/update-user-password  # Change password
PUT    /api/v1/update-profile-picture # Update avatar
GET    /api/v1/get-users            # Get all users (Admin)
PUT    /api/v1/update-user          # Update user role (Admin)
DELETE /api/v1/delete-user/:id      # Delete user (Admin)
```

### Course Management
```
POST   /api/v1/create-course       # Create course (Admin)
PUT    /api/v1/edit-course/:id     # Edit course (Admin)
GET    /api/v1/get-course/:id      # Get single course
GET    /api/v1/get-courses         # Get all courses
GET    /api/v1/get-course-content/:id # Get course content (Enrolled)
PUT    /api/v1/add-question        # Add question to course
PUT    /api/v1/add-answer          # Answer question
PUT    /api/v1/add-review          # Add course review
PUT    /api/v1/add-reply           # Reply to review
DELETE /api/v1/delete-course/:id   # Delete course (Admin)
```

### Order Management
```
POST   /api/v1/create-order        # Create order
GET    /api/v1/get-orders          # Get all orders (Admin)
GET    /api/v1/payment/stripepublishablekey # Get Stripe key
POST   /api/v1/payment             # Process payment
```

### Analytics & Notifications
```
GET    /api/v1/get-users-analytics   # User analytics (Admin)
GET    /api/v1/get-courses-analytics # Course analytics (Admin)
GET    /api/v1/get-orders-analytics  # Order analytics (Admin)
GET    /api/v1/get-notifications     # Get notifications (Admin)
PUT    /api/v1/update-notification/:id # Update notification (Admin)
```

### Layout Management
```
POST   /api/v1/create-layout       # Create layout (Admin)
PUT    /api/v1/edit-layout         # Edit layout (Admin)
GET    /api/v1/get-layout/:type    # Get layout by type
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Redis instance
- Cloudinary account
- Stripe account

### 1. Clone the Repository
```bash
git clone https://github.com/im-shafiqurrehman/E-LEARNING_LMS.git
cd E-LEARNING_LMS
```

### 2. Install Dependencies

**Backend Setup:**
```bash
cd server
npm install
```

**Frontend Setup:**
```bash
cd client
npm install
```

### 3. Environment Configuration

Create `.env` files in both `server` and `client` directories:

**Server `.env`:**
```env
NODE_ENV=development
PORT=8000
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/lms
REDIS_URL=redis://localhost:6379

JWT_SECRET=your-jwt-secret
ACTIVATION_SECRET=your-activation-secret
ACCESS_TOKEN_EXPIRE=5
REFRESH_TOKEN_EXPIRE=3

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

VDOCIPHER_API_SECRET=your-vdocipher-secret
```

**Client `.env.local`:**
```env
NEXT_PUBLIC_SERVER_URI=http://localhost:8000/api/v1
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret

GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

### 4. Start Development Servers

**Start Backend:**
```bash
cd server
npm run dev
```

**Start Frontend:**
```bash
cd client
npm run dev
```

### 5. Build for Production

**Build Backend:**
```bash
cd server
npm run build
npm start
```

**Build Frontend:**
```bash
cd client
npm run build
npm start
```

---

## 🔧 Environment Variables

### Server Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `DB_URL` | MongoDB connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `ACTIVATION_SECRET` | Email activation secret | Yes |
| `ACCESS_TOKEN_EXPIRE` | Access token expiry (minutes) | Yes |
| `REFRESH_TOKEN_EXPIRE` | Refresh token expiry (days) | Yes |
| `SMTP_HOST` | Email SMTP host | Yes |
| `SMTP_PORT` | Email SMTP port | Yes |
| `SMTP_SERVICE` | Email service provider | Yes |
| `SMTP_MAIL` | Sender email address | Yes |
| `SMTP_PASSWORD` | Email password/app password | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `VDOCIPHER_API_SECRET` | VdoCipher API secret | Optional |

### Client Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SERVER_URI` | Backend API URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `GOOGLE_ID` | Google OAuth client ID | Optional |
| `GOOGLE_SECRET` | Google OAuth client secret | Optional |
| `GITHUB_ID` | GitHub OAuth client ID | Optional |
| `GITHUB_SECRET` | GitHub OAuth client secret | Optional |

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all client environment variables
3. **Build Settings**: 
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Deploy**: Automatic deployment on push to main branch

### Backend Deployment (Render)

1. **Create Web Service**: Connect your GitHub repository
2. **Build Settings**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. **Environment Variables**: Add all server environment variables
4. **Health Check**: Configure health check endpoint (`/test`)

### Database Deployment (MongoDB Atlas)

1. **Create Cluster**: Set up MongoDB Atlas cluster
2. **Network Access**: Configure IP whitelist (0.0.0.0/0 for cloud deployment)
3. **Database User**: Create database user with read/write permissions
4. **Connection String**: Use in `DB_URL` environment variable

### Redis Deployment (Redis Cloud)

1. **Create Database**: Set up Redis Cloud instance
2. **Connection Details**: Use connection string in `REDIS_URL`
3. **Security**: Configure authentication and SSL

---

## 🔐 Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password encryption
- **Rate Limiting**: Prevent brute force attacks
- **CORS Configuration**: Cross-origin request security
- **Cookie Security**: HttpOnly, Secure, SameSite cookies

### Data Protection
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Content Security Policy headers
- **HTTPS Enforcement**: SSL/TLS encryption
- **Environment Variables**: Sensitive data protection

### API Security
- **Authentication Middleware**: Protected route access
- **Role-based Authorization**: Admin/user permissions
- **Request Sanitization**: Clean malicious input
- **Error Handling**: Secure error responses
- **Audit Logging**: User action tracking

---

## ⚡ Performance Optimizations

### Frontend Optimizations
- **Next.js App Router**: Modern routing with better performance
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic code splitting for better load times
- **Static Generation**: Pre-rendered pages where possible
- **Caching Strategy**: Browser caching and CDN integration

### Backend Optimizations
- **Redis Caching**: Fast data retrieval with caching layer
- **Database Indexing**: Optimized MongoDB queries
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip compression for API responses
- **Load Balancing**: Horizontal scaling capability

### Database Optimizations
- **Query Optimization**: Efficient MongoDB queries
- **Indexing Strategy**: Proper database indexing
- **Aggregation Pipelines**: Complex data processing
- **Connection Management**: Optimized connection handling
- **Data Pagination**: Efficient large dataset handling

---

## 🔮 Future Enhancements

### Planned Features
- **Mobile Application**: React Native mobile app
- **Advanced Analytics**: ML-powered learning analytics
- **Live Streaming**: Real-time video streaming capabilities
- **Gamification**: Badges, points, and leaderboards
- **Multi-language Support**: Internationalization
- **Offline Learning**: Progressive Web App features
- **Advanced Search**: Elasticsearch integration
- **AI Recommendations**: Personalized course recommendations

### Technical Improvements
- **Microservices Architecture**: Service decomposition
- **GraphQL API**: Alternative to REST API
- **WebRTC Integration**: Peer-to-peer video calls
- **Advanced Caching**: Multi-layer caching strategy
- **Real-time Collaboration**: Collaborative learning features
- **Advanced Monitoring**: APM and logging improvements

---

## 🤝 Contributing

We welcome contributions to the E-Learning LMS platform! Here's how you can contribute:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Test your changes thoroughly

### Bug Reports
When reporting bugs, please include:
- Detailed description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots (if applicable)

### Feature Requests
For feature requests, please provide:
- Clear description of the feature
- Use case and benefits
- Implementation suggestions
- Mockups or examples (if applicable)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shafiq Ur Rehman**
- GitHub: [@im-shafiqurrehman](https://github.com/im-shafiqurrehman)
- LinkedIn: [Shafiq Ur Rehman](https://linkedin.com/in/im-shafiqurrehman)
- Email: shafiqurrehman@example.com

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **MongoDB** for the flexible NoSQL database
- **Redis** for high-performance caching
- **Stripe** for secure payment processing
- **Cloudinary** for media management
- **Vercel** for seamless deployment
- **Open Source Community** for continuous inspiration

---

## 📊 Project Statistics

- **Lines of Code**: ~15,000+
- **Components**: 50+
- **API Endpoints**: 30+
- **Database Models**: 5
- **Dependencies**: 100+
- **Development Time**: 3 months
- **Team Size**: 1 developer

---

## 🔗 Useful Links

- [Live Demo](https://e-learning-lms-frontend-theta.vercel.app)
- [API Documentation](https://lms-backend-24vm.onrender.com/api/v1)
- [GitHub Repository](https://github.com/im-shafiqurrehman/E-LEARNING_LMS)
- [System Architecture](./diagrams/system-architecture.md)
- [Database Architecture](./diagrams/database-architecture.md)

---

**Made with ❤️ by Shafiq Ur Rehman**