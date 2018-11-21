// Main script for Emma and Claire's Project 4

// declare app object
const myApp = {};

// store our api keys for weather and google places
myApp.weatherKey = "5a94fd0eec1f352b4f9876ecb51a88a9";
myApp.googleKey = "AIzaSyAtUxpG10DW19jF5_OC6Q5rfT3PO5Nzmos";

// tell our autoComplete input to actually Autocomplete in the specified input element "autoComplete"
myApp.autoCompInput = new google.maps.places.Autocomplete(document.getElementById("autoComplete"));

// use Google event listener to track changes in the input element that the user enters text
google.maps.event.addListener(myApp.autoCompInput, "place_changed", function () {
    let place = myApp.autoCompInput.getPlace();
    console.log("lat:", place.geometry.location.lat());
    myApp.lat = place.geometry.location.lat();
    console.log("lng", place.geometry.location.lng());
    myApp.lng = place.geometry.location.lng();
});


// prevent the default on form submit and get value of input
myApp.getInput = function(){
    $("form").on("submit", function(event){
        event.preventDefault();
        // get user date range / trip type (?) / unit toggle
        myApp.startDate = new Date($("#startDate").val());
        myApp.endDate = new Date($("#endDate").val());
        console.log(myApp.startDate);
        console.log(myApp.endDate);
        
        

        if (myApp.startDate > myApp.endDate) { 
            alert("Please enter a valid end date.");
            // RESET END DATE CALENDAR TO DEFAULT
        }

        const sDate = myApp.startDate.getDate() + 1;
        console.log(sDate);
        const sMonth = myApp.startDate.getMonth() + 1;
        console.log(sMonth);
        const sYear = myApp.startDate.getFullYear();
        console.log(sYear);
        
        const eDate = myApp.endDate.getDate() + 1;
        console.log(eDate);
        const eMonth = myApp.endDate.getMonth() + 1;
        console.log(eMonth);
        const eYear = myApp.endDate.getFullYear();
        console.log(eYear);

        
    });
};

// ----- Weather app API work begins here -----
// Set date to variables
// temporar!!!
myApp.day = 20;
myApp.month = 11;
myApp.year = 2017;

// change user dates to Epoch time for past five years, send to DarkSky
myApp.setPreferences = function () {

    // toggle temperature units depending on user choice
    if ($("input[name=tempUnits]:checked" === "ca")) {
        myApp.units = "ca";
    } else {
        myApp.units = "us";
    }

    const startDate = new Date(`${myApp.year}, ${myApp.month}, ${myApp.day}`).getTime() / 1000;

    // pass info to weather API
    myApp.getTemp(myApp.lat, myApp.lng, myApp.units, startDate);
};

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
    myApp.getInput();
    myApp.setPreferences();
};

$(function(){
    myApp.init();
});