# Agent API Documentation

This document describes how AI agents can interact with and modify the React Email Builder.

## Overview

The builder provides **two APIs** for agent interaction:

1. **Client-Side API** - DOM-based, for browser automation (Playwright, Puppeteer, etc.)
2. **Server-Side API** - Data-based, for server/worker environments (Node.js, Deno, Bun, etc.)

---

## Client-Side API (Browser)

### Component Data Attributes

Every rendered email component in the canvas has the following data attributes:

- `data-component-id`: Unique identifier for the component (nanoid)
- `data-component-type`: Type of component (`heading`, `text`, `button`, `image`, `divider`)
- `data-component-index`: Position in the component array (0-indexed)

### ComponentSelector API

The `ComponentSelector` utility is available globally at `window.ComponentSelector` for easy agent access.

### Methods

#### `getById(componentId: string): HTMLElement | null`
Get a component element by its unique ID.

```javascript
const component = ComponentSelector.getById('abc123');
```

#### `getByType(type: ComponentType): HTMLElement[]`
Get all components of a specific type.

```javascript
const allHeadings = ComponentSelector.getByType('heading');
const allButtons = ComponentSelector.getByType('button');
```

#### `getByIndex(index: number): HTMLElement | null`
Get a component by its position in the email.

```javascript
const firstComponent = ComponentSelector.getByIndex(0);
const thirdComponent = ComponentSelector.getByIndex(2);
```

#### `getAll(): HTMLElement[]`
Get all component elements.

```javascript
const allComponents = ComponentSelector.getAll();
console.log(`Email has ${allComponents.length} components`);
```

#### `getMetadata(element: HTMLElement)`
Get all metadata from a component element.

```javascript
const element = ComponentSelector.getById('abc123');
const metadata = ComponentSelector.getMetadata(element);
// Returns: { id: 'abc123', type: 'heading', index: 0 }
```

## Example Agent Workflows

### 1. Finding and Clicking a Component

```javascript
// Find the first heading
const heading = ComponentSelector.getByType('heading')[0];

// Click it to select it
if (heading) {
  heading.click();
}
```

### 2. Selecting a Component by Index

```javascript
// Select the 3rd component in the email
const component = ComponentSelector.getByIndex(2);
if (component) {
  component.click();
}
```

### 3. Analyzing Email Structure

```javascript
const components = ComponentSelector.getAll();
const structure = components.map(el => ({
  type: ComponentSelector.getTypeFromElement(el),
  index: ComponentSelector.getIndexFromElement(el),
  id: ComponentSelector.getIdFromElement(el)
}));

console.log('Email structure:', structure);
```

### 4. Finding Components by Content

```javascript
// Find all headings that contain specific text
const headings = ComponentSelector.getByType('heading');
const targetHeading = headings.find(el =>
  el.textContent?.includes('Welcome')
);

if (targetHeading) {
  targetHeading.click();
}
```

## React Email Component Types

The builder uses TypeScript types extracted directly from `@react-email/components`:

```typescript
import { ComponentProps } from 'react';
import { Heading, Text, Button, Img, Hr } from '@react-email/components';

type ReactEmailHeadingProps = ComponentProps<typeof Heading>;
type ReactEmailTextProps = ComponentProps<typeof Text>;
type ReactEmailButtonProps = ComponentProps<typeof Button>;
type ReactEmailImgProps = ComponentProps<typeof Img>;
type ReactEmailHrProps = ComponentProps<typeof Hr>;
```

This ensures the prop types are always in sync with the actual React Email library.

## Programmatic Manipulation

While the ComponentSelector helps with selection, to actually modify component properties, agents should:

1. Use ComponentSelector to find and click the target component
2. Wait for the properties panel to update
3. Use DOM queries to find and modify the input fields in the properties panel

Example:

```javascript
// Select a heading
const heading = ComponentSelector.getByType('heading')[0];
heading?.click();

// Wait a moment for React to update
await new Promise(resolve => setTimeout(resolve, 100));

// Find and modify the text input
const textInput = document.querySelector('input[type="text"]');
if (textInput) {
  textInput.value = 'New Heading Text';
  textInput.dispatchEvent(new Event('input', { bubbles: true }));
}
```

---

## Server-Side API (Node.js, Workers, etc.)

The server-side API works with component data directly, without requiring DOM access. Perfect for:
- Backend automation
- Server-side rendering
- Worker threads
- Headless testing
- CI/CD pipelines

### ServerComponentSelector Class

```typescript
import { ServerComponentSelector } from './lib/serverComponentSelector';

const selector = new ServerComponentSelector(components);
```

#### Methods

**`getById(componentId: string): EmailComponent | null`**
```typescript
const component = selector.getById('abc123');
```

**`getByType(type: ComponentType): EmailComponent[]`**
```typescript
const allHeadings = selector.getByType('heading');
const allButtons = selector.getByType('button');
```

**`getByIndex(index: number): EmailComponent | null`**
```typescript
const firstComponent = selector.getByIndex(0);
```

**`getAll(): EmailComponent[]`**
```typescript
const allComponents = selector.getAll();
```

**`findByText(searchText: string, caseSensitive?: boolean): EmailComponent[]`**
```typescript
const welcomeTexts = selector.findByText('Welcome');
const exact = selector.findByText('Welcome!', true);
```

**`findByUrl(searchUrl: string): EmailComponent[]`**
```typescript
const exampleLinks = selector.findByUrl('example.com');
```

**`countByType(): Record<ComponentType, number>`**
```typescript
const counts = selector.countByType();
// { heading: 2, text: 3, button: 1, image: 0, divider: 1 }
```

**`getMetadata()`**
```typescript
const metadata = selector.getMetadata();
// {
//   totalComponents: 7,
//   componentsByType: { heading: 2, text: 3, ... },
//   componentIds: ['abc123', 'def456', ...],
//   componentTypes: ['heading', 'text', ...]
// }
```

**`find(predicate: Function): EmailComponent[]`**
```typescript
const largeHeadings = selector.find(comp =>
  comp.type === 'heading' &&
  parseInt((comp.props as HeadingProps).fontSize) > 30
);
```

**`first(n?: number): EmailComponent[]`**
```typescript
const firstThree = selector.first(3);
```

**`last(n?: number): EmailComponent[]`**
```typescript
const lastTwo = selector.last(2);
```

### ComponentQuery (Functional API)

For functional programming style:

```typescript
import { ComponentQuery } from './lib/serverComponentSelector';

const heading = ComponentQuery.getById(components, 'abc123');
const counts = ComponentQuery.countByType(components);
const welcomeTexts = ComponentQuery.findByText(components, 'Welcome');
```

### Example Server-Side Workflows

**Analyze Email Structure**
```typescript
const selector = new ServerComponentSelector(components);
const metadata = selector.getMetadata();

console.log(`Total components: ${metadata.totalComponents}`);
console.log(`Headings: ${metadata.componentsByType.heading}`);
console.log(`CTAs: ${metadata.componentsByType.button}`);
```

**Find and Modify Components**
```typescript
// Find all buttons with old URL
const oldButtons = selector.findByUrl('oldsite.com');

// Create updated components array
const updatedComponents = components.map(comp => {
  if (comp.type === 'button' && comp.id === oldButtons[0].id) {
    return {
      ...comp,
      props: { ...comp.props, href: 'newsite.com' }
    };
  }
  return comp;
});
```

**Validation and Quality Checks**
```typescript
const selector = new ServerComponentSelector(components);

// Check for missing CTAs
const buttonCount = selector.getByType('button').length;
if (buttonCount === 0) {
  console.warn('Email has no call-to-action buttons');
}

// Check for accessibility
const images = selector.getByType('image');
images.forEach((img, idx) => {
  const alt = (img.props as ImageProps).alt;
  if (!alt) {
    console.warn(`Image at index ${idx} missing alt text`);
  }
});
```

## TypeScript Support

All types are exported from `src/types/index.ts` and can be imported for type-safe agent development:

```typescript
import type {
  ComponentType,
  EmailComponent,
  HeadingProps,
  TextProps,
  ButtonProps,
  ImageProps,
  DividerProps
} from './types';
```

## Choosing the Right API

**Use Client-Side API when:**
- Automating browser interactions (Playwright, Puppeteer)
- Need to click/select components visually
- Testing UI interactions
- Running in browser console

**Use Server-Side API when:**
- Batch processing emails
- Backend automation
- No DOM access available
- Building APIs or services
- Running in Node.js/Deno/Bun
- CI/CD pipelines
