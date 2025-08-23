import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import SpecialistSearchForm from "./specialist-search-form";

export function SpecialistSearch() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Search</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader></SheetHeader>
        <div className="flex gap-4 flex-col px-4">
          <SpecialistSearchForm />
        </div>
        {/* 
        <SheetFooter>
          <Button type="submit">Search</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
