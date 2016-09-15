var SVGMask = (function() {
    function SVGMask(focus) {
        this.focus = focus;
        this.mask  = this.focus.append("g").attr("class","mask");
        this.left  = this.mask.append("polygon");
        this.right = this.mask.append("polygon");
        this.middle = this.mask.append("polygon");
        this._x = null;
        this._y = null;
    }

    SVGMask.prototype.style = function(prop, val) {
        this.left.style(prop, val);
        this.right.style(prop, val);
        this.middle.style(prop, val);
        return this;
    }

    SVGMask.prototype.x = function(f) {
        if (f == null) {
            return this._x;
        }
        this._x = f;
        return this;
    };

    SVGMask.prototype.y = function(f) {
        if (f == null) {
            return this._y;
        }
        this._y = f;
        return this;
    };

    SVGMask.prototype.redraw = function() {
        var lp, maxX, maxY, minX, minY, rp, xDomain, yDomain;
        yDomain = this._y.domain();
        minY = yDomain[0];
        maxY = yDomain[1];
        xDomain = this._x.domain();
        minX = xDomain[0];
        maxX = xDomain[1];
        lp = {
            l: this._x(minX),
            t: this._y(minY),
            r: this._x(this.from),
            b: this._y(maxY)
        };
        rp = {
            l: this._x(this.to),
            t: this._y(minY),
            r: this._x(maxX),
            b: this._y(maxY)
        };
        this.left.attr("points", "" + lp.l + "," + lp.t + "  " + lp.r + "," + lp.t + "  " + lp.r + "," + lp.b + "  " + lp.l + "," + lp.b);
        this.right.attr("points", "" + rp.l + "," + rp.t + "  " + rp.r + "," + rp.t + "  " + rp.r + "," + rp.b + "  " + rp.l + "," + rp.b);
        return this;
    };


    SVGMask.prototype.redraw_inner = function() {
        var lp, maxX, maxY, minX, minY, rp, xDomain, yDomain;
        yDomain = this._y.domain();
        minY = yDomain[0];
        maxY = yDomain[1];
        xDomain = this._x.domain();
        minX = xDomain[0];
        maxX = xDomain[1];
        mp = {
            l: this._x(this.from),
            t: this._y(minY),
            r: this._x(this.to),
            b: this._y(maxY)
        };
        this.middle.attr("points", "" + mp.l + "," + mp.t + "  " + mp.r + "," + mp.t + "  " + mp.r + "," + mp.b + "  " + mp.l + "," + mp.b);
        return this;
    };

    SVGMask.prototype.reveal_inner = function(extent) {
        this.from = extent[0];
        this.to = extent[1];
        this.redraw_inner();
        return this;
    };

    SVGMask.prototype.reveal = function(extent) {
        this.from = extent[0];
        this.to = extent[1];
        this.redraw();
        return this;
    };

    return SVGMask;

})();

function generateDateSelector(game_nameIN){
  queue()
              .defer(d3.json, "/loadADDjson/"+'iaa'+"/daily_handle")
              .defer(extraGraphParam,
                  w_dater,
                  h_dater,
                  ["#8297a8","#9fc2c4","#facdae","#fc9d9b","#f3565d"], //stackBarColor
                  "#535050", //titleSlideColor
                  "Title",
                  "chooseDate",
                  game_nameIN,
                  "DATES",
                  "TOTAL_HANDLE_USD",
                  "empty")
              .await(timeSeriesWithSlide)
}


function timeSeriesWithSlide(error,data,extraParam){
  console.log(data)
  color1 = extraParam.color[0]
  color2 = extraParam.color[1]
  color1 = '#1c99e9'
  color1 = '#0b4970'
  color2 = '#E88C0C'
  data.forEach(function(d) {
    d.date = new Date(d[extraParam.xKey]*1000);
    d.y = d[extraParam.yKey]
  });
  data.sort(function(a,b){return a.date-b.date})

  date_begin = data[0].date
  date_end = data[data.length-1].date

  h_total = extraParam.height
  w_total = extraParam.width
  h_selector =

  fontsize = Math.min(w_total,h_total) * 0.02
  fontsize = w_total * 0.02

  var margin = { top: h_total*0.1, right: 1.3*w_total/10, bottom: h_total*0.25, left: w_total/10 },
      margin2 = { top: h_total*0.82, right: w_total/10, bottom: h_total*0.12, left: w_total/10 },
      margin3 = { top: h_total*0.94, right: w_total/10, bottom: h_total*0., left: w_total/10 },
      width = extraParam.width - margin.left - margin.right,
      height = h_total - margin.top - margin.bottom,
      height2 = h_total - margin2.top - margin2.bottom;
      height3 = h_total - margin3.top - margin3.bottom;

  var parseDate = d3.time.format("%b %Y").parse;

  var x = d3.time.scale().range([0, width]),
      x2 = d3.time.scale().range([0, width]),
      x3 = d3.time.scale().range([0, width]),
      y = d3.scale.linear().range([height, 0]),
      y2 = d3.scale.linear().range([height2, 0]);
      y3 = d3.scale.linear().range([height3, 0]);



  var xAxis = d3.svg.axis().scale(x).orient("bottom"),
      xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
      xAxis3 = d3.svg.axis().scale(x3).orient("bottom"),
      yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format('.2s'));

  var brushP = d3.svg.brush()
      .x(x2)
      .extent([date_begin,date_end])
      .on("brush", brushedPlaydates)

  var brushI = d3.svg.brush()
      .x(x2)
      .extent([date_begin,date_end])
      .on("brush", brushedInstall)
      // .on("brush", brush1)
  // brushI.extent(date_begin,date_end)


  var area = d3.svg.area()
      .interpolate("basis")
      .x(function (d) { return x(d.date); })
      .y0(height)
      .y1(function (d) { return y(d.y); });

  var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d){ return x(d.date);})
        .y(function(d){ return y(d.y);});


  var area2 = d3.svg.area()
      .interpolate("monotone")
      .x(function (d) { return x2(d.date); })
      .y0(height2)
      .y1(function (d) { return 1; });

  var area3 = d3.svg.area()
      .interpolate("monotone")
      .x(function (d) { return x2(d.date); })
      .y0(height2)
      .y1(function (d) { return 1; });


        // .reveal([data[7].date,data[11].date])

  // make some buttons to drive our zoom
  // d3.select("#chooseDate_button").append("div")
  //   .attr("id","btnDiv")
  //   .style('font-size','75%')
  //   .style("width","100%")
  //   .style("position","relative")
  //   .style("left","5%")
  //   .style("top","200px")

  //   d3.select("#chooseDate_button").append("div")
  //   .attr("id","increment")
  //   .style('font-size','75%')
  //   .style("width","100%")
  //   .style("position","relative")
  //   .style("left","5%")
  //   .style("top","300px")

  // d3.select("#chooseDate_button").append("div")
  //   .attr("id","fieldDate")
  //   .style('font-size','75%')
  //   .style("width","100%")
  //   .style("position","relative")
  //   .style("left","5%")
  //   .style("top","600px")





  // d3.select("#fieldDate")[0][0].innerHTML = [
  //   '<span id="date_start_installdates"></span>',
  //   '<span id="date_end_installdates"></span>',
  //   '<br>',
  //   '<span id="date_start_playdates"></span>',
  //   '<span id="date_end_playdates"></span>'
  //   ].join('\n')




  // var btns = d3.select("#btnDiv").selectAll("button").data(["lifetime", 2002, 2003, 2004])
  // var btns2 = d3.select("#increment").selectAll("button").data(["lifetime", 2002, 2003, 2004])
  // btns = btns.enter().append("button").style("display","inline-block")
  // bts2 = btns2.enter().append("button").style("display","inline-block")

  // fill the buttons with the year from the data assigned to them
  // btns.each(function (d) {
  //   this.innerText = d;
  // })

  // btns.on("click", drawBrush);

  // function drawBrush() {
  //   // our year will this.innerText
  //   console.log(this.innerText)
  //   // define our brush extent to be begin and end of the year
  //   brush.extent([new Date(this.innerText + '-01-01'), new Date(this.innerText + '-12-31')])

  //   // now draw the brush to match our extent
  //   // use transition to slow it down so we can see what is happening
  //   // remove transition so just d3.select(".brush") to just draw
  //   brush(d3.select(".brush").transition());

  //   // now fire the brushstart, brushmove, and brushend events
  //   // remove transition so just d3.select(".brush") to just draw
  //   brush.event(d3.select(".brush").transition().delay(1000))
  // }

  $("#"+extraParam.htmlID).empty()
  var svg = d3.select("#"+extraParam.htmlID).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  var headerGraph = svg.append("g")
      .attr("id","buttonsDates")

  butWidth = extraParam.width/10
  butHeight = extraParam.height/20

  var makeSortButton = function(extent, rev,pos, textIN) {
    A = svg.append('g')
          .attr("transform", "translate("+(pos * (butWidth + butWidth*0.4)) +"," + 0+ ")")
          .on('click', function() {
          console.log('click on button date good')
        })
    A.append('svg:rect')
        .attr("rx", butWidth/10)
        .attr("ry", butHeight/10)
        .attr("width", butWidth)
        .attr("height", butHeight)
        .style("fill", function(d) { return extraParam.color[0] })
        .style("opacity",0.7)

    A.append("svg:text")
        .attr("x", butWidth / 2)
        .attr("y", butHeight / 2)
        .text(textIN)
        .style("font",fontsize+"px "+fontName)
        .style("font-weight", "light")
        .style("fill",extraParam.titleColor)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
  };

  // makeSortButton('i', 1, 1,'daily')
  // makeSortButton('high', -1, 2,'weekly')

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  var focus = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




  // focus.append("path")
  //       .attr("class","area")
  //       .attr("id","area_playdates")
  //       .style({
  //           "fill": "#ccc",
  //           "opacity": 0.5,
  //       })

  // focus.append("path")
  //       .attr("class","area")
  //       .attr("id","area_installdates")
  //       .style({
  //           "fill": "#CC6699",
  //           "opacity": 0.5,
  //       })
  var mask = new SVGMask(focus)
        .x(x)
        .y(y)
        .style({
          "fill": color1,
          "opacity": 0.5
        })

  var maskInstall = new SVGMask(focus)
        .x(x)
        .y(y)
        .style({
          "fill": color2,
          "opacity": 0.5
        })
    focus.append("path")
        .attr("class","line")
        .style({
            "fill": "none",
            "stroke": "#000",
            "stroke-width": "2"
        })

   // svg.selectAll(".focus").on("click", function(){
   //        console.log(this)
   //          // d3.select(this).attr('r', 25)
   //          //     .style("fill","lightcoral")
   //          //     .style("stroke","red");
   //      });


  var context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  var contextInstall = svg.append("g")
      .attr("class", "contextInstall")
      .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

  // d3.csv("./static/sp500.csv", type, function (error, data) {
    x.domain(d3.extent(data.map(function (d) { return d.date; })));
    y.domain([0, d3.max(data.map(function (d) { return d.y; }))]);
    x2.domain(x.domain());
    y2.domain(y.domain());
    x3.domain(x.domain());

    focus.select(".line")
        .datum(data)
        .attr("d",line);
        // .datum(data)
        // .attr("class", "area")
        // .attr("d", area);

    focus.select(".area")
        .datum(data)
        .attr("d",area);

  // mask.reveal([data[7].date,data[11].date])

    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("font", fontsize/1.5+"px "+fontName)
        .style("font-weight","bolder")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .style("font", fontsize+"px "+fontName)
        .style("font-weight","bolder")
        .call(yAxis);



    context.append("path")
        .datum(data)
        .attr("class", "area")
        .style('fill',color1)
        .attr("d", area2);

    // context.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height2 + ")")
    //     .call(xAxis2);

    context.append("g")
        .attr("class", "x brush")
        .attr("id", "playdates")
        .call(brushP)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);
    context.append("g")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+width/2+"," + height2/1.5 + ")")
      .style("font", fontsize+"px "+fontName)
      .style("font-weight","bolder")
      .append("text")
      .style('fill','#b3d4fc')
      .style("pointer-events",'None')
      .text("PLAY DATES")

    context.append("g")
        .attr("id",'date_start_'+"playdates")
        .attr("text-anchor", "end")
        .style("font", fontsize+"px "+fontName)
        .style("font-weight","bolder")
        .append("text")
        .text("")
    context.append("g")
        .attr("id",'date_end_'+"playdates")
        .attr("text-anchor", "start")
        .style("font", fontsize+"px "+fontName)
        .style("font-weight","bolder")
        .append("text")
        .text("")

// ====================================================================
// ====================================================================
// ===============       COMMENT / UNCOMMENT   ========================
// ===============        INSTALL DATE BAR     ========================
// ====================================================================
// ====================================================================
    // contextInstall.append("path")
    //     .datum(data)
    //     .attr("class", "area")
    //     .style('fill',color2)
    //     .attr("d", area3);

    // contextInstall.append("g")
    //     .attr("class", "x brush")
    //     .attr("id", "installdates")
    //     .call(brushI)
    //   .selectAll("rect")
    //     .attr("y", -6)
    //     .attr("height", height3 + 7);
    // contextInstall.append("g")
    //   .attr("text-anchor", "middle")
    //   .attr("transform", "translate("+width/2+"," + height3/1.5 + ")")
    //   .style("font", fontsize+"px "+fontName)
    //   .style("font-weight","bolder")
    //   .append("text")
    //   .style('fill','#b3d4fc')
    //   .text("INSTALL DATES")

    // contextInstall.append("g")
    //     .attr("id",'date_start_'+"installdates")
    //     .attr("text-anchor", "end")
    //     .style("font", fontsize+"px "+fontName)
    //     .style("font-weight","bolder")
    //     .append("text")
    //     .text("")
    // contextInstall.append("g")
    //     .attr("id",'date_end_'+"installdates")
    //     .attr("text-anchor", "start")
    //     .style("font", fontsize+"px "+fontName)
    //     .style("font-weight","bolder")
    //     .append("text")
    //     .text("")
  // brushedInstall()
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
  brushedPlaydates()

  // mask.reveal_inner([date_begin,date_end])
  // maskInstall.reveal_inner([date_begin,date_end])
  // $('#date_start_installdates'+"").attr("transform", "translate("+x2(date_begin)+"," + 0+ ")")
  // $('#date_start_installdates'+" text").text(formatDisplayDate(date_begin));
  // $('#end_start_installdates'+"").attr("transform", "translate("+x2(date_end)+"," + 0+ ")")
  // $('#end_start_installdates'+" text").text(formatDisplayDate(date_end));
  // $('#date_start_playdates'+"").attr("transform", "translate("+x2(date_begin)+"," + 0+ ")")
  // $('#date_start_playdates'+" text").text(formatDisplayDate(date_begin));
  // $('#end_start_playdates'+"").attr("transform", "translate("+x2(date_end)+"," + 0+ ")")
  // $('#end_start_playdates'+" text").text(formatDisplayDate(date_end));
  // });
  function formatDisplayDate(dateIN){
    return dateIN.getFullYear()+"-"+castInt(dateIN.getMonth()+1)+"-"+castInt(dateIN.getDate())
  }

  function brushed(myId) {
    if(this.id=="playdates"){
      extent0 = brush.empty() ? x2.domain() : brush.extent()
    }
    else{
      extent0 = brush.empty() ? x3.domain() : brush.extent()
    }
    // extent0 = brush.extent()
    extent1 = extent0.map(d3.time.year.round);
    $('#date_start_'+this.id).text(formatDisplayDate(extent1[0]));
    $('#date_end_'+this.id).text(formatDisplayDate(extent1[1]));
    $('#date_start_'+this.id+'_main').text(formatDisplayDate(extent1[0]));
    $('#date_end_'+this.id+'_main').text(formatDisplayDate(extent1[1]));
    console.log($('#date_end_'+this.id+'_main'))
    // x.domain(brush.empty() ? x2.domain() : extent1);
    // focus.select(".area").attr("d", area);
    // focus.select(".x.axis").call(xAxis);

    d3.select(this).transition()
      .call(brush.extent(extent1))
    typed="e"
    mask.reveal(extent1, typed);
      // .call(brush.event);
  }

  function brushedInstall() {
    // brushed(this.id)
    currentEl = $("#installdates")[0]

    extent0 = brushI.empty() ? x3.domain() : brushI.extent()

    // extent0 = brush.extent()
    // extent1 = extent0.map(d3.time.day.round);
    extent1 = extent0
    $('#date_start_'+currentEl.id+"").attr("transform", "translate("+x2(extent1[0])+"," + 0+ ")")
    $('#date_start_'+currentEl.id+" text").text(formatDisplayDate(extent1[0]));
    $('#date_start_'+currentEl.id).attr('value',formatDisplayDate(extent1[0]));
    $('#date_end_'+currentEl.id+"").attr("transform", "translate("+x2(extent1[1])+"," + 0+ ")")
    $('#date_end_'+currentEl.id+" text").text(formatDisplayDate(extent1[1]));
    $('#date_end_'+currentEl.id).attr('value',formatDisplayDate(extent1[1]));
    // x.domain(brush.empty() ? x2.domain() : extent1);
    // focus.select(".area").attr("d", area);
    // focus.select(".x.axis").call(xAxis);

    d3.select(currentEl)
      // .transition()
      .call(brushI.extent(extent1))
    typed="e"
    maskInstall.reveal_inner(extent1);
      // .call(brush.event);
  }

  function brushedPlaydates() {

    // brushed(this.id)

    currentEl = $("#playdates")[0]
    extent0 = brushP.empty() ? x2.domain() : brushP.extent()
    // extent1 = extent0.map(d3.time.day.round);
    extent1 = extent0
    $('#date_start_'+currentEl.id+"").attr("transform", "translate("+x2(extent1[0])+"," + 0+ ")")
    $('#date_start_'+currentEl.id+" text").text(formatDisplayDate(extent1[0]));
    $('#date_start_'+currentEl.id).attr('value',formatDisplayDate(extent1[0]));
    $('#date_end_'+currentEl.id+"").attr("transform", "translate("+x2(extent1[1])+"," + 0+ ")")
    $('#date_end_'+currentEl.id+" text").text(formatDisplayDate(extent1[1]));
    $('#date_end_'+currentEl.id).attr('value',formatDisplayDate(extent1[1]));
    $('#date_start_'+currentEl.id+'_main').text(formatDisplayDate(extent1[0]));
    $('#date_start_'+currentEl.id+'_main').attr('value',formatDisplayDate(extent1[0]));
    $('#date_end_'+currentEl.id+'_main').text(formatDisplayDate(extent1[1]));
    $('#date_end_'+currentEl.id+'_main').attr('value',formatDisplayDate(extent1[1]));
    // x.domain(brush.empty() ? x2.domain() : extent1);
    // focus.select(".area").attr("d", area);
    // focus.select(".x.axis").call(xAxis);

    d3.select(currentEl)
      .call(brushP.extent(extent1))
    typed="e"
    mask.reveal_inner(extent1);
      // .call(brush.event);
  }

  function type(d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
    return d;
  }
}
