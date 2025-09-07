import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  // lock body scroll saat menu terbuka
  useEffect(() => {
    if (open) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Tenun" },
    { to: "/explore", label: "Explore" },
    { to: "/lookbook", label: "Lookbook" },
    { to: "/stories", label: "Stories" },
  ];

  const linkBase =
    "block rounded-lg px-4 py-3 text-white/90 hover:text-white hover:bg-white/10";
  const active =
    "bg-white/15 text-white shadow-sm ring-1 ring-white/10";

  return (
    <nav className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between bg-transparent px-4 py-4 text-white">
      {/* Brand */}
      <Link
        to="/"
        className="font-playfair text-xl font-bold tracking-wide"
        onClick={() => setOpen(false)}
      >
        | This Tenun
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6 font-poppins font-semibold">
        {navItems.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `hover:text-gray-200 ${isActive ? "text-[#F6D69B]" : ""}`
            }
          >
            {it.label}
          </NavLink>
        ))}
      </div>

      {/* Mobile: hamburger */}
      <button
        type="button"
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/30 ring-1 ring-white/20 backdrop-blur"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden">
          {/* backdrop */}
          <div
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          {/* panel kiri-atas */}
          <div className="fixed left-4 right-4 top-16 z-[75]">
            <div className="relative rounded-2xl bg-white/10 p-2 backdrop-blur-lg ring-1 ring-white/20 shadow-[0_10px_30px_rgba(0,0,0,.35)]">
              {/* header + close */}
              <div className="flex items-center justify-between px-3 py-2">
                <div className="font-playfair text-lg font-bold">| This Tenun</div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 ring-1 ring-white/25"
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* links */}
              <div className="px-2 pb-2">
                {navItems.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? active : ""}`
                    }
                  >
                    {it.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
