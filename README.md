# React Email WYSIWYG Editor

A production-ready visual email builder that generates React Email code and HTML email templates.

![React Email Builder](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- 🎨 **Visual Email Builder** - Drag-and-drop interface for non-technical users
- 📧 **React Email Components** - Built on [@react-email/components](https://react.email)
- 🔄 **Dual Export** - Export as React Email JSX or production-ready HTML
- ✅ **Real-time Validation** - Check for accessibility and email client compatibility
- 🎯 **Agent-Friendly** - Built-in API for AI agents to programmatically edit emails
- 🎭 **Live Preview** - See changes instantly with preview/code toggle
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS

## Component Types

- **Heading** - H1-H4 with customizable size, color, and alignment
- **Text** - Paragraph text with formatting options
- **Button** - Call-to-action buttons with custom colors and links
- **Image** - Responsive images with alt text
- **Divider** - Horizontal rules with custom styling

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173)

## Build

```bash
pnpm build
```

## Deployment

### GitHub Pages

Deploy your email builder to GitHub Pages for free hosting.

**⚠️ IMPORTANT:** Before deploying, enable GitHub Pages:
1. Go to your repo on GitHub
2. **Settings** → **Pages**
3. Set **Source** to **"GitHub Actions"**
4. Then push your code

```bash
# Automatic deployment (recommended)
git push origin main  # GitHub Actions handles deployment

# Manual deployment
pnpm deploy
```

**Getting deployment errors?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting.

**Live Demo:** Once deployed, your app will be available at:
```
https://your-username.github.io/react-email-editor/
```

## Tech Stack

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **@react-email/components** - Email-optimized React components
- **lucide-react** - Beautiful icon library
- **nanoid** - Unique ID generation

## Project Structure

```
src/
├── components/        # React UI components
│   ├── Canvas.tsx           # Main email preview area
│   ├── ComponentPalette.tsx # Left sidebar with components
│   ├── PropertiesPanel.tsx  # Right sidebar for editing
│   ├── Header.tsx           # Top navigation bar
│   ├── CodeView.tsx         # Code preview mode
│   └── ValidationPanel.tsx  # Validation error display
├── lib/              # Utility functions
│   ├── codeGenerator.ts     # Generate React Email JSX
│   ├── htmlGenerator.ts     # Generate HTML emails
│   ├── validation.ts        # Email validation logic
│   ├── defaults.ts          # Default component props
│   ├── componentSelector.ts # Agent API utilities
│   └── reactEmailTypes.ts   # Type extraction from React Email
├── types/            # TypeScript definitions
│   └── index.ts
└── App.tsx           # Main application component
```

## Data Models & Internal State

### Component Data Structure

Every email component is represented by the `EmailComponent` type:

```typescript
interface EmailComponent {
  id: string;              // Unique identifier (nanoid)
  type: ComponentType;     // 'heading' | 'text' | 'button' | 'image' | 'divider'
  props: ComponentProps;   // Type-specific properties
}
```

### Component Props by Type

**Heading:**
```typescript
interface HeadingProps {
  text: string;           // Heading content
  as: 'h1' | 'h2' | 'h3' | 'h4'; // HTML tag
  align: 'left' | 'center' | 'right';
  color: string;          // Hex color
  fontSize: string;       // CSS value (e.g., '24px')
}
```

**Text:**
```typescript
interface TextProps {
  text: string;           // Paragraph content
  align: 'left' | 'center' | 'right';
  color: string;
  fontSize: string;
}
```

**Button:**
```typescript
interface ButtonProps {
  text: string;           // Button label
  href: string;           // Link URL
  bgColor: string;        // Background color
  textColor: string;      // Text color
  padding: string;        // CSS padding (e.g., '12px 24px')
}
```

**Image:**
```typescript
interface ImageProps {
  src: string;            // Image URL
  alt: string;            // Alt text for accessibility
  width: string;          // Width in pixels
}
```

**Divider:**
```typescript
interface DividerProps {
  borderColor: string;
  borderWidth: string;    // CSS value (e.g., '1px', '2px')
}
```

### Application State

The app uses React's `useState` for state management:

```typescript
// Core state
const [components, setComponents] = useState<EmailComponent[]>([]);
const [selectedId, setSelectedId] = useState<string | null>(null);
const [showCode, setShowCode] = useState(false);
const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
```

**State Flow:**
1. User clicks a component type → `addComponent(type)` → Creates new component with default props → Adds to `components` array
2. User clicks a component in canvas → `setSelectedId(id)` → Properties panel renders for that component
3. User edits properties → `updateComponent(id, newProps)` → Merges props and updates state
4. User deletes component → `deleteComponent(id)` → Filters out component from array

### Validation

Real-time validation runs on every state change:

```typescript
interface ValidationError {
  message: string;        // Human-readable error
  componentIndex: number; // Position in array (-1 for global errors)
}
```

## Agent API

This builder includes both **client-side** (DOM-based) and **server-side** (data-based) APIs for AI agents to interact with the email editor. See [AGENT_API.md](./AGENT_API.md) for detailed documentation.

### Client-Side (Browser)

DOM-based selector available globally as `window.ComponentSelector`:

```javascript
// Available globally as window.ComponentSelector
const firstHeading = ComponentSelector.getByType('heading')[0];
firstHeading?.click(); // Select the component

// Get all components
const allComponents = ComponentSelector.getAll();
console.log(`Email has ${allComponents.length} components`);
```

### Server-Side (Node.js, Workers, etc.)

Data-based selector that works without DOM access:

```typescript
import { ServerComponentSelector, ComponentQuery } from './lib/serverComponentSelector';

// Class-based API
const selector = new ServerComponentSelector(components);
const heading = selector.getById('abc123');
const allButtons = selector.getByType('button');
const textComponents = selector.findByText('Welcome');

// Functional API
const heading = ComponentQuery.getById(components, 'abc123');
const counts = ComponentQuery.countByType(components);
```

**Server-side features:**
- ✅ Works in Node.js, Deno, Bun, Web Workers
- ✅ No DOM dependencies
- ✅ Type-safe queries
- ✅ Search by text content or URLs
- ✅ Get metadata and statistics
- ✅ Functional or class-based API

### Data Attributes

Every component in the canvas has these data attributes for easy targeting:
- `data-component-id` - Unique identifier
- `data-component-type` - Component type (heading, text, button, etc.)
- `data-component-index` - Position in the email

## Type Safety

Component prop types are extracted directly from `@react-email/components` using TypeScript's `ComponentProps` utility:

```typescript
import { ComponentProps } from 'react';
import { Heading, Text, Button, Img, Hr } from '@react-email/components';

type ReactEmailHeadingProps = ComponentProps<typeof Heading>;
type ReactEmailTextProps = ComponentProps<typeof Text>;
// etc...
```

This ensures types stay in sync with the React Email library.

## Export Formats

### JSX Export
Generates a complete React Email component file with proper imports and styling.

### HTML Export
Generates production-ready HTML with:
- Table-based layout for email client compatibility
- Inline styles
- MSO conditionals for Outlook
- Proper DOCTYPE and meta tags
- Email-safe HTML structure

## Validation

Real-time validation checks for:
- ✅ Invalid button URLs
- ✅ Missing image alt text (accessibility)
- ✅ Overly long text blocks
- ✅ Empty emails

## License

MIT
