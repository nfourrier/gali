function histoControl(error,dataJson,extraParam){
    console.log(extraParam)

    var timezoneOffset = new Date(dataJson[0].date*1000)
    var yList = [];
    var yListTmp = [];
    var yValue = [];
    var xList = [];







    y_mean = extraParam.yKey[0]
    y_min = extraParam.yKey[1]
    y_max = extraParam.yKey[2]
    y_sample = extraParam.yKey[3]

    var color = [];
    color[y_mean] = extraParam.color[4]
    color[y_sample] = extraParam.color[0]
    color[y_min] = extraParam.color[3]
    color[y_max] = extraParam.color[3]

    var label = [];
    // y_samples = extraParam.yKey[2:]
    // console.log(y_samples)
    // y_samples = extraParam.yKey.splice(3)




    var isDate = false
    if(['date','Date',"DATE"].indexOf(extraParam.xKey)>-1){
        isDate = true
    }

    if(!(extraParam.groupKey in dataJson[0])){
        dataJson.forEach(function(d){
            d[extraParam.groupKey] = "myResult"
        })
    }
    var isPercent = 0

    dataJson.forEach(function(d) {
        if(isDate){
            if(xList.indexOf(Number(d[extraParam.xKey]*1000))==-1){
                xList.push(d[extraParam.xKey]*1000)
            }
            d[extraParam.xKey] = new Date(d[extraParam.xKey]*1000);
            d.x = d3.time.format("%Y-%m-%d")(d[extraParam.xKey]);
            d.x2 = d[extraParam.xKey];
        }
        else{
            if(xList.indexOf(d[extraParam.xKey])==-1){
                xList.push(d[extraParam.xKey])
                // console.log(extraParam.gpKey,d[extraParam.xKey],d[extraParam.gpKey])
                label[d[extraParam.xKey]] = d[extraParam.groupKey]
            }
            d.x = d[extraParam.xKey]
        }

        if(d[y_mean]<d[y_sample]){
            d.y0 = y_mean
            d.y1 = y_sample
        }
        else{
            d.y1 = y_mean
            d.y0 = y_sample
        }

    });
    xList.sort()
    dataJson.sort((function(a,b){return a[extraParam.xKey]-b[extraParam.xKey]}))
    console.log(xList)


    var margin = {top: extraParam.height*0.15, right: extraParam.width*0.01, bottom: extraParam.height*0.1, left: extraParam.width*0.15},
        width = extraParam.width - margin.left - margin.right,
        height = extraParam.height*0.9 - margin.top - margin.bottom;

    $("#"+extraParam.htmlID).empty()
    var svg = d3.select("#"+extraParam.htmlID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");








    xMax = d3.max(dataJson.map(function (d) {return d[extraParam.xKey]; }))
    xMin = d3.min(dataJson.map(function (d) {return d[extraParam.xKey]; }))
    yMin=dataJson[0][y_min]
    yMax=dataJson[0][y_max]
    for(idx=0;idx<extraParam.yKey.length;idx++){
        lab = extraParam.yKey[idx]
        yMin = Math.min(yMin,d3.min(dataJson.map(function (d) {return d[lab]; })))
        yMax = Math.max(yMax,d3.max(dataJson.map(function (d) {return d[lab]; })))
    }

console.log(xMin,xMax)

    if(yMax>1001){
        formatY = d3.format('.2s')
    }
    else if(yMin < -1001){
        formatY = d3.format('.2s')
    }
    else{
        formatY = d3.format('.2r')
    }

    if(isDate){
        var x = d3.time.scale()
            .domain([xMin,xMax])
            .range([0, width]);
    }
    else{
        var x = d3.scale.ordinal()
            .domain(xList)
            .rangeRoundBands([0, width], .08);
            //     var x = d3.scale.ordinal().rangePoints([0, width]);
            // x.domain([0,459]);
    }
    var y = d3.scale.linear()
        .domain([yMin,yMax])
        .range([height, 0]);
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom")
        // .ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5)
        .tickFormat(formatY);
    var priceline = d3.svg.line()
        .x(function(d) {return x(d[extraParam.xKey]); })
        .y(function(d) {return y(d[extraParam.yKey]); });



    svg.append("g")
        .attr("class", "x axis")
        .attr("text-anchor",'start')
        .attr("transform", "translate("+(-0/10)+"," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor",'start')
            .style("font", height/40+"px "+fontName)
            .style("font-weight","bolder")
            .attr("transform", "rotate(60)")
            .text(function(d){return label[d]});

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll("text")
            .style("font", width/30+"px "+fontName)
            .style("font-weight","bolder");


    var focus = svg.append("g")
          .attr("class", "focus")
          .attr("class", "foc_"+extraParam.htmlID);
          // .style("display", "none");


    focus.append("svg:rect")
        .attr('class','lalalallalalla')
        .attr("rx", li.r)
        .attr("ry", li.r)
        .attr("width", li.w)
        .attr("height", li.h)
        .attr("stroke-width",li.h/10)
        .style("fill", function(d) { return textSlideColor; })
        .style("opacity", 0.7);
    focus.append("circle")
        .attr("class", "y0")
        .attr("r", 4);
    focus.append("svg:text")
        .attr("class", "textX")
        .style("font", li.h/3+"px "+fontName)
        .style("font-weight","bolder")
        .attr("fill",colorTheme2)
        .attr("dy", "-1em");
    focus.append("svg:text")
        .attr("class", "textY")
        .style("font", li.h/3+"px "+fontName)
        .style("font-weight","bolder")
        .attr("fill",colorTheme2)
        .attr("dy", "-1em");

    // function errorbar(svg,ymin,ymax,x,width){
    //     svg = svg.append('g')
    //     svg.append('path')

    // }

    // Display mean
    idx_color = 0
    focus.selectAll(".rectFirst")
        .data(dataJson)
        .enter().append('rect')
            .attr('class','rectFirst')
            .attr('id', function(d) {return 'rect_'+extraParam.htmlID+'_'+y_mean+d[extraParam.xKey]})
            .attr("x",  function(d) {return x(d.x); })
            .attr("y",  function(d) {return y(d[d.y1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) {console.log(d);return y(yMin)-y(d[d.y1])})
            .style("fill", function(d) {return color[d.y1]})
            .style("fill-opacity","1.")
    focus.selectAll(".rectSecond")
        .data(dataJson)
        .enter().append('rect')
            .attr('class','rectSecond')
            .attr('id', function(d) {return 'rect_'+extraParam.htmlID+'_'+y_sample+d[extraParam.xKey]})
            .attr("x",  function(d) {return x(d.x); })
            .attr("y",  function(d) {return y(d[d.y0]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) {return y(yMin)-y(d[d.y0])})
            .style("fill", function(d) {return color[d.y0]})
            .style("fill-opacity","1.")

    function eb(x,width,y,height,stroke_width){
        hh=height
        ww=width

        pathEB = 'm'+(x+(ww-stroke_width)/2)+' '+(stroke_width)+' \
                    L'+x+' '+(stroke_width)+' \
                    L'+(x)+' 0 \
                    L'+(x+ww)+' 0 \
                    L'+(x+ww)+' '+(stroke_width)+' \
                    L'+(x+(ww-stroke_width)/2+stroke_width)+' '+(stroke_width)+' \
                    L'+(x+(ww-stroke_width)/2+stroke_width)+' '+(hh-stroke_width)+'\
                    L'+(x+ww)+' '+(hh-stroke_width)+'\
                    L'+(x+ww)+' '+hh+' \
                    L'+x+' '+(hh)+' \
                    L'+x+' '+(hh-stroke_width)+'\
                    L'+(x+(ww-stroke_width)/2)+' '+(hh-stroke_width)+' Z'
        return pathEB
    }
    widthEB = 0.7*x.rangeBand()
    focus.selectAll('.pathEB')
            .data(dataJson)
            .enter().append('path')
                .attr('class','pathEB')
                .style({
                    "fill": color[y_min],
                    "stroke": color[y_min],
                    "stroke-width": "2"
                })
                .attr("transform", function(d){return "translate("+(x(d.x)+x.rangeBand()/2)+"," + y(d[y_max]) + ")"})
                .attr("d",d=function(d){return eb(-widthEB/2,widthEB,0,y(d[y_min])-y(d[y_max]),3)})

        // .append('rect')
        //     .attr('class','rect')
        //     .attr('id', function(d) {return 'rect_'+extraParam.htmlID+'_'+y_sample+d[extraParam.xKey]})
        //     .attr("x",  function(d) {return x(d.x); })
        //     .attr("y",  function(d) {return y(d[y_sample]); })
        //     .attr("width", x.rangeBand())
        //     .attr("height", function(d) {return y(yMin)-y(d[y_sample])})
        //     .style("fill-opacity","0.5")
        // .style({
        //     "fill": "none",
        //     "stroke": extraParam.color[0],
        //     "stroke-width": "2"
        // })
        // .datum(dataJson)
        // .attr("d",d3.svg.line()
        //     .interpolate("basis")
        //     .x(function(d){ return x(d.x);})
        //     .y(function(d){ return y(d[y_mean]);})
        // )
    // legend
    svg.append("text")
        .attr("transform","translate(" + (-0.1*width+0*0.2*width) + "," +-(0.05*height) + ")")
        .attr("class", "legend")    // style the legend
        .style("fill", color[y_mean])
        .style("fill-opacity","1.0")
        .text(y_mean)

    svg.append("text")
        .attr("transform","translate(" + (-0.1*width+3*0.2*width) + "," +-(0.05*height) + ")")
        .attr("class", "legend")    // style the legend
        .style("fill", color[y_sample])
        .style("fill-opacity","1.0")
        .text(y_sample)


    function mouseover(d) {
        focus.style("display",null)
        focus.select("rect")
            .attr("transform", "translate(" + (x(d[extraParam.xKey])-li.w) + "," + (y(d[extraParam.yKey])-li.h) + ")")
            .attr("stroke",this['style']["stroke"])
        focus.select("text.textX")
            .attr("y",y(d[extraParam.yKey])-1*(li.h/3))
            .attr("x",x(d[extraParam.xKey])-li.w*0.95)
            .attr("text-anchor",'start')
            .text(extraParam.xKey + ": "+d.x)
        focus.select("text.textY")
            .attr("y",y(d[extraParam.yKey])+0.5*(li.h/3))
            .attr("x",x(d[extraParam.xKey])-li.w*0.95)
            .attr("text-anchor",'start')
            .text(extraParam.yKey + ": "+formatY(d[extraParam.yKey]))
      }
      function mouseout(d){
        focus.style("display","none")
      }
    makeSlideTitle(svg,width/2,-height/10,width,height,margin,extraParam)
    dataJson.length = 0
    // StackData.length = 0
    timezoneOffset.length = 0
    yList.length = 0
    yListTmp.length = 0
    yValue.length = 0
    xList.length = 0
    color.length = 0
}
