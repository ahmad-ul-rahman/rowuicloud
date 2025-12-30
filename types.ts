
export interface Author {
  uuid: string;
  name: string;
  profile_image: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author_id: string; // Foreign key to authors table
  author?: string; // Legacy support (optional)
  author_image?: string; // Legacy support (optional)
  authors?: Author; // Joined relational data
  image_url: string;
  category: 'Tech' | 'Design' | 'Tools' | 'Guides';
  created_at: string;
  excerpt?: string; 
  tags?: string[];
  read_time?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  description?: string;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  category: string;
  created_at: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  old_price: number;
  new_price: number;
  coupon_code: string;
  expiry: string;
  image_url: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface BackupData {
  version: string;
  timestamp: string;
  authors: Author[];
  blogs: BlogPost[];
}
