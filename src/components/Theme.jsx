import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../App.jsx";

export default function Theme() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [menuHidden, setMenuHidden] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuHidden(true);
      }
    }

    function handleScroll() {
      setMenuHidden(true);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex justify-end">
      <div
        ref={menuRef}
        className="relative flex cursor-pointer items-center p-1"
        onClick={() => setMenuHidden((prev) => !prev)}
      >
        <span className="pr-1">主题</span>
        <IoIosArrowBack className={`${menuHidden ? "" : "-rotate-90"}`} />
        {!menuHidden && (
          <div className="absolute right-1 top-[29px] flex w-[70px] flex-col items-center gap-2 rounded-sm bg-background py-2 text-sm shadow-md">
            <div
              className={`flex items-center justify-between gap-2 px-3 py-1 hover:rounded-sm hover:bg-accent ${theme === "cool" ? "bg-accent" : ""}`}
              onClick={() => setTheme("cool")}
            >
              <span className="h-3 w-3 rounded-full bg-[#c5dff3]"></span>
              <span>冷</span>
            </div>
            <div
              className={`flex items-center justify-between gap-2 px-3 py-1 hover:rounded-sm hover:bg-accent ${theme === "warm" ? "bg-accent" : ""}`}
              onClick={() => setTheme("warm")}
            >
              <span className="h-3 w-3 rounded-full bg-[#f1d69c]"></span>
              <span>暖</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
