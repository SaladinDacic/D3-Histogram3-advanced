var width = 800;
var height = 600;
var padding = 50;
var barPadding = 1;
var ageData = regionData.filter(d => d.medianAge !== null);


var xScale = d3.scaleLinear()
                 .domain(d3.extent(ageData, d => d.medianAge))
                 .rangeRound([padding, width - padding]);

var histogram = d3.histogram()
                    .domain(xScale.domain())
                    .thresholds(xScale.ticks())
                    .value(d=>d.medianAge);

var bins = histogram(ageData);


var yScale = d3.scaleLinear()
                .domain([0, d3.max(bins, d=>d.length)])
                .range([height-padding, padding]);

var xAxis = d3.axisBottom(xScale)
    .tickSize(-height + 2*padding)
    .tickSizeOuter(0);

var yAxis = d3.axisLeft(yScale);
    // .tickSize(-width)
    // .tickSizeOuter(0);

var svg= d3.select("svg")
    .attr("width", width)
    .attr("height", height)

d3.select("input")
    .property("value", bins.length)
    .on("input", ()=>{
        var binCount = +d3.event.target.value;
        histogram.thresholds(xScale.ticks(binCount));
        bins = histogram(ageData);
        yScale = d3.scaleLinear()
                .domain([0, d3.max(bins, d=>d.length)])
                .range([height-padding, padding]);
        d3.select(".y-axis")
            .call(d3.axisLeft(yScale));

        d3.select(".x-axis")
            .call(d3.axisBottom(xScale).ticks(binCount));
        
    var rect = svg
                .selectAll("rect")
                .data(bins);
        rect
            .exit()
            .remove();

        rect
            .enter()
            .append("rect")
            .merge(rect)
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .delay((d,i)=>i*10)
            .attr("x",d=>xScale(d.x0))
            .attr("y", d=> yScale(d.length))
            .attr("height", d=>height - padding- yScale(d.length))
            .attr("width", d=>{
                var width = xScale(d.x1)-xScale(d.x0)- barPadding;
                return width<0? 0: width;
            })
            .attr("fill", "blue")

            d3.select(".bin-count")
                .text(`Number of bins: ${bins.length}`)
    })


svg
    .append("g")
    .classed("x-axis", true)
    .call(xAxis)
    .attr("transform", `translate(0, ${height - padding})`);

svg
    .append("g")
    .classed("y-axis", true)
    .call(yAxis)
    .attr("transform", `translate(${padding})`);   

svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .style("text-anchor", "middle")
    .text("Median Age");

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", - height / 2)
    .attr("y", 15)
    .style("text-anchor", "middle")
    .text("Frequency");

svg
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x",d=>xScale(d.x0))
    .attr("y", d=> yScale(d.length))
    .attr("height", d=>height - padding- yScale(d.length))
    .attr("width", d=>{
        var width = xScale(d.x1)-xScale(d.x0)- barPadding;
        return width<0? 0: width;
    })
    .attr("fill", "blue")
