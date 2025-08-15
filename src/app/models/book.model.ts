export interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  description: string;
  language: LanguageType;
  image: string;
  genres: Genre[];
  pdfFile?: string | null;
  pdfFileName?: string | null;
  createdAt: Date;
}

export enum LanguageType {
  English = 'English',
  Hindi = 'Hindi',
  Marathi = 'Marathi',
}

export interface Genre {
  id: number;
  name: string;
  description?: string;
}

export interface BookCreateRequest {
  title: string;
  author: string;
  rating: number;
  description?: string;
  language: LanguageType;
  image?: string;
  genreIds: number[];
}



export interface BookUpdateRequest extends Partial<BookCreateRequest> {
  id: number;
}
