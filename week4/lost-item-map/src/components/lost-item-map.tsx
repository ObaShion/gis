'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LostItem } from '@/types/lost-item';
import { LostItemForm } from './lost-item-form';
import { LostItemSearch } from './lost-item-search';

interface LostItemMapProps {
  center?: [number, number];
  zoom?: number;
}

const STORAGE_KEY = 'lost-items';

export function LostItemMap({ 
  center = [139.7670, 35.6814],
  zoom = 13 
}: LostItemMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [lostItems, setLostItems] = useState<LostItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [displayedItems, setDisplayedItems] = useState<LostItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [tempMarker, setTempMarker] = useState<maplibregl.Marker | null>(null);

  // 初期表示時とlostItemsが更新された時にdisplayedItemsを更新
  useEffect(() => {
    setDisplayedItems(lostItems);
  }, [lostItems]);

  // データが更新されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lostItems));
  }, [lostItems]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: center,
      zoom: zoom
    });


    // クリックイベントの追加
    map.current.on('click', (e) => {
      if (isAddingItem) {
        const newLocation: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        setSelectedLocation(newLocation);

        // 既存の一時マーカーを削除
        if (tempMarker) {
          tempMarker.remove();
        }

        // 新しい一時マーカーを追加
        const marker = new maplibregl.Marker({ color: '#3B82F6' })
          .setLngLat(newLocation)
          .addTo(map.current!);
        setTempMarker(marker);
      }
    });

    return () => {
      if (tempMarker) {
        tempMarker.remove();
      }
      map.current?.remove();
    };
  }, [center, zoom, isAddingItem, tempMarker]);

  // マーカーの追加
  useEffect(() => {
    if (!map.current) return;

    // 既存のマーカーを削除
    const markers = document.getElementsByClassName('maplibregl-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // 新しいマーカーを追加
    displayedItems.forEach((item) => {
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${item.title}</h3>
          <p>${item.description}</p>
          <p class="text-sm text-gray-600">カテゴリー: ${item.category}</p>
          <p class="text-sm text-gray-600">発見日時: ${new Date(item.foundAt).toLocaleString()}</p>
          <p class="text-sm text-gray-600">連絡先: ${item.contactInfo}</p>
        </div>
      `);

      const marker = new maplibregl.Marker({ color: '#3B82F6' })
        .setLngLat([item.location.lng, item.location.lat])
        .setPopup(popup);

      if (map.current) {
        marker.addTo(map.current);
      }
    });
  }, [displayedItems]);

  const handleAddItem = (item: Omit<LostItem, 'id'>) => {
    if (!selectedLocation) return;

    const newItem: LostItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      location: {
        lat: selectedLocation[1],
        lng: selectedLocation[0]
      }
    };

    setLostItems([...lostItems, newItem]);
    setIsAddingItem(false);
    setSelectedLocation(null);
    if (tempMarker) {
      tempMarker.remove();
      setTempMarker(null);
    }
  };

  const handleCancel = () => {
    setIsAddingItem(false);
    setSelectedLocation(null);
    if (tempMarker) {
      tempMarker.remove();
      setTempMarker(null);
    }
  };

  return (
    <div className="relative">
      <div className="w-full h-[600px] rounded-lg overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsAddingItem(!isAddingItem)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isAddingItem ? 'キャンセル' : '落とし物を投稿'}
        </button>
      </div>

      <div className="absolute top-4 left-4 z-10 w-96">
        <LostItemSearch
          items={lostItems}
          onSearch={setDisplayedItems}
        />
      </div>

      {isAddingItem && (
        <div className="absolute top-32 left-4 z-10 w-96">
          <LostItemForm
            onSubmit={handleAddItem}
            onCancel={handleCancel}
            selectedLocation={selectedLocation}
          />
        </div>
      )}

      {isAddingItem && !selectedLocation && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-md shadow-md">
          マップ上で落とし物を発見した場所をクリックしてください
        </div>
      )}
    </div>
  );
} 