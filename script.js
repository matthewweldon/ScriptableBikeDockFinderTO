
let stationsInfo = "https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information"
let stationsStatus = "https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_status"

//The closest bike location 
let targetLocation = {
  lat:43.6497062,
  long:-79.3765177
}

  
if (stationsInfo != null) {
  // We have a URL so we attempt to load the JSON.
  let r1 = new Request(stationsInfo)
  let json1 = await r1.loadJSON()
  
  let r2 = new Request(stationsStatus)
  let json2 = await r2.loadJSON()
  
 
  prompt(json1,json2)
} 


        
function prompt(json1,json2) {
  
  let uniqueNodes = json1.data.stations
  let stationStatus = json2.data.stations
  //let location = location()
  //let location = location().current()
  

  const arrayToObject = (array, keyField) =>
    array.reduce((obj, item) => {
        obj[item[keyField]] = item
        return obj
        }, {}) 
  let stationStatusObj = arrayToObject(stationStatus, "stationId")
  
  for ( i = 0; i < uniqueNodes.length; i++) {
    let id = uniqueNodes[i]["stationId"]
    
    uniqueNodes[i]["num_bikes_available"] = stationStatusObj[id]["num_bikes_available"]
   
    uniqueNodes[i]["num_docks_available"] = stationStatusObj[id]["num_docks_available"]
    
    uniqueNodes[i]["distance"] = calculateDistance(targetLocation.lat,targetLocation.long,uniqueNodes[i]["lat"],uniqueNodes[i]["lon43.649465,-79.3766"],"K");
    
  }

  uniqueNodes.sort(function(a, b) { 
    return a.distance - b.distance;
  });
  
  uniqueNodes.filter(function(a) { 
    return a["num_docks_available"] > 0 
  });
  
 

    text = uniqueNodes[0].name
    
    location = uniqueNodes[0].lat + "," + uniqueNodes[0].lon
// if(config.runsInSiri){
    Speech.speak("closest location with available docks is" + text)
//     }
        
    
//     a.title = "watch"
//         a.message = text
//     a.present()
  
    Pasteboard.copyString(location)
    //QuickLook.present(uniqueNodes)
     
}


function calculateDistance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var radlon1 = Math.PI * lon1/180
  var radlon2 = Math.PI * lon2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}

