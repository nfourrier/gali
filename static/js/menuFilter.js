function echoList(dataIN, fieldName){
      $('#echo_'+fieldName).text(dataIN["read_checked_"+fieldName]);
}

function getCheckedList(fieldName) {
  var localArray = [];
  $('input.'+fieldName+':checked').each(function() {
    localArray.push($(this).val());
  });
  return localArray;
}

function addtoList(fieldName,whatto, state){
        var whattoreplace=whatto.replace(/\s+/g, '').replace("'", '').replace(",","").replace("(","").replace(")","").replace(/\./g, '');
        if(state!=true){
            var li = $(''+
                '<input type="checkbox" '+
                'id="' + whattoreplace+"_"+fieldName +'" '+
                'value="' + whatto + '" '+
                'class="checkItem checkbox-custom" overlay="'+fieldName+'"/>' +
                    '<label class="checkbox-custom-label" for="' + whattoreplace+"_"+fieldName + '">'+whatto+'  </label>');

        }
        else{
            var li = $('<input type="checkbox" checked="true" id="' + whattoreplace+"_"+fieldName +'" value="' + whatto + '" class="checkItem checkbox-custom" overlay="'+fieldName+'"/>' + '<label class="checkbox-custom-label" for="' + whattoreplace+"_"+fieldName + '">'+whatto+'  </label>');
        }
        $('#'+fieldName+'List').append(li);

}

function supfromList(fieldName,whatto){
        var loc= '#'+fieldName+'List'
        $(loc+" li:contains("+whatto+")").remove();
}

function modifyFromList(fieldName,whatto,state){
    whatto = whatto.replace(/\s+/g, '').replace("'", '').replace(",","").replace("(","").replace(")","").replace(/\./g, '')
    $("input#"+whatto+"."+fieldName).prop("checked",state)
}

function genList(fieldName, addName){
    state=true
    if($('#'+fieldName+'All')){
        var li = $(''+
             '<input id="'+fieldName+'_all" type="checkbox"checked class="checkAll checkbox-custom" overlay='+fieldName+' /> '+
             '<label class="checkbox-custom-label" for="'+fieldName+'_all">'+'All'+'  </label>')
        // var li = $(''+
        // '<li>'+
        // '<label for="all_'+fieldName+'" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">'+
        //     '<input checked="true" type="checkbox" id="all_'+fieldName+'" class="checkAll mdl-checkbox__input"  overlay='+fieldName+'>'+
        //     '<span class="mdl-checkbox__label">All</span>'+
        // '</label>'+
        // '</li>')
        $('#'+fieldName+'All').append(li)

        // $('#'+fieldName+'All').append('<input type="button" class="reset" value="Reset" overlay='+fieldName+' >')
    }
        else{console.log("la")}
    for(var idx=0;idx<addName.length;idx++){
        addtoList(fieldName,addName[idx],state)
        pushItem(fieldName,addName[idx])
    }
}




function applyMask(fieldName,valEnable){
    $.each($('.checkItem[overlay="'+fieldName+'"]'), function(){
        var val=$(this).attr("value")
        console.log(val)
        whatto = val.replace(/\s+/g, '').replace("'", '').replace(",","").replace("(","").replace(")","").replace(/\./g, '')
        var p = valEnable.indexOf(val)
        if(p>-1){
            // console.log(p)
            $('input#'+whatto+'.checkItem').prop("disabled",false)
        }
        else{
            // console.log(p)
            $('input#'+whatto+'.checkItem').prop("disabled",true)
            $("input#"+whatto+'.checkItem').prop("checked",false)
        }

    })
}
var allFields = []
var allValues = []
function pushItem(fieldName,value){
    allValues.push({value:value, field:fieldName})
}

function master(field,value){
    // console.log("master function")
    // console.log(value)
    // console.log(field)
    var state = true
    // console.log(!state)
    $.ajax({
            type: "POST",
            url: "/ajx-read-checked",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                modifiedList: field,
                isChecked: value,
            }),
            success: function(data){
                console.log("encore une victoire de canard")
                if(field=="All"){
                    // console.log(data)
                    allFields=data["fieldsToGen"]
                    $.each(data["fieldsToGen"],function(index,fieldName){
                            genList(fieldName,data[fieldName])
                    })
                    allFields = allFields
                    // console.log(allValues)
                }
                else{
                    // console.log(data)
                    $.each(data["fieldsToGen"],function(index,fieldName){
                            applyMask(fieldName,data["enableValue"])
                    })
                 }
            },
            error: function(data){
                console.log("pouet pouet")
                console.log(data)

            }
    })
}
// Menu functions
function close_all() {
    $(".overlay-visible").toggleClass("overlay-visible").toggleClass("overlay-invisible");
};

function page_section_toggle() {
    $(".page-section, .circle").toggleClass("invisible-xs");
};

function page_section_smart() {
    if (!$(".page-section").hasClass("invisible-xs")) {
        setTimeout(page_section_toggle, 800);
    } else {
        page_section_toggle();
    };
};

function page_section_checker() {
    if (!$(".overlay").hasClass("overlay-visible")) {
        page_section_smart();
    } else {
        if (!$(".page-section").hasClass("invisible-xs")) {
            page_section_smart();
        } else {};
    };
};


$("document").ready(function(){
        urlParam = window.location.href
        urlMethod = urlParam.split('/')
        urlMethod = urlMethod[urlMethod.length-1]
        console.log(urlMethod != "log")
    $('.changeGame').on('click', function(){
        console.log(this.id)
        game_name = this.id
        if(urlMethod != "log"){
            generateDateSelector(game_name)
        }
    })
    if(urlMethod != "log"){
        generateDateSelector(game_name)
    }
});
$("document").ready(function(){
    master("All","All");
    // console.log(allFields)
    // console.log(allValues)
    //$('ul#masterList').on('change', function(targetName){
    //     var fieldModified=targetName.target.className
    //     var valueModified=targetName.target.id
    //     console.log("attention mesdames et messieurs")
    //     console.log(targetName.target)
    //     master(fieldModified,valueModified);
    // })



    // })
});
// Menu control
$(".overlay-menu").on('click', function(event) {
    var overlay = ".overlay-" + $(this).attr("overlay");
    if ($(overlay).hasClass("overlay-visible")) {
        close_all();
        page_section_checker();
    } else {
        close_all();
        $(overlay).toggleClass("overlay-invisible").toggleClass("overlay-visible");
        page_section_checker();
    };

    var attrSelector = $(".overlay-visible").attr("overlay");
    console.log(attrSelector);

// Close button control
$(".overlay-close").on('click', function() {
    close_all();
    page_section_checker();
});


$('.reset[overlay="'+ attrSelector +'"]').on('click', function() {
    $(':checkbox.checkItem').prop('checked', true);
    $(':checkbox.checkItem').prop('disabled', false);
    $('.checkAll').prop('checked', true)
});

// Checkbox control - inserter in menu to control the attSelector variable
$('.checkAll[overlay="'+ attrSelector +'"]').on('click', function() {
    console.log(attrSelector)
    $(':checkbox.checkItem:not(:disabled)[overlay="'+ attrSelector +'"]').prop('checked', this.checked);
});

$('.checkItem[overlay="'+ attrSelector +'"]').on('click', function() {
    console.log($("#gameList"))
    console.log($("input.checkItem:not(:disabled)"))
    console.log($("input.checkItem[disabled='']"))
    $('.checkAll[overlay="'+ attrSelector +'"]').attr('checked', false);
    console.log(!$('input.checkItem[overlay="'+ attrSelector +'"]').not(':checked').length > 0);
    if (!$('input.checkItem:not(:disabled)[overlay="'+ attrSelector +'"]').not(':checked').length > 0) {
        $('.checkAll[overlay="'+ attrSelector +'"]').prop('checked', true);
    };
});

$('.okButton[overlay="'+ attrSelector +'"]').on('click', function() {
    var allVals = [];
    var checkedItems = {};

    $.each(allFields,function(index,value){checkedItems[value] = [];})
    $('.checkItem:checked').each(function(){
        allVals.push($(this).val());
        fieldName = $(this).attr("overlay");
        checkedItems[fieldName].push($(this).val());
    });
    // checkedItems["install"].push();

    checkedItems['playdates'] = [$('#date_start_'+'playdates').attr("value"),$('#date_end_'+'playdates').attr("value")]
    checkedItems['installdates'] = [$('#date_start_'+'installdates').attr("value"),$('#date_end_'+'installdates').attr("value")]
    // $('#date_start_'+'installdates').attr("value")
    // $('#date_end_'+'installdates').attr("value")
    console.log(checkedItems)
    $(".checkItem[disabled='']").each(function(){

    })
    ///////////////////////////////////////////////////////////////////////////////
    //  uncomment to have interaction with python to check possible combination  //
    ///////////////////////////////////////////////////////////////////////////////
    // master(attrSelector,checkedItems)
    ///////////////////////////////////////////////////////////////////////////////
    close_all();
    page_section_checker();

});//end of checkbox control

});//end of menu control
