// For some request, api generates automatically excel or json file.
// output_format_request controls this format.
$('#output_format_request').attr('value','EXCEL')
        $('#output_format_request').text('EXCEL')
        $('#output_format_request').click(function(e){
            exc_json = 'JSON'
            if($('#output_format_request').attr('value')=='JSON')
            {exc_json = 'EXCEL'}
            $('#output_format_request').attr('value',exc_json)
            $('#output_format_request').text(exc_json)
        })



// generate list for modal box
function modal_newListItem(classItem,idItem,nameItem,descriptionItem){
    console.log(nameItem)
    var lii = '<li id='+idItem+' title="'+nameItem+'" class='+classItem+'> <h3 class="icon icon-wallet gameChange" >'+nameItem+'</h3>'

    if (typeof(descriptionItem)==='undefined'){
        lii = lii + '</li>'
    }
    else{
        lii = lii + '<p>'+descriptionItem+'</p></li>'
    }
    console.log(lii)
    return $(lii)
}


function genRequestList(input){
    // console.log($('ul#requestList li'))
    $("#requestList li").remove()
    // $("#requestList li:contains('request')").remove()
    // console.log($('ul#requestList li'))

    $.each(input, function(d,v){
        $("#requestList").append(modal_newListItem('projectL',d,v['name']))
    })
    $("#selectedRequest").text($("#requestList li")[0].title)
    $("#selectedRequest").attr('value',$("#requestList li")[0].id)

}

$.ajax({
    type: 'GET',
    url:'/projectList',
    contentType: "application/json; charset=utf-8",
    success: function(data){
        project_list_glob = data;
        $.each(data, function(d,v){
            $("#projectList").append(modal_newListItem('projectL',d,v['name'],v['desc']))

        })
        $("#selectedProject").text($("#projectList li")[0].title)
        $("#selectedProject").attr('value',$("#projectList li")[0].id)

        genRequestList(data[$("#projectList li")[0].id]['opt'])
        // applyModalCSS()
    },
    error: function(data){
        console.log('projectList error')
        console.log(data)
    }
});
$(window).load(function(){
    applyModalCSS()
    $("#projectList li").on('click',function(e){
        console.log("click project")
        $("#selectedProject").text($(this)[0].title)
        $("#selectedProject").attr('value',$(this)[0].id)
        genRequestList(project_list_glob[$(this)[0].id]['opt'])
        applyModalCSS()
    })
    $("#requestList").on('click','li',function(e){
        console.log('click request')
        console.log($("#requestList"))
        console.log()
        $("#selectedRequest").text($(this)[0].title)
        $("#selectedRequest").attr('value',$(this)[0].id)
    })



    $('.modal-button[overlay="runRequest"]').on('click', function() {
        var request_params = {};
        request_params['start_date'] = $('#date_start_playdates_main').attr('value')
        request_params['end_date'] = $('#date_end_playdates_main').attr('value')
        request_params['project_name'] = $("#selectedProject").attr("value")
        request_params['request_name'] = $("#selectedRequest").attr("value")
        request_params['output_format'] = $('#output_format_request').attr('value')
        request_params['site_id'] = $('#output_format_request').attr('value')
        console.log(request_params)
        URL = "/project/" + 'camp'//request_params["project_name"]
        console.log(URL)
        $.ajax({
            type: 'POST',
            //url: $SCRIPT_ROOT + "/ajx-generate-checkbox",
            url: URL,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                request_params,
            }),
            success: function(data){
                    var endCallDate = new Date();
                    console.log("SUCCESS: "+" executed")
                    console.log(request_params)
                    console.log(data)
                    if(data['download'] == 1){
                        filename = data['filename']
                        URL_download = '/download/'+filename;
                        // var a = document.createElement("a");
                        // a.href = '/download/'+filename;
                        // a.download = "data.xls";
                        // document.body.appendChild(a);
                        // a.click();
                        // a.remove();
                        window.open(URL_download, '_blank');
                    }
                    console.log('over')
            },
            error: function(data){
                    var endCallDate = new Date();
                    console.log("FAIL: "+request_params)
                    console.log(request_params)
                    console.log(data)

            }
        });

    })

})


$(window).load(function(){
    console.log('doc ready for modal')
    var myMenu = new mlPushMenu( document.getElementById( 'mp-menu' ), document.getElementById( 'trigger' ) );

    function modal(modalID,spanClickClose){
         // Get the modal
        var modal = document.getElementById('myModal-'+modalID);
        // Get the button that opens the modal
        var btn = document.getElementById("modal-button-"+modalID);
        // Get the <span> element that closes the modal
        var span = document.getElementById("modal-close-"+modalID);
        var bod = document.getElementById("modal-body-"+modalID);
        // When the user clicks on the button, open the modal

        btn.onclick = function() {
                modal.style.display = "block";
        }
        span.onclick = function() {
                modal.style.display = "none";
        }
        // When the user clicks on <span> (x), close the modal
        if(spanClickClose==true){
            bod.onclick = function(){
                modal.style.display = "none";
            }
        }
    }
    modal('dates',false);
    modal('project',true);
    modal('request',true);

    window.onclick = function(event) {
        ['dates','project','request'].forEach(function(d,v){
            modal = document.getElementById('myModal-'+d)
            if (event.target == modal) {
                modal.style.display = "none";
            }
        })
    }
    })
