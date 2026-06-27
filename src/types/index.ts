export interface TwistOption {
  id: string;
  name: string;
  size: string;
  price: number;
}

export interface ColorStory {
  id: string;
  name: string;
}

export interface Collection {
  id: string;
  slug: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  colorStories: ColorStory[];
  image: string;
  accentColor: string;
  bgGradient: string;
  textColor: string;
}

export interface CartItem {
  id: string;
  collectionSlug: string;
  collectionName: string;
  collectionNumber: string;
  colorStory: string;
  twist: TwistOption;
  quantity: number;
}

export interface ColorSwatch {
  primary: string;
  secondary: string;
  label: string;
}

export interface ShippingRate {
  country: string;
  code: string;
  rate: number;
  days: string;
}
