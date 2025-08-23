import Link from "next/link";

const Page = () => {
  return (
    <div>
      <h1 className="text-xl font-bold">Admin Dashboard Home Page</h1>
      <ul>
        <li>
          <Link href="/admin/users">Manage Users</Link>
        </li>
        <li>
          <Link href="/admin/clients">Manage Clients</Link>
        </li>
        <li>
          <Link href="/admin/specialists">Manage Specialists</Link>
        </li>
      </ul>
    </div>
  );
};

export default Page;
