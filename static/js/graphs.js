queue()
    .defer(d3.json, "/donorschoose/projects")
    .defer(d3.json, "static/geojson/us-states.json")
    .await(makeGraphs);




function makeGraphs(error, projectsJson, statesJson) {


    //Clean projectsJson data
    var donorschooseProjects = projectsJson;
    console.log(projectsJson[0].total_donations);
    console.log(projectsJson);
    console.log(projectsJson[0].total_donations);
    var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
    console.log(projectsJson);
    //var dateFormat = d3.time.format("%Y-%m-%d");
    console.log(projectsJson);
    console.log("3" + error);
    console.log(statesJson);
    for(i = 0; i < donorschooseProjects.length; i++)
    {
        donorschooseProjects[i]["date_posted"] = dateFormat.parse(donorschooseProjects[i]["date_posted"]);
        donorschooseProjects[i].total_donations = 100+donorschooseProjects[i].total_donations;
    }
    /*
    donorschooseProjects.forEach(function(d) {
        //d["date_posted"] = "2015-08-05";
        //d["date_posted"] = dateFormat.parse(d["date_posted"]);
        //d["date_posted"].setDate(1);
        console.log("ici");
        //d["total_donations"] = 100+d["total_donations"];
    });
*/
    console.log(projectsJson[0].total_donations);
    console.log(donorschooseProjects);
    //Create a Crossfilter instance
    var ndx = crossfilter(donorschooseProjects);
    var dim = {};
    console.log(ndx);
    //Define Dimensions (think column of a tabular)
    //dimension that maps to the date of the row
    var dateDim = ndx.dimension(function(d) { return d["date_posted"]; });
    dim.resourceTypeDim = ndx.dimension(function(d) { return d["resource_type"]; });
    console.log(dim.resourceTypeDim)
    var povertyLevelDim = ndx.dimension(function(d) { return d["poverty_level"]; });
    var stateDim = ndx.dimension(function(d) { return d["school_state"]; });
    var totalDonationsDim  = ndx.dimension(function(d) { return d["total_donations"]; });


    //Calculate metrics
    //create a grouping by all values in the desired dimension, and count the number of items with that value
    var numProjectsByDate = dateDim.group();
    var numProjectsByResourceType = dim.resourceTypeDim.group();
    console.log(numProjectsByResourceType)
    var numProjectsByPovertyLevel = povertyLevelDim.group();
    var totalDonationsByState = stateDim.group().reduceSum(function(d) {
        return d["total_donations"];
    });

    var all = ndx.groupAll();
    var totalDonations = ndx.groupAll().reduceSum(function(d) {return d["total_donations"];});

    var max_state = totalDonationsByState.top(1)[0].value;

    //Define values (to be used in charts)
    var minDate = dateDim.bottom(1)[0]["date_posted"];
    var maxDate = dateDim.top(1)[0]["date_posted"];
    console.log(minDate)
    console.log(maxDate)
    console.log(numProjectsByDate.top(10))
    //Charts
    var timeChart = dc.barChart("#time-chart");
    var resourceTypeChart = dc.rowChart("#resource-type-row-chart");
    var povertyLevelChart = dc.rowChart("#poverty-level-row-chart");
    var usChart = dc.geoChoroplethChart("#us-chart");
    var numberProjectsND = dc.numberDisplay("#number-projects-nd");
    var totalDonationsND = dc.numberDisplay("#total-donations-nd");

    numberProjectsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d; })
        .group(all);

    totalDonationsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d; })
        .group(totalDonations)
        .formatNumber(d3.format(".3s"));

    timeChart
        .width(600)
        .height(160)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dateDim)
        .group(numProjectsByDate)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxis().ticks(4);

    resourceTypeChart
        .width(300)
        .height(250)
        .dimension(dim.resourceTypeDim)
        .group(numProjectsByResourceType)
        .xAxis().ticks(8);

    povertyLevelChart
        .width(300)
        .height(250)
        .dimension(povertyLevelDim)
        .group(numProjectsByPovertyLevel)
        .xAxis().ticks(4);


    usChart.width(1000)
        .height(330)
        .dimension(stateDim)
        .group(totalDonationsByState)
        .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
        .colorDomain([0, max_state])
        .overlayGeoJson(statesJson["features"], "state", function (d) {
            return d.properties.name;
        })
        .projection(d3.geo.albersUsa()
                    .scale(600)
                    .translate([340, 150]))
        .title(function (p) {
            return "State: " + p["key"]
                    + "\n"
                    + "Total Donations: " + Math.round(p["value"]) + " $";
        })

    dc.renderAll();

};

$(".dropdown dt a").on('click', function () {
          $(".dropdown dd ul").slideToggle('fast');
      });

      $(".dropdown dd ul li a").on('click', function () {
          $(".dropdown dd ul").hide();
      });

      function getSelectedValue(id) {
           return $("#" + id).find("dt a span.value").html();
      }

      $(document).bind('click', function (e) {
          var $clicked = $(e.target);
          if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
      });


      $('.mutliSelect input[type="checkbox"]').on('click', function () {

          var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
              title = $(this).val() + ",";

          if ($(this).is(':checked')) {
              var html = '<span title="' + title + '">' + title + '</span>';
              $('.multiSel').append(html);
              $(".hida").hide();
          }
          else {
              $('span[title="' + title + '"]').remove();
              var ret = $(".hida");
              $('.dropdown dt a').append(ret);

          }
      });


