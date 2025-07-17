# TrustLoop - Shopify Reviews & UGC Management App

A comprehensive Shopify embedded app for managing product reviews, user-generated content, Q&A, and automated email campaigns with AI-powered moderation, advanced analytics, multi-widget system, and conversion optimization features.

## 🚀 Quick Start

### Demo Mode
For testing and demonstration purposes, you can use the app immediately with demo credentials:

1. Navigate to the "Store Setup" page
2. Use these demo credentials:
   - **Shop Domain**: `demo-store.myshopify.com`
   - **Access Token**: `demo_token`

### Real Shopify Integration

To connect a real Shopify store:

1. Go to your Shopify admin
2. Navigate to Settings → Apps and sales channels → Develop apps
3. Create a private app named "TrustLoop Integration"
4. Configure Admin API access with these scopes:
   - `read_products`
   - `read_orders`
   - `read_customers`
   - `read_themes`
   - `write_script_tags`
5. Install the app and copy the access token
6. Use your real shop domain and access token in the onboarding flow

## 📱 Features

### ✅ Completed
- **Shopify Integration**: Complete onboarding flow with authentication
- **Store Connection Management**: Real-time connection status and testing
- **Dashboard**: Overview with connection-aware stats and metrics
- **Navigation**: Full app navigation with responsive design
- **UI Components**: Complete ShadCN UI component library
- **Mock API**: Shopify API simulation for testing

### 🚧 In Progress
- Reviews Management System
- Q&A Engine
- Email Campaign Builder
- Widget Customization
- AI-Powered Moderation
- Analytics Dashboard
- Settings Management

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: ShadCN UI + Tailwind CSS
- **Shopify Integration**: @shopify/app-bridge + @shopify/polaris
- **State Management**: React Hooks + Local Storage
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🏗 Architecture

```
src/
├── components/
│   ├── layout/           # App layout and navigation
│   ├── onboarding/       # Store connection wizard
│   ├── store/           # Store management components
│   └── ui/              # ShadCN UI components
├── contexts/            # React contexts (Shopify)
├── hooks/               # Custom React hooks
├── pages/               # Route components
├── services/            # API services and utilities
└── lib/                 # Utility functions
```

## 🚀 Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## 🔧 Configuration

### Environment Variables
For production deployment, configure these environment variables:

```env
VITE_SHOPIFY_API_KEY=your_shopify_api_key
VITE_SHOPIFY_APP_URL=your_app_url
```

### Shopify App Configuration
1. Create a Shopify Partner account
2. Create a new app in the Partner Dashboard
3. Configure the app URL to point to your deployed application
4. Set up required scopes and permissions
5. Configure webhooks for data synchronization

## 📊 Current Status

The app is currently in **Beta** with core Shopify integration completed. The onboarding flow allows users to:

1. ✅ Connect their Shopify store
2. ✅ Test API connectivity
3. ✅ View connection status
4. ✅ Manage store permissions
5. ⏳ Access full feature set (coming soon)

## 🎯 Next Steps

1. **Reviews System**: Complete CRUD operations for review management
2. **Email Campaigns**: Build automated email flow system
3. **Widget Builder**: Create customizable review widgets
4. **AI Moderation**: Implement content moderation pipeline
5. **Analytics**: Add comprehensive reporting dashboard
6. **Production Deployment**: Set up hosting and CI/CD

## 🐛 Known Issues

- Mock API data for demonstration purposes
- Limited error handling for edge cases
- No persistent data storage yet

## 📞 Support

For questions or issues, please check the demo functionality using the provided demo credentials first. The app includes comprehensive onboarding and help documentation.

---

**Built with ❤️ for Shopify merchants looking to boost conversions through social proof and customer engagement.**