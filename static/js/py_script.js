
    var allValues = []
    function pushItem(fieldName,value){
        allValues.push({value:value, field:fieldName})
    }

    var gamename = 'iaa';
    var scriptname = 'churnAnalysis'
    //var urlIN = "/listOptions/"+gamename+"/"scriptname
    $.ajax({
            type: "GET",
            url: "/listOptions/".concat(gamename).concat("/").concat(scriptname),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                console.log("encore une victoire de canard")
                data[scriptname].forEach(function(d){
                    pushItem(scriptname,d)})
            },
            error: function(data){
                console.log("pouet pouet")
                console.log(data)

            }
    })


    $(function(){
  // setup autocomplete function pulling from currencies[] array
    $('#autocomplete').autocomplete({
    lookup: allValues,

    onSelect: function (suggestion) {
            console.log(suggestion)
            console.log("ic")
      var thehtml = '<strong>Search Name:</strong> ' + suggestion.value + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
    $('#outputcontent').html(thehtml);

    queue()
            .defer(d3.json, "/scatter/iaa/churnAnalysis_"+suggestion.value)
            .defer(extraGraphParam,
                $("#gph_dashMain").width(),
                $("#gph_dashMain").height(),
                ["#00FF00","#ffb6c1","#008080","#8b4513"],
                "Scatter",
                "scatter_akl",
                "x_name",
                "y_name",
                "shop")
            // .defer(extraGraphParam,
            //     $(".slides").width(),
            //     $(".slides").height(),
            //     ["#fff","#fff","#fff","#fff"],
            //     "Dayly Active Users",
            //     "dailyAU_GGI_akl",
            //     "iaa",
            //     "date",
            //     "shop")
            .await(scatterPlot)

    }
  });


    });

    console.log($('.okButton[overlay="display"]'))
    $('.okButton[overlay="display"]').on('click', function() {
        console.log('here')
        var allVals = [];
        var checkedItems = {};
        queue()
            .defer(d3.json, "/scatter/iaa/churnAnalysis")
            .defer(extraGraphParam,
                $("#gph_dashMain").width(),
                $("#gph_dashMain").height(),
                ["#e31a1c","#ffb6c1","#008080","#8b4513"],
                "Scatter",
                "scatter_akl",
                "x_name",
                "y_name",
                "shop")
            // .defer(extraGraphParam,
            //     $(".slides").width(),
            //     $(".slides").height(),
            //     ["#fff","#fff","#fff","#fff"],
            //     "Dayly Active Users",
            //     "dailyAU_GGI_akl",
            //     "iaa",
            //     "date",
            //     "shop")
            .await(scatterPlot)


        // $.each(allFields,function(index,value){checkedItems[value] = [];})
        // $('.checkItem:checked').each(function(){
        //     allVals.push($(this).val());
        //     fieldName = $(this).attr("overlay");
        //     console.log(fieldName)
        //     console.log($(this).val())
        //     console.log(checkedItems)
        //     checkedItems[fieldName].push($(this).val());
        // });
        // $(".checkItem[disabled='']").each(function(){

        // })
        // master(attrSelector,checkedItems)
        // close_all();
        // page_section_checker();

    });//end of checkbox control


function scatterPlot(error,data, extraParam){
    console.log(data)
    colorTable = extraParam.color

    console.log(extraParam.color)

    xMax = d3.max(data, function(d){return d.x})
    xMin = d3.min(data, function(d){return d.x})
    yMax = d3.max(data, function(d){return d.y})
    yMin = d3.min(data, function(d){return d.y})
    colorMax = d3.max(data, function(d){return d.color})
    colorMin = d3.min(data, function(d){return d.color})
    sizeMax = d3.max(data, function(d){return d.size})
    sizeMin = d3.min(data, function(d){return d.size})

    colorRange = [1,20]
    sizeRange = [extraParam.height/60,extraParam.height/30]
    function sizeNormalization(d){
        if(sizeMax-sizeMin>0.01){
            return sizeRange[0]+(d-sizeMin)/(sizeMax-sizeMin)*(sizeRange[1]-sizeRange[0])
        }
        else{
            return sizeRange[1]
        }
    }
    console.log(sizeMin,sizeMax,sizeRange)

    xMax =  xMax + (xMax-xMin)*0.05
    xMin =  xMin - (xMax-xMin)*0.05
    yMax =  yMax + (yMax-yMin)*0.05
    yMin =  yMin - (yMax-yMin)*0.05

    if(colorTable.length<(colorMax-colorMin)){
        colorTable = colorTable.concat(["#d34e50", "#e7cbe4", "#7feab6", "#acff19", "#3498db", "#827fca", "#287070", "#44bbbb", "#d96f6f", "#d04c4c", "#d8b6c2", "#b6d8cc", "#5f2d3f", "#b26e87", "#9f4b69", "#dccbe7", "#abf9ff", "#b8b2fe", "#ffd700", "#0099cc", "#3399ff", "#4099ff", "#ffe4e1", "#c39797", "#fa8072", "#ffc3a0", "#f6546a", "#efdea1" , "#ddb5d5" , "#ff7832" , "#32b9ff" , "#002fa7" , "#5700ff" , "#b0f6a0"]);
    }

    console.log(colorTable.length)

    var margin = {top: extraParam.height*0.15, right: 10, bottom: extraParam.height*0.1, left: extraParam.height*0.2},
        width = extraParam.width - margin.left - margin.right,
        height = extraParam.height*0.9 - margin.top - margin.bottom;


    d3.select("#"+extraParam.htmlID).select('svg').remove();

    var svg = d3.select("#"+extraParam.htmlID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear()
        .domain([xMin, xMax])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([yMin, yMax])
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(10)
        .tickPadding(12)
        .tickSize(3)
        .orient('left');

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var colorLegend = []

    svg.selectAll()
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return sizeNormalization(d.size);})
        .style("opacity", 0.3)
        .style("fill", function(d) {
            if(colorLegend.indexOf(d.color)==-1){colorLegend.push(d.color)}
            return colorTable[d.color-colorMin];})
        .attr("cx", function(d) {return x(d.x); })
        .attr("cy", function(d) {return y(d.y); });

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+height+")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);


    var legend = svg.selectAll(".legend")
      .data(colorLegend, function(d) { return d; })
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (0.7*width) + "," +(height/20 + i * height/20) + ")"; });

    legend.append("rect")
      .attr("width", height/20)
      .attr("height", height/20)
      .style("fill", function(d,v) {return colorTable[d-colorMin]; });
    legend.append("text")
      .attr("x", 1.2*height/20)
      .attr("y", height/40)
      .style("text-anchor",'start')
      .style("font", height/35+"px Arial")
      .attr("dy", height/60)
      .text(String);


}
