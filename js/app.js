// ================= 照片資料庫 (26張) =================
const totalPhotos = 26; 
let photoData = [];
for (let i = 1; i <= totalPhotos; i++) {
    photoData.push({
        src: `images/pic${i}.jpg`, // 如果照片是 png 檔，請將這裡改成 .png
        title: `Mirror the miracle`,
        desc: `第十五屆領頭羊 ‧ 奇蹟碎片 #${i}`
    });
}

function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ================= 攝影機與粒子系統初始化 =================
document.addEventListener('DOMContentLoaded', () => {
    // 1. 啟動攝影機
    const video = document.getElementById('webcam');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
            .then(stream => { video.srcObject = stream; })
            .catch(error => { 
                console.error("無法存取攝影機:", error);
                document.querySelector('.pulse-text').innerText = "(請允許瀏覽器開啟攝影機權限以喚醒魔鏡)"; 
            });
    }

    // 2. 啟動魔法星塵 (Canvas 粒子系統)
    initMagicDust();
});

// ================= 魔鏡主邏輯 (包含點擊判定) =================
let isPlaying = false;
let slideshowInterval = null;
let currentPlaylist = [];
let currentIndex = 0;

function toggleMagic(event) {
    const mirror = document.getElementById('magic-mirror');
    
    // 觸發點擊水波紋特效
    createRipple(event, mirror);
    
    if (!isPlaying) {
        // --- 開啟魔法播放 ---
        isPlaying = true;
        mirror.classList.add('playing-magic'); 
        
        currentPlaylist = shuffleArray(photoData);
        currentIndex = 0;
        
        // 延遲 1 秒等鏡面起霧後，開始播放
        setTimeout(() => {
            showNextMemory(); 
            slideshowInterval = setInterval(showNextMemory, 4500); // 每 4.5 秒換一張
        }, 1000);

    } else {
        // --- 關閉魔法播放 ---
        isPlaying = false;
        clearInterval(slideshowInterval);
        
        const imgElement = document.getElementById('memory-img');
        imgElement.style.opacity = 0;
        imgElement.style.transform = 'scale(0.9) translateY(20px)';
        document.getElementById('memory-caption').style.opacity = 0;
        
        mirror.classList.remove('playing-magic');
    }
}

// ================= 水波紋生成器 =================
function createRipple(e, container) {
    const rect = container.getBoundingClientRect();
    // 計算點擊在容器內的相對座標
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    container.appendChild(ripple);

    // 動畫播完後移除 DOM 元素，避免占用效能
    setTimeout(() => {
        ripple.remove();
    }, 1000);
}

// ================= 照片輪播播放器 =================
function showNextMemory() {
    if (!isPlaying) return; 

    const imgElement = document.getElementById('memory-img');
    const captionElement = document.getElementById('memory-caption');
    const titleElement = document.getElementById('caption-title');
    const descElement = document.getElementById('caption-desc');

    // 先淡出舊照片
    imgElement.style.opacity = 0;
    captionElement.style.opacity = 0;
    imgElement.style.transform = 'scale(0.9) translateY(20px)';

    // 延遲等淡出完畢後替換新照片
    setTimeout(() => {
        const currentPhoto = currentPlaylist[currentIndex];
        imgElement.src = currentPhoto.src;
        titleElement.innerText = currentPhoto.title;
        descElement.innerText = currentPhoto.desc;

        // 淡入並向上浮現
        imgElement.style.opacity = 1;
        captionElement.style.opacity = 1;
        imgElement.style.transform = 'scale(1) translateY(0)'; 

        // 播完一輪就重新洗牌
        currentIndex++;
        if (currentIndex >= currentPlaylist.length) {
            currentPlaylist = shuffleArray(photoData);
            currentIndex = 0;
        }
    }, 800);
}

// ================= 魔法星塵 (JS 粒子引擎) =================
function initMagicDust() {
    const canvas = document.getElementById('magic-dust');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        // 讓畫布永遠符合魔鏡大小
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    // 建立 50 個漂浮粒子
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5 - 0.2, // 確保粒子微微向上飄
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.01
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            // 更新粒子位置
            p.x += p.vx;
            p.y += p.vy;
            // 控制閃爍效果
            p.alpha += p.speed;
            if (p.alpha >= 1 || p.alpha <= 0) p.speed *= -1;

            // 超出邊界就從另一邊回來
            if (p.y < 0) p.y = height;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;

            // 繪製發光效果
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`; // 金色星塵
            ctx.shadowBlur = 10;
            ctx.shadowColor = "gold";
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}