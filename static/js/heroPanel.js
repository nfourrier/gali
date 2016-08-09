var corruptedData = {}
var d3circle = function(id, width, height, color, colorText, innerF, data, title){
    this.id = id;
    this.width = width;
    this.height = height;
    this.color = color;
    this.colorText = colorText;
    this.innerFormat = innerF;
    this.data = data;
    this.title = title;
    this.maximumRad = data[0].maximum;


    this.radius = Math.min(width, height) / 2.5;
    this.spacing = 0.1;
    this.arc = d3.svg.arc()
      .startAngle(0)
      //
      .innerRadius(function(d) { return d.index * this.radius; })
      //.outerRadius(function(d) { return (d.index + this.spacing) * this.radius; })
      ;
}

d3circle.prototype.getArc = function(d){
    return this.arc;
}

d3circle.prototype.getColor = function(d){
    if(d.text=="main"){d=0;}
    if(d.text=="reference"){d=1;}
    return this.color[d]
}

d3circle.prototype.getSpacing = function(fieldNameIN){
    if(fieldNameIN=="main"){return this.spacing;}
    if(fieldNameIN=="reference"){return this.spacing/2;}
}





// function cumulativeNumbers(ndxIN, id_html, group_dc, pd_column, select_column, select_value){

//     var groupNDX = ndxIN.groupAll().reduceSum(function(d) {
//             if(d[select_column]==select_value){
//                 return d[pd_column];
//             }
//             else{
//                 return 0;
//             }
//         });
//     var fieldID = dc.numberDisplay(id_html,group_dc);
//     fieldID
//         .valueAccessor(function(d){return d; })
//         .group(groupNDX)
//         .formatNumber(d3.format(".4s"));
//     return fieldID
// }


function extraParamCircles(inputCircles, timeIN,callback){
    output = inputCircles
    callback(null,[output,timeIN])
}

function makePanel(error, yesterdayJson, todayJson, objectIN) {
    console.log(todayJson.length)
    // function AjaxCall() {
    //     $.ajax(
    //     {
    //         type: 'POST',
    //         contentType: "application/json; charset=utf-8",
    //         url: 'Home.aspx/Server_HelloWorld',
    //         datatype: 'json',
    //         success: function (result) { console.log(result.d); }
    //     })

    // }
    // console.log(yesterdayJson)
    // console.log(todayJson)
    circlesIN=objectIN[0]
    dateLimit = getFakeToday()
    // console.log(dateLimit)
    // console.log(dateLimit)

    // console.log(24-dateLimit.getHours()-1,60-dateLimit.getMinutes())
    // console.log(dateLimit.getMinutes())

    var addDAU = function(p, d){return p + d.AU;},
        remDAU = function(p, d){return p - d.AU;},
        reduceREV = function (p,v) {return v.AU;},
        reduceREV = function (p, v) { return v.AU; },
        addEuros = function(p, d){ return p + d["N_transactions HC"];},
        remEuros = function(p, d){ return p - d["N_transactions HC"];},
        ini = function(){ return 0;}

    var tmpPos = 0
    var timezoneOffset = new Date(yesterdayJson[0].date*1000)

    timezoneOffset = timezoneOffset.getTimezoneOffset()*60*1000
    yesterdayJson.forEach(function(d) {
        //d["date"] = new Date(d["date"]*1000+timezoneOffset+24*3600*1000);
        tmp_date = new Date(d["date"]*1000+timezoneOffset);
        d["date"] = tmp_date
        d["field"] = "yesterday"
    });
    var maxDate = new Date("December 03, 1987 11:13:00")
    todayJson.forEach(function(d,v) {
        // console.log(d["date"])
        var tmp_date  = new Date(d["date"]*1000+timezoneOffset);
        // console.log(tmp_date,timezoneOffset)
        d["date"] = tmp_date
        d["field"] = "today"
        // console.log(d)
        if(d["date"]>maxDate){maxDate = d["date"];}

    });
    // console.log(todayJson)
    // console.log(maxDate)

    if(objectIN[1]=='daily'){
        timeLimit = dateLimit.getHours()*100+dateLimit.getMinutes();
        var timeLimitRef = timeLimit;
        maxTime = maxDate.getHours()*100+maxDate.getMinutes();
        // console.log(maxTime,timeLimit)
        if(maxTime<timeLimit){
            timeLimit = maxTime;
            dateLimit = maxDate;
        }
    }
    else if(objectIN[1]=='weekly'){
        //1 for saturday, 2 for friday
        shift_weekDay = 2 // 2
        timeLimit = (dateLimit.getDay()+shift_weekDay)%7-1
        console.log(timeLimit)
    }


    // console.log(dateLimit)
    if(objectIN[1]=='daily'){
        $('.timeLeft_'+objectIN[1]).empty()
        $('.todaysDate').empty()
        $('.todaysDate').append(castInt(dateLimit.getDate())+'-'+castInt(dateLimit.getMonth()+1)+'-'+dateLimit.getFullYear())
        globVar = dateLimit;
        if(dateLimit.getMinutes()==0){
            $('.timeLeft_'+objectIN[1]).append(24-dateLimit.getHours()+':'+"00")
        }
        else{
            $('.timeLeft_'+objectIN[1]).append(24-dateLimit.getHours()-1+':'+castInt(60-dateLimit.getMinutes()))
        }
        var getThisTime = function(thisDate){
            return thisDate.getHours()*100+thisDate.getMinutes()
        }
        $('.todaysTime').empty()
        $('.todaysTime').append(castInt(dateLimit.getHours())+':'+castInt(dateLimit.getMinutes()))

    }
    else if(objectIN[1]=='weekly'){
        var getThisTime = function(thisDate){
            return (thisDate.getDay()+shift_weekDay)%7
        }
        $('.timeLeft_'+objectIN[1]).empty()
        $('.timeLeft_'+objectIN[1]).append(6-timeLimit+" days left")
    }

//     for(var idx=todayJson.length-1;idx>-1;idx--){
//         var thisDate = todayJson[idx]["date"]
//         if(thisDate.getHours()*100+thisDate.getMinutes()>timeLimit){
//                 todayJson.splice(idx,1)
// //                yesterdayJson.splice(idx,1)
//         }
//     }





    // $('#targetText2').empty()
    // $('#targetText2').append('<span class="data">'+avg[0]+'</span>');


    // console.log(todayJson.length)
    // console.log("new data date")



    allData = yesterdayJson.concat(todayJson)

    var ndx = crossfilter(allData);

    var addNoTime = function(input,value){
        // console.log(input.dau,value.AU,input.count)
        input.dau += value.AU;
        input.dau2 += value.DAU;
        input.hc_spent += value["Hard Currency spent"];
        input.installs += value.N_installs;
        input.N_launches += value.N_launches;
        input.N_transactions_euros += value["N_transactions Euros"];
        input.N_transactions_HC += value["N_transactions HC"];
        input["N_users who spent HC"] += value["N_users who spent HC"];
        input.pau += value.PAU;
        input.revenue += value.Revenue;
        input["Time spent"] += value["Time spent"];
        input.count += 1;
        return input
    }


    var addIN = function(input, value){
            var thisDate = value.date;
            if(objectIN[1]=='weekly'){
                // console.log(value.date,value["Hard Currency spent"])
                // console.log(value.field,value.date)
                // console.log(timeLimit,getThisTime(thisDate))
                // console.log(value, getThisTime(thisDate),timeLimit)
            }
            if(getThisTime(thisDate)<=timeLimit){
                if(objectIN[1]=='weekly'){
                console.log('----',value.field,value.date,value["Hard Currency spent"])
                // console.log(value, getThisTime(thisDate),timeLimit)
                }

                // if(value.date.getMinutes()==05){
                //     console.log(value.date.getHours(),input.AU)
                // }
                // console.log(thisDate.getHours()*100+thisDate.getMinutes())
                input = addNoTime(input,value);
            }
            // console.log(input)
            return input;
    }
    var initIN = function(){
        var initINvar = {}
        initINvar.dau = 0;
        initINvar.dau2 = 0;
        initINvar.hc_spent = 0;
        initINvar.installs = 0;
        initINvar.N_launches = 0;
        initINvar.N_transactions_euros = 0;
        initINvar.N_transactions_HC = 0;
        initINvar["N_users who spent HC"] = 0;
        initINvar.pau = 0;
        initINvar.revenue = 0;
        initINvar["Time spent"] = 0;
        initINvar.count = 0;
        return initINvar;
    }
    var initValue = initIN();
    var sum={}
    sum[todayJson[0].field] = todayJson.reduce(addIN, initValue);
    var initValue = initIN()
    sum[yesterdayJson[0].field] = yesterdayJson.reduce(addIN, initValue);
    var initValue = initIN()
    sum[yesterdayJson[0].field+"_all"]= yesterdayJson.reduce(addNoTime, initValue);


    console.log(sum)
    if(sum[yesterdayJson[0].field+"_all"].count!=1440){corruptedData["referenceData"]=1}
    if(sum[todayJson[0].field].count!=(Math.floor(timeLimit/100)*60+timeLimit%100+1)){corruptedData["todayData"]=1}
    if(sum[todayJson[0].field].count!=(Math.floor(timeLimitRef/100)*60+timeLimitRef%100+1)){corruptedData["todayData"]=2}

    var dim = {};
    dim.date = ndx.dimension(function(d) { return [d["date"],d["field"]]; });
    dim.date2 = ndx.dimension(function(d) { return d["date"]; });

    var groups = {}
    groups["dau"] = dim.date.group().reduce(addDAU, remDAU, ini)

    var minDateTmp = dim.date2.bottom(1)[0]["date"];
    var minDate = new Date(minDateTmp.getFullYear(), minDateTmp.getMonth(), minDateTmp.getDate());
    var maxDate = new Date(minDateTmp.getFullYear(), minDateTmp.getMonth(), minDateTmp.getDate()+1);
    var xDomain = [minDate, maxDate]




    var todaySum = sum[todayJson[0].field];
    var yesterdaySum = sum[yesterdayJson[0].field];
    var yesterdaySumAll = sum[yesterdayJson[0].field+"_all"];



    // Update panel circles
    for(var fieldNameIN in circlesIN){
    // circlesIN.forEach(function(fieldNameIN){
        var referenceArc = {
            index: 0.7,
            text: "reference",
            value: yesterdaySum[fieldNameIN],
            valueBack: yesterdaySumAll[fieldNameIN],
            maximum: circlesIN[fieldNameIN].maximumRad}

        var mainArc = {
            index: 0.8,
            text: "main",
            value: todaySum[fieldNameIN],
            valueBack: circlesIN[fieldNameIN].maximumRad,
            maximum: circlesIN[fieldNameIN].maximumRad}

        //if(fieldNameIN=="hc_spent"){console.log(todaySum)}
        updateProgressCircle(
            circlesIN[fieldNameIN],
            referenceArc,
            mainArc,
            computeVariation(todaySum[fieldNameIN],yesterdaySum[fieldNameIN]))
    }

    todayJson.length = 0
    yesterdayJson.length = 0
    todaySum.length = 0
    yesterdaySum.length = 0
    yesterdaySumAll.length = 0
    objectIN.length = 0
    todaySum = null;
    yesterdaySum = null;
    yesterdaySumAll = null;
    sum = null;
    allData.length = 0
    ndx = null
    minDate = null
    maxDate = null
    minDateTmp = null
    initValue = null
    groups = null
    circlesIN = null
    mainArc = null
    referenceArc = null
    tmp_date = null




    // cumulativeNumbers(ndx,
    //         "#revenueToday_akl",
    //         "gen_chart_akl",
    //         "Revenue",
    //         "field",
    //         "today")



    // cumulativeNumbers(ndx,
    //         "#revenueYesterday_akl",
    //         "gen_chart_akl",
    //         "Revenue",
    //         "field",
    //         "yesterday")
    // cumulativeNumbers(ndx,
    //         "#installToday_akl",
    //         "gen_chart_akl",
    //         "N_installs",
    //         "field",
    //         "today")
    // cumulativeNumbers(ndx,
    //         "#installYesterday_akl",
    //         "gen_chart_akl",
    //         "N_installs",
    //         "field",
    //         "yesterday")
    // cumulativeNumbers(ndx,
    //         "#pauToday_akl",
    //         "gen_chart_akl",
    //         "PAU",
    //         "field",
    //         "today")
    // cumulativeNumbers(ndx,
    //         "#pauYesterday_akl",
    //         "gen_chart_akl",
    //         "PAU",
    //         "field",
    //         "yesterday")
    // cumulativeNumbers(ndx,
    //         "#dauToday_akl",
    //         "gen_chart_akl",
    //         "AU",
    //         "field",
    //         "today")
    // cumulativeNumbers(ndx,
    //         "#dauYesterday_akl",
    //         "gen_chart_akl",
    //         "AU",
    //         "field",
    //         "yesterday")



    // dc.renderAll("gen_chart_akl");
};




// $(".dropdown dt a").on('click', function () {
//           $(".dropdown dd ul").slideToggle('fast');
//       });

//       $(".dropdown dd ul li a").on('click', function () {
//           $(".dropdown dd ul").hide();
//       });

//       function getSelectedValue(id) {
//            return $("#" + id).find("dt a span.value").html();
//       }

//       $(document).bind('click', function (e) {
//           var $clicked = $(e.target);
//           if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
//       });


//       $('.mutliSelect input[type="checkbox"]').on('click', function () {

//           var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
//               title = $(this).val() + ",";

//           if ($(this).is(':checked')) {
//               var html = '<span title="' + title + '">' + title + '</span>';
//               $('.multiSel').append(html);
//               $(".hida").hide();
//           }
//           else {
//               $('span[title="' + title + '"]').remove();
//               var ret = $(".hida");
//               $('.dropdown dt a').append(ret);

//           }
//       });








function innerTextFormat(stringIN){
    if(stringIN=="revenue"){return function(number){return d3.format('.3s')(number)+'\u20AC'};}
    if(stringIN=="hc_spent"){return function(number){return d3.format('.3s')(number)};}
    if(stringIN=="dau"){return function(number){return d3.format('.3s')(number)};}
    if(stringIN=="pau"){return function(number){return d3.format('.3s')(number)}}
    if(stringIN=="installs"){return function(number){return d3.format('.3s')(number)};}
    if(stringIN=="weekly"){return function(number){return d3.format('.3s')(number)};}
}

function dataCircle(stringIN, valueMain, valueRef, valueBackMain, valueBackRef){
    maximum = {}
    maximum["dau"] = 800000;
    maximum["pau"] = 5000;
    maximum["installs"] = 100000;
    maximum["revenue"] = 12000;
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

function titleCircle(stringIN){
    title = {}
    title["dau"] = "DAU";
    title["pau"] = "PAU";
    title["installs"] = "New Installs";
    title["revenue"] = "Revenue";
    title["hc_spent"] = "Hard Currency Spent";
    return title[stringIN]
}

function colorArcs(stringIN){
    col = {}
    col["dau"] = circleColor
    col["pau"] = circleColor
    col["installs"] = circleColor
    col["revenue"] = circleColor
    col["hc_spent"] = circleColor
    return col[stringIN]
}

function colorText(stringIN){
    col = {}
    col["dau"] = textCircleColor
    col["pau"] = textCircleColor
    col["installs"] = textCircleColor
    col["revenue"] = textCircleColor
    col["hc_spent"] = textCircleColor
    return col[stringIN]
}

function sizeCircles(stringIN){
    widthPanel = $(".panelContainer").width()
    heightPanel = $(".panelContainer").height()
    sizeC = {}
    sizeC["dau"] = [widthPanel/1.2,heightPanel/3.3];
    sizeC["pau"] = [widthPanel/2.2,heightPanel/3.3]
    sizeC["installs"] = [widthPanel/2.2,heightPanel/3.3]
    sizeC["revenue"] = [widthPanel/2.2,heightPanel/3.3]
    sizeC["hc_spent"] = [widthPanel/2.2,heightPanel/3.3]
    return sizeC[stringIN]
}



sizeCircles("dau")

var circleFieldsName = ["revenue", "dau", "installs", "pau","hc_spent"]

var panelCircles = {}
circleFieldsName.forEach(function(d){
    panelCircles[d] = new d3circle(d+"_akl",sizeCircles(d)[0],sizeCircles(d)[1],colorArcs(d),colorText(d),innerTextFormat(d),dataCircle(d,0,0),titleCircle(d));
})



//var slideCircle = new d3circle("radGraph",700,700,colorsCircle,innerTformat,dataCircle1,"slide circle");
$("document").ready(function(){
    // var game_name = "iaa"
    // var game_fullname = "Ice Age Adventure"
    // $('#gameTitle').append(game_fullname);
    // $('.gameChange').click(function(){
    //     game_name = "farm_folks"
    //     game_fullname = "Farm Folks"
    //     $('#gameTitle').empty()
    //     $('#gameTitle').append(game_fullname);
    //     console.log(testMenu)
    //     myMenu._resetMenu()
    // })
    // $('#gameTitle').remove();
    // console.log($('#gameTitle'))
    // $('#gameTitle').append(game_fullname);


    var delay_utc = 12*3600;
    var delay_gmmdb = 3*3600;
    var delay_studio = 3*3600;

    var now = new Date().getTime();




    // makeProgressCircle(pauCircle,0.01)
    // makeProgressCircle(installsCircle,0.01)
    // makeProgressCircle(dauCircle,0.01)
    // makeProgressCircle(revCircle,0.01)
    // makeProgressCircle(slideCircle,0.01)

    todayDate = getFakeToday()
    yesterdayDate = getFakeToday(24*3600);
    dayM7Date = getFakeToday(7*24*3600);




    // circleFieldsName.forEach(function(d){
    //     console.log(d)
    //     makeProgressCircle(panelCircles[d],0.01);
    // })
    // function panelMaster(){
    //     console.log("panel function - update circles")
    //     queue()
    //         .defer(d3.json, getDailyFlaskRoute(game_name,dayM7Date))
    //         .defer(d3.json, getDailyFlaskRoute(game_name,todayDate))
    //         .defer(extraParamCircles, panelCircles, 'daily')
    //         .await(makePanel)
    //     //makeAKLgraphs("ok",jsonData1,jsonData2)
    //     setTimeout(panelMaster,10000);
    // }
    // panelMaster()

    // setTimeout(updateProgressCircle("radGraph"),20000)

    $("#result").load("/tmpLifetime")
    $("#nav-zoom").hide()
    // console.log($("#nav-zoom"))
    //generateADDdata('iaa',"ggiDAU")


    // setTimeout(masterTime,10000);


});
