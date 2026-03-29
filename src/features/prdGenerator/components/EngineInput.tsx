import type { ChangeEventHandler } from "react";

interface EngineInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  loader: boolean;
}

const EngineInput = ({
  prompt,
  onPromptChange,
  onGenerate,
  loader,
}: EngineInputProps) => {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    onPromptChange(event.target.value);
  };

  return (
    <div className="textarea flex items-center justify-center flex-col mt-[10px]">
      <textarea
        id="prompt"
        name="prompt"
        value={prompt}
        onChange={handleChange}
        className="bg-[#f4f4f4] text-gray-900 border-0 outline-0 min-w-[50vw] min-h-[130px] p-[20px] rounded-[10px]"
        placeholder="Describe the product feature or idea you want a PRD for..."
        aria-label="Describe your product idea"
        disabled={loader}
      ></textarea>
      <button
        onClick={onGenerate}
        className="p-[10px] bg-green-600 text-white rounded-[10px] mt-[20px] min-w-[200px] transition-all duration-300 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
        disabled={loader}
      >
        {loader ? "Generating..." : "Generate"}
      </button>
    </div>
  );
};

export default EngineInput;
