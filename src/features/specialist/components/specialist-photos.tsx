import { IMAGE_BASE_URL } from "@/lib/data/constants";
import { SpecialistPhoto } from "../data/specialist-types";
import Image from "next/image";

interface SpecialistPhotosProps {
  data: SpecialistPhoto[];
}
const SpecialistPhotos = ({ data }: SpecialistPhotosProps) => {
  // model here will be SpecialistPhoto[]
  return (
    <div className="border p-4">
      {data.map((photo) => (
        <Image
          key={photo.id}
          src={`${IMAGE_BASE_URL}/${photo.url}`}
          alt="just a pic"
          width={600}
          height={400}
        />
      ))}
    </div>
  );
};

export default SpecialistPhotos;
