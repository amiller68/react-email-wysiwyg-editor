import type { EmailComponent, ValidationError } from '../types';

export const validateEmail = (components: EmailComponent[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  components.forEach((comp, idx) => {
    if (comp.type === 'button') {
      const props = comp.props as { href: string };
      if (!props.href.startsWith('http')) {
        errors.push({
          message: `Component ${idx + 1}: Button URL should start with http:// or https://`,
          componentIndex: idx,
        });
      }
    }

    if (comp.type === 'image') {
      const props = comp.props as { alt: string };
      if (!props.alt) {
        errors.push({
          message: `Component ${idx + 1}: Image missing alt text (accessibility issue)`,
          componentIndex: idx,
        });
      }
    }

    if (comp.type === 'text') {
      const props = comp.props as { text: string };
      if (props.text.length > 1000) {
        errors.push({
          message: `Component ${idx + 1}: Text block too long (may be truncated in some email clients)`,
          componentIndex: idx,
        });
      }
    }
  });

  if (components.length === 0) {
    errors.push({
      message: 'Email is empty - add some content!',
      componentIndex: -1,
    });
  }

  return errors;
};
