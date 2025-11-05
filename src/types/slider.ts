export type SliderItem = {
  id?: string;            // Firestore doc id (listeleme için)
  imageUrl: string;       // Storage URL
  title: string;          // büyük başlık
  subtitle: string;       // orta başlık
  description: string;    // kısa yazı
  order: number;          // sıralama (küçük -> üstte)
  active: boolean;        // ana sayfada gösterilsin mi
  createdAt?: number;     // Date.now()
};
