export interface LostItem {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  category: '財布' | 'カバン' | '電子機器' | 'その他';
  foundAt: string;
  contactInfo: string;
  status: '未返却' | '返却済み';
} 