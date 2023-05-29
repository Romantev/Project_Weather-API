const apiKey = "3ce489c1864798a092ec39d1700a891f";

//! function for coordinates
document.querySelector("button").addEventListener("click", () => {
  const input = document.querySelector(".input").value;
  let coordinates = [];

  //! check if city or zip code

  //! city
  if (isNaN(input)) {
    const city = input;
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const lat = data[0].lat;
        const lon = data[0].lon;
        coordinates.push(lat, lon);
      })
      .then(() => fetchWeatherData());

    //! zip code
  } else {
    const zipCode = Number(input);
    fetch(
      `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},DE&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const lat = data.lat;
        const lon = data.lon;
        coordinates.push(lat, lon);
      })
      .then(() => fetchWeatherData());
  }

  //! fetch for data
  const fetchWeatherData = () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        //! data
        const temp = Math.round(data.main.temp - 273.15);
        const cloud = data.clouds.all;
        const wind = Math.round(data.wind.speed * 3.6);
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const icon = data.weather[0].icon;

        //! Milliseconds in time for sunrise
        function sunriseInTime(milliseconds) {
          let datum = new Date(milliseconds);
          let stunden = datum.getHours();
          let minuten = datum.getMinutes();
          let sekunden = datum.getSeconds();
          stunden = stunden < 10 ? "0" + stunden : stunden;
          minuten = minuten < 10 ? "0" + minuten : minuten;
          sekunden = sekunden < 10 ? "0" + sekunden : sekunden;
          let uhrzeit = stunden + ":" + minuten + ":" + sekunden;
          return uhrzeit;
        }
        const sunrise = data.sys.sunrise;
        let uhrzeitSunrise = sunriseInTime(sunrise * 1000);

        //! Milliseconds in time for sunset
        function sunsetInTime(milliseconds) {
          let datum = new Date(milliseconds);
          let stunden = datum.getHours();
          let minuten = datum.getMinutes();
          let sekunden = datum.getSeconds();
          stunden = stunden < 10 ? "0" + stunden : stunden;
          minuten = minuten < 10 ? "0" + minuten : minuten;
          sekunden = sekunden < 10 ? "0" + sekunden : sekunden;
          let uhrzeit = stunden + ":" + minuten + ":" + sekunden;
          return uhrzeit;
        }
        const sunset = data.sys.sunset;
        let uhrzeitSunset = sunsetInTime(sunset * 1000);

        //! import Icon & Temperature in HTML
        let image = document.createElement("img");
        image.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${icon}@2x.png`
        );
        image.setAttribute("alt", "random");

        document.querySelector(".icon").appendChild(image);
        document.querySelector(".temperature").innerHTML = temp + "°C";
        document.querySelector(".status").innerHTML = description;

        //! import remaining data in HTML
        let content = `<div>
                        <h3>${wind} km/h</h3>
                        <p>Windgeschwindigkeit</p>
                        </div>
                        <div>
                        <h3>${humidity} %</h3>
                        <p>Feutchtigkeit</p>
                        </div>
                        <div>
                        <h3>${pressure} hPa</h3>
                        <p>Atmosphärischer Druck</p>
                        </div>
                        <div>
                        <h3>${cloud} %</h3>
                        <p>Bewölkt</p>
                        </div>
                        <div>
                        <h3>${uhrzeitSunrise} </h3>
                        <p>Sonnenaufgang</p>
                        </div>
                        <div>
                        <h3>${uhrzeitSunset} </h3>
                        <p>Sonnenuntergang</p>
                        </div>`;
        document.querySelector(".data").innerHTML = content;
      })
      .catch((error) => {
        console.log("Fehler: ", error);
        document.querySelector("article").innerHTML =
          "Deine Eingabe ist nicht korrekt! Bitte prüfe auf die Rechtschreibung oder auf die richtige PLZ";
      });
  };
});
