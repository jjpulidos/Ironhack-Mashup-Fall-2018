//-----------------------------------------
// Isometric Chart Multidimensional Bar

function draw(weights){

    $("#iso").empty();
    var items = filterApply(weights, map)
    const svg = d3.select("#iso");
    const { width } = svg.node().getBoundingClientRect();
    const { height } = svg.node().getBoundingClientRect();

// append a group for zoomable content
    const zoomable_layer = svg.append('g');

// define a zoom behavior
    var zoom = d3.behavior.zoom()
        .scaleExtent([1,10]) // min-max zoom
        .on('zoom', () =>
            // GEOMETRIC ZOOM
            zoomable_layer
                .attr({
                    transform: `translate(${zoom.translate()})scale(${zoom.scale()})`})
        );

// bind the zoom behavior to the main SVG
    svg.call(zoom);

    const vis = zoomable_layer.append('g')
        .attr({
            class: 'vis',
            transform: `translate(${width/2},${height/1.7})`
        });

// [x, y, h] -> [-Math.sqrt(3)/2*x+Math.sqrt(3)/2*y, 0.5*x+0.5*y-h]
    const isometric = _3d_p => [((-Math.sqrt(3)/2)*_3d_p[0])+((Math.sqrt(3)/2)*_3d_p[1]), ((+0.5*_3d_p[0])+(0.5*_3d_p[1]))-_3d_p[2]];

    const parallelepipedon = function(d) {
        let ft, mlb, mlt, mrb, mrt, nb, nt;
        if ((d.x == null)) { d.x = 0; }
        if ((d.y == null)) { d.y = 0; }
        if ((d.h == null)) { d.h = 0; }
        if ((d.dx == null)) { d.dx = 10; }
        if ((d.dy == null)) { d.dy = 10; }
        if ((d.dh == null)) { d.dh = 10; }

        const fb = isometric([d.x, d.y, d.h],
            (mlb = isometric([d.x+d.dx, d.y, d.h],
                (nb = isometric([d.x+d.dx, d.y+d.dy, d.h],
                    (mrb = isometric([d.x, d.y+d.dy, d.h],
                        (ft = isometric([d.x, d.y, d.h+d.dh],
                            (mlt = isometric([d.x+d.dx, d.y, d.h+d.dh],
                                (nt = isometric([d.x+d.dx, d.y+d.dy, d.h+d.dh],
                                    (mrt = isometric([d.x, d.y+d.dy, d.h+d.dh])))))))))))))));

        d.iso = {
            face_bottom: [fb, mrb, nb, mlb],
            face_left: [mlb, mlt, nt, nb],
            face_right: [nt, mrt, mrb, nb],
            face_top: [ft, mrt, nt, mlt],
            outline: [ft, mrt, mrb, nb, mlb, mlt],
            far_point: fb // used to control the z-index of iso objects
        };

        return d;
    };

    const iso_layout = function(data, shape, scale) {
        if ((scale == null)) { scale = 1; }

        data.forEach(d => shape(d, scale));

        // this uses the treemap ordering in some way... (!!!)
        return data.sort((a,b) => b.dh - a.dh);
    };

    const path_generator = d => `M${d.map(p=> p.join(' ')).join('L')}z`;

    const treemap = d3.layout.treemap()
        .size([96, 96])
        .value(d => d.area)
        .sort((a,b) => a.dh-b.dh)
        .ratio(1)
        .round(false); // bugfix: d3 wrong ordering

    let color = d3.scale.category20();

    correct_x = d3.scale.linear()
        .domain([0, width])
        .range([0, width*1.05])
    correct_y = d3.scale.linear()
        .domain([0, height])
        .range([0, height*3/4])
    //console.log()
//let data = d3.range(items.length).map(() => ({area: 0.5, dh: 1}));
    var max = d3.max(items.map(item => item[1]));
    //console.log(max)
    rescale = d3.scale.linear().domain([0, max]).range([0, 100])
    let data = items.map(item => ({word: item[0] ,area: 0.5, dh: rescale(item[1])}))
//data.map(d=> console.log(d))
    data = treemap.nodes({children: data}).filter(n => n.depth === 1);
//console.log(data)
    iso_layout(data, parallelepipedon);


    data.forEach(function(d, i) {
        return d.template_color = d3.hcl(color(i));
    });

    pipedons = vis.selectAll('.pipedon').data(data);

    enter_pipedons = pipedons.enter().append('g').attr({
        "class": 'pipedon'
    });

    enter_pipedons.append('path').attr({
        "class": 'iso face bottom',
        d: function(d) {
            return path_generator(d.iso.face_bottom);
        }
    });

    enter_pipedons.append('path').attr({
        "class": 'iso face left',
        d: function(d) {
            return path_generator(d.iso.face_left);
        },
        fill: function(d) {
            return d.template_color;
        }
    });

    enter_pipedons.append('path').attr({
        "class": 'iso face right',
        d: function(d) {
            return path_generator(d.iso.face_right);
        },
        fill: function(d) {
            return d3.hcl(d.template_color.h, d.template_color.c, d.template_color.l - 12);
        }
    });

    enter_pipedons.append('path').attr({
        "class": 'iso face top',
        d: function(d) {
            return path_generator(d.iso.face_top);
        },
        fill: function(d) {
            return d3.hcl(d.template_color.h, d.template_color.c, d.template_color.l + 12);
        }
    });

    enter_labels_g = enter_pipedons.append('g');

    enter_labels = enter_labels_g.append('svg').attr({
        "class": 'label'
    });

    enter_labels.append('text').text(function(d) {
        return d.word.toUpperCase();
    }).attr({
        dy: '.35em'
    }).each(function(node) {
        var bbox, bbox_aspect, node_bbox, node_bbox_aspect, rotate;
        bbox = this.getBBox();
        bbox_aspect = bbox.width / bbox.height;
        node_bbox = {
            width: node.dx,
            height: node.dy
        };
        node_bbox_aspect = node_bbox.width / node_bbox.height;
        rotate = bbox_aspect >= 1 && node_bbox_aspect < 1 || bbox_aspect < 1 && node_bbox_aspect >= 1;
        node.label_bbox = {
            x: bbox.x + (bbox.width - correct_x(bbox.width)) / 2,
            y: bbox.y + (bbox.height - correct_y(bbox.height)) / 2,
            width: correct_x(bbox.width),
            height: correct_y(bbox.height)
        };
        if (rotate) {
            node.label_bbox = {
                x: node.label_bbox.y,
                y: node.label_bbox.x,
                width: node.label_bbox.height,
                height: node.label_bbox.width
            };
            return d3.select(this).attr('transform', 'rotate(90) translate(0,1)');
        }
    });

    enter_labels.each(function(d) {
        d.iso_x = isometric([d.x + d.dx / 2, d.y + d.dy / 2, d.h + d.dh])[0] - d.dx / 2;
        return d.iso_y = isometric([d.x + d.dx / 2, d.y + d.dy / 2, d.h + d.dh])[1] - d.dy / 2;
    });

    enter_labels.attr({
        x: function(d) {
            return d.iso_x;
        },
        y: function(d) {
            return d.iso_y;
        },
        width: function(node) {
            return node.dx;
        },
        height: function(node) {
            return node.dy;
        },
        viewBox: function(node) {
            return "" + node.label_bbox.x + " " + node.label_bbox.y + " " + node.label_bbox.width + " " + node.label_bbox.height;
        },
        preserveAspectRatio: 'none',
        fill: function(d) {
            return d3.hcl(d.template_color.h, d.template_color.c, d.template_color.l - 12);
        }
    });

    enter_labels_g.attr({
        transform: function(d) {
            return "translate(" + (d.iso_x + d.dx / 2) + "," + (d.iso_y + d.dy / 2) + ") scale(1, " + (1 / Math.sqrt(3)) + ") rotate(-45) translate(" + (-(d.iso_x + d.dx / 2)) + "," + (-(d.iso_y + d.dy / 2)) + ")";
        }
    });
    enter_pipedons.append('path')
        .attr({
            class: 'iso outline',
            d(d) { return path_generator(d.iso.outline); }
        });

}


/////////////////////////////////
// Crime Chart (Scatter Plot)
function crimeChart(weights){
    $("#RadarGraphSvg").empty();
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 450 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    var xValue = function(d) { return parseInt(d[0]/100)},
        xScale = d3.scale.linear().range([0, width]),
        xMap = function(d) { return xScale(xValue(d))},
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yValue = function(d) { return d[1]},
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function(d) { return yScale(yValue(d))},
        yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
    var cValue = function(d) { return d.Manufacturer;},
        color = d3.scale.category10();

// add the graph canvas to the body of the webpage
    var svg = d3.select("#RadarGraphSvg")
        .attr("class", "scatterPlot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    data = items

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([0, 10]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    // x-axis
    svg.append("g")
        .attr("class", "xAxisSP")
        .attr("transform", "translate(0," + height + ")")
        .style("stroke", "#E7E7E7")
        .style("fill", "none")
        .style("stroke-width", "1px")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", 200)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Borough ID")
        .style("stroke", "white")
        .style("fill", "white")
        .style("stroke-width", "0.2px")

    // y-axis
    svg.append("g")
        .attr("class", "yaAxisSP")
        .call(yAxis)
        .style("stroke", "#E7E7E7")
        .style("fill", "none")
        .style("stroke-width", "1px")
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("stroke", "white")
        .style("fill", "white")
        .style("stroke-width", "0.2px")
        .text("Crimes Points");

    // draw dots
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", "#0000C9")
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("BoroCD: " + d[0]+ "<br/>"+ "Crimes Points: " + d[1].toFixed(2))
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0)
                .style("color", "white")
        });

    // draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})
}

////////////////////////////////////////////////
// Orbits Chart


function drawOrbit(_data, svg) {

    var center = {};
    var recenter = false;
    $(svg).empty();

    for (var x=0;x<_data.children.length;x++) {
        _data.children[x].size = _data.children[x].children ? _data.children[x].children.length : 0;
    }

    _data.children.sort(function(a,b) {
        if (a.size > b.size) {
            return 1;
        }
        if (a.size < b.size) {
            return -1;
        }
        return 0;
    })


    sizeScale = d3.scale.linear().domain([0,700]).range([4,20]).clamp(true);
    colorScale = d3.scale.linear().domain([0,1,2,3,4]).range(["#6383d1","#73cbf0","rgb(225,203,208)","rgb(174,223,228)","rgb(245,132,102)"]);

    planetColors = {Mercury: "gray", Venus: "#d6bb87", Earth: "#677188", Mars: "#7c5541", Jupiter: "#a36a3e", Saturn: "#e9ba85", Uranus: "#73cbf0", Neptune: "#6383d1"}


    orbit = d3.layout.orbit().size([150, 150])
        .revolution(customRevolution)
        .orbitSize(function(d) {return d.depth >= 2 ? 6 : 4})
        .speed(.35)
        .mode([35,36,8,3,1])
        .nodes(_data);

    center = orbit.nodes()[0];

    d3.select(svg)
        .append("g")
        .attr("class", "viz")
        .attr("transform", "translate(-50,-50)")
        .selectAll("g.node").data(orbit.nodes())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {return "translate(" +d.x +"," + d.y+")"})
        .on("mouseover", nodeOver)
        .on("click", recenter)

    d3.selectAll("g.node")
        .append("circle")
        .attr("class", "satellite")
        .attr("r", function(d) {return sizeScale(d.value ? d.value : 0)})
        .style("fill", function(d) {
            console.log(d.color)
            return d.color})
        // .style("stroke", "brown")
        .style("stroke-width", "1px")

    d3.selectAll("g.node").filter(function(d) {return d.depth == 1})
        .append("text")
        .text(function(d) {return d.depth == 0 ? "Sun" : d.key})
        .attr("y", 20)
        .style("text-anchor", "middle")

    d3.select("g.viz")
        .selectAll("circle.ring")
        .data(orbit.orbitalRings())
        .enter()
        .insert("circle", "g")
        .attr("class", "ring")
        .attr("r", function(d) {return d.r})
        .attr("cx", function(d) {return d.x})
        .attr("cy", function(d) {return d.y})

    orbit.on("tick", orbitTick);

    orbit.start();

    function orbitTick() {

        var newX = 200- center.x;
        var newY = 200 - center.y;
        /*
                d3.select("g.viz")
                    .attr("transform", "scale("+(1 + (center.depth *.1)) +") translate(" + newX + "," + newY + ")")

        */

        d3.selectAll("g.node")
            .attr("transform", function(d) {return "translate(" +d.x +"," + d.y+")"});

        d3.selectAll("circle.ring")
            .attr("cx", function(d) {return d.x})
            .attr("cy", function(d) {return d.y});

        d3.selectAll("line.visible")
            .attr("x1", function(p) {return p.source.x})
            .attr("x2", function(p) {return p.target.x})
            .attr("y1", function(p) {return p.source.y})
            .attr("y2", function(p) {return p.target.y})

    }

    function changeCenter() {
        recenter = false;
        orbit.stop();
        var newX = 200 - center.x;
        var newY = 200 - center.y;

        d3.select("g.viz")
            .transition()
            .duration(500)
            .attr("transform", "scale("+(1 + (center.depth *.1)) +") translate(" + newX + "," + newY + ")")
            .each("end", function() {orbit.start()})

    }

    function customRevolution(d)
    {
        if (d.name == "time") {
            return d.depth * .25;
        }
        if (d.name == "geo") {
            return -d.depth * .25;
        }
        return d.depth
    }

    function nodeOver(d) {
        orbit.stop();

        center = d;
        changeCenter();

        d3.selectAll("text.sat").remove();

        d3.selectAll("line.visible").remove();

        if (d.children) {
            var lines = d.children.map(function(p) {return {source: d, target: p}})
            d3.select("g.viz").selectAll("line.visible")
                .data(lines)
                .enter()
                .insert("line", "g")
                .attr("x1", function(p) {return p.source.x})
                .attr("x2", function(p) {return p.target.x})
                .attr("y1", function(p) {return p.source.y})
                .attr("y2", function(p) {return p.target.y})
                .attr("class", "visible")
                .style("stroke", "rgb(73,106,154)")
                .style("stroke-width", 2)
        }

        if (d.parent) {

            d3.select("g.viz").selectAll("line.fake")
                .data([{source:d, target: d.parent}])
                .enter()
                .insert("line", "g")
                .attr("x1", function(p) {return p.source.x})
                .attr("x2", function(p) {return p.target.x})
                .attr("y1", function(p) {return p.source.y})
                .attr("y2", function(p) {return p.target.y})
                .attr("class", "visible")
                // .style("stroke", "rgb(165,127,124)")
                .style("stroke", "#660281")

                .style("stroke-width", 3)
        }


        d3.selectAll("g.node")
            .filter(function(p) {return p == d || p == d.parent || (d.children ? d.children.indexOf(p) > -1 : false)})
            .append("text")
            .text(function(p) {return p.name})
            .style("text-anchor", "middle")
            .attr("y", 15)
            .attr("class", "sat")
            .style("fill", "none")
            .style("stroke", "white")
        // .style("stroke-width", 3)
        // .style("stroke-opacity", .7);

        d3.selectAll("g.node")
            .filter(function(p) {return p == d || p == d.parent || (d.children ? d.children.indexOf(p) > -1 : false)})
            .append("text")
            .text(function(p) {return p.name})
            .style("text-anchor", "middle")
            .attr("y", 15)
            .attr("class", "sat");

        // d3.selectAll("g.node > circle").style("stroke", "brown").style("stroke-width", 1);

        //  d3.select(this).select("circle").style("stroke", "black").style("stroke-width", 3);

    }
}


d3.layout.orbit = function() {
    var currentTickStep = 0;
    var orbitNodes;
    var orbitSize = [1,1];
    var nestedNodes;
    var flattenedNodes = [];
    var tickRadianStep = 0.004363323129985824;
    var orbitDispatch = d3.dispatch('tick');
    var tickInterval;
    var orbitalRings = [];
    var orbitDepthAdjust = function() {return 2.95};
    var childrenAccessor = function(d) {return d.children};
    var tickRadianFunction = function() {return 1};
    var fixedOrbitArray = [99];
    var orbitMode = "flat";


    function _orbitLayout() {

        return _orbitLayout;
    }

    _orbitLayout.mode = function(_mode) {
        //Atomic, Solar, other?
        if (!arguments.length) return orbitMode;

        if (_mode == "solar") {
            fixedOrbitArray = [1]
        }
        if (_mode == "atomic") {
            fixedOrbitArray = [2,8]
        }
        if (_mode == "flat") {
            fixedOrbitArray = [99]
        }
        orbitMode = _mode;
        if (Array.isArray(_mode)) {
            fixedOrbitArray = _mode;
            orbitMode = "custom";
        }
        return this
    }

    _orbitLayout.start = function() {
        //activate animation here
        tickInterval = setInterval(
            function() {
                currentTickStep++;
                flattenedNodes.forEach(function(_node){
                    if (_node.parent) {
                        _node.x = _node.parent.x + ( (_node.ring) * Math.sin( _node.angle + (currentTickStep * tickRadianStep * tickRadianFunction(_node))) );
                        _node.y = _node.parent.y + ( (_node.ring) * Math.cos( _node.angle + (currentTickStep * tickRadianStep * tickRadianFunction(_node))) );
                    }
                })
                orbitalRings.forEach(function(_ring) {
                    _ring.x = _ring.source.x;
                    _ring.y = _ring.source.y;
                })
                orbitDispatch.tick();
            },
            10);
    }

    _orbitLayout.stop = function() {
        //deactivate animation here
        clearInterval(tickInterval);
    }

    _orbitLayout.speed = function(_degrees) {
        if (!arguments.length) return tickRadianStep / (Math.PI / 360);
        tickRadianStep = tickRadianStep = _degrees * (Math.PI / 360);
        return this;
    }

    _orbitLayout.size = function(_value) {
        if (!arguments.length) return orbitSize;
        orbitSize = _value;
        return this;
        //change size here
    }

    _orbitLayout.revolution = function(_function) {
        //change ring size reduction (make that into dynamic function)
        if (!arguments.length) return tickRadianFunction;
        tickRadianFunction = _function;
        return this
    }

    _orbitLayout.orbitSize = function(_function) {
        //change ring size reduction (make that into dynamic function)
        if (!arguments.length) return orbitDepthAdjust;
        orbitDepthAdjust = _function;
        return this
    }

    _orbitLayout.orbitalRings = function() {
        //return an array of data corresponding to orbital rings
        if (!arguments.length) return orbitalRings;
        return this;
    }

    _orbitLayout.nodes = function(_data) {
        if (!arguments.length) return flattenedNodes;
        nestedNodes = _data;
        calculateNodes();
        return this;
    }

    _orbitLayout.children = function(_function) {
        if (!arguments.length) return childrenAccessor;

        //Probably should use d3.functor to turn a string into an object key
        childrenAccessor = _function;
        return this;


    }

    d3.rebind(_orbitLayout, orbitDispatch, "on");

    return _orbitLayout;
    function calculateNodes() {
        orbitalRings = [];
        orbitNodes = nestedNodes;

        orbitNodes.x = orbitSize[0] / 2;
        orbitNodes.y = orbitSize[1] / 2;
        orbitNodes.ring = orbitSize[0] / 2;
        orbitNodes.depth = 0;

        flattenedNodes.push(orbitNodes);

        traverseNestedData(orbitNodes);

        function traverseNestedData(_node) {

            if(childrenAccessor(_node)) {
                var y = 0;
                var totalChildren = childrenAccessor(_node).length;
                var _rings = 0;
                var _total_positions = 0;
                var _p = 0;
                while (_total_positions < totalChildren) {
                    if (fixedOrbitArray[_p]) {
                        _total_positions += fixedOrbitArray[_p];
                    }
                    else {
                        _total_positions += fixedOrbitArray[fixedOrbitArray.length - 1];
                    }
                    _p++;
                    _rings++;
                }

                while (y < totalChildren) {
                    var _pos = 0;
                    var _currentRing = 0;
                    var _p = 0;
                    var _total_positions = 0;

                    while (_total_positions <= y) {
                        if (fixedOrbitArray[_p]) {
                            _total_positions += fixedOrbitArray[_p];
                        }
                        else {
                            _total_positions += fixedOrbitArray[fixedOrbitArray.length-1];
                        }

                        _p++;
                        _currentRing++;
                    }

                    var ringSize = fixedOrbitArray[fixedOrbitArray.length-1];

                    if (fixedOrbitArray[_currentRing-1]) {
                        ringSize = fixedOrbitArray[_currentRing-1];
                    }

                    if (_node.parent) {
                        var _ring = {source: _node, x: _node.x, y: _node.y, r: _node.parent.ring / orbitDepthAdjust(_node) * (_currentRing / _rings)};
                    }
                    else {
                        var _ring = {source: _node, x: _node.x, y: _node.y, r: (orbitSize[0] / 2) * (_currentRing / _rings)};
                    }


                    var thisPie = d3.layout.pie().value(function(d) {return childrenAccessor(d) ? 4 : 1});
                    var piedValues = thisPie(childrenAccessor(_node).filter(function(d,i) {return i >= y && i <= y+ringSize-1}));

                    for (var x = y; x<y+ringSize && x<totalChildren;x++) {
                        childrenAccessor(_node)[x].angle = ((piedValues[x - y].endAngle - piedValues[x - y].startAngle) / 2) + piedValues[x - y].startAngle;

                        childrenAccessor(_node)[x].parent = _node;
                        childrenAccessor(_node)[x].depth = _node.depth + 1;

                        childrenAccessor(_node)[x].x = childrenAccessor(_node)[x].parent.x + ( (childrenAccessor(_node)[x].parent.ring / 2) * Math.sin( childrenAccessor(_node)[x].angle ) );
                        childrenAccessor(_node)[x].y = childrenAccessor(_node)[x].parent.y + ( (childrenAccessor(_node)[x].parent.ring / 2) * Math.cos( childrenAccessor(_node)[x].angle ) );

                        childrenAccessor(_node)[x].ring = _ring.r;

                        flattenedNodes.push(childrenAccessor(_node)[x]);
                        traverseNestedData(childrenAccessor(_node)[x]);
                    }
                    orbitalRings.push(_ring);
                    y+=ringSize;
                }

            }
        }

    }

}
//////////////////////////
// Radar Chart

//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end,
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html


var RadarChart = {
    draw: function(id, d, options){
        var cfg = {
            radius: 5,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: 80,
            TranslateY: 30,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: d3.scale.category10()
        };

        if('undefined' !== typeof options){
            for(var i in options){
                if('undefined' !== typeof options[i]){
                    cfg[i] = options[i];
                }
            }
        }
        cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
        var allAxis = (d[0].map(function(i, j){return i.axis}));
        var total = allAxis.length;
        var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
        var Format = d3.format('%');
        d3.select(id).select("svg").remove();

        var g = d3.select(id)
            .append("svg")
            .attr("width", cfg.w+cfg.ExtraWidthX)
            .attr("height", cfg.h+cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
        ;

        var tooltip;

        //Circular segments
        for(var j=0; j<cfg.levels-1; j++){
            var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
            g.selectAll(".levels")
                .data(allAxis)
                .enter()
                .append("svg:line")
                .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
                .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
                .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
                .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
        }

        //Text indicating at what % each level is
        for(var j=0; j<cfg.levels; j++){
            var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
            g.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
                .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
                .attr("class", "legend")
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
                .attr("fill", "#737373")
                .text(Format((j+1)*cfg.maxValue/cfg.levels));
        }

        series = 0;

        var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", cfg.w/2)
            .attr("y1", cfg.h/2)
            .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
            .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        axis.append("text")
            .attr("class", "legend")
            .text(function(d){return d})
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function(d, i){return "translate(0, -10)"})
            .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
            .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


        d.forEach(function(y, x){
            dataValues = [];
            g.selectAll(".nodes")
                .data(y, function(j, i){
                    dataValues.push([
                        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                });
            dataValues.push(dataValues[0]);
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie"+series)
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series))
                .attr("points",function(d) {
                    var str="";
                    for(var pti=0;pti<d.length;pti++){
                        str=str+d[pti][0]+","+d[pti][1]+" ";
                    }
                    return str;
                })
                .style("fill", function(j, i){return cfg.color(series)})
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function (d){
                    z = "polygon."+d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                })
                .on('mouseout', function(){
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                });
            series++;
        });
        series=0;


        d.forEach(function(y, x){
            g.selectAll(".nodes")
                .data(y).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie"+series)
                .attr('r', cfg.radius)
                .attr("alt", function(j){return Math.max(j.value, 0)})
                .attr("cx", function(j, i){
                    dataValues.push([
                        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                    return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                })
                .attr("cy", function(j, i){
                    return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                })
                .attr("data-id", function(j){return j.axis})
                .style("fill", cfg.color(series)).style("fill-opacity", .9)
                .on('mouseover', function (d){
                    newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                    newY =  parseFloat(d3.select(this).attr('cy')) - 5;

                    tooltip
                        .attr('x', newX)
                        .attr('y', newY)
                        .text(Format(d.value))
                        .transition(200)
                        .style('opacity', 1);

                    z = "polygon."+d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                })
                .on('mouseout', function(){
                    tooltip
                        .transition(200)
                        .style('opacity', 0);
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                })
                .append("svg:title")
                .text(function(j){return Math.max(j.value, 0)});

            series++;
        });
        //Tooltip
        tooltip = g.append('text')
            .style('opacity', 0)
            .style('font-family', 'sans-serif')
            .style('font-size', '13px');
    }
};

function radarOn(LegendOptions, d){
    $("#RadarGraphSvg").empty();
    var w = 300,
        h = 300;

    var colorscale = d3.scale.category10();


//Options for the Radar chart, other than default
    var mycfg = {
        w: w,
        h: h,
        maxValue: 0.6,
        levels: 5,
        ExtraWidthX: 250
    }

//Call function to draw the Radar chart
//Will expect that data is in %'s
    RadarChart.draw("#RadarGraphSvg", d, mycfg);

    var svg = d3.select('.Radar')
        .selectAll('svg')
        .append('svg')
        .attr("width", w+300)
        .attr("height", h)

//Create the title for the legend
    var text = svg.append("text")
        .attr("class", "title")
        .attr('transform', 'translate(40,0)')
        .attr("x", w - 70)
        .attr("y", 10)
        .attr("font-size", "10px")
        .attr("fill", "#404040")
        .text("best % indicates a best district in that parameter (Axis)");

//Initiate Legend
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,20)')
    ;
//Create colour squares
    legend.selectAll('rect')
        .data(LegendOptions)
        .enter()
        .append("rect")
        .attr("x", w - 65)
        .attr("y", function(d, i){ return i * 20;})
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i){ return colorscale(i);})
    ;
//Create text next to squares
    legend.selectAll('text')
        .data(LegendOptions)
        .enter()
        .append("text")
        .attr("x", w - 52)
        .attr("y", function(d, i){ return i * 20 + 9;})
        .attr("font-size", "11px")
        .attr("fill", "#737373")
        .text(function(d) { return d; })
    ;
}

function updateChart(){
    /*[boroughDataSet[1].districts_Dict[101],boroughDataSet[1].districts_Dict[105]] */
    //var dis= $("#selectState")
    // .find(":selected").val()
    //if()
    radarChart(selectedDistricts)
}