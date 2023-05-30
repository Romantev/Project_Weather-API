const apiKey = "3ce489c1864798a092ec39d1700a891f";

//! function for coordinates
document.querySelector("button").addEventListener("click", () => {
  const input = document.querySelector(".input").value;
  const blockToHide = document.querySelector(".change-hide");
  const hideToBlock = document.querySelector(".change-block");
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
        const city = data.name;
        const temp = Math.round(data.main.temp - 273.15);
        const cloud = data.clouds.all;
        const wind = Math.round(data.wind.speed * 3.6);
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const icon = data.weather[0].icon;
        const sunRise = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
          "de-DE"
        );
        const sunSet = new Date(data.sys.sunset * 1000).toLocaleTimeString(
          "de-DE"
        );
        let localeTime = new Date().getTime();
        let date = new Date(localeTime - 3600 * 2000 + data.timezone * 1000);
        timeZone = date.toLocaleTimeString();

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
                        <h3>${timeZone} </h3>
                        <p>Lokale Zeit</p>
                        </div>
                        <div>
                        <h3>${wind} km/h</h3>
                        <p>Windgeschwindigkeit</p>
                        </div>
                        <div>
                        <h3>${humidity} %</h3>
                        <p>Feutchtigkeit</p>
                        </div>
                        <div>
                        <h3>${cloud} %</h3>
                        <p>Bewölkt</p>
                        </div>
                        <div>
                        <h3>${sunRise} </h3>
                        <p>Sonnenaufgang</p>
                        </div>
                        <div>
                        <h3>${sunSet} </h3>
                        <p>Sonnenuntergang</p>
                        </div>`;
        document.querySelector(".data").innerHTML = content;
        blockToHide.style.display = "none";
        hideToBlock.style.display = "block";
        hideToBlock.innerHTML = `<h1>${city}</h1> <h2>${timeZone}</h2>`;
      })
      .catch((error) => {
        console.log("Fehler: ", error);
        document.querySelector("article").innerHTML =
          "Deine Eingabe ist nicht korrekt! Bitte prüfe auf die Rechtschreibung oder auf die richtige PLZ";
      });
  };
});
