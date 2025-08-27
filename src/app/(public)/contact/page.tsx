import { Smile } from "lucide-react";
import ContactUsForm from "./contact-form";

const Page = () => {
  return (
    <div className=" grid flex-1 lg:grid-cols-2">
      <div className="hidden flex-1 items-center justify-end p-6 md:p-10 lg:flex">
        <ul className="max-w-sm space-y-8">
          <li>
            <div className="flex items-center gap-2">
              <Smile className="size-4" />
              <p className="font-semibold">Let&apos;s Start a Conversation!</p>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              We&apos;d love to hear from you. Send us a message and we&apos;ll
              respond as soon as possible.
            </p>
          </li>
        </ul>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 md:p-10 lg:justify-start">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default Page;
