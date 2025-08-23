import SpecialistSearchOrder from "./search/specialist-search-order";
import SpecialistList from "./listing/specialist-list";
import { SpecialistSearchProvider } from "../specialist-search-provider";
import { SpecialistSearch } from "./search/specialist-search";

const Specialists = async () => {
  return (
    <SpecialistSearchProvider>
      <div className="sticky top-16 z-40 w-full bg-background border-b px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <SpecialistSearchOrder />
          <SpecialistSearch />
        </div>
      </div>
      <SpecialistList />
    </SpecialistSearchProvider>
  );
};

export default Specialists;
