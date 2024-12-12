import { useQuery } from "@tanstack/react-query";
import { IconContext } from "react-icons";
import { matchIcons } from "../utils/MatchIcons";
import Spinner from "./Spinner";

export default function HourlyTable({ locationKey }) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const { data, isLoading, error } = useQuery({
    queryKey: ["24HourWeather", locationKey],
    queryFn: () =>
      fetch(
        `https://devapi.qweather.com/v7/weather/24h?key=${apiKey}&lang=zh&location=${locationKey}`,
        {
          headers: {
            "Accept-Encoding": "gzip",
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          return data.hourly;
        }),
  });

  if (isLoading)
    return (
      <div className="mx-auto mt-12 w-12">
        <Spinner />
      </div>
    );
  if (error) return `Error fetching 24-hour weather data: ${error}`;

  if (!data || !data.length) return "No data available.";

  const rows = [];
  data.forEach((hourData) => {
    let {
      fxTime,
      temp: hourTemp,
      icon: hourIconCode,
      humidity: hourHumidity,
      windSpeed: hourWindSpeed,
      precip: hourPrecip,
    } = hourData;

    const date = new Date(fxTime);
    const formatter1 = new Intl.DateTimeFormat("zh-CN", {
      weekday: "long",
    });
    const formatter2 = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: true,
    });
    const weekday = formatter1.format(date);
    const hour = formatter2.format(date);
    hourIconCode = Number(hourIconCode);
    const hourIcon = matchIcons(hourIconCode);
    rows.push({
      weekday,
      hour,
      hourTemp,
      hourIcon,
      hourHumidity,
      hourWindSpeed,
      hourPrecip,
    });
  });

  return (
    <table className="w-full text-center">
      <thead className="sticky top-0">
        <tr className="h-14 bg-row-1 text-lg">
          <th className="font-medium">时间</th>
          <th className="font-medium">天气</th>
          <th className="font-medium">温度</th>
          <th className="font-medium">湿度</th>
          <th className="font-medium">风速</th>
          <th className="font-medium">降雨</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          return (
            <tr className="odd:bg-row-2 even:bg-row-1" key={index}>
              <td>
                <div className="text-base">{row.weekday}</div>
                <div className="text-base xs:text-lg">{row.hour}</div>
              </td>
              <td>
                <IconContext.Provider
                  value={{
                    className: "m-auto py-2 h-[60px] w-auto text-dark-primary",
                  }}
                >
                  {row.hourIcon}
                </IconContext.Provider>
              </td>
              <td>
                <span className="text-xl">{row.hourTemp}</span>
                <span>&deg;C</span>
              </td>
              <td>
                <span className="text-xl">{row.hourHumidity}</span>
                <span>%</span>
              </td>
              <td>
                <span className="text-xl">{row.hourWindSpeed}</span>
                <span> km/h</span>
              </td>
              <td>
                <span className="text-xl">{row.hourPrecip}</span>
                <span> mm</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
