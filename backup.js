var weatherCondition = {
    "cloudy": {
         url: "http://wallpapercave.com/wp/SNh7WLs.jpg"
    }, 
    "sunny": {
         url: "http://www.lanlinglaurel.com/data/out/16/4022313-sunny-pics.jpg"
    },
    "rain": {
         url: "https://www.caminodesantiago.me/wp-content/uploads/rain1.jpg"   
    }        
};

var country = "";
var city = "";
var humidity = "";
var temperature = "";
var longitude = "";
var latitude = "";
var condition = "";

var getLocation = (place, temp) => {
    var url = "http://api.apixu.com/v1/current.json?key=23a5febbe34645b689e163543170306&q=" + place;
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

var getDays = (place) => {
    var url = "http://api.apixu.com/v1/forecast.json?key=23a5febbe34645b689e163543170306&q=" + place + "&days=6";
    
    $.getJSON(url, (data) => {
        html = "<h5><strong>Next 5 days weather</strong></h5>";   

        for (var i = 1; i < data.forecast.forecastday.length; i++) {
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

var getColor = () => {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);

    var rgb = "rgb(" + r + ", " + g + ", " + b + ")";
    
    return rgb;
}

function* backgroundGenerator(cond) {
    yield cond.search(/sunny/i);
    yield cond.search(/rain/i);
    yield cond.search(/cloudy/i);
}

function change(condition) {
    for (let cond of backgroundGenerator(conditions)) {
        if (cond.value.search(conditions)) {
            return weatherCondition[condition].url;
        }
    }
}

var changeBackground = (conditions) => {
    if (conditions.search(/sunny/i) >= 0) {    
        $("body").css("background-image", "url(" + weatherCondition["sunny"].url + ")");
        $("body").css("background-position", "fixed");
    } else if (conditions.search(/rain/i) >= 0 || conditions.search(/rainy/i) >= 0) {
        $("body").css("background-image", "url(" + weatherCondition["rain"].url + ")");
        $("body").css("background-position", "center");
    } else if (conditions.search(/cloudy/i) >= 0) {
        $("body").css("background-image", "url(" + weatherCondition["cloudy"].url + ")");
        $("body").css("background-position", "center");
    }
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
    var text = $(this).text();

    //check this piece of code if there is bug in displaying temperature
    $(".metricToggle").children().toggle(() => {
         if (text === "Fahrenheit") {
             getLocation(latitude + "," + longitude, 'f');
         } else if (text === "Celcius") {
              getLocation(latitude + "," + longitude, 'c');
         }
    });
 });