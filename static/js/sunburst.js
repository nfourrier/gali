function sunburst(error,dataJson,extraParam){
    // Dimensions of sunburst.
    // console.log(extraParam)
    // console.log(typeof(dataJson))
    // console.log(dataJson)
    var margin = {top: extraParam.height*0.15, right: extraParam.width*0.01, bottom: extraParam.height*0.1, left: extraParam.width*0.01},
        width = extraParam.width - margin.left - margin.right,
        height = extraParam.height*0.9 - margin.top - margin.bottom;


    // var width = extraParam.width;
    // var height = extraParam.height;
    var radius = Math.min(width*0.85, height) / 2;
    height = radius*2


    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    var y = d3.scale.linear()
        .range([0, radius]);

    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
    var b = {
      w: 75, h: 30, s: 3, t: 10
    };

    // make `colors` an ordinal scale
    var colors = d3.scale.category20();

    // Total size of all segments; we set this later, after loading the data.
    var totalSize = 0;
    // console.log(extraParam.htmlID)
    // console.log(d3.select("#"+extraParam.htmlID))
    var svg = d3.select("#"+extraParam.htmlID+" svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var vis = svg.append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("id", "container_"+extraParam.htmlID)
        .attr("transform", "translate(" + 0.8*width / 2 + "," + height / 2 + ")");

    var partition = d3.layout.partition()
        .size([2 * Math.PI, radius * radius])
        .value(function(d) { return d.size; });

    var arc = d3.svg.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x + d.dx; })
        .innerRadius(function(d) { return Math.sqrt(d.y); })
        .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });


    // svg.append('div')
    //     .attr('id','sequence')
    //     .attr("width", width)
    //     .attr("height", height/10)

    // svg.append('div')
    //     .attr('id','explanation')
    //     .style("visibility","hidden")
    //     .append('span')
    //     .attr('id','percentage')


    // Use d3.csv.parseRows so that we do not need to have a header
    // row, and can receive the csv as an array of arrays.

    //var text = getText();
    //var csv = d3.csv.parseRows(text);
    //var json = buildHierarchy(csv);
    // var json = getData();

    var json = dataJson;
    // console.log(json)
    createVisualization(json);
    makeSlideTitle(svg,width/2,-height/10,width,height,margin,extraParam)
    function computeTextRotation(d) {
        // console.log((x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180)
        return (d.x + d.dx / 2 - Math.PI / 2) / Math.PI * 180;
    }
    // Main function to draw and set up the visualization, once we have the data.
    function createVisualization(json) {

      // Basic setup of page elements.
      initializeBreadcrumbTrail();

      d3.select("#togglelegend").on("click", toggleLegend);

      // Bounding circle underneath the sunburst, to make it easier to detect
      // when the mouse leaves the parent g.
      vis.append("svg:circle")
          .attr("r", radius)
          .style("opacity", 0);

      // For efficiency, filter nodes to keep only those large enough to see.
      var nodes = partition.nodes(json)
          .filter(function(d) {
            var tabName = d.name.split("_")
            d.name = tabName[0]
            // d.extraName = "Day "+tabName[1]
          return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
          });
        extraName_table = []
        var uniqueNames = (function(a) {
            var output = [];
            a.forEach(function(d) {
                if (output.indexOf(d.name) === -1 && d.depth>0) {
                    output.push(d.name);
                }
                // if(d.depth > 0 && extraName_table[d.depth])

                if(extraName_table.filter(function(aa){return aa.depth==d.depth}).length == 0 && d.depth > 0){
                    var dxTmp = Math.PI/10+((d.depth+2)%3)*Math.PI/12
                    extraName_table.push({depth:d.depth,column:d.column,x:0,y:d.y,dy:d.dy,dx:dxTmp})
                }

            });
            return output;
        })(nodes);

      // set domain of colors scale based on data
      colors.domain(uniqueNames);

      // make sure this is done after setting the domain
      drawLegend();



      var test = vis.data([json])

        var path = test.selectAll("path")
          .data(nodes)
          .enter().append("svg:path")
          .attr('class','path_'+extraParam.htmlID)
          .attr("display", function(d) { return d.depth ? null : "none"; })
          .attr("d", arc)
          .attr("fill-rule", "evenodd")
          .style("fill", function(d) { return colors(d.name); })
          .style("opacity", 1)
          .on("mouseover", mouseover);
        totalSize = path.node().__data__.value;
        var textPath = test.selectAll("text")
          .data(nodes)
          .enter().append("svg:text")
          .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
            .attr("x", function(d) { return Math.sqrt(d.y); })
            .style("font", radius/20+"px "+fontName)
            .style("font-weight","bolder")
            .text(function(d){
                var percentage = (100 * d.value / totalSize).toPrecision(2);
                var percentageString = percentage + "%";
                if (percentage < 3) {
                    percentageString = "";
                }
                if (percentage == 100) {
                    percentageString = "";
                }
                if(d.x+d.dx < 0.22*Math.PI){
                    percentageString = "";
                }
                return percentageString;
            })


    var circleTitle = vis.selectAll("container_"+extraParam.htmlID)
        .data(extraName_table)
        .enter()
        .append("g")
        .attr("class",".circleTitle_"+extraParam.htmlID)
        // .each(function(d){
            // console.log(d)

    circleTitle.append("text")
            .attr("x", function(d) { return Math.sqrt(d.y + d.dy); })
            .attr('text-anchor','end')
            .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
            .style("font", radius/15+"px "+fontName)
            .style("font-weight","bolder")
            .text(function(d){return d.column});

        // console.log(extraName_table)
        // textPath2 = vis.selectAll("text")
        //   .data(extraName_table)
        //   .enter().append("svg:text")
        //   //.attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
        //     .attr("x", function(d) { return Math.sqrt(d.y); })
        //     .style("font", radius/20+"px "+fontName)
        //     .style("font-weight","bolder")
        //     .text(function(d){
        //         console.log(d,nodes)
        //         return d.extraName;
        //     })

      // Add the mouseleave handler to the bounding circle.
      d3.select("#container_"+extraParam.htmlID).on("mouseleave", mouseleave);

      // Get total size of the tree = value of root node from partition.
      totalSize = path.node().__data__.value;
     };

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    function mouseover(d) {
        percentage = " "
        if(typeof (d) != "undefined"){
          var percentage = (100 * d.value / totalSize).toPrecision(3);
          var percentageString = percentage + "%";
          if (percentage < 0.1) {
            percentageString = "< 0.1%";
          }

          d3.select("#per2_"+extraParam.htmlID)
                .attr('transform','translate('+radius*0.4+' ,'+radius*0.2+')')
                .style("font",radius/5+"px "+fontName)
                // .style({align:'center',
                //     position:'relative',
                //     left:(-radius*0.1)+'px',
                //     top:(-radius*0.1)+'px',
                //     width:(radius*0.2)+'px',
                //     height:(radius*0.2)+'px'
                // })
                // .style("font", radius/5+"px "+fontName)
                // .style("visibility", "")
                .attr("text-anchor", "middle")
              .text(percentageString);
        // console.log($('#percentage'))
        // console.log(d3.select("#percentage"))
        // console.log(radius/2)

          d3.select("#exp_"+extraParam.htmlID)
              .style("visibility", "");

          var sequenceArray = getAncestors(d);
          updateBreadcrumbs(sequenceArray, percentageString);

          // Fade all the segments.
          d3.selectAll(".path_"+extraParam.htmlID)
              .style("opacity", 0.3);

          // Then highlight only those that are an ancestor of the current segment.
          vis.selectAll(".path_"+extraParam.htmlID)
              .filter(function(node) {
                        return (sequenceArray.indexOf(node) >= 0);
                      })
              .style("opacity", 1);
        }
    }

    // Restore everything to full opacity when moving off the visualization.
    function mouseleave(d) {

      // Hide the breadcrumb trail
      d3.select("#trail_"+extraParam.htmlID)
          .style("visibility", "hidden");

      // Deactivate all segments during transition.
      d3.selectAll(".path_"+extraParam.htmlID).on("mouseover", null);

      // Transition each segment to full opacity and then reactivate it.
      d3.selectAll(".path_"+extraParam.htmlID)
          .transition()
          .duration(1000)
          .style("opacity", 1)
          .each("end", function() {
                  d3.select(this).on("mouseover", mouseover);
                });

      d3.select("#exp_"+extraParam.htmlID)
          .transition()
          .duration(1000)
          .style("visibility", "hidden");
    }

    // Given a node in a partition layout, return an array of all of its ancestor
    // nodes, highest first, but excluding the root.
    function getAncestors(node) {
      var path = [];
      var current = node;
      while (current.parent) {
        path.unshift(current);
        current = current.parent;
      }
      return path;
    }

    function initializeBreadcrumbTrail() {
      // Add the svg area.
      // d3.select("#sequence").style({
      //     position:'relative',
      //           left:(radius*0.1)+'px',
      //           top:(2*radius*0.9)+'px',
      //           width:(radius*0.2)+'px',
      //           height:(radius*0.2)+'px'
      //       });
        // d3.select("#explanation").style({
        //   position:'relative',
        //         left:(radius*0.1)+'px',
        //         top:(2*radius*0.9)+'px',
        //         width:(radius*0.2)+'px',
        //         height:(radius*0.2)+'px'
        //     });
    var perText = d3.select("#exp_"+extraParam.htmlID).append("svg:svg")
          .attr('x',0.25*width)
          .attr('y',0.75*radius+margin.top)
          .attr("width", radius)
          .attr("height", radius)
          .attr("id", "per_"+extraParam.htmlID)
          ;
    perText.append("svg:text")
        .attr("id", "per2_"+extraParam.htmlID);

      var trail = d3.select("#seq_"+extraParam.htmlID).append("svg:svg")
          .attr('x',0.1*width)
          .attr('y',1.1*height+margin.top)
          .attr("width", width)
          .attr("height", 500)
          .attr("id", "trail_"+extraParam.htmlID)
          ;
      // Add the label at the end, for the percentage.
      trail.append("svg:text")
        .attr("id", "endlabel_"+extraParam.htmlID);

    // trail.append("svg:text")
    //     .attr("id","perc");
        // .style("fill", "#000");
    }

    // Generate a string that describes the points of a breadcrumb polygon.
    function breadcrumbPoints(d, i) {
      var points = [];
      points.push("0,0");
      points.push(b.w + ",0");
      points.push(b.w + b.t + "," + (b.h / 2));
      points.push(b.w + "," + b.h);
      points.push("0," + b.h);
      if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + (b.h / 2));
      }
      return points.join(" ");
    }

    // Update the breadcrumb trail to show the current sequence and percentage.
    function updateBreadcrumbs(nodeArray, percentageString) {

      // Data join; key function combines name and depth (= position in sequence).
      var g = d3.select("#trail_"+extraParam.htmlID)
          .selectAll("g")
          .data(nodeArray, function(d) { return d.name + d.depth; });

      // Add breadcrumb and label for entering nodes.
      var entering = g.enter().append("svg:g");

      entering.append("svg:polygon")
          .attr("points", breadcrumbPoints)
          .style("fill", function(d) { return colors(d.name); });

      entering.append("svg:text")
          .attr("x", (b.w + b.t) / 2)
          .attr("y", b.h / 2)
          .style("font",radius/20+"px "+fontName)
          .style("font-weight", "bolder")
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          // .text(function(d) { return d.name; });
          .text(function (d) {
            if (d!=undefined) {
                var lines = wordwrap2(d.name)
                output = lines[lines.length-1]
                for (var i = 0; i < lines.length-1; i++) {
                    output = lines[i][0]+"."+output
               }
               return output
            }
        })

      // Set position for entering and updating nodes.
      g.attr("transform", function(d, i) {
        return "translate(" + i * (b.w + b.s) + ", 0)";
      });

      // Remove exiting nodes.
      g.exit().remove();

      // Now move and update the percentage at the end.
      d3.select("#trail_"+extraParam.htmlID).select("#endlabel_"+extraParam.htmlID)
          .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(percentageString);

      // d3.select("#exp_"+extraParam.htmlID).select("#perc")
      //     // .attr("x", 0.4*width)
      //     // .attr("y", 1)
      //     .style("font", radius/5+"px "+fontName)
      //     .style("font-weight","bolder")
      //     .attr("dy", "0.35em")
      //     .attr("text-anchor", "middle")
      //     .text(percentageString);

      // Make the breadcrumb trail visible, if it's hidden.
      d3.select("#trail_"+extraParam.htmlID)
          .style("visibility", "");

    }
    function wordwrap2(text) {
       var lines=text.split(" ")
       return lines
    }
    function drawLegend() {

      // Dimensions of legend item: width, height, spacing, radius of rounded rect.
    var li = {
    w: width*0.15, h: radius/10, s: radius/100, r: radius/100
    };

        // })

    var legend = svg.append("svg:svg")
      .attr("width", li.w)
      .attr('x',width*0.85)
      .attr("height", colors.domain().length * (li.h + li.s));

    var g = legend.selectAll("g")
      .data(colors.domain())
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });


    g.append("svg:rect")
        .attr("rx", li.r)
        .attr("ry", li.r)
        .attr("width", li.w)
        .attr("height", li.h)
        .style("fill", function(d) { return colors(d); });
    g.append("svg:text")
        .attr("x", li.w / 2)
        .attr("y", li.h / 2)
        .text(function (d) {
            if (d!=undefined) {
                var lines = wordwrap2(d)
                output = lines[lines.length-1]
                for (var i = 0; i < lines.length-1; i++) {
                    output = lines[i][0]+"."+output
               }
               return output
            }
        })
        .style("font",function(d){
            // console.log(d3.select(this)[0][0])
            // console.log($(this))
            // console.log($(this)[0].__data__)
            return radius/20+"px "+fontName;
        })
        .style("font-weight", "bolder")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        ;
            //text.node().getBBox().width


    }
    function toggleLegend() {
      var legend = d3.select("#legend");
      if (legend.style("visibility") == "hidden") {
        legend.style("visibility", "");
      } else {
        legend.style("visibility", "hidden");
      }
    }

    // Take a 2-column CSV and transform it into a hierarchical structure suitable
    // for a partition layout. The first column is a sequence of step names, from
    // root to leaf, separated by hyphens. The second column is a count of how
    // often that sequence occurred.
    function buildHierarchy(csv) {
      var root = {"name": "root", "children": []};
      for (var i = 0; i < csv.length; i++) {
        var sequence = csv[i][0];
        var size = +csv[i][1];
        if (isNaN(size)) { // e.g. if this is a header row
          continue;
        }
        var parts = sequence.split("-");
        var currentNode = root;
        for (var j = 0; j < parts.length; j++) {
          var children = currentNode["children"];
          var nodeName = parts[j];
          var childNode;
          if (j + 1 < parts.length) {
       // Not yet at the end of the sequence; move down the tree.
        var foundChild = false;
        for (var k = 0; k < children.length; k++) {
          if (children[k]["name"] == nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
      // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = {"name": nodeName, "children": []};
          children.push(childNode);
        }
        currentNode = childNode;
          } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = {"name": nodeName, "size": size};
        children.push(childNode);
          }
        }
      }
      return root;
    };

    // function getData() {
    //     return {
    //  "name": "ref",
    //  "children": [
    //   {
    //    "name": "june11",
    //    "children": [
    //     {
    //      "name": "atts",
    //          "children": [
    //           {"name": "early", "size": 11},
    //           {"name": "jcp", "size": 40},
    //           {"name": "jcpaft", "size": 50},
    //           {"name": "stillon", "size": 195},
    //           {"name": "jo",

    //              "children": [
    //               {"name": "early",  "size": 100},
    //               {"name": "jcp", "size": 67},
    //               {"name": "jcpaft", "size": 110},
    //               {"name": "stillon", "size": 154},

    //               {"name": "sus1",
    //                 "children": [
    //                   {"name": "early",  "size": 11},
    //                     {"name": "jcp", "size": 118},
    //                   {"name": "jcpaft", "size": 39},
    //                       {"name": "stillon", "size": 2779}
    //                   ]
    //                 },

    //                {"name": "sus5",
    //                  "children": [
    //                   {"name": "early",  "size": 0},
    //                   {"name": "jcp", "size": 64},
    //                   {"name": "jcpaft", "size": 410},
    //                      {"name": "stillon", "size": 82}
    //                   ]
    //                 },

    //                {"name": "sus9",
    //                  "children": [
    //                   {"name": "early",  "size": 1018},
    //                   {"name": "jcp", "size": 3458},
    //                   {"name": "jcpaft", "size": 106},
    //                      {"name": "stillon", "size": 243}
    //                   ]
    //                 },

    //                {"name": "sus13",
    //                  "children": [
    //                   {"name": "early",  "size": 110},
    //                   {"name": "jcp", "size": 190},
    //                   {"name": "jcpaft", "size": 80},
    //                      {"name": "stillon", "size": 9190},
    //                      {"name": "allsus", "size": 3970}
    //                      ]
    //                     }

    //                  ]
    //               }
    //          ]
    //         },

    //       {"name": "noatt", "size": 30}
    //     ]
    //     }

    //  ]
    // };
    // };
}


