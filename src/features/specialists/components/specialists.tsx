import SpecialistSearchOrder from "./specialist-search-order";
import SpecialistList from "./specialist-list";
import { SpecialistSearchProvider } from "../specialist-search-provider";
import { SpecialistSearch } from "./specialist-search";

const Specialists = async () => {
  return (
    <SpecialistSearchProvider>
      <div className="sticky top-0 z-10 w-full bg-white p-4 shadow-md flex justify-between">
        <SpecialistSearchOrder />
        <SpecialistSearch />
      </div>
      <SpecialistList />
    </SpecialistSearchProvider>
  );
};

export default Specialists;
