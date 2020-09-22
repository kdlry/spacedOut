// Name spaces
const spaceApp = {};

// API properties + global variables

spaceApp.onWaterKey = 'EkuV5rQoh2edgP-RgG-B';
spaceApp.mapquestKey = 'rNUBvav2dEGGss4WVvHK64tVGGygn3zB';

spaceApp.issCoordEndPoint = 'https://api.wheretheiss.at/v1/satellites/';
spaceApp.landOrWaterEndPoint = 'https://api.onwater.io/api/v1/results/';
spaceApp.locationEndPoint = 'https://www.mapquestapi.com/geocoding/v1/address';

spaceApp.latitude = undefined;
spaceApp.longitude = undefined;
spaceApp.userLat = 0;
spaceApp.userLng = 0;

// API call
spaceApp.findStation = () => {
   $.ajax({
      url: spaceApp.issCoordEndPoint,
      method: 'GET',
      dataType: 'JSON',
      data: {
         id: 25544
      },
   }).then((res) => {
      // console.log(res);
      // console.log('I work')
      spaceApp.satDetails(res);

      spaceApp.latitude = (res.latitude);
      spaceApp.longitude = (res.longitude); 

      spaceApp.locateStation();

      // console.log(spaceApp.latitude);
      // console.log(spaceApp.longitude);
   });
}

// Function that displays ISS position info on page
spaceApp.satDetails = (res) => {
   console.log(res);

   // Credit for code below: https://makitweb.com/convert-unix-timestamp-to-date-time-with-javascript/
   // Convert unix time stamp to formatted date and time 
   let unixTime = (res.timestamp)
   let months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   let date = new Date(unixTime * 1000);
   let year = date.getFullYear();
   let month = months_arr[date.getMonth()];
   let day = date.getDate();
   let hours = date.getHours();
   let minutes = "0" + date.getMinutes();
   let seconds = "0" + date.getSeconds();

   // Display date time in MM-dd-yyyy h:m:s UTC format
   let formattedTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' UTC';

   console.log(formattedTime);

      // Timestamp
      const time = $('<p>').addClass('infoTxt').text(formattedTime); 
      const info1 = $('.info1').html(time);

      $('#satDisplay1').append(info1);
      
      // Altitude
      const alt = $('<p>').text(res.altitude.toFixed(3));
      const info2 = $('.info2').html(alt);

      $('#satDisplay2').append(info2);
      
      // Latitiude
      const lat = $('<p>').text(res.latitude.toFixed(6));
      const info3 = $('.info3').html(lat);

      $('#satDisplay3').append(info3);
      
      // Longitude
      const long = $('<p>').text(res.longitude.toFixed(6));
      const info4 = $('.info4').html(long);

      $('#satDisplay4').append(info4);
      
      // Visibility
      const vis = $('<p>').text(res.visibility);
      const info5 = $('.info5').html(vis);

      $('#satDisplay5').append(info5);
      
      // Velocity
      const veloc = $('<p>').text(res.velocity.toFixed(3));
      const info6 = $('.info6').html(veloc);

      $('#satDisplay6').append(info6);
}

spaceApp.locateStation = () => {
   $.ajax({
      url: `${spaceApp.landOrWaterEndPoint}${spaceApp.latitude},${spaceApp.longitude}`,
      method: 'GET',
      dataType: 'JSON',
      data: {
         access_token: spaceApp.onWaterKey,
      }
   }).then((res) => {
      // console.log(res);
      // console.log('I work alsooooo')
      spaceApp.satLocation(res)
   }).fail((err) => {
      // console.log(err);
   });
}

spaceApp.satLocation = (res) => {
   let overWater = (res.water);
   console.log(overWater)
   if (overWater) {
      $('.img').html('<img src="./assets/water.png" alt= "water icon"></img>');

      let newTxtWater = $('<p>').text('Water').addClass('displayTxt');
      let newTxtWaterAdd = $('.txt').html(newTxtWater);

      $('.landOrWaterDisplay').append(newTxtWaterAdd);      
      
   } else {
      $('.img').html('<img src="./assets/land.png" alt= "land icon" ></img>');

      let newTxtLand = $('<p>').text('Land').addClass('displayTxt');
      let newTxtLandAdd = $('.txt').html(newTxtLand);

      $('.landOrWaterDisplay').append(newTxtLandAdd);
   }
}

spaceApp.searchLocation = (location) => {
   $.ajax({
      url: spaceApp.locationEndPoint,
      method: 'GET',
      dataType: 'JSON',
      data: {
         key: spaceApp.mapquestKey,
         location: location,
      },
   }).then((res) => {

      spaceApp.userLat = (res.results[0].locations[0].latLng.lng);
      spaceApp.userLong = (res.results[0].locations[0].latLng.lat);

      const distance = spaceApp.calculateLocation(spaceApp.latitude, spaceApp.longitude, spaceApp.userLat, spaceApp.userLng);
      const finalDistance = (distance * 0.621371).toFixed(0);

      $('.distanceResults').html(`<p>Your location is ${finalDistance} miles from the space station.</p>`).addClass('displayTxt');
      
   });
}

spaceApp.show = function() {
   $('.satButton').on('click', function(e) {
      e.preventDefault();
      // console.log('I work too')

      spaceApp.findStation();
      
   });
}

// Clear page
spaceApp.reset = function () {
   $('.resetButton').on('click', function() {
      
      // Remove ISS info
      $('.info').find('p').addClass('hide');

      // Remove land/water info
      $('.landOrWater').find('p').addClass('hide');
      $('.landOrWater').find('img').addClass('hide');

      //Remove location input + distance text
      $('input').val('');
      $('.distanceResults').find('p').addClass('hide');
   });
}

spaceApp.findLocation = function() {
   $('.form').on('submit', function(e) {
      e.preventDefault();
      console.log('Submit working');

      if (spaceApp.latitude === undefined && spaceApp.longitude === undefined) {
         alert('Sorry, you need to find the station position first!');
         $('input').val('');
      } else {
         // Start location input
         let userLocationInput = $('input').val();
         console.log(userLocationInput);
   
         spaceApp.searchLocation(userLocationInput);
   
         // console.log(spaceApp.calculateLocation);
      }
   });
}

// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula

spaceApp.calculateLocation = function(lat1, lon1, lat2, lon2) {
   let R = 6371; // Radius of the earth in km
   let dLat = spaceApp.deg2rad(lat2 - lat1);  // spaceApp.deg2rad below
   let dLon = spaceApp.deg2rad(lon2 - lon1);
   let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(spaceApp.deg2rad(lat1)) * Math.cos(spaceApp.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
   let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   let d = R * c; // Distance in km
   return d;
}

spaceApp.deg2rad = function(deg) {
   return deg * (Math.PI / 180)
}
   

// Initializing functions
spaceApp.init = function() {
   spaceApp.show();
   spaceApp.reset();
   spaceApp.findLocation();
}

// Document ready
$(function () {
   spaceApp.init();
});
