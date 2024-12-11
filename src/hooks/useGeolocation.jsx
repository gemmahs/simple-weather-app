import { useState, useEffect } from "react";

export default function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  function positionSuccess(position) {
    const { latitude, longitude } = position.coords;
    const lat = Math.round(latitude * 100) / 100;
    const lon = Math.round(longitude * 100) / 100;
    setLocation({ lat, lon });
    console.log(`Success. Your current location is ${lat}, ${lon}`);
  }

  function positionError(err) {
    console.error("Geolocation error:", err);
    setError(
      "There was an error getting your location. Please allow us to use your location and refresh the page.",
    );
  }

  useEffect(() => {
    //试了几次，需要挺长时间才能获取到坐标
    console.log("Start getting your current location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return { location, error };
}
