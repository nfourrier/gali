function chartLine(error,dataJson,extraParam){
    console.log(extraParam)
    console.log(extraParam.yKey)

    // console.log(dataJson)
    // console.log(extraParam)
    var timezoneOffset = new Date(dataJson[0].date*1000)
    var yList = [];
    var yListTmp = [];
    var yValue = [];
    var xList = [];

    var StackData = [];
    // if(extraParam.groupKey!=dataJson[0])
    if(!(extraParam.groupKey in dataJson[0])){
        dataJson.forEach(function(d){
            d[extraParam.groupKey] = "myResult"
        })
    }
    var isPercent = 0
    if(["Retention","ARPU","CSR","ARPU","ARPPU"].indexOf(extraParam.yKey) > -1){
        sortKey = "AU_"
        isPercent = 1
    }
    else if(extraParam.title.indexOf("retention")){
        sortKey = "AU_"
        isPercent = 1
        console.log(extraParam.title)
    }
    else{
        sortKey = extraParam.yKey
    }
    dataJson.forEach(function(d) {
        // if(extraParam.htmlID=="day7_country_akl_line"){console.log(d)}
        // console.log(d)
        // if(extraParam.yKey=="CSR"){
        //     console.log(d)
        //     }
        // console.log(d)
        // console.log(new Date(d[extraParam.xKey]*1000))
        if(xList.indexOf(Number(d[extraParam.xKey]*1000))==-1){
            xList.push(d[extraParam.xKey]*1000)
        }
        d[extraParam.xKey] = new Date(d[extraParam.xKey]*1000);
        // if(extraParam.htmlID=="day7_ggi_akl_line"){console.log(d)}
        d.x = d3.time.format("%Y-%m-%d")(d[extraParam.xKey]);
        d.x2 = d[extraParam.xKey];//new Date(d.date.getFullYear(),d.date.getMonth(),d.date.getDate());
        // console.log(d.x2)
        // if(xList.indexOf(Number(d.x2))==-1){
        //     xList.push(d.x2)
        // }
        if(yListTmp.indexOf(d[extraParam.groupKey])==-1){
            //TestData.push(d.shop)
            StackData[d[extraParam.groupKey]] = []
        }
        //StackData[d.shop].push({"name":d.x,"values":d.AU})
        StackData[d[extraParam.groupKey]].push({xName:0,x:d.x2,y:d[extraParam.yKey],y0:0})//.push({"name":d.x,"values":d.AU})

        if(yListTmp.indexOf(d[extraParam.groupKey])==-1){
            //yList.push({'shop':d.shop,'value':d.AU})
            yListTmp.push(d[extraParam.groupKey])
            yValue[d[extraParam.groupKey]] = d[sortKey]
            // yList.push([d[extraParam.groupKey],d[extraParam.yKey]])

        }
        else{
            yValue[d[extraParam.groupKey]] += d[sortKey]
            //console.log(d[extraParam.groupKey],yList)
            //yList[d[extraParam.groupKey],d[extraParam.yKey]] = d[extraParam.yKey]
        }

    });
    dataJson.sort((function(a,b){return a[extraParam.xKey]-b[extraParam.xKey]}))


    yListTmp.forEach(function(d){
        yList.push([d,yValue[d]])
    })
    console.log(yList)



    var margin = {top: extraParam.height*0.15, right: extraParam.width*0.01, bottom: extraParam.height*0.1, left: extraParam.width*0.15},
        width = extraParam.width - margin.left - margin.right,
        height = extraParam.height*0.9 - margin.top - margin.bottom;
// console.log(width,height,extraParam.height)
    $("#"+extraParam.htmlID).empty()
    var svg = d3.select("#"+extraParam.htmlID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    xList.sort(function(a,b){return a-b;})

    // console.log(yList)
    yList.sort(function(a,b){return b[1]-a[1]})
    console.log(yList)
    yList = yList.map(function(d){return d[0]})
    console.log(yList)
    if(yList.indexOf("Other-")>-1){
        yList.splice(yList.indexOf("Other-"),1)
        yList.push("Other-")
    }

    // console.log(yList)

    // console.log(yList)

    console.log(yList)
    var maxLengthList = 3
    var dataNest = d3.nest()
        .key(function(d) {return d[extraParam.groupKey];})
        .sortKeys(function(a,b){
            return yList.indexOf(a)-yList.indexOf(b)
        })
        .entries(dataJson);
    console.log(dataNest)
    // dataNest[maxLengthList]
    console.log(extraParam.groupKey,maxLengthList)
    dataNest.forEach(function(d){console.log(d)})
        if(yList.length>=maxLengthList-1){
            esssai = dataNest.reduce(function(rec,other,idx){
                console.log(other.key,idx,other.values)
                console.log(rec.key,idx)
                console.log(other.values[5]["date"],other.values[5]["Value"],other.values[5]["AU_"])
                console.log(rec.values[5]["date"],rec.values[5]["Value"],rec.values[5]["AU_"])

                var yKey = extraParam.yKey
                var xKey = extraParam.xKey
                var gpKey = extraParam.groupKey

                if(idx==maxLengthList){
                    console.log('here')
                    for(var xdx=0;xdx<xList.length;xdx++){
                        rec.key = "Other"
                        if(rec.values[xdx][xKey].getTime()==(new Date(xList[xdx])).getTime()){
                            // console.log(rec.values[xdx][gpKey])
                            rec.values[xdx][gpKey] = "Other"
                            if(isPercent == 1){
                                rec.values[xdx][yKey] = rec.values[xdx][yKey]
                            }
                            rec.values[xdx][xKey] = new Date(xList[xdx]);
                            // rec.values[xdx][yKey] = 0
                        }
                        else{
                            tmpObj = {}
                            tmpObj[gpKey] = "Other"
                            tmpObj[xKey] = new Date(xList[xdx])
                            tmpObj[yKey] = 0
                            rec.values.splice(xdx,0,tmpObj)
                        }
                    }
                }

                if(idx>maxLengthList){
                    otherCounter = 0
                    // console.log(extraParam.groupKey,maxLengthList)
                    // if(extraParam.htmlID=="day7_ggi_akl_line"){console.log(other,rec)}
                    for(var xdx=0;xdx<xList.length;xdx++){
                        // console.log(rec.values[xdx][gpKey])
                        // if(extraParam.htmlID=="day7_ggi_akl_line"){console.log(xdx,xKey,other.values[xdx])}
                        // console.log(xdx,xKey,rec.values[xdx])
                        // console.log(other.values[xdx][xKey].getTime()==rec.values[otherCounter][xKey].getTime(),other.values[xdx][xKey],rec.values[otherCounter][xKey])
                        // console.log(other.values)
                        // console.log(rec.values[xdx][xKey].getTime()==other.values[otherCounter][xKey].getTime(),rec.values[xdx][xKey],other.values[otherCounter][xKey])
                        // console.log(other.values[xdx])
                        if(rec.values[xdx][xKey].getTime()==other.values[xdx][xKey].getTime()){
                            if(isPercent == 1){

                                normRec = rec.values[xdx]["AU_"]
                                normOth = other.values[xdx]["AU_"]
                                // console.log(normRec,normOth)
                                rec.values[xdx][yKey] = (rec.values[xdx][yKey]*normRec + other.values[xdx][yKey] *normOth) / (normRec+normOth)
                                rec.values[xdx]["AU_"] =rec.values[xdx]["AU_"]+other.values[xdx]["AU_"]
                            }
                            else{
                                // console.log('here')
                                rec.values[xdx][yKey] = rec.values[xdx][yKey] + other.values[xdx][yKey]
                            }
                            // otherCounter = otherCounter + 1
                        }
                        else{
                            // console.log(rec.values[xdx],other.values[xdx],"la")
                            other.values.splice(xdx,0,0)
                            // console.log(other.values)
                        }
                    }
                }
                return rec
            },dataNest[maxLengthList])
        dataNest.splice(maxLengthList,9999)
        dataNest.push(esssai)
    }
    // console.log(dataNest)

}
