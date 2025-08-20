export interface DataOption {
  label: string;
  value: number;
  priority?: number;
}

export function getValueByLabelFromList(
  options: DataOption[],
  label?: string | null
): number | undefined {
  if (!label) return undefined;
  const norm = label.trim().toLowerCase();
  const option = options.find((o) => o.label.toLowerCase() === norm);
  return option?.value;
}

export function getLabelByValueFromList(
  options: DataOption[],
  value?: number | null
): string | undefined {
  if (value == null) return undefined;
  return options.find((o) => o.value === value)?.label;
}

export function tryFindOptionValue(
  options: DataOption[],
  text?: string | null
): number | undefined {
  if (!text) return undefined;
  const norm = text.trim().toLowerCase();
  const option = options.find((o) => o.label.toLowerCase() === norm);
  return option?.value;
}

export const reviewOptions: DataOption[] = [
  { value: 1, label: "Communication" },
  { value: 2, label: "Teamwork" },
  { value: 3, label: "Problem Solving" },
  { value: 4, label: "Adaptability" },
  { value: 5, label: "Creativity" },
];

export const genderOptions: DataOption[] = [
  { value: 1, label: "Female", priority: 1 },
  { value: 2, label: "Male", priority: 2 },
];

export const provinceOptions: DataOption[] = [
  { value: 1, label: "Gauteng", priority: 1 },
  { value: 2, label: "KwaZulu-Natal", priority: 2 },
  { value: 3, label: "Western Cape", priority: 3 },
  { value: 4, label: "Eastern Cape", priority: 4 },
  { value: 5, label: "Mpumalanga", priority: 5 },
  { value: 6, label: "Limpopo", priority: 6 },
  { value: 7, label: "North West", priority: 7 },
  { value: 8, label: "Free State", priority: 8 },
  { value: 9, label: "Northern Cape", priority: 9 },
];

export const specialtyOptions: DataOption[] = [
  { value: 1, label: "Electrical", priority: 1 },
  { value: 2, label: "Plumbing", priority: 2 },
  { value: 3, label: "Carpentry", priority: 3 },
  { value: 4, label: "Painting", priority: 4 },
  { value: 5, label: "Gardening", priority: 5 },
  { value: 6, label: "Cleaning", priority: 6 },
  { value: 7, label: "Construction", priority: 7 },
  { value: 8, label: "HVAC", priority: 8 },
  { value: 9, label: "Pest Control", priority: 9 },
  { value: 10, label: "Moving", priority: 10 },
];
