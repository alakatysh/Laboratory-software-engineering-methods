function init() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const gridSpacing = 20;
    drawGrid(ctx, canvas.width, canvas.height, gridSpacing);

    document.getElementById('startButton').addEventListener('click', function() {
        plot(ctx, canvas);
    });
    document.getElementById('clearButton').addEventListener('click', function() {
        clearCanvas(ctx, canvas);
    });
}

function drawGrid(ctx, w, h, gridSpacing) {
    ctx.clearRect(0, 0, w, h);
    for (let x = 0; x <= w; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.strokeStyle = "lightblue";
        ctx.stroke();
    }
    for (let y = 0; y <= h; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.strokeStyle = "lightblue";
        ctx.stroke();
    }
    drawAxes(ctx, w, h);
}

function drawAxes(ctx, w, h) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
}

function plot(ctx, canvas) {
    const x0 = parseFloat(document.getElementById('startX').value);
    const y0 = parseFloat(document.getElementById('startY').value);
    const angle = parseFloat(document.getElementById('angle').value) * Math.PI / 180;
    const speed = parseFloat(document.getElementById('speed').value);
    const gravity = parseFloat(document.getElementById('gravity').value);
    const color = document.getElementById('lineColor').value;

    const points = calcTrajectory(x0, y0, angle, speed, gravity, canvas);
    drawTrajectory(ctx, points, color);
}

function calcTrajectory(x0, y0, angle, speed, gravity, canvas) {
    const points = [];
    let time = 0;
    const dt = 0.1;
    let x, y;

    while (true) {
        x = x0 + speed * Math.cos(angle) * time;
        y = y0 + speed * Math.sin(angle) * time - 0.5 * gravity * time * time;

        if (y < 0 || x > canvas.width) break;

        points.push({
            x: x + canvas.width / 2,
            y: canvas.height / 2 - y
        });
        time += dt;
    }

    return points;
}

function drawTrajectory(ctx, points, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => {
        ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
}

function clearCanvas(ctx, canvas) {
    drawGrid(ctx, canvas.width, canvas.height, 20);
}

window.onload = init
