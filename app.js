require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let temp, weatherDescription, place, icon;

app.get("/", (req, res) => {
  res.render("index", {
    temperature: temp,
    description: weatherDescription,
    place: place,
    icon: icon,
    errorMsg: "",
  });
});

app.post("/", (req, res) => {
  const q = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=${unit}`;

  https.get(url, (response) => {
    if (response.statusCode === 200) {
      response.on("data", (data) => {
        const weatherData = JSON.parse(data);
        const place = weatherData.name;
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;

        res.render("index", {
          place: `The weather in ${place} is`,
          temperature: `${temp}℃`,
          description: `The weather description is currently "${weatherDescription}"`,
          icon: icon,
        });
      });
    } else {
      res.render("index", { icon: icon, errorMsg: "No such place. Try again" });
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
});

// http://openweathermap.org/img/wn/02n@2x.png"
