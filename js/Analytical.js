//////////////////////////////////////////////
// Weighted Mean

const sumArrayValues = (values) => {
    return values.reduce((p, c) => p + c, 0)
}

const weightedMean = (factorsArray, weightsArray) => {
    return sumArrayValues(factorsArray.map((factor, index) => factor * weightsArray[index])) / sumArrayValues(weightsArray)
}

//////////////////////////////////////////////
// Filtros

function filterApply(weigths, map){

    eraseTopMarkers(map)

    tableReference = $("#mainTableBody")[0];

    var tableBody = $("#mainTableBody > tr");

    tableBody.map(row => tableBody.remove())

    var borocdTable, totalPointsTable, closenessTable, safetyTable, afforTable

    var valuesArray
    var weigthsArray

    var filters = Object.keys(weigths)
    var results = {}

    // Proceso de Normalizacion de Datos

    var arrayVal = []
    var rescaleNormalize =  filters.map(filter => {
        //console.log(filter)
        if(weigths[filter]!== 0){
            //console.log(filter, weigths[filter] )
            arrayVal = []
            boroughDataSetKeys.map(key => {
                Object.keys(boroughDataSet[key].districts_Dict).map(BoroCD =>{

                    var district = boroughDataSet[key].districts_Dict[BoroCD]
                    var value =district[filter]
                    if (filter === "crimes" ||   filter === "museums" || filter === "galleries" || filter === "farmers" || filter === "subways") value = Object.keys(district[filter]).length
                    // console.log(filter, "     ", district,"     ", value)
                    //console.log(district, BoroCD)
                    if (value!==undefined){
                        arrayVal.push(value)
                    }else{

                        if (filter === "crimes"||   filter === "museums" || filter === "galleries" || filter === "farmers" || filter === "subways"){
                            value=0
                        }else if (filter === "TLI"){
                            value=1000
                        }
                        arrayVal.push(value)
                    }

                })
            })
        }else{
            arrayVal = []
        }

        var max = d3.max(arrayVal)
        var min = d3.min(arrayVal)
        //console.log(arrayVal, filter, min, max)
        if (filter === "distance"){
            rescale = d3.scale.linear().domain([min, max]).range([0, 1000])
        }else if (filter === "crimes"){
            rescale = d3.scale.linear().domain([min, max]).range([0, 1000])
        }else if (filter === "TLI" || filter === "museums" || filter === "galleries" || filter === "farmers" || filter === "subways"){
            rescale = d3.scale.linear().domain([min, max]).range([1000, 0])
        }

        //console.log(min, max)
        return rescale


    })
    //console.log(rescaleNormalize)

    boroughDataSetKeys.map(key => {
        Object.keys(boroughDataSet[key].districts_Dict).map(BoroCD => {

            valuesArray = []
            weigthsArray = []

            filters.map((filter, ind) => {

                var value =  boroughDataSet[key].districts_Dict[BoroCD][filter]
                if (filter === "crimes" ||   filter === "museums" || filter === "galleries" || filter === "farmers" || filter === "subways") value = Object.keys(boroughDataSet[key].districts_Dict[BoroCD][filter]).length

                if(weigths[filter]!== 0){

                    if(value === undefined) value = 0
                    value = rescaleNormalize[ind](value)
                    //console.log(value)
                    valuesArray.push(value)
                    weigthsArray.push(weigths[filter])

                }
            })
            //console.log(valuesArray, weigthsArray)
            results[BoroCD]= weightedMean(valuesArray, weigthsArray)
            //console.log(results[BoroCD])
            // }
        })
    })
    //console.log(results)
    items = Object.keys(results).map(key =>{
        return [key, results[key]]
    })


    items.sort( (first, second) =>{
        return first[1] - second[1]
    })
    //	console.log(items)

    var maxi = d3.max(items.map(item => item[1]))

    items.map( item =>{
        item[1]= maxi - item[1]
    })
    //console.log(items)

    tableReferenceTitles = $("#mainTableTitles")[0];

    var tableTitles = $("#mainTableTitles tr th");

    tableTitles.map(row =>tableTitles.remove())
    newRow = tableReferenceTitles.insertRow(tableReferenceTitles.rows.length)
    //newRow.insertCell(0)
    borocdTitle = newRow.insertCell(0)
    totalPointsTitle = newRow.insertCell(1)
    borocdTitle.innerHTML = "BoroCD"
    totalPointsTitle.innerHTML= "Total Points"

    var ind = 0
    Object.keys(weigths).map(filter => {
        if(weigths[filter]!== 0){

            var cellFilter = newRow.insertCell(ind+2)
            cellFilter.innerHTML = dictUsable[filter]
            ind++
        }
    })


    items/*.slice(0,10)*/.map((item, index)=> {
        var key = parseInt(item[0]/100)
        if(weigths[filters[0]]!==0){
            //closeness

            var dist = boroughDataSet[key].districts_Dict[item[0]].distance

            items[index].push(dist)
        }

        if(weigths[filters[1]]!==0){
            //safety
            var crimes = Object.keys(boroughDataSet[key].districts_Dict[item[0]].crimes).length
            items[index].push(crimes)


        }

        if(weigths[filters[2]]!==0){
            //affordability

            var total_Low_Incomes= boroughDataSet[key].districts_Dict[item[0]].TLI

            if(total_Low_Incomes!==undefined){
                items[index].push(total_Low_Incomes)

            }else{
                items[index].push(0)
            }

        }

        if(weigths[filters[3]]!==0){
            //museums

            var museums= Object.keys(boroughDataSet[key].districts_Dict[item[0]].museums).length

            if(museums!==undefined){
                items[index].push(museums)

            }else{
                items[index].push(0)

            }

        }

        if(weigths[filters[4]]!==0){
            //galleries
            var galleries= Object.keys(boroughDataSet[key].districts_Dict[item[0]].galleries).length

            if(galleries!==undefined){
                items[index].push(galleries)
            }else{
                items[index].push(0)
            }

        }

        if(weigths[filters[5]]!==0){
            //farmers

            var farmers= Object.keys(boroughDataSet[key].districts_Dict[item[0]].farmers).length

            if(farmers!==undefined){
                items[index].push(farmers)

            }else{
                items[index].push(0)

            }

        }

        if(weigths[filters[6]]!==0){
            //subways

            var subways= Object.keys(boroughDataSet[key].districts_Dict[item[0]].subways).length

            if(subways!==undefined){
                items[index].push(subways)

            }else{
                items[index].push(0)

            }

        }
    })
    items.slice(0,10).map((item, index)=> {

        newRow = tableReference.insertRow(tableReference.rows.length)
        //newRow.insertCell(0);

        borocdTable = newRow.insertCell(0)
        totalPointsTable= newRow.insertCell(1)

        borocdTable.innerHTML = "<p class='newTR' onclick=' goToDistrict("+item[0]+")'>"+item[0]+"</p>"
        totalPointsTable.innerHTML= item[1].toFixed(2)

        var key = parseInt(item[0]/100)

        var cellIndex = 2
        //console.log(filters[0])
        if(weigths[filters[0]]!==0){
            //closeness
            closenessTable= newRow.insertCell(cellIndex++)

            var dist = boroughDataSet[key].districts_Dict[item[0]].distance

            closenessTable.innerHTML = dist.toFixed(2)
            // items[index].push(dist)
        }

        if(weigths[filters[1]]!==0){
            //safety
            safetyTable=  newRow.insertCell(cellIndex++)
            var crimes = Object.keys(boroughDataSet[key].districts_Dict[item[0]].crimes).length
            safetyTable.innerHTML= crimes
            //  items[index].push(crimes)


        }

        if(weigths[filters[2]]!==0){
            //affordability
            afforTable= newRow.insertCell(cellIndex++)

            var total_Low_Incomes= boroughDataSet[key].districts_Dict[item[0]].TLI

            if(total_Low_Incomes!==undefined){
                // items[index].push(total_Low_Incomes)
                afforTable.innerHTML= total_Low_Incomes
            }else{
                //  items[index].push(0)
                afforTable.innerHTML= 0
            }

        }

        if(weigths[filters[3]]!==0){
            //museums
            afforTable= newRow.insertCell(cellIndex++)

            var museums= Object.keys(boroughDataSet[key].districts_Dict[item[0]].museums).length

            if(museums!==undefined){
                //  items[index].push(museums)
                afforTable.innerHTML= museums
            }else{
                // items[index].push(0)
                afforTable.innerHTML= 0
            }

        }

        if(weigths[filters[4]]!==0){
            //galleries
            afforTable= newRow.insertCell(cellIndex++)

            var galleries= Object.keys(boroughDataSet[key].districts_Dict[item[0]].galleries).length

            if(galleries!==undefined){
                // items[index].push(galleries)
                afforTable.innerHTML= galleries
            }else{
                // items[index].push(0)
                afforTable.innerHTML= 0
            }

        }

        if(weigths[filters[5]]!==0){
            //farmers
            afforTable= newRow.insertCell(cellIndex++)

            var farmers= Object.keys(boroughDataSet[key].districts_Dict[item[0]].farmers).length

            if(farmers!==undefined){
                //  items[index].push(farmers)
                afforTable.innerHTML= farmers
            }else{
                //  items[index].push(0)
                afforTable.innerHTML= 0
            }

        }

        if(weigths[filters[6]]!==0){
            //subways
            afforTable= newRow.insertCell(cellIndex++)

            var subways= Object.keys(boroughDataSet[key].districts_Dict[item[0]].subways).length

            if(subways!==undefined){
                // items[index].push(subways)
                afforTable.innerHTML= subways
            }else{
                //   items[index].push(0)
                afforTable.innerHTML= 0
            }

        }
    })

    //console.log(items);

    items.slice(0, 10).map((item,index)=> {
        var key = parseInt(item[0]/100)
        var indexDistrict = boroughDataSet[key].districts_Dict[item[0]]

        var markerIcon = {
            url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
            scaledSize: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(32,65),
            labelOrigin: new google.maps.Point(20,16)
        };

        var marker = new google.maps.Marker({
            position:boroughDataSet[key].districts_Dict[item[0]].center,
            title: item[0].toString(),
            animation: google.maps.Animation.DROP,
            map: map,
            icon: markerIcon,
            label: {
                text: (index+1).toString(),
                color: "black",
                fontSize: "12px",
                fontWeight: "bold"
            }
        })

        // Ma info en info Window Examples
        var BoroCD = item[0]
        var BoroID = BoroCD.toString().substring(0,1)
        var district = boroughDataSet[BoroID].districts_Dict[BoroCD]



        var contentString =`BoroCD: ${item[0]}<br> Total Points: ${item[1].toFixed(2)} `

        filters.map(filter => {
            if (weigths[filter]!==0){
                console.log(district, filter, district[filter])
                if (filter === "TLI" || filter === "distance"){
                    contentString += `<br>${dictUsable[filter]}: ${district[filter].toFixed(2)} `
                }else{
                    console.log(district, filter, district[filter])
                    contentString += `<br>${dictUsable[filter]}: ${Object.keys(district[filter]).length} `
                }

            }


        })


        var infowindow = new google.maps.InfoWindow({
            content: contentString
        })

        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });

        topMarkers.push(marker)

    })

    setTopMarkers(map)
    //draw(items)
    return(items)
}

//////////////////////////////////////////////


//////////////////////////////////////////////
// CSVs Download

function download_csv(weights) {
    var flag = false
    var csv = 'BoroCD,Total_Points,'

    Object.keys(weights).map(filter => {
        if(weights[filter]!==0){
            csv+=dictUsable[filter]
            csv += ',';
            flag = true
        }
    })

    if (flag){
        csv += '\n'
        //console.log(csv);
        items.forEach(function(row) {
            csv += row.join(',');
            csv += "\n";
        });


        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'topDistricts.csv';
        hiddenElement.click();
    }

}

//////////////////////////////////////////////
var datacrimes = {
    1:{},
    2:{},
    3:{},
    4:{},
    5:{},
}



function dcrime(){
    var flag = false
    var csv = 'Borough	Time	Total_Crimes'


    csv += '\n'

    boroughDataSetKeys.map(key => {
        //var suma = 0
        Object.keys(boroughDataSet[key].districts_Dict).map(district => {
            //console.log(district, "crimes")
            Object.keys(boroughDataSet[key].districts_Dict[district]["crimes"]).map(crime => {

                var datos = boroughDataSet[key].districts_Dict[district]["crimes"][crime][2].cmplnt_fr_tm.split(":")
                var hours = datos[0]

                if(datacrimes[key].hasOwnProperty(hours)){
                    datacrimes[key][hours]++

                }else{
                    datacrimes[key][hours]=1

                }
            })
        })
    })



    Object.keys(datacrimes).map(key =>{
        var arrayValues = Object.keys(datacrimes[key]).map(hour => datacrimes[key][hour])

        var min = 0
        var max = d3.max(arrayValues)
        console.log(arrayValues, min, max)
        var crimeRescale = d3.scale.linear().domain([min, max]).range([0, 1000])
        Object.keys(datacrimes[key]).map(hour => {
            csv += parseFloat(key)
            csv += "	";
            csv += parseFloat(hour)
            csv += "	";
            csv += parseFloat(crimeRescale(datacrimes[key][hour]))
            // csv += "	";
            csv += "\n";
        })
    })



    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Crimes.tsv';
    hiddenElement.click();
}

