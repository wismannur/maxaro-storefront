// shared/types/product.ts

export type ProductCategory =
  | 'vrijstaande-baden'
  | 'inbouwbaden'
  | 'inloopdouches'
  | 'douchecabines'
  | 'badkamermeubels'
  | 'waskommen'
  | 'vloertegels'
  | 'wandtegels'
  | 'kranen';

export type ProductFinish =
  | 'Mat Wit'
  | 'Glans Wit'
  | 'Mat Zwart'
  | 'Chroom'
  | 'Brushed Gunmetal'
  | 'Eiken Natuur';

export interface ProductDimensions {
  lengthCm: number;
  widthCm: number;
  heightCm?: number;
  thicknessMm?: number; // For tiles
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryLabelNl: string;
  finish: ProductFinish;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  deliveryEstimateNl: string; // e.g. "Morgen in huis" or "2-3 werkdagen"
  rating: number; // e.g. 4.8
  reviewsCount: number; // e.g. 142
  dimensions: ProductDimensions;
  specsSummary: string;
  imageThumbnail: string;
  imageGallery: string[];
  showroomAvailableRoosendaal: boolean;
  warrantyYears: number;
  packageCoverageM2?: number; // For tiles, e.g. 1.44 or 1.08 m² per box
  pieceCountPerPackage?: number; // e.g. 4 or 6 tiles per box
}
