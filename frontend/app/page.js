import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Link
        href="/dashboard"
        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow"
      >
        Aller au dashboard
      </Link>
    </main>
  );
}
