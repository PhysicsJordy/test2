const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    vx: 2,
    vy: 2,
    omega: parseFloat(document.getElementById('initialOmega').value), // 초기 각속도
    angle: 0, // 현재 회전 각도
    mass: 1,
    inertia: 1, // 관성 모멘트
    friction: parseFloat(document.getElementById('friction').value), // 마찰 계수
    restitution: parseFloat(document.getElementById('restitution').value) // 반발 계수
};

const gravity = 0.1; // 중력 가속도
let dragging = false; // 드래그 상태

function resetSimulation() {
    ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 20,
        vx: 2,
        vy: 2,
        omega: parseFloat(document.getElementById('initialOmega').value),
        angle: 0,
        mass: 1,
        inertia: 1, // 관성 모멘트
        friction: parseFloat(document.getElementById('friction').value),
        restitution: parseFloat(document.getElementById('restitution').value)
    };
}

document.getElementById('resetButton').addEventListener('click', () => {
    resetSimulation();
});

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    const mousePos = getMousePos(canvas, e);
    const dx = mousePos.x - ball.x;
    const dy = mousePos.y - ball.y;
    if (Math.sqrt(dx * dx + dy * dy) < ball.radius) {
        dragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (dragging) {
        const mousePos = getMousePos(canvas, e);
        ball.x = mousePos.x;
        ball.y = mousePos.y;
        ball.vx = 0;
        ball.vy = 0;
        ball.omega = 0;
        ball.angle = 0;
    }
});

canvas.addEventListener('mouseup', () => {
    dragging = false;
});

canvas.addEventListener('mouseleave', () => {
    dragging = false;
});

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!dragging) {
        // 중력 효과
        ball.vy += gravity;

        // 위치 업데이트
        ball.x += ball.vx;
        ball.y += ball.vy;

        // 각도 업데이트
        ball.angle += ball.omega;

        // 바닥과 충돌 검사
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.vy *= -ball.restitution;

            // 충돌 지점의 속도 계산
            const bottomSpeed = ball.vx - ball.radius * ball.omega;

            // 마찰력 방향 결정
            const frictionDirection = bottomSpeed > 0 ? -1 : 1;

            // 마찰력 계산
            const frictionForce = frictionDirection * ball.friction * Math.abs(bottomSpeed);
            const frictionAcceleration = frictionForce / ball.mass;

            // 마찰력에 의한 속도 변화
            ball.vx += frictionAcceleration;
            ball.omega -= (frictionForce * ball.radius) / ball.inertia;
        }

        // 좌우 벽과 충돌 검사
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.vx *= -ball.restitution;
        } else if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx *= -ball.restitution;
        }
    }

    // 공 그리기
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.closePath();

    // 공의 회전 표시 (하나의 마커 추가)
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.angle);

    // 마커
    ctx.beginPath();
    ctx.arc(ball.radius / 2, 0, ball.radius / 5, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();

    ctx.restore();

    requestAnimationFrame(update);
}

resetSimulation();
update();
