// Main script for Emma and Claire's Project 4

const myApp = {};

myApp.key = "5a94fd0eec1f352b4f9876ecb51a88a9";

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


myApp.getTemp = function(lat, long, u, t){
    
    $.ajax({
        url: `https://api.darksky.net/forecast/${myApp.key}/${lat},${long},${t}`,
        dataType: "jsonp",
        method: "GET",
        data:{
            format:"jsonp",
            key: myApp.key,
            // latitude: lat,
            // longitude: long,
            units: u,
            timezone: "Canada/Eastern",
            // time: t,
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