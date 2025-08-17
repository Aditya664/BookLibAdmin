export interface CommonResponse<T>{
  success: boolean
  message:string;
  data:T
}

export interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  totalGenres: number;
  totalReviews: number;
  totalFavorites: number;
  totalSubscriptions: number;
  totalReadingSessions: number;
  recentActivity?: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: 'BOOK_ADDED' | 'BOOK_BORROWED' | 'BOOK_RETURNED' | 'USER_REGISTERED';
  description: string;
  timestamp: Date;
  userId?: number;
  bookId?: number;
}
