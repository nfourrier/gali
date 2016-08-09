







// var dataCircle = [
//       {index: .8, text: "test",  value: 3/60},
//       {index: .6, text: "test",  value: 30/70},
//       {index: .5, text: "test",    value: 30/70},
//       {index: .3, text: "test",     value: 30/70},
//       {index: .2, text: "Revenue",          value: 20/70},
//       {index: .1, text: "DAU",              value: 50/50},
//     ];
    var colors = {
    'pink': '#E1499A',
    'yellow': '#f0ff08',
    'green': '#47e495'
};




var referenceF = {index: 0.7, text: "reference",  value: 10, maximum: 60}
var mainF = {index: 0.8, text: "main",  value: 4, maximum: 60}
var innerCircleText = d3.format('.0%')(0.1);
//updateProgressCircle(slideCircle,referenceF,mainF,-12.35548)


function computeVariation(mainValue,referenceValue){
    if(Math.abs(referenceValue)<0.1){
        output = 0.00001
    }
    else{
        output = 100*(mainValue-referenceValue)/referenceValue;
    }
    return output
}

function variationFormat(number){
    if(number>=0){sig = "+";}
    else{sig = "-";}
    if(number<1){
        return number.toFixed(1)+'%'
    }
    else{
        return d3.format('.2s')(number)+'%';
    }
}


function updateProgressCircle(circle,referenceField,mainField,variation){
        var durationTime = 2000;
        var svg = d3.select(circle.id)


        // console.log(referenceField,variation)
        // legend
        if(variation>0){
            var variationSymbol = {"orient":'triangle-up', "color":colorTriangleUp};
        }
        else{
            var variationSymbol = {"orient":'triangle-down', "color":colorTriangleDown};
            variation = -variation;
        }
        var triangle = d3.svg.symbol().type(variationSymbol.orient)
                    .size(5*circle.radius);


        var gt = d3.select("."+circle.id+"_legend")
        gt.transition()
            .duration(durationTime)
            .style("fill", variationSymbol.color);

        gt.select("."+circle.id+"_path").transition()
            .duration(durationTime)
            .attr("d",triangle);

        var gg = d3.select("."+circle.id+"_legend").select("."+circle.id+"_text");
        gg.transition()
            .duration(durationTime)
            // .style("fill", "#00FF00")
            .tween("text", function(d){
                var i = d3.interpolateNumber(Math.abs(parseFloat(this.textContent)), variation);
                return function(t){this.textContent = variationFormat(i(t));};
            })
            ;


        var gta=d3.select("."+circle.id+"_innerText")
        gta.transition()
            .duration(durationTime)
            .tween("text", function(d){
                var i = d3.interpolateNumber(gta.attr("value"), mainField.value);
                return function(t){this.textContent = circle.innerFormat(i(t));};
            })
            .each('end',function(){gta.attr("value",mainField.value)})
            ;


        function updateArc(id,circleIN,newField){
            var back_foreIN = "foreground";
            var fieldValue = newField.value;
            if(id.indexOf("background")>-1){back_foreIN="background";fieldValue=newField.valueBack}
            var garc=d3.selectAll(id);
            garc.transition()
            .duration(durationTime)
            .attrTween("d", function(d){return updateARC2(circleIN,newField,d3.select(this).attr("value"),back_foreIN);})
            .each('end',function(){garc.attr("value",fieldValue)})
            ;
        }
        function updateArcBack(id,circleIN,newField){
            // if(id.indexOf("background")>-1){newField.value=newField.valueBack;console.log(circleIN)}
            var garc=d3.selectAll(id);
            garc.transition()
            .duration(durationTime)
            .attrTween("d", function(d){return updateARC(circleIN,newField,d3.select(this).attr("value"));})
            .each('end',function(){garc.attr("value",newField.valueBack)})
            ;
        }


        id2update = "."+circle.id+"_foreground_main"
        updateArc(id2update,circle,mainField)
        id2update1 = "."+circle.id+"_background_main"
        updateArc(id2update1,circle,mainField)

        id2update2 = "."+circle.id+"_foreground_reference"
        updateArc(id2update2,circle,referenceField)
        id2update3 = "."+circle.id+"_background_reference"
        updateArc(id2update3,circle,referenceField)
        // var garc=d3.selectAll("."+circle.id+"_foreground_main");
        // garc.transition()
        //     .duration(5000)
        //     .attrTween("d", function(d){return updateARC2(circle,mainField,d3.select(this).attr("value"));})
        //     .each('end',function(){garc.attr("value",mainField.value)})
        //     ;

        // garc.transition()
        //     .duration(5000)
        //     .attrTween("d", function(d){return updateARC2(circle,mainField,d3.select(this).attr("value"));})
        //     .each('end',function(){garc.attr("value",function(d){return d.value})})
        //     ;
        svg = null
        id2update = null
        id2update1 = null
        id2update2 = null
        id2update3 = null
        updateArc = null
        updateArcBack = null
        variationSymbol = null
        triangle = null
        // console.log(circle)
}




function makeProgressCircle(circle,variation){
    // console.log(circle.colorText)
    var textColor = circle.colorText[0]
    var margin = {top: 0, right: 0, bottom: 0, left: 0}
    // var radius = Math.min(circle.width, circle.height) / 2.5,
    //   spacing = .1;

    // var color = d3.scale.linear()
    //   .range(["hsl(-180,50%,50%)", "hsl(180,50%,50%)"])
    //   .interpolate(interpolateHsl);

    // var arc = d3.svg.arc()
    //   .startAngle(0)
    //   .endAngle(function(d) {return d.value/d.maximum * 2 * Math.PI; })
    //   .innerRadius(function(d) { return d.index * circle.radius; })
    //   .outerRadius(function(d) { return (d.index + circle.spacing) * circle.radius; });


    var svg = d3.select("#"+circle.id).append("svg")
      .attr("width", circle.width)
      .attr("height", circle.height)
    .append("g")
      .attr("transform", "translate(" + circle.width / 2 + "," + circle.height / 2 + ")");

    var field = svg.selectAll("g")
      .data(circle.data)
    .enter().append("g");

    field.append("path");

    var twoPi = Math.PI * 2;


var defs = svg.append('defs');

// var filter = defs.append('filter')
//     .attr('id', 'blur');


// filter.append('feGaussianBlur')
//     .attr('in', 'SourceGraphic')
//     .attr('stdDeviation', circle.radius/20);

    field = field
        .each(function(d) {this._value = d.value; })
        .data(circle.data)
        .each(function(d) { d.previousValue = this._value; });

    field.select("path")
      .attr('class', function(d){return circle.id+'_background_'+d.text;})
      .attr('fill', function(d,idx){if(d.text=='main'){return '#ccc';}else{return circle.getColor(idx)}})
      .attr('fill-opacity', 0.4)
      .attr('stroke-opacity', 1)
      .attr('value',function(d){return d.valueBack;})
      .attr('d', function(d){return initARC(circle,d,"background")});



    field.append('path')
        .attr('class', function(d){return circle.id+'_foreground_'+d.text;})
        .attr('fill', function(d,idx){return circle.getColor(idx);})
        .attr('stroke', function(d,idx){return circle.getColor(idx);})
        .attr('fill-opacity', 0.1)
        .attr('stroke-width', circle.radius/20)
        .attr('stroke-opacity', 1)
        .attr('filter', 'url(#blur)')
        .attr('value',function(d){return d.value;})
        .attr('d', function(d){return initARC(circle,d,"foreground")})
        // .transition()
        //       // .ease("elastic")
        //       .duration(function(d){return 10000;})
        //       .attrTween("d", function(d){return updateARC(circle,d)})
        ;



    field.append('path')
        .attr('class', function(d){return circle.id+'_foreground_'+d.text;})
        .attr('fill', function(d,idx){return circle.getColor(idx);})
        .attr('value',function(d){return d.value;})
        .attr('fill-opacity', 1)
        .attr('d', function(d){return initARC(circle,d,"foreground")})
        // .transition()
        //       .duration(10000)
        //       // .ease("elastic")
        //       .attrTween("d", function(d){return updateARC(circle,d)})
        ;


    var innerText = svg.selectAll()
            .data("0")
            .enter().append("g")
            .style("font", 0.3*circle.radius+"px "+fontName)
            .attr("transform", function() { return "translate(0,"+0*circle.radius+")";});
    innerText.append('text')
        .attr("class", circle.id+"_innerText")
        .style("font", 0.35*circle.radius+"px "+fontName)
        .style("font-weight","bold")
        .attr('text-anchor', 'middle')
        .text(circle.innerFormat($.grep(circle.data, function (e){return e.text=="main"})[0].value))
        .attr("value",0)
        .attr('fill', textColor)
        .attr('dy', '.35em');

    var span_element = document.createElement("span");
    document.body.appendChild(span_element);
    var svgTmp = d3.select(span_element).append("svg")
            .attr("width", circle.width)
            .attr("height", 1.2*circle.height)
            .append("g")
            .attr("transform", "translate(" + circle.width / 2 + "," + circle.height / 2 + ")");

    var text = svgTmp.append("text")
                .text(circle.title)
                .attr("text-anchor",'middle')
                .attr("x", 0)
                .attr("y", -circle.radius)
                .style("font-weight", "bolder");


    var titleText = svg.selectAll()
            .data("0")
            .enter().append("g")
            // .style("font", 0.3*circle.radius+"px")
            //.attr("transform", function() { return "translate(0,"-2*circle.radius+")";});
    titleText.append("text")
          .attr("class",circle.id+"_title")
          .attr("type","text")
          .attr("text-anchor", "middle") //center the text on it's origin
          .attr("x", 0)
          .attr("y", -circle.radius*1)
          //.attr("value",variation)
          .style("fill", textColor)
          .style("font",
            function(d){
                title_fontSize = 0.3*circle.radius
                title_width = circle.width+1
                while(title_width*1.1>=circle.width){
                    text.style("font",title_fontSize+"px "+fontName)
                    title_width = text.node().getBBox().width
                    title_fontSize = title_fontSize - 1
                }
                return title_fontSize+"px "+fontName
            })
          .style("font-weight", "bolder")
          .text(circle.title);
    // extraParam = circle

    // makeSlideTitle(svg,circle.width,circle.height,margin,extraParam)




    if(variation){
        if(variation>0){
            var variationSymbol = {"orient":'triangle-up', "color":"#18bd35"}
        }
        else{
            var variationSymbol = {"orient":'triangle-down', "color":"#ef3737"}
        }
        var triangle = d3.svg.symbol().type(variationSymbol.orient)
                    .size(5*circle.radius);

        var legend = svg.selectAll()
            .data("0")
            .enter().append("g")
                .attr("class", circle.id+"_legend")
                .attr("transform", function(d) {return "translate(0,"+1.2*circle.radius+")";})
                .style("fill", variationSymbol.color);

        legend.append("path")
          .attr("class",circle.id+"_path")
          .attr("d",triangle)
          .attr("text-anchor", "middle")
          .attr("transform", function() { return "translate("+(-circle.radius*0.5)+","+(-circle.radius*0.08)+")";})
          // .attr("x",-40)
          // .attr("y",-20)
          ;

        formatPercent = d3.format(".3n")
        legend.append("text")
          .attr("class",circle.id+"_text")
          .attr("type","text")
          .attr("text-anchor", "middle") //center the text on it's origin
          .attr("x", 0)
          .attr("y", 0)
          //.attr("value",variation)
          .style("fill", textColor)
          .style("font", 0.3*circle.radius+"px "+fontName)
          .style("font-weight","bolder")
          .text(variationFormat(variation));
    }




    function color(d){
        return d.color;
    }




    // field.select("text")
    //     .attr("dy", function(d) { return d.value < .5 ? "-.5em" : "1em"; })
    //     .text(function(d) { return d.text; })
    //   .transition()
    //     .ease("elastic")
    //     .attr("transform", function(d) {
    //       return "rotate(" + 360 * d.value + ")"
    //           + "translate(0," + -(d.index + spacing / 2) * radius + ")"
    //           + "rotate(" + (d.value < .5 ? -90 : 90) + ")"
    //     })
    //     ;



    // Avoid shortest-path interpolation.
    function interpolateHsl(a, b) {
    var i = d3.interpolateString(a, b);
    return function(t) {
      return d3.hsl(i(t));
    };
    }
}

    function updateARC2(circle,d,previousValue,back_fore){

        // var arc = d3.svg.arc()
        //     .startAngle(0)
        //     .innerRadius(function(d) { return d.index * circle.radius; })
        //     //.endAngle(function(d) { return d.value; });
        var twoPi = Math.PI * 2;
        circle.arc.outerRadius(function(d) { return (d.index + circle.getSpacing(d["text"])) * circle.radius; });
        if(back_fore=="background"){
            var i = d3.interpolateNumber(previousValue/d.maximum*twoPi, d.valueBack/d.maximum*twoPi);
        }
        else{
            var i = d3.interpolateNumber(previousValue/d.maximum*twoPi, d.value/d.maximum*twoPi);
        }
        return function(t) {circle.arc.endAngle(i(t));return circle.arc(d); };
        // circle.arc.endAngle(d.value/d.maximum*twoPi);
        // return circle.arc(d);
    }

    function initARC(circle,d,back_fore){
        var twoPi = Math.PI * 2;
        circle.arc.outerRadius(function(d) { return (d.index + circle.getSpacing(d["text"])) * circle.radius; });
        // var i = d3.interpolateNumber(0, d.value/d.maximum*twoPi);
        if(back_fore=="background"){
            circle.arc.endAngle(function(d){return d.valueBack/d.maximum*twoPi;});
        }
        else{
            circle.arc.endAngle(function(d){return d.value/d.maximum*twoPi;});
        }
        return circle.arc(d);
    }

    // function innerARC(circle,d){
    //     var twoPi = Math.PI * 2;
    //     circle.arc.outerRadius(function(d) { return (d.index + circle.getSpacing(d["text"])) * circle.radius; });
    //     console.log(d.valueBack)
    //     circle.arc.endAngle(function(d){return d.valueBack/d.maximum*twoPi});
    //     return circle.arc(d);
    // }
