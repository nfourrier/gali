$(function(){
  $('#autocomplete').autocomplete({
    lookup: allValues,

    onSelect: function (suggestion) {
            console.log(suggestion)
            console.log("ic")
      var thehtml = '<strong>Search Name:</strong> ' + suggestion.value + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
      $('#outputcontent').html(thehtml);
    $('input#'+suggestion.value+'.checkItem').prop("disabled",false)
    $('input#'+suggestion.value+'.checkItem').prop("checked",true)
    }
  });


});
