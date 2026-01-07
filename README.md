🤖 Gemini-Powered Research Assistant
A smart NestJS application that intelligently fetches academic references using Gemini AI + CrossRef and delivers them via Brevo SMTP!

🧠 The Smart Flow
text
User Request → Gemini AI Analysis → { If relevant → AI response }
                                           ↓
                                   { If not relevant }
                                           ↓
                                   CrossRef API Search
                                           ↓
                                   Email via Brevo SMTP
✨ Key Innovation
Unlike the C# version [what-is](https://github.com/OwenLovesCoding/what-is), this app adds AI intelligence:

Gemini AI first analyzes if the query deserves an AI response

Smart fallback to CrossRef when AI isn't appropriate

Dual-path delivery (AI insights OR traditional references)

🛠️ Tech Stack
NestJS with TypeScript

Gemini API (Google AI) for intelligent responses

CrossRef API for academic references

Brevo SMTP for email delivery

Postman for API testing

Class Validators for request validation

🔧 Smart Features
AI Threshold Logic: Determines when to use Gemini vs CrossRef

Email Templating: Different formats for AI vs academic responses

Rate Limiting: Prevents API abuse

Error Handling: Graceful fallbacks for failed APIs

Request Validation: Ensures clean, valid inputs

🎯 Why This Rocks
Dual Intelligence: AI + Traditional academic search

Smart Routing: Automatically chooses best source

Beautiful Emails: Formatted results with citations

Scalable: Built on NestJS enterprise architecture

Developer Friendly: Full TypeScript support

Perfect for: Students | Researchers | Curious Minds | AI Enthusiasts
