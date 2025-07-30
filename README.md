# Storyteller AI

A modern web application that leverages AI to generate and manage stories, built with Next.js, Supabase, and AI language models.

## 🚀 Features

- **AI-Powered Story Generation**: Create unique stories using advanced AI models
- **Story Management**: Save, edit, and organize your generated stories
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database & Auth**: Supabase
- **AI Integration**: Groq API, Anthropic (optional)
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account
- Groq API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/srinathwarriertech/storytellerai.git
   cd storytellerai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase and Groq API credentials

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# AI Services
GROQ_API_KEY=your-groq-api-key
```

## 🧩 Project Structure

```
src/
├── app/                  # Next.js 13+ app directory
│   ├── dashboard/        # Authenticated user dashboard
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── api/              # API routes
├── components/           # Reusable UI components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── ai/               # AI service configurations
│   └── supabase/         # Supabase client setup
└── types/                # TypeScript type definitions
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for authentication and database
- [Groq](https://groq.com/) for high-performance AI inference

---

Made with ❤️ by Project Lumos

Project Lumos is an Intitiative driven by Srinath Warrier to help a few ineterested people learn to build real-world AI Projects.

[Srinath Warrier Tech](https://srinathwarrier.com) | [GitHub](https://github.com/srinathwarriertech)