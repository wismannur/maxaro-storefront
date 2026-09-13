// shared/types/showroom.ts
export interface ShowroomLocation {
  id: string;
  city: string;
  name: string;
  address: string;
  postalCode: string;
  phone: string;
  openingHoursToday: string;
  isFlagship?: boolean;
}

export interface ShowroomPassItem {
  id: string;
  sku: string;
  name: string;
  finish: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageThumbnail: string;
  categoryLabelNl: string;
}

export interface ShowroomPassData {
  passId: string; // e.g. "MAX-SHW-742918"
  createdAt: string; // ISO date string
  expiresAt: string; // ISO date string (30 days validity)
  showroom: ShowroomLocation;
  items: ShowroomPassItem[];
  totals: {
    itemCount: number;
    subtotal: number;
    vatAmount: number;
    total: number;
  };
  notes?: string;
}
