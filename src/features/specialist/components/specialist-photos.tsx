import { SpecialistPhoto } from "../data/specialist-types";

interface SpecialistPhotosProps {
  data: SpecialistPhoto[];
}
const SpecialistPhotos = ({ data }: SpecialistPhotosProps) => {
  // model here will be SpecialistPhoto[]
  return <div className="border p-4">{JSON.stringify(data, null, 2)}</div>;
};

export default SpecialistPhotos;
