
(getTime => {

  (setTime => {
    let date = new Date();
    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    let time = hour + ":" + min;
    $("#time").html(time);  
    setGreeting(hour);  
  })();

  (setDate => {
    let date = new Date();  
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    let day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    let currentDate = month + "/" + day + "/" + year;
    $("#date").html(currentDate);    
  })();

  function setGreeting(hour){
    let greeting;
    (5 < hour && hour <= 12) ? (greeting = 'Morning') 
      : (12 < hour && hour <= 18) ? (greeting = 'Afternoon')
      : (18 < hour && hour <= 21) ? (greeting = 'Evening')
      : (greeting = 'Night');
    $('#greeting').text(`Good ${greeting}!`);
    $('body').css('background-image', `url('img/${greeting}.jpg')`); 
  }
})();

(weather => {
  (navigator.geolocation) ? navigator.geolocation.getCurrentPosition(sendRequest)
    : $("#description").html("Geolocation is not supported by this browser.");

  function sendRequest(position) {
    let url = "http://api.openweathermap.org/data/2.5/forecast?lat="
      + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=1815c1cb674522f41e5935a2267ee5b6";
      console.log(position.coords.latitude + "&lon=" + position.coords.longitude)
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        let data = JSON.parse(xmlhttp.responseText);
        let weather = {
          description: data.list[0].weather[0].description,
          temp: data.list[0].main.temp,
          humidity: data.list[0].main.humidity,
          wind: data.list[0].wind.speed
        }
        update(weather);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  function update(weather) {
    let fahrenheit = ((weather.temp-273.15)*1.8)+32;
    let celsius = weather.temp-273.15;
    fahrenheit = Math.round(fahrenheit);
    celsius = Math.round(celsius);
    $("#description").html(weather.description + '<hr>');
    $("#temp").html(fahrenheit + "<sup>°F</sup>, " + celsius + "<sup>°C</sup><hr>");
    $("#humidity").html("Humidity: " + weather.humidity + "%<hr>");
    $("#wind").html("Wind: " + weather.wind + " mph<hr>");
  }
})();

(quote => {
  let randomQuote;
  let randomAuthor;
  $("#quoteButton").click(() => {
    let url = "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";
    $.getJSON(url, (data) => {
      $("#quote-content").html('" ' + data.quoteText + ' "');
      $("#quote-author").html(" - " + data.quoteAuthor);
      randomQuote = $("#quote-content").text();
      randomAuthor = $("#quote-author").text();
    });
  });
  $("#tweetLink").click(() => open("https://twitter.com/intent/tweet?text=" + randomQuote + randomAuthor));
})();

(wiki => {
  $("#wikiForm").on("submit", (e) => {
  e.preventDefault();
    let searchTerm = $("#searchTerm").val();
    let url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ searchTerm +"&format=json&callback=?";
    $.ajax({
      url: url,
      type: "GET",
      async: false,
      dataType: "json",
      success: (data, status, jqXHR) => {
        for(let i = 1; i < 6; i++) {
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
    });
  })
})();