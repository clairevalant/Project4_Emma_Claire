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
    const units = "ca";
    const startDate = new Date(`${myApp.year}, ${myApp.month}, ${myApp.day}`).getTime() / 1000;

    myApp.getTemp(latitude,longitude, units, startDate);
}

myApp.getLocation = function(){
    $.ajax({

    }).then(res => {
        console.log(res);
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