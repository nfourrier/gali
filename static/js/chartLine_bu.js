function chartLine(error,dataJson,extraParam){
    console.log(extraParam)
    console.log(extraParam.yKey)

    // console.log(dataJson)
    // console.log(extraParam)
    var timezoneOffset = new Date(dataJson[0].date*1000)
    var yList = [];
    var yListTmp = [];
    var yValue = [];
    var xList = [];

    var StackData = [];
    // if(extraParam.groupKey!=dataJson[0])
    if(!(extraParam.groupKey in dataJson[0])){
        dataJson.forEach(function(d){
            d[extraParam.groupKey] = "myResult"
        })
    }
    var isPercent = 0
    if(["Retention","ARPU","CSR","ARPU","ARPPU"].indexOf(extraParam.yKey) > -1){
        sortKey = "AU_"
        isPercent = 1
    }
    else if(extraParam.title.indexOf("retention")){
        sortKey = "AU_"
        isPercent = 1
        console.log(extraParam.title)
    }
    else{
        sortKey = extraParam.yKey
    }
    dataJson.forEach(function(d) {
        // if(extraParam.htmlID=="day7_country_akl_line"){console.log(d)}
        // console.log(d)
        // if(extraParam.yKey=="CSR"){
        //     console.log(d)
        //     }
        // console.log(d)
        // console.log(new Date(d[extraParam.xKey]*1000))
        if(xList.indexOf(Number(d[extraParam.xKey]*1000))==-1){
            xList.push(d[extraParam.xKey]*1000)
        }
        d[extraParam.xKey] = new Date(d[extraParam.xKey]*1000);
        // if(extraParam.htmlID=="day7_ggi_akl_line"){console.log(d)}
        d.x = d3.time.format("%Y-%m-%d")(d[extraParam.xKey]);
        d.x2 = d[extraParam.xKey];//new Date(d.date.getFullYear(),d.date.getMonth(),d.date.getDate());
        // console.log(d.x2)
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
            yValue[d[extraParam.groupKey]] = d[sortKey]
            // yList.push([d[extraParam.groupKey],d[extraParam.yKey]])

        }
        else{
            yValue[d[extraParam.groupKey]] += d[sortKey]
            //console.log(d[extraParam.groupKey],yList)
            //yList[d[extraParam.groupKey],d[extraParam.yKey]] = d[extraParam.yKey]
        }

    });
    dataJson.sort((function(a,b){return a[extraParam.xKey]-b[extraParam.xKey]}))


    yListTmp.forEach(function(d){
        yList.push([d,yValue[d]])
    })
    console.log(yList)



    var margin = {top: extraParam.height*0.15, right: extraParam.width*0.01, bottom: extraParam.height*0.1, left: extraParam.width*0.15},
        width = extraParam.width - margin.left - margin.right,
        height = extraParam.height*0.9 - margin.top - margin.bottom;
// console.log(width,height,extraParam.height)
    $("#"+extraParam.htmlID).empty()
    var svg = d3.select("#"+extraParam.htmlID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    xList.sort(function(a,b){return a-b;})

    // console.log(yList)
    yList.sort(function(a,b){return b[1]-a[1]})
    console.log(yList)
    yList = yList.map(function(d){return d[0]})
    console.log(yList)
    if(yList.indexOf("Other-")>-1){
        yList.splice(yList.indexOf("Other-"),1)
        yList.push("Other-")
    }

    // console.log(yList)

    // console.log(yList)

        console.log(yList)
    var maxLengthList = 3
    var dataNest = d3.nest()
        .key(function(d) {return d[extraParam.groupKey];})
        .sortKeys(function(a,b){
            return yList.indexOf(a)-yList.indexOf(b)
        })
        .entries(dataJson);
    console.log(dataNest)
    // dataNest[maxLengthList]
    console.log(extraParam.groupKey,maxLengthList)
    dataNest.forEach(function(d){console.log(d)})
        if(yList.length>=maxLengthList-1){
            esssai = dataNest.reduce(function(rec,other,idx){
                console.log(other.key,idx,other.values)
                console.log(rec.key,idx)
                console.log(other.values[5]["date"],other.values[5]["Value"],other.values[5]["AU_"])
                console.log(rec.values[5]["date"],rec.values[5]["Value"],rec.values[5]["AU_"])

                var yKey = extraParam.yKey
                var xKey = extraParam.xKey
                var gpKey = extraParam.groupKey

                if(idx==maxLengthList){
                    console.log('here')
                    for(var xdx=0;xdx<xList.length;xdx++){
                        rec.key = "Other"
                        if(rec.values[xdx][xKey].getTime()==(new Date(xList[xdx])).getTime()){
                            // console.log(rec.values[xdx][gpKey])
                            rec.values[xdx][gpKey] = "Other"
                            if(isPercent == 1){
                                rec.values[xdx][yKey] = rec.values[xdx][yKey]
                            }
                            rec.values[xdx][xKey] = new Date(xList[xdx]);
                            // rec.values[xdx][yKey] = 0
                        }
                        else{
                            tmpObj = {}
                            tmpObj[gpKey] = "Other"
                            tmpObj[xKey] = new Date(xList[xdx])
                            tmpObj[yKey] = 0
                            rec.values.splice(xdx,0,tmpObj)
                        }
                    }
                }

                if(idx>maxLengthList){
                    otherCounter = 0
                    // console.log(extraParam.groupKey,maxLengthList)
                    // if(extraParam.htmlID=="day7_ggi_akl_line"){console.log(other,rec)}
                    for(var xdx=0;xdx<xList.length;xdx++){
                        // console.log(rec.values[xdx][gpKey])
                        // if(extraParam.htmlID=="day7_ggi_akl_line"){console.log(xdx,xKey,other.values[xdx])}
                        // console.log(xdx,xKey,rec.values[xdx])
                        // console.log(other.values[xdx][xKey].getTime()==rec.values[otherCounter][xKey].getTime(),other.values[xdx][xKey],rec.values[otherCounter][xKey])
                        // console.log(other.values)
                        // console.log(rec.values[xdx][xKey].getTime()==other.values[otherCounter][xKey].getTime(),rec.values[xdx][xKey],other.values[otherCounter][xKey])
                        // console.log(other.values[xdx])
                        if(rec.values[xdx][xKey].getTime()==other.values[xdx][xKey].getTime()){
                            if(isPercent == 1){

                                normRec = rec.values[xdx]["AU_"]
                                normOth = other.values[xdx]["AU_"]
                                // console.log(normRec,normOth)
                                rec.values[xdx][yKey] = (rec.values[xdx][yKey]*normRec + other.values[xdx][yKey] *normOth) / (normRec+normOth)
                                rec.values[xdx]["AU_"] =rec.values[xdx]["AU_"]+other.values[xdx]["AU_"]
                            }
                            else{
                                // console.log('here')
                                rec.values[xdx][yKey] = rec.values[xdx][yKey] + other.values[xdx][yKey]
                            }
                            // otherCounter = otherCounter + 1
                        }
                        else{
                            // console.log(rec.values[xdx],other.values[xdx],"la")
                            other.values.splice(xdx,0,0)
                            // console.log(other.values)
                        }
                    }
                }
                return rec
            },dataNest[maxLengthList])
        dataNest.splice(maxLengthList,9999)
        dataNest.push(esssai)
    }

    legendSpace = width/dataNest.length; // spacing for the legend

    B = extraParam.color.map(function(d,idx){
        return idx*(maxLengthList)/(extraParam.color.length-1)})
    var color = d3.scale.linear()
        .domain(B)
        .range(extraParam.color);


    // console.log(extraParam)
    dataNest.forEach(
        function(d,i){
            if(d.values.length > 6){
                d.values = d.values.splice(Math.max(0,d.values.length-8),d.values.length-1)
            }
        }
    )
    // console.log(xList)
    var x = d3.time.scale()
        .domain([xList[Math.max(xList.length-8,0)],xList[xList.length-1]])
        // .domain([xList[0],xList[xList.length-1]])
        .range([0, width]);



    yMax = d3.max(dataJson, function(d){
            // console.log(d);
            return +d[extraParam.yKey]})
    yMin = d3.min(dataJson, function(d){return +d[extraParam.yKey]})
    yMin = yMin - 0.1*Math.abs(yMin)
    yMax = yMax + 0.1*Math.abs(yMax)
    console.log(yMax)
    if(yMax>1001){
        formatY = d3.format('.2s')
    }
    else if(yMin < -1001){
        formatY = d3.format('.2s')
    }
    else{
        formatY = d3.format('.2r')
    }

    var y = d3.scale.linear()
        .domain([yMin, yMax])
        .range([height, 0]);
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom")
        // .ticks(5);

    // console.log(yMin,yMax,Math.abs(-yMin))

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5)
        // .tickFormat(d3.format('.2s'));
        .tickFormat(formatY);
        // .tickFormat(d3.time.format("%B"));
    var priceline = d3.svg.line()
        .x(function(d) {
                        // console.log(x(d[extraParam.xKey]),y(d[extraParam.yKey]),extraParam.xKey);
                        return x(d[extraParam.xKey]); })
        .y(function(d) { return y(d[extraParam.yKey]); });


    // var tip = d3.tip()
    //   .attr('class', 'd3-tip'+'d')
    //   .offset([-10, 0])
    //   .html(function(d) {
    //     console.log('asdafadsafsaads')
    //     return "<strong>Frequency:</strong> <span style='color:red'>" + 'laaaaa' + "</span>";
    //   })

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
    // console.log(dataNest)


 dataNest.forEach(
        function(d,i){
            // console.log(d.values.splice(0,10))
            // console.log(d)
            svg.append("path")
            .attr("class", "line")
            .style("fill-opacity","0.0")
            .attr('stroke-width', function(d) { return 0.5*height/(100+0.5*xList.length); })
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(i); })
            .attr("id", extraParam.htmlID+'_tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", priceline(d.values))




        })


    dataNest.forEach(
        function(d,i){

            // console.log(d.values.splice(0,10))
            // console.log(d)
            // svg.append("path")
            // .attr("class", "line")
            // .style("fill-opacity","0.0")
            // .attr('stroke-width', function(d) { return 0.5*height/(100+0.5*xList.length); })
            // .style("stroke", function() { // Add the colours dynamically
            //     return d.color = color(i); })
            // .attr("id", extraParam.htmlID+'_tag'+d.key.replace(/\s+/g, '')) // assign ID
            // .attr("d", priceline(d.values))
            // .on("mouseover",mouseover)
            // .on("mouseout",mouseout)
            // .on("mousemove",function(d){
            //     console.log(d)
            // })
            ;
            svg.selectAll('circle'+i).data(d.values)
            .enter().append('svg:circle')
            .attr("class", function (v,vv) {return extraParam.htmlID+'_cir'+i+"_"+d.key.replace(/\s+/g, '')}) // assign ID
            .attr('cx', function (v) { return x(v[extraParam.xKey]); })
            .attr('cy', function (v) { return y(v[extraParam.yKey]); })
            .style("opacity", 1)
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(i); })
            .style("stroke-width", 0.55*height/(100+2.5*xList.length))
            // .style("fill-opacity","0.0")
            .attr('fill',textSlideColor)
            .attr('r', 1.5*height/(100+2.5*xList.length))
            .on("mouseover",mouseover)
            .on("mouseout",mouseout)
            // .on("mousemove",mousemove)
            ;

            svg.append("text")
            .attr("transform","translate(" + (-0.1*width+i*0.2*width) + "," +-(0.05*height) + ")")
            // .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
            // .attr("y", height + (margin.bottom/2)+ 5)
            .attr("class", "legend")    // style the legend
            .style("fill", function() { // Add the colours dynamically
                return d.color = color(i); })
            .style("fill-opacity","1.0")
            .on("click", function(){
                // Determine if current line is visible
                var active   = d.active ? false : true,
                newOpacity = active ? 0 : 1;
                // Hide or show the elements based on the ID
                d3.selectAll("."+extraParam.htmlID+'_cir'+i+"_"+d.key.replace(/\s+/g, '')) // assign ID
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active
                d.active = active;

                d3.select("#"+extraParam.htmlID+"_tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active
                d.active = active;
                })
            // .text(d.key);
            .text(function(){
                var keyName = d.key;
                if(keyName.split(' ').length>1){
                    return keyName.match(/\b(\w)/g).join('.')+'.';
                }
                else{
                    return keyName
                }
            })
            // .attr("class", "line")


        // .on('mouseover', tip.show)
        // .on('mouseout', tip.hide)
        //     .on("mouseover", function(d) {
        //     div.transition()
        //         .duration(200)
        //         .style("opacity", .9);
        //     div .html(formatTime(d[xKey]) + "<br/>"  + d[yKey])
        //         // .style("left", (d3.event.pageX) + "px")
        //         // .style("top", (d3.event.pageY - 28) + "px");
        //     })
        // .on("mouseout", function(d) {
        //     div.transition()
        //         .duration(500)
        //         .style("opacity", 0);
        // })

            // .enter().append("path")
        })

console.log($(".dailyPAU_country_akl_line_cir4China"))


    // console.log(svg)


        var li = {
        w: 0.2*width, h: 0.1*width/1.5, s: 0.01*width, r: 0.01*width
        };

    var focus = svg.append("g")
          .attr("class", "focus")
          .attr("class", "foc_"+extraParam.htmlID)
          .style("display", "none");
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

    function mouseover(d) {
        // console.log(yList)
        // console.log(this,typeof(this))
        // console.log(this['style']["stroke"])
        focus.style("display",null)
        focus.select("rect")
            .attr("transform", "translate(" + (x(d[extraParam.xKey])-li.w) + "," + (y(d[extraParam.yKey])-li.h) + ")")
            .attr("stroke",this['style']["stroke"])
        focus.select("text.textX")
            // .attr("transform", "translate(" + (x(d[extraParam.xKey])-li.w) + "," + (y(d[extraParam.yKey]))-li.h + ")")
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
    // d3.selectAll("input").on("change", change);
    makeSlideTitle(svg,width/2,-height/10,width,height,margin,extraParam)
    // addCR(svg,width/2,-height/10,width,height,margin,extraParam)
    dataJson.length = 0
    StackData.length = 0
    timezoneOffset.length = 0
    // yList.length = 0
    yListTmp.length = 0
    yValue.length = 0
    xList.length = 0
}
