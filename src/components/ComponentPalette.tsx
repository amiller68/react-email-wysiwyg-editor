import { Heading, Type, RectangleHorizontal, Image, Minus, Layers, Sparkles } from 'lucide-react';
import type { ComponentType, ComponentTypeDefinition } from '../types';
import { ValidationPanel } from './ValidationPanel';
import type { ValidationError } from '../types';
import { templates, type TemplateKey } from '../lib/templates';
import { parseJSX } from '../lib/jsxParser';

interface ComponentPaletteProps {
  onAddComponent: (type: ComponentType) => void;
  onLoadTemplate: (components: any[]) => void;
  validationErrors: ValidationError[];
}

const componentTypes: ComponentTypeDefinition[] = [
  { id: 'heading', icon: Heading, label: 'Heading', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { id: 'text', icon: Type, label: 'Text', color: 'bg-gradient-to-br from-gray-500 to-gray-600' },
  { id: 'button', icon: RectangleHorizontal, label: 'Button', color: 'bg-gradient-to-br from-green-500 to-green-600' },
  { id: 'image', icon: Image, label: 'Image', color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  { id: 'divider', icon: Minus, label: 'Divider', color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
];

export const ComponentPalette = ({ onAddComponent, onLoadTemplate, validationErrors }: ComponentPaletteProps) => {
  const loadTemplate = (key: TemplateKey) => {
    const template = templates[key];
    const components = parseJSX(template.jsx);
    onLoadTemplate(components);
  };

  return (
    <div className="w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-blue-600" />
        Components
      </h3>
      <div className="space-y-3 mb-6">
        {componentTypes.map((comp) => (
          <button
            key={comp.id}
            onClick={() => onAddComponent(comp.id)}
            className="w-full flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-xl transition-all border border-gray-200 hover:border-gray-300 hover:shadow-md group"
          >
            <div className={`${comp.color} p-2.5 rounded-lg shadow-sm`}>
              <comp.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{comp.label}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6 mb-6">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Quick Start Templates
        </h3>
        <div className="space-y-2">
          {(Object.keys(templates) as TemplateKey[]).map((key) => (
            <button
              key={key}
              onClick={() => loadTemplate(key)}
              className="w-full text-left p-3 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 rounded-lg transition-all border border-purple-200 hover:border-purple-300"
            >
              <div className="font-semibold text-sm text-purple-900">{templates[key].name}</div>
              <div className="text-xs text-purple-700 mt-0.5">{templates[key].description}</div>
            </button>
          ))}
        </div>
      </div>

      <ValidationPanel errors={validationErrors} />
    </div>
  );
};
