import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import type { ComponentType, EmailComponent } from './types';
import { Header } from './components/Header';
import { ComponentPalette } from './components/ComponentPalette';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { CodeView } from './components/CodeView';
import { getDefaultProps } from './lib/defaults';
import { validateEmail } from './lib/validation';
import { generateReactEmailCode } from './lib/codeGenerator';
import { generateHTML } from './lib/htmlGenerator';

function App() {
  const [components, setComponents] = useState<EmailComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ReturnType<typeof validateEmail>>([]);

  useEffect(() => {
    setValidationErrors(validateEmail(components));
  }, [components]);

  const addComponent = (type: ComponentType) => {
    const newComponent: EmailComponent = {
      id: nanoid(),
      type,
      props: getDefaultProps(type),
    };
    setComponents([...components, newComponent]);
    setSelectedId(newComponent.id);
  };

  const updateComponent = (id: string, newProps: Partial<any>) => {
    const updated = components.map((c) =>
      c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c
    );
    setComponents(updated);
  };

  const deleteComponent = (id: string) => {
    const filtered = components.filter((c) => c.id !== id);
    setComponents(filtered);
    setSelectedId(null);
  };

  const exportJSX = () => {
    const code = generateReactEmailCode(components);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.jsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportHTML = () => {
    const html = generateHTML(components);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedComponent = components.find((c) => c.id === selectedId);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        showCode={showCode}
        onToggleView={() => setShowCode(!showCode)}
        onExportJSX={exportJSX}
        onExportHTML={exportHTML}
        hasComponents={components.length > 0}
      />
      <div className="flex-1 flex overflow-hidden">
        <ComponentPalette onAddComponent={addComponent} validationErrors={validationErrors} />
        <div className="flex-1 flex overflow-hidden">
          {showCode ? (
            <CodeView code={generateReactEmailCode(components)} />
          ) : (
            <Canvas
              components={components}
              selectedId={selectedId}
              onSelectComponent={setSelectedId}
              onDeleteComponent={deleteComponent}
            />
          )}
        </div>
        {selectedComponent && !showCode && (
          <PropertiesPanel
            component={selectedComponent}
            onUpdate={(newProps) => updateComponent(selectedId!, newProps)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
