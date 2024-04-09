"use client";

import { headerLinks } from "@/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItems = () => {
  const pathname = usePathname();

  return (
    <ul className="md:flex-row flex flex-col gap-4 ">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            href={link.route}
            key={link.label}
            className={`${
              isActive && "text-primary-500"
            } p-medium-16 whitespace-nowrap`}
          >
            {link.label}
          </Link>
        );
      })}
    </ul>
  );
};

export default NavItems;
