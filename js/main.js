$(document).ready(() => {
//$('#compare').prop('disabled', true);
    $("#compare").addClass("disabledbutton");

//$("#zone_wrapper, #dist_wrapper").change(() => {
    //  updateChart();
//})

    //Parallel Proceses
    task = [
        //jsonDataSetsKeys.map(dataSetKey => getDataFromURL(dataSetKey)),
        geoJsonDataSetsKeys.map(geoJSONDataSetKey =>getDataFromGeoJSONData(geoJSONDataSetKey)),

        // interactiveMap(),
        //addNYU(),
    ]

    Promise.all(task).then(()=>{
        DSNum++

    })

    $(".nav").addClass("small");
    $("#navMenu").click(function() {
        //$(".nav").toggleClass("small");
        if ($(".nav").hasClass("small")) {
            $(".nav").removeClass("small");
        } else {
            $(".nav").addClass("small");
        }
    });

    // $("#CSV_Button").prop("disabled",true);
    $('#tableWrapper').html("<h2 class='ZeroStatusText' >In order to visualize the table please select some of the filters </h2>");

    $('#sliders, .FiltersSliders').change( () => {
        var clo = parseInt($('#clo').val())
        var sec = parseInt($('#sec').val())
        var aff = parseInt($('#aff').val())
        var mus = parseInt($('#museums').val())
        var gal = parseInt($('#art_galleries').val())
        var far = parseInt($('#farm_markets').val())
        var sub = parseInt($('#sub_entrances').val())
        table_status = clo+sec+aff+mus+gal+far+sub

        if (table_status === 0) {
            // $("#CSV_Button").prop("disabled",true);
            tmp={
                "distance" : 0,
                "crimes" : 0,
                "TLI" : 0,
                "museums": 0,
                "galleries": 0,
                "farmers": 0,
                "subways": 0,
            }
            eraseTopMarkers(map)
            $( "#iso" ).empty();

            $('#tableWrapper').html("<h2 class='ZeroStatusText' >In order to visualize the table please select some of the filters </h2>");
        } else {



            // $("#CSV_Button").prop("disabled",false);
            //$('#tableWrapper h2').html("<h2 class='ZeroStatusText' >Pan arabe</h2>");
            $('#tableWrapper').html(
                '                        <table class="TTable">\n' +
                '                            <thead id="mainTableTitles"  class="table_headers">\n' +
                '                          </thead>\n' +
                '                          <tbody id="mainTableBody">\n' +
                '\n' +
                '                          </tbody>\n' +
                '                      </table>\n' +
                '                  ');

            $(".TTable tr").click(function(event) {
                console.log("pollo")
                console.log($(this).text())
            })
            tmp.distance=clo
            tmp.crimes=sec
            tmp.TLI=aff
            tmp.museums = mus,
                tmp.galleries= gal,
                tmp.farmers= far,
                tmp.subways= sub,
                draw(tmp)
        }
    })

    $('.material-icons').click( () => {

            if(trafficState){
                trafficLayer.setMap(map)
            }else{
                trafficLayer.setMap(null)
            }

            if(transitState){
                transitLayer.setMap(map)
                map.setZoom(12)
            }else{
                transitLayer.setMap(null)
                map.setZoom(10)
            }

            if(bikeState){
                bikeLayer.setMap(map)
            }else{
                bikeLayer.setMap(null)
            }

        }

    )

    //$("#museums").click(function() {
    //console.log(showMuseums)
    //showData('museums', museumsLocation, museumsMarkers, icons[0], showMuseums)
    // console.log(showMuseums)
    // });



    //Manu Btns color status
    var nav_1 = 0, nav_2 = 0, nav_3 = 0, nav_4 = 0, nav_5 = 0, nav_6 = 0, nav_7 = 0, nav_8 = 0, nav_9 = 0;

    $('#nav1').click(() => {
        if(nav_1 == 0) {
            $('#nav1').css('background', '#4b006c');
            nav_1 = 1;
        } else if (nav_1 == 1){
            $('#nav1').css('background', '#910EC9');
            nav_1 = 0;
        }
    })

    $('#nav2').click(() => {
        if(nav_2 == 0) {
            $('#nav2').css('background', '#4b006c');
            nav_2 = 1;
        } else if (nav_2 == 1){
            $('#nav2').css('background', '#910EC9');
            nav_2 = 0;
        }
    })

    $('#nav3').click(() => {
        if(nav_3 == 0) {
            $('#nav3').css('background', '#4b006c');
            nav_3 = 1;
        } else if (nav_3 == 1){
            $('#nav3').css('background', '#910EC9');
            nav_3 = 0;
        }
    })

    $('#nav4').click(() => {
        if(nav_4 == 0) {
            $('#nav4').css('background', '#4b006c');
            nav_4 = 1;
        } else if (nav_4 == 1){
            $('#nav4').css('background', '#910EC9');
            nav_4 = 0;
        }
    })

    $('#nav5').click(() => {
        if(nav_5 == 0) {
            $('#nav5').css('background', '#4b006c');
            nav_5 = 1;
        } else if (nav_5 == 1){
            $('#nav5').css('background', '#910EC9');
            nav_5 = 0;
        }
    })

    $('#nav6').click(() => {
        if(nav_6 == 0) {
            $('#nav6').css('background', '#4b006c');
            nav_6 = 1;
        } else if (nav_6 == 1){
            $('#nav6').css('background', '#910EC9');
            nav_6 = 0;
        }
    })

    $('#nav7').click(() => {
        if(nav_7 == 0) {
            $('#nav7').css('background', '#4b006c');
            nav_7 = 1;
        } else if (nav_7 == 1){
            $('#nav7').css('background', '#910EC9');
            nav_7 = 0;
        }
    })

    $('#nav8').click(() => {
        if(nav_8 == 0) {
            $('#nav8').css('background', '#4b006c');
            nav_8 = 1;
        } else if (nav_8 == 1){
            $('#nav8').css('background', '#910EC9');
            nav_8 = 0;
        }
    })

    $('#nav9').click(() => {
        if(nav_9 == 0) {
            $('#nav9').css('background', '#4b006c');
            nav_9 = 1;
        } else if (nav_9 == 1){
            $('#nav9').css('background', '#910EC9');
            nav_9 = 0;
        }
    })




// Comparison Filters Color Status
    var f1, f2, f3, f4, f5, f6, f7;
    f1 = f2 = f3 = f4 = f5 = f6 = f7 = 0;

    $('#filter1').click(() => {
        if(f1 == 0) {
            $('#filter1').css('background', '#4b006c');
            f1 = 1;
        } else if (f1 == 1){
            $('#filter1').css('background', '#910EC9');
            f1 = 0;
        }
    })

    $('#filter2').click(() => {
        if(f2 == 0) {
            $('#filter2').css('background', '#4b006c');
            f2 = 1;
        } else if (f2 == 1){
            $('#filter2').css('background', '#910EC9');
            f2 = 0;
        }
    })

    $('#filter3').click(() => {
        if(f3 == 0) {
            $('#filter3').css('background', '#4b006c');
            f3 = 1;
        } else if (f3 == 1){
            $('#filter3').css('background', '#910EC9');
            f3 = 0;
        }
    })

    $('#filter4').click(() => {
        if(f4 == 0) {
            $('#filter4').css('background', '#4b006c');
            f4 = 1;
        } else if (f4 == 1){
            $('#filter4').css('background', '#910EC9');
            f4 = 0;
        }
    })

    $('#filter5').click(() => {
        if(f5 == 0) {
            $('#filter5').css('background', '#4b006c');
            f5 = 1;
        } else if (f5 == 1){
            $('#filter5').css('background', '#910EC9');
            f5 = 0;
        }
    })

    $('#filter6').click(() => {
        if(f6 == 0) {
            $('#filter6').css('background', '#4b006c');
            f6 = 1;
        } else if (f6 == 1){
            $('#filter6').css('background', '#910EC9');
            f6 = 0;
        }
    })

    $('#filter7').click(() => {
        if(f7 == 0) {
            $('#filter7').css('background', '#4b006c');
            f7 = 1;
        } else if (f7 == 1){
            $('#filter7').css('background', '#910EC9');
            f7 = 0;
        }
    })
})
