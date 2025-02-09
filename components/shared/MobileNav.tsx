import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Image from "next/image";
import NavItems from "./NavItems";
import { Separator } from "../ui/separator";

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="flex-between">
          <Image
            src="/assets/icons/menu.svg"
            width={24}
            height={24}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white ">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={128}
            height={38}
          />
          <Separator className="border border-gray-50" />
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
