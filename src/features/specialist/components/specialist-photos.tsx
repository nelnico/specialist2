import { getSpecialistPhotos } from "../data/specialist-actions";

interface SpecialistPhotosProps {
  id: number;
}
const SpecialistPhotos = async ({ id }: SpecialistPhotosProps) => {
  const data = await getSpecialistPhotos(id);
  return <div className="border p-4">{JSON.stringify(data, null, 2)}</div>;
};

export default SpecialistPhotos;
