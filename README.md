# Banyan Claims Consultant Limited

A modern, technology-driven insurance claims management platform built with Next.js 16 and React 19.

## Technology Stack

- **Next.js**: 16.0.10
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Tailwind CSS**: 3.x
- **Node.js**: >= 20.9.0 (required)
- **npm**: >= 10.0.0

## Features

- User registration and authentication with OTP verification
- BVN (Bank Verification Number) validation and verification flow
- Submit and track insurance claims online
- Upload and manage required claim documents
- Real-time claim status tracking
- Settlement offer management (accept/reject offers)
- Additional information and document request handling
- Responsive, mobile-friendly design
- Contact and support options (phone, WhatsApp, email)
- Admin and user dashboard views
- Toast notifications for user feedback
- Built-in error handling and validation

## Getting Started

### Prerequisites

- Node.js >= 20.9.0
- npm >= 10.0.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/puresec-ng/banyan-design.git
cd banyan-design
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server (port 3001)
- `npm run lint` - Run ESLint (Note: Currently has known issue with Next.js 16, but linting works during build)

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable React components
│   ├── context/             # React context providers
│   ├── portal/              # Portal/dashboard pages
│   ├── services/            # API service functions
│   ├── submit-claim/        # Claim submission flow
│   ├── utils/               # Utility functions
│   └── ui/                  # UI components
├── public/                  # Static assets
└── ...
```

## Key Features Implementation

### Claim Management
- Multi-step claim submission process
- Document upload with validation
- Policy number validation (required, minimum 3 characters)
- Real-time claim tracking
- Status history visualization

### Offer Management
- Settlement offer viewing
- Offer acceptance/rejection
- Payment breakdown display
- Offer expiry handling

### Information Requests
- Document request handling
- Additional information requests
- Form field support (text, textarea, select, checkbox, etc.)
- File upload with type and size validation

## Build and Deployment

The project builds successfully with:
- Next.js 16.0.10
- React 19.2.3
- All dependencies compatible
- Zero security vulnerabilities
- All pages statically generated

### Build Output
- 26 pages generated
- All routes optimized
- Static content prerendered

## Configuration

### Node.js Version
The project requires Node.js >= 20.9.0. Version files are included:
- `.nvmrc` - For nvm/nodenv
- `.node-version` - For asdf/nodenv
- `package.json` engines field

### Next.js Configuration
- Image optimization configured
- API rewrites for backend integration
- Turbopack root directory configured

## Recent Updates

- Upgraded to Next.js 16.0.10 and React 19.2.3
- Fixed all ESLint errors and warnings
- Removed test/demo pages and unnecessary files
- Made Policy Number field required
- Improved action button conditional logic
- Enhanced status badge handling
- Updated browserslist database
- Fixed Turbopack configuration warnings

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - Learn about React
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn about Tailwind CSS

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

Private - Banyan Claims Consultant Limited
