import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Theme from "./Theme";
import CitySearchBar from "./CitySearchBar";
import { IoLocationSharp } from "react-icons/io5";

export default function Header({ locationKey, setLocationKey }) {
  const apiKey = import.meta.env.VITE_API_KEY;

  //控制Tooltip
  const [isOpen, setIsOpen] = useState(false);
  function handleMouseEnter() {
    setTimeout(() => setIsOpen(true), 150);
  }

  function handleMouseLeave() {
    setTimeout(() => setIsOpen(false), 100);
  }
  
  const [locationName, setLocationName] = useState(null);
  async function fetchLocationName() {
    const url = `https://geoapi.qweather.com/v2/city/lookup?key=${apiKey}&lang=zh&location=${locationKey}`;
    const options = {
      headers: {
        "Accept-Encoding": "gzip",
      },
    };
    const res = await fetch(url, options);
    const json = await res.json();
    if (json.code && json.code !== "200") throw new Error(json.code);
    if (json.error && res.status !== 200) throw new Error(json.error);
    const { name, country } = json.location[0];
    console.log(`通过和风天气GeoAPI获取到的城市名为：${name}, ${country}`);
    return { name, country };
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["getLocationName"],
    queryFn: fetchLocationName, //没有参数
    enabled: !locationName, //搜索城市名称并点击提交后没有必要再次通过GeoAPI获取城市名称
  });

  useEffect(() => {
    if (data) {
      setLocationName(data);
    }
  }, [data]);

  if (isLoading) return <span>Loading...</span>;

  if (error) return <span>Error: {error.message}</span>;

  return (
    <nav className="relative mx-auto grid grid-cols-[1.5fr,2fr,1fr] items-center gap-2 px-2 sm:px-6">
      <div className="flex items-center gap-1 overflow-hidden">
        <span>
          <IoLocationSharp className="p-[2px] text-2xl" />
        </span>
        {locationName && (
          <>
            <span
              className="cursor-pointer truncate"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {locationName.name}，{locationName.country}
            </span>
          </>
        )}
      </div>

      <CitySearchBar
        setLocationKey={setLocationKey}
        setLocationName={setLocationName}
      />

      <Theme />

      {/* tooltip */}
      {locationName && isOpen && (
        <div className="absolute top-[120%] z-10 ml-6 rounded-md bg-white px-2 py-1 text-xs">
          {locationName.name}，{locationName.country}
        </div>
      )}
    </nav>
  );
}
