====
gali
====
python-flask-celery-js-D3
-------------------------

Create an API to execute tasks automatically (crontab) and manually though a web interface.
The interface also allows to display results using D3.


JS libraries used: reveal, mp-menu.


To generate a slide, the process is the following:
    - given any pandas dataframe, export to json file using:
        "df.to_json(orient='index',path_or_buf=filename,date_unit='s')"
    - in JS, go to static/js/slideMain.js and add the following:
        queue()
                    .defer(d3.json, "/loadADDjson/"+game_name+"/jsonFilename")
                    .defer(extraGraphParam,// defined in genericGraphsFct.js
                        $(".slides").width(),
                        $(".slides").height(),
                        stackBarColor,
                        titleSlideColor,
                        "Monthly Revenue per country",
                        "monthlyRevenue_country_akl",
                        game_name,
                        "date", // x key
                        "revenue", // y key
                        "country") // group key
                    .await(stackBar)
            addNewSlide('monthlyRevenue_country_akl')

        this command generates a slide containing a stack bar chart (alternating between percentages and absolute values). 'date', 'revenue' and 'country' are column names from the dataframe. The graph shows revenue per country through time.


