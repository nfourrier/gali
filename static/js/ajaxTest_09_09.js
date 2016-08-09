// function something(input_class) {
//     console.log("changed!");
//     var countryArray = [];
//     $('input.' + input_class + ':checked').each(function() {
//       countryArray.push($(this).val());
//     });

//     countryArray = countryArray.toString()
//     console.log(countryArray)
//      $.ajax({
//         type: "GET",
//         url: $SCRIPT_ROOT + "/ajx-list-Country",
//         contentType: "application/json; charset=utf-8",
//         data: {
//                 countryList: countryArray,
//               },
//         success: function(data) {
//             $('#echoCountry').text(data.country);
//             console.log(data)
//         }
//     });
// }


// $(function() {
//     //$("#submitBtn").click(function() {
//     //$(".countryklass").on("change",function() {
//     //$('input:checkbox').change(function(e) {
//     //$('input:checkbox').on('change',function() {

//     //$('input:checkbox').on('change',function() {
//     $('#wkslist').on('change',function(){
//         console.log("changed!");
//         var countryArray = [];
//         var countryArray = [];
//         $('input.countryklass:checked').each(function() {
//           countryArray.push($(this).val());
//         });
//         $('input.gameklass:checked').each(function() {
//           gameArray.push($(this).val());
//         });

//         countryArray = countryArray.toString()
//         console.log(countryArray)
//          $.ajax({
//             type: "GET",
//             url: $SCRIPT_ROOT + "/ajx-list-Country",
//             contentType: "application/json; charset=utf-8",
//             data: {
//                     countryList: countryArray,
//                   },
//             success: function(data) {
//                 $('#echoCountry').text(data.country);
//                 $('#echoGame').text(data.game);
//                 console.log(data)
//             }
//         });

//     }
// )
// });




// // sample of response from server




// $(function(){
// /*    $("#submitBtn").click(function() {*/


//         $.ajax({
//             type: "GET",
//             url: $SCRIPT_ROOT + "/ajx-list",
//             contentType: "application/json; charset=utf-8",
//             /*data: {toto:0},*/
//             success: function(data) {
//                 console.log(data.Country)
//                 $.each(data.Country, function (key, value) {
//                     var li = $('<li><input type="checkbox" value="' + value + '" class="countryklass""/>' +
//                                '<label for="' + value + '"></label></li>');
//                     li.find('label').text(value);
//                     $('#countryList').append(li);
//                 });
//                 $.each(data.Game, function (key, value) {
//                     var li = $('<li><input type="checkbox" value="' + value + '" class="countryklass""/>' +
//                                '<label for="' + value + '"></label></li>');
//                     li.find('label').text(value);
//                     $('#gameList').append(li);
//                 });
//                 console.log(data)
//             }
//         });

// /*    });*/
// });


// // $('document').ready(function(){
// //    $('window').addEvent('load', function() {
// //     new DatePicker('.demo_vista', { pickerClass: 'datepicker_vista' });
// //     new DatePicker('.demo_dashboard', { pickerClass: 'datepicker_dashboard' });
// //     new DatePicker('.demo_jqui', { pickerClass: 'datepicker_jqui', positionOffset: { x: 0, y: 5 } });
// //     new DatePicker('.demo', { positionOffset: { x: 0, y: 5 }});
// //     });
// // });



//Global Variables
//Global Functions
function getList(fieldName) {
  console.log("changed!");
  var localArray = [];
  $('input.'+fieldName+'klass:checked').each(function() {
    console.log("done");
    localArray.push($(this).val());
  });

  localArray = localArray.toString();
  return localArray;
}

function updateList(dataIN, fieldName){
        //data.read_checked_country,"country"
      $('#echo_'+fieldName).text(dataIN["read_checked_"+fieldName]);
}

function genList(dataIN, fieldName){
    //fieldName = "country"
    //$.each(data[fieldName], function (key, value) {
    //$.each(data.country, function (key, value) {data.gen_
    $.each(dataIN["gen_"+fieldName], function (key, value) {
        var li = $('<li><input type="checkbox" value="' + value + '" class="'+fieldName+'klass"/>' + '<label for="' + value + '"></label></li>');
        li.find('label').text(value);
        $('#'+fieldName+'List').append(li);
    });

}

$("document").ready(function(){

    $.ajax({
        type: "GET",
        url: $SCRIPT_ROOT + "/ajx-generate-checkbox",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            genList(data,"country")
            genList(data,"game")
            genList(data,"shop")
        }
    });

    $('ul#masterList').on('change', function(){
        countryArray = getList("country")
        gameArray = getList("game")
        shopArray = getList("shop")
        $.ajax({
            type: "GET",
            url: $SCRIPT_ROOT + "/ajx-read-checked",
            contentType: "application/json; charset=utf-8",
            data: {
                countryList: countryArray,
                gameList: gameArray,
                shopList: shopArray,
            },
            success: function(data){
                updateList(data,"country");
                updateList(data,"game");
                updateList(data,"shop");
            }
        });
        // $.ajax({
        //     type: "GET",
        //     url: $SCRIPT_ROOT + "/ajx-generate-checkbox",
        //     contentType: "application/json; charset=utf-8",
        //     success: function(data){
        //         genList(data.gen_country,"country")
        //         genList(data.gen_game,"game")
        //         genList(data.gen_shop,"shop")
        //     }
        // });

    });

});
