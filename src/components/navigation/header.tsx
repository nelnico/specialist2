import { siteConfig } from "@/lib/data/site-config";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b h-16 flex items-center px-6">
      <div>{siteConfig.name}</div>
    </header>
  );
};

export default Header;
