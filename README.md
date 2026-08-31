# FBASU KPI Dashboard

A comprehensive React-based Key Performance Indicator (KPI) tracking dashboard for sales teams, featuring role-based access control and real-time performance monitoring.

## 🚀 Overview

The FBASU KPI Dashboard is designed to track and visualize performance metrics for different sales roles:

- **Phone Setters**: Track calls, conversations, appointments, and conversion rates
- **DM Setters**: Monitor direct message campaigns, response rates, and call bookings
- **Closers**: Manage discovery calls, offers, closes, and revenue metrics
- **Admins**: Oversee team performance, manage users, and track compliance

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Component Architecture](#component-architecture)
- [Role-Based Features](#role-based-features)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- **Role-Based Dashboard**: Customized views for each user role
- **End-of-Day (EOD) Forms**: Daily performance tracking forms
- **Team Goals Management**: Set and track monthly team and individual goals
- **Data Visualization**: Interactive charts and performance metrics
- **Compliance Tracking**: Monitor EOD form submission compliance
- **User Management**: Admin panel for managing team members
- **Export Functionality**: CSV export for all major data views

### Dashboard Features by Role

#### Phone Setters
- **Call Activity KPIs:**
  - Outbound Dials (total daily calls made)
  - Outbound Dial Response Rate (percentage of calls answered)
  - Replies/Answers (total calls that connected)
  - Meaningful Conversations (quality conversations that could lead to sets)
  - Meaningful Conversation Rate (percentage of dials that become meaningful conversations)

- **Set Performance KPIs:**
  - Total Sets (appointments scheduled)
  - Inbound Calls on Calendar (inbound leads scheduled)
  - Inbound Showed (inbound leads that attended)
  - Inbound Sets (appointments from inbound leads)
  - Outbound Sets (appointments from outbound calls)
  - Dial to Sets Ratio (percentage of dials that result in sets)
  - Sets on Closer Calendar Today (appointments scheduled for closers)
  - Sets Showed Up (appointments that attended)
  - Set Show Rate (percentage of sets that show up)
  - Set to Close Rate (percentage of sets that close)
  - Showed Up to Close Rate (percentage of showed appointments that close)

- **Revenue KPIs:**
  - Sets Closed (total deals closed)
  - New Cash Collected (immediate payments received)
  - Total Revenue (total deal value)
  - Average Appointment Value - Sets Scheduled (AAV for all scheduled sets)
  - Average Appointment Value - Sets Showed (AAV for sets that attended)

- **Performance Metrics:**
  - Call Outcomes (qualitative assessment of call results)
  - Performance Rating (1-10 self-assessment)
  - Areas for Improvement
  - Weekly/Monthly Projections
  - Support Needed

#### DM Setters
- **DM Activity KPIs:**
  - Outbound IG DMs Sent (direct messages sent on Instagram)
  - Outbound IG DMs Replied (responses received to outbound DMs)
  - DM Response Rate (percentage of DMs that get replies)
  - Inbound DMs (unsolicited messages received)
  - Quality Inbounds (high-potential inbound messages)
  - Inbound Comments (engagement on posts/content)
  - Follow-Ups (follow-up messages sent)

- **Conversion KPIs:**
  - Calls Proposed (number of times calls were suggested)
  - Links Sent (calendar/booking links shared)
  - Total Calls Booked (successful call bookings)
  - Reply to Call Rate (percentage of replies that book calls)
  - Sets Scheduled (appointments scheduled)
  - Sets Taken (appointments that occurred)
  - Call to Set Rate (percentage of calls that become sets)
  - Sets Closed (deals closed from DM-generated sets)

- **Revenue KPIs:**
  - Revenue Generated (total deal value from DM efforts)
  - Cash Collected (immediate payments from DM-generated deals)
  - Recurring Revenue (ongoing revenue from DM clients)

- **Productivity KPIs:**
  - Time Spent Messaging (hours dedicated to DM activities)
  - CRM Updated (completion of data entry tasks)
  - Reschedules Followed Up (follow-up on rescheduled appointments)
  - No-Shows Followed Up (follow-up on missed appointments)
  - Voice Notes Sent to Closer (communication with closing team)
  - Performance Rating (1-10 self-assessment)

#### Closers
- **Call Management KPIs:**
  - Discovery Calls Booked (initial sales calls scheduled)
  - Discovery Call No-Shows (scheduled calls that didn't attend)
  - Sent Back to Setter (leads returned to setters for re-qualification)
  - Discovery Calls Taken (actual calls conducted)
  - Rescheduled Discovery Calls (calls moved to different times)
  - Follow-Up Calls Taken (subsequent calls with prospects)

- **Sales Performance KPIs:**
  - Offers Made (formal proposals presented)
  - Re-Offers (follow-up offers after initial rejection)
  - Call to Offer Rate (percentage of calls that result in offers)
  - Projected to Close (deals expected to close)
  - Total Closes (deals successfully closed)
  - Offer to Close Rate (percentage of offers that result in sales)

- **Revenue KPIs:**
  - PIFs/Payment Plans/Deposits (different payment structures)
  - Cash Collected (immediate payments received)
  - Revenue Closed (total value of closed deals)
  - Average Revenue per Close (average deal size)

#### Admins
- **Team Performance KPIs:**
  - Total Team Revenue (combined revenue across all roles)
  - Total Team Sets (combined appointments across all setters)
  - Total Team Closes (combined deals across all closers)
  - Team Member Count (active users in system)
  - Overall Compliance Rate (percentage of EOD forms submitted on time)

- **Management KPIs:**
  - EOD Submission Compliance (daily form completion rates)
  - User Activity Levels (engagement with the system)
  - Goal Achievement Rates (percentage of team members meeting goals)
  - Performance Trends (week-over-week and month-over-month changes)

- **System KPIs:**
  - Total System Users (all registered users)
  - Active Users (users who submitted forms recently)
  - Data Quality Metrics (completeness of form submissions)
  - System Usage Statistics (login frequency, feature usage)

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Recharts** - Composable charting library
- **date-fns** - Modern JavaScript date utility library

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database with JSONB support
- **Row Level Security (RLS)** - Database-level security policies

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing with Autoprefixer
- **TypeScript Compiler** - Type checking and compilation

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── Chart.tsx                    # Reusable chart component
│   │   ├── MetricCard.tsx              # KPI metric display cards
│   │   └── RoleDashboardSelector.tsx   # Admin role switching
│   ├── Forms/
│   │   ├── PhoneSetterForm.tsx         # Phone setter EOD form
│   │   ├── CloserForm.tsx              # Closer EOD form
│   │   └── DMSetterForm.tsx            # DM setter EOD form
│   ├── Layout/
│   │   ├── Layout.tsx                  # Main layout wrapper
│   │   ├── Header.tsx                  # Top navigation header
│   │   └── Sidebar.tsx                 # Left navigation sidebar
│   └── TeamGoals/
│       ├── TeamGoalsSection.tsx        # Team goals overview
│       └── TeamGoalsModal.tsx          # Goal setting modal
├── context/
│   └── AuthContext.tsx                 # Authentication state management
├── lib/
│   └── supabase.ts                     # Database client and services
├── pages/
│   ├── admin/
│   │   ├── AllSubmissions.tsx          # View all EOD submissions
│   │   ├── EODCompliance.tsx           # Compliance tracking calendar
│   │   ├── Settings.tsx                # System settings
│   │   └── Users.tsx                   # User management
│   ├── Dashboard.tsx                   # Main dashboard
│   ├── Documentation.tsx               # User documentation
│   ├── EODForm.tsx                     # EOD form router
│   ├── Login.tsx                       # Authentication page
│   └── TeamGoals.tsx                   # Team goals page
├── types/
│   └── index.ts                        # TypeScript type definitions
├── utils/
│   └── mockData.ts                     # Mock data generation
├── App.tsx                             # Main app component with routing
├── index.css                           # Global styles and Tailwind imports
└── main.tsx                            # React app entry point
```

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for production)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fbasu-kpi-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:5173](http://localhost:5173) in your browser

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

### Supabase Setup

1. **Create a new Supabase project**
2. **Run database migrations**
   ```sql
   -- Run the migration files in supabase/migrations/
   -- This creates the users and eod_submissions tables
   ```
3. **Configure Row Level Security policies**
4. **Set up authentication providers** (if needed)

## 📖 Usage

### Demo Credentials

The application includes demo users for testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fbasu.com | demo123 |
| Closer | closer@fbasu.com | demo123 |
| DM Setter | dm@fbasu.com | demo123 |
| Phone Setter | phone@fbasu.com | demo123 |

### Basic Workflow

1. **Login** with appropriate role credentials
2. **View Dashboard** to see role-specific metrics
3. **Submit EOD Form** daily to track performance
4. **Set Team Goals** monthly for tracking progress
5. **Monitor Compliance** (admin) to ensure team participation

## 🔌 API Documentation

### Authentication Service

```typescript
// Login user
const { user, error } = await authService.signInWithEmail(email, password);

// Logout user
await authService.signOut();

// Get current user
const user = await authService.getCurrentUser();
```

### User Service

```typescript
// Get all users
const users = await userService.getAll();

// Get user by ID
const user = await userService.getById(userId);

// Create new user
const newUser = await userService.create({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'phone-setter'
});

// Update user
const updatedUser = await userService.update(userId, { name: 'Jane Doe' });

// Delete user
await userService.delete(userId);
```

### Submission Service

```typescript
// Get all submissions with filters
const submissions = await submissionService.getAll({
  userId: 'user-id',
  role: 'phone-setter',
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31'
});

// Get submission by user and date
const submission = await submissionService.getByUserAndDate(userId, date);

// Create or update submission
const submission = await submissionService.upsert({
  user_id: userId,
  submission_date: '2024-01-15',
  submission_type: 'phone-setter',
  data: { totalDials: 100, sets: 5 }
});
```

### Team Goals Service

```typescript
// Get all goals for a month
const goals = await teamGoalsService.getAll('2024-01');

// Get user goals
const userGoals = await teamGoalsService.getByUserId(userId, '2024-01');

// Create or update goal
const goal = await teamGoalsService.upsert({
  userId: userId,
  userName: 'John Doe',
  userRole: 'phone-setter',
  month: '2024-01',
  goalAmount: 50000,
  currentAmount: 25000
});
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'closer', 'dm-setter', 'phone-setter')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### EOD Submissions Table
```sql
CREATE TABLE eod_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_date date NOT NULL,
  submission_type text NOT NULL CHECK (submission_type IN ('phone-setter', 'dm-setter', 'closer')),
  data jsonb NOT NULL DEFAULT '{}',
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, submission_date)
);
```

## 🏗️ Component Architecture

### Layout System
- **Layout**: Main wrapper component
- **Header**: Top navigation with search and export
- **Sidebar**: Role-based navigation menu

### Dashboard System
- **Dashboard**: Main dashboard with role-specific views
- **MetricCard**: Reusable KPI display component
- **Chart**: Configurable chart component using Recharts
- **RoleDashboardSelector**: Admin role switching interface

### Form System
- **EODForm**: Router component for role-specific forms
- **PhoneSetterForm**: Comprehensive phone setter metrics form
- **CloserForm**: Closer performance tracking form
- **DMSetterForm**: DM setter campaign tracking form

### Authentication System
- **AuthContext**: Global authentication state management
- **Login**: Authentication interface with demo credentials

## 👥 Role-Based Features

### Phone Setter Features
- **Call Metrics**: Total dials, replies, meaningful conversations
- **Set Metrics**: Total sets, inbound/outbound breakdown, show rates
- **Revenue Tracking**: Closes, cash collected, revenue generated
- **Performance Analysis**: Call outcomes, ratings, improvement areas
- **Projections**: Weekly and monthly target setting

### DM Setter Features
- **Campaign Metrics**: Outbound DMs sent and replied
- **Engagement Tracking**: Inbound DMs, comments, quality leads
- **Conversion Metrics**: Calls proposed, links sent, bookings made
- **Performance Monitoring**: Time tracking, CRM updates, follow-ups
- **Revenue Attribution**: Sets closed, revenue, cash collected

### Closer Features
- **Call Management**: Discovery calls booked, taken, no-shows
- **Conversion Tracking**: Offers made, re-offers, closes
- **Revenue Metrics**: Cash collected, revenue closed, PIFs
- **Pipeline Management**: Projected closes, follow-ups

### Admin Features
- **User Management**: Create, edit, delete users and assign roles
- **Submission Oversight**: View all team submissions with filtering
- **Compliance Monitoring**: Calendar-based compliance tracking
- **System Configuration**: Settings management and preferences
- **Analytics**: Team performance overview and reporting

## 🔧 Development Guide

### Adding New Features

1. **Create Component**
   ```typescript
   // src/components/NewFeature/NewFeature.tsx
   import React from 'react';
   
   const NewFeature: React.FC = () => {
     return <div>New Feature</div>;
   };
   
   export default NewFeature;
   ```

2. **Add Route** (if needed)
   ```typescript
   // src/App.tsx
   import NewFeature from './components/NewFeature/NewFeature';
   
   // Add to routes
   <Route path="/new-feature" element={<NewFeature />} />
   ```

3. **Update Navigation** (if needed)
   ```typescript
   // src/components/Layout/Sidebar.tsx
   // Add to navigationItems array
   ```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the established color system (primary, secondary, accent)
- Maintain 8px spacing system
- Ensure responsive design with mobile-first approach
- Add hover states and micro-interactions

### State Management

- Use React Context for global state (authentication)
- Use local component state for UI state
- Use custom hooks for complex logic
- Follow the service pattern for data operations

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. **Connect repository** to your deployment platform
2. **Set environment variables** in platform settings
3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Deploy to Custom Server

1. **Build the application**
2. **Serve static files** from the `dist` directory
3. **Configure reverse proxy** (nginx/Apache) if needed
4. **Set up SSL certificate**

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Testing Strategy

- **Unit Tests**: Component logic and utilities
- **Integration Tests**: API interactions and data flow
- **E2E Tests**: Complete user workflows
- **Visual Tests**: Component rendering and styling

## 📊 Performance Considerations

### Optimization Techniques
- **Code Splitting**: Lazy load admin routes
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large data lists
- **Image Optimization**: Proper sizing and formats
- **Bundle Analysis**: Regular bundle size monitoring

### Monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **Error Tracking**: Comprehensive error logging
- **User Analytics**: Usage patterns and bottlenecks

## 🔒 Security

### Implemented Security Measures
- **Row Level Security (RLS)**: Database-level access control
- **Role-Based Access Control**: UI and API level restrictions
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Proper data sanitization

### Security Best Practices
- Regular dependency updates
- Environment variable protection
- HTTPS enforcement
- Content Security Policy headers

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Make changes** following coding standards
4. **Add tests** for new functionality
5. **Submit pull request** with detailed description

### Coding Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow configured linting rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check this README and inline documentation
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions

### Common Issues

1. **Supabase Connection**: Verify environment variables
2. **Build Errors**: Check Node.js version compatibility
3. **Authentication Issues**: Verify Supabase auth configuration
4. **Performance**: Monitor bundle size and optimize imports

## 🗺️ Roadmap

### Planned Features
- [ ] Real-time notifications
- [ ] Mobile app version
- [ ] Advanced analytics dashboard
- [ ] Integration with CRM systems
- [ ] Automated reporting
- [ ] Multi-language support

### Version History
- **v1.0.0**: Initial release with core features
- **v1.1.0**: Enhanced dashboard and mobile improvements
- **v1.2.0**: Advanced analytics and reporting

---

**Built with ❤️ for sales teams everywhere**