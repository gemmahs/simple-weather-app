import { useState, useEffect, createContext } from "react";
import "./App.css";
import Spinner from "./components/Spinner";
import Header from "./components/Header";
import HeroCurrentInfo from "./components/HeroCurrentInfo";
import HeroDailyInfo from "./components/HeroDailyInfo";
import DailyCards from "./components/DailyCards";
import HourlyTable from "./components/HourlyTable";
import useGeolocation from "./hooks/useGeolocation";

export const ThemeContext = createContext();
export default function App() {
  const { location: currentLocation, error } = useGeolocation();
  
  // 字符串。最初加载时是“经度,纬度”，用户搜索之后变成location id（确保搜索天气的准确性）。在child组件中叫做 locationKey
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "cool";
  });

  //每次Theme改变后更新localStorage
  useEffect(() => localStorage.setItem("theme", theme), [theme]);

  useEffect(() => {
    if (currentLocation && !searchedLocation) {
      setSearchedLocation(`${currentLocation.lon},${currentLocation.lat}`);
    }
  }, [currentLocation]);

  if (error) return <div className="my-6 text-center">Error: {error}</div>;

  console.log(`当前城市信息为：${searchedLocation}`);

  return (
    <div
      className={`min-h-screen bg-bg-primary ${theme === "warm" ? "theme-warm" : ""}`}
    >
      <main className="mx-auto max-w-[800px] py-4 text-basic">
        {!searchedLocation ? (
          <>
            <p className="mx-auto my-3 text-center text-xl">
              正在获取当前的位置...
            </p>

            <div className="mx-auto mt-6">
              <Spinner />
            </div>
          </>
        ) : (
          <>
            <ThemeContext.Provider value={{ theme, setTheme }}>
              <Header
                locationKey={searchedLocation}
                setLocationKey={setSearchedLocation}
              />
            </ThemeContext.Provider>

            <header className="grid grid-cols-2 p-5">
              <HeroCurrentInfo locationKey={searchedLocation} />
              <HeroDailyInfo locationKey={searchedLocation} />
            </header>
            <DailyCards locationKey={searchedLocation} />
            <HourlyTable locationKey={searchedLocation} />
          </>
        )}
      </main>
    </div>
  );
}
