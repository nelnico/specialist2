import { SpecialistsSearchForm } from "@/features/specialists/specialist-search-types";

export const queryKeys = {
  specialistSearch: (searchParams: SpecialistsSearchForm) => [
    "specialists",
    ...buildSearchParamTags(searchParams),
  ],
};

function buildSearchParamTags(params: SpecialistsSearchForm): string[] {
  const { page, pageSize, query, genderIds, provinceIds, sortOption } = params;

  const tags: string[] = [];

  // Add basic values
  tags.push(`page_number_${page}`);
  tags.push(`page_size_${pageSize}`);
  if (query) tags.push(`query_${query}`);

  if (genderIds?.length) tags.push(`genderIds_${genderIds.join("_")}`);
  if (provinceIds?.length) tags.push(`provinceIds_${provinceIds.join("_")}`);

  // Handle ranges
  //   if (ageRange) tags.push(`ageRange_${ageRange[0]}_${ageRange[1]}`);

  // Handle sortOption
  if (sortOption) tags.push(`sortOption_${sortOption}`);
  return tags;
}
