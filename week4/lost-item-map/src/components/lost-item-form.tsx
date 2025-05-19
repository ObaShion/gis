'use client';

import { useState } from 'react';
import { LostItem } from '@/types/lost-item';

interface LostItemFormProps {
  onSubmit: (item: Omit<LostItem, 'id'>) => void;
  onCancel: () => void;
  selectedLocation: [number, number] | null;
}

export function LostItemForm({ onSubmit, onCancel, selectedLocation }: LostItemFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'その他' as LostItem['category'],
    contactInfo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;

    onSubmit({
      ...formData,
      location: {
        lat: selectedLocation[1],
        lng: selectedLocation[0]
      },
      foundAt: new Date().toISOString(),
      status: '未返却',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      {!selectedLocation && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
          マップ上で落とし物を発見した場所をクリックしてください
        </div>
      )}

      {selectedLocation && (
        <div className="p-2 bg-green-50 border border-green-200 rounded-md text-green-800">
          位置が選択されました: {selectedLocation[1].toFixed(6)}, {selectedLocation[0].toFixed(6)}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">タイトル</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">説明</label>
        <textarea
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">カテゴリー</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as LostItem['category'] })}
        >
          <option value="財布">財布</option>
          <option value="カバン">カバン</option>
          <option value="電子機器">電子機器</option>
          <option value="その他">その他</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">連絡先</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.contactInfo}
          onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={!selectedLocation}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          投稿
        </button>
      </div>
    </form>
  );
} 