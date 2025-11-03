import { AlertCircle, CheckCircle } from 'lucide-react';
import type { ValidationError } from '../types';

interface ValidationPanelProps {
  errors: ValidationError[];
}

export const ValidationPanel = ({ errors }: ValidationPanelProps) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
        {errors.length === 0 ? (
          <>
            <div className="bg-green-100 p-1.5 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-green-700">All Valid</span>
          </>
        ) : (
          <>
            <div className="bg-orange-100 p-1.5 rounded-lg">
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-orange-700">{errors.length} Issue{errors.length > 1 ? 's' : ''}</span>
          </>
        )}
      </h3>
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, idx) => (
            <div key={idx} className="text-xs text-orange-800 bg-orange-50 p-3 rounded-lg border border-orange-200">
              {error.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
