import { Mail } from 'lucide-react';
import type { EmailComponent } from '../types';

interface CanvasProps {
  components: EmailComponent[];
  selectedId: string | null;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
}

export const Canvas = ({ components, selectedId, onSelectComponent, onDeleteComponent }: CanvasProps) => {
  const renderComponent = (comp: EmailComponent) => {
    switch (comp.type) {
      case 'heading': {
        const props = comp.props as {
          as: string;
          text: string;
          align: string;
          color: string;
          fontSize: string;
        };
        const HeadingTag = props.as as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            className="font-bold mb-4"
            style={{
              textAlign: props.align as any,
              color: props.color,
              fontSize: props.fontSize,
            }}
          >
            {props.text}
          </HeadingTag>
        );
      }
      case 'text': {
        const props = comp.props as {
          text: string;
          align: string;
          color: string;
          fontSize: string;
        };
        return (
          <p
            className="mb-4"
            style={{
              textAlign: props.align as any,
              color: props.color,
              fontSize: props.fontSize,
            }}
          >
            {props.text}
          </p>
        );
      }
      case 'button': {
        const props = comp.props as {
          href: string;
          text: string;
          bgColor: string;
          textColor: string;
          padding: string;
        };
        return (
          <div style={{ textAlign: 'center' }} className="mb-4">
            <a
              href={props.href}
              className="inline-block rounded"
              style={{
                backgroundColor: props.bgColor,
                color: props.textColor,
                padding: props.padding,
                textDecoration: 'none',
              }}
            >
              {props.text}
            </a>
          </div>
        );
      }
      case 'image': {
        const props = comp.props as {
          src: string;
          alt: string;
          width: string;
        };
        return (
          <img
            src={props.src}
            alt={props.alt}
            className="mb-4"
            style={{ width: props.width + 'px', maxWidth: '100%' }}
          />
        );
      }
      case 'divider': {
        const props = comp.props as {
          borderColor: string;
          borderWidth: string;
        };
        return (
          <hr
            className="my-4"
            style={{
              borderColor: props.borderColor,
              borderWidth: props.borderWidth,
              borderStyle: 'solid',
            }}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 h-1"></div>
          <div className="p-12">
            {components.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Building Your Email</h3>
                <p className="text-gray-500">Select components from the left sidebar to begin</p>
              </div>
            ) : (
              components.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => onSelectComponent(comp.id)}
                  className={`relative group cursor-pointer p-3 rounded-lg transition-all ${
                    selectedId === comp.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {renderComponent(comp)}
                  {selectedId === comp.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteComponent(comp.id);
                      }}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-md transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
