// ================= 1. 照片資料自動生成 (pic1 ~ pic26) =================
const totalPhotos = 26; 
const photoData = [];

for (let i = 1; i <= totalPhotos; i++) {
    photoData.push({
        src: `images/pic${i}.jpg`, // 確保你的照片是 .jpg 結尾，如果是 .png 請改這裡
        title: `魔法回憶碎片 ${i}`,
        desc: `我們在靜宜校園留下的歡笑與奇蹟。`
    });
}

// ================= 2. 隨機打亂陣列功能 (洗牌演算法) =================
function shuffleArray(array) {
    let shuffled = [...array]; // 複製一份，不影響原陣列
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ================= 3. 動態渲染相簿網格 =================
function renderGallery() {
    const grid = document.getElementById('dynamic-grid');
    grid.innerHTML = ''; // 先清空畫面
    
    // 將 26 張照片隨機打亂後顯示
    const randomPhotos = shuffleArray(photoData);

    randomPhotos.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.onclick = () => openLightbox(photo.src, photo.title, photo.desc);
        
        card.innerHTML = `
            <img src="${photo.src}" alt="${photo.title}">
            <div class="card-title">${photo.title}</div>
        `;
        grid.appendChild(card);
    });
}

// ================= 4. 攝影機初始化 =================
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('webcam');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
            .then(stream => { video.srcObject = stream; })
            .catch(error => {
                console.error("無法存取攝影機:", error);
                document.querySelector('.magic-text p').innerText = "(請允許瀏覽器開啟攝影機權限)";
            });
    }
});

// ================= 5. 視圖切換與進入相簿 =================
function shatterMirror() {
    const mirrorFrame = document.querySelector('.mirror-frame');
    mirrorFrame.classList.add('shatter-anim');
    
    setTimeout(() => {
        renderGallery(); // 進入相簿前，先隨機生成網格
        switchView('gallery-view');
        document.getElementById('main-nav').classList.remove('hidden');
    }, 800);
}

function switchView(targetViewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
        setTimeout(() => view.classList.add('hidden'), 500); 
    });

    const targetView = document.getElementById(targetViewId);
    targetView.classList.remove('hidden');
    setTimeout(() => targetView.classList.add('active'), 50);

    if (targetViewId === 'mirror-view') {
        document.querySelector('.mirror-frame').classList.remove('shatter-anim');
        document.getElementById('main-nav').classList.add('hidden');
    }
}

// ================= 6. 燈箱邏輯與隨機輪播播放 =================
let slideshowInterval = null; // 用來記錄播放器的計時器

function openLightbox(imgSrc, title, desc) {
    const lightbox = document.getElementById('lightbox');
    const imgElement = document.getElementById('lightbox-img');
    
    // 添加一個淡入效果
    imgElement.style.opacity = 0;
    setTimeout(() => {
        imgElement.src = imgSrc;
        document.getElementById('lightbox-title').innerText = title;
        document.getElementById('lightbox-desc').innerText = desc;
        imgElement.style.opacity = 1;
    }, 200);
    
    lightbox.classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
    // 關閉燈箱時，必須停止自動播放
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// 點擊背景關閉
document.getElementById('lightbox').addEventListener('click', function(e) {
    if(e.target === this) closeLightbox();
});

// 啟動隨機輪播
function startRandomSlideshow() {
    const randomPhotos = shuffleArray(photoData); // 取得一組隨機順序的照片
    let currentIndex = 0;

    // 先打開第一張
    openLightbox(randomPhotos[currentIndex].src, randomPhotos[currentIndex].title, randomPhotos[currentIndex].desc);

    // 設定每 3 秒 (3000毫秒) 自動切換下一張
    slideshowInterval = setInterval(() => {
        currentIndex++;
        // 如果 26 張播完了，就從頭開始循環
        if (currentIndex >= randomPhotos.length) {
            currentIndex = 0; 
        }
        openLightbox(randomPhotos[currentIndex].src, randomPhotos[currentIndex].title, randomPhotos[currentIndex].desc);
    }, 3000);
}