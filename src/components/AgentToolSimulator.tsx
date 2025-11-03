import { useState, useEffect } from 'react';
import { Terminal, Zap, RotateCcw } from 'lucide-react';
import { simulateAgentStream } from '../lib/streamingJSXParser';
import type { EmailComponent } from '../types';

interface AgentToolSimulatorProps {
  onApplyJSX: (components: EmailComponent[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const WHOLE_EMAIL_DEMO = `<Heading as="h1" fontSize="32px" align="center" color="#1e40af">
  Welcome to React Email Builder
</Heading>

<Text fontSize="16px" align="left" color="#374151">
  This demonstrates how AI agents can stream JSX to build emails in real-time. Watch as the components appear as the agent "types" the JSX.
</Text>

<Button href="https://example.com/docs" bgColor="#3b82f6" textColor="#ffffff" padding="12px 24px">
  Read the Docs
</Button>

<Hr borderColor="#e5e7eb" borderWidth="1px" />

<Text fontSize="14px" align="center" color="#6b7280">
  Built with React 19 + TypeScript + Tailwind CSS
</Text>`;

const NODE_REPLACE_DEMO = `<Heading as="h1" fontSize="36px" align="center" color="#dc2626">
  🎉 UPDATED TITLE!
</Heading>`;

type DemoMode = 'whole' | 'node';

export const AgentToolSimulator = ({ onApplyJSX, isOpen, onClose }: AgentToolSimulatorProps) => {
  const [displayedJSX, setDisplayedJSX] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamSpeed, setStreamSpeed] = useState(30); // ms per chunk
  const [demoMode, setDemoMode] = useState<DemoMode>('whole');
  const [hasInitialEmail, setHasInitialEmail] = useState(false);

  useEffect(() => {
    if (isOpen && displayedJSX === '') {
      startWholeEmailDemo();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startWholeEmailDemo = async () => {
    setIsStreaming(true);
    setDisplayedJSX('');
    setDemoMode('whole');

    await simulateAgentStream(
      WHOLE_EMAIL_DEMO,
      (chunk, components) => {
        setDisplayedJSX(prev => prev + chunk);
        if (components.length > 0) {
          onApplyJSX(components);
        }
      },
      { delayMs: streamSpeed, chunkSize: 3 }
    );

    setHasInitialEmail(true);
    setIsStreaming(false);
  };

  const startNodeReplaceDemo = async () => {
    if (!hasInitialEmail) {
      alert('Please run the whole email demo first!');
      return;
    }

    setIsStreaming(true);
    setDisplayedJSX('');
    setDemoMode('node');

    // Get first component ID from window.emailAPI
    const api = (window as any).emailAPI;
    const components = api?.getComponents() || [];
    const firstComponentId = components[0]?.id;

    if (!firstComponentId) {
      alert('No components to replace!');
      setIsStreaming(false);
      return;
    }

    await simulateAgentStream(
      NODE_REPLACE_DEMO,
      (chunk, newComponents) => {
        setDisplayedJSX(prev => prev + chunk);
        if (newComponents.length > 0) {
          // Replace the first component using the global API
          (window as any).setEmailFromJSX(NODE_REPLACE_DEMO, firstComponentId);
        }
      },
      { delayMs: streamSpeed, chunkSize: 3 }
    );

    setIsStreaming(false);
  };

  const resetDemo = () => {
    setDisplayedJSX('');
    onApplyJSX([]);
    setHasInitialEmail(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Streaming JSX Demo</h2>
              <p className="text-sm text-gray-500">Simulation showing how agents could build emails by streaming JSX</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Speed:</label>
              <input
                type="range"
                min="10"
                max="100"
                value={streamSpeed}
                onChange={(e) => setStreamSpeed(Number(e.target.value))}
                className="w-32"
                disabled={isStreaming}
              />
              <span className="text-sm text-gray-500">{streamSpeed}ms</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetDemo}
                disabled={isStreaming}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={startWholeEmailDemo}
              disabled={isStreaming}
              className={`flex-1 px-4 py-2 ${demoMode === 'whole' ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gray-600'} hover:opacity-90 text-white rounded-lg flex items-center justify-center gap-2 font-medium shadow-sm transition-all disabled:opacity-50`}
            >
              <Zap className="w-4 h-4" />
              Stream Whole Email
            </button>
            <button
              onClick={startNodeReplaceDemo}
              disabled={isStreaming || !hasInitialEmail}
              className={`flex-1 px-4 py-2 ${demoMode === 'node' ? 'bg-gradient-to-r from-orange-600 to-orange-700' : 'bg-gray-600'} hover:opacity-90 text-white rounded-lg flex items-center justify-center gap-2 font-medium shadow-sm transition-all disabled:opacity-50`}
            >
              <Zap className="w-4 h-4" />
              Replace Node (Heading)
              {!hasInitialEmail && <span className="text-xs">(run whole email first)</span>}
            </button>
          </div>
        </div>

        {/* JSX Display */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              JSX being streamed from agent:
            </label>
            {isStreaming && (
              <div className="flex items-center gap-2 text-purple-600">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Agent generating...</span>
              </div>
            )}
          </div>
          <div className="flex-1 font-mono text-sm bg-gray-900 text-green-300 p-4 rounded-lg overflow-auto relative">
            <pre className="whitespace-pre-wrap">{displayedJSX}</pre>
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <strong>Whole Email:</strong> Agent streams JSX to create entire email from scratch.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Replace Node:</strong> Agent targets specific component by ID and streams replacement JSX.
              Uses <code className="bg-gray-200 px-1 rounded">setEmailFromJSX(jsx, nodeId)</code>
            </p>
            <p className="text-xs text-gray-600 mt-2">
              No DOM clicking needed - just pure JSX streaming with optional node targeting!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
