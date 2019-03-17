function setDataMap(filter, file) {
    boroughDataSetKeys.map(key => {
        Object.keys(boroughDataSet[key].districts_Dict).map(district => {
            // console.log(district, filter)
            Object.keys(boroughDataSet[key].districts_Dict[district][filter]).map(row => {
                // console.log(row, file)
                file.push(boroughDataSet[key].districts_Dict[district][filter][row])
            })
        })
    })
}


function setPolygon(paths){
    mapPolygon = new google.maps.Polygon({
        paths: paths,
    })
    return mapPolygon;
}

var districtPolygons= {}

function getDataFromGeoJSONData( url ){

    var tmpGeoJson = {
        "type": "FeatureCollection",
        "features": []
    }

    const data = $.get(dataSetGeoJSON[url]["link"], function() {})

        .done(function(){
            JSON.parse(data["responseText"]).features.map( district => {
                var BoroCD = district.properties.BoroCD
                var BoroID = parseInt(BoroCD.toString().substring(0, 1))

                if (!boroughDataSet[BoroID].hasOwnProperty("boroBounds")){
                    boroughDataSet[BoroID]["boroBounds"] = new google.maps.LatLngBounds()
                }

                ///////////////////////////////////

                if (district.geometry.coordinates.length > 1){
                    // This is a Multipolygon
                    var districtBound = new google.maps.LatLngBounds()
                    district.geometry.coordinates.map(polygon => {
                        paths = [];
                        polygon.map(coordinate => {

                            coordinate.map(point => {
                                var path = {"lat": point[1], "lng": point[0]}
                                paths.push(path)
                                districtBound.extend(path)
                                boroughDataSet[BoroID]["boroBounds"].extend(path)
                            })
                        })
                    })
                    // console.log(districtBound.getCenter())
                    districtPolygons[BoroCD]= districtBound.getCenter()
                    // boroughDataSet[BoroID].districts_Dict[BoroCD]["center"] = districtBound.getCenter()

                }else{
                    var districtBound = new google.maps.LatLngBounds()
                    paths = [];
                    district.geometry.coordinates[0].map(coordinate => {
                        var path = {"lat": coordinate[1], "lng": coordinate[0]}
                        paths.push(path)
                        districtBound.extend(path)
                        boroughDataSet[BoroID]["boroBounds"].extend(path)
                    })
                    // console.log(districtBound.getCenter().lat(), districtBound.getCenter().lng())
                    districtPolygons[BoroCD]= districtBound.getCenter()
                    //boroughDataSet[BoroID].districts_Dict[BoroCD]["center"] = districtBound.getCenter()
                }
                ///////////////////////////////////


                if( !districtsExcluded.includes(BoroCD)){
                    //district["center"] = centroids_Dict_File[BoroCD]
                    //district["distance"] = distances_Dict_File[BoroCD]
                    boroughDataSet[BoroID].districts_Dict[BoroCD] = district
                    tmpGeoJson.features.push(district)
                }

            })

            map.data.addGeoJson(tmpGeoJson)

        })
        .fail(function(error){
            console.error(error)
        });
}


//-----------------------------------Data Set Modular Charge-----------------------------------------------

var functionDataSets = {

    "NY_museums": {
        "function": function(row){
            var data=[]
            if(typeof(row[8])=== "string")row[8] = row[8].replace("POINT (", "").replace(")", "").split(" ")
            var loc = {lat: parseFloat(row[8][1]), lng: parseFloat(row[8][0])}
            data.push(row[9])
            data.push(loc)
            data.push(row)
            return data
        },
        "doneRows": {},
        "nameField": "museums"
    },

    "NY_galleries":{
        "function": function(row){
            var data=[]
            //console.log(row)
            if(typeof(row[8])=== "string")row[8] = row[8].replace("POINT (", "").replace(")", "").split(" ")
            var loc = {lat: parseFloat(row[8][1]), lng: parseFloat(row[8][0])}
            data.push(row[9])
            data.push(loc)
            data.push(row)
            return data
        },
        "doneRows": {},
        "nameField": "galleries"
    },

    "NY_neighborhood_names": {
        "function": function(row){
            var data=[]
            if(typeof(row[8])=== "string")row[8] = row[8].replace("POINT (", "").replace(")", "").split(" ")
            var loc = {lat: parseFloat(row[8][1]), lng: parseFloat(row[8][0])}
            data.push(row[9])
            data.push(loc)
            data.push(row)
            return data
        },
        "doneRows": {},
        "nameField": "nbhoods"
    },

    "NY_crimes": {
        "function": function(row){
            var data=[]
            var loc = {lat: parseFloat(row.latitude), lng: parseFloat(row.longitude)}
            data.push(row.cmplnt_num)
            data.push(loc)
            data.push(row)
            return data
        },
        "doneRows": {},
        "nameField": "crimes"
    },
    "NY_housing": {
        "function": function(row){
            var data=[]
            var loc = {lat: parseFloat(row[23]), lng: parseFloat(row[24])}
            data.push(row[12])
            data.push(loc)
            data.push(row)
            return data
        },
        "doneRows": {},
        "nameField": "buildings"
    },
    "NY_farmers_markets": {
        "function": function(row){
            //console.log(row)
            var data=[]
            var loc = {lat: parseFloat(row.latitude), lng: parseFloat(row.longitude)}
            data.push(row.market_name)
            data.push(loc)
            data.push(row)
            return data
        },
        "doneRows": {},
        "nameField": "farmers"
    },
    "NY_Subway" : {
        "function": function(row){
            //console.log(row)
            var data=[]
            var loc = {lat: parseFloat(row[36]), lng: parseFloat(row[37])}
            data.push(row[2])
            data.push(loc)
            data.push(row)
            return data
        },
        "doneRows": {},
        "nameField": "subways"
    }

}

var iCDComplete= 0

function addOptionalData(dataset, feature){

    var fun = undefined
    var BoroCD = feature.l.BoroCD
    var BoroID = BoroCD.toString().substring(0, 1)

    var TLI = -1.0
    if(dataset == "NY_housing"){
        TLI = 0.0
        boroughDataSet[BoroID].districts_Dict[BoroCD].TLI= 0.0

    }

    if (!boroughDataSet[BoroID].districts_Dict[BoroCD].hasOwnProperty(functionDataSets[dataset].nameField)){
        boroughDataSet[BoroID].districts_Dict[BoroCD][functionDataSets[dataset].nameField]= {}
    }

    fun = (data => data)

    if (functionDataSets.hasOwnProperty(dataset)){
        fun = functionDataSets[dataset].function
    }

    iCDComplete = 0
    //console.log(dataSetsURL[dataset].data, dataset)
    //	console.log( dataSetsURL[dataset])
    dataSetsURL[dataset].data.data.map(row => {
        iCDComplete++
        row = fun(row)

        //Amortized Complexity
        if (!functionDataSets[dataset].doneRows.hasOwnProperty(row[0])){

            if (boroughDataSet[BoroID].boroBounds.contains(row[1])){
                ///// Comienza el Proceso

                if(feature.getGeometry().getType() === "Polygon"){

                    var polygonCoords = feature.getGeometry().getAt(0).getArray()

                    if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(row[1]), new google.maps.Polygon({paths:polygonCoords}))){




                        boroughDataSet[BoroID].districts_Dict[BoroCD][functionDataSets[dataset].nameField][row[0]] = row
                        functionDataSets[dataset].doneRows[row[0]] = 1
                        if(TLI>-1) boroughDataSet[BoroID].districts_Dict[BoroCD].TLI+= parseFloat(row[2][33])

                    }

                }else{

                    //Then is MultiPolygon Type

                    var multiPoly = feature.j.getArray()

                    for (var i = 0; i<multiPoly.length;i++){

                        var coords = multiPoly[i].getArray()[0].j

                        if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(row[1]), new google.maps.Polygon({paths:coords}))){

                            //Lo Inserta en el DataSet
                            boroughDataSet[BoroID].districts_Dict[BoroCD][functionDataSets[dataset].nameField][row[0]] = row
                            functionDataSets[dataset].doneRows[row[0]] = 1
                            if(TLI>-1) boroughDataSet[BoroID].districts_Dict[BoroCD].TLI+= parseFloat(row[2][33])
                            break
                        }

                    }

                }

                /// Termina el Proceso

            }


        }
    })
    //console.log(iCDComplete)
}


function orbitData(districtsSelected){
    var orbs = []

    var rescaleCrimes= d3.scale.linear().domain([6, 46]).range([0, 600])

    var rescaleDistance= d3.scale.linear().domain([508, 26251]).range([0, 600])

    var rescaleTLI= d3.scale.linear().domain([0, 4355]).range([600, 0])

    var rescaleMuseums= d3.scale.linear().domain([0, 21]).range([600, 0])

    var rescaleGalleries= d3.scale.linear().domain([0, 194]).range([600, 0])

    var rescaleFarmers= d3.scale.linear().domain([0, 9]).range([600, 0])

    var rescaleSubways= d3.scale.linear().domain([0, 201]).range([600, 0])


    districtsSelected.map(district => {
        // console.log(district)
        var orbData = {}
        var BoroCD = district.properties.BoroCD
        var BoroID = parseInt(BoroCD.toString().substring(0, 1))

        orbData["name"]=BoroCD
        orbData["value"]= 700
        orbData["color"]= "#73cbf0"
        orbData["children"]= []

        var orbCrime = {
            "name": "Crimes: " + Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].crimes).length,
            "value":  rescaleCrimes(Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].crimes).length),
            "color": "gray"
        }

        var orbAffor = {
            "name": "Affordability:" + boroughDataSet[BoroID].districts_Dict[BoroCD].TLI,
            "value":  rescaleTLI(boroughDataSet[BoroID].districts_Dict[BoroCD].TLI),
            "color": "#d6bb87"
        }

        var orbClose = {
            "name": "Closeness: " + boroughDataSet[BoroID].districts_Dict[BoroCD].distance.toFixed(2),
            "value":  rescaleDistance(boroughDataSet[BoroID].districts_Dict[BoroCD].distance),
            "color": "#677188"
        }

        var orbMuseums = {
            "name": "Museums: "+ Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].museums).length,
            "value":  rescaleMuseums(Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].museums).length),
            "color": "#7c5541"
        }

        var orbGalleries = {
            "name": "Galleries: "+ Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].galleries).length,
            "value":  rescaleGalleries(Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].galleries).length),
            "color": "#a36a3e"
        }

        var orbFarmers = {
            "name": "Farmers: " + Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].farmers).length,
            "value":  rescaleFarmers(Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].farmers).length),
            "color": "#e9ba85"
        }


        var orbSubways = {
            "name": "Subways Entrance: "+ Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].subways).length,
            "value":  rescaleSubways(Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].subways).length),
            "color": "#73cbf0"
        }

        orbData["children"].push(orbCrime)
        orbData["children"].push(orbAffor)
        orbData["children"].push(orbClose)
        orbData["children"].push(orbMuseums)
        orbData["children"].push(orbGalleries)
        orbData["children"].push(orbFarmers)
        orbData["children"].push(orbSubways)
        orbs.push(orbData)
    })

    //console.log(orbs)

    /*orbs.map(orb => {
    drawOrbit(orb)
  })*/

    drawOrbit(orb[0], "#Orbital")
    drawOrbit(orb[1], "#Orbital2")

    //console.log("Ya tuvo que imprimirse las orbitas")

}

function radarChart(districtsSelected){

    var data = []

    var rescaleCrimes= d3.scale.linear().domain([6, 46]).range([0, 600])

    var rescaleDistance= d3.scale.linear().domain([508, 26251]).range([0, 600])

    var rescaleTLI= d3.scale.linear().domain([0, 4355]).range([600, 0])

    var rescaleMuseums= d3.scale.linear().domain([0, 21]).range([600, 0])

    var rescaleGalleries= d3.scale.linear().domain([0, 194]).range([600, 0])

    var rescaleFarmers= d3.scale.linear().domain([0, 9]).range([600, 0])

    var rescaleSubways= d3.scale.linear().domain([0, 201]).range([600, 0])

    var BoroCDs = []

    districtsSelected.map(district => {
        var axis = []

        var BoroCD = district.properties.BoroCD
        var BoroID = parseInt(BoroCD.toString().substring(0, 1))
        BoroCDs.push(BoroCD)

        axis.push({
            "axis": "Security",
            "value":  rescaleCrimes(Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].crimes).length)/600
        })

        axis.push({
            "axis": "Affordability",
            "value":  rescaleTLI(boroughDataSet[BoroID].districts_Dict[BoroCD].TLI)/600
        })

        axis.push({
            "axis": "Closeness",
            "value":  rescaleDistance(boroughDataSet[BoroID].districts_Dict[BoroCD].distance)/600
        })

        axis.push({
            "axis": "Museums",
            "value":  rescaleMuseums(Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].museums).length)/600
        })

        axis.push({
            "axis": "Galleries",
            "value":  rescaleGalleries(Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].galleries).length)/600
        })

        axis.push({
            "axis": "Farmers",
            "value":  rescaleFarmers(Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].farmers).length)/600
        })


        axis.push({
            "axis": "Subways",
            "value":  rescaleSubways(Object.keys(boroughDataSet[BoroID].districts_Dict[BoroCD].subways).length)/600
        })

        data.push(axis)

    })
    radarOn(BoroCDs, data)
    //console.log(data)
}


function goToDistrict(BoroCD){
    var BoroID = BoroCD.toString().substring(0,1)
    var center = boroughDataSet[BoroID].districts_Dict[BoroCD].center;
    //console.log(center)
    latLng = new google.maps.LatLng({"lat":center.lat(), "lng":center.lng()});
    //setMapCenter(latLng);
    map.setCenter(latLng);
    map.setZoom(13);
}