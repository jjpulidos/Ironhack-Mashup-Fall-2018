//////////////////////////////////////////////
// Map Initialize
var DSNum = 0

function getMapOffset(){
    var mapOffset = 0;
    var zoom = map.getZoom();

    // y = x-(x*0.5)
    if(zoom <= 12){
        mapOffset = 0.11;
    }else if(zoom > 12 && zoom <= 13){
        mapOffset = 0.05;
    }else if(zoom > 13 && zoom <= 14){
        mapOffset = 0.025;
    }else if(zoom > 14 && zoom <= 15){
        mapOffset = 0.0125;
    }else if(zoom > 15 && zoom <= 16){
        mapOffset = 0.00625;
    }else if(zoom > 16 && zoom <= 17){
        mapOffset = 0.003125;
    }else if(zoom > 17 && zoom <= 18){
        mapOffset = 0.0015625;
    }else if(zoom > 18 && zoom <= 19){
        mapOffset = 0.00078125;
    }else if(zoom > 19 && zoom <= 20){
        mapOffset = 0.000390625;
    }else if(zoom > 20 && zoom <= 21){
        mapOffset = 0.0001953125;
    }else if(zoom > 21 && zoom <= 22){
        mapOffset = 0.00009765625;
    }

    return mapOffset;
}

var infoPolygonAct = new Array(600).fill(0)
var notPolygons = false

function onGoogleMapResponse(){
    trafficLayer = new google.maps.TrafficLayer()
    transitLayer = new google.maps.TransitLayer()
    bikeLayer = new google.maps.BicyclingLayer()

    map = new google.maps.Map(document.getElementById('googleMapContainer'), {
        center: {lat: 40.7291, lng: -73.9965},
        zoom: 10,
        styles: mapArrayStyle,
        disableDefaultUI: true
    })

    nyu = new google.maps.LatLng({lat: 40.7291, lng: -73.9965})

    interactiveMap();

    addNYU()


}


//////////////////////////////////////////
// Butttons Optional DS


function showData(fieldName, fileName, arrayMarker, icon, showFlag) {

    if(showFlag){

        if (fileName.length === 0){
            setDataMap(fieldName, fileName)

            fileName.map(data => {
                //console.log(data)
                var marker = new google.maps.Marker({
                    position: data[1],
                    title: data[0].toString(),
                    //animation: google.maps.Animation.DROP,
                    // map: map,
                    icon: icon
                })

                var contentString =``
                if (fieldName === 'museums'){
                    //console.log(data)
                    contentString+= `Museum Name: ${data[2][9]}<br> Phone Number: ${data[2][10]}<br> Address: ${data[2][12]} ${data[2][13]}<br> <a href="${data[2][11]}">Link to WebSite</a> <br>`
                }else if(fieldName === 'galleries'){
                    //console.log(data)
                    contentString+= `Gallery Name: ${data[2][9]}<br> Phone Number: ${data[2][10]}<br> Address: ${data[2][12]}<br> Zip Code: ${parseInt(data[2][15])}<br>  <a href="${data[2][11]}">Link to WebSite</a> <br>`
                }else if(fieldName === 'farmers'){

                    //console.log(data)

                    contentString+= `Farmer Market Name: ${data[2].market_name}<br> Contact Name: ${data[2].contact} <br> Contact Number: ${data[2].phone}<br> Address: ${data[2].location} ${data[2].address_line_1}<br> Zip Code: ${parseInt(data[2].zip)}<br> <a href="${data[2].market_link}">Link to WebSite</a> <br> Business hours: ${data[2].operation_hours}`

                    // if (){
                    contentString+= `<br> Operation Season: ${data[2].operation_season}`
                    // }

                }else if(fieldName === 'subways'){
                    //console.log(data[2])
                    contentString+= `Division: ${data[2][8]} <br>
Line: ${data[2][9]} <br>
Station Name: ${data[2][10]} <br>
Entrance Type: ${data[2][24]} <br>
Free Crossover:  ${data[2][32]} <br>
North South Street: ${data[2][33]} <br>
East West Street: ${data[2][34]} <br> `
                }

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                })

                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });

                arrayMarker.push(marker)
            })

            arrayMarker.map((marker, i )=> {
                setTimeout(marker.setMap(map), i * 5000);
            })
        }else{
            arrayMarker.map((marker, i )=> {
                setTimeout(marker.setMap(map), i * 5000);
            })
        }

    }else{
        if (fileName.length !== 0){
            arrayMarker.map(marker => {
                marker.setMap(null)
            })
        }

    }



}

///////////////////////////////////

function museumsFun(){
    // console.log(showMuseums)
    showMuseums = !showMuseums
    showData('museums', museumsLocation, museumsMarkers, icons[2], showMuseums)
    //console.log(showMuseums)
}


function galleriesFun(){
    //console.log(showMuseums)
    showGalleries = !showGalleries
    showData('galleries', galleriesLocation, galleriesMarkers, icons[0], showGalleries)
    //console.log(showMuseums)
}

function farmersFun(){
    // console.log(showMuseums)
    showFarmers = !showFarmers
    showData('farmers', farmersLocation, farmersMarkers, icons[1], showFarmers)
    // console.log(showMuseums)
}

function subwaysFun(){
    // console.log(showMuseums)
    showSubway = !showSubway
    showData('subways', subwaysLocation, subwayMarkers, icons[3], showSubway)
    // console.log(showMuseums)
}




///////////////////////////////////











//////////////////////////////////////////////
// HeatMap Activation

var heatMapExist = false

function heatMapActivation(){

    if(!heatMapExist){
        setDataMap("crimes", crimesLocation)
        crimesLocation = crimesLocation.map(data => new google.maps.LatLng(data[1]))

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: crimesLocation,
        })
        heatMapExist = true
    }


    notPolygons= !notPolygons
    if (notPolygons){
        strokeWeight = 0
        fillOpacity = 0
        color = "#000000"
        strokeOpacity= 0
        map.data.revertStyle()

        map.data.setStyle(function(feature){
            return({
                strokeColor: color,
                strokeOpacity: strokeOpacity,
                strokeWeight: strokeWeight,
                fillColor: color,
                fillOpacity: fillOpacity

            })
        })

        toggleHeatmap()
        changeGradient()
        changeRadius()
        //distanceMapActivation()
    }else{
        interactiveMap()
        toggleHeatmap()
        changeGradient()
    }
}
///////////////////////////////////
// Distance Map Activation

function distanceOn(){
    notPolygons= !notPolygons
    if (notPolygons){
        strokeWeight = 0
        fillOpacity = 0
        color = "#000000"
        strokeOpacity= 0
        map.data.revertStyle()

        map.data.setStyle(function(feature){
            return({
                strokeColor: color,
                strokeOpacity: strokeOpacity,
                strokeWeight: strokeWeight,
                fillColor: color,
                fillOpacity: fillOpacity

            })
        })
    }else{
        interactiveMap()
    }
    //console.log("fsdsdfsdfsdfsdfsdf")
    distanceState = !distanceState
    //console.log(distanceState)
    if(distanceState){

        distanceMapActivation()
    }else{
        if(distancePath!== undefined){

            circles.map(circle => circle.setMap(null))
            distancePath.setMap(null)
            distancePath2.setMap(null)
        }else{

            circles.map(circle => circle.setMap(null))
        }

    }
}

function distanceMapActivation(){

    circles.map(circle => circle.setMap(null))
    //distancePath.setMap(null)
    //distancePath2.setMap(null)
    circles = []
    var path =[]


    boroughDataSetKeys.map(key =>{
        //console.log(boroughDataSet[key])
        Object.keys(boroughDataSet[key].districts_Dict).map(BoroCD => {
            path.push(boroughDataSet[key].districts_Dict[BoroCD].center)
            path.push(nyu)

            var circle = new google.maps.Circle({
                strokeColor: '#FFFFFF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FFFFFF',
                fillOpacity: 0.8,
                map: map,
                center: boroughDataSet[key].districts_Dict[BoroCD].center,
                radius:80
            })
            circles.push(circle)
        })
    })

    distancePath = new google.maps.Polyline({
        path: path,
        strokeColor: '#2CA8FF',
        strokeOpacity: 0.7,
        strokeWeight: 2,
    })

    distancePath.setMap(map)

    distancePath2 = new google.maps.Polyline({
        path: path,
        strokeColor: '#f1b3ff',
        strokeOpacity: 0.1,
        strokeWeight: 6,
    })

    distancePath2.setMap(map)
}


//////////////////////////////////////////////
var firstCharge = 0
var percent = 0;
function interactiveMap(){

    map.data.setStyle(function(feature){
        // if(indexTotalNH!=297) addNeighborHoods(feature)
        //console.log(feature.l.BoroCD)
        var BoroCD = feature.l.BoroCD
        var BoroID = parseInt(BoroCD.toString().substring(0, 1))

        if (firstCharge!==59){

            boroughDataSet[BoroID].districts_Dict[BoroCD]["center"] = districtPolygons[BoroCD]
            boroughDataSet[BoroID].districts_Dict[BoroCD]["distance"]= google.maps.geometry.spherical.computeDistanceBetween(nyu, districtPolygons[BoroCD])

            Promise.all([



                addOptionalData("NY_housing", feature),
                addOptionalData("NY_neighborhood_names", feature),
                addOptionalData("NY_crimes", feature),
                addOptionalData("NY_museums", feature),
                addOptionalData("NY_galleries", feature),
                addOptionalData("NY_farmers_markets", feature),
                addOptionalData("NY_Subway", feature)

            ]).then(()=>{
                firstCharge ++;
                percent = ((firstCharge*100)/59);



                if (firstCharge === 59){
                    //console.log("Hell");
                    setTimeout(() => {
                        $('head').append('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">');
                        $('#loaded_page').show()
                        $('#loader, #preloadh1_loader, #percent').hide();

                        $('#hideBtn').fadeIn(400);
                        $('#goHome').fadeIn(400);
                    }, 200)
                }
                $('#percent_container').html(`
          <h4 style="font-size: 2em;"  id='percent' >${percent.toFixed(2) + "%"}</h4>
          `);

            })

        }


        // if(indexTotalB!=2488) addHouse(feature)
        // if(indexTotalC!=994) addCrimes(feature)
        //addData(feature)


        var color = colors[parseInt(feature.l.BoroCD/100 - 1)]
        var strokeWeight = 0.4
        var fillOpacity = 0.2
        //feature.l["state"] = true

        //TODO: Resaltar TOP 10
        // if(feature.getProperty("inTop")){
        //  color = "black"
        //  strokeWeight = 2
        //  fillOpacity = 0.4
        // }

        if (feature.getProperty("isSelected")){
            color = "blue"
            strokeWeight = 2
            fillOpacity = 0.4



        }

        return({
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: strokeWeight,
            fillColor: color,
            fillOpacity: fillOpacity

        })
    })

    var infwin = new google.maps.InfoWindow();

    map.data.addListener('click', function(event) {

        if (event.feature.getProperty("isSelected")){

            event.feature.setProperty('isSelected', false)

            infwin.close(map);
            if(selectedDistricts.length !==0){
                selectedDistricts.pop()

                //console.log("deberia sacarlo")

                $("#compare").addClass("disabledbutton");
            }

        }else{

            if(selectedDistricts.length !==2){

                event.feature.setProperty("isSelected", true)

                //console.log(event.feature)
                var BoroCD = event.feature.l.BoroCD
                var BoroID = BoroCD.toString().substring(0,1)
                var district = boroughDataSet[BoroID].districts_Dict[BoroCD]
                selectedDistricts.push(district)
                //console.log(district)
                ///////////////////////
                var nb = ""

                Object.keys(district.nbhoods).map(nbk =>{

                    nb += ('<li class="neigItem">'+ district.nbhoods[nbk][2][10] + '</li>')

                })

                var contentString = `
            <div class="MainDistrictContainer">
              <h3 class="Title"> <a class="a_title">${boroughDataSet[BoroID].borough_Name} ${BoroCD}</a> </h3>

              <div clas="BlockNeighbors">
                <p class="neig">District Neighborhoods</p>
                <ul class="NeighborDist">
                  ${nb}
                </ul>
              </div>

              <div class="Square">
                <p class="dis">Distance to NYU: ${district.distance.toFixed(2)}
                </p>
                <p class="aff">Total Low Incomes: ${district.TLI}</p>
                <p class="sub">Subway Entrances: ${Object.keys(district.subways).length}</p>
                <p class="farm">Farmers Markets: ${Object.keys(district.farmers).length} </p>
                <p class="mus">Museums: ${Object.keys(district.museums).length}</p>
                <p class="art">Art Galleries: ${Object.keys(district.galleries).length}</p>
                <p class="cri">Crimes on 31 December 2015: ${Object.keys(district.crimes).length}</p>
                <p class="cri">Buildings: ${Object.keys(district.buildings).length}</p>
              </div>

            </div>
          `


                infwin.setContent(contentString)
                infwin.setPosition(event.latLng)
                infwin.open(map);
                map.setCenter(new google.maps.LatLng(event.latLng.lat()- getMapOffset()-0.6,(event.latLng.lng())));
                map.setZoom(12)

                layout.removeClass('ShowAnimation');
                layout.addClass('HideAnimation');
                hide_status = 1;


                if (selectedDistricts.length ===2){
                    $("#compare").removeClass("disabledbutton");
                }else{
                    $("#compare").addClass("disabledbutton");
                }
            }


        }

    })


    map.data.addListener('mouseover', function(event) {

        map.data.revertStyle()
        map.data.overrideStyle(event.feature, {strokeWeight: 2,  fillOpacity: 0.6 })

    })

    map.data.addListener('mouseout', function(event) {
        //  if (infoPolygonAct[event.feature.l.BoroCD] !== 0){
        //     infoPolygonAct[event.feature.l.BoroCD].close()
        // 		infoPolygonAct[event.feature.l.BoroCD]=0
        // }
        map.data.revertStyle()
    })



}

function addNYU(){



    var marker = new google.maps.Marker({ position: nyu,
        title: "NYU Stern School of Business",                                   visible: true,
        animation: google.maps.Animation.DROP,

        map: map,
        icon: "https://img.icons8.com/bubbles/45/000000/graduation-cap.png" /* https://i.imgur.com/zmrZX6f.png */

    })
    marker.addListener('click', toggleBounce);

    function toggleBounce() {

        marker.setAnimation(google.maps.Animation.BOUNCE)
        setTimeout(function(){ marker.setAnimation(null); }, 750);
    }
}





function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}


function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 15);
}


function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function trafficOn(){
    trafficState= !trafficState
}

function transitOn(){
    transitState= !transitState
}

function bikeOn(){
    bikeState= !bikeState
}

function setTopMarkers(map) {

    topMarkers.map(mark => mark.setMap(map))
}

function eraseTopMarkers(map) {
    topMarkers.map(mark => mark.setMap(null))
    topMarkers = []
}

function changeGradient() {
    /*
          var gradient = [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
          ]*/

    var gradient = [
        'rgba(0, 0, 0, 1)',
        'rgba(1, 1, 1, 1)',
        'rgba(2, 2, 2, 1)',
        'rgba(4, 4, 4, 1)',
        'rgba(8, 8, 8, 1)',
        'rgba(16, 16, 16, 1)',
        'rgba(32, 32, 32, 1)',
        'rgba(63, 63, 63, 1)',
        'rgba(127, 127, 127, 1)',
        'rgba(191, 191, 191, 1)',
        'rgba(255, 255, 255, 1)',
        //'rgba(255, 255, 255, 0)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

/*
      var gradient = [
          'rgba(255, 255, 255, 0)',
          'rgba(255, 255, 255, 1)',
          'rgba(191, 191, 191, 1)',
          'rgba(127, 127, 127, 1)',
          'rgba(63, 63, 63, 1)',
          'rgba(32, 32, 32, 1)',
          'rgba(16, 16, 16, 1)',
          'rgba(8, 8, 8, 1)',
          'rgba(4, 4, 4, 1)',
          'rgba(2, 2, 2, 1)',
          'rgba(1, 1, 1, 1)',
          'rgba(0, 0, 0, 1)'
        ]*/
