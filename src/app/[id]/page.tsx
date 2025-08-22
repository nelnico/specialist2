import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;

  if (!id) notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/">Back</Link>
      <h1 className="text-2xl font-semibold">{id}</h1>
      <p className="mt-3 text-sm text-gray-600">ID: {id}</p>
    </main>
  );
}
