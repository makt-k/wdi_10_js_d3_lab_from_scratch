window.onload = function() {

  d3.csv('data.csv', function(error, rows) {
    var color = d3.scale.category20();
    var bar_width = 25;
    var current_offset = 0;
    var multipler = 3;
    var nested_data = d3.nest()
                        .key(function(d) { return d.category} )
                        .entries(rows);
    var margin = {top: 80, right: 80, bottom: 80, left: 80},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var employment = d3.select("#employment");
    var axisScale = d3.scale.linear().domain([0, d3.max(rows.map(function(d)
      {return +d.percent_employed}))]).range([height,0]);
    var yAxis = d3.svg.axis().scale(axisScale).ticks(4).tickSize(1).orient('left');

    employment.selectAll("g")
      .data(nested_data)
      .enter()
        .append("g")
        .attr("transform", function(d, i) {
          if (i > 0) {
            current_offset += nested_data[i-1].values.length  * bar_width;
          }
          return "translate(" + current_offset + ", 0)"})
        .selectAll("rect")
        .data(function(group) { return group.values; })
        .enter()
          .append("rect")
          .style("fill", function(d) { return color(d.category) })
          .attr("height", function(d) { return +d.percent_employed * multipler})
          .attr("y", function(d) { return (113.5 - +d.percent_employed) * multipler })
          .attr("x", function(d, i) { return (bar_width) * i })
          .attr("width", bar_width - 4);

      employment
          .append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(30, 30)')
            .selectAll('text')
            .data(nested_data)
            .enter()
              .append('text')
              .text(function(d) { return d.key; })
              .attr('y', function(d, i) { return 12 * i })
              .style('fill', function(d) { return color(d.key); })

      var yAxisGroup = employment.append('g')
                                  .attr('transform', 'translate(bar_width, 0)')
                                  .call(yAxis);

  });

};
