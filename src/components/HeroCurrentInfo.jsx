import { useQuery } from "@tanstack/react-query";
import { matchIcons } from "../utils/MatchIcons";
import { IconContext } from "react-icons";
import Spinner from "./Spinner";

export default function HeroCurrentInfo({ locationKey }) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const { data, isLoading, error } = useQuery({
    queryKey: ["currentWeather", locationKey],
    queryFn: () =>
      fetch(
        `https://devapi.qweather.com/v7/weather/now?key=${apiKey}&lang=zh&location=${locationKey}`,
        {
          headers: {
            "Accept-Encoding": "gzip",
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          return data.now;
        }),
  });

  if (isLoading)
    return (
      <div className="mx-auto mt-2">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <p className="text-center">
        `Error fetching current weather data: ${error}`;
      </p>
    );

  if (!data || !Object.keys(data).length)
    return <p className="text-center">No data available</p>;

  let {
    obsTime: currentTime,
    temp: currentTemp,
    text: currentWeather,
    icon: currentIconCode,
  } = data;

  const formatter1 = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formatter2 = new Intl.DateTimeFormat("zh-CN", {
    weekday: "long",
  });
  currentTime = new Date(currentTime);
  const date = formatter1.format(currentTime);
  const weekday = formatter2.format(currentTime);

  currentIconCode = Number(currentIconCode);
  const icon = matchIcons(currentIconCode);

  return (
    <div className="flex flex-col justify-around border-r-2 border-dark-primary pr-3">
      <div className="flex justify-center gap-2">
        <IconContext.Provider
          value={{
            className:
              "mx-auto h-full w-auto text-8xl text-dark-primary min-w-[60px]",
          }}
        >
          {icon}
        </IconContext.Provider>

        <div className="my-auto flex flex-col items-center justify-center gap-2 xs:mx-1 sm:mx-5">
          <div className="text-3xl font-bold xs:text-4xl sm:text-5xl">
            <span>{currentTemp}</span>&deg;C
          </div>
          <div className="text-center text-lg font-semibold sm:text-xl">
            {currentWeather}
          </div>
        </div>
      </div>

      <div className="mt-1 flex flex-wrap justify-evenly gap-x-1 text-center text-lg font-medium sm:mt-3 sm:gap-x-2 sm:text-xl">
        <p>{date}</p>
        <p>{weekday}</p>
      </div>
    </div>
  );
}
