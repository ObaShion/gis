// グローバル変数
let iranVoices = [];
let map;
let markers = [];
let heatmapLayer;
let currentAudio = null;
let isHeatmapVisible = false;
let isSatelliteView = false;
let filteredVoices = [];

// Google Sheets APIでデータ取得
const SHEET_ID = '16pkPw4glc3VqgAqWN02GL_VuVHf5CY2VAuWBDXmLeDs';
const API_KEY = 'AIzaSyBlrCygmnCcGGq3TxBaPskQTZusrQodMK8';
const RANGE = 'A1:G20'; // 必要に応じて調整

// Google Sheetsからデータを取得
async function fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.values;
}

// シートデータを投稿データに変換
function parseSheetData(sheetValues) {
    // 1行目はヘッダー
    const header = sheetValues[0];
    const posts = [];
    for (let i = 1; i < sheetValues.length; i++) {
        const row = sheetValues[i];
        posts.push({
            id: i,
            title: row[0] || '',
            summary: row[1] || '',
            date: row[2] || '',
            lat: row[3] || '',
            lng: row[4] || '',
            location: row[5] || '',
            comment: row[6] || '',
        });
    }
    console.log(posts);
    return posts;
}

// Google Sheetsから取得したデータをiranVoices形式に変換
function convertSheetPostsToVoices(posts) {
    return posts.map((post, idx) => ({
        id: post.id || idx + 1,
        location: post.location || '',
        coordinates: [
            post.lat ? parseFloat(post.lat) : 35.6892,
            post.lng ? parseFloat(post.lng) : 51.3890
        ],
        text: post.summary || post.comment || '',
        date: post.date || '',
    }));
}

// 投稿データを地図・サイドバーに反映
async function loadSheetPosts() {
    const sheetValues = await fetchSheetData();
    const posts = parseSheetData(sheetValues);
    // 既存のiranVoicesを置き換え
    window.sheetPosts = posts;
    // 地図とサイドバーを更新（既存のUI関数を流用する場合はここで変換）
    updateMapWithSheetPosts(posts);
    updateSidebarWithSheetPosts(posts);
}

// 地図にピンを表示
function updateMapWithSheetPosts(posts) {
    // 既存マーカーをクリア
    if (window.sheetMarkers) {
        window.sheetMarkers.forEach(m => map.removeLayer(m));
    }
    window.sheetMarkers = [];
    posts.forEach(post => {
        // 簡易的なジオコーディング（場所名→座標）
        // ここでは仮にテヘラン座標を使う（本番はAPIで変換推奨）
        const marker = L.marker(coords)
            .bindPopup(`<b>${post.title}</b><br>${post.summary}<br>${post.date}<br>${post.location}<br>${post.comment}`)
            .addTo(map);
        window.sheetMarkers.push(marker);
    });
}

// サイドバーに一覧表示
function updateSidebarWithSheetPosts(posts) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = posts.map(post => `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-location">${post.location}</div>
                <div class="comment-date">${post.date}</div>
            </div>
            <div class="comment-text">${post.summary}</div>
        </div>
    `).join('');
}

// マップの初期化
function initMap() {
    // イランの中心座標でマップを初期化
    map = L.map('map').setView([32.4279, 53.6880], 6);
    
    // 白地図レイヤー
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });
    
    // 航空写真レイヤー
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
    });
    
    // デフォルトで白地図を表示
    osmLayer.addTo(map);
    
    // レイヤーを保存
    map.osmLayer = osmLayer;
    map.satelliteLayer = satelliteLayer;
    
    // マーカーを追加
    addMarkersToMap();
    
    // ヒートマップレイヤーを初期化
}

// マーカーをマップに追加
function addMarkersToMap() {
    // 既存のマーカーをクリア
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    filteredVoices.forEach(voice => {
        const marker = L.marker(voice.coordinates)
            .bindPopup(createPopupContent(voice))
            .addTo(map);
        markers.push(marker);
    });
}

// ポップアップコンテンツを作成
function createPopupContent(voice) {
    return `
        <div class="popup-content">
            <div class="popup-header">
                <h4>${voice.location}</h4>
            </div>
            <p>${voice.text.substring(0, 80)}...</p>
            <button class="detail-btn" onclick="showCommentDetail(${voice.id})">
                詳細
            </button>
        </div>
    `;
}

// 投稿詳細を表示
function showCommentDetail(voiceId) {
    const voice = iranVoices.find(v => v.id === voiceId);
    if (!voice) return;
    
    const modal = document.getElementById('commentModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <div class="modal-title">${voice.location}</div>
            <div class="modal-date">${voice.date}</div>
        </div>
        <div class="modal-content-text">${voice.text}</div>
        <div class="modal-actions">
            <button class="action-btn share-btn" onclick="sharePost(${voice.id})">
                共有
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('commentModal');
    modal.style.display = 'none';
}

// 投稿一覧を更新
function updateCommentsList() {
    const commentsList = document.getElementById('commentsList');
    
    if (filteredVoices.length === 0) {
        commentsList.innerHTML = '<div class="loading">該当する投稿が見つかりません</div>';
        return;
    }
    
    commentsList.innerHTML = filteredVoices.map(voice => `
        <div class="comment-item" onclick="showCommentDetail(${voice.id})" data-lat="${voice.coordinates[0]}" data-lng="${voice.coordinates[1]}">
            <div class="comment-header">
                <div class="comment-location">${voice.location}</div>
                <div class="comment-date">${voice.date}</div>
            </div>
            <div class="comment-text">${voice.text}</div>
        </div>
    `).join('');
}

// フィルター機能
function applyFilters() {
    const selectedCategory = document.getElementById('categorySelect').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();

    filteredVoices = iranVoices.filter(voice => {
        const matchesCategory = !selectedCategory || voice.category === selectedCategory;
        const matchesSearch = !searchText ||
            (voice.text && voice.text.toLowerCase().includes(searchText)) ||
            (voice.location && voice.location.toLowerCase().includes(searchText));
        return matchesCategory && matchesSearch;
    });

    updateCommentsList();
    addMarkersToMap();
}

// マップタイプを切り替え
function toggleMapType() {
    const mapTypeText = document.getElementById('mapTypeText');
    
    if (isSatelliteView) {
        // 白地図に切り替え
        map.removeLayer(map.satelliteLayer);
        map.osmLayer.addTo(map);
        mapTypeText.textContent = '航空写真';
        isSatelliteView = false;
    } else {
        // 航空写真に切り替え
        map.removeLayer(map.osmLayer);
        map.satelliteLayer.addTo(map);
        mapTypeText.textContent = '白地図';
        isSatelliteView = true;
    }
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', async function() {
    // マップ初期化
    initMap();
    // Google Sheetsからデータ取得
    const sheetValues = await fetchSheetData();
    const posts = parseSheetData(sheetValues);
    const convertedVoices = convertSheetPostsToVoices(posts);
    iranVoices = convertedVoices;
    filteredVoices = [...iranVoices];
    // UIを更新
    updateCommentsList();
    addMarkersToMap();
    // フィルターイベント
    document.getElementById('categorySelect').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);

    // コメントリストのホバーで地図を移動
    const commentsList = document.getElementById('commentsList');
    commentsList.addEventListener('mouseover', function(e) {
        const item = e.target.closest('.comment-item');
        if (item) {
            const lat = parseFloat(item.getAttribute('data-lat'));
            const lng = parseFloat(item.getAttribute('data-lng'));
            if (!isNaN(lat) && !isNaN(lng)) {
                map.setView([lat, lng], 15, { animate: true });
            }
        }
    });
});

// アクション機能
function likePost(postId) {
    const post = iranVoices.find(p => p.id === postId);
    if (post) {
        post.likes++;
        updateCommentsList();
        showCommentDetail(postId);
    }
}

function showCommentForm(postId) {
    document.getElementById('commentPostModal').style.display = 'block';
    // 投稿IDを保存
    document.getElementById('commentPostModal').dataset.postId = postId;
}

function sharePost(postId) {
    const post = iranVoices.find(p => p.id === postId);
    if (post) {
        const text = `${post.location}: ${post.text.substring(0, 100)}...`;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: 'イランの声',
                text: text,
                url: url
            });
        } else {
            // フォールバック: クリップボードにコピー
            navigator.clipboard.writeText(`${text}\n${url}`);
            alert('投稿のリンクをクリップボードにコピーしました');
        }
    }
}

// グローバル関数として公開
window.showCommentDetail = showCommentDetail;
window.likePost = likePost;
window.showCommentForm = showCommentForm;
window.sharePost = sharePost; 