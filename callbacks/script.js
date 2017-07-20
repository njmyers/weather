'use strict';

var options = '?exclude=[minutely,hourly,daily]';
var units = '?units=[us]';
var myKey = '6530eb43b4ecafb19e33eb5ceba35c35';
var key = 'AIzaSyCHU4cOVInRIL9jfrJnHj9Wu0GqTRcGmBc'

// Conversions
function farToCel(k) {
  return Math.round( (k - 32) * 5 / 9);
}

function far(k) {
  return Math.round(k);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

function start() {
  
if (window.location.protocol != "https:") {
   var html = '<p class="text-center force">sorry this page needs to be <a href="https://codepen.io/njmyers/pen/zZzOOy" target="_blank">reloaded with https</a></p>'
   $('#no-https').html(html);
}

navigator.geolocation.getCurrentPosition(init, error);
}

// Initialize GET
function init(pos) {
  console.log(pos.coords.latitude);
  var myURL = 'https://api.darksky.net/forecast/' + myKey + '/' + pos.coords.latitude +',' + pos.coords.longitude + options + units;
  var myURL2 = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + pos.coords.latitude + ',' + pos.coords.longitude + '&key=' + key;
  caller(myURL, stringer);
  showCity(myURL2);
}

var geo;

function showCity(url) {
  $.getJSON(url, function(obj) {
  var html = '';
  var classes = '<div class="row"><h2 class="text-center ">';
  html += classes + obj.results[4].formatted_address + '</h2></div>';
  $('.start-city').html(html);
  });
}
// Call

function caller(url, callback) {
$.ajax({
  dataType: 'jsonp',
  url: url,
  success: callback
});
}

// Convert to strings and HTML

function stringer(data) {
  var html = '';
  var classes = '<div class="row"><p class="text-center">';
  html += classes + 'Temperature: ' + '<span class="temp">' + far(data.currently.temperature) + '&deg; <span>F</span></span></p></div>';
  html += classes + '<canvas id=' + data.currently.icon + ' width="64" height="64"></canvas></p></div>';
  html += classes + data.currently.summary + '</p></div>';
  $('.start-weather').html(html);
  convert(data.currently.temperature);
  playSkycon();
  backgroundSwitcher(data.currently.icon) ;
}

// Autobackgrounds

function backgroundSwitcher (state) {
  let myURL = 'url(\'https://s3.amazonaws.com/codepen-njmyers/weather-images/';
  let changer = function (url) {
    return $('body').css('background-image', url);
  };
  if (state === 'clear-day' || 'clear-night') changer(myURL + 'clear.jpg\')');
  else if (state === 'rain' || 'thunderstorm') changer(myURL + 'rain.jpg\')');
  else if (state === 'snow' || 'sleet' || 'hail') changer(myURL + 'snow.jpg\')');
  else if (state === 'cloudy') changer(myURL + 'cloudy.jpg\')');
  else if (state === 'partly-cloudy-day' || 'partly-cloudy-night') changer(myURL + 'partially-cloudy.jpg\')');
}


//Toggle C to F Button

function convert(temperature) {
  $('.temp').children().click(function() {
    let current = ($('.temp').children().text());
    let html = '';
    console.log(current);
    if (current == 'F') {
      html += farToCel(temperature) + '&deg; <span>C</span>';
    } else {
      html += far(temperature) + '&deg; <span>F</span>';
    }
    $('.temp').html(html);
});
}

//init();

function playSkycon() {
  var icons = new Skycons({'color': 'white'}),
  list  = ["clear-day", "clear-night", "partly-cloudy-day", "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind", "fog"], i;
  for(i = list.length; i--; )
    icons.set(list[i], list[i]);
  icons.play();
}

$(document).ready(function() {
  return start();  
});
