import { useQuery } from "@tanstack/react-query";
import Spinner from "./Spinner";
import { IconContext } from "react-icons";
import { matchIcons } from "../utils/MatchIcons";

export default function DailyCards({ locationKey }) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const { data, isLoading, error } = useQuery({
    queryKey: ["7DayWeather", locationKey],
    queryFn: async () => {
      const res = await fetch(
        `https://devapi.qweather.com/v7/weather/7d?key=${apiKey}&lang=zh&location=${locationKey}`,
        {
          headers: {
            "Accept-Encoding": "gzip",
          },
        },
      );
      const data = await res.json();
      return data.daily;
    },
  });

  if (isLoading)
    return (
      <div className="mx-auto mt-12">
        <Spinner />
      </div>
    );
  if (error) return `Error fetching 7-day weather data: ${error}`;

  if (!data || !data.length) return "No data available.";

  const cards = [];
  data.forEach((day) => {
    let { fxDate: date, tempMax: dayTemp, iconDay: dayIconCode } = day;

    date = new Date(date);
    const formatter = Intl.DateTimeFormat("zh-CN", {
      weekday: "long",
    });
    const weekday = formatter.format(date);

    dayIconCode = Number(dayIconCode);
    const dayIcon = matchIcons(dayIconCode);
    cards.push({ weekday, dayTemp, dayIcon });
  });

  return (
    <section className="grid grid-cols-4 gap-3 p-5 sm:grid-cols-5 md:grid-cols-7">
      {cards.map((card, index) => (
        <div
          className="h-36 space-y-1 rounded-xl border-2 border-dark-primary p-1 text-center xs:p-3"
          key={index}
        >
          <div className="h-1/2 p-1 xs:p-0">
            <IconContext.Provider
              value={{
                className: "m-auto w-auto h-full",
                style: {
                  fill: "var(--dark-primary)",
                  //可以加stroke和strokeWidth，但是无论如何都会溢出边缘
                },
              }}
            >
              {card.dayIcon}
            </IconContext.Provider>
          </div>

          <div>{index === 0 ? "今天" : card.weekday}</div>

          <div className="text-xl">
            <span>{card.dayTemp}</span>&deg;C
          </div>
        </div>
      ))}
    </section>
  );
}
