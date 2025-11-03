import type { EmailComponent } from '../types';

interface PropertiesPanelProps {
  component: EmailComponent;
  onUpdate: (props: Partial<any>) => void;
}

export const PropertiesPanel = ({ component, onUpdate }: PropertiesPanelProps) => {
  return (
    <div className="w-80 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Properties</h3>

      {component.type === 'heading' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Text</label>
            <input
              type="text"
              value={(component.props as any).text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Heading Level</label>
            <select
              value={(component.props as any).as}
              onChange={(e) => onUpdate({ as: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size</label>
            <input
              type="text"
              value={(component.props as any).fontSize}
              onChange={(e) => onUpdate({ fontSize: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="24px"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Align</label>
            <select
              value={(component.props as any).align}
              onChange={(e) => onUpdate({ align: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
            <input
              type="color"
              value={(component.props as any).color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="w-full h-12 rounded-lg cursor-pointer border border-gray-300"
            />
          </div>
        </div>
      )}

      {component.type === 'text' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Text</label>
            <textarea
              value={(component.props as any).text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size</label>
            <input
              type="text"
              value={(component.props as any).fontSize}
              onChange={(e) => onUpdate({ fontSize: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="14px"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Align</label>
            <select
              value={(component.props as any).align}
              onChange={(e) => onUpdate({ align: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
            <input
              type="color"
              value={(component.props as any).color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="w-full h-12 rounded-lg cursor-pointer border border-gray-300"
            />
          </div>
        </div>
      )}

      {component.type === 'button' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
            <input
              type="text"
              value={(component.props as any).text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">URL</label>
            <input
              type="url"
              value={(component.props as any).href}
              onChange={(e) => onUpdate({ href: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Padding</label>
            <input
              type="text"
              value={(component.props as any).padding}
              onChange={(e) => onUpdate({ padding: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="12px 24px"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={(component.props as any).bgColor}
              onChange={(e) => onUpdate({ bgColor: e.target.value })}
              className="w-full h-12 rounded-lg cursor-pointer border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
            <input
              type="color"
              value={(component.props as any).textColor}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className="w-full h-12 rounded-lg cursor-pointer border border-gray-300"
            />
          </div>
        </div>
      )}

      {component.type === 'image' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              value={(component.props as any).src}
              onChange={(e) => onUpdate({ src: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Alt Text</label>
            <input
              type="text"
              value={(component.props as any).alt}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Describe the image"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Width (px)</label>
            <input
              type="number"
              value={(component.props as any).width}
              onChange={(e) => onUpdate({ width: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="600"
            />
          </div>
        </div>
      )}

      {component.type === 'divider' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Border Color</label>
            <input
              type="color"
              value={(component.props as any).borderColor}
              onChange={(e) => onUpdate({ borderColor: e.target.value })}
              className="w-full h-12 rounded-lg cursor-pointer border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Border Width</label>
            <select
              value={(component.props as any).borderWidth}
              onChange={(e) => onUpdate({ borderWidth: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="1px">Thin (1px)</option>
              <option value="2px">Medium (2px)</option>
              <option value="4px">Thick (4px)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
