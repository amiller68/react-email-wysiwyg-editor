# React Email WYSIWYG Editor

A **proof-of-concept** email builder demonstrating how AI agents can **stream JSX** to build emails in real-time. Includes a visual editor UI and exports to React Email JSX or production-ready HTML.

**Main Purpose:** Reference implementation showing streaming JSX API pattern for AI agents (no DOM clicking or JSON manipulation).

![React Email Builder](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Key Features

**Agent API (Primary Focus):**
- 🎯 **Streaming JSX API** - AI agents stream JSX token-by-token to build/edit emails
- 🔄 **Node-Level Targeting** - Replace specific components by ID without regenerating entire email
- 🤖 **Interactive Demo** - Simulator showing streaming JSX in action (2 modes: whole email + node replacement)
- 📡 **LLM Integration Ready** - StreamingJSXHandler works with OpenAI, Anthropic, or any streaming LLM

**Email Builder UI (Demo Application):**
- 🎨 **Visual Editor** - Component palette, drag-and-drop interface for building emails
- 📧 **React Email Components** - Built on [@react-email/components](https://react.email)
- 🔄 **Dual Export** - Export as React Email JSX or production-ready HTML
- ✅ **Real-time Validation** - Check for accessibility and email client compatibility
- 🎭 **Live Preview** - Toggle between preview and code view

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
│   ├── streamingJSXParser.ts # Streaming JSX parser for agents
│   ├── jsxParser.ts          # JSX parsing and generation
│   ├── agentAPI.ts           # Agent-friendly API wrapper
│   ├── codeGenerator.ts      # Generate React Email JSX
│   ├── htmlGenerator.ts      # Generate HTML emails
│   ├── validation.ts         # Email validation logic
│   ├── defaults.ts           # Default component props
│   ├── templates.ts          # Email templates
│   └── reactEmailTypes.ts    # Type extraction from React Email
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

This builder includes a **JSX-based API** designed specifically for AI agents. Instead of manipulating JSON, agents can write natural React/JSX markup!

### Streaming JSX Demo

Click the **"Agent Demo"** button in the header to see a **simulation** of real-time JSX streaming! This hardcoded demo shows how an agent COULD manipulate the editor by streaming JSX token-by-token. The demo is not using actual AI - it demonstrates the concept of incremental parsing and rendering that would work with real LLM streaming.

**Two demo modes:**
- **Stream Whole Email**: Agent creates entire email from scratch
- **Replace Node**: Agent targets a specific component by ID and replaces just that component

### Streaming JSX API (For LLM Integration)

Built for AI agents to **stream JSX** token-by-token, rendering emails in real-time:

```typescript
import { StreamingJSXHandler } from './lib/streamingJSXParser';

const handler = new StreamingJSXHandler((components) => {
  updateEmail(components); // Updates as components are parsed
});

// Stream JSX from your LLM:
handler.handleChunk('<Heading as="h1">');
handler.handleChunk('Welcome');
handler.handleChunk('</Heading>');
// → Heading appears immediately!

handler.handleChunk('<Text>Thank you</Text>');
// → Text appears!

handler.handleComplete(); // Finalize
```

**Why Streaming JSX?**
- ✅ Stream like regular text (ChatGPT-style)
- ✅ Real-time rendering as tokens arrive
- ✅ Natural for LLMs (trained on React/JSX)
- ✅ No DOM clicking or JSON manipulation needed
- ✅ Works with OpenAI, Anthropic, or any streaming LLM

See [AGENT_JSX_API.md](./AGENT_JSX_API.md) for integration examples with OpenAI and Anthropic.

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
