import { CiSearch } from "react-icons/ci";
import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";

function CitySearchBar({ setLocationKey, setLocationName }) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [searchInput, setSearchInput] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1); //按键时用
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDebouncedTerm("");
        setHighlightedIndex(-1);
      }
    }

    function handleScroll() {
      setDebouncedTerm("");
      setHighlightedIndex(-1);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInputChange = debounce((value) => {
    setDebouncedTerm(value);
  }, 300);

  function onInputChange(e) {
    const value = e.target.value;
    setSearchInput(value);
    handleInputChange(value);
    setHighlightedIndex(-1);
  }

  function selectLocation(data) {
    console.log(
      `你已选择需要查询的城市。城市名为：${data.name}，${data.country}`,
    );
    setLocationKey(data.id); //提供location id以便精确获取天气信息。用经纬度不准确
    setLocationName({
      name: data.name,
      country: data.country,
    });
    setSearchInput("");
    setDebouncedTerm("");
    setHighlightedIndex(-1);
  }

  async function fetchLocations(input) {
    const url = `https://geoapi.qweather.com/v2/city/lookup?key=${apiKey}&lang=zh&location=${input.trim()}`;
    const options = {
      headers: {
        "Accept-Encoding": "gzip",
      },
    };
    const res = await fetch(url, options);
    const json = await res.json();
    if (json.code && json.code !== "200") throw new Error(json.code);
    if (json.error && res.status !== 200) throw new Error(json.error);
    return json.location; //返回值是一个location列表
  }

  const { data, error } = useQuery({
    queryKey: ["fetchLocationList", debouncedTerm], // Dynamic query key
    queryFn: () => fetchLocations(debouncedTerm),
    enabled: debouncedTerm.length > 0,
    staleTime: 5 * 60 * 1000, // Cache suggestions for 5 minutes
  });

  function onKeyPress(e) {
    if (!data) return;
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => Math.min(prev + 1, data.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      selectLocation(data[highlightedIndex]);
    }
  }

  return (
    <div ref={menuRef} id="search-bar" className="relative w-full max-w-60">
      <input
        type="text"
        className="relative z-10 h-8 w-full rounded-full py-1 pl-10 pr-3 outline-none focus:outline-none focus:ring-2 focus:ring-dark-primary"
        placeholder="输入城市名称"
        value={searchInput}
        onChange={onInputChange}
        onKeyDown={onKeyPress}
      />

      <div className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center gap-[2px]">
        <CiSearch className="h-6 w-auto" />
        <div className="h-5 w-[2px] bg-muted"></div>
      </div>
      {debouncedTerm && (
        <div className="absolute top-1/2 z-0 w-full rounded-b-md bg-background pb-1 pt-5 shadow-md">
          {error ? (
            // <p className="py-1 pl-10 pr-3 text-sm">Error: {error.message}</p>
            <p className="py-1 pl-10 pr-3 text-sm">No results found</p>
          ) : (
            <ul className="text-sm">
              {data?.map((location, index) => (
                <li
                  key={location.id}
                  className={`cursor-pointer py-1 pl-10 pr-3 hover:bg-accent active:bg-accent ${highlightedIndex === index ? "bg-accent" : ""}`}
                  onClick={() => selectLocation(location)}
                >
                  {location.name}，{location.country}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default CitySearchBar;
