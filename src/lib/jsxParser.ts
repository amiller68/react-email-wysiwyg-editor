import { nanoid } from 'nanoid';
import type { EmailComponent, ComponentType } from '../types';

/**
 * Parse JSX markup into EmailComponent array
 * Allows agents to work with familiar React/JSX syntax instead of JSON
 */

interface ParsedElement {
  type: string;
  props: Record<string, any>;
  children: (ParsedElement | string)[];
}

// Simple JSX parser using regex (production apps should use a proper parser like babel)
function parseJSXElement(jsx: string): ParsedElement[] {
  const elements: ParsedElement[] = [];

  // Match self-closing tags: <Component prop="value" />
  const selfClosingRegex = /<(\w+)\s*([^>]*?)\/>/g;

  let match;

  // Parse self-closing tags
  while ((match = selfClosingRegex.exec(jsx)) !== null) {
    const [, tagName, propsStr] = match;
    const props = parseProps(propsStr);
    elements.push({ type: tagName, props, children: [] });
  }

  // Parse regular tags
  const regularJsx = jsx.replace(selfClosingRegex, ''); // Remove self-closing first
  const regex = /<(\w+)\s*([^>]*)>(.*?)<\/\1>/gs;

  while ((match = regex.exec(regularJsx)) !== null) {
    const [, tagName, propsStr, content] = match;
    const props = parseProps(propsStr);
    const children = content.trim() ? [content.trim()] : [];
    elements.push({ type: tagName, props, children });
  }

  return elements;
}

function parseProps(propsStr: string): Record<string, any> {
  const props: Record<string, any> = {};

  // Match prop="value" or prop='value' or prop={value}
  const propRegex = /(\w+)=(?:{([^}]*)}|"([^"]*)"|'([^']*)')/g;
  let match;

  while ((match = propRegex.exec(propsStr)) !== null) {
    const [, key, jsValue, doubleQuoted, singleQuoted] = match;
    const value = jsValue || doubleQuoted || singleQuoted;
    props[key] = value;
  }

  return props;
}

/**
 * Convert JSX string to EmailComponent array
 */
export function parseJSX(jsx: string): EmailComponent[] {
  const elements = parseJSXElement(jsx);
  return elements.map(el => convertToEmailComponent(el)).filter(Boolean) as EmailComponent[];
}

function convertToEmailComponent(element: ParsedElement): EmailComponent | null {
  const { type, props, children } = element;

  // Map JSX component names to our internal types
  const typeMap: Record<string, ComponentType> = {
    'Heading': 'heading',
    'Text': 'text',
    'Button': 'button',
    'Img': 'image',
    'Image': 'image',
    'Hr': 'divider',
    'Divider': 'divider',
  };

  const componentType = typeMap[type];
  if (!componentType) return null;

  const id = nanoid();

  // Convert JSX props to our internal format
  switch (componentType) {
    case 'heading':
      return {
        id,
        type: 'heading',
        props: {
          text: children[0] as string || props.children || '',
          as: props.as || 'h2',
          align: props.align || 'left',
          color: props.color || '#000000',
          fontSize: props.fontSize || '24px',
        },
      };

    case 'text':
      return {
        id,
        type: 'text',
        props: {
          text: children[0] as string || props.children || '',
          align: props.align || 'left',
          color: props.color || '#000000',
          fontSize: props.fontSize || '14px',
        },
      };

    case 'button':
      return {
        id,
        type: 'button',
        props: {
          text: children[0] as string || props.children || 'Click Me',
          href: props.href || 'https://example.com',
          bgColor: props.bgColor || props.backgroundColor || '#3b82f6',
          textColor: props.textColor || props.color || '#ffffff',
          padding: props.padding || '12px 24px',
        },
      };

    case 'image':
      return {
        id,
        type: 'image',
        props: {
          src: props.src || '',
          alt: props.alt || '',
          width: props.width || '600',
        },
      };

    case 'divider':
      return {
        id,
        type: 'divider',
        props: {
          borderColor: props.borderColor || props.color || '#e5e7eb',
          borderWidth: props.borderWidth || '1px',
        },
      };

    default:
      return null;
  }
}

/**
 * Convert EmailComponent array to JSX string
 */
export function toJSX(components: EmailComponent[]): string {
  return components.map(comp => {
    switch (comp.type) {
      case 'heading': {
        const props = comp.props as any;
        return `<Heading as="${props.as}" fontSize="${props.fontSize}" align="${props.align}" color="${props.color}">
  ${props.text}
</Heading>`;
      }

      case 'text': {
        const props = comp.props as any;
        return `<Text fontSize="${props.fontSize}" align="${props.align}" color="${props.color}">
  ${props.text}
</Text>`;
      }

      case 'button': {
        const props = comp.props as any;
        return `<Button href="${props.href}" bgColor="${props.bgColor}" textColor="${props.textColor}" padding="${props.padding}">
  ${props.text}
</Button>`;
      }

      case 'image': {
        const props = comp.props as any;
        return `<Img src="${props.src}" alt="${props.alt}" width="${props.width}" />`;
      }

      case 'divider': {
        const props = comp.props as any;
        return `<Hr borderColor="${props.borderColor}" borderWidth="${props.borderWidth}" />`;
      }

      default:
        return '';
    }
  }).join('\n\n');
}

/**
 * Apply JSX diff to existing components
 * Agents can provide JSX markup and we'll merge it intelligently
 */
export function applyJSXDiff(currentComponents: EmailComponent[], newJSX: string): EmailComponent[] {
  const newComponents = parseJSX(newJSX);

  // If newJSX is a complete replacement (has more than one component or looks complete)
  if (newComponents.length > 0) {
    return newComponents;
  }

  // Otherwise return current
  return currentComponents;
}

/**
 * Validate JSX before parsing
 */
export function validateJSX(jsx: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for balanced tags
  const openTags = jsx.match(/<(\w+)(?:\s|>)/g) || [];
  const closeTags = jsx.match(/<\/(\w+)>/g) || [];

  if (openTags.length !== closeTags.length) {
    errors.push('Unbalanced tags detected');
  }

  // Check for valid component names
  const validComponents = ['Heading', 'Text', 'Button', 'Img', 'Image', 'Hr', 'Divider'];
  const components = jsx.match(/<(\w+)/g)?.map(m => m.slice(1)) || [];

  components.forEach(comp => {
    if (!validComponents.includes(comp)) {
      errors.push(`Unknown component: ${comp}. Valid components: ${validComponents.join(', ')}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
