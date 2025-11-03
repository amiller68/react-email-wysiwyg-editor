import { Mail, Code, Eye, Download, FileCode } from 'lucide-react';

interface HeaderProps {
  showCode: boolean;
  onToggleView: () => void;
  onExportJSX: () => void;
  onExportHTML: () => void;
  hasComponents: boolean;
}

export const Header = ({ showCode, onToggleView, onExportJSX, onExportHTML, hasComponents }: HeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">React Email Builder</h1>
          <p className="text-xs text-gray-500">Build emails visually</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleView}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          {showCode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
          {showCode ? 'Preview' : 'Code'}
        </button>
        <button
          onClick={onExportJSX}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-all"
          disabled={!hasComponents}
        >
          <FileCode className="w-4 h-4" />
          Export JSX
        </button>
        <button
          onClick={onExportHTML}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-all"
          disabled={!hasComponents}
        >
          <Download className="w-4 h-4" />
          Export HTML
        </button>
      </div>
    </div>
  );
};
