function listExistingJson(error, data){
        console.log(data)
        data.forEach(function(d){
            addRowLog(d.game,d.filename,new Date(d.time*1000),0,"success")
        })
}
function listPythonCalls(error, data){
    data.forEach(function(d){
        console.log(d)
        pushItem("empty",d)
    })
}


function addRowLog(game,method,startDate,elpTime,status){
    $('#logTable').DataTable().row.add([game,method,stringDate(startDate),elpTime+"sec",status]).draw(true);
}


$(document).ready(function() {
    d3.json("listCalls", listPythonCalls)
    d3.json("listAvailable", listExistingJson)
    $('#logTable').DataTable( {
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "order": [[2,"desc"]],
        "createdRow": function(row,data,index){
            print(data)
            if(data[5]=="success"){
                console.log('here')
            }
        },
        "fnCreatedRow": function( nRow, aData, iDataIndex ) {
            if(aData[4]=="success"){
                 $('td:eq(4)', nRow).html("<i class='icon icon-check'></i>");
                 $('#liveStream').text("GMMDB available for new calls")
                 $('#liveStream').append("<br/> Success: Request "+aData[1]+" made");

            }
            else{
                 $('td:eq(4)', nRow).html("<span class='icon icon-close'></span>");
                 $('#liveStream').text("GMMDB available for new calls")
                 $('#liveStream').append("<br/> Fail: Request "+aData[1]+" failed");
            }
        },
     // nRow - this is the HTML element of the row
     // aData - array of the data in the columns. Get column 4 data: aData[3]
     // iDataIndex - row index in the table
     // Append to the first column
     // if($('td:eq(4)'))
     // $('td:eq(0)', nRow).html("<input type='check' value=''></input>");

    } );
    var nowDate = new Date()
    var nowTime = nowDate.getTime()


    console.log(stringDate(nowDate))
    console.log(nowTime-nowDate.getTime())
    //logList("asdf","ad","dsf","fdsa")
} );

var allValues = []
function pushItem(fieldName,value){
    allValues.push({value:value, field:fieldName})
}
$(function(){
$('#autocomplete_run_scripts').autocomplete({
    lookup: allValues,

    onSelect: function (suggestion) {
            console.log(suggestion)
            console.log("ic")
      var thehtml = '<strong>Search Name:</strong> ' + suggestion.value + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
    $('#outputcontent_run_scripts').html(thehtml);

    }
  });
})



function stringDate(dateIN){
    return dateIN.getFullYear()+'-'
                +("0" + (dateIN.getMonth()+1)).slice(-2)+'-'
                +("0" + (dateIN.getDate()+1)).slice(-2)+' '
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

    var globVar;
    $('#liveStream').text("Welcome");

    $("#result").load("/tmpLifetime")
    $("#nav-zoom").hide()

    var updateInterval = 3600*1000;
    function generateByMinutesData(){
        $('#liveStream').text("Processing byMinutes Data ...")
        var nowDate = new Date();
        $.ajax({
            type: "GET",
            //url: $SCRIPT_ROOT + "/ajx-generate-checkbox",
            url: $SCRIPT_ROOT + "/callData/byMinutes/"+"iaa",
            contentType: "application/json; charset=utf-8",
            success: function(data){
                console.log("SUCCESS: minute data"+" written to JSON file for "+"iaa")
                console.log(nowDate.getTime(),(new Date()).getTime())
                $('#logTable').DataTable().row.add([data["game"],data["method"],stringDate(nowDate),Math.ceil((new Date()).getTime()-nowDate.getTime())/1000+"sec","status"]).draw(true);
                console.log(data)
            },
            error: function(data){
                console.log("error in generateByMinutesData",data)
            }
        });
        console.log('iaa')
        // setTimeout(generateByMinutesData('iaa'), 3600*1000);
    }
    function generateADDslidesData(){
        typeData = "ggiDAU"
        $('#liveStream').text("Processing ADD slides Data ...")
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
    // trigger_MinuteData();
    // trigger_ADDslidesData()


});
