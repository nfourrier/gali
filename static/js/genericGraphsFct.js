urlParam = window.location.href
last_param = urlParam.split('/')
last_param = last_param[last_param.length-1]
console.log(urlParam,last_param)
if(["iaa","countryfriends","testing","log"].indexOf(last_param)<0){
    last_param = 'testing'
}


if(urlParam.indexOf("slides") > -1){
    displaySequence = 1
}

if(last_param=="iaa"){
    game_name = "iaa"
    fontName = "nicoFont"
    game_fullname = "NICOLAS"
    displaySequence = 1
    colorTheme1 = "#535353" //text
    colorTheme2 = "#f7f7f7" //top
    colorTheme3 = "#ecf2f6" //left
    colorTheme4 = "#ffffff" //slide
    stackBarColor = ["#8297a8","#9fc2c4","#facdae","#fc9d9b","#f3565d"]
    circleColor = ['#b2a6e5','#15a4fa','#cfdbe2']
    colorTriangleUp = "#18bd35"
    colorTriangleDown = "#ef3737"
    revealColor = "#42affa"
    revealColorHover = "#8dcffc"
}
else if(last_param=="countryfriends"){
    game_name = "countryfriends"
    game_fullname = "Slides 2"
    displaySequence = 1
    fontName = "nicoFont"
    colorTheme1 = "#eeeeee"
    colorTheme2 = "#373737"
    colorTheme3 = "#3d3d3d"
    colorTheme4 = colorTheme3
    stackBarColor = ["#fddf3c","#ff8869","#c2fcca","#52dae4","#3ca8c7"]
    circleColor = ['#76ffdb','#784d91','#cfdbe2']
    colorTriangleUp = "#60ff73"
    colorTriangleDown = "#f64f37"
    revealColor = "#fddf3c"
    revealColorHover = "#ff8869"
}
else if((last_param=="testing") || (last_param=="log")){
        game_name = "iaa"
        fontName = "nicoFont"
        colorTheme1 = "#EEE"
        colorTheme1 = "#B9B1A8"
        colorTheme1 = "#535353" // text
        colorTheme2 = "#b6b6b6" // background
        colorTheme3 = "#0b4970" //top bar and section title
        colorTheme4 = "#0000ff"
        stackBarColor = ["#fddf3c","#ff8869","#c2fcca","#52dae4","#3ca8c7"]
        circleColor = ['#76ffdb','#784d91','#cfdbe2']
        colorRed = "#ff0000"
        $("body").css({"background":colorTheme2})
        $(".overlay").css({"background":colorTheme2})
        $(".section-title").css({"color":colorTheme3})
        $(".nav-zoom").css({"background-color":colorTheme3})
        $(".radio-custom:checked .radio-custom-label:before").css({
            "color":colorRed
        })
        $(".navmenu-dropdown").css({
            "top":"0px",
            "left":"0px"
        })
        console.log($(".checkbox-custom"))
        revealColor = "#fddf3c"
        revealColorHover = "#ff8869"
}
console.log(game_name)
console.log(last_param)

applyThemeCSS()

// stackBarColor = ["#8297a8","#9fc2c4","#facdae","#fc9d9b","#f3565d"]
// titleSlideColor = "#535050"
stackBarTimer = 33000
dailyCircleTimer = 50000
weeklyCircleTimer = 3600*1000
var lvStream = [];
// var game_name = 'iaa'
// var fontName = "nicoFont"
// var colorMain = "#535353"
// var colorSubPanel = "#f7f7f7"
downIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32"> <path  d="M16 18l8-8h-6v-8h-4v8h-6zM23.273 14.727l-2.242 2.242 8.128 3.031-13.158 4.907-13.158-4.907 8.127-3.031-2.242-2.242-8.727 3.273v8l16 6 16-6v-8z"></path> </svg> '
function addDownloadIcon(divID){
  downIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32"> <path  d="M16 18l8-8h-6v-8h-4v8h-6zM23.273 14.727l-2.242 2.242 8.128 3.031-13.158 4.907-13.158-4.907 8.127-3.031-2.242-2.242-8.727 3.273v8l16 6 16-6v-8z"></path> </svg> '
  return '<div class="btn2"><a class="download-btn" overlay="'+divID+'" > '+downIcon+'</a><span class="transparent">by NFO</span></div>'
  // return '<div class="btn2"><a class="download-btn" overlay="'+divID+'" > '+downIcon+'</a></div>'
}

function applyModalCSS(){
    $(".modal-button, .modal-body ul li").css({
                "color": colorTheme1,
                "background": colorTheme3,
                'font': fontName,
                'font-size':h_total_glob/30
        }).mouseenter(function(){
            $(this).css({
                "color": colorTheme3,
                "background": colorTheme1
            })
        }).mouseleave(function(){
            $(this).css({
                "color": colorTheme1,
                "background": colorTheme3
            })
        })
}

function applyThemeCSS(){
    console.log(colorTheme1,colorTheme2,colorTheme3,game_name)
    textCircleColor = [colorTheme1,colorTheme1]
    colorMain = colorTheme1
    colorSubPanel = colorTheme2
    titleSlideColor = colorTheme1
    textSlideColor = colorTheme1

    fontName = "nicoFont"

    $("body").css({"color":colorTheme1})
    $(".panelContainer").css({"background":colorTheme3});
    $(".slideContainer").css({"background":colorTheme4});
    $(".container").css({"background":colorTheme3});//#34495e
    $(".codrops-top").css({"background":colorTheme2})
    $(".axis path").css({'stroke': '#ff0000'});
    $(".modal-header, .modal-footer").css({
            'font': fontName,
            'background-color': colorTheme1,
            'color':colorTheme2})
    $(".modal-content, .modal-close").css({
            'color':colorTheme2
    })
    $("#headerLogo a").mouseenter(function(){
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
    $("#headerLogo a").css({
        "color": colorTheme1,
        "fill": colorTheme1,
        "background": colorTheme2
    })
    $(".modal-button, .projectL").css({
            "color": colorTheme1,
            "background": colorTheme3,
            'font': fontName,
            'font-size':h_total_glob/30
    }).mouseenter(function(){
        $(this).css({
            "color": colorTheme3,
            "background": colorTheme1
        })
    }).mouseleave(function(){
        $(this).css({
            "color": colorTheme1,
            "background": colorTheme3
        })
    })
    $(".reveal .progress span").css({
        "background": revealColor
    })
    $(".reveal .progress").css({
        "background":revealColorHover
    })
    $(".reveal .controls .navigate-left, .reveal .controls .navigate-left.enabled").css({
        "border-right-color": revealColor,
        "opacity":0.8
    })
    $(".reveal .controls .navigate-left.enabled").mouseenter(function(){
        $(this).css({
            // "border-right-color": revealColorHover
            "opacity":0.3
        })
    }).mouseleave(function(){
        $(this).css({
            "opacity":0.8
        })
    })

    $(".reveal .controls .navigate-right, .reveal .controls .navigate-right.enabled").css({
        "border-left-color": revealColor
    })
    $(".reveal .controls .navigate-right.enabled").mouseenter(function(){
        $(this).css({
            // "border-right-color": revealColorHover
            "opacity":0.3
        })
    }).mouseleave(function(){
        $(this).css({
            "opacity":0.8
        })
    })

    $(".reveal .controls .navigate-up, .reveal .controls .navigate-up.enabled").css({
        "border-bottom-color": revealColor
    })
    $(".reveal .controls .navigate-up.enabled").mouseenter(function(){
        $(this).css({
            // "border-right-color": revealColorHover
            "opacity":0.3
        })
    }).mouseleave(function(){
        $(this).css({
            "opacity":0.8
        })
    })

    $(".reveal .controls .navigate-down, .reveal .controls .navigate-down.enabled").css({
        "border-top-color": revealColor
    })
    $(".reveal .controls .navigate-up.enabled").mouseenter(function(){
        $(this).css({
            // "border-right-color": revealColorHover
            "opacity":0.3
        })
    }).mouseleave(function(){
        $(this).css({
            "opacity":0.8
        })
    })

    // console.log($(".reveal .controls .navigate-left, .reveal .controls .navigate-left.enabled"))
    // revealLeftRight = ["left","right","up","down"]
    // revealLeftRight_inv = ["right","left","bottom","top"]
    // revealLeftRight.forEach(function(d,v){
    //     d_inv = revealLeftRight_inv[v]
    //     border_color = "border-"+d_inv+"-color"
    //     reveal_object = ".reveal .controls .navigate-"+d+", .reveal .controls .navigate-"+d+".enabled"
    //     console.log(d,d_inv)
    //     console.log(reveal_object,border_color)

    //     $(reveal_object).css({
    //         border_color: revealColor
    //     })
    //     console.log($(reveal_object))

    //     $(".reveal .controls .navigate-"+d+".enabled")
    //     .mouseenter(function(){
    //         $(this).css({
    //             border_color: revealColorHover
    //         })
    //     }).mouseleave(function(){
    //         $(this).css({
    //             border_color: revealColor
    //         })
    //     })
    // })


}

function extraGraphParam(width,height,color,titleColor,title,htmlID,game,xKey,yKey,groupKey,callback){
        var output = {}
        output["width"] = width
        output["height"] = height
        output["color"] = color
        output["titleColor"] = titleColor
        output["title"] = title
        output["htmlID"] = htmlID
        output["game"] = game
        output["xKey"] = xKey
        output["yKey"] = yKey
        output["groupKey"] = groupKey
        callback(null,output)
    }

function floor_decimal(numb){
    var output = [numb.toFixed(0), (100*(numb%1)).toFixed(0)]
    return output
}


function date2string(dateIN){
    var month_ = castInt(dateIN.getMonth()+1)
    var date_ = castInt(dateIN.getDate())
    return dateIN.getFullYear().toString()+"/"+month_+"/"+date_
}

function castInt(valueIN){
    var str = "" + valueIN
    var pad = "00"
    return pad.substring(0, pad.length - str.length) + str
}

function getDailyFlaskRoute(gameIN,dateIN){
    console.log('loadJson')
    var month_ = castInt(dateIN.getMonth()+1)
    var date_ = castInt(dateIN.getDate())
    return"/loadJson/"+gameIN+"/"+dateIN.getFullYear().toString()+"/"+month_+"/"+date_
}

function getFakeToday(delay_additional){
    if(!delay_additional){delay_additional = 0;}
    var delay_utc = 12*3600;
    var delay_gmmdb = 3*3600;
    var delay_studio = 2*3600;

    var now = new Date().getTime();
    delay_utc = -(new Date()).getTimezoneOffset()*60
    // getTimezoneOffset is given in minutes
    return new Date(now-(delay_utc+delay_gmmdb+delay_studio+delay_additional)*1000);
}
function submit_download_form(output_format,eltID)
{
    console.log(output_format)
    console.log(eltID)
    // Get the d3js SVG element
    var tmp = document.getElementById(eltID);
    console.log(tmp)
    var svg = tmp.getElementsByTagName("svg")[0];
    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);

    // Submit the <FORM> to the server.
    // The result will be an attachment file to download.
    var form = document.getElementById("svgform");
    form['output_format'].value = output_format;
    form['data'].value = svg_xml ;
    console.log(form)
    // form.submit();
}

function addCR(svg,x,y,width,height,margin,extraParam){
    // svg.append('g').append("text")
    //       .attr("class", "copyright")
    //       .attr("text-anchor",'middle')
    //       .attr("x", x)
    //       .attr("y", y)
    //       //.attr("id", "cocu")
    //       .text("Nicolas Fourrier")
    // console.log(svg)
    // svg = d3.select("#"+graphID+" g")
    // svg = document.createElementNS
    console.log(svg)
    console.log(x)
    r=Math.min(width,height)/30
    d=r*2
    cx=0.9*width
    cy=1.15*height
    x=width
    y=height*1.15


    svg = svg.append("g")
        .attr("class","tmpDOWN")
    svg.append("path")
    .attr("id", "wavy") //very important to give the path element a unique ID to reference later
    .attr("d", " M "+cx+" "+cy+" m -"+r+", 0 a "+r+","+r+" 0 1,0 "+d+",0 a "+r+","+r+" 0 1,0 -"+d+",0 ")
    .style("fill", "none")
    .style("stroke", "none");

//Create an SVG text element and append a textPath element
    svg.append("text")
    .attr("x", x)
    .attr("y", y)
    .style("font",(0.85*r)+"px "+fontName)
    .style("text-anchor","end") //place the text halfway on the arc
    .text("generated by NF")
    svg.append("text")
    .append("textPath") //append a textPath to the text element
    .attr("xlink:href", "#wavy") //place the ID of the path here
    .style("text-anchor","middle") //place the text halfway on the arc
    .attr("startOffset", "85%")
    .style("font",(0.85*r)+"px "+fontName)
    .text("N F");
    console.log(svg[0][0])
    return svg[0][0]
}

function addCR2(width,height){
    // svg.append('g').append("text")
    //       .attr("class", "copyright")
    //       .attr("text-anchor",'middle')
    //       .attr("x", x)
    //       .attr("y", y)
    //       //.attr("id", "cocu")
    //       .text("Nicolas Fourrier")
    // console.log(svg)
    // svg = d3.select("#"+graphID+" g")
    // svg = document.createElementNS
    x=width
    y=height*0.99
    r=Math.min(width,height)/40
    d=r*2
    cx=0.9*width
    cy=1*height

    var globElement = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    document.body.appendChild(globElement);
    globElement.setAttribute("id",'lala')
    newElement = d3.select("#lala")


    newElement.append("path")
    .attr("id", "wavy") //very important to give the path element a unique ID to reference later
    .attr("d", " M "+cx+" "+cy+" m -"+r+", 0 a "+r+","+r+" 0 1,0 "+d+",0 a "+r+","+r+" 0 1,0 -"+d+",0 ")
    .style("fill", "none")
    .style("stroke", "none");

    newElement.append("text")
    .attr("x", x)
    .attr("y", y)
    .style("font",(0.85*r)+"px "+fontName)
    .style("text-anchor","end") //place the text halfway on the arc
    .text("generated by NF")
    newElement.append("text")
    .append("textPath") //append a textPath to the text element
    .attr("xlink:href", "#wavy") //place the ID of the path here
    .style("text-anchor","middle") //place the text halfway on the arc
    .attr("startOffset", "85%")
    .style("font",(0.85*r)+"px "+fontName)
    .text("N F");
    console.log(newElement)
    // d3.select(globElement).remove()
    // newElement.setAttribute("x", x)
    // newElement.setAttribute("y", y)
    // newElement.setAttribute("text-align","right")
    // A = 'font: '+(0.85*r)+"px "+fontName+";text-anchor = start;text-align:right"
    // newElement.setAttribute("style",A)
    // // newElement.style.font = (0.85*r)+"px "+fontName
    // // newElement.style.text-anchor = 'end'
    // newElement.innerHTML =  "generated by Nicolas Fourrier"
    // console.log(newElement)
    return globElement
}

function makeSlideTitle(svg,x,y,width,height,margin,extraParam){
    var span_element = document.createElement("span");
    document.body.appendChild(span_element);
    // console.log(height,margin)
    var svgTmp = d3.select(span_element).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var text = svgTmp.append("text")
                .text(extraParam.title)
                .attr("text-anchor",'middle')
                .attr("x", width/2)
                .attr("y", -width/10)
                .style("font-weight", "bold");

        svg.append('g').append("text")

          .attr("class", "title")
          .attr("text-anchor",'middle')
          .attr("x", x)
          .attr("y", y)
          //.attr("id", "cocu")
          .text(extraParam.title)
          // .attr("dy", ".35em")
          .style("fill", extraParam.titleColor)
          .style("font",
            function(d){
            title_fontSize = height/10
            title_width = width + margin.left + margin.right+1
            while(title_width*1.1>=width){
                text.style("font",title_fontSize+"px "+fontName)
                title_width = text.node().getBBox().width
                title_fontSize = title_fontSize - 1
            }
           return title_fontSize+"px "+fontName
          })
          .style("font-weight", "bold");
           //.call(wrap, 200);
    d3.select(span_element).remove()
    span_element = null
    text = null
    svgTmp = null
}




