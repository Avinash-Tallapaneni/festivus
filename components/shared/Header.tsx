import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className=" w-full border-b">
      <div className="wrapper flex items-center justify-between gap-10">
        <Link href="/" className="w-48">
          <Image
            src="/assets/images/logo.png"
            className=""
            alt="Logo"
            width={120}
            height={20}
          />
        </Link>

        <SignedIn>
          <nav className="md:flex-between w-full hidden">
            <NavItems />
          </nav>
        </SignedIn>
        <div className="flex justify-end gap-3 ">
          <SignedIn>
            <div className="flex items-center justify-between gap-2">
              <UserButton afterSignOutUrl="/" showName />
              <MobileNav />
            </div>
          </SignedIn>
          <SignedOut>
            <Button className="rounded-md">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
