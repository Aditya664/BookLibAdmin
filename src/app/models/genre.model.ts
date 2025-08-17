export interface Genre {
  id?: number;
  name: string;
  iconName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  books?: GenreBook[];
}

export interface GenreBook {
  id: number;
  bookName: string;
}

export interface AddGenreRequest {
  name: string;
  iconName: string;
}

export interface GenreResponse {
  success: boolean;
  message: string;
  data: Genre;
}

export interface GenresListResponse {
  success: boolean;
  message: string;
  data: Genre[];
}
