import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/">
          <Image
            src="/assets/images/logo.png"
            alt="logo"
            width={120}
            height={20}
          />
        </Link>

        <p>2023 Festivus. All Rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
