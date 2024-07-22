const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    vx: 2,
    vy: 2,
    omega: 0.1, // 각속도 (라디안/프레임)
    mass: 1,
    inertia: 1, // 관성 모멘트 (여기서는 단순화를 위해 1로 설정)
    friction: 0.01, // 마찰 계수
    restitution: 0.8 // 반발 계수
};

const gravity = 0.1; // 중력 가속도

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 중력 효과
    ball.vy += gravity;

    // 위치 업데이트
    ball.x += ball.vx;
    ball.y += ball.vy;

    // 바닥과 충돌 검사
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= -ball.restitution;

        // 마찰에 의한 각속도 변화
        const frictionForce = ball.friction * ball.vx;
        ball.omega += frictionForce / ball.inertia;

        // 속도 감소 (마찰로 인한 속도 변화)
        ball.vx *= (1 - ball.friction);
    }

    // 좌우 벽과 충돌 검사
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx *= -ball.restitution;
    }

    // 공 그리기
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.closePath();

    // 공의 회전 표시
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.omega);
    ctx.beginPath();
    ctx.moveTo(-ball.radius, 0);
    ctx.lineTo(ball.radius, 0);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(update);
}

update();
