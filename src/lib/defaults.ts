import type { ComponentType, ComponentProps } from '../types';

export const getDefaultProps = (type: ComponentType): ComponentProps => {
  switch (type) {
    case 'heading':
      return {
        text: 'Your Heading Here',
        as: 'h2',
        align: 'left',
        color: '#000000',
        fontSize: '24px',
      };
    case 'text':
      return {
        text: 'Your text content here...',
        align: 'left',
        color: '#000000',
        fontSize: '14px',
      };
    case 'button':
      return {
        text: 'Click Me',
        href: 'https://example.com',
        bgColor: '#3b82f6',
        textColor: '#ffffff',
        padding: '12px 24px',
      };
    case 'image':
      return {
        src: 'https://via.placeholder.com/600x300',
        alt: 'Image description',
        width: '600',
      };
    case 'divider':
      return {
        borderColor: '#e5e7eb',
        borderWidth: '1px',
      };
  }
};
