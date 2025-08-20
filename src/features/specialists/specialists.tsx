import SpecialistSearchOrder from "./specialist-search-order";
import SpecialistList from "./specialist-list";
import SpecialistSearchForm from "./specialist-search-form";
import { SpecialistSearchProvider } from "./specialist-search-provider";

const Specialists = async () => {
  return (
    <SpecialistSearchProvider>
      <SpecialistSearchForm />
      <SpecialistSearchOrder />
      <SpecialistList />
    </SpecialistSearchProvider>
  );
};

export default Specialists;
