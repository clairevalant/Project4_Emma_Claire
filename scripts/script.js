// Main script for Emma and Claire's Project 4

// declare app object
const myApp = {};

// store our api keys for weather and google places
myApp.weatherKey = "939526212d6d03b772f203915ea5ef22";

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
myApp.getInput = function () {
    $("form").on("submit", function (event) {
        event.preventDefault();
        myApp.collectFormData();
    }
    )
};

myApp.collectFormData = function () {
    // toggle temperature units depending on user choice
    if ($("input[value=ca]:checked").val() === "ca") {
        units = "ca";
    } else {
        units = "us";
    }
    console.log(units);

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
    const sMonth = myApp.startDate.getMonth() + 1;
    let sYear = myApp.startDate.getFullYear();


    const eDate = myApp.endDate.getDate() + 1;
    const eMonth = myApp.endDate.getMonth() + 1;
    let eYear = myApp.endDate.getFullYear();


    // change user dates to Epoch time for past five years, send to DarkSky
    let startEpoch = new Date(`${sYear}, ${sMonth}, ${sDate}`).getTime() / 1000;
    let endEpoch = new Date(`${eYear}, ${eMonth}, ${eDate}`).getTime() / 1000;


    // initialize loop date to previous year
    let current = startEpoch;

    // call function to start retrieving historical data from Dark Sky API
    myApp.getTripDuration(startEpoch, endEpoch, current);
};



myApp.getTripDuration = function (startEpoch, endEpoch, current) {

    // initialize arrays for max and min temps for past five years on specified date
    myApp.historyTempMin = [];
    myApp.historyTempMax = [];
    // the historyTempAvg array adds the max and min temperature and divides by two.
    myApp.historyTempAvg = [];

    // how many days we increment by in algorithm (longer trips: every few days)
    let dayIncrement = 86400;

    // set how many days we take in the trip duration
    let numDays = Math.floor((endEpoch - startEpoch) / dayIncrement);

    // handling for "0" days
    if (numDays <= 1) {
        numDays = 2;
    }
    // only look at every other day for high numDays
    if (numDays > 7 && numDays <= 15) {
        dayIncrement = 86400 * 2;
        numDays = Math.floor((endEpoch - startEpoch) / dayIncrement);
    }
    if (numDays > 15) {
        dayIncrement = 86400 * 3;
        numDays = Math.floor((endEpoch - startEpoch) / dayIncrement);
    }

    myApp.getHistoricalData(numDays, current, dayIncrement);

};

myApp.getHistoricalData = function (numDays, current, dayIncrement) {
    const promiseArray = [];
    // for each day in the trip
    for (let j = 0; j < numDays; j++) {
        console.log(j);

        // retrieve temperature for the past five years
        for (let i = 0; i < 5; i++) {
            //ajax call
            // myApp.getTemp(myApp.lat, myApp.lng, units, current);
            const promise = myApp.getTempPromise(myApp.lat, myApp.lng, units, current);
            promiseArray.push(promise);
            // subract one Epoch year
            current = current - 31536000;
            console.log(current);
        }
        // add one Epoch day, add Epoch five years
        current = current + dayIncrement + (5 * 31536000);
    };
    // myApp.outputHistoricalData();
    console.log(promiseArray, "promiseArray");

    //when all of the promises have been run go through the array of results to retrieve our data
    $.when(...promiseArray).then((...res) => {
        // console.log(res);    
        res.forEach(function (weatherObject) {
            // console.log(weatherObject[0].daily.data[0].temperatureMin, "WO");
            myApp.historyTempMin.push(weatherObject[0].daily.data[0].temperatureMin);
            myApp.historyTempMax.push(weatherObject[0].daily.data[0].temperatureMax);
            myApp.historyTempAvg.push((weatherObject[0].daily.data[0].temperatureMax + weatherObject[0].daily.data[0].temperatureMin) / 2);
        });
        // once data is loaded into the arrays call the output... fn
    }).then(myApp.outputHistoricalData);
};

myApp.outputHistoricalData = function () {
    console.log("TempMax", myApp.historyTempMax);
    console.log("TempMin", myApp.historyTempMin);
    console.log("TempAvg", myApp.historyTempAvg);
    console.log(myApp.historyTempMax[0]);
    // setTimeout(() => { console.log(myApp.historyTempMax[0]) }, 2000);

    myApp.getAverageTemp(myApp.historyTempMax);
    myApp.getAverageTemp(myApp.historyTempMin);
    myApp.getAverageTemp(myApp.historyTempAvg);
};

myApp.getAverageTemp = function (calcArray) {

    const avgArray = calcArray.reduce((a, b) => a + b, 0) / calcArray.length;

    $('.outputData').append(`<h3 class="tempMin">${avgArray}</h3>`);
};


// ----- Weather app API work begins here -----

//we want this function to return a promise
myApp.getTempPromise = function (lat, long, u, t) {
    return $.ajax({
        url: `https://api.darksky.net/forecast/${myApp.weatherKey}/${lat},${long},${t}`,
        dataType: "jsonp",
        method: "GET",
        data: {
            format: "jsonp",
            key: myApp.weatherKey,
            units: u
        }
    })
}

myApp.init = function () {
    myApp.getInput();
};

$(function () {
    myApp.init();
});