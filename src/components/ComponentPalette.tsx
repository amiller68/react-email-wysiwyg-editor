import { Heading, Type, RectangleHorizontal, Image, Minus, Layers } from 'lucide-react';
import type { ComponentType, ComponentTypeDefinition } from '../types';
import { ValidationPanel } from './ValidationPanel';
import type { ValidationError } from '../types';

interface ComponentPaletteProps {
  onAddComponent: (type: ComponentType) => void;
  validationErrors: ValidationError[];
}

const componentTypes: ComponentTypeDefinition[] = [
  { id: 'heading', icon: Heading, label: 'Heading', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { id: 'text', icon: Type, label: 'Text', color: 'bg-gradient-to-br from-gray-500 to-gray-600' },
  { id: 'button', icon: RectangleHorizontal, label: 'Button', color: 'bg-gradient-to-br from-green-500 to-green-600' },
  { id: 'image', icon: Image, label: 'Image', color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  { id: 'divider', icon: Minus, label: 'Divider', color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
];

export const ComponentPalette = ({ onAddComponent, validationErrors }: ComponentPaletteProps) => {
  return (
    <div className="w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-blue-600" />
        Components
      </h3>
      <div className="space-y-3">
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
      <ValidationPanel errors={validationErrors} />
    </div>
  );
};
