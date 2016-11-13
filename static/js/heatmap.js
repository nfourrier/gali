function countUnique(dataIN, fieldIN){
    A = dataIN.reduce(function(last, now){
        var index = last[0].indexOf(now[fieldIN])
        if (index === -1) {
          last[0].push(now[fieldIN]);
          last[1]++;
        }
        return last;
    },[[], 0])
    return A[1];
}

function makeD3Retentiongraphs(error, data, extraParam) {
    // var data = [
    //     {score: 0.5, row: 0, col: 0},
    //     {score: 0.7, row: 0, col: 1},
    //     {score: 0.2, row: 1, col: 0},
    //     {score: 0.4, row: 1, col: 1}
    // ];

    //height of each row in the heatmap
    //width of each column in the heatmap
    console.log(extraParam)
    var minDateTS = data[0][extraParam.yKey];
    var maxDateTS = data[0][extraParam.yKey];



    data.forEach(function(d) {
      // console.log(data)
        d["TS"] = d[extraParam.yKey]
        if(d["TS"]>maxDateTS){
            maxDateTS = d["TS"];
        }
        if(d["TS"]<minDateTS){
            minDateTS = d["TS"];
        }

        d[extraParam.yKey] = new Date(d["TS"]*1000-12*3600*1000+24*3600*1000);
    });

    var minDate = new Date(minDateTS*1000-12*3600*1000+24*3600*1000);
    var maxDate = new Date(maxDateTS*1000-12*3600*1000+24*3600*1000);
    var dimIns = countUnique(data,"TS")
    var dimRet = countUnique(data,extraParam.xKey)

    var colorLow = 'green', colorMed = 'yellow', colorHigh = 'red';

    // h_title = $("h1#titleHeat").height()
    w_slide = extraParam.width
    h_slide = extraParam.height
    var margin = {top: extraParam.height*0.15, right: extraParam.width*0.01, bottom: extraParam.height*0.1, left: extraParam.width*0.15},
        width = w_slide*1 - margin.left - margin.right,
        height = h_slide*0.9 - margin.top - margin.bottom;

    var gridSize = 10,
        h = height/dimIns,
        w = width/dimRet,
        rectPadding = 6;

    var x = d3.scale.linear()
        .domain([0, dimRet])
        .range([0, width]);

    var y = d3.time.scale()
        .domain(d3.extent(data,function(d){return d[extraParam.yKey];}))
        // .attr("class", ".tick_label")
        .range([height, 0]);

    var  date_format = d3.time.format("%d %b");

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickFormat(date_format)
        .ticks(10)
        .tickPadding(12)
        .tickSize(3)
        .orient('left');


    B = extraParam.color.concat(["#07203D","#213B59","#4F6A89","#7C98B8","#A9C7E8"])
    B = extraParam.color
    // console.log(extraParam.color)
    // console.log(B)
    A = B.slice(0,4).concat(B[4],B.slice(0,4).reverse()),B.slice(0,4).reverse()
    A = B
    // A = A.reverse()
    // console.log(A)
    var colorScale = d3.scale.linear()
        .domain([0,10,20,40,100])
        .range(A);

          console.log(dimRet,w)
    // var colorScale = d3.scale.linear()
    //     .domain([0,5,10,15,20,25,30,40,100])
    //     .range(["#07203D","#213B59","#4F6A89","#7C98B8","#A9C7E8","#7C98B8","#4F6A89","#213B59","#07203D"]);
         // .domain([0, 30, 100])
         // .range(["#07203D", "#213B59", colorHigh]);
    var svg = d3.select("#"+extraParam.htmlID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+height+")")
      .call(xAxis)
      .attr('fill', textSlideColor);;

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .attr('fill', textSlideColor);;

    var heatMap = svg.selectAll(".heatmap")
        .data(data, function(d) { return d[extraParam.yKey] + ':' + d[extraParam.xKey]; })
      .enter().append("g:rect")
        .attr("x", function(d) {return d[extraParam.xKey] * w; })
        .attr("y", function(d) {return ((maxDateTS-minDateTS)/86400 -(d["TS"] - minDateTS)/86400) * h; })
        .attr("width", function(d) { return w; })
        .attr("height", function(d) { return h; })
        .style("fill", function(d) {return colorScale(d[extraParam.groupKey]); });


      // Add a legend for the color values.
  var legend = svg.selectAll(".legend")
      .data([0, 5, 10, 15, 20, 30, 40, 100], function(d) { return d; })
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (0.8*width) + "," +(height/20 + i * height/20) + ")"; });

    //size rectangle
  legend.append("rect")
      .attr("width", height/20)
      .attr("height", height/20)
      .style("fill", function(d) { return colorScale(d); });

    //position relatively to rectangle
  legend.append("text")
      .attr("x", 1.2*height/20)
      .attr("y", height/40)
      .attr("dy", ".35em")
      .text(String)
      .attr('fill', textSlideColor);

    //Titre legende
  svg.append("text")
      .attr("class", "label")
      .attr("x", width - 50)
      .attr("y", 0)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("font", height/15+"px "+fontName)
      .style("font-weight","normal")
      .text("Scale")
      .attr('fill', textSlideColor);;

// var span_element = document.createElement("span");
// document.body.appendChild(span_element);

// var svgTmp = d3.select(span_element).append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var text = svgTmp.append("text")
//             .text(extraParam.title)
//             .attr("text-anchor",'middle')
//             .attr("x", width/2)
//             .attr("y", -width/10)
//             .style("font-weight", "bold");

//     svg.append('g').append("text")

//       .attr("class", "title")
//       .attr("text-anchor",'middle')
//       .attr("x", width/2)
//       .attr("y", -height/10)
//       //.attr("id", "cocu")
//       .text(extraParam.title)
//       // .attr("dy", ".35em")
//       .style("fill", extraParam.titleColor)
//       .style("font-weight", "bold")

//       .style("font",
//         function(d){
//         title_fontSize = height/10
//         title_width = width + margin.left + margin.right+1
//         while(title_width*1.1>=width){
//             text.style("font",title_fontSize+"px "+fontName)
//             title_width = text.node().getBBox().width
//             title_fontSize = title_fontSize - 1
//         }
//        return title_fontSize+"px "+fontName
//       })
//       .style("font-weight","bold");
    makeSlideTitle(svg,width/2,-height/10,width,height,margin,extraParam)


}

$("document").ready(function(){


});
