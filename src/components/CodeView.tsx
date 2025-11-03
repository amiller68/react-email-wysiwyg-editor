interface CodeViewProps {
  code: string;
}

export const CodeView = ({ code }: CodeViewProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="max-w-5xl mx-auto">
        <pre className="bg-gray-800 text-green-300 p-8 rounded-xl text-sm overflow-x-auto font-mono whitespace-pre shadow-2xl border border-gray-700">
          {code}
        </pre>
      </div>
    </div>
  );
};
