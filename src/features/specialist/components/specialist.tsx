import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSpecialistInfo } from "../data/specialist-actions";
import SpecialistContact from "./specialist-contact";
import SpecialistPhotos from "./specialist-photos";
import SpecialistReviews from "./specialist-reviews";

const Specialist = async ({ id }: { id: number }) => {
  const data = await getSpecialistInfo(id);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Main Content Area - 4 Blocks */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Block 1 */}
            <Card className="h-60 md:h-72">
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                <SpecialistPhotos id={id} />
              </CardContent>
            </Card>

            {/* Block 2 */}
            <Card className="h-60 md:h-72">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                {JSON.stringify(data, null, 2)}
              </CardContent>
            </Card>

            {/* Block 3 */}
            <Card className="h-60 md:h-72">
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                <SpecialistContact id={id} />
              </CardContent>
            </Card>

            {/* Block 4 */}
            <Card className="h-60 md:h-72">
              <CardHeader>
                <CardTitle>What else?</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                <p className="text-muted-foreground">what can we put here</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 lg:flex-shrink-0">
          <Card className="h-60 lg:h-full">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <p className="text-muted-foreground mb-4">
                This is the right sidebar container. It's responsive and adapts
                to different screen sizes.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium">Quick Actions</h4>
                  <p className="text-sm text-muted-foreground">
                    Sidebar content here
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium">Recent Activity</h4>
                  <p className="text-sm text-muted-foreground">
                    More sidebar content
                  </p>
                </div>

                <SpecialistReviews id={id} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="mt-6 h-32">
        <CardHeader>
          <CardTitle>More like this</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <p className="text-muted-foreground">list similar specialists here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Specialist;
