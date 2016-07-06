function loadSpieFromLocation (loc, chartArea) {
     var spieData = response;

        var ctx = document.getElementById(chartArea).getContext("2d");
        window.mySpie = new Chart(ctx).Spie(spieData, {
            responsive:true,
            animationEasing : "easeInCubic",
            showScale: false,
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%><ul><% for (var j=0; j<segments[i].slices.length; j++){%><li><span style=\"background-color:<%=segments[i].slices[j].fillColor%>\"></span><%if(segments[i].slices[j].label){%><%=segments[i].slices[j].segmentLabel%><%}%></li><%}%></ul><%}%></li></ul>",

    });
}
