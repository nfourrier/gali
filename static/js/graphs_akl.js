function floor_decimal(numb){
    var output = [numb.toFixed(0), (100*(numb%1)).toFixed(0)]
    return output
}

function makeADDtimeSeries(error, data1){



    var addF = function(p, d){return p + d.DAU;},
        remF = function(p, d){return p - d.DAU;},
        ini = function(){ return 0;}
    data1.forEach(function(d) {
        d["date"] = new Date(d["date"]*1000-12*3600*1000);
    });
    var ndx = crossfilter(data1);
    var dim = {};
    dimIN = ndx.dimension(function(d) { return [d["date"], "DAU"]; });
    dimLimit = ndx.dimension(function(d) { return d["date"]; });
    var minDate = dimLimit.bottom(1)[0]["date"];

    var maxDate = dimLimit.top(1)[0]["date"];
    var xDomain = [minDate, maxDate]


    groupIN = dimIN.group().reduce(addF, remF, ini)
    var colMain = $(".policeMain").css("color")
    widthIN = 800
    heightIN = 300

    var timeSeries = dc.seriesChart("#lifetimeDAU_akl","gen_lifetimeDAU_akl");
    timeSeries
        .width(widthIN)
        .height(heightIN)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dimIN)
        .group(groupIN)
        .seriesAccessor(function(d) {return d.key[1]; })
        .keyAccessor(function(d) {return d.key[0];})
        .mouseZoomable(true)
        .legend(dc.legend().x(0.9*widthIN).y(0.2*heightIN).itemHeight(13).gap(5))
        .transitionDuration(500)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .ordinalColors([colMain])
        // .renderlet(function(chart){
        //             chart.selectAll('circle').each(function(d){
        //                  d3.select(this).attr("style", "stroke-dasharray", ("10,1"));
        //             });
        //         })
        .x(d3.time.scale().domain(xDomain))
        .renderTitle(true)
        //.xAxis().tickFormat(d3.time.format("%H")
        .elasticY(true)
        //.xAxisLabel("Hours")
        .yAxis().ticks(4);
    dc.renderAll("gen_lifetimeDAU_akl")
}

function makeRetentiongraphs(error, data1) {
    data1.forEach(function(d) {
        d["Install Date"] = new Date(d["Install Date"]*1000-12*3600*1000+24*3600*1000);
    });

    var data2  = []
    for(var idx=0;idx<=100;idx++){
        data2[idx] = {"x":idx, "y":1, 'z':10}
    }

    var scaleNdx = crossfilter(data2);
        scaleDim = scaleNdx.dimension(function(d) { return [+d["y"], +d["x"]]; }),
        scaleGroup = scaleDim.group().reduceSum(function(d) { return +d["y"]; });
    data2[0] = {"value":0, "x":1}

    var ndx    = crossfilter(data1),
      retDim = ndx.dimension(function(d) { return [+d["Retention"], +d["Install Date"]]; }),
      retGroup = retDim.group().reduceSum(function(d) { return +d["Value"]; });

    var sum = data1.reduce(function(input, value){
                if(value["Retention"]==7){
                    return [input[0] + value["Value"], input[1]+1];
                    }
                else{
                    return input;
                }
            }, [0,0]);

    var avg = sum[0] / sum[1];
    avg = floor_decimal(avg)
    $('#targetTextRetention').empty()
    $('#targetTextRetention').append("<h3>Day-7 Retention average</h3><h4 align=center>"+avg[0]+"<span>."+avg[1]+"%</span></h4> ");

    var chart = dc.heatMap("#retention_akl","gen_retention_akl");
    var scaleChart = dc.heatMap("#retention_scale_akl","gen_retention_akl");

    scaleChart
        .width(850)
        .height(80)
        .margins({top: 10, right: 50, bottom: 30, left: 80})
        .dimension(scaleDim)
        .group(scaleGroup)
        .keyAccessor(function(d) { return +d.key[1]; })
        .valueAccessor(function(d) {
                return d.key[0]; })
        .colors(d3.scale.linear()
            //.domain([100,70,50,40,30,20,10,5,0])
            .domain([0,5,10,15,20,25,30,40,100])
            //.range(["#ffffd9","#def8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]))
            .range(["#07203D","#213B59","#4F6A89","#7C98B8","#A9C7E8","#7C98B8","#4F6A89","#213B59","#07203D"]))
        .colsLabel(function(d){
            if(d%5==0){return d;}
        })
        .rowsLabel(function(){return "Scale";})
    scaleChart.xBorderRadius(0);
    scaleChart.yBorderRadius(0);

    chart
        .width(850)
        .height(250)
        .margins({top: 10, right: 50, bottom: 100, left: 80})
        .dimension(retDim)
        .group(retGroup)
        .keyAccessor(function(d) { return +d.key[0]; })
        .valueAccessor(function(d) {
                return d.key[1]; })
        .colorAccessor(function(d) { return +d.value; })
        .colsLabel(function(d){
            if([1, 7, 14, 21, 30].indexOf(d)>-1){
          return "day-"+d.toString();}//d.key[0].toString()+"days";
        })
        .rowsLabel(function(d) {
            var ladate = new Date(d)
            if(ladate.getDate()%4==0){
          return date2string(ladate);}
        })
        .transitionDuration(10)
        .title(function(d) {
            return "Number of days:   " + d.key[0] + "\n" +
                   "Install Date:  " + date2string(new Date(d.key[1])) + "\n" +
                   "Number of Users: " + (d.value);})
        .colors(d3.scale.linear()
            //.domain([100,70,50,40,30,20,10,5,0])
            .domain([0,5,10,15,20,25,30,40,100])
            .range(["#07203D","#213B59","#4F6A89","#7C98B8","#A9C7E8","#7C98B8","#4F6A89","#213B59","#07203D"]))
    chart.xBorderRadius(50);
    chart.yBorderRadius(0);
    dc.renderAll("gen_retention_akl");

}


function date2string(dateIN){
    var month_ = castInt(dateIN.getMonth()+1)
    var date_ = castInt(dateIN.getDate())
    return dateIN.getFullYear().toString()+"/"+month_+"/"+date_
}

function seriesTodayVsYesterday(widthIN, heightIN, xDomain, id_html, group_dc, dimIN, groupIN){
    var lineChart = dc.seriesChart(id_html,group_dc);
    var colMain = $(".policeMain").css("color")
    var colSub = $(".policeSub").css("color")
    lineChart
        .width(widthIN)
        .height(heightIN)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dimIN)
        .group(groupIN)
        .seriesAccessor(function(d) {return d.key[1]; })
        .keyAccessor(function(d) {return d.key[0];})
        .mouseZoomable(true)
        .legend(dc.legend().x(400).y(50).itemHeight(13).gap(5))
        .transitionDuration(500)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .ordinalColors([colMain, colSub])
        // .renderlet(function(chart){
        //             chart.selectAll('circle').each(function(d){
        //                  d3.select(this).attr("style", "stroke-dasharray", ("10,1"));
        //             });
        //         })
        .x(d3.time.scale().domain(xDomain))
        //.xAxis().tickFormat(d3.time.format("%H")
        .elasticY(true)
        //.xAxisLabel("Hours")
        .yAxis().ticks(4);
    return lineChart
}

function cumulativeNumbers(ndxIN, id_html, group_dc, pd_column, select_column, select_value){
    var groupNDX = ndxIN.groupAll().reduceSum(function(d) {
            if(d[select_column]==select_value){
                return d[pd_column];
            }
            else{
                return 0;
            }
        });
    var fieldID = dc.numberDisplay(id_html,group_dc);
    fieldID
        .valueAccessor(function(d){return d; })
        .group(groupNDX)
        .formatNumber(d3.format(".4s"));
    return fieldID
}

function makeAKLgraphs(error, yesterdayJson, todayJson) {

    dateLimit = getFakeToday()
    timeLimit = dateLimit.getHours()*100+dateLimit.getMinutes();
    $('#timeLeft').empty()
    globVar = dateLimit;
    if(dateLimit.getMinutes()==0){
        $('#timeLeft').append(24-dateLimit.getHours()+':'+"00")
    }
    else{
        $('#timeLeft').append(24-dateLimit.getHours()-1+':'+castInt(60-dateLimit.getMinutes()))
    }
    console.log(24-dateLimit.getHours()-1,60-dateLimit.getMinutes())

    var addDAU = function(p, d){return p + d.AU;},
        remDAU = function(p, d){return p - d.AU;},
        reduceREV = function (p,v) {return v.AU;},
        reduceREV = function (p, v) { return v.AU; },
        addEuros = function(p, d){ return p + d["N_transactions HC"];},
        remEuros = function(p, d){ return p - d["N_transactions HC"];},
        ini = function(){ return 0;}

    var oldData = yesterdayJson;
    var newData = todayJson;
    var tmpData = {}
    var tmpPos = 0
    var timezoneOffset = new Date(yesterdayJson[0].date*1000)
    timezoneOffset = timezoneOffset.getTimezoneOffset()*60*1000
    yesterdayJson.forEach(function(d) {
        d["date"] = new Date(d["date"]*1000+timezoneOffset+24*3600*1000);
        d["field"] = "yesterday"
    });
    todayJson.forEach(function(d,v) {
        d["date"] = new Date(d["date"]*1000+timezoneOffset);
        d["field"] = "today"
        // console.log(v)

        //console.log(d["date"].getHours())
    });


    for(var idx=todayJson.length-1;idx>-1;idx--){
        var thisDate = todayJson[idx]["date"]
        // console.log(thisDate)
        // console.log(thisDate.getHours()*100+thisDate.getMinutes())
        if(thisDate.getHours()*100+thisDate.getMinutes()>timeLimit){
                console.log(3)
                //console.log(thisDate.getHours()*100+thisDate.getMinutes())
                todayJson.splice(idx,1)
        }
        //else{console.log(6)}
    }
    console.log(timeLimit)
    console.log(todayJson.length)
    console.log(todayJson)

        var sum = todayJson.reduce(function(input, value){
                return [input[0] + value["AU"], input[1]+1];
        }, [0,0]);

    avg = floor_decimal(sum[0])

    $('#targetText2').empty()
    $('#targetText2').append('<span class="data">'+avg[0]+'</span>');




    allData = yesterdayJson.concat(todayJson)



    console.log(allData)
    var ndx = crossfilter(allData);
    var dim = {};
    dim.date = ndx.dimension(function(d) { return [d["date"],d["field"]]; });
    dim.date2 = ndx.dimension(function(d) { return d["date"]; });

    var groups = {}
    groups["dau"] = dim.date.group().reduce(addDAU, remDAU, ini)


    var minDateTmp = dim.date2.bottom(1)[0]["date"];
    var minDate = new Date(minDateTmp.getFullYear(), minDateTmp.getMonth(), minDateTmp.getDate());
    var maxDate = new Date(minDateTmp.getFullYear(), minDateTmp.getMonth(), minDateTmp.getDate()+1);
    var xDomain = [minDate, maxDate]

    seriesTodayVsYesterday(
        $("div#gph_dashMain.graph").width(),
        $("div#gph_dashMain.graph").height(),
        xDomain,
        "#line-chart_akl",
        "gen_chart_akl",
        dim.date,
        groups["dau"])


    var dataCircle = [
      {index: 0.8, text: "main",  value: 34, maximum: 60, color:'#E1499A'},
      {index: 0.7, text: "reference",  value: 50, maximum: 60, color:'#47e495'},
    ];
    var innerCircleText = d3.format('.0%')(7);
    // makeProgressCircle("#revenueToday_akl",100,100, 0.09,dataCircle,innerCircleText,99.35548)

    cumulativeNumbers(ndx,
            "#revenueToday_akl",
            "gen_chart_akl",
            "Revenue",
            "field",
            "today")
    cumulativeNumbers(ndx,
            "#revenueYesterday_akl",
            "gen_chart_akl",
            "Revenue",
            "field",
            "yesterday")
    cumulativeNumbers(ndx,
            "#installToday_akl",
            "gen_chart_akl",
            "N_installs",
            "field",
            "today")
    cumulativeNumbers(ndx,
            "#installYesterday_akl",
            "gen_chart_akl",
            "N_installs",
            "field",
            "yesterday")
    cumulativeNumbers(ndx,
            "#pauToday_akl",
            "gen_chart_akl",
            "PAU",
            "field",
            "today")
    cumulativeNumbers(ndx,
            "#pauYesterday_akl",
            "gen_chart_akl",
            "PAU",
            "field",
            "yesterday")
    cumulativeNumbers(ndx,
            "#dauToday_akl",
            "gen_chart_akl",
            "AU",
            "field",
            "today")
    cumulativeNumbers(ndx,
            "#dauYesterday_akl",
            "gen_chart_akl",
            "AU",
            "field",
            "yesterday")



    dc.renderAll("gen_chart_akl");
};


function makeGraphs(error, projectsJson, statesJson) {

    //Clean projectsJson data
    console.log(error)
    console.log(statesJson)
    console.log(error)
    var donorschooseProjects = projectsJson;
    console.log("makeGraphs data")
    console.log(donorschooseProjects)
    console.log("makeGraphs data- end")
    var dateFormat = d3.time.format("%Y-%m-%d");
    //console.log(projectsJson);
    console.log("makeGraphs date")
    console.log(donorschooseProjects[0].date)
    donorschooseProjects.forEach(function(d) {
        // d["date_posted"] = "2015-08-05";
        d["date"] = new Date(d["date"]*1000-12*3600*1000);
        //d["date_posted"].setDate(1);
        //d["total_donations"] = +d["total_donations"];
    });
    console.log(donorschooseProjects);
    //Create a Crossfilter instance
    var ndx = crossfilter(donorschooseProjects);
    console.log(ndx);
    var dim = {};
    //Define Dimensions
    dim.au = ndx.dimension(function(d) { return d["AU"]; });
    dim.dau = ndx.dimension(function(d) { return d["DAU"]; });
    dim.dau2 = ndx.dimension(function(d) { return d["DAU"]+(-200)^2; });
    dim.hc_spent = ndx.dimension(function(d) { return d["Hard Currency Spent"]; });
    dim.date = ndx.dimension(function(d) { return d["date"]; });
    dim.revenue = ndx.dimension(function(d) { return d["Revenue"]; });



    //Calculate metrics
    var groups = {}
    groups["au"] = dim["au"].group();
    groups["dau"] = dim.date.group().reduce(function reduceAddd(p,v) {return v.DAU;},
                                            function reduceRemove(p, v) { return v.DAU; },
                                            function reduceInitial() { return 0; });
    groups["dau2"] = dim.date.group().reduce(function reduceAddd(p,v) {return v.DAU+1000;},
                                            function reduceRemove(p, v) { return v.DAU; },
                                            function reduceInitial() { return 0; });
    groups["hc_spent"] = dim["hc_spent"].group();
    groups["date"] = dim["date"].group();

    var all = ndx.groupAll();
    var totalRevenue = ndx.groupAll().reduceSum(function(d) {return d["Revenue"];});
    // var all = ndx.groupAll();
    // var totalDonations = ndx.groupAll().reduceSum(function(d) {return d["total_donations"];});

    // var max_state = totalDonationsByState.top(1)[0].value;

    //Define values (to be used in charts)
    var minDateTmp = dim.date.bottom(1)[0]["date"];
    var minDate = new Date(minDateTmp.getFullYear(), minDateTmp.getMonth(), minDateTmp.getDate());
    var maxDate = new Date(minDateTmp.getFullYear(), minDateTmp.getMonth(), minDateTmp.getDate()+1);
    console.log(minDate)
    console.log(maxDate)
    //Charts
    var timeChart = dc.barChart("#time-chart","annex_chart");
    var lineChart = dc.lineChart("#line-chart","annex_chart");
    var totalDonationsND = dc.numberDisplay("#total-donations-nd","annex_chart");

    console.log("group makeGraphs")
    console.log(groups)
    console.log(groups.dau.top(10))

    timeChart
        .width(600)
        .height(160)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim.date)
        .group(groups["dau2"])
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        //.xAxis().tickFormat(d3.time.format("%H")
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxis().ticks(4);

    lineChart
        .width(600)
        .height(160)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim.date)
        .group(groups["dau2"])
        .stack(groups["dau"])
        .renderArea(true)
        .transitionDuration(500)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .x(d3.time.scale().domain([minDate, maxDate]))
        //.xAxis().tickFormat(d3.time.format("%H")
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxis().ticks(4);

    dc.lineChart("#test1","annex_chart")
        .width(600)
        .height(160)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim.date)
        .group(groups["dau2"])
        .transitionDuration(500)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .x(d3.time.scale().domain([minDate, maxDate]))
        //.xAxis().tickFormat(d3.time.format("%H")
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxis().ticks(4);

    // dc.compositeChart("#test1", "grp1")
    //     .width(600)
    //     .height(160)
    //     .margins({top: 10, right: 50, bottom: 30, left: 50})
    //     .dimension(dim.date)
    //     .group(groups["dau"])
    //     .transitionDuration(500)
    //     .x(d3.time.scale().domain([minDate, maxDate]))
    //     //.xAxis().tickFormat(d3.time.format("%H")
    //     .elasticY(true)
    //     .xAxisLabel("Year")
    //     .yAxis().ticks(4);

    totalDonationsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){console.log(d);return d; })
        .group(totalRevenue)
        .formatNumber(d3.format(".3s"));


    dc.renderAll("annex_chart");

};

$(".dropdown dt a").on('click', function () {
          $(".dropdown dd ul").slideToggle('fast');
      });

      $(".dropdown dd ul li a").on('click', function () {
          $(".dropdown dd ul").hide();
      });

      function getSelectedValue(id) {
           return $("#" + id).find("dt a span.value").html();
      }

      $(document).bind('click', function (e) {
          var $clicked = $(e.target);
          if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
      });


      $('.mutliSelect input[type="checkbox"]').on('click', function () {

          var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
              title = $(this).val() + ",";

          if ($(this).is(':checked')) {
              var html = '<span title="' + title + '">' + title + '</span>';
              $('.multiSel').append(html);
              $(".hida").hide();
          }
          else {
              $('span[title="' + title + '"]').remove();
              var ret = $(".hida");
              $('.dropdown dt a').append(ret);

          }
      });



function castInt(valueIN){
    var str = "" + valueIN
    var pad = "00"
    return pad.substring(0, pad.length - str.length) + str
}

function getFlaskRoute(gameIN,dateIN){
    var month_ = castInt(dateIN.getMonth()+1)
    var date_ = castInt(dateIN.getDate())
    return"/loadJson/"+gameIN+"/"+dateIN.getFullYear().toString()+"/"+month_+"/"+date_
}

function getFakeToday(delay_additional){
    if(!delay_additional){delay_additional = 0;}
    var delay_utc = 12*3600;
    var delay_gmmdb = 3*3600;
    var delay_studio = 3*3600;
    var now = new Date().getTime();
    return new Date(now-(delay_utc+delay_gmmdb+delay_studio+delay_additional)*1000);
}



function generateADDdata(gameIN, dataTypeIN){
    console.log("generate ADD data "+dataTypeIN)
    $.ajax({
        type: "GET",
        //url: $SCRIPT_ROOT + "/ajx-generate-checkbox",
        url: $SCRIPT_ROOT + '/callADDdata/'+gameIN+'/'+dataTypeIN,
        contentType: "application/json; charset=utf-8",
        success: function(data){
            console.log("SUCCESS: "+dataTypeIN+" written to JSON file for "+game_name)
        },
        fail: function(data){
            console.log(data)
        },
    });
        //setTimeout(generateADDdata(gameIN, dataTypeIN), 1000*3600*22);
}





$("document").ready(function(){
    // var game_name = "iaa"
    // var game_fullname = "Ice Age Adventure"
    // $('#gameTitle').append(game_fullname);


    var delay_utc = 12*3600;
    var delay_gmmdb = 3*3600;
    var delay_studio = 3*3600;

    var now = new Date().getTime();
    todayDate = getFakeToday()
    yesterdayDate = getFakeToday(24*3600);

    // datad3 = d3.json("/loadJson/iaa/2015/09/07", function(error, json) {
    //   if (error) return console.warn(error);
    //   data22 = json;
    //   console.log(data22)
    //   return data22
    // });

    var globVar;

    function testtt(bla){return bla;}
    // function masterTime(){
    //     console.log("in masterTIme",yesterdayDate,todayDate)
    //     queue()
    //         .defer(d3.json, getFlaskRoute(game_name,yesterdayDate))
    //         .defer(d3.json, getFlaskRoute(game_name,todayDate))
    //         .await(makeAKLgraphs)
    //     //makeAKLgraphs("ok",jsonData1,jsonData2)
    //     //setTimeout(masterTime,10000);
    // }
    // masterTime()
    queue()
            .defer(d3.json, "/loadADDjson/iaa/retention")
            .await(makeRetentiongraphs)
    queue()
            .defer(d3.json, "/loadADDjson/iaa/lifetimeDAU")
            .await(makeADDtimeSeries)


    $("#result").load("/tmpLifetime")
    $("#nav-zoom").hide()


    // setTimeout(masterTime,10000);




    // queue()
    //     .defer(d3.json, "/donorschoose/projects")
    //     .defer(d3.json, "static/geojson/us-states.json")
    //     .await(makeGraphs);
    // function loadDataFromJSON(){
    //     $.ajax({
    //         type: "GET",
    //         //url: $SCRIPT_ROOT + "/ajx-generate-checkbox",
    //         url: $SCRIPT_ROOT + "/donorschoose/projects",
    //         contentType: "application/json; charset=utf-8",
    //         success: function(data){
    //             //console.log(data)
    //         }
    //     });
    // };
    // function testt(){
    //     console.log("coucou")
    //     setTimeout(testt, 100000);
    // }

        //dc.renderAll();
        //setTimeout(masterTime(),10000000);
        //setInterval(masterTime(),100000);



    // var loadtoday=$.getJSON("/loadJson/iaa/2015/09/07")
    //     .success(function(jd){
    //         return jd
    //     })
    // console.log(loadtoday)
    // var loadyesterday=$.getJSON("/loadJson/iaa/2015/09/06")
    //     .success(function(jd1,loadtoday){
    //         console.log(jd1)
    //         console.log(loadtoday)
    //     })

    //var loadyesterday=$.getJSON("/loadJson/iaa/2015/09/06", function(jd1){
        //$.getJSON("/loadJson/iaa/2015/09/07", function(jd){
            // makeAKLgraphs("ok",jd1,jd)
            // dc.renderAll();
            //masterTime();

        //})
    //})


        // .always(function() {
        //     console.log( "complete" );
        // });
    var updateInterval = 3600*1000;
    function generateByMinutesData(){
        $.ajax({
            type: "GET",
            //url: $SCRIPT_ROOT + "/ajx-generate-checkbox",
            url: $SCRIPT_ROOT + "/callData/byMinutes/"+"iaa",
            contentType: "application/json; charset=utf-8",
            success: function(data){
                console.log("SUCCESS: minute data"+" written to JSON file for "+game_name)
            },
            error: function(data){
                console.log("error in generateByMinutesData")
            }
        });
        console.log('iaa')
        // setTimeout(generateByMinutesData('iaa'), 3600*1000);
    }
    function generateADDslidesData(){
        typeData = "ggiDAU"
        $.ajax({
            type: "GET",
            //url: $SCRIPT_ROOT + "/ajx-generate-checkbox",
            url: $SCRIPT_ROOT + "/callADDdata/"+"iaa"+"/"+typeData,
            contentType: "application/json; charset=utf-8",
            success: function(data){
                console.log("SUCCESS: typeData"+" written to JSON file for "+game_name)
            },
            error: function(data){
                console.log("error in generateByMinutesData")
            }
        });
        console.log('typeData',typeData)
    }

    function trigger_ADDslidesData(){
        console.log("ADD slides data")
        setTimeout(generateADDslidesData, 3*1000);
    }

    function trigger_MinuteData(){
        console.log("auto execute minute data")
        setTimeout(generateByMinutesData, 13*1000);
        setTimeout(trigger_MinuteData,4000*1000);
    }
    function trigger_dailyData(){
        console.log("auto execute daily data")
        setTimeout(generateADDdata(game_name,"retention"), 50*1000);
        setTimeout(generateADDdata(game_name,"lifetimeDAU"), 100*1000);
        setTimeout(trigger_dailyData,22*3600*1000);
    }
    //trigger_MinuteData();
    //trigger_ADDslidesData()

    // trigger_dailyData();
    //generateADDdata(game_name, "retention")
    //generateADDdata(game_name, "lifetimeDAU")
    //generateByMinutesData(game_name);

    // console.log("graphs_akl begin");
    // console.log(now);
    // console.log("graphs_akl end");
    // console.log($(".graph").width())
    // console.log($("div#gph_dashMain.graph"))
    // console.log($("div#gph_dashMain.graph").width())
    // console.log($(".policeMain"))
    // console.log($(".policeMain").css("color"))
    // $.ajaxSetup({
    //     async: false
    // });
    //  var jsonData1;
    //  $.getJSON("/loadJson/iaa/2015/09/06", function(data){
    //   console.log(data);
    //   jsonData1 = data;
    //   return jsonData1;
    //  });
    // $.ajaxSetup({
    //     async: true
    // });
});
