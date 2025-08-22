import { notFound } from "next/navigation";
import Link from "next/link";
import Specialist from "@/features/specialist/components/specialist";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/">Back</Link>
      <h1 className="text-2xl font-semibold">ID: {id}</h1>
      <Specialist id={id} />
    </main>
  );
}
