(weather => {

  // Time
  let date = new Date();
  let hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  let min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  let day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  date = month + "/" + day + "/" + year;
  let time = hour + ":" + min;

if (hour > 5 && hour <= 12) {
  $('#greeting').text('Good Morning!');
  document.body.style.backgroundImage = "url('img/morning.jpg')";
} else if (hour > 12 && hour <= 18) {
  $('#greeting').text('Good Afternoon!');
  document.body.style.backgroundImage = "url('img/afternoon.jpg')";
} else if (hour > 18 && hour <= 21) {
  $('#greeting').text('Good Evening!');
  document.body.style.backgroundImage = "url('img/evening.jpg')";
} else if (hour > 21 || hour <= 5) {
  $('#greeting').text('Good Night!');
  document.body.style.backgroundImage = "url('img/night.jpg')";
}

  // GeoLocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(sendRequest);
  } else {
    $("#description").html("Geolocation is not supported by this browser.");
  }

  // Get Weather Data
  function sendRequest(position) {
    let url = "https://fcc-weather-api.glitch.me/api/current?lat="
      + position.coords.latitude + "&lon=" + position.coords.longitude;

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        let data = JSON.parse(xmlhttp.responseText);
        let weather = {};
        weather.description = data.weather[0].description;
        weather.temp = data.main.temp;
        weather.humidity = data.main.humidity;
        weather.wind = data.wind.speed;
        update(weather);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  // Update HTML
  function update(weather) {
    
    let fahrenheit = weather.temp * 9 / 5 + 32;
    fahrenheit = Math.round(fahrenheit);

    $("#date").html(date);    
    $("#time").html(time);      
    $("#description").html(weather.description + '<hr>');
    $("#temp").html(fahrenheit + "<sup>°F</sup>, " + weather.temp + "<sup>°C</sup><hr>");
    $("#humidity").html("Humidity: " + weather.humidity + "%<hr>");
    $("#wind").html("Wind: " + weather.wind + " mph<hr>");
  }

})();

(quote => {
  var randomQuote = "";
  var randomAuthor = "";

  $("#quoteButton").on("click", function() {
    var url =
      "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";
    $.getJSON(url, function(data) {
      $("#quote-content").html('" ' + data.quoteText + ' "');
      $("#quote-author").html(" - " + data.quoteAuthor);
      randomQuote = document.getElementById("quote-content").textContent;
      randomAuthor = document.getElementById("quote-author").textContent;
    });
  });

  $("#tweetLink").on("click", function() {
    window.open(
      "https://twitter.com/intent/tweet?text=" + randomQuote + randomAuthor
    );
  });
})();

(wiki => {
  $("form").on("submit", function(e){
  e.preventDefault();
    var searchTerm = $("#searchTerm").val();
    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ searchTerm +"&format=json&callback=?";
    $.ajax({
      url: url,
      type: "GET",
      async: false,
      dataType: "json",
      success: function(data, status, jqXHR){
        for(var i = 1; i < 6; i++) {
          $("#output").append(
            "<div class='well'><a href=" 
            + data[3][i] 
            + " target='_blank'><h2>"
            + data[1][i]
            + "</h2><p>" 
            + data[2][i]
            + "</p></a></div>");
        }
      }
    })
  })
})();