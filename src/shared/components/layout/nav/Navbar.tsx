import NavLink from "./components/NavLink";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact us" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar() {
  return (
    <nav className="">
      <ul className="flex flex-wrap justify-center items-center divide-x divide-slate-200 gap-2 w-fit">
        {navLinks.map((link) => (
          <li key={link.label} className="">
            <NavLink href={link.to} label={link.label} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
