import { getSpecialistInfo } from "../data/specialist-actions";
import SpecialistContact from "./specialist-contact";
import SpecialistPhotos from "./specialist-photos";
import SpecialistReviews from "./specialist-reviews";

const Specialist = async ({ id }: { id: number }) => {
  const data = await getSpecialistInfo(id);

  return (
    <div className="flex flex-col">
      <div>Specialist Info: {JSON.stringify(data, null, 2)}</div>
      <SpecialistPhotos id={id} />
      <SpecialistContact id={id} />
      <SpecialistReviews id={id} />
    </div>
  );
};

export default Specialist;
