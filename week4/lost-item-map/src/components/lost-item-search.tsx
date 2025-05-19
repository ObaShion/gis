'use client';

import { useState } from 'react';
import { LostItem } from '@/types/lost-item';

interface LostItemSearchProps {
  items: LostItem[];
  onSearch: (filteredItems: LostItem[]) => void;
}

export function LostItemSearch({ items, onSearch }: LostItemSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LostItem['category'] | 'すべて'>('すべて');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(value.toLowerCase()) ||
                          item.description.toLowerCase().includes(value.toLowerCase());
      const matchesCategory = selectedCategory === 'すべて' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    onSearch(filtered);
  };

  const handleCategoryChange = (category: LostItem['category'] | 'すべて') => {
    setSelectedCategory(category);
    const filtered = items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'すべて' || item.category === category;
      return matchesSearch && matchesCategory;
    });
    onSearch(filtered);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <input
          type="text"
          placeholder="落とし物を検索..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div>
        <select
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value as LostItem['category'] | 'すべて')}
        >
          <option value="すべて">すべてのカテゴリー</option>
          <option value="財布">財布</option>
          <option value="カバン">カバン</option>
          <option value="電子機器">電子機器</option>
          <option value="その他">その他</option>
        </select>
      </div>
    </div>
  );
} 