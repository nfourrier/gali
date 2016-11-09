function chartControl(error,dataJson,extraParam){
    console.log(extraParam)
    var timezoneOffset = new Date(dataJson[0].date*1000)
    var yList = [];
    var yListTmp = [];
    var yValue = [];
    var xList = [];




    var StackData = [];


    y_mean = extraParam.yKey[0]
    y_min = extraParam.yKey[1]
    y_max = extraParam.yKey[2]
    y_samples = extraParam.yKey.splice(3)




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
            }
            d.x = d[extraParam.xKey]
        }
    });

    dataJson.sort((function(a,b){return a[extraParam.xKey]-b[extraParam.xKey]}))

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
        var x = d3.scale.linear()
            .domain([xMin,xMax])
            .range([0,width]);
    }
    var y = d3.scale.linear()
        .domain([yMin,yMax])
        .range([height, 0]);
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom")

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
            .attr("transform", "rotate(60)");

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

    // Display mean
    idx_color = 0
    focus.append('path')
        .attr('class','line')
        .attr('id','lin_'+extraParam.htmlID+'_'+y_mean)
        .style({
            "fill": "none",
            "stroke": extraParam.color[0],
            "stroke-width": "2"
        })
        .datum(dataJson)
        .attr("d",d3.svg.line()
            .interpolate("basis")
            .x(function(d){ return x(d.x);})
            .y(function(d){ return y(d[y_mean]);})
        )
    // legend
    svg.append("text")
        .attr("transform","translate(" + (-0.1*width+0*0.2*width) + "," +-(0.05*height) + ")")
        .attr("class", "legend")    // style the legend
        .style("fill", extraParam.color[0])
        .style("fill-opacity","1.0")
        .style("font", height/25+"px "+fontName)
        .style("font-weight","bolder")
        .text(y_mean)

    // Display patient
    for(idx=0;idx<y_samples.length;idx++){
        idx_color = 1+idx
        focus.append('path')
            .attr('class','line')
            .attr('id','lin_'+extraParam.htmlID+'_'+y_samples[idx])
            .style({
                "fill": "none",
                "stroke": extraParam.color[idx_color],
                "stroke-width": "2"
            })
            .datum(dataJson)
            .attr("d",d3.svg.line()
                .interpolate("basis")
                .x(function(d){ return x(d.x);})
                .y(function(d){ return y(d[y_samples[idx]]+10);})
            )
                // legend
        svg.append("text")
            .attr("transform","translate(" + (-0.1*width+(2+idx)*0.2*width) + "," +-(0.05*height) + ")")
            .attr("class", "legend")    // style the legend
            .style("fill", extraParam.color[idx_color])
            .style("fill-opacity","1.0")
            .style("font", height/25+"px "+fontName)
            .style("font-weight","bolder")
            .text(y_samples[idx])
        }



    idx_color = 0
    opa = 0.4
    focus.append("path")
        .datum(dataJson)
        .attr({
            // "class": "area confidence",
            'id':'are_'+extraParam.htmlID+'_'+y_samples[idx],
            "fill": extraParam.color[idx_color],
            "d": d3.svg.area()
                .interpolate("basis")
                .x(function (d) { return x(d.x); })
                .y0(function (d) { return y(d[y_min]); })
                .y1(function (d) { return y(d[y_max]); })
        })
        .style("opacity",opa);
    svg.append("text")
            .attr("transform","translate(" + (-0.1*width+(1)*0.2*width) + "," +-(0.05*height) + ")")
            .attr("class", "legend")    // style the legend
            .style("fill", extraParam.color[idx_color])
            .style("fill-opacity",opa)
            .style("font", height/25+"px "+fontName)
            .style("font-weight","bolder")
            .text('conf. int.')



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
    StackData.length = 0
    timezoneOffset.length = 0
    yList.length = 0
    yListTmp.length = 0
    yValue.length = 0
    xList.length = 0
}
