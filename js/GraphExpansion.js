var graphStatus = 0;
var iStatus = 0;

var info = $('#graphInfo');
var graph = $('#expandGraph');

var globalWidth = $(window).width()
var globalHeight = $(window).height()

var middleWidth = globalWidth / 2.5;
var middleHeight = globalHeight / 1.95;

graph.click( () => {
    if (graphStatus== 0) {
        graphStatus= 1;

        if (globalWidth > 1500){
            $('#graphics').css({
                transform: `translate(${middleWidth}px, -${middleHeight}px) scale(1.5)`,
                background: 'white',
                'border-radius': '15px',
                'z-index': '50',
            })


            graph.css({
                transform: 'translate(1em, -6em) scale(0.6)',
                background: 'steelblue'
            })


            $('#infoIcon').addClass('material-icons').text('info')


            $('#graphInfo').addClass('graphInfo').css({
                transform: 'translate(1em, -9em) scale(0.6)'
            })



        }else if (globalWidth < 1500) {

            $('#graphics').css({
                transform: `translate(${middleWidth}px, -${middleHeight / 1.15}px) scale(1.5)`,
                background: 'white',
                'border-radius': '15px',
                'z-index': '50',
                'width': '150%',

            })


            graph.css({
                transform: `translate(${(middleWidth / 21.2)}px, -${(middleHeight / 6)}px) scale(0.6)`,
                background: 'black'
            })


            $('#infoIcon').addClass('material-icons').text('info')

            $('#graphInfo').addClass('graphInfo').css({
                transform: 'translate(.6em, -6em) scale(0.6)'
            })

        }




    }else {
        graphStatus= 0;

        $('#IsoGraphInfo').hide();
        $('#graphics').css({
            transform:'translate(0, 0) scale(1)',
            background: '',
            width: '100%'
        })

        graph.css({
            transform: 'translate(0,0)',
            background: 'black'
        })

        $('#infoIcon').removeClass('material-icons').text(' ')

        $('#graphInfo').removeClass('graphInfo').css({
            transform: 'translate(0,0)'
        })

        $('#IsoGraphInfo').removeClass('IsoGraphInfo')
        iStatus = 0;
        info.css({
            background: 'black'
        })
    }

})


info.click( () => {
    if (!iStatus) {

        iStatus = 1;
        info.css({
            background: 'aqua'
        })

        if (globalWidth > 1500) {

            $('#graphics').css({
                transform: `translate(${middleWidth - 100}px, -${middleHeight}px) scale(1.5)`,

            })
            $('#IsoGraphInfo').addClass('IsoGraphInfo').css({
                transform:  `translate(${middleHeight - 50}px, 0)`,
                display: 'block'
            })


        }else if (globalWidth < 1500) {
            $('#IsoGraphInfo').show();
            $('#info_text').fadeIn(600);

            $('#graphics').css({
                transform: `translate(${middleWidth - 200}px, -${middleHeight / 1.15}px) scale(1.5)`,

            })
            $('#IsoGraphInfo').addClass('IsoGraphInfo').css({
                transform:  `translate(${middleHeight - 25}px, 0)`,

            })

        }

    }else {


        iStatus= 0;
        info.css({
            background: 'black'
        })

        if (globalWidth > 1500) {

            $('#graphics').css({
                transform: `translate(${middleWidth}px, -${middleHeight / 1.15}px) scale(1.5)`
            })

            $('#IsoGraphInfo').remove('IsoGraphInfo').css({
                transform:  'translate(0, 0)',
            })


        }else if (globalWidth < 1500) {

            setTimeout( () => {
                $('#IsoGraphInfo').hide();
            }, 500)

            $('#info_text').hide(600);

            $('#graphics').css({
                transform: `translate(${middleWidth}px, -${middleHeight / 1.15 }px) scale(1.5)`
            })

            $('#IsoGraphInfo').remove('IsoGraphInfo').css({
                transform:  'translate(0, 0)',
            })


        }

    }
})
