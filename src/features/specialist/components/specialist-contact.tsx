import { getSpecialistContactInfo } from "../data/specialist-actions";

interface SpecialistContactProps {
  id: number;
}

const SpecialistContact = async ({ id }: SpecialistContactProps) => {
  const data = await getSpecialistContactInfo(id);
  return <div className="border p-4">{JSON.stringify(data, null, 2)}</div>;
};

export default SpecialistContact;
