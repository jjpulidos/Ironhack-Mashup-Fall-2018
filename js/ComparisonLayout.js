var comparison = $('#ComparisonLayout');
var compare = $('#compare');
var back_to_map = $('#backbtn');
var comparison_state = 0;

compare.click( () => {


    comparison.addClass('ComparisonLayout');
    $('#backbtn').addClass('BackButton');
    $('#backbtn > a').text('Back to Map');
    $('#dist_wrapper').css('display', 'block');
    if (comparison_state == 0) {
        comparison_state = 1;


    }



    selectedDistricts.map( (district, i) => {
        var BoroCD = district.properties.BoroCD;
        var BoroID = BoroCD.toString().substring(0,1);
        var nb = ""

        Object.keys(district.nbhoods).map(nbk =>{

            nb += ('<li>'+ district.nbhoods[nbk][2][10] + '</li>')

        })

        var contentString = `
              <div>
                <h2> <a>${boroughDataSet[BoroID].borough_Name} ${BoroCD}</a> </h2>

                <div >
                  <p>District Neighborhoods: </p>
                  <ul style="display: flex;">
                    ${nb}
                  </ul>
                </div>

                <div>
                  <p >Distance to NYU: ${district.distance.toFixed(2)}
                  </p>
                  <p>Total Low Incomes: ${district.TLI}</p>
                  <p>Subway Entrances: ${Object.keys(district.subways).length}</p>
                  <p>Farmers Markets: ${Object.keys(district.farmers).length} </p>
                  <p>Museums: ${Object.keys(district.museums).length}</p>
                  <p>Art Galleries: ${Object.keys(district.galleries).length}</p>
                  <p>Crimes on 31 December 2015: ${Object.keys(district.crimes).length}</p>
                  <p>Buildings: ${Object.keys(district.buildings).length}</p>
                </div>

              </div>
            `

        if (i == 0) {
            console.log(0)
            $('#P_tab').append(contentString)
        }else if(i == 1){
            console.log(1)
            $('#P_tab2').append(contentString)
        }


    })


})

back_to_map.click( () => {
    $('#backbtn').removeClass('BackButton');
    $('#backbtn > a').text('')
    comparison.removeClass('ComparisonLayout');
    comparison_state = 0
})



$('.navicon').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('navicon--active');
    $('.toggle').toggleClass('toggle--active');
});

$('.navicon_2').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('navicon_2--active');
    $('.toggle_2').toggleClass('toggle_2--active');
});

$('.navicon_right').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('navicon_right--active');
    $('.toggle_right').toggleClass('toggle_right--active');
});

$('.navicon_2_right').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('navicon_2_right--active');
    $('.toggle_2_right').toggleClass('toggle_2_right--active');
});


$('#space_btn').click( () => {
    $('#P_tab').hide();
    $('#P_tab2').hide();
    $('#Orbital').show();
    $('#Orbital2').show();
})

$('#plain_btn').click( () => {
    $('#P_tab').show();
    $('#P_tab2').show();
    $('#Orbital').hide();
    $('#Orbital2').hide();
})
