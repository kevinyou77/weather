const weatherCondition = [
    {
         weather: "cloudy",
         url: "http://wallpapercave.com/wp/SNh7WLs.jpg"
    }, 
    {
        weather: "sunny",
         url: "http://www.lanlinglaurel.com/data/out/16/4022313-sunny-pics.jpg"
    },
    {
        weather: "clear",
        url: "http://static.panoramio.com/photos/large/6982655.jpg"
    },
    {
        weather: "rain",
        url: "https://www.caminodesantiago.me/wp-content/uploads/rain1.jpg"   
    }
];

let country = "";
let city = "";
let humidity = "";
let temperature = "";
let longitude = "";
let latitude = "";
let condition = "";

const getLocation = (place, temp) => {
    let url = "http://api.apixu.com/v1/current.json?key=23a5febbe34645b689e163543170306&q=" + place;
    $.getJSON(url, (data) => {
        city = data.location.name;
        country = data.location.country ;
        humidity = data.current.humidity;

        if (temp === 'c') {
            temperature = data.current.temp_c;
        } else if (temp === 'f') {
            temperature = data.current.temp_f;
        }

        condition = data.current.condition.text;

        $(".city").text(city);
        $(".country").text(country);
        $(".humidity").text(humidity + "%");
        $(".temperature").text(temperature + " °" + temp.toUpperCase());
        $(".condition").html("Today is " + "<strong>" + condition + "</strong>");         
        
        // $(".city").html("<span class='city'><p>" + city + "</p></span>");
        // $(".country").html("<span class='country'><p>" + country + "</p></span>");
        // $(".humidity").html("<span class='humidity'><p>" + humidity + "%" + "</p></span>");
        // $(".temperature").html("<span class='temperature'><p>" + temperature + " °" + temp.toUpperCase() + "</p></span>");
        // $(".condition").html("<span class='condition'><p>" + "Today is " + "<strong>" + condition + "</strong>" + "</p></span>");
        changeBackground(condition);
    });
}

let getDays = (place) => {
    let url = "http://api.apixu.com/v1/forecast.json?key=23a5febbe34645b689e163543170306&q=" + place + "&days=6";
    
    $.getJSON(url, (data) => {
        html = "<h5><strong>Next 5 days weather</strong></h5>";   

        for (let i = 1; i < data.forecast.forecastday.length; i++) {
            html += "<div class='col-md-2 col-sm-2'>";
            html += "<p><strong>" + data.forecast.forecastday[i].date + "</strong></p>";
            html += data.forecast.forecastday[i].day.condition.text;
            html += "</div>";
        }

        html += "<div class='col-md-2'></div>";

        $(".futureForecast").html(html);
        $(".date").html("<h4><strong>" + data.forecast.forecastday[0].date + "</h4></strong>")
    });
}

let getColor = () => {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    let rgb = "rgb(" + r + ", " + g + ", " + b + ")";
    
    return rgb;
}

let changeBackground = (conditions) => {
    weatherCondition.forEach((condition) => {
        let reg = new RegExp(condition.weather, "gi");
        if (conditions.search(reg) >= 0) {
            $("body").css("background-image", "url(" + condition.url + ")");
            $("body").css("background-position", "fixed");
        }
    })
}

$(document).ready(() => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            longitude = position.coords.longitude;
            latitude = position.coords.latitude;

            getLocation(latitude + "," + longitude, 'c');
            getDays(latitude + "," + longitude);
            changeBackground(condition);
        });        
    } else {
        alert("Your browser does not support geolocation!");   
    }
});


$(".metricToggle").on("click", () => {
    let text = $(this).text();

    //check this piece of code if there is bug in displaying temperature
    $(".metricToggle").children().toggle(() => {
         if (text === "Fahrenheit") {
             getLocation(latitude + "," + longitude, 'f');
         } else if (text === "Celcius") {
              getLocation(latitude + "," + longitude, 'c');
         }
    });
 });