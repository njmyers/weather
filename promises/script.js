'use strict';

var weather = (function() {

    /* Private Vars */

    var position;

    var interval = {
        t: 1000,
        s: 60,
        m: 5,
        i: function() {
            return this.t * this.s * this.m
        }
    }

    var style = {
        background: ''
    }

    var view = {
        scale: 'F', // Default to Farenheit
        city: '',
        temperature: '',
        icon: '',
        summary: '',
        style: style
    }

    var methods = {},
        my = {};

    // Conversions

    function farToCel(f) {
        return Math.round((f - 32) * 5 / 9);
    }

    function celToFar(c) {
        return Math.round((c * 9 / 5) + 32);
    }

    // Toggle C to F

    methods.convert = function() {

        if (this.scale === 'F') {
            this.scale = 'C';
            this.temperature = farToCel(this.temperature);
        } else {
            this.scale = 'F';
            this.temperature = celToFar(this.temperature);
        }
    }



    // Grab Backgrounds

    methods.backgroundSwitcher = function(state) {

        var url = 'url(\'https://s3.amazonaws.com/codepen-njmyers/weather-images/';

        function switcher(filename) {
            this.style.background = url + filename + '\')'
        }

        switch (this.icon) {
            case 'clear-day':
            case 'clear-night':
                switcher.call(this, 'clear.jpg')
                break;
            case 'rain':
            case 'thunderstorm':
                switcher.call(this, 'rain.jpg')
                break;
            case 'snow':
            case 'sleet':
            case 'hail':
                switcher.call(this, 'snow.jpg')
                break;
            case 'cloudy':
                switcher.call(this, 'cloudy.jpg')
                break;
            case 'partly-cloudy-day':
            case 'partly-cloudy-night':
                switcher.call(this, 'partially-cloudy.jpg')
                break;
        }

    }


    // Create Vue instance only after all 
    // Data/method properties have been declared

    var app = new Vue({
        el: '#app',
        data: view,
        methods: methods
    })

    // Get Coords

    function navigatorAsync() {
        return new Promise(function(resolve, reject) {
            navigator.geolocation.getCurrentPosition(function(pos) {
                    console.log('pos: ' + JSON.stringify(pos))
                    resolve(pos);
                },
                function(err) {
                    reject(err)
                })
        })
    }

    // Get JSON from Proxy Server

    function get(type, pos) {
        var url = 'https://localhost:4040/api/' + type + '?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude;

        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.responseType = 'json';
            req.onload = function() {
                if (req.readyState === 4 && req.status === 200) {
                    resolve(req.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: req.statusText
                    })
                }
            };

            req.onerror = function() {
                reject({
                    status: this.status,
                    statusText: req.statusText
                })
            }

            req.send(null);

        })
    }

    // Promise Flow

    function controlFlow() {

        // if (!position) {

        var p = navigatorAsync();
        p.then(function(pos) {
                position = pos;
                return Promise.all([get('weather', pos), get('city', pos)]); // Async all requests from position data
            })
            // }

        /*
        else {
          var p2 = Promise.all([get('weather', position), get('city', position)]);
        }*/

        .then(function(data) {
                console.log(app);
                view.temperature = Math.round(data[0].currently.temperature);
                view.icon = data[0].currently.icon;
                view.summary = data[0].currently.summary;
                view.city = data[1].results[4].formatted_address;
            })
            .then(function() {
                console.log(app);
                playSkycon();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    // Initialize all Skycons

    function playSkycon() {
        var icons = new Skycons({
                'color': 'white'
            }),
            list = ["clear-day", "clear-night", "partly-cloudy-day", "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind", "fog"],
            i;
        for (i = list.length; i--;)
            icons.set(list[i], list[i]);
        icons.play();
    }

    controlFlow();

    // my.interval = setInterval(controlFlow, interval.i());

    return my

})();