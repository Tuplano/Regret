export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 text-gray-500 text-sm text-center py-6 font-mono bg-[#0b0b0b]">
      © {new Date().getFullYear()} $REGRET. All rights reserved. This is a meme coin for
      entertainment purposes.
    </footer>
  );
}
