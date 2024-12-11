import {
  FaSun,
  FaMoon,
  FaWind,
  FaCloud,
  FaCloudRain,
  FaCloudShowersHeavy,
  FaRegSnowflake,
  FaSmog,
} from "react-icons/fa6";

export function matchIcons(iconCode) {
  switch (iconCode) {
    case 100:
    case 900:
    case 999:
      return <FaSun />;
    case 150:
      return <FaMoon />;
    case 503:
    case 504:
    case 507:
    case 508:
      return <FaWind />;
    case 101:
    case 102:
    case 103:
    case 104:
    case 151:
    case 152:
    case 153:
      return <FaCloud />;
    case 305:
    case 306:
    case 307:
    case 309:
    case 314:
    case 315:
    case 399:
      return <FaCloudRain />;
    case 300:
    case 301:
    case 302:
    case 303:
    case 304:
    case 308:
    case 310:
    case 311:
    case 312:
    case 313:
    case 316:
    case 317:
    case 318:
    case 350:
    case 351:
      return <FaCloudShowersHeavy />;
    case 500:
    case 501:
    case 502:
    case 509:
    case 510:
    case 511:
    case 512:
    case 513:
    case 514:
    case 515:
      return <FaSmog />;
    case 400:
    case 401:
    case 402:
    case 403:
    case 404:
    case 405:
    case 406:
    case 407:
    case 408:
    case 409:
    case 410:
    case 456:
    case 457:
    case 499:
    case 901:
      return <FaRegSnowflake />;
  }
}
