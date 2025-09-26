import React, { type Dispatch, type SetStateAction } from "react";
import { IoMdMoon } from "react-icons/io";
import { MdWbSunny } from "react-icons/md";

interface NavbarProps {
  isDark: boolean;
  setIsDark: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ isDark, setIsDark }: NavbarProps) => {
  return (
    <header className="text-gray-600 body-font px-[100px]">
      <div className="container mx-auto flex p-5 flex-col md:flex-row items-center">
        {/* Logo */}
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <span className="ml-3 font-unbounded text-3xl bg-gradient-to-br from-green-300 to-green-700 bg-clip-text text-transparent">
            ChatPRD
          </span>
        </a>

        {/* Toggle Button */}
        <div className="inline-flex items-center ml-auto border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0">
          <i
            onClick={() => setIsDark(!isDark)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 border ${
              isDark
                ? "border-[hsl(240,6%,20%)] bg-[hsl(240,6%,15%)] text-white"
                : "border-gray-300 hover:bg-gray-200 text-gray-800"
            }`}
          >
            {isDark ? <IoMdMoon /> : <MdWbSunny />}
          </i>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
