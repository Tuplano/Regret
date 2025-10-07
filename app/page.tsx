"use client";

import { useState } from "react";
import Image from "next/image";
import { FaXTwitter, FaChartBar, FaTiktok, FaInstagram } from "react-icons/fa6";
import { SiCoinmarketcap } from "react-icons/si";
import MemeGenerator from "./components/MemeGenerator";
import Modal from "./components/Modal";

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121212] via-[#0f0f0f] to-[#0b0b0b] text-white flex flex-col items-center justify-start relative overflow-hidden pb-32 sm:pb-40">
      {/* Floating background text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          "top-20 left-10",
          "bottom-20 right-10",
          "top-1/2 left-[10%]",
          "top-32 right-[15%]",
          "bottom-[10%] left-[5%]",
          "top-[40%] left-[35%]",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} font-black select-none blur-[1.5px] text-white/[${
              i % 2 ? "10" : "15"
            }] text-[4rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] animate-float-${i + 1}`}
          >
            REGRET
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[85vh] gap-5 sm:gap-6 z-10 px-4 text-center">
        <img
          src="/assets/logo.jpeg"
          alt="regret logo"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-[0_0_30px_#00000055]"
        />

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wide text-white drop-shadow-[0_0_10px_#ffffff55] animate-pulse">
          $REGRET
        </h1>

        <p className="text-gray-400 text-sm sm:text-base italic mt-1">
          You either regret buying or regret selling
        </p>

        <p className="text-xs sm:text-sm mt-3 text-gray-400 tracking-wider animate-fade-up">
          Contract Address:
        </p>
        <div className="bg-[#1c1c1c] rounded-xl px-3 sm:px-4 py-2 border border-[#333] font-mono text-xs sm:text-sm animate-fade-up break-all max-w-[90vw]">
          DP4omjjY94NRJrECHBZyUQSpGrjtukoDyUbqb9Zzpump
        </div>

        <div className="flex gap-3 mt-5 animate-fade-up">
          <button
            onClick={() => setOpen(true)}
            className="bg-white text-black text-sm sm:text-base px-4 sm:px-5 py-2 rounded-xl font-semibold hover:bg-gray-200 hover:-translate-y-1 transition-all duration-300"
          >
            Create Your Meme
          </button>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-6 mt-8 text-lg sm:text-xl text-gray-400 animate-fade-up">
          <a
            href="https://x.com/i/communities/1965671500255514703"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-125 hover:-translate-y-1 hover:text-white"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://dexscreener.com/solana/ccyufsfkwbor2ak9zygfcj18eblqwrrnjebpbc6hkcm8"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-125 hover:-translate-y-1 hover:text-white"
          >
            <FaChartBar />
          </a>
          <a
            href="https://www.tiktok.com/@regretonpump"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-125 hover:-translate-y-1 hover:text-white"
          >
            <FaTiktok />
          </a>
          <a
            href="https://www.instagram.com/regretonpump/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-125 hover:-translate-y-1 hover:text-white"
          >
            <FaInstagram />
          </a>
          <a
            href="https://coinmarketcap.com/currencies/regret/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-125 hover:-translate-y-1 hover:text-white"
          >
            <SiCoinmarketcap />
          </a>
          <a
            href="https://www.coingecko.com/en/coins/regret"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-125 hover:-translate-y-1 hover:text-white"
          >
            <Image
              src="/assets/CG-Symbol.svg"
              alt="regret mascot"
              width={20}
              height={20}
            />
          </a>
        </div>
      </section>

      {/* Live Chart Section */}
      <section className="w-full flex flex-col items-center mt-16 sm:mt-24 px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 tracking-wide text-white/90 text-center">
          Live Chart
        </h2>

        <div className="w-full max-w-6xl rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]">
            <iframe
              src="https://dexscreener.com/solana/Dp4omjjY94NRJrECHBzyUQSpGrjtukoDyUbqb9Zzpump?embed=1&theme=dark"
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <MemeGenerator />
      </Modal>
    </main>
  );
}
