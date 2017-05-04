$(document).ready(function(){

  // Load values from REST API
  $.getJSON( "https://www.algaecal.com/wp-json/acf/v2/options", function( data ) {

    // Update the phone number CTA with the office number
    var phoneNumber = data.acf.default_phone_number;
    $("#tap-to-talk #phone-number").html(phoneNumber.replace(/\./g,"-"));
    $("#tap-to-talk>a").attr("href", "tel:"+phoneNumber.replace(/\./g,""));

    // Populate the "7 Years Strong Bone Guarantee" modal
    var guaranteeFull = data.acf["7yr_full_copy"];
    $("#guaranteeLongForm .modal-body").html(guaranteeFull);

    // Show the Tap to Talk CTA if current time is within office hours
    var officeHours = data.acf.office_hours;
    if(isOfficeOpen(officeHours))
      $("#tap-to-talk").show();
  });

  // Show the bundles when the Buy Now button is clicked, just in case the video hasn't played past 2:13
  $("#buy-now .buy-now").click(function(){
    $("#bundles").show();
  });

});

// Returns the current Pacific Standard Time in 24 hour 0000 format
function getCurrentPST(){
  var date = new Date();
  currentGMT = date.getUTCHours();              // The current hour in integer form (0-23)
  PSTtimeDifference = 7;                        // Time difference from PST to GMT
  currentPST = currentGMT - PSTtimeDifference;  // Current PST time based on GMT
  // If the time difference calculation puts the current hour over 24, adjust it
  if(currentPST>24)
    currentPST -= 24;
  // Add a leading zero if the time is less than 10 o'clock
  if(currentPST<10)
    currentPST = "0"+currentPST;

  // Return the time in 0000 format (ie. 1342 for 1:42PM)
  return currentPST.toString() + date.getUTCMinutes().toString();
}

// Returns the date of the week as integers 1-7 (starting with 1=Monday)
function getCurrentDayOfTheWeek(){
  var day = new Date().getDay();
  if(day==0)  // Return 7 for Sunday instead of 0
    return 7;
  else        // For the rest of the days, just return the standard number (1-6)
    return day;
}

// Returns true if office is currently open. false if closed
function isOfficeOpen(schedule){
  var currentPST = getCurrentPST();                   // Current PST time in 1234 format
  var currentDayOfTheWeek = getCurrentDayOfTheWeek(); // Current day of the week in integer form (1-7)
  var startingTime;
  var closingTime;
  // Loop through schedule array to find the day of week matching today
  for(i=0; i<schedule.length; i++){
    // Find the correct day of the week and stop the loop
    if(schedule[i].day==currentDayOfTheWeek){
      startingTime = schedule[i].starting_time;
      closingTime = schedule[i].closing_time;
      break;
    }
  }

  // Return true if the current time falls between starting and closing times
  return currentPST>=startingTime && currentPST<closingTime;
}
