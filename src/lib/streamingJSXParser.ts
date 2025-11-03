import type { EmailComponent } from '../types';
import { parseJSX } from './jsxParser';

/**
 * Streaming JSX Parser - handles partial/incomplete JSX as agents stream it
 * Perfect for real-time rendering as LLMs generate JSX token by token
 */

export class StreamingJSXParser {
  private buffer: string = '';
  private components: EmailComponent[] = [];
  private onUpdate?: (components: EmailComponent[]) => void;

  constructor(onUpdate?: (components: EmailComponent[]) => void) {
    this.onUpdate = onUpdate;
  }

  /**
   * Append new JSX chunk from streaming agent
   * Automatically parses complete components and updates
   */
  append(chunk: string) {
    this.buffer += chunk;
    this.parseBuffer();
  }

  /**
   * Parse buffer and extract complete components
   */
  private parseBuffer() {
    // Try to extract complete components from buffer
    const completeComponents = this.extractCompleteComponents(this.buffer);

    if (completeComponents.length > 0) {
      try {
        this.components = parseJSX(completeComponents);
        this.onUpdate?.(this.components);
      } catch (e) {
        // Partial parse failed, wait for more data
      }
    }
  }

  /**
   * Extract complete JSX elements from potentially partial buffer
   */
  private extractCompleteComponents(buffer: string): string {
    let result = '';
    const lines = buffer.split('\n');
    const stack: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Self-closing tag
      if (trimmed.match(/<\w+[^>]*\/>/)) {
        result += line + '\n';
        continue;
      }

      // Opening tag
      const openMatch = trimmed.match(/<(\w+)(?:\s|>)/);
      if (openMatch && !trimmed.startsWith('</')) {
        stack.push(openMatch[1]);
        result += line + '\n';
        continue;
      }

      // Closing tag
      const closeMatch = trimmed.match(/<\/(\w+)>/);
      if (closeMatch) {
        const expectedTag = stack[stack.length - 1];
        if (closeMatch[1] === expectedTag) {
          stack.pop();
          result += line + '\n';
        }
        continue;
      }

      // Content line
      if (stack.length > 0) {
        result += line + '\n';
      }
    }

    return result.trim();
  }

  /**
   * Get current parsed components
   */
  getComponents(): EmailComponent[] {
    return this.components;
  }

  /**
   * Get current buffer (for debugging)
   */
  getBuffer(): string {
    return this.buffer;
  }

  /**
   * Reset parser
   */
  reset() {
    this.buffer = '';
    this.components = [];
  }

  /**
   * Finalize parsing (call when stream ends)
   */
  finalize() {
    // Try one more parse with full buffer
    try {
      this.components = parseJSX(this.buffer);
      this.onUpdate?.(this.components);
    } catch (e) {
      // Best effort parse failed
      console.warn('Failed to finalize parse:', e);
    }
  }
}

/**
 * Simulate agent streaming for demo purposes
 */
export async function simulateAgentStream(
  jsx: string,
  onChunk: (chunk: string, components: EmailComponent[]) => void,
  options: { delayMs?: number; chunkSize?: number } = {}
) {
  const { delayMs = 50, chunkSize = 5 } = options;
  const parser = new StreamingJSXParser();

  // Stream character by character or by chunks
  for (let i = 0; i < jsx.length; i += chunkSize) {
    const chunk = jsx.slice(i, i + chunkSize);
    parser.append(chunk);

    // Call update with current chunk and parsed components
    onChunk(chunk, parser.getComponents());

    // Simulate network/generation delay
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  // Finalize
  parser.finalize();
  return parser.getComponents();
}

/**
 * Server-side streaming handler (for actual agent integration)
 */
export class StreamingJSXHandler {
  private parser: StreamingJSXParser;

  constructor(onComponentsChange: (components: EmailComponent[]) => void) {
    this.parser = new StreamingJSXParser(onComponentsChange);
  }

  /**
   * Handle incoming chunk from LLM stream
   */
  handleChunk(chunk: string) {
    this.parser.append(chunk);
  }

  /**
   * Called when stream completes
   */
  handleComplete() {
    this.parser.finalize();
  }

  /**
   * Get current state
   */
  getCurrentComponents(): EmailComponent[] {
    return this.parser.getComponents();
  }

  /**
   * Reset for new stream
   */
  reset() {
    this.parser.reset();
  }
}

