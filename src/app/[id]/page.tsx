import { notFound } from "next/navigation";
import Link from "next/link";
import Specialist from "@/features/specialist/components/specialist";

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/">Back</Link>
      <h1 className="text-2xl font-semibold">ID: {id}</h1>
      <Specialist id={id} />
    </main>
  );
}
