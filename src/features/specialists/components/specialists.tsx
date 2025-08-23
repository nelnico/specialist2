import SpecialistSearchOrder from "./search/specialist-search-order";
import SpecialistList from "./listing/specialist-list";
import { SpecialistSearchProvider } from "../specialist-search-provider";
import { SpecialistSearch } from "./search/specialist-search";

const Specialists = async () => {
  return (
    <SpecialistSearchProvider>
      <div className="sticky top-14 z-40 w-full bg-background border-b py-3 shadow-sm">
        <div className="flex items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
          <SpecialistSearchOrder />
          <SpecialistSearch />
        </div>
      </div>
      <SpecialistList />
    </SpecialistSearchProvider>
  );
};

export default Specialists;
