

var T_Status = 0;

var OpenIcon = $('#openTable');
var tableExpand = false

OpenIcon.click( () => {

    if(!tableExpand){

        tableReference = $("#mainTableBody")[0];

        var tableBody = $("#mainTableBody > tr");

        tableBody.map(row => tableBody.remove())

        var filters = Object.keys(tmp)
        /////////////////////
        items.map((item, index)=> {

            newRow = tableReference.insertRow(tableReference.rows.length)
            //newRow.insertCell(0);

            borocdTable = newRow.insertCell(0)
            totalPointsTable= newRow.insertCell(1)

            borocdTable.innerHTML = "<p class='newTR' onclick=' goToDistrict("+item[0]+")'>"+item[0]+"</p>"
            totalPointsTable.innerHTML= item[1].toFixed(2)

            var key = parseInt(item[0]/100)

            var cellIndex = 2
            //console.log(filters[0])
            if(tmp[filters[0]]!==0){
                //closeness
                closenessTable= newRow.insertCell(cellIndex++)

                var dist = boroughDataSet[key].districts_Dict[item[0]].distance

                closenessTable.innerHTML = dist.toFixed(2)
                // items[index].push(dist)
            }

            if(tmp[filters[1]]!==0){
                //safety
                safetyTable=  newRow.insertCell(cellIndex++)
                var crimes = Object.keys(boroughDataSet[key].districts_Dict[item[0]].crimes).length
                safetyTable.innerHTML= crimes
                //  items[index].push(crimes)


            }

            if(tmp[filters[2]]!==0){
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

            if(tmp[filters[3]]!==0){
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

            if(tmp[filters[4]]!==0){
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

            if(tmp[filters[5]]!==0){
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

            if(tmp[filters[6]]!==0){
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
        tableExpand = true
    }else{

        tableReference = $("#mainTableBody")[0];

        var tableBody = $("#mainTableBody > tr");

        tableBody.map(row => tableBody.remove())

        var filters = Object.keys(tmp)
        /////////////////////
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
            if(tmp[filters[0]]!==0){
                //closeness
                closenessTable= newRow.insertCell(cellIndex++)

                var dist = boroughDataSet[key].districts_Dict[item[0]].distance

                closenessTable.innerHTML = dist.toFixed(2)
                // items[index].push(dist)
            }

            if(tmp[filters[1]]!==0){
                //safety
                safetyTable=  newRow.insertCell(cellIndex++)
                var crimes = Object.keys(boroughDataSet[key].districts_Dict[item[0]].crimes).length
                safetyTable.innerHTML= crimes
                //  items[index].push(crimes)


            }

            if(tmp[filters[2]]!==0){
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

            if(tmp[filters[3]]!==0){
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

            if(tmp[filters[4]]!==0){
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

            if(tmp[filters[5]]!==0){
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

            if(tmp[filters[6]]!==0){
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

        tableExpand = false
    }


    /////////////////////

    if (T_Status == 0) {
        T_Status = 1;
        OpenIcon.css({
            'transform': 'translate(-20em, -12em)',
        })

        $('#tableWrapper').css({
            'transform': 'translate(-2em, -2em)',
            'width': '75%',
            'height': '80vh'
        })
    }else {
        T_Status = 0;
        OpenIcon.css({
            'transform': 'translate(0, 0)',
        })

        $('#tableWrapper').css({
            'transform': 'translate(0, 0)',
            'width': '38%',
            'height': '16em'
        })
    }

})