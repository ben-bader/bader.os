"use client"

import { ArrowUpRight, Menu, X } from "lucide-react"
import { useState } from "react"

const links = [
  "home",
  "work",
  "about",
  "capabilities",
  "journey",
  "contact",
]

export default function SiteHeader() {
  const [toggleMenu, setToggleMenu] = useState(false)

  const closeMenu = () => setToggleMenu(false)

  return (
    <header className="sticky top-0 z-header flex min-h-[78px] items-center justify-between gap-6 border-b border-border-subtle bg-[rgba(16,19,21,.84)] px-page-gutter backdrop-blur-[18px] max-mobile:min-h-[68px] max-mobile:gap-[10px]">
      <a
        className="inline-flex w-fit items-center gap-[11px] font-portfolio-body text-[.85rem] font-semibold tracking-[-.02em] no-underline"
        href="#home"
        aria-label="Bader Bennani, home"
        onClick={closeMenu}
      >
        <span
          className="grid size-9 place-items-center rounded-full bg-accent text-accent-ink text-[1.1rem] font-bold tracking-[-.08em]"
          aria-hidden="true"
        >
          b.
        </span>

        <span className="grid leading-[1.25]">
          Bader Bennani
          <small className="mt-1 text-muted text-[.64rem] font-normal tracking-[.025em]">
            Computer engineering
          </small>
        </span>
      </a>

      <div className="relative flex items-center gap-2">
        {/* Desktop CTA */}
        <a
          className="hidden min-h-11 items-center gap-[7px] rounded-control border border-border-strong px-[14px] text-[.78rem] font-medium no-underline transition-colors duration-200 hover:border-accent hover:text-accent sm:inline-flex"
          href="#contact"
        >
          Let’s talk
          <ArrowUpRight aria-hidden="true" size={15} />
        </a>

        <button
          type="button"
          className="inline-flex size-10 z-10 items-center justify-center rounded-control border border-border-subtle text-foreground transition-colors duration-200 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:hidden"
          onClick={() => setToggleMenu((open) => !open)}
          aria-label={toggleMenu ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={toggleMenu}
          aria-controls="mobile-navigation"
        >
          {toggleMenu ? <X size={21} /> : <Menu size={21} />}
        </button>

        {/* Mobile navigation */}
        {toggleMenu && (
          <div
            id="mobile-navigation"
            className="fixed inset-0 z-[100] flex min-h-dvh flex-col bg-[rgba(16,19,21,.98)] px-6 pb-10 pt-5 sm:hidden"
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-5">
              <span className="text-sm font-medium text-muted">
                Navigation
              </span>

              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-control text-foreground transition-colors duration-200 hover:bg-white/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={closeMenu}
                aria-label="Close navigation menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-2" aria-label="Mobile navigation">
              {links.map((link, index) => (
                <a
                  key={link}
                  href={`#${link}`}
                  onClick={closeMenu}
                  className="group flex items-center justify-between border-b border-border-subtle py-4 text-2xl font-medium capitalize tracking-tight text-foreground transition-colors duration-200 hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                >
                  <span>{link}</span>
                  <span className="text-sm text-muted transition-colors duration-200 group-hover:text-accent">
                    0{index + 1}
                  </span>
                </a>
              ))}
            </nav>

            <a
              href="#contact"
              onClick={closeMenu}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-accent bg-accent px-5 text-sm font-semibold text-accent-ink no-underline transition-colors duration-200 hover:bg-transparent hover:text-accent"
            >
              Let’s talk
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
        )}
      </div>
    </header>
  )
}