// ================= 1. 照片資料庫 (pic1 ~ pic26) =================
const totalPhotos = 26; 
let photoData = [];

for (let i = 1; i <= totalPhotos; i++) {
    photoData.push({
        src: `images/pic${i}.jpg`, // 確保照片都是 .jpg，如為 png 請修改這裡
        title: `Mirror the miracle`,
        desc: `第十五屆領頭羊 ‧ 魔法記憶碎片 #${i}`
    });
}

// 洗牌演算法
function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ================= 2. 攝影機初始化 =================
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('webcam');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
            .then(stream => { video.srcObject = stream; })
            .catch(error => {
                console.error("無法存取攝影機:", error);
                document.querySelector('.pulse-text').innerText = "(請允許瀏覽器開啟攝影機權限以喚醒魔鏡)";
            });
    }
});

// ================= 3. 魔鏡互動邏輯 =================
let isPlaying = false;
let slideshowInterval = null;
let currentPlaylist = [];
let currentIndex = 0;

function toggleMagic() {
    const mirror = document.getElementById('magic-mirror');
    
    if (!isPlaying) {
        // --- 啟動魔法回憶 ---
        isPlaying = true;
        mirror.classList.add('playing-magic'); // 觸發 CSS 霧化與變暗動畫
        
        // 準備照片
        currentPlaylist = shuffleArray(photoData);
        currentIndex = 0;
        
        // 延遲 1 秒，等霧化動畫稍微跑完再浮現第一張照片
        setTimeout(() => {
            showNextMemory(); 
            // 設定每 4.5 秒自動換下一張
            slideshowInterval = setInterval(showNextMemory, 4500);
        }, 1000);

    } else {
        // --- 關閉魔法回憶 (回到照鏡子狀態) ---
        isPlaying = false;
        clearInterval(slideshowInterval);
        
        // 隱藏當前照片
        document.getElementById('memory-img').style.opacity = 0;
        document.getElementById('memory-caption').style.opacity = 0;
        
        // 移除 CSS 魔法狀態，鏡子會慢慢清晰
        mirror.classList.remove('playing-magic');
    }
}

// ================= 4. 輪播播放器 =================
function showNextMemory() {
    if (!isPlaying) return; // 如果已經關閉就不執行

    const imgElement = document.getElementById('memory-img');
    const captionElement = document.getElementById('memory-caption');
    const titleElement = document.getElementById('caption-title');
    const descElement = document.getElementById('caption-desc');

    // 1. 先把舊照片淡出
    imgElement.style.opacity = 0;
    captionElement.style.opacity = 0;
    imgElement.style.transform = 'scale(0.95)';

    // 2. 延遲 0.8 秒 (等淡出完畢) 後替換照片，再淡入新照片
    setTimeout(() => {
        // 換照片與文字
        const currentPhoto = currentPlaylist[currentIndex];
        imgElement.src = currentPhoto.src;
        titleElement.innerText = currentPhoto.title;
        descElement.innerText = currentPhoto.desc;

        // 淡入並微微放大 (創造浮現感)
        imgElement.style.opacity = 1;
        captionElement.style.opacity = 1;
        imgElement.style.transform = 'scale(1)';

        // 索引加一，如果播完了就重新洗牌
        currentIndex++;
        if (currentIndex >= currentPlaylist.length) {
            currentPlaylist = shuffleArray(photoData);
            currentIndex = 0;
        }
    }, 800);
}