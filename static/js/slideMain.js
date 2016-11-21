function addNewSlide(divID,spanID){
    var newSlide = '<section transition="zoom"> <div class="slideGraph" id="'+divID+'">  '
    if(typeof(spanID)!='undefined'){
        newSlide = newSlide + '<span class="timeLeft '+spanID+'"></span>'
    }
    if(divID.indexOf('sun')>-1){
        newSlide = newSlide + '<svg><g class="sequence" id="seq_'+divID+'"></g> <g class="explanation" id="exp_'+divID+'" style="visibility: hidden;"> </g></svg></div>'
    }
    else{
        newSlide = newSlide + '</div>'
    }

    newSlide = newSlide +addDownloadIcon(divID)+'</section>'
    $('.slides').append($(newSlide))
}


$("document").ready(function(){
    $('#gameTitle').append(game_fullname);
    if($(".slides").width() > 10){
        if(displaySequence == 1){
            // queue()
            //         .defer(d3.json, "/loadADDjson/"+game_name+"/dau_per_site")
            //         .defer(extraGraphParam,
            //             $(".slides").width(),
            //             $(".slides").height(),
            //             stackBarColor,
            //             titleSlideColor,
            //             "DAU per site",
            //             "dau_site_akl",
            //             game_name,
            //             "DATES",
            //             "DAU",
            //             "SITE")
            //         .await(stackBar)
            // addNewSlide('dau_site_akl')
            // queue()
            //         .defer(d3.json, "/loadADDjson/"+game_name+"/countryMPAU")
            //         .defer(extraGraphParam,
            //             $(".slides").width(),
            //             $(".slides").height(),
            //             stackBarColor,
            //             titleSlideColor,
            //             "Monthly Revenue per country",
            //             "monthlyRevenue_country_akl",
            //             game_name,
            //             "date",
            //             "revenue",
            //             "country")
            //         .await(stackBar)
            // addNewSlide('monthlyRevenue_country_akl')
            // queue()
            //         .defer(d3.json, "/loadADDjson/"+game_name+"/test")
            //         .defer(extraGraphParam,
            //             $(".slides").width(),
            //             $(".slides").height(),
            //             stackBarColor,
            //             titleSlideColor,
            //             "Test pour ma Lili",
            //             "testLili_country_akl",
            //             game_name,
            //             "Name",
            //             "Value",
            //             "")
            //         .await(chartLine)
            // addNewSlide('testLili_country_akl')
            queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/histo")
                    .defer(extraGraphParam,
                        $(".slides").width(),
                        $(".slides").height(),
                        stackBarColor,
                        titleSlideColor,
                        "Patient vs. Control",
                        "histoControl_akl",
                        game_name,
                        "ind",
                        ['control_mean','control_min','control_max',"patient"],
                        "label")
                    .await(histoControl)
            addNewSlide('histoControl_akl')

queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/histo")
                    .defer(extraGraphParam,
                        $(".slides").width()/3,
                        $(".slides").height()/3,
                        stackBarColor,
                        titleSlideColor,
                        "Patient vs. Control",
                        "histoControl_akl2",
                        game_name,
                        "ind",
                        ['control_mean','control_min','control_max',"patient"],
                        "label")
                    .await(histoControl)
queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/histo")
                    .defer(extraGraphParam,
                        $(".slides").width()/3,
                        $(".slides").height()/3,
                        stackBarColor,
                        titleSlideColor,
                        "Patient vs. Control",
                        "histoControl_akl3",
                        game_name,
                        "ind",
                        ['control_mean','control_min','control_max',"patient"],
                        "label")
                    .await(histoControl)
queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/knee")
                    .defer(extraGraphParam,
                        $(".slides").width()/3,
                        $(".slides").height()/3,
                        stackBarColor,
                        titleSlideColor,
                        "Patient vs. Control",
                        "testControl_akl1",
                        game_name,
                        "ind",
                        ['control_mean','control_min','control_max',"patientA",'patientB'],
                        "")
                    .await(chartControl)
queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/knee")
                    .defer(extraGraphParam,
                        $(".slides").width()/3,
                        $(".slides").height()/3,
                        stackBarColor,
                        titleSlideColor,
                        "Patient vs. Control",
                        "testControl_akl2",
                        game_name,
                        "ind",
                        ['control_mean','control_min','control_max',"patientA",'patientB'],
                        "")
                    .await(chartControl)
queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/knee")
                    .defer(extraGraphParam,
                        $(".slides").width()/3,
                        $(".slides").height()/3,
                        stackBarColor,
                        titleSlideColor,
                        "Patient vs. Control",
                        "testControl_akl3",
                        game_name,
                        "ind",
                        ['control_mean','control_min','control_max',"patientA",'patientB'],
                        "")
                    .await(chartControl)
queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/knee")
                    .defer(extraGraphParam,
                        $(".slides").width()/3,
                        $(".slides").height()/3,
                        stackBarColor,
                        titleSlideColor,
                        "Patient vs. Control",
                        "testControl_akl4",
                        game_name,
                        "ind",
                        ['control_mean','control_min','control_max',"patientA",'patientB'],
                        "")
                    .await(chartControl)
queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/knee")
                    .defer(extraGraphParam,
                        $(".slides").width()/3,
                        $(".slides").height()/3,
                        stackBarColor,
                        titleSlideColor,
                        "Patient vs. Control",
                        "testControl_akl5",
                        game_name,
                        "ind",
                        ['control_mean','control_min','control_max',"patientA",'patientB'],
                        "")
                    .await(chartControl)
queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/knee")
                    .defer(extraGraphParam,
                        $(".slides").width()/3,
                        $(".slides").height()/3,
                        stackBarColor,
                        titleSlideColor,
                        "Patient vs. Control",
                        "testControl_akl6",
                        game_name,
                        "ind",
                        ['control_mean','control_min','control_max',"patientA",'patientB'],
                        "")
                    .await(chartControl)
var divID = 'histoControl_akl3'
var divID2 = 'histoControl_akl2'
var divID3 = "testControl_akl1"
var divID4 = "testControl_akl2"
var divID5 = "testControl_akl3"
var divID6 = "testControl_akl4"
var divID7 = "testControl_akl5"
var divID8 = "testControl_akl6"
var AA = '<section transition="zoom"> ' + '<div class="slideGraph">'+'<div id="'+divID+'">  '+ '</div>' + '<div id="'+divID2+'">  '+ '</div>'+ '</div>' + '</section>'
var AA = '<section transition="zoom"> ' + '<div class="slideGraph" id="'+divID+'">  '+ '</div>' + '<div class="slideGraph" id="'+divID2+'">  '+ '</div>'+ '<div class="slideGraph" id="'+divID3+'">  '+ '</div>'+ '<div class="slideGraph" id="'+divID4+'">  '+ '</div>'+ '<div class="slideGraph" id="'+divID5+'">  '+ '</div>'+ '<div class="slideGraph" id="'+divID6+'">  '+ '</div>'+ '<div class="slideGraph" id="'+divID7+'">  '+ '</div>' + '</section>'
    $('.slides').append($(AA))

            queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/knee")
                    .defer(extraGraphParam,
                        $(".slides").width(),
                        $(".slides").height(),
                        stackBarColor,
                        titleSlideColor,
                        "Patient vs. Control",
                        "testControl_akl",
                        game_name,
                        "ind",
                        ['control_mean','control_min','control_max',"patientA",'patientB'],
                        "")
                    .await(chartControl)
            addNewSlide('testControl_akl')
            queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/test")
                    .defer(extraGraphParam,
                        $(".slides").width(),
                        $(".slides").height(),
                        stackBarColor,
                        titleSlideColor,
                        "Test pour ma Lili",
                        "testLili_country_akl",
                        game_name,
                        "Name",
                        "Value",
                        "")
                    .await(chartLine)
            addNewSlide('testLili_country_akl')
        }

        if(displaySequence == 0){
            console.log("here  ")
            console.log($("pau_dailySlide_akl"))
            // console.log(slideDCircles)
            // console.log(slideCircles)
            addNewSlide('pau_weekly_akl', 'timeLeft_weekly')
            addNewSlide('pau_dailySlide_akl', 'timeLeft2_weekly')
            addNewSlide('installs_dailySlide_akl', 'timeLeft2_weekly')
            addNewSlide('dau_dailySlide_akl', 'timeLeft2_weekly')
            addNewSlide('revenue_dailySlide_akl', 'timeLeft2_weekly')
            addNewSlide('hc_spent_dailySlide_akl', 'timeLeft2_weekly')

        }
    }
    $(".btn2 a:hover, a:focus").css({
        "fill": colorTheme2,
        "background": colorTheme1,
        "color": colorTheme2
    })
    $(".btn2 a svg").css({
        "fill": colorTheme1
    })
    .mouseenter(function(){
        $(this).css({
            "color": colorTheme2,
            "fill": colorTheme2,
            "background": colorTheme1
        })
    }).mouseleave(function(){
        $(this).css({
            "color": colorTheme1,
            "fill": colorTheme1,
            "background": colorTheme2
        })
    })

    console.log(circleFieldsName)

    // circleFieldsName.forEach(function(d){
    //     makeProgressCircle(slideCircles[d],0.01);
    // })
    // circleFieldsName.forEach(function(d){
    //     makeProgressCircle(slideDCircles[d],0.01);
    // })
    console.log(circleFieldsName)
    circleFieldsName.forEach(function(d){
        makeProgressCircle(panelCircles[d],0.01);
    })

    function panelMaster(){
        console.log("panel function - update circles")
        var PM = queue()
            .defer(d3.json, getDailyFlaskRoute(game_name,dayM7Date))
            .defer(d3.json, getDailyFlaskRoute(game_name,todayDate))
            .defer(extraParamCircles, panelCircles, 'daily')
            .await(makePanel)

        // console.log(PM)
        PM = null
        // console.log(PM)
        //makeAKLgraphs("ok",jsonData1,jsonData2)
        // timeoutID_panelMaster = setTimeout(panelMaster,dailyCircleTimer);
    }
    function slideDailyMaster(){
       var PM = queue()
            .defer(d3.json, getDailyFlaskRoute(game_name,dayM7Date))
            .defer(d3.json, getDailyFlaskRoute(game_name,todayDate))
            .defer(extraParamCircles, slideDCircles, 'daily')
            .await(makePanel)

        // console.log(PM)
        PM = null
        // console.log(PM)
        //makeAKLgraphs("ok",jsonData1,jsonData2)
        timeoutID_panelMaster = setTimeout(slideDailyMaster,dailyCircleTimer);
    }

    function slideWeeklyMaster(){
        // console.log("panel function - update circles")
        var DS = queue()
            .defer(d3.json, getWeeklyFlaskRoute(game_name,dayM7Date))
            .defer(d3.json, getWeeklyFlaskRoute(game_name,todayDate))
            .defer(extraParamCircles, slideCircles, 'weekly')
            .await(makePanel)
        // console.log(DS)
        DS = null
        //makeAKLgraphs("ok",jsonData1,jsonData2)
        timeoutID_weeklyMaster = setTimeout(slideWeeklyMaster,weeklyCircleTimer);
    }

    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    //                Comment / Uncomment
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    // slideDailyMaster()
    // panelMaster()
    // slideWeeklyMaster()
    /////////////////////////////////////////////////////////////////////

    // addNewSlide('pau_weekly_akl', 'timeLeft_weekly')
    // addNewSlide('installs_weekly_akl', 'timeLeft_weekly')
    // addNewSlide('dau_weekly_akl', 'timeLeft_weekly')
    // addNewSlide('revenue_weekly_akl', 'timeLeft_weekly')
    // addNewSlide('hc_spent_weekly_akl', 'timeLeft_weekly')
})


$(document).ready(function() {
    // $("#save_as_pdf").click(function() { submit_download_form("pdf"); });
    dayTMP = getFakeToday(12*24*3600);
    // getWeeklyFlaskRoute(game_name,dayTMP)
    $(".download-btn").click(function() {
        var mtn = new Date();
        mtn = "_"+mtn.getFullYear()+"-"+castInt(mtn.getMonth()+1)+"-"+castInt(mtn.getDate())+"_"+castInt(mtn.getHours())+"-"+castInt(mtn.getMinutes()+1)
        toSave = $(this).attr("overlay");
        // console.log(toSave)
        var tmp = document.getElementById(toSave);
        // console.log(tmp)
        var svg = tmp.getElementsByTagName("svg")[0];
        saveSvgAsPng(svg, toSave+mtn+'.png');

    })
});
