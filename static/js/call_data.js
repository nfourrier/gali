function listExistingJson(error, data){
    console.log(data)
    console.log(allGames)
    data.forEach(function(d){
        if(d.method=="byMinutes"){
            var dd = new Date();
            if(new Date(d.filename.split(".")[0])>dd.setDate(dd.getDate()-5)){
                addRowLog(d.game,' - ',d.method,d.filename,new Date(d.time*1000),0,"success")
            }
        }
        else{
            // console.log(d)
            addRowLog(d.game,' - ',d.method,d.filename,new Date(d.time*1000),0,"success")
        }
    })
    scheduleCalls(7,01)
}
function listPythonCalls(error, data){
    // data.forEach(function(d){
    //     pushScript("empty",d)
    //     scheduleTable[d] = new Date(0)
    // })
    // console.log(scheduleTable)
    // console.log(data)

    data["slides"].forEach(function(d){
        scheduleCallsList.push({value:"slides: "+d,command:d, field:'slides', game:game_name})
    })
    // scheduleCallsList.push({value:"slides: "+"byMinutes", command:"byMinutes", field:'slides'})
    // scheduleCallsList.push({value:"slides: "+"byWeeks", command:"byWeeks", field:'slides'})


    // console.log(allGames)
    allGames.forEach(function(d){
        console.log(d)
        if(d=="iaa"){
            gameTMP = "IAA"
        }
        if(d=="countryfriends"){
            gameTMP = "CF"
        }
        data["slides"].forEach(function(d_script){
            allCalls.push({value:gameTMP+" slides: "+d_script,command:d_script, field:'slides', game:d})
        })
        allCalls.push({value:gameTMP + " slides: "+"byMinutes", command:"byMinutes", field:'slides', game:d})
        allCalls.push({value:gameTMP + " slides: "+"byWeeks", command:"byWeeks", field:'slides', game:d})
    })

    data["custom"].forEach(function(d){
        allCalls.push({value:"custom: "+d,command:d, field:'custom', game:game_name})
    })
    data["regular"].forEach(function(d){
        allCalls.push({value:"regular: "+d,command:d, field:'regular', game:game_name})
    })
    data["regular"].forEach(function(d){
        allCalls.push({value:"regular: ",command:d, field:'regular', game:name})
    })
    //allCalls = data
}


loadXdata()
function loadXdata(){
    console.log("loadXdata - test")
}

allCalls = []
scheduleCallsList = []
function listGames(error, data){
    allGames = data
}
var sTable = []
var ssTable = {}
function scheduleCalls(hoursIN,minutesIN){

    //oTable.fnSort([[2,"desc"]]);
    var typeData_byMinutes = {value:'slides: byMinutes', command:"byMinutes", field:'slides'}
    var typeData_byWeeks = {value:'slides: byWeeks', command:"byWeeks", field:'slides'}
    // A = setTimeout(callData, 1000*1000, 'iaa', method)
    // console.log(A)
    // console.log(B)

    nowTime = new Date()
    timeGame = new Date()
    var startHour = hoursIN
    var startMinute = minutesIN

    var byMinutes_Minute = 10
    var byMinutesTime = new Date()

    var byWeeks_Minute = 15
    var byWeeksTime = new Date()

    if(nowTime.getHours()>startHour-1){
        timeGame.setDate(timeGame.getDate()+1)
    }

    allGames.forEach(function(game){
        byMinutesTime.setTime(byMinutesTime.getTime()+byMinutes_Minute*60*1000)
        byWeeksTime.setTime(byWeeksTime.getTime()+byWeeks_Minute*60*1000)
        // byMinutesTime.setMinutes(byMinutes_Minute)
        addRowSchedule(game,typeData_byMinutes,byMinutesTime,(byMinutesTime-nowTime))
        // addRowSchedule(game,typeData_byMinutes,nowTime,10)
        addRowSchedule(game,typeData_byWeeks,byWeeksTime,(byWeeksTime-nowTime))

        timeGame.setHours(startHour)
        timeGame.setMinutes(startMinute)
        console.log("hours before execution ", game, " calls: ",(timeGame-nowTime)/(1000*3600))

        scheduleCallsList.forEach(function(typeData){
            timeGame.setMinutes(startMinute)
            //console.log(game,typeData.value,startMinute)
            timeBeforeCall = (timeGame-nowTime)
            // console.log(typeData)
            addRowSchedule(game,typeData,timeGame,timeBeforeCall)

            if(startMinute>58){
                startMinute=0
                timeGame.setHours(timeGame.getHours()+1)
            }
            startMinute += 1
        })
        startMinute += 30
    })
    console.log($('#scheduleTable').DataTable())

    // console.log(sTable)
    // console.log(ssTable)
    var oTable = $('#scheduleTable').dataTable(),
        dTable = oTable.fnGetData(),
        row, i,
        l = dTable.length;
    rows = oTable.fnGetNodes()
    // console.log(rows[1])
    var test = oTable.fnGetData();
    // rows.forEach(function(d){
    //     console.log(d.attr(id))
    // })

    // oTable.fnUpdate("ASDFASFAS",$('tr#iaa_ggiDAU')[1],1)
    // oTable.fnUpdate("3",$('tr#iaa_ggiDAU')[3],1)
    // oTable.fnUpdate("123",$('tr#iaa_ggiPAU')[1],1)
    meth = {value:'ggiDAU'}
    // updateRowSchedule('iaa',meth,timeGame,100 )
    // console.log(oTable.fnGetPosition(2))

// fnUpdate
// Update a table cell or row - this method will accept either a single value
// to update the cell with, an array of values with one element for each column
// or an object in the same format as the original data source.
// The function is self-referencing in order to make the multi column updates easier.
// Input parameters:
// {object|array|string}: Data to update the cell/row with
// {node|int}: TR element you want to update or the aoData index
// {int}: The column to update (set to undefined to update the whole row)
// {bool} [default=true]: Redraw the table or not
// {bool} [default=true]: Perform pre-draw actions or not

    //console.log(oTable.DefaultView.ToTable(true,"Game"))
    dTable.sort(function(a,b){return b[4]-a[4]})
    console.log(dTable)
    console.log(l)
    // for(i=0;i<l;i++){
    //     row = dTable[i];
    //     scheduleTable[row[1]] = row[3]
    //     //console.log(row,$.inArray("ggiDAU",row))
    // }
    //setTimeout(callData,10*1000)
}


function updateRowSchedule(game,method,endCallDate,status){
    if(status=="success"){
        intervalHours = 24
        intervalMinutes = 0
    }
    else{
        intervalHours = 1
        intervalMinutes = 0
    }
    console.log(game,method,endCallDate,status,intervalHours,intervalMinutes)
    if(method.command=="byMinutes"){
        intervalHours = 0
        intervalMinutes = 40
    }
    if(method.command=="byWeeks"){
        intervalHours = 8
        intervalMinutes = 0
    }
    console.log(game,method,endCallDate,status,intervalHours,intervalMinutes)

    console.log($('#scheduleTable').dataTable().fnGetData($('tr#'+game+"_"+method.command)))
    var nextCallDate = new Date();
    console.log(method,nextCallDate)
    nextCallDate.setHours(nextCallDate.getHours()+intervalHours)
    nextCallDate.setMinutes(nextCallDate.getMinutes()+intervalMinutes)
    console.log('new date', new Date())
    console.log('next',method,nextCallDate)
    console.log('endcall',method,endCallDate)
    timeBeforeCall = nextCallDate-endCallDate

    var tTable = $('#scheduleTable').dataTable();
    var currentData = tTable.fnGetData($('tr#'+game+"_"+method.command))
    console.log(currentData)
    console.log(game, method.command)
    tTable.fnDeleteRow($('tr#'+game+"_"+method.command))
    // console.log("updateRow",method,intervalHours,intervalMinutes,nextCallDate,timeBeforeCall)
    addRowSchedule(game,method,nextCallDate,timeBeforeCall)
    //tTable.fnUpdate(stringDate(startDate),$('tr#'+game+"_"+method),2)
    console.log($('#scheduleTable').dataTable().fnGetData($('tr#'+game+"_"+method.command)))
    // setTimeout(callData,timeout, game, method)
}

function addRowLog(game,field,method,filename,startDate,elpTime,status){
    $('#logTable').DataTable().row.add([game,field,method,filename,stringDate(startDate),startDate,elpTime+"sec",status]).draw(true);
}
function addRowSchedule(game,method,startDate,timeBeforeCall){
    // console.log(method)
    var timer = setTimeout(callData,timeBeforeCall, game, method)
    //console.log(game,method,timer)
    $('#scheduleTable').DataTable().row.add([game,method.field,method.command,stringDate(startDate),startDate,timer,game+"_"+method.command]).draw(true);
    //indexOf(game+"_"+method)

}

$(document).ready(function() {
    d3.json("listGames", listGames)
    d3.json("listCalls", listPythonCalls)

    if($(this)[0].URL.indexOf("log")>-1){
        console.log("asdf")
        d3.json("listAvailable", listExistingJson)

        $('#logTable').width('100%')
        $('#logTable').DataTable( {
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            "order": [[4,"desc"]],
            "autoWidth": false,
            "aoColumns" : [
                        { 'sWidth': '15%' },
                        { 'sWidth': '15%' },
                        { 'sWidth': '15%' },
                        { 'sWidth': '0%' },
                        { 'sWidth': '30%' },
                        { 'sWidth': '0%' },
                        { 'sWidth': '15%' },
                        { 'sWidth': '10%' }
                    ],
            "columnDefs":[
                 {
                    "targets": [ 5 ],
                    "visible": false,
                    "searchable": false,
                },
                {
                    "targets": [ 3 ],
                    "visible": false,
                    "searchable": false,
                }

            ],
            // "width": '100%',
            "createdRow": function(row,data,index){
                    if(data[6]=="success"){
                        console.log('here')
                    }
            },
            "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                    if(aData[6]=="success"){
                        // console.log('icon here')
                         $('td:eq(6)', nRow).html("<i class='icon icon-check'></i>");
                         feedLiveStream("GMMDB available for new calls")
                         feedLiveStream("Success: Request "+aData[1]+" made")
                         // $('#liveStream').text("GMMDB available for new calls");
                         // $('#liveStream').append("<br/> Success: Request "+aData[1]+" made");
                    }
                    else{
                         $('td:eq(6)', nRow).html("<span class='icon icon-close'></span>");
                         feedLiveStream("GMMDB available for new calls")
                         feedLiveStream("Fail: Request "+aData[1]+" failed")
                         // $('#liveStream').text("GMMDB available for new calls")
                         // $('#liveStream').append("<br/> Fail: Request "+aData[1]+" failed");
                    }
            },

         // nRow - this is the HTML element of the row
         // aData - array of the data in the columns. Get column 4 data: aData[3]
         // iDataIndex - row index in the table
         // Append to the first column
         // if($('td:eq(4)'))
         // $('td:eq(0)', nRow).html("<input type='check' value=''></input>");

        } );

        $('#scheduleTable').DataTable( {
            "lengthMenu": [[3, 10, 25, -1], [3, 10, 25, 50, "All"]],
            "order": [[3,"asc"]],
            "columnDefs":[
                 {
                    "targets": [ 5 ],
                    "visible": false,
                    "searchable": false,
                },
                {
                    "targets": [ 4 ],
                    "visible": false,
                    "searchable": false,
                },
            ],
            "autoWidth": false,
            "aoColumns" : [
                        { 'sWidth': '20%' },
                        { 'sWidth': '25%' },
                        { 'sWidth': '25%' },
                        { 'sWidth': '30%' },
                        { 'sWidth': '0%' },
                        { 'sWidth': '0%' },
                    ],
            "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                    $(nRow).attr('id',aData[0]+"_"+aData[2])
            },



         // nRow - this is the HTML element of the row
         // aData - array of the data in the columns. Get column 4 data: aData[3]
         // iDataIndex - row index in the table
         // Append to the first column
         // if($('td:eq(4)'))
         // $('td:eq(0)', nRow).html("<input type='check' value=''></input>");

        } );
    }
    var nowDate = new Date()
    var nowTime = nowDate.getTime()


    console.log(stringDate(nowDate))
    console.log(nowTime-nowDate.getTime())
    //logList("asdf","ad","dsf","fdsa")
} );

// var allScripts = []
var allGames = []
var scriptToRun = "byMinutes"
// function pushScript(fieldName,value){
//     allScripts.push({value:value, field:fieldName})
// }



// $(function(){

// })


// $('.okButton[overlay="run"]').on('click', function() {
//     generateByMinutesData()
// });



function stringDate(dateIN){
    return dateIN.getFullYear()+'-'
                +("0" + (dateIN.getMonth()+1)).slice(-2)+'-'
                +("0" + (dateIN.getDate())).slice(-2)+' '
                +("0" + (dateIN.getHours())).slice(-2)+":"
                +("0" + (dateIN.getMinutes())).slice(-2)
}


function logList(scriptName, date, status, comment){
        //var whattoreplace=whatto.replace(/\s+/g, '').replace("'", '').replace(",","").replace("(","").replace(")","").replace(/\./g, '');
            var li = $('<tr>'+
                    '<td>'+scriptName+'</td>'+
                    '<td>'+date+'</td>'+
                    '<td>'+status+'</td>'+
                    '<td>'+comment+'</td>'+
                '</tr>')

        $('#logList_wrapper').append(li);

}


$("document").ready(function(){
    console.log($('.changeGame'))
    scriptToRun = {value:'dau', command:'dau', field:'filter'}
    // console.log($('.graphMain').width())
    // console.log($('.row').width())
    $('.okButton[overlay="run"]').on('click', function() {
        // console.log($('.row').width())
        // console.log($('.graphMain').width())
        var allVals = [];
        var checkedItems = {};

        $.each(allFields,function(index,value){checkedItems[value] = [];})
        $('.checkItem:checked').each(function(){
            allVals.push($(this).val());
            fieldName = $(this).attr("overlay");
            checkedItems[fieldName].push($(this).val());
        });
        $(".checkAll:checked").each(function(){
            fieldName = $(this).attr("overlay");
            if(fieldName!='game'){
                checkedItems[fieldName]=[]
            }
        })
        // checkedItems["install"].push();

        checkedItems['playdates'] = [$('#date_start_'+'playdates').attr("value"),$('#date_end_'+'playdates').attr("value")]
        checkedItems['installdates'] = [$('#date_start_'+'installdates').attr("value"),$('#date_end_'+'installdates').attr("value")]

        console.log($('.graphMain').width())
        console.log(checkedItems)
        checkedItems["game"].forEach(function(d){
            console.log(checkedItems)
            tabName = d.toLowerCase().split(" ")
            if(tabName.indexOf('adventure')>-1){
                console.log('iaa')
            }
            else if(tabName.indexOf('countryfriends')>-1){
                console.log('countryfriends')
            }
        })
        console.log(scriptToRun)
        console.log(checkedItems)

        callData(scriptToRun["game"],scriptToRun,checkedItems)
    });
    console.log($('.graphMain').width())
    console.log($('#autocomplete_run_scripts'))
    $('#autocomplete_run_scripts').autocomplete({
        lookup: allCalls,
        onSelect: function (suggestion) {
                console.log(suggestion)
        // var thehtml = '<strong>Search Name:</strong> ' + suggestion.value + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
        // $('#outputcontent_run_scripts').html(thehtml);
        scriptToRun = suggestion
        }
    });

    feedLiveStream("Welcome")
    AAA = {'y': 'AU', 'method': ['dau'], 'title': 'byType', 'output': ['C:\\DASAKL\\Output\\iaa_dau_2015-11-13_15-33.xlsx'], 'group': 'myResults', 'x': 'date', 'game': ['iaa']}
    // console.log(AAA)
    testRegularData(AAA)
    var updateInterval = 3600*1000;

});
function feedLiveStream(textIN){
    lvStream.splice(0,0,textIN)
    // console.log(lvStream.length)
    if(lvStream.length>3){
        lvStream.pop()
    }
    $('#liveStream').text("");
    $('#liveStream').append(lvStream.join(' <br/> '));
}
function callData(game, typeData, filter){
        console.log($('#scheduleTable'))
        console.log(typeof($('#scheduleTable').attr("class")) === 'undefined')
        console.log(game,typeData,filter)
        var startCallDate = new Date();
        var inputArgs = arguments.length
        if(inputArgs<3 || typeData.field=='slides'){
            // slides data
            filter = {}
            if(["byWeeks","byMinutes"].indexOf(typeData.command)>-1){
                var urlIN = "/callData/"+typeData.command+"/"+typeData.game
                var typeIN = 'POST'
                feedLiveStream(typeData.game+ " - Processing "+typeData.command+" slides Data ...")
                // $('#liveStream').text("Processing "+typeData.command+" slides Data ...")
            }
            else{
                var urlIN = "/callADDdata/"+typeData.game+"/"+typeData.command
                var typeIN = 'POST'
                feedLiveStream(typeData.game+ " - Processing ADD slides Data ("+typeData.command+") ...")
                // $('#liveStream').text("Processing ADD slides Data ("+typeData.command+") ...")
            }
        }
        else if(typeData.field=='custom'){
                var urlIN = "/callCustom/"+typeData.command
                var typeIN = 'POST'
                feedLiveStream(typeData.game+ " - Processing custom script ("+typeData.command+") ...")
                // $('#liveStream').text("Processing custom script ("+typeData.command+") ...")
        }
        else if(typeData.field=='regular'){
                var typeIN = 'POST'
                var urlIN = "/callFilterData/"+typeData.game+"/"+typeData.command
                feedLiveStream(typeData.game+ " - Processing Data ("+typeData.command+") ...")
                // $('#liveStream').text("Processing Data ("+typeData.command+") ...")
        }
        else{
            // other data
                var typeIN = 'POST'
                var urlIN = "/callFilterData/"+typeData.game+"/"+typeData.command
                feedLiveStream(typeData.game+ " - Processing Data ("+typeData.command+") ...")
                // $('#liveStream').text("Processing Data ("+typeData.command+") ...")
        }
        console.log(filter)
        console.log(typeIN)
        $.ajax({
            type: typeIN,
            //url: $SCRIPT_ROOT + "/ajx-generate-checkbox",
            url: urlIN,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                filter,
            }),
            success: function(data){
                if(typeData.field=="slides"){
                    console.log(data)
                    var endCallDate = new Date();
                    console.log("SUCCESS: "+typeData.command+" written to JSON file for "+game)
                    // console.log($('#scheduleTable').attr("class"))
                    console.log(inputArgs)
                    feedLiveStream("SUCCESS: "+typeData.command+" written to JSON file for "+game)
                    console.log(inputArgs)
                    if(inputArgs<3){
                        // check if we are on the admin webpage
                        console.log('call data automatic - success end')
                        updateRowSchedule(game, typeData, endCallDate,"success")
                        addRowLog(game,typeData.field,typeData.command,typeData.command+"json",startCallDate,Math.ceil((endCallDate.getTime()-startCallDate.getTime())/1000),"success")
                    }
                }
                else if(typeData.field=="regular"){
                    console.log(data)
                    console.log(data['output'])
                    feedLiveStream("GMMDB available for new calls")
                    feedLiveStream("Success: Request "+data["output"][0]+" made")
                    // $('#liveStream').append("<br/> Success: Request "+data["output"][0]+" made");
                    testRegularData(data)

                }
                else{
                    feedLiveStream()
                    console.log("SUCCESS: "+typeData.command+" written to JSON file for "+game)
                    console.log(data)
                }
            },
            error: function(data){
                if(typeData.field=="slides"){
                    console.log(data)
                    var endCallDate = new Date();
                    console.log("FAIL: "+typeData.command+" failed for "+game)
                    if(inputArgs<3){
                        // check if we are on the admin webpage
                        updateRowSchedule(game, typeData, endCallDate,"fail")
                        addRowLog(game,typeData.field,typeData.command,typeData.command+"json",startCallDate,Math.ceil((endCallDate.getTime()-startCallDate.getTime())/1000),"fail")
                    }
                }
                else{
                    console.log("FAIL: "+typeData.command+" failed for "+game)
                }
            }
        });
        console.log('typeData',typeData)
        inputArgs = null
    }

function testRegularData(dataIN){

    queue()
            .defer(d3.json, "/loadADDjson/"+"iaa"+"/resultRegular")
            .defer(extraGraphParam,
                w_graph,
                h_dater,
                stackBarColor,
                titleSlideColor,
                "Daily PAU per country",
                "testLine",
                dataIN["game"],
                dataIN["x"],
                dataIN["y"],
                dataIN["group"])
            .await(chartLine)
    $('.graphContainer').append(addDownloadIcon('testLine'))


    $(document).ready(function() {
    // $("#save_as_pdf").click(function() { submit_download_form("pdf"); });
    $(".download-btn").click(function() {
        var mtn = new Date();
        mtn = "_"+mtn.getFullYear()+"-"+castInt(mtn.getMonth()+1)+"-"+castInt(mtn.getDate())+"_"+castInt(mtn.getHours())+"-"+castInt(mtn.getMinutes()+1)
        toSave = $(this).attr("overlay");
        // console.log(toSave)
        var tmp = document.getElementById(toSave);
        console.log(tmp)
        // console.log(tmp)
        var svg = tmp.getElementsByTagName("svg")[0];
        saveSvgAsPng(svg, toSave+mtn+'.png');

    })
});
}


