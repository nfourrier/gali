function run() {
    var w = 700;
    var h = 100;

    var x = d3.time.scale()
        .range([0,w])
        .domain([data[0].date, data[data.length-1].date]);
    var y = d3.scale.linear()
        .range([h,0])
        .domain([0,20]);

    var svg = d3.select("body").append("svg").style({width: "700px"});
    var focus = svg.append("g");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d){ return x(d.date);})
        .y(function(d){ return y(d.data);});

    var area = d3.svg.area()
        .interpolate("basis")
        .x(function(d){ return x(d.date);})
        .y1(function(d){ return y(d.data);})
        .y0(function(d){ return y(0);});

    var brush = d3.svg.brush().x(x);

    focus.append("path")
        .attr("class","area")
        .style({
            "fill": "#ccc",
        })
        .datum(data)
        .attr("d",area);

    var mask = new SVGMask(focus)
        .x(x)
        .y(y)
        .style("fill","#fff")
        .reveal([data[7].date,data[11].date])

    brush.on("brush",function(){
        var ext = brush.extent();
        mask.reveal(ext);
        leftHandle.attr("x",x(ext[0])-5);
        rightHandle.attr("x",x(ext[1])-7);
    });

    focus.append("path")
        .attr("class","line")
        .style({
            "fill": "none",
            "stroke": "#000",
            "stroke-width": "2"
        })
        .datum(data)
        .attr("d",line);

    var leftHandle = focus.append("image")
        .attr("width", 15)
        .attr("height",100)
        .attr("x",x(data[7].date)-5)
        .attr("xlink:href",'left-handle.png');

    var rightHandle = focus.append("image")
        .attr("width", 15)
        .attr("height",100)
        .attr("x",x(data[11].date)-7)
        .attr("xlink:href",'right-handle.png');


    focus.append("g")
        .attr("class","x brush")
        .call(brush.extent([data[7].date,data[11].date]))
        .selectAll("rect")
        .attr("height",h)
        .style({
            "fill": "none"
        });
}
