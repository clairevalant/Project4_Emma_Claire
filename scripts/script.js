// Main script for Emma and Claire's Project 4

const myApp = {};

myApp.weatherKey = "5a94fd0eec1f352b4f9876ecb51a88a9";
myApp.googleKey = "AIzaSyAtUxpG10DW19jF5_OC6Q5rfT3PO5Nzmos";

// get user lat and longitude


// set to variables
myApp.day = 20;
myApp.month = 11;
myApp.year = 2017;

myApp.setLatLong = function(){
    const latitude = 43.6532;
    const longitude = 79.3832;
    myApp.getLocation(latitude, longitude);
    const units = "ca";
    const startDate = new Date(`${myApp.year}, ${myApp.month}, ${myApp.day}`).getTime() / 1000;

    myApp.getTemp(latitude,longitude, units, startDate);
}


const input = "toronto";

myApp.getLocation = function(input){
    // const autocomplete = new google.maps.places.Autocomplete(input);
    $.ajax({
        //https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=mongolian%20grill&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&locationbias=circle:2000@47.6918452,-122.2226413&key=YOUR_API_KEY
        url: `https://maps.googleapis.com/maps/api/place/autocomplete/jsonp?input=toronto&key=${myApp.googleKey}`,
        dataType: 'jsonp',
        method: 'GET',
        data: {
            key: myApp.googleKey,
            input: input
        }

    }).then(googleRes => {
        console.log(googleRes);
    })
}

myApp.getTemp = function(lat, long, u, t){
    $.ajax({
        url: `https://api.darksky.net/forecast/${myApp.weatherKey}/${lat},${long},${t}`,
        dataType: "jsonp",
        method: "GET",
        data:{
            format:"jsonp",
            key: myApp.weatherKey,
            units: u,
            timezone: "Canada/Eastern",
        }
    }).then(res => {
        console.log(res);
    })
}

myApp.init = function(){
    myApp.setLatLong();
}



$(function(){
    myApp.init();
});