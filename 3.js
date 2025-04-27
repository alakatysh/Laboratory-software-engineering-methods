document.addEventListener("DOMContentLoaded", function () {
    const width = 800;
    const height = 600;
    const padding = 50;
    const svg = d3.select("#simulation");

    function drawGrid() {
        svg.selectAll("*").remove();
        for (let i = padding; i < width; i += 50) {
            svg.append("line").attr("x1", i).attr("y1", padding).attr("x2", i).attr("y2", height - padding).attr("stroke", "#ddd");
        }
        for (let i = padding; i < height; i += 50) {
            svg.append("line").attr("x1", padding).attr("y1", i).attr("x2", width - padding).attr("y2", i).attr("stroke", "#ddd");
        }
        svg.append("line").attr("x1", padding).attr("y1", height - padding).attr("x2", width - padding).attr("y2", height - padding).attr("stroke", "black").attr("stroke-width", 2);
        svg.append("line").attr("x1", padding).attr("y1", padding).attr("x2", padding).attr("y2", height - padding).attr("stroke", "black").attr("stroke-width", 2);
        for (let i = padding; i <= width - padding; i += 50) {
            svg.append("line").attr("x1", i).attr("y1", height - padding - 5).attr("x2", i).attr("y2", height - padding + 5).attr("stroke", "black");
            svg.append("text").attr("x", i - 10).attr("y", height - padding + 20).text((i - padding) / 50).attr("font-size", "12px");
        }
        for (let i = height - padding; i >= padding; i -= 50) {
            svg.append("line").attr("x1", padding - 5).attr("y1", i).attr("x2", padding + 5).attr("y2", i).attr("stroke", "black");
            svg.append("text").attr("x", padding - 30).attr("y", i + 5).text((height - padding - i) / 50).attr("font-size", "12px");
        }
    }

    function drawTrajectory() {
        const startX = +document.getElementById("startX").value;
        const startY = +document.getElementById("startY").value;
        const angleDeg = +document.getElementById("angle").value;
        const speed = +document.getElementById("speed").value;
        const gravity = +document.getElementById("gravity").value;
        const lineColor = document.getElementById("lineColor").value;

        const angle = angleDeg * Math.PI / 180;
        const v0x = speed * Math.cos(angle);
        const v0y = speed * Math.sin(angle);

        const flightTime = (v0y + Math.sqrt(v0y * v0y + 2 * gravity * startY)) / gravity;
        const dt = flightTime / 100;
        const data = [];
        let maxHeight = startY;
        let maxX = startX;

        for (let t = 0; t <= flightTime; t += dt) {
            const x = startX + v0x * t;
            const y = startY + v0y * t - 0.5 * gravity * t * t;
            if (y < 0) break;
            data.push({ x: padding + x * 50, y: height - padding - y * 50 });
            if (y > maxHeight) {
                maxHeight = y;
                maxX = x;
            }
        }

        const line = d3.line().x(d => d.x).y(d => d.y).curve(d3.curveBasis);
        svg.append("path").datum(data).attr("fill", "none").attr("stroke", lineColor).attr("stroke-width", 2).attr("d", line);

        svg.append("circle")
            .attr("cx", padding + maxX * 50)
            .attr("cy", height - padding - maxHeight * 50)
            .attr("r", 5)
            .attr("fill", "blue");

        svg.append("text")
            .attr("x", padding + maxX * 50 + 10)
            .attr("y", height - padding - maxHeight * 50)
            .attr("fill", "blue")
            .attr("font-size", "14px")
            .text(`Максимум: ${maxHeight.toFixed(2)} м`);

        const finalX = startX + v0x * flightTime;
        svg.append("circle")
            .attr("cx", padding + finalX * 50)
            .attr("cy", height - padding)
            .attr("r", 5)
            .attr("fill", "green");

        svg.append("text")
            .attr("x", padding + finalX * 50 - 25)
            .attr("y", height - padding + 35)
            .attr("fill", "green")
            .attr("font-size", "12px")
            .text(`Дальність: ${(finalX - startX).toFixed(2)} м`);
        
        svg.append("text")
            .attr("x", padding + finalX * 50 - 25)
            .attr("y", height - padding + 50)
            .attr("fill", "black")
            .attr("font-size", "12px")
            .text(`Час польоту: ${flightTime.toFixed(2)} с`);
    }

    document.getElementById("startButton").addEventListener("click", function() {
        drawTrajectory();
    });

    document.getElementById("clearButton").addEventListener("click", function() {
        drawGrid();
    });

    drawGrid();
});
