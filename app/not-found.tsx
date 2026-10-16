import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1a1a1a] flex flex-col items-center justify-center p-6 text-center font-sans">
      <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-2">404</h1>
      <p className="text-sm font-mono text-neutral-600 mb-4">Sovereign Coordinates Not Found in Realm Grid</p>
      <Link
        href="/"
        className="px-4 py-2 bg-[#1a1a1a] text-[#FAF7F2] text-xs font-mono uppercase tracking-wider hover:bg-[#c5a27d] transition-colors"
      >
        Return to Sovereign Command
      </Link>
    </div>
  );
}
