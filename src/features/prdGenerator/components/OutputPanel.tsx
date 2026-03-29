import ReactMarkdown from "react-markdown";

interface OutputPanelProps {
  res: string;
  loader: boolean;
  onDownload: () => void;
}

const OutputPanel = ({ res, loader, onDownload }: OutputPanelProps) => {
  if (!res && !loader) {
    return null;
  }

  return (
    <div className="output mt-[30px] flex flex-col items-center px-[20px] w-full">
      <h4 className="text-xl font-semibold mb-4">Generated PRD:</h4>
      <div className="prose dark:prose-invert bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-5 rounded-[10px] min-w-[60vw]">
        {loader ? (
          <p>Generating your PRD...</p>
        ) : (
          <ReactMarkdown>{res}</ReactMarkdown>
        )}
      </div>
      {!loader && res && (
        <button
          onClick={onDownload}
          className="mt-4 p-3 bg-green-600 text-white rounded-[10px] hover:bg-green-700 transition-all duration-300 cursor-pointer"
        >
          Download PRD
        </button>
      )}
    </div>
  );
};

export default OutputPanel;
