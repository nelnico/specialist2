import { getSpecialistReviewSummary } from "../data/specialist-actions";

interface SpecialistReviewsProps {
  id: number;
}

const SpecialistReviews = async ({ id }: SpecialistReviewsProps) => {
  const data = await getSpecialistReviewSummary(id);
  return <div className="border p-4">{JSON.stringify(data, null, 2)}</div>;
};

export default SpecialistReviews;
