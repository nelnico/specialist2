import {
  getSpecialistContactInfo,
  getSpecialistInfo,
  getSpecialistPhotos,
  getSpecialistReviewSummary,
} from "../data/specialist-actions";
import SpecialistContact from "./specialist-contact";
import SpecialistPhotos from "./specialist-photos";
import SpecialistReviews from "./specialist-reviews";

const Specialist = async ({ id }: { id: number }) => {
  const [info, photos, contact, review] = await Promise.all([
    getSpecialistInfo(id), // could also pass a fetch wrapper with { next: { tags } } if you use fetch
    getSpecialistPhotos(id),
    getSpecialistContactInfo(id),
    getSpecialistReviewSummary(id),
  ]);
  return (
    <div className="flex flex-col">
      <div>Specialist Info: {JSON.stringify(info, null, 2)}</div>
      <SpecialistPhotos data={photos} />
      <SpecialistContact contactInfo={contact} />
      <SpecialistReviews reviewSummary={review} />
    </div>
  );
};

export default Specialist;
