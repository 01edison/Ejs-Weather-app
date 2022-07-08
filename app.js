require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

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
  axios
    .get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q,
        appid: apiKey,
        units: unit,
      },
    })
    .then(function (response) {
      const weatherData = response.data;
      const place = weatherData.name;
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;

      res.render("index", {
        place: place,
        description: weatherDescription,
        temperature: temp,
        icon: icon,
      });
    })
    .catch(function (error) {
      const errorMsg = error.request.res.statusMessage;
      res.render("index", {
        errorMsg: errorMsg,
        place: place,
      });
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
});

// http://openweathermap.org/img/wn/02n@2x.png"
