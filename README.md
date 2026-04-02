# Finance Dashboard

A clean, modern, and interactive **Finance Dashboard** built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

This dashboard helps users track their income, expenses, and spending patterns with an intuitive interface and role-based viewing experience.

![Finance Dashboard Preview]([(https://finance-dashboard-green-gamma.vercel.app/]))

##  Features

### Core Features
- Dashboard Overview – Total Balance, Income, and Expenses summary cards
- Balance Trend Chart – Interactive area chart showing running balance over time (using Recharts)
- Spending Breakdown – Visual insights into expenses by category
- Transactions Management – View, add, edit, and delete transactions
- Filtering & Search – Filter by type, category, search by description, and sort transactions
- Insights Section – Smart insights including:
  - Highest spending category
  - Monthly spending comparison
  - Savings rate
  - Most frequent expense category

### Role-Based UI
- Admin Role: Can add, edit, and delete transactions
- Viewer Role: Read-only access (can only view data)
- Easy role switching via dropdown for demonstration

### Additional Features
- Fully responsive design (mobile + desktop)
- Dark mode support
- Data persistence using localStorage
- Empty state handling
- Clean and modern UI with smooth interactions
- Form validation for transaction entry

## Tech Used

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Charts: Recharts
- State Management: React Context + useReducer pattern
- UI Components: shadcn/ui + Radix UI
- Icons: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

Clone the repository:
git clone [[https://github.com/yourusername/finance-dashboard.git](https://github.com/sadik117/finance-dashboard/tree/main)]
cd finance-dashboard

Install dependencies:
npm install

Run the development server:
npm run dev

Open http://localhost:3000 in your browser.

# Project Structure

├── app/                    # Next.js App Router
├── components/
│   ├── dashboard/         # Main dashboard components
│   ├── ui/                # Reusable shadcn/ui components
│  
├── context/               # Finance Context Provider
├── hooks/                 # Custom hooks (useFinance, useIsMobile, etc.)
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions and constants and mock/initial data


# How to Use:

Switch Roles: Use the role selector in the header to toggle between Admin and Viewer mode.
Add Transaction: Click the "Add Transaction" button (Admin only).
Edit/Delete: Use action buttons on each transaction row (Admin only).
Filter Data: Use the search bar and filter dropdowns in the Transactions section.
View Insights: Check the Insights panel for smart financial observations.

# Design Decisions:

Used Context API for global state management (lightweight and sufficient for this scale).
Implemented memoization (useMemo, useCallback) for performance optimization.
Followed component composition and separation of concerns.
Prioritized accessibility and clean code structure.
Used key prop strategy for reliable form reset in modals.
