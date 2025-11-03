import type { ComponentType } from '../types';

/**
 * Helper utilities for agents to query and target email components in the DOM
 */

export const ComponentSelector = {
  /**
   * Get a component element by its ID
   */
  getById(componentId: string): HTMLElement | null {
    return document.querySelector(`[data-component-id="${componentId}"]`);
  },

  /**
   * Get all components of a specific type
   */
  getByType(type: ComponentType): HTMLElement[] {
    return Array.from(document.querySelectorAll(`[data-component-type="${type}"]`));
  },

  /**
   * Get a component by its index (position in the email)
   */
  getByIndex(index: number): HTMLElement | null {
    return document.querySelector(`[data-component-index="${index}"]`);
  },

  /**
   * Get all component elements
   */
  getAll(): HTMLElement[] {
    return Array.from(document.querySelectorAll('[data-component-id]'));
  },

  /**
   * Get the component ID from a DOM element
   */
  getIdFromElement(element: HTMLElement): string | null {
    return element.getAttribute('data-component-id');
  },

  /**
   * Get the component type from a DOM element
   */
  getTypeFromElement(element: HTMLElement): ComponentType | null {
    return element.getAttribute('data-component-type') as ComponentType | null;
  },

  /**
   * Get the component index from a DOM element
   */
  getIndexFromElement(element: HTMLElement): number | null {
    const index = element.getAttribute('data-component-index');
    return index ? parseInt(index, 10) : null;
  },

  /**
   * Get component metadata from a DOM element
   */
  getMetadata(element: HTMLElement): {
    id: string | null;
    type: ComponentType | null;
    index: number | null;
  } {
    return {
      id: this.getIdFromElement(element),
      type: this.getTypeFromElement(element),
      index: this.getIndexFromElement(element),
    };
  },
};

/**
 * Export for global window access (useful for agents)
 */
if (typeof window !== 'undefined') {
  (window as any).ComponentSelector = ComponentSelector;
}
