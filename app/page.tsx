"use client";

import { useState } from "react";
import { FaXTwitter, FaChartBar, FaTiktok, FaInstagram } from "react-icons/fa6";
import { SiCoinmarketcap } from "react-icons/si";
import MemeGenerator from "./components/MemeGenerator";
import Modal from "./components/Modal";

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121212] via-[#0f0f0f] to-[#0b0b0b] text-white flex flex-col items-center justify-start relative overflow-hidden pb-40">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute text-[6rem] font-black text-white/10 select-none top-20 left-10 blur-[1px] animate-float-1">
          REGRET
        </div>
        <div className="absolute text-[6rem] font-black text-white/10 select-none bottom-20 right-10 blur-[1px] animate-float-2">
          REGRET
        </div>
        <div className="absolute text-[8rem] font-black text-white/15 select-none top-1/2 left-[10%] blur-[2px] animate-float-3">
          REGRET
        </div>
        <div className="absolute text-[5rem] font-black text-white/10 select-none top-32 right-[15%] blur-[1px] animate-float-4">
          REGRET
        </div>
        <div className="absolute text-[7rem] font-black text-white/15 select-none bottom-[10%] left-[5%] blur-[2px] animate-float-5">
          REGRET
        </div>
        <div className="absolute text-[10rem] font-black text-white/5 select-none top-[40%] left-[35%] blur-[3px] animate-float-6">
          REGRET
        </div>
      </div>
      <section className="flex flex-col items-center justify-center min-h-[90vh] gap-6 z-10  px-4 text-center">
        <img
          src="/assets/logo.jpeg"
          alt="regret logo"
          className="w-32 h-32 rounded-full shadow-[0_0_30px_#00000055]  delay-100"
        />

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-wide text-white drop-shadow-[0_0_10px_#ffffff55] animate-pulse">
          $REGRET
        </h1>

        <p className="text-gray-400 text-sm md:text-base italic mt-1  delay-200">
          You either regret buying or regret selling
        </p>

        <p className="text-sm mt-3 text-gray-400 tracking-wider animate-fade-up delay-300">
          Contract Address:
        </p>
        <div className="bg-[#1c1c1c] rounded-xl px-4 py-2 border border-[#333] font-mono text-sm animate-fade-up delay-400">
          DP4omjjy94NRJrECHBzyUQSpGrjtukoDyUbqb9Zzpump
        </div>

        <div className="flex gap-3 mt-6 animate-fade-up delay-500">
          <button
            onClick={() => setOpen(true)}
            className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:bg-gray-200 hover:-translate-y-1 transition-all duration-300"
          >
            Create Your Meme
          </button>
        </div>

        <div className="flex gap-5 mt-8 text-xl text-gray-400 animate-fade-up delay-600">
          <a
            href="https://x.com/i/communities/1965671500255514703"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter className="hover:text-white cursor-pointer transition-transform hover:scale-110 duration-300" />
          </a>

          <a
            href="https://dexscreener.com/solana/ccyufsfkwbor2ak9zygfcj18eblqwrrnjebpbc6hkcm8"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaChartBar className="hover:text-white cursor-pointer transition-transform hover:scale-110 duration-300" />
          </a>
          <a
            href="https://www.tiktok.com/@regretonpump"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok className="hover:text-white cursor-pointer transition-transform hover:scale-110 duration-300" />
          </a>
          <a
            href="https://www.instagram.com/regretonpump/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="hover:text-white cursor-pointer transition-transform hover:scale-110 duration-300" />
          </a>
          <a
            href="https://coinmarketcap.com/currencies/regret/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiCoinmarketcap className="hover:text-white cursor-pointer transition-transform hover:scale-110 duration-300" />
          </a>
        </div>
      </section>
      {/* Dexscreener Live Chart Section */}
      <section className="w-full flex flex-col items-center mt-24">
        <h2 className="text-3xl font-semibold mb-8 tracking-wide text-white/90">
          Live Chart
        </h2>
        <div className="w-full max-w-6xl aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <iframe
            src="https://dexscreener.com/solana/Dp4omjjy94NRJrECHBzyUQSpGrjtukoDyUbqb9Zzpump?embed=1&theme=dark"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </section>
      {/* Modal with Avatar Customizer */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <MemeGenerator />
      </Modal>
    </main>
  );
}
