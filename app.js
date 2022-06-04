const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res)=>{
    res.sendFile(__dirname+"/index.html");
    
})

app.post('/', (req, res)=>{
    const q = req.body.cityName;
    const apiKey = "057be26a4da93af078568dcb3ef55c3f";
    const unit = "metric"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=${unit}`
    
    https.get(url, (response)=>{
        console.log(response.statusCode)
        if (response.statusCode===200) {
            response.on("data", (data)=>{
                const weatherData = JSON.parse(data);
                const place = weatherData.name;
                const temp = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
     
                res.write(`<h1>The weather in ${place} is ${temp} degrees Celsius</h1>`);
                res.write(`<p>The weather description is currently "${weatherDescription}"</p>`);
                res.write(`<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`)
                res.send()
             })
        }
        else{
            res.send("oops cant find page, baby")
        }
    })
})





app.listen(3000, ()=> {
    console.log('listening on port 3000')
})