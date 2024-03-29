import * as d3 from "d3";

const applyColorMap = (getThrottleAtDistance) => {
    const color = d3.scaleLinear()
    .domain([-1, 0, 1, 2, 3, 4, 5])
    .range(["green", "lightgreen", "white", "yellow", "orange", "orangered", "red"])
    .interpolate(d3.interpolateRgb.gamma(2.2))

    const lineThinkness = 1

    var path = d3.select(".raceLine")
    if(!path.node()) {
        return
    }

    const line = d3.select("#trackSvg").selectAll(".colorScale")
        .data(quads(samples(path.node(), 4)))
    line.exit().remove()
    line
        .enter().append("path").merge(line)
        .style("fill", d => { 
            const value = d.t
            return color(value); 
        })
        .style("stroke", d => { 
            const value = d.t
            return color(value); 
        })
        .attr("class", "colorScale")
        .attr("d", d => lineJoin(d[0], d[1], d[2], d[3], lineThinkness))

    // Sample the SVG path uniformly with the specified precision.
    function samples(path, precision) {
    let n = path.getTotalLength(), t = [0], i = 0, dt = precision;
    while ((i += dt) < n) t.push(i);
    t.push(n);
    return t.map(t => {
        let p = path.getPointAtLength(t), a = [p.x, p.y];
        a.t = getThrottleAtDistance(t/n)
        return a;
    });
    }

    // Compute quads of adjacent points [p0, p1, p2, p3].
    function quads(points) {
    return d3.range(points.length - 1).map(function(i) {
        var a = [points[i - 1], points[i], points[i + 1], points[i + 2]];
        a.t = (points[i].t + points[i + 1].t) / 2;
        return a;
    });
    }

    // Compute stroke outline for segment p12.
    function lineJoin(p0, p1, p2, p3, width) {
    var u12 = perp(p1, p2),
        r = width / 2,
        a = [p1[0] + u12[0] * r, p1[1] + u12[1] * r],
        b = [p2[0] + u12[0] * r, p2[1] + u12[1] * r],
        c = [p2[0] - u12[0] * r, p2[1] - u12[1] * r],
        d = [p1[0] - u12[0] * r, p1[1] - u12[1] * r];

    if (p0) { // clip ad and dc using average of u01 and u12
        var u01 = perp(p0, p1), e = [p1[0] + u01[0] + u12[0], p1[1] + u01[1] + u12[1]];
        a = lineIntersect(p1, e, a, b);
        d = lineIntersect(p1, e, d, c);
    }

    if (p3) { // clip ab and dc using average of u12 and u23
        var u23 = perp(p2, p3), e = [p2[0] + u23[0] + u12[0], p2[1] + u23[1] + u12[1]];
        b = lineIntersect(p2, e, a, b);
        c = lineIntersect(p2, e, d, c);
    }

    return "M" + a + "L" + b + " " + c + " " + d + "Z";
    }

    // Compute intersection of two infinite lines ab and cd.
    function lineIntersect(a, b, c, d) {
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3,
        y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3,
        ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
    return [x1 + ua * x21, y1 + ua * y21];
    }

    // Compute unit vector perpendicular to p01.
    function perp(p0, p1) {
    var u01x = p0[1] - p1[1], u01y = p1[0] - p0[0],
        u01d = Math.sqrt(u01x * u01x + u01y * u01y);
    return [u01x / u01d, u01y / u01d];
    }
}

export default applyColorMap