import type { EmailComponent } from '../types';
import { parseJSX, toJSX, validateJSX } from './jsxParser';

/**
 * Agent-friendly API for working with email components via streaming JSX
 */

export class AgentAPI {
  private components: EmailComponent[];

  constructor(components: EmailComponent[] = []) {
    this.components = components;
  }

  /**
   * Get JSX for entire email or specific node
   * @param nodeId - Optional component ID to get JSX for specific component
   */
  toJSX(nodeId?: string): string {
    if (nodeId) {
      const component = this.components.find(c => c.id === nodeId);
      if (!component) {
        throw new Error(`Component with id "${nodeId}" not found`);
      }
      return toJSX([component]);
    }
    return toJSX(this.components);
  }

  /**
   * Replace entire email or specific node with JSX
   * @param jsx - JSX string to parse
   * @param nodeId - Optional component ID to replace specific component
   */
  fromJSX(jsx: string, nodeId?: string): EmailComponent[] {
    const validation = validateJSX(jsx);
    if (!validation.valid) {
      throw new Error(`Invalid JSX: ${validation.errors.join(', ')}`);
    }

    const newComponents = parseJSX(jsx);

    if (nodeId) {
      // Replace specific component
      const index = this.components.findIndex(c => c.id === nodeId);
      if (index === -1) {
        throw new Error(`Component with id "${nodeId}" not found`);
      }

      // Replace the component at that index with new components
      this.components = [
        ...this.components.slice(0, index),
        ...newComponents,
        ...this.components.slice(index + 1)
      ];
    } else {
      // Replace entire email
      this.components = newComponents;
    }

    return this.components;
  }

  /**
   * Get raw component data (for internal use)
   */
  getComponents(): EmailComponent[] {
    return this.components;
  }
}

/**
 * Global API for agents
 * Available in browser as window.AgentAPI
 */
export function createAgentAPI(components: EmailComponent[]): AgentAPI {
  return new AgentAPI(components);
}

// Export for browser access
if (typeof window !== 'undefined') {
  (window as any).AgentAPI = AgentAPI;
  (window as any).createAgentAPI = createAgentAPI;
}
