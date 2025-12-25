"use client"

import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  // Edit these constants if needed (kept inside so there are NO function inputs)
  const GITHUB_URL = "https://github.com/jaiveersingh7/ts-tsender-ui";
  const LOGO_SRC = "/0xjaiveer.png"; // put logo at /public/logo.png (or change path)

  return (
    <header className="w-full sticky top-0 z-50 border-b border-gray-200/70 bg-cyan-900 backdrop-blur-md dark:border-white/10 dark:bg-neutral">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Left: Brand */}
        <a href="/" className="group flex items-center gap-2" aria-label="Go to home">
          <span className="relative inline-block h-8 w-8 overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10">
            <Image
              src={LOGO_SRC}
              alt="tsender logo"
              fill
              priority
              sizes="32px"
              className="object-cover"
            />
          </span>
          <span className="text-lg font-semibold tracking-tight">tsender</span>
        </a>

        {/* Middle: GitHub */}
        <div className="ml-auto mr-2 sm:mx-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:shadow-md active:scale-[0.99] dark:border-white/15 dark:bg-neutral-900 dark:text-gray-100"
            aria-label="Open GitHub"
          >
            <FaGithub className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>

        {/* Right: Wallet connect */}
        <div className="shrink-0">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
