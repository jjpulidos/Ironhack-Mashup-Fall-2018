////////////////////////////////
// Maps Global Variables
var map
var heatmap
var trafficLayer
var transitLayer
var bikeLayer
var nyu
var trafficState = false
var transitState = false
var bikeState = false
var circles = []
var distanceState = false
var distancePath
var distancePath2
var icons = ["https://i.imgur.com/mWTVRBu.png", "https://i.imgur.com/gQC5ZZP.png", "https://i.imgur.com/cyQLJVV.png", "https://i.imgur.com/U6sGmJl.png"]
var museumsMarkers = []
var galleriesMarkers = []
var subwayMarkers = []
var farmersMarkers = []
var showMuseums= false
var showGalleries= false
var showSubway= false
var showFarmers= false
var selectedDistricts = []
////////////////////////////////

var topMarkers = []
var indexTotalNH = 0
var indexTotalB = 0
var indexTotalC = 0
var colors = ['#FF7F00','#36DB00','#D01E18','#8E0FA4','#219BFF']
var tmp={
    "distance" : 0,
    "crimes" : 0,
    "TLI" : 0,
    "museums": 0,
    "galleries": 0,
    "farmers": 0,
    "subways": 0,
}
var table_status

////////////////////////////////////////////////
var boroughDict = {
    "Manhattan": 1,
    "Bronx": 2,
    "Brooklyn": 3,
    "Queens": 4,
    "Staten Island": 5
}

var boroughDictUp = {
    "MANHATTAN": 1,
    "BRONX": 2,
    "BROOKLYN": 3,
    "QUEENS": 4,
    "STATEN ISLAND": 5
}
var boroughDataSet = {
    1:{
        "borough_Name" : "Manhattan",
        "districts_Dict" : {},
    },
    2:{
        "borough_Name" : "Bronx",
        "districts_Dict" : {},
    },
    3:{
        "borough_Name" : "Brooklyn",
        "districts_Dict" : {},
    },
    4:{
        "borough_Name" : "Queens",
        "districts_Dict" : {},
    },
    5:{
        "borough_Name" : "Staten Island",
        "districts_Dict" : {},
    }
}

var dictUsable = {
    "crimes" : "Crimes On Date",
    "TLI" : "Affordability Units",
    "distance" : "Closeness in Meters",
    "museums": "Museums Number",
    "galleries": "Galleries number",
    "farmers": "Farmers Market number",
    "subways": "Subway Entrances Number",
}

var dataSetGeoJSON = {
    // Mandatory Dataset
    "NY_districts_shapes":  {    "link" : "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson" }
}

var dataSetsURL= {
    // Mandatary Datasets

    "NY_housing":  {    "link" : "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD" } ,

    "NY_neighborhood_names":{    "link" : "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD" } ,

    "NY_crimes":  {    "link" : "https://data.cityofnewyork.us/resource/qgea-i56i.json?$where=cmplnt_fr_dt=%222015-12-31T00:00:00%22&$limit=50000" } ,

    // Optional Datasets
    // "NY_air_quality":  {    "link" : "https://data.cityofnewyork.us/api/views/c3uy-2p5r/rows.json?accessType=DOWNLOAD" } ,

    "NY_museums" :  {    "link" : "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD" } ,

    "NY_galleries" :  {    "link" : "https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD" } ,

    "NY_farmers_markets" :  {    "link" : "https://data.ny.gov/resource/7jkw-gj56.json" } ,

    "NY_Subway" : { "link" : "https://data.ny.gov/api/views/rwat-jhj8/rows.json?accessType=DOWNLOAD"}

}


var mapArrayStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#242f3e"
            }
        ]
    },
    {
        "elementType": "geometry.fill",
        "stylers": [
            {
                "weight": 0.5
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#746855"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#242f3e"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#263c3f"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6b9a76"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#38414e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#212a37"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9ca5b3"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#746855"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#1f2835"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#f3d19c"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2f3948"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#17263c"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#515c6d"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#17263c"
            }
        ]
    }
]




var crimesLocation = []
var museumsLocation = []
var galleriesLocation = []
var subwaysLocation = []
var farmersLocation = []

var districtsExcluded = [164, 227, 226, 224, 356, 355, 480, 481, 482, 483, 484, 595, 228]



var jsonDataSetsKeys = Object.keys(dataSetsURL)
var geoJsonDataSetsKeys= Object.keys(dataSetGeoJSON)

var boroughDataSetKeys = Object.keys(boroughDataSet)

function getDataFromURL( key ) {
    const data = $.getJSON(dataSetsURL[key]["link"], function() {})

        .done(function(){
            if(key === "NY_crimes" || key === "NY_farmers_markets"){
                dataSetsURL[key]["data"] = {}
                dataSetsURL[key]["data"]["data"] = data["responseJSON"]
            }else{
                dataSetsURL[key]["data"] =/*return */data["responseJSON"]
            }

        })
        .fail(function(error){
            console.error(error)
        });
}



task = [
    jsonDataSetsKeys.map(dataSetKey => getDataFromURL(dataSetKey)),
    //geoJsonDataSetsKeys.map(geoJSONDataSetKey =>getDataFromGeoJSONData(geoJSONDataSetKey)),

    // interactiveMap(),
    //addNYU(),
]

Promise.all(task).then(()=>{
    // DSNum++

})