function stackBar(error,dataJson,extraParam){
    // console.log(extraParam)
    var timezoneOffset = new Date(dataJson[0].date*1000)
    var yList = [];
    var yListTmp = [];
    var yValue = [];
    var xList = [];
    console.log(dataJson)
    var StackData = [];
    var isDate = false
    if(['date','Date',"DATE","DATES",'dates'].indexOf(extraParam.xKey)>-1){
        isDate = true
    }
    console.log(isDate)
    dataJson.forEach(function(d) {
        if(isDate){
            if(xList.indexOf(Number(d[extraParam.xKey]*1000))==-1){
                xList.push(d[extraParam.xKey]*1000)
            }
            d["date"] = new Date(d[extraParam.xKey]*1000);
            d.x = [d.date.getFullYear(),d.date.getMonth()+1,d.date.getDate()].join('/');
            // console.log(typeof(d["date"]))
            d.x2 = d.date;//new Date(d.date.getFullYear(),d.date.getMonth(),d.date.getDate());
        }
        else{
            if(xList.indexOf(d[extraParam.xKey])==-1){
                xList.push(d[extraParam.xKey])
            }
            d.x = d[extraParam.xKey]
            // console.log(d.x)
        }
        // if(xList.indexOf(Number(d.x2))==-1){
        //     xList.push(d.x2)
        // }
        if(yListTmp.indexOf(d[extraParam.groupKey])==-1){
            //TestData.push(d.shop)
            StackData[d[extraParam.groupKey]] = []
        }
        //StackData[d.shop].push({"name":d.x,"values":d.AU})
        StackData[d[extraParam.groupKey]].push({xName:0,x:d.x2,y:d[extraParam.yKey],y0:0})//.push({"name":d.x,"values":d.AU})

        if(yListTmp.indexOf(d[extraParam.groupKey])==-1){
            //yList.push({'shop':d.shop,'value':d.AU})
            yListTmp.push(d[extraParam.groupKey])
            yValue[d[extraParam.groupKey]] = d[extraParam.yKey]
            // yList.push([d[extraParam.groupKey],d[extraParam.yKey]])

        }
        else{
            yValue[d[extraParam.groupKey]] += d[extraParam.yKey]
            //console.log(d[extraParam.groupKey],yList)
            //yList[d[extraParam.groupKey],d[extraParam.yKey]] = d[extraParam.yKey]
        }
    });


    yListTmp.forEach(function(d){
        yList.push([d,yValue[d]])
    })
    if(yListTmp.indexOf('Other-')==-1){
        yList.push(["Other-",0])
        StackData['Other-'] = StackData[yListTmp[0]]
        StackData['Other-'].forEach(function(d){
            d.y=0
        })
        console.log(StackData['Other-'])
    }


    // group list (country ggi)
    yList.sort(function(a,b){return b[1]-a[1]})
    yList = yList.map(function(d){return d[0]})

    // xKey list (date)
    xList.sort(function(a,b){return a-b;})
    xList = xList.map(function(d){
            if(isDate){
                return new Date(d);
            }
            else{
                return d;
            }
        })
    // console.log(xList)
    var stack2 = d3.layout.stack()
        .offset("offset")
        .values(function(d){return d.values});


    // console.log(xList)
    console.log(yList)
    if(isDate){
        for(var jdx in yList){
            var groupKey = yList[jdx];
            StackData[groupKey].sort(function(a,b){return a.x-b.x})
            console.log(StackData[groupKey].length,yList[jdx])
            for(var idx in xList){
                if(idx>=StackData[groupKey].length){StackData[groupKey].splice(idx,0,{x:xList[idx],y:0,y0:0})}
                if(StackData[groupKey][idx].x.valueOf()!=xList[idx].valueOf()){
                    StackData[groupKey].splice(idx,0,{x:xList[idx],y:0,y0:0})
                }
            }
        }
    }
    yList.splice(yList.indexOf("Other-"),1)

    var maxLengthList = 4
    var otherList = []
    if(yList.length > maxLengthList){
        otherList = yList.slice(maxLengthList,yList.length)
        yList = yList.slice(0,maxLengthList)
    }

    yList.push("Other")
    otherList = otherList.concat(["Other-"])
    // console.log(otherList)
    console.log(StackData["Other"])
    console.log(StackData)
    StackData["Other"] = $.extend(true, [], StackData[otherList[0]])
    StackData["Other"] = StackData["Other"].map(function(d,v){
        d.y = otherList.reduce(function(y,w){
            y = y + StackData[w][v].y
            return y;
        },0)
        return d;
        }
    )


    var maxStack = 0;
    // for(var idx in xList){
    //     var y0 = 0;
    //     var date = xList[idx];
    //     date = new Date(date)
    //     //date = [date.getFullYear(),date.getMonth()+1,date.getDate()].join('/');
    //     for(var jdx in yList){

    //         shop = yList[jdx]
    //         //console.log(idx,jdx,StackData[shop][idx])
    //         if(StackData[shop][idx]){

    //             StackData[shop][idx].x = xList.indexOf(Number(StackData[shop][idx].xName));
    //             StackData[shop][idx].xName = date;
    //         }
    //         else{
    //             StackData[shop][idx] = {x:0,y:0,xName:''}
    //         }
    //     //     if(StackData[shop][idx]){
    //     //         console.log(idx)
    //     //         console.log(StackData[shop][date])
    //     //         StackData[shop][date].y0 = y0;
    //     //         y0 = y0 + StackData[shop][date].y
    //     //         // StackData[shop][date].xName = xList[idx];
    //     //         StackData[shop][date].x = Number(idx);
    //     //     }
    //     }
    //     if(maxStack<y0){
    //         maxStack=y0
    //     }
    // }




    console.log(StackData)
    timezoneOffset = timezoneOffset.getTimezoneOffset()*60*1000
    var n = yList.length, // number of layers - number of shops
        m = xList.length, // number of samples per layer

        stack = d3.layout.stack(),
        layers2 = stack(yList.map(function(d,v) {
                return StackData[d];
            })),
        maxY = layers2[layers2.length-1].map(function(d){return d.y0+d.y})


    var normLayers = $.extend(true, [], layers2)
    normLayers = normLayers.map(function (layer){
            layer.map(function(d,v){
                    d.x = d.x
                    d.y = d.y/maxY[v];
                    d.y0 = d.y0/maxY[v];
                    return d;
                })
            return layer
        })


    var yGroupMax2 = d3.max(layers2, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
        yStackMax2 = d3.max(layers2, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });
        yGroupMaxNorm = d3.max(normLayers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
        yStackMaxNorm = d3.max(normLayers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });



    var margin = {top: extraParam.height*0.15, right: extraParam.width*0.01, bottom: extraParam.height*0.1, left: extraParam.width*0.15},
        width = extraParam.width - margin.left - margin.right,
        height = extraParam.height*0.9 - margin.top - margin.bottom;


    var N_ticks = 5;
    var xListTick = [];
    for(var tdx=0;tdx<=N_ticks;tdx++){
        xListTick.push(xList[Math.floor(tdx*(xList.length-1)/N_ticks)]);
    }
    if(maxY.length>20){
        var x = d3.time.scale()
            .domain([xList[0],xList[xList.length-1]])
            .range([0, width]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickPadding(-20)
            .orient("top");
    }
    else{
        var x = d3.scale.ordinal()
            .domain(xList)
            .rangeRoundBands([0, width], .08);
        var xAxis = d3.svg.axis()
            .scale(x)
            .tickPadding(-20)
            .tickFormat(function(d){
                if(d.getMonth()==0){return d3.time.format("%Y")(d);}
                else{return d3.time.format("%B")(d)}
            })
            .orient("top");
        // var xAxis = d3.svg.axis()
        //     .scale(x)
        //     .ticks(d3.time.day,40)
        //     .tickFormat(function(d){
        //             if(xListTick.indexOf(d) > -1){
        //                 return date_format(d);
        //             }
        //             else{
        //                 return null;
        //             }})
        //     .tickPadding(-20)
        //     .orient("top");
    }


    var y = d3.scale.linear()
        .domain([0, yStackMax2])
        .range([height, 0]);

    var color = d3.scale.linear()
        .domain([0, n - 1])
        .range(["#07203D", "#A9C7E8"]);


    B = extraParam.color.map(function(d,idx){
        return idx*(n-1)/(extraParam.color.length-1)})
    var color = d3.scale.linear()
        .domain(B)
        .range(extraParam.color);





    var yAxis = d3.svg.axis()
        .scale(y)
        .tickFormat(d3.format('.2s'))
        .orient("left");
    console.log(layers2)

    var svg = d3.select("#"+extraParam.htmlID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if(maxY.length>20){
        var area = d3.svg.area()
            .x(function(d) {return x(d.x); })
            .y0(function(d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); });

        var layer = svg.selectAll(".area")
            .data(
                layers2
                )
            .enter().append("path")
                .attr("class", "area")
                .attr("d", function(d) {return area(d); })
                .style("fill", function(d,v) {return color(v); })
                .style("stroke", function(d,v) {return color(v-1); })
                .style("opacity", 1.3)
                .style("fill-opacity",1)
                // .attr('stroke-width', function(d) { return height/(100+0.5*xList.length); })
            ;
    }
    else{
        var layer = svg.selectAll(".layer")
            .data(layers2)
            .enter().append("g")
            .attr("class", "layer")
            .style("fill", function(d, i) {return color(i); })
        var rect = layer.selectAll("rect")
            .data(function(d) {return d; })
            .enter().append("rect")
                .attr("x", function(d) {return x(d.x); })
                .attr("y", height)
                .attr("width", x.rangeBand())
                .attr("height", 0);

        rect.transition()
            .delay(function(d, i) { return i * 10; })
            .attr("y", function(d) { return y(d.y0 + d.y); })
            .attr("height", function(d) {return y(d.y0) - y(d.y0 + d.y); });
    }



    svg.append("g")
        .attr("class", "x axis")
        .attr("text-anchor",'start')
        .attr("transform", "translate("+(-0/10)+"," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor",'start')
            .style("font", height/40+"px "+fontName)
            .style("font-weight","bolder")
            .attr('fill', textSlideColor)
            .attr("transform", "rotate(60)");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll("text")
            .style("font", width/30+"px "+fontName)
            .style("font-weight","bolder")
            .attr('fill', textSlideColor);

    // d3.selectAll("input").on("change", change);
    makeSlideTitle(svg,width/2,-height/10,width,height,margin,extraParam)


// console.log(d3.select("#cocu2").node().getBBox())
// console.log(text.getBBox())







//var bbox = text.node().getBBox();



    // svg.append('g')
    //   .attr("class", "title")
    //   .attr("text-anchor",'middle')
    //   .attr("x", width/2)
    //   .attr("y", -width/10)
    //   // .attr("dy", ".35em")
    //   .style("fill", "#fff")
    //   .style("font-weight", "bold")
    //   // .style("font",function(d,v){
    //   //   console.log(d3.select(this).text());
    //   //   console.log($('.title').node().getComputedTextLength())
    //   //   return height/10+"px Arial"
    //   //   });
    //   .style("font", height/10+"px Arial")
    //   .text(extraParam.title);
    //   // .selectAll("text")
    //   // .call(wrap, 200);

    var legend = svg.selectAll(".legend")
      .data(yList, function(d) { return d; })
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (-0.1*width+i*0.2*width) + "," +-(0.05*height) + ")"; });
    legend.append("circle")
      .attr("r", height/100)
      .style("fill", function(d,v) {return color(v); });
    legend.append("text")
      .attr("x", 1.2*height/100)
      .attr("y", -0.005*height)
      .style("text-anchor",'start')
      .style("font", height/35+"px "+fontName)
      .attr("dy", height/60)
      .style("font-weight","bolder")
      .attr('fill', textSlideColor)
      .text(function(d){
            if(d.split(' ').length>1){
                return d.match(/\b(\w)/g).join('.')+'.';
            }
            else{
                return d
            }
        });


    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy"));
            var tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }



    function redrawStackBar() {
        if(typeDraw == 0){
            var yStackToChange = yStackMaxNorm
            var layerToChange = normLayers
            var formatYaxis = function(d){return 100*d+"%"}

            typeDraw = 1;
        }
        else{
            var yStackToChange = yStackMax2
            var layerToChange = layers2
            var formatYaxis = function(d){return d3.format('.2s')(d)}
            typeDraw = 0;
        }


            y = d3.scale.linear()
                .domain([0, yStackToChange])
                .range([height, 0]);

            yAxis = d3.svg.axis()
                .scale(y)
                .tickFormat(formatYaxis)
                .orient("left");
            svg
                .selectAll("g.y.axis")
                .transition()
                .duration(1000)
                .call(yAxis)
                .selectAll("text")
            .style("font", width/30+"px "+fontName)
            .style("font-weight","bolder")
            .attr('fill', textSlideColor);
        if(maxY.length>20){
            var area = d3.svg.area()
                .x(function(d) {return x(d.x); })
                .y0(function(d) { return y(d.y0); })
                .y1(function(d) { return y(d.y0 + d.y); });
            layer
                .data(layerToChange)
                .transition()
                .duration(1000)
                .attr("d", function(d,v) {return area(d); });
        }
        else{
            area = null
            layer
                .data(layerToChange)
                .selectAll("rect")
                .data(function(d) {return d; })
                .transition()
                .duration(1000)
                .attr("y", function(d) {return y(d.y0 + d.y); })
                .attr("height", function(d) {return y(d.y0) - y(d.y0 + d.y); });
        }
        layerToChange = null
        setTimeout(redrawStackBar,stackBarTimer)
    }
    var typeDraw = 0;
    redrawStackBar()
    StackData.length = 0
    timezoneOffset.length = 0
    yList.length = 0
    yListTmp.length = 0
    yValue.length = 0
    xList.length = 0
    otherList.length = 0
    area = null
}


function getWeeklyFlaskRoute(gameIN,dateIN){
    var year_ = castInt(dateIN.getFullYear())
    var week_ = castInt(dateIN.getWeek())
    console.log(dateIN,dateIN.getWeek(),dateIN.getDay())
    mondayDate = new Date(dateIN.getTime()-(dateIN.getDay()-1+7)*24*3600*1000)
    mondayDate = "W_"+mondayDate.getFullYear()+"-"+castInt(mondayDate.getMonth()+1)+"-"+castInt(mondayDate.getDate())
    return"/loadADDjson/"+gameIN+"/"+mondayDate
}

function innerTextFormatWeekly(stringIN){
    if(stringIN=="revenue"){return function(number){return d3.format('.3s')(number)+'\u20AC'};}
    if(stringIN=="hc_spent"){return function(number){return d3.format('.3s')(number)};}
    if(stringIN=="dau"){return function(number){return d3.format('.3s')(number)};}
    if(stringIN=="pau"){return function(number){return d3.format('.3s')(number)}}
    if(stringIN=="installs"){return function(number){return d3.format('.3s')(number)};}
if(stringIN=="weekly"){return function(number){return d3.format('.3s')(number)};}
}
function dataCircleDaily(stringIN, valueMain, valueRef, valueBackMain, valueBackRef){
    maximum = {}
    maximum["gdi"] = 100;
    maximum["pau"] = 15000;
    maximum["installs"] = 1000000;
    maximum["revenue"] = 80000;
    maximum["hc_spent"] = 100000000;
    if(typeof valueBackRef === "undefined" || valueBackRef === null){
        valueBackRef = valueRef
    }
    if(typeof valueBackMain === "undefined" || valueBackMain === null){
        valueBackMain = maximum[stringIN]
    }
    return [
        {index: 0.7, text: "reference",  value: valueMain, valueBack:valueBackRef, maximum: maximum[stringIN]},
        {index: 0.8, text: "main",  value: valueRef, valueBack:valueBackMain, maximum: maximum[stringIN]}
        ];
}
function dataCircleWeekly(stringIN, valueMain, valueRef, valueBackMain, valueBackRef){
    maximum = {}
    maximum["dau"] = 1500000;
    maximum["pau"] = 15000;
    maximum["installs"] = 300000;
    maximum["revenue"] = 80000;
    maximum["hc_spent"] = 100000000;
    if(typeof valueBackRef === "undefined" || valueBackRef === null){
        valueBackRef = valueRef
    }
    if(typeof valueBackMain === "undefined" || valueBackMain === null){
        valueBackMain = maximum[stringIN]
    }
    return [
        {index: 0.7, text: "reference",  value: valueMain, valueBack:valueBackRef, maximum: maximum[stringIN]},
        {index: 0.8, text: "main",  value: valueRef, valueBack:valueBackMain, maximum: maximum[stringIN]}
        ];
}
function titleCircleDaily(stringIN){
    title = {}
    title["gdi"] = "GDI";
    title["pau"] = "Daily PAU";
    title["installs"] = "Daily New Installs";
    title["revenue"] = "Daily Revenue";
    title["hc_spent"] = "Daily Hard Currency Spent";
    return title[stringIN]
}

function titleCircleWeekly(stringIN){
    title = {}
    title["dau"] = "Weekly AU";
    title["pau"] = "Weekly PAU";
    title["installs"] = "Weekly New Installs";
    title["revenue"] = "Weekly Revenue";
    title["hc_spent"] = "Weekly Hard Currency Spent";
    return title[stringIN]
}

function colorArcsWeekly(stringIN){
    col = {}
    col["dau"] = circleColor
    col["pau"] = circleColor
    col["installs"] = circleColor
    col["revenue"] = circleColor
    col["hc_spent"] = circleColor
    return col[stringIN]
}

function colorTextWeekly(stringIN){
    col = {}
    col["dau"] = textCircleColor
    col["pau"] = textCircleColor
    col["installs"] = textCircleColor
    col["revenue"] = textCircleColor
    col["hc_spent"] = textCircleColor
    return col[stringIN]
}

function sizeCirclesWeekly(stringIN){
    widthPanel = $(".slides").width()
    heightPanel = $(".slides").height()
    sizeC = {}
    sizeC["dau"] = [widthPanel*0.9,heightPanel*0.8];
    sizeC["pau"] = [widthPanel*0.9,heightPanel*0.8];
    sizeC["installs"] = [widthPanel*0.9,heightPanel*0.8];
    sizeC["revenue"] = [widthPanel*0.9,heightPanel*0.8];
    sizeC["hc_spent"] = [widthPanel*0.9,heightPanel*0.8];
    return sizeC[stringIN]
}



sizeCircles("dau")

var circleFieldsName = ["gdi"]//["revenue", "dau", "installs", "pau","hc_spent"]


// var slideCircles = {}
// circleFieldsName.forEach(function(d){
//     slideCircles[d] = new d3circle(d+"_weekly_akl",sizeCirclesWeekly(d)[0],sizeCirclesWeekly(d)[1],colorArcsWeekly(d),colorTextWeekly(d),innerTextFormatWeekly(d),dataCircleWeekly(d,0,0),titleCircleWeekly(d));
// })

// var slideDCircles = {}
// circleFieldsName.forEach(function(d){
//     slideDCircles[d] = new d3circle(d+"_dailySlide_akl",sizeCirclesWeekly(d)[0],sizeCirclesWeekly(d)[1],colorArcsWeekly(d),colorTextWeekly(d),innerTextFormatWeekly(d),dataCircleDaily(d,0,0),titleCircleDaily(d));
// })

Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
   date.setHours(0, 0, 0, 0);
  //0 pour dimanche, 1 pour lundi, 2 pour mardi, et ainsi de suite.
  // Saturday in current week decides the year.
  date.setDate(date.getDate() + 5 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 5 + (week1.getDay() + 6) % 7) / 7);
}





// var game_name = 'iaa'
$("document").ready(function(){
    // queue()
    //         .defer(d3.json, "/loadADDjson/iaa/ggiMAU")
    //         .defer(extraGraphParam,
    //             $(".slides").width(),
    //             $(".slides").height(),
    //             ["#fff","#fff","#fff","#fff"],
    //             "Monthly Active Users per shop",
    //             "monthlyAU_GGI_akl",
    //             game_name,
    //             "date",
    //             "AU",
    //             "shop")
    //         .await(stackBar)
    // addNewSlide('monthlyAU_GGI_akl')
    // queue()
    //         .defer(d3.json, "/loadADDjson/iaa/ggiDAU")
    //         .defer(extraGraphParam,
    //             $(".slides").width(),
    //             $(".slides").height(),
    //             ["#fff","#fff","#fff","#fff"],
    //             "Daily Active Users per shop",
    //             "dailyAU_GGI_akl",
    //             game_name,
    //             "date",
    //             "AU",
    //             "shop")
    //         .await(stackBar)
    // addNewSlide('dailyAU_GGI_akl')
    // queue()
    //         .defer(d3.json, "/loadADDjson/iaa/ggiDPAU")
    //         .defer(extraGraphParam,
    //             $(".slides").width(),
    //             $(".slides").height(),
    //             ["#fff","#fff","#fff","#fff"],
    //             "Daily Paying Active Users per shop",
    //             "dailyPAU_GGI_akl",
    //             game_name,
    //             "date",
    //             "PAU",
    //             "shop")
    //         .await(stackBar)
    // addNewSlide('dailyPAU_GGI_akl')
    // queue()
    //         .defer(d3.json, "/loadADDjson/iaa/ggiDPAU")
    //         .defer(extraGraphParam,
    //             $(".slides").width(),
    //             $(".slides").height(),
    //             ["#fff","#fff","#fff","#fff"],
    //             "Daily Revenue per shop",
    //             "dailyRevenue_GGI_akl",
    //             game_name,
    //             "date",
    //             "revenue",
    //             "shop")
    //         .await(stackBar)
    // addNewSlide('dailyRevenue_GGI_akl')
    // queue()
    //         .defer(d3.json, "/loadADDjson/iaa/countryMPAU")
    //         .defer(extraGraphParam,
    //             $(".slides").width(),
    //             $(".slides").height(),
    //             ["#fff","#fff","#fff","#fff"],
    //             "Monthly Revenue per country",
    //             "monthlyRevenue_country_akl",
    //             game_name,
    //             "date",
    //             "revenue",
    //             "country")
    //         .await(stackBar)
    // addNewSlide('monthlyRevenue_country_akl')
    // queue()
    //         .defer(d3.json, "/loadADDjson/iaa/countryMInstalls")
    //         .defer(extraGraphParam,
    //             $(".slides").width(),
    //             $(".slides").height(),
    //             ["#fff","#fff","#fff","#fff"],
    //             "Monthly Installs per country",
    //             "monthlyInstalls_country_akl",
    //             game_name,
    //             "date",
    //             "New Users",
    //             "country")
    //         .await(stackBar)
    // addNewSlide('monthlyInstalls_country_akl')
    // queue()
    //         .defer(d3.json, "/loadADDjson/iaa/countryDInstalls")
    //         .defer(extraGraphParam,
    //             $(".slides").width(),
    //             $(".slides").height(),
    //             ["#fff","#fff","#fff","#fff"],
    //             "Daily Installs per country",
    //             "dailyInstalls_country_akl",
    //             game_name,
    //             "date",
    //             "New Users",
    //             "country")
    //         .await(stackBar)
    // addNewSlide('dailyInstalls_country_akl')





    // circleFieldsName.forEach(function(d){
    //     console.log(d)
    //     makeProgressCircle(slideCircles[d],0.01);
    // })
    // function slideWeeklyMaster(){
    //     console.log("panel function - update circles")
    //     queue()
    //         .defer(d3.json, getWeeklyFlaskRoute(game_name,dayM7Date))
    //         .defer(d3.json, getWeeklyFlaskRoute(game_name,todayDate))
    //         .defer(extraParamCircles, slideCircles, 'weekly')
    //         .await(makePanel)
    //     //makeAKLgraphs("ok",jsonData1,jsonData2)
    //     setTimeout(slideWeeklyMaster,3600*1000);
    // }
    // slideWeeklyMaster()

    // slideWeeklyMaster()
    // queue()
    //         .defer(d3.json, "/loadADDjson/iaa/ggiDRevenue")
    //         .defer(extraGraphParam,
    //             $(".slides").width(),
    //             $(".slides").height(),
    //             ["#fff","#fff","#fff","#fff"],
    //             "Daily Revenue",
    //             "dailyRevenue_GGI_akl",
    //             "iaa",
    //             "date",
    //             "shop")
    //         .await(stackBar)
});


// function addNewSlide(divID,spanID){
//     var newSlide = '<section> <div class="slideGraph" id="'+divID+'">  '
//     if(typeof(spanID)!='undefined'){
//         // newSlide = newSlide + '<span class="timeLeft" id="'+spanID+'"></span>'
//         newSlide = newSlide + '<span class="timeLeft '+spanID+'"></span>'
//     }
//     newSlide = newSlide + '</div> </section>'
//     $('.slides').append($(newSlide))
// }
