import { useQuery } from "@tanstack/react-query";
import Spinner from "./Spinner";

export default function HeroDailyInfo({ locationKey }) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const { data, isLoading, error } = useQuery({
    queryKey: ["7DayWeather", locationKey],
    queryFn: () =>
      fetch(
        `https://devapi.qweather.com/v7/weather/7d?key=${apiKey}&lang=zh&location=${locationKey}`,
        {
          headers: {
            "Accept-Encoding": "gzip",
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          return data.daily;
        }),
  });

  if (isLoading)
    return (
      <div className="mx-auto mt-2">
        <Spinner />
      </div>
    );
  if (error) return `Error fetching 7-day weather data: ${error}`;

  if (!data || !data.length) return "No data available.";

  const {
    tempMax: maxTemp,
    tempMin: minTemp,
    windDirDay: windDirection,
    windSpeedDay: windSpeed,
    humidity,
    precip,
  } = data[0];

  return (
    <div className="ml-3 grid grid-cols-4 place-items-center text-center text-sm sm:text-base">
      <div>风向</div>
      <div className="col-span-2">最高温度</div>
      <div>风速</div>

      <div>
        <span className="text-sm font-semibold xs:text-base sm:text-lg">
          {windDirection}
        </span>
      </div>

      <div className="col-span-2">
        <span className="text-lg font-semibold sm:text-2xl">{maxTemp}</span>
        <span>&deg;C</span>
      </div>

      <div>
        <span className="text-lg font-semibold sm:text-2xl">{windSpeed}</span>
        <span> km/h</span>
      </div>

      <div className="sm:mt-4">湿度</div>
      <div className="col-span-2 sm:mt-4">最低温度</div>
      <div className="sm:mt-4">降雨</div>

      <div>
        <span className="text-lg font-semibold sm:text-2xl">{humidity}</span>
        <span>%</span>
      </div>

      <div className="col-span-2">
        <span className="text-lg font-semibold sm:text-2xl">{minTemp}</span>
        <span>&deg;C</span>
      </div>

      <div>
        <span className="text-lg font-semibold sm:text-2xl">{precip}</span>
        <span> mm</span>
      </div>
    </div>
  );
}
