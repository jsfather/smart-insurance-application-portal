# Smart Insurance Application Portal

A dynamic insurance application portal built with Next.js 14, featuring a multi-language interface, dynamic form generation, and real-time form validation.

## Features

- 🌐 Multi-language support (English & Persian)
- 🎨 Dark/Light theme
- 📝 Dynamic form generation
- 💾 Form draft auto-save
- 📱 Responsive design
- ✨ Real-time validation
- 📊 Submissions management

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18.17 or higher)
- npm (v9.6.7 or higher)
- Git

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-insurance-application-portal.git
   cd smart-insurance-application-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your configuration:
   ```
   NEXT_PUBLIC_API_URL=your_api_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## API Usage

### Dynamic Form API

The application expects the following API endpoints:

1. **Fetch Form Structure**
   ```typescript
   GET /api/insurance/forms
   Response: {
     formId: string;
     title: string;
     fields: FormField[];
   }[]
   ```

2. **Submit Form**
   ```typescript
   POST /api/insurance/submit
   Body: {
     formId: string;
     title: string;
     fields: {
       id: string;
       value: any;
       // ... other field properties
     }[];
   }
   ```

3. **Dynamic Options**
   ```typescript
   GET /api/insurance/options?dependsOn=fieldId
   Response: string[]
   ```

### Form Field Types

The form supports various field types:
- `text`: Text input
- `number`: Numeric input with validation
- `select`: Dropdown with static or dynamic options
- `radio`: Radio button group
- `checkbox`: Multiple selection
- `date`: Date picker
- `group`: Field grouping

Example field structure:
```typescript
{
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'group';
  required?: boolean;
  options?: string[];
  fields?: FormField[]; // For group type
  dynamicOptions?: {
    dependsOn: string;
    endpoint: string;
  };
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
```

## Assumptions

1. **Browser Support**
   - Modern browsers with localStorage support
   - JavaScript enabled
   - CSS Grid and Flexbox support

2. **API Requirements**
   - RESTful API endpoints available
   - JSON response format
   - Proper error handling with status codes
   - CORS enabled for development

3. **Form Data**
   - Form drafts are stored in browser's localStorage
   - Maximum form size compatible with localStorage limits
   - Form IDs are unique
   - Field IDs are unique within a form

4. **User Experience**
   - Users have stable internet connection
   - Screen width minimum of 320px
   - Maximum form submission size of 5MB

5. **Security**
   - API endpoints require proper authentication
   - Form data should not contain sensitive information
   - HTTPS required for production

## Project Structure

```
smart-insurance-application-portal/
├── app/
│   ├── [lang]/              # Language-specific routes
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   └── api/                 # API routes
├── public/                  # Static assets
└── types/                   # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
