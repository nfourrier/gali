  // $(function() {
  //   $("#submitBtn").click(function() {
  //       var countryArray = [];
  //       $('.new3:checked').each(function() {
  //         countryArray.push($(this).val());
  //       });
  //       var pubArray = [];
  //       $('.new4:checked').each(function() {
  //         pubArray.push($(this).val());
  //       });

  //       countryArray = countryArray.toString()
  //       pubArray = pubArray.toString()
  //       console.log(countryArray)
  //       console.log(pubArray)
  //        $.ajax({
  //           type: "GET",
  //           url: $SCRIPT_ROOT + "/echo/",
  //           contentType: "application/json; charset=utf-8",
  //           data: { echoValue: $('input[name="echoText"]').val(),
  //                   echoValue2: $('input[name="echoText"]').val(),
  //                   countryList: countryArray,
  //                   pubList: pubArray,
  //                 },
  //           success: function(data) {
  //               $('#echoResult2').text(data.value2);
  //               $('#echoResult').text(data.value);
  //               $('#echoCountry').text(data.country);
  //               $('#echoPub').text(data.pub);
  //               console.log(data)
  //           }
  //       });
  //   });
  // });

  // $(function() {
  //   console.log("la ajaxTest.js")
  //   $('input:checkbox').change(function(e) {
  //       var countryArray = [];
  //       $('.new3:checked').each(function() {
  //         countryArray.push($(this).val());
  //       });
  //       var pubArray = [];
  //       $('.new4:checked').each(function() {
  //         pubArray.push($(this).val());
  //       });
  //       console.log("coucou")
  //       countryArray = countryArray.toString()
  //       pubArray = pubArray.toString()
  //       console.log(countryArray)
  //       console.log(pubArray)
  //        $.ajax({
  //           type: "GET",
  //           url: $SCRIPT_ROOT + "/echo/",
  //           contentType: "application/json; charset=utf-8",
  //           data: { echoValue: $('input[name="echoText"]').val(),
  //                   echoValue2: $('input[name="echoText"]').val(),
  //                   countryList: countryArray,
  //                   pubList: pubArray,
  //                 },
  //           success: function(data) {
  //               $('#echoResult2').text(data.value2);
  //               $('#echoResult').text(data.value);
  //               $('#echoCountry').text(data.country);
  //               $('#echoPub').text(data.pub);
  //               console.log(data)
  //           }
  //       });
  //   });
  // });

  $(function(){
/*    $("#submitBtn").click(function() {*/
        $.ajax({
            type: "GET",
            url: $SCRIPT_ROOT + "/ajx-list",
            contentType: "application/json; charset=utf-8",
            /*data: {toto:0},*/
            success: function(data) {
                console.log(data.Country)
                $.each(data.Country, function (key, value) {
                    var li = $('<li><input type="checkbox" value="' + value + '" class="countryklass""/>' +
                               '<label for="' + value + '"></label></li>');
                    li.find('label').text(value);
                    $('#countrylist_09_09').append(li);
                });
                console.log("generate countrylist_09_09")
                console.log(data)
            }
        });

/*    });*/
});
