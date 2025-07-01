// イラン戦争の記憶データ
const iranVoices = [
    {
        id: 1,
        location: "ホラムシャフル",
        coordinates: [30.4394, 48.1664],
        text: "1980年9月、イラク軍がホラムシャフルを占領しました。街は完全に破壊され、多くの市民が犠牲になりました。34日間の激しい戦闘の後、イラン軍が街を奪還しましたが、街は廃墟と化していました。",
        tags: ["都市戦", "占領", "破壊", "市民犠牲"],
        date: "1980-09-22",
        author: "アフマド・モハンマディ",
        casualties: "約7000人死亡",
        duration: "34日間"
    },
    {
        id: 2,
        location: "アーバーダーン",
        coordinates: [30.3392, 48.3043],
        text: "アーバーダーンは戦争中、イラク軍の主要な攻撃目標でした。石油精製所が破壊され、街は包囲されました。多くの市民が飢餓と病気で亡くなり、街の経済は完全に崩壊しました。",
        tags: ["包囲戦", "石油施設", "経済破綻", "飢餓"],
        date: "1980-10-01",
        author: "ファティマ・アザディ",
        casualties: "約5000人死亡",
        duration: "444日間の包囲"
    },
    {
        id: 3,
        location: "デズフール",
        coordinates: [32.3831, 48.4236],
        text: "デズフールは戦争中、激しい空爆にさらされました。イラク軍は化学兵器を使用し、多くの民間人が犠牲になりました。街のインフラは完全に破壊され、復興には何年もかかりました。",
        tags: ["空爆", "化学兵器", "民間人犠牲", "インフラ破壊"],
        date: "1982-03-15",
        author: "ハサン・ラザビ",
        casualties: "約3000人死亡",
        duration: "継続的な空爆"
    },
    {
        id: 4,
        location: "ケルマーンシャー",
        coordinates: [34.3277, 47.0778],
        text: "ケルマーンシャーは戦争中、イラク軍の空爆の主要な標的でした。街の住宅地や病院が攻撃され、多くの民間人が犠牲になりました。戦争後、街は難民の避難所となりました。",
        tags: ["空爆", "民間人犠牲", "病院攻撃", "難民"],
        date: "1981-06-20",
        author: "レイラ・モハンマディ",
        casualties: "約2000人死亡",
        duration: "継続的な空爆"
    },
    {
        id: 5,
        location: "マリーウァーン",
        coordinates: [35.5183, 46.1828],
        text: "マリーウァーンでは、イラク軍が化学兵器を使用した攻撃を行いました。多くの民間人が毒ガスで亡くなり、生存者も深刻な健康被害を受けました。この攻撃は国際社会から非難されました。",
        tags: ["化学兵器", "毒ガス", "民間人犠牲", "健康被害"],
        date: "1988-03-16",
        author: "アフマド・サデギ",
        casualties: "約5000人死亡",
        duration: "1日間の攻撃"
    },
    {
        id: 6,
        location: "サルダシュト",
        coordinates: [36.1553, 45.4789],
        text: "サルダシュトは1988年、イラク軍による化学兵器攻撃で大きな被害を受けました。街の住民の多くが毒ガスで亡くなり、生存者も深刻な後遺症に苦しんでいます。これは戦争犯罪として記録されています。",
        tags: ["化学兵器", "戦争犯罪", "後遺症", "国際非難"],
        date: "1988-06-28",
        author: "マリアム・カリミ",
        casualties: "約3500人死亡",
        duration: "1日間の攻撃"
    },
    {
        id: 7,
        location: "ハラブジャ（イラク）",
        coordinates: [36.1901, 45.9875],
        text: "ハラブジャは1988年3月、イラク軍による化学兵器攻撃で約5000人が死亡しました。この攻撃は戦争中最大の民間人虐殺の一つとして知られています。多くの子供や女性が犠牲になりました。",
        tags: ["化学兵器", "民間人虐殺", "子供犠牲", "戦争犯罪"],
        date: "1988-03-16",
        author: "ソラヤ・ナジャフィ",
        casualties: "約5000人死亡",
        duration: "1日間の攻撃"
    },
    {
        id: 8,
        location: "バンダレ・エマーム",
        coordinates: [30.4333, 49.0833],
        text: "バンダレ・エマームの港は戦争中、イラク軍の空爆で大きな被害を受けました。石油輸出の主要な港が破壊され、イランの経済に大きな打撃を与えました。多くの港湾労働者が犠牲になりました。",
        tags: ["港湾攻撃", "経済打撃", "石油施設", "労働者犠牲"],
        date: "1984-05-12",
        author: "モハンマド・レザ・アフシャル",
        casualties: "約800人死亡",
        duration: "継続的な空爆"
    }
];

// グローバル変数
let map;
let markers = [];
let heatmapLayer;
let currentAudio = null;
let isHeatmapVisible = false;
let isSatelliteView = false;
let filteredVoices = [...iranVoices];

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
    initHeatmap();
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
            <h4>${voice.location}</h4>
            <p>${voice.text.substring(0, 100)}...</p>
            <div class="popup-info">
                <span class="casualties">${voice.casualties}</span>
                <span class="duration">${voice.duration}</span>
            </div>
            <div class="popup-tags">
                ${voice.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <button class="detail-btn" onclick="showCommentDetail(${voice.id})">
                📖 詳細を読む
            </button>
        </div>
    `;
}

// ヒートマップの初期化
function initHeatmap() {
    const heatmapData = iranVoices.map(voice => [
        voice.coordinates[0],
        voice.coordinates[1],
        1 // 強度
    ]);
    
    heatmapLayer = L.heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        gradient: {
            0.4: 'blue',
            0.6: 'lime',
            0.8: 'orange',
            1.0: 'red'
        }
    });
}

// 戦争の記憶詳細を表示
function showCommentDetail(voiceId) {
    const voice = iranVoices.find(v => v.id === voiceId);
    if (!voice) return;
    
    const modal = document.getElementById('commentModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <div class="modal-title">${voice.location}</div>
            <div class="modal-location">${voice.author} • ${voice.date}</div>
        </div>
        <div class="modal-content-text">${voice.text}</div>
        <div class="modal-stats">
            <div class="stat-item">
                <span class="stat-label">犠牲者数:</span>
                <span class="stat-value">${voice.casualties}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">期間:</span>
                <span class="stat-value">${voice.duration}</span>
            </div>
        </div>
        <div class="modal-tags">
            ${voice.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;
    
    modal.style.display = 'block';
}



// 戦争の記憶一覧を更新
function updateCommentsList() {
    const commentsList = document.getElementById('commentsList');
    
    if (filteredVoices.length === 0) {
        commentsList.innerHTML = '<div class="loading">該当する戦争の記憶が見つかりません</div>';
        return;
    }
    
    commentsList.innerHTML = filteredVoices.map(voice => `
        <div class="comment-item" onclick="showCommentDetail(${voice.id})">
            <div class="comment-header">
                <div class="comment-location">${voice.location}</div>
                <div class="comment-date">${voice.date}</div>
            </div>
            <div class="comment-text">${voice.text}</div>
            <div class="comment-stats">
                <span class="casualties">${voice.casualties}</span>
                <span class="duration">${voice.duration}</span>
            </div>
            <div class="comment-tags">
                ${voice.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// タグフィルターを更新
function updateTagFilter() {
    const tagSelect = document.getElementById('tagSelect');
    const allTags = [...new Set(iranVoices.flatMap(voice => voice.tags))];
    
    // 既存のオプションをクリア（最初の「すべてのタグ」を除く）
    while (tagSelect.children.length > 1) {
        tagSelect.removeChild(tagSelect.lastChild);
    }
    
    // 新しいタグオプションを追加
    allTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
    });
}

// フィルター機能
function applyFilters() {
    const selectedTag = document.getElementById('tagSelect').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    filteredVoices = iranVoices.filter(voice => {
        const matchesTag = !selectedTag || voice.tags.includes(selectedTag);
        const matchesSearch = !searchText || 
            voice.text.toLowerCase().includes(searchText) ||
            voice.location.toLowerCase().includes(searchText) ||
            voice.author.toLowerCase().includes(searchText);
        
        return matchesTag && matchesSearch;
    });
    
    updateCommentsList();
    addMarkersToMap();
    updateHeatmap();
}

// ヒートマップを更新
function updateHeatmap() {
    if (isHeatmapVisible) {
        const heatmapData = filteredVoices.map(voice => [
            voice.coordinates[0],
            voice.coordinates[1],
            1
        ]);
        
        if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
        }
        
        heatmapLayer = L.heatLayer(heatmapData, {
            radius: 25,
            blur: 15,
            maxZoom: 10,
            gradient: {
                0.4: 'blue',
                0.6: 'lime',
                0.8: 'orange',
                1.0: 'red'
            }
        });
        
        if (isHeatmapVisible) {
            heatmapLayer.addTo(map);
        }
    }
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

// ヒートマップの表示/非表示を切り替え
function toggleHeatmap() {
    const heatmapText = document.getElementById('heatmapText');
    
    if (isHeatmapVisible) {
        // ヒートマップを非表示
        if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
        }
        heatmapText.textContent = 'ヒートマップ表示';
        isHeatmapVisible = false;
    } else {
        // ヒートマップを表示
        updateHeatmap();
        if (heatmapLayer) {
            heatmapLayer.addTo(map);
        }
        heatmapText.textContent = 'ヒートマップ非表示';
        isHeatmapVisible = true;
    }
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', function() {
    // マップを初期化
    initMap();
    
    // コメント一覧を更新
    updateCommentsList();
    
    // タグフィルターを更新
    updateTagFilter();
    
    // イベントリスナーを設定
    document.getElementById('tagSelect').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('toggleMapType').addEventListener('click', toggleMapType);
    document.getElementById('toggleHeatmap').addEventListener('click', toggleHeatmap);
    
    // モーダルの閉じるボタン
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('commentModal').style.display = 'none';
    });
    
    // モーダル外をクリックして閉じる
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('commentModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // キーボードショートカット
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.getElementById('commentModal').style.display = 'none';
        }
    });
});

// グローバル関数として公開
window.showCommentDetail = showCommentDetail; 