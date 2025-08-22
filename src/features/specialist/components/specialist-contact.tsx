import { SpecialistContactInfo } from "../data/specialist-types";

interface SpecialistContactProps {
  contactInfo: SpecialistContactInfo;
}

const SpecialistContact = ({ contactInfo }: SpecialistContactProps) => {
  // model here will be SpecialistContactInfo
  return (
    <div className="border p-4">{JSON.stringify(contactInfo, null, 2)}</div>
  );
};

export default SpecialistContact;
