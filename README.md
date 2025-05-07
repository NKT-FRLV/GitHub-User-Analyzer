# WONDER - GitHub User Analyzer

WONDER is a Next.js application designed to help HR managers and tech recruiters discover, analyze, and manage potential developer candidates based on their GitHub profiles.

## 🚀 Key Features

- **GitHub Developer Search**: Find developers by username and explore their profiles
- **AI-Powered Analysis**: Get intelligent insights about developers' code quality, skills, and expertise
- **Repository Deep Dive**: Analyze individual repositories with AI feedback on code patterns and architecture
- **Authentication System**: Register and log in to access premium features
- **Candidate Management**: Save favorite candidates to your personal dashboard for later review
- **Comparison Tools**: Compare multiple candidates side by side to make better hiring decisions

## 💻 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Material UI 6
- **Backend**: Next.js API Routes with Server Components and Server Actions
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens) using jose library
- **APIs**: GitHub API, OpenAI API for code analysis

## 🔧 Setup and Installation

### Prerequisites

- Node.js 18+ and npm
- Supabase account with PostgreSQL database
- GitHub API access token
- (Optional) OpenAI API access token for enhanced code analysis

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/username/wonder.git
cd wonder
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in a `.env` file:

```
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://user:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://user:password@aws-0-region.supabase.com:5432/postgres"

# GitHub API
GITHUB_API_TOKEN=your_github_token
NEXT_PUBLIC_GITHUB_API_TOKEN=your_github_token

# Admin credentials
ADMIN_PASSWORD=your_admin_password
ADMIN_EMAIL=your_admin_email

# JWT secrets
JWT_SECRET=your_jwt_secret_at_least_32_chars
REFRESH_SECRET=your_refresh_secret_at_least_32_chars

# OpenAI (optional)
OPENAI_API_KEY=your_openai_api_key
```

4. Initialize the database and run migrations:

```bash
npx prisma migrate reset -f
```

5. Seed the database with initial data:

```bash
npm run prisma:seed
```

6. Run the application in development mode:

```bash
npm run dev
```

The application will be available at: http://localhost:3000

## 📁 Project Structure

- `app/` - Application source code (Next.js App Router)
  - `api/` - API routes and backend utilities
  - `components/` - React components
  - `context/` - Application context for global state
  - `lib/` - Libraries and utilities
  - `types/` - TypeScript types
- `prisma/` - Database schema and migrations
- `public/` - Static files

## 🔑 Core Functionality

### Authentication

The application implements JWT authentication with access and refresh tokens. Tokens are stored in HTTP-only cookies for security.

- `/auth/register` - Register a new user
- `/auth/login` - Log in to the system
- `/auth/logout` - Log out of the system

### Candidate Management

- `/candidates` - Page with a list of saved candidates
- `/api/candidates` - API for saving and removing candidates

### Developer Analysis

- AI-powered insights highlight key strengths and areas for improvement
- Language proficiency detection across all repositories
- Code quality assessment based on repository structure and patterns
- Contribution history analysis to understand consistency and work habits

### Repository Exploration

- Detailed repository analysis with AI feedback
- Code architecture evaluation
- Best practices assessment
- Performance optimization suggestions

## 🌟 Why WONDER?

WONDER transforms the technical recruitment process by providing HR managers and recruiters with powerful tools to evaluate developers beyond just their resume. By leveraging GitHub data and AI analysis, you can:

- Make more informed hiring decisions based on actual code and contributions
- Reduce the time spent manually reviewing candidates' code repositories
- Build and maintain a database of promising developers for current and future positions
- Compare candidates objectively using standardized metrics

## 🚧 Development Status

This project is currently under active development. New features and improvements are being added regularly.

