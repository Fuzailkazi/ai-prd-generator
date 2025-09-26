import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  const [isDark, setIsDark] = useState(true);
  return (
    <>
      <div
        className={`min-h-screen font-sans overflow-x-hidden ${
          isDark
            ? "bg-[hsl(240,6%,5%)] text-[hsl(0,0%,98%)]"
            : "bg-white text-black"
        }`}
      >
        <Navbar isDark={isDark} setIsDark={setIsDark} />
      </div>
    </>
  );
}

export default App;
