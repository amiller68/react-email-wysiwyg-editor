# Agent JSX API - Streaming-First Email Builder

This document shows how AI agents can **stream JSX/React markup** to build emails in real-time. No DOM clicking, no JSON manipulation - just pure JSX streaming!

## The Core Concept: Streaming JSX

Agents generate JSX **token by token** (just like ChatGPT streams text), and the email builder renders components **in real-time** as complete elements are parsed.

```
Agent streams:  <Heading as="h1">Wel█
Email shows:    (nothing yet, incomplete)

Agent streams:  <Heading as="h1">Welcome</Heading>█
Email shows:    ✓ Heading component rendered!

Agent streams:  <Text>Thank you for█
Email shows:    (waiting for closing tag)

Agent streams:  <Text>Thank you for signing up</Text>█
Email shows:    ✓ Text component rendered!
```

## Why Streaming JSX?

**❌ What we DON'T want:**
- DOM clicking/manipulation (brittle, slow)
- JSON manipulation (syntax errors, unnatural for LLMs)
- Batch updates (no real-time feedback)

**✅ What we DO want:**
- Stream JSX like regular text generation
- Real-time rendering as tokens arrive
- Natural for LLMs (trained on React/JSX)
- Fault-tolerant partial parsing
- No special escaping or formatting needed

## Quick Start: Streaming Integration

### Server-Side: Integrating with Your LLM

```typescript
import { StreamingJSXHandler } from './lib/streamingJSXParser';

// Create a handler with callback
const handler = new StreamingJSXHandler((components) => {
  // This fires whenever complete components are parsed
  updateEmail(components);
});

// As you receive chunks from your LLM streaming API:
handler.handleChunk('<Heading as="h1">');
handler.handleChunk('Welcome');
handler.handleChunk('</Heading>');
// → Email updates automatically!

handler.handleChunk('<Text>Thank you for');
handler.handleChunk(' signing up</Text>');
// → Text component appears!

// When stream completes:
handler.handleComplete();
```

### Example: OpenAI Integration

```typescript
const handler = new StreamingJSXHandler(updateEmail);

const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Generate JSX using: Heading, Text, Button, Img, Hr' },
      { role: 'user', content: 'Create a welcome email' }
    ],
    stream: true,
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  // Parse SSE format and extract content
  const content = extractContentFromSSE(chunk);
  handler.handleChunk(content);
}

handler.handleComplete();
```

### Example: Anthropic Claude Integration

```typescript
const handler = new StreamingJSXHandler(updateEmail);

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    stream: true,
    messages: [
      { role: 'user', content: 'Generate email JSX using: Heading, Text, Button, Img, Hr' }
    ],
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  // Parse SSE format and extract text
  const text = extractTextFromClaude(chunk);
  handler.handleChunk(text);
}

handler.handleComplete();
```

### Browser/Demo Usage

```javascript
// Try the interactive demo by clicking "Agent Demo" button in the UI!
// NOTE: This is a hardcoded simulation showing how streaming COULD work - not actual AI

// The demo shows TWO modes:
// 1. "Stream Whole Email" - Creates entire email from scratch
// 2. "Replace Node (Heading)" - Targets first heading and replaces it

// Browser API:
const currentEmail = getEmailAsJSX();           // Get whole email
const heading = getEmailAsJSX('component-id');  // Get specific component

setEmailFromJSX(newJSX);                 // Replace whole email
setEmailFromJSX(newJSX, 'component-id'); // Replace specific component

// Simulate streaming for testing:
import { simulateAgentStream } from './lib/streamingJSXParser';

await simulateAgentStream(
  jsxString,
  (chunk, components) => {
    console.log('Streamed:', chunk);
    console.log('Parsed components:', components);
  },
  { delayMs: 30, chunkSize: 3 }
);
```

## Available Components

### Heading

```jsx
<Heading as="h1" fontSize="32px" align="center" color="#000000">
  Your Heading Text
</Heading>
```

**Props:**
- `as` - "h1" | "h2" | "h3" | "h4" (default: "h2")
- `fontSize` - CSS value like "24px", "2rem" (default: "24px")
- `align` - "left" | "center" | "right" (default: "left")
- `color` - Hex color like "#000000" (default: "#000000")

### Text

```jsx
<Text fontSize="16px" align="left" color="#333333">
  Your paragraph text goes here. Can be multiple sentences.
</Text>
```

**Props:**
- `fontSize` - CSS value (default: "14px")
- `align` - "left" | "center" | "right" (default: "left")
- `color` - Hex color (default: "#000000")

### Button

```jsx
<Button href="https://example.com" bgColor="#3b82f6" textColor="#ffffff" padding="12px 24px">
  Click Me
</Button>
```

**Props:**
- `href` - URL (default: "https://example.com")
- `bgColor` - Background hex color (default: "#3b82f6")
- `textColor` - Text hex color (default: "#ffffff")
- `padding` - CSS padding like "12px 24px" (default: "12px 24px")

### Image

```jsx
<Img src="https://example.com/image.jpg" alt="Description" width="600" />
```

**Props:**
- `src` - Image URL (required)
- `alt` - Alt text for accessibility (required)
- `width` - Width in pixels (default: "600")

**Note:** Self-closing tag!

### Divider (Horizontal Rule)

```jsx
<Hr borderColor="#e5e7eb" borderWidth="2px" />
```

**Props:**
- `borderColor` - Hex color (default: "#e5e7eb")
- `borderWidth` - CSS width like "1px", "2px" (default: "1px")

**Note:** Self-closing tag!

## Example Agent Workflows

### 1. Building an Email from Scratch

```javascript
setEmailFromJSX(`
<Heading as="h1" fontSize="36px" align="center" color="#1e40af">
  Weekly Newsletter
</Heading>

<Text fontSize="16px" align="left" color="#374151">
  Hello! Here are this week's highlights:
</Text>

<Text fontSize="14px" align="left" color="#6b7280">
  • New feature: Dark mode support
  • Bug fixes and performance improvements
  • Updated documentation
</Text>

<Button href="https://example.com/updates" bgColor="#3b82f6" textColor="#ffffff" padding="14px 28px">
  View Full Updates
</Button>

<Hr borderColor="#d1d5db" borderWidth="1px" />

<Text fontSize="12px" align="center" color="#9ca3af">
  You're receiving this because you subscribed to our newsletter.
</Text>
`);
```

### 2. Making Edits

Agents have two options:

**Option A: Replace specific node (recommended for small edits)**
```javascript
// Get the heading's ID first
const headingId = 'component-id-123';

// Replace just that component
setEmailFromJSX(`
<Heading as="h1" fontSize="32px" align="center" color="#1e40af">
  New Improved Title
</Heading>
`, headingId);
// Rest of email stays unchanged!
```

**Option B: Replace whole email (for major changes)**
```javascript
// Regenerate entire email with updates
setEmailFromJSX(`
<Heading as="h1" fontSize="32px" align="center" color="#1e40af">
  New Improved Title
</Heading>

<Text>Rest of email content...</Text>
`);
```

### 3. Conditional Content

```javascript
const isPromoWeek = true;

const email = isPromoWeek ? `
<Heading as="h1" fontSize="36px" align="center" color="#dc2626">
  FLASH SALE - 50% OFF!
</Heading>

<Button href="https://example.com/sale" bgColor="#dc2626" textColor="#ffffff" padding="16px 32px">
  Shop Now
</Button>
` : `
<Heading as="h2" fontSize="28px" align="center" color="#1e40af">
  New Products Available
</Heading>

<Button href="https://example.com/products" bgColor="#3b82f6" textColor="#ffffff" padding="12px 24px">
  Browse Catalog
</Button>
`;

setEmailFromJSX(email);
```

### 4. Template Variables

```javascript
const userName = "Alice";
const offerCode = "SAVE20";

setEmailFromJSX(`
<Heading as="h1" fontSize="32px" align="center" color="#1e40af">
  Hi ${userName}!
</Heading>

<Text fontSize="16px" align="left" color="#374151">
  We have a special offer just for you. Use code ${offerCode} for 20% off your next purchase.
</Text>

<Button href="https://example.com/shop?code=${offerCode}" bgColor="#3b82f6" textColor="#ffffff" padding="12px 24px">
  Start Shopping
</Button>
`);
```

## Server-Side Usage (Node.js, Deno, Bun)

```typescript
import { AgentAPI } from './lib/agentAPI';

// Create API instance
const api = new AgentAPI();

// Set email from JSX
api.fromJSX(`
<Heading as="h1" fontSize="32px" align="center" color="#000000">
  Server-Generated Email
</Heading>

<Text fontSize="16px" align="left" color="#333333">
  This email was created on the server!
</Text>
`);

// Get components
const components = api.getComponents();
console.log(`Email has ${components.length} components`);
```

## Validation

JSX is **automatically validated** when calling `fromJSX()`:

```javascript
try {
  setEmailFromJSX(`
    <Heading as="h1">Test</Heading>
    <UnknownComponent />
  `);
} catch (error) {
  console.error('Invalid JSX:', error.message);
  // Error: Invalid JSX: Unknown component: UnknownComponent. Valid components: Heading, Text, Button, Img, Hr
}
```

Validation checks:
- ✅ Component names (only Heading, Text, Button, Img, Hr allowed)
- ✅ Required props (e.g., Img requires src and alt)
- ✅ JSX syntax (balanced tags, quotes, etc.)

## Tips for Agents

### ✅ Do This

```jsx
// Clean, well-formatted JSX
<Heading as="h1" fontSize="32px" align="center" color="#1e40af">
  Clear Title
</Heading>

<Text fontSize="16px" align="left" color="#374151">
  Well-structured content with proper spacing.
</Text>
```

### ❌ Avoid This

```jsx
// Missing closing tags
<Heading as="h1">Title

// Invalid component names
<Header>Title</Header>

// Missing required props
<Img />

// Mixed quotes
<Text color='#000000" fontSize="14px'>
```

### Best Practices

1. **Always close tags** - `<Text>...</Text>` or `<Img />` for self-closing
2. **Use double quotes** - `color="#000000"` not `color='#000000'`
3. **Include all props** - Especially `href` for buttons, `src`/`alt` for images
4. **Valid component names** - Only: Heading, Text, Button, Img, Hr
5. **Format nicely** - Makes it easier to read and debug

## Common Patterns

### Welcome Email
```jsx
<Heading as="h1" fontSize="36px" align="center" color="#1e40af">
  Welcome Aboard!
</Heading>

<Text fontSize="16px" align="left" color="#374151">
  We're excited to have you. Here's how to get started:
</Text>

<Button href="https://example.com/getting-started" bgColor="#3b82f6" textColor="#ffffff" padding="14px 28px">
  Get Started
</Button>
```

### Newsletter
```jsx
<Heading as="h2" fontSize="28px" align="left" color="#1f2937">
  This Week's Highlights
</Heading>

<Text fontSize="14px" align="left" color="#6b7280">
  Here's what happened this week...
</Text>

<Hr borderColor="#e5e7eb" borderWidth="1px" />
```

### Call to Action
```jsx
<Heading as="h1" fontSize="32px" align="center" color="#dc2626">
  Limited Time Offer!
</Heading>

<Text fontSize="18px" align="center" color="#374151">
  Don't miss out on our biggest sale of the year.
</Text>

<Button href="https://example.com/sale" bgColor="#dc2626" textColor="#ffffff" padding="16px 32px">
  Shop Now
</Button>

<Text fontSize="12px" align="center" color="#9ca3af">
  Sale ends midnight Sunday
</Text>
```

## Node-Level Operations

Agents can target specific components by ID for surgical edits:

### Getting Component IDs

```javascript
// In browser console
const api = emailAPI;
const components = api.getComponents();
components.forEach(c => console.log(`${c.type}: ${c.id}`));
```

### Replacing Specific Nodes

```javascript
// Get the JSX for first heading
const firstHeadingId = 'abc123';
const currentJSX = getEmailAsJSX(firstHeadingId);
// Returns: <Heading as="h2" ...>Old Title</Heading>

// Replace just that heading
setEmailFromJSX(`
<Heading as="h1" fontSize="36px" align="center" color="#dc2626">
  🎉 NEW TITLE!
</Heading>
`, firstHeadingId);
// Only that component gets replaced, rest of email unchanged
```

### Use Cases for Node-Level Edits

- **Fix typos**: Replace text in specific paragraph without regenerating entire email
- **Update CTAs**: Swap out button text/link while keeping email structure
- **A/B testing**: Replace specific components with variants
- **Incremental edits**: Agent makes targeted changes based on feedback

## API Reference

### Global Functions (Browser)

```javascript
// Get JSX for entire email
const jsx = getEmailAsJSX();

// Get JSX for specific component by ID
const nodeJsx = getEmailAsJSX('component-id-123');

// Replace entire email
setEmailFromJSX(`<Heading>...</Heading>`);

// Replace specific component by ID
setEmailFromJSX(`<Heading>New Title</Heading>`, 'component-id-123');

// Access full API
emailAPI.toJSX();
emailAPI.fromJSX(jsx);
```

### AgentAPI Class (Server/Browser)

```typescript
const api = new AgentAPI(components);

// Get JSX for entire email or specific node
api.toJSX()              // Returns JSX string for all components
api.toJSX(nodeId)        // Returns JSX string for specific component

// Set JSX for entire email or specific node
api.fromJSX(jsx)         // Replaces all components
api.fromJSX(jsx, nodeId) // Replaces component at nodeId

// Internal access (rarely needed)
api.getComponents()      // Get raw component array
```

## When to Use Whole Email vs Node-Level Edits

**Use whole email replacement when:**
- ✅ Creating emails from scratch
- ✅ Making major structural changes
- ✅ Agent is generating new content
- ✅ Working with templates
- ✅ Converting natural language to email

**Use node-level targeting when:**
- ✅ Fixing typos in specific components
- ✅ Updating a single CTA button
- ✅ Making precise surgical edits
- ✅ User gives feedback on specific component
- ✅ A/B testing component variations

## Error Handling

```javascript
try {
  setEmailFromJSX(`<Heading>Test</Heading>`);
} catch (error) {
  console.error('Failed to parse JSX:', error.message);
}
```

Common errors:
- Unbalanced tags
- Unknown component names
- Invalid prop values
- Missing required props
