document.addEventListener("DOMContentLoaded", function () {
    const width = 800, height = 500;
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "#ffffff");

    function drawAxes() {
        svg.append("line")
            .attr("x1", 0).attr("y1", height / 2)
            .attr("x2", width).attr("y2", height / 2)
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        svg.append("line")
            .attr("x1", width / 2).attr("y1", 0)
            .attr("x2", width / 2).attr("y2", height)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    }

    function calculateTrajectory(x0, y0, angle, speed, gravity) {
        const points = [];
        let t = 0, dt = 0.1;

        while (true) {
            let x = x0 + speed * Math.cos(angle) * t;
            let y = y0 + speed * Math.sin(angle) * t - 0.5 * gravity * t * t;
            if (y < 0 || x > width) break;

            points.push({ x: x + width / 2, y: height / 2 - y });
            t += dt;
        }

        return points;
    }

    function drawTrajectory(points, color) {
        svg.append("path")
            .datum(points)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", d3.line().x(d => d.x).y(d => d.y));
    }

    function clearChart() {
        svg.selectAll("*").remove();
        drawAxes();
    }

    document.getElementById("startButton").addEventListener("click", function () {
        const x0 = parseFloat(document.getElementById("startX").value);
        const y0 = parseFloat(document.getElementById("startY").value);
        const angle = parseFloat(document.getElementById("angle").value) * Math.PI / 180;
        const speed = parseFloat(document.getElementById("speed").value);
        const gravity = parseFloat(document.getElementById("gravity").value);
        const color = document.getElementById("lineColor").value;

        clearChart();
        const points = calculateTrajectory(x0, y0, angle, speed, gravity);
        drawTrajectory(points, color);
    });

    document.getElementById("clearButton").addEventListener("click", clearChart);

    drawAxes();
});


