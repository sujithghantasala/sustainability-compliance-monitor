import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/list", label: "Records" },
    { to: "/add", label: "Add Record" },
    { to: "/analytics", label: "Analytics" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-white/20 bg-[#106EBE] text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center">
          <div>
            <p className="font-bold leading-tight">Sustainability Monitor</p>
            <p className="text-xs text-blue-100">Compliance workspace</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-white text-[#106EBE]"
                    : "text-blue-50 hover:bg-white/15"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="rounded-md border border-white/30 px-3 py-2 text-sm font-semibold transition hover:bg-white hover:text-[#106EBE]"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
