import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../App.jsx";

const THEMES = [
  { theme: "cool", desc: "冷", color: "#c5dff3" },
  { theme: "warm", desc: "暖", color: "#f1d69c" },
  { theme: "mint", desc: "薄荷", color: "#dbfaf4" },
];
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
        <IoIosArrowBack
          className={`transition-transform ${menuHidden ? "" : "-rotate-90"}`}
        />
        {!menuHidden && (
          <div className="absolute right-1 top-[29px] flex w-[80px] flex-col justify-center gap-y-1 rounded-sm bg-background px-1 py-2 text-sm shadow-md">
            {THEMES.map((item) => (
              <div
                key={item.theme}
                className={`flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-accent ${theme === item.theme ? "font-semibold" : ""}`}
                onClick={() => setTheme(item.theme)}
              >
                <span
                  className={`h-3 w-3 rounded-full bg-[${item.color}]`}
                ></span>
                <span>{item.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
