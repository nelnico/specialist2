export type SpecialistInfo = {
  id: number;
  specialtyIds: number[];
  genderId: number;
  yearOfBirth: number | null;
  bio: string;
};

export type SpecialistPhoto = {
  id: number;
  url: string;
};

export type SpecialistContactInfo = {
  phones: string[];
  emails: string[];
  websites: string[];
  provinceId: number | null;
  location1: string | null;
  location2: string | null;
  location3: string | null;
};

export type SpecialistReviewSummary = {
  favoritedByCount: number;
  viewedCount: number;
  reviewCount: number;
  averageRating: number;
};
