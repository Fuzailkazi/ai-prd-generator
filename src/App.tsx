import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { Twitter } from "lucide-react";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [prompt, setPrompt] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loader, setLoader] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [res, setRes] = useState("");

  const generate = async () => {
    if (!prompt || prompt.trim() === "") {
      alert("You must provide a product idea!");
      return;
    }

    setLoader(true);

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Full PRD template instruction
    const templatePrompt = `
## OVERVIEW
You are a senior product manager and technical specification expert. 
Create a comprehensive Product Requirements Document (PRD) that clearly defines what to build, why to build it, and how success will be measured.

## USER INPUT
${prompt}

## OUTPUT STRUCTURE
Generate the PRD following this structure EXACTLY:

1. Executive Summary
   - Product Vision
   - Strategic Alignment
   - Resource Requirements

2. Problem Statement & Opportunity
   - Problem Definition
   - Opportunity Analysis
   - Success Criteria

3. User Requirements & Stories
   - Primary User Personas
   - User Journey Mapping
   - Core User Stories
   - User Story Examples

4. Functional Requirements
   - Core Features (Must Have)
   - Secondary Features (Nice to Have)
   - Feature Prioritization

5. Technical Requirements
   - Architecture Specifications
   - API Requirements
   - Data Requirements
   - Performance Specifications

6. User Experience Requirements
   - Design Principles
   - Interface Requirements
   - Usability Criteria

7. Non-Functional Requirements
   - Security Requirements
   - Performance Requirements
   - Reliability Requirements
   - Scalability Requirements

8. Success Metrics & Analytics
   - Key Performance Indicators
   - Analytics Implementation
   - Success Measurement

9. Implementation Plan
   - Development Phases
   - Resource Allocation
   - Timeline and Milestones

10. Risk Assessment & Mitigation
   - Technical Risks
   - Business Risks
   - Mitigation Strategies

## PRD TEMPLATE STRUCTURE
Include Product, Owner, Status, Last Updated, Vision, Success Metrics, Problem, Opportunity, Solution, Primary Users, Key Use Cases, Must Have Features, Should Have Features, Architecture, Dependencies, Performance, Primary/Secondary Metrics, Timeline.

## QUALITY CHECKLIST
- Ensure Problem, Solution, Requirements, Acceptance Criteria, Technical Feasibility, Success Metrics, Risks, Stakeholder Alignment are all included.

## EXAMPLE USER STORY
Include Epic, Story, Acceptance Criteria, and Definition of Done.

**Generate a complete PRD following this template using the user's input.**
`;
    try {
      const result = await model.generateContent(templatePrompt);
      setRes(result.response.text());
      console.log("Generated PRD:", res);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPRD = () => {
    const element = document.createElement("a");
    const file = new Blob([res], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "PRD.txt"; // you can also use .md
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <div
        className={`min-h-screen font-sans overflow-x-hidden ${
          isDark ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <Navbar isDark={isDark} setIsDark={setIsDark} />
        <div className="flex items-center justify-center flex-col min-h-[30vh]">
          <h3
            style={{ lineHeight: 1 }}
            className="text-[40px] font-[200] text-center"
          >
            AI For Generating
            <br />{" "}
            <span className="text-green-600 font-unbounded">
              Products Requirement Documents
            </span>
          </h3>
        </div>
        <div className="textarea flex items-center justify-center flex-col mt-[10px]">
          <textarea
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            value={prompt}
            name="prompt"
            className="bg-[#f4f4f4] text-gray-900 border-0 outline-0 min-w-[50vw] min-h-[130px] p-[20px] rounded-[10px]"
            placeholder="Describe the product feature or idea you want a PRD for..."
          ></textarea>
          <button
            onClick={generate}
            className="p-[10px] bg-green-600 text-white rounded-[10px] mt-[20px] min-w-[200px] trsnsition-all duration-300 hover:bg-green-700 cursor-pointer"
          >
            {loader ? "Generating..." : "Generate"}
          </button>
        </div>
        {/* Display the PRD output */}
        {res && (
          <div className="output mt-[30px] flex flex-col items-center px-[20px] w-full">
            <h4 className="text-xl font-semibold mb-4">Generated PRD:</h4>
            <div className="prose dark:prose-invert bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-5 rounded-[10px] min-w-[60vw]">
              <ReactMarkdown>{res}</ReactMarkdown>
            </div>
            <button
              onClick={downloadPRD}
              className="mt-4 p-3 bg-green-600 text-white rounded-[10px] hover:bg-green-700 transition-all duration-300 cursor-pointer"
            >
              Download PRD
            </button>
          </div>
        )}
        <footer className="py-5 text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
            Made with <span className="text-red-500">❤️</span> by{" "}
            <span className="font-semibold">@fuzailkazi_</span>
            <a
              href="https://twitter.com/fuzailkazi_"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 hover:text-blue-500 transition-colors"
            >
              <Twitter size={18} />
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
