import type { EmailComponent, ComponentType } from '../types';

/**
 * Server-side component selector that works with component data directly
 * No DOM access required - can run in Node.js, workers, or any JavaScript environment
 */
export class ServerComponentSelector {
  constructor(private components: EmailComponent[]) {}

  /**
   * Get a component by its ID
   */
  getById(componentId: string): EmailComponent | null {
    return this.components.find(c => c.id === componentId) || null;
  }

  /**
   * Get all components of a specific type
   */
  getByType(type: ComponentType): EmailComponent[] {
    return this.components.filter(c => c.type === type);
  }

  /**
   * Get a component by its index (position in the email)
   */
  getByIndex(index: number): EmailComponent | null {
    return this.components[index] || null;
  }

  /**
   * Get all components
   */
  getAll(): EmailComponent[] {
    return [...this.components];
  }

  /**
   * Find components by a predicate function
   */
  find(predicate: (component: EmailComponent, index: number) => boolean): EmailComponent[] {
    return this.components.filter(predicate);
  }

  /**
   * Find first component matching predicate
   */
  findOne(predicate: (component: EmailComponent, index: number) => boolean): EmailComponent | null {
    return this.components.find(predicate) || null;
  }

  /**
   * Get components by text content (searches heading and text components)
   */
  findByText(searchText: string, caseSensitive = false): EmailComponent[] {
    return this.components.filter(comp => {
      if (comp.type !== 'heading' && comp.type !== 'text') return false;

      const props = comp.props as { text: string };
      const text = caseSensitive ? props.text : props.text.toLowerCase();
      const search = caseSensitive ? searchText : searchText.toLowerCase();

      return text.includes(search);
    });
  }

  /**
   * Get components by URL (searches button and image components)
   */
  findByUrl(searchUrl: string): EmailComponent[] {
    return this.components.filter(comp => {
      if (comp.type === 'button') {
        return (comp.props as { href: string }).href.includes(searchUrl);
      }
      if (comp.type === 'image') {
        return (comp.props as { src: string }).src.includes(searchUrl);
      }
      return false;
    });
  }

  /**
   * Get component count by type
   */
  countByType(): Record<ComponentType, number> {
    const counts = {
      heading: 0,
      text: 0,
      button: 0,
      image: 0,
      divider: 0,
    };

    this.components.forEach(comp => {
      counts[comp.type]++;
    });

    return counts;
  }

  /**
   * Get the index of a component by ID
   */
  getIndexById(componentId: string): number {
    return this.components.findIndex(c => c.id === componentId);
  }

  /**
   * Check if a component exists
   */
  exists(componentId: string): boolean {
    return this.components.some(c => c.id === componentId);
  }

  /**
   * Get metadata about the email structure
   */
  getMetadata() {
    return {
      totalComponents: this.components.length,
      componentsByType: this.countByType(),
      componentIds: this.components.map(c => c.id),
      componentTypes: this.components.map(c => c.type),
    };
  }

  /**
   * Get a slice of components
   */
  slice(start: number, end?: number): EmailComponent[] {
    return this.components.slice(start, end);
  }

  /**
   * Get first N components
   */
  first(n: number = 1): EmailComponent[] {
    return this.components.slice(0, n);
  }

  /**
   * Get last N components
   */
  last(n: number = 1): EmailComponent[] {
    return this.components.slice(-n);
  }
}

/**
 * Factory function to create a selector from component array
 */
export function createSelector(components: EmailComponent[]): ServerComponentSelector {
  return new ServerComponentSelector(components);
}

/**
 * Standalone utility functions (for functional programming style)
 */
export const ComponentQuery = {
  getById: (components: EmailComponent[], id: string) =>
    components.find(c => c.id === id) || null,

  getByType: (components: EmailComponent[], type: ComponentType) =>
    components.filter(c => c.type === type),

  getByIndex: (components: EmailComponent[], index: number) =>
    components[index] || null,

  findByText: (components: EmailComponent[], searchText: string, caseSensitive = false) => {
    return components.filter(comp => {
      if (comp.type !== 'heading' && comp.type !== 'text') return false;
      const props = comp.props as { text: string };
      const text = caseSensitive ? props.text : props.text.toLowerCase();
      const search = caseSensitive ? searchText : searchText.toLowerCase();
      return text.includes(search);
    });
  },

  countByType: (components: EmailComponent[]) => {
    const counts = {
      heading: 0,
      text: 0,
      button: 0,
      image: 0,
      divider: 0,
    };
    components.forEach(comp => counts[comp.type]++);
    return counts;
  },
};
