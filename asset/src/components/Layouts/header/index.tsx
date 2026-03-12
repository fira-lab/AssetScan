"use client";

import Image from "next/image";
import Link from "next/link";
// import { SearchIcon } from "@/assets/icons";
// import { Notification } from "./notification";
// import { ThemeToggleSwitch } from "./theme-toggle";
// import { UserInfo } from "./user-info";
// import { MenuIcon } from "./icons";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
        <Image
          src={"/images/logo/logo-icon.svg"}
          width={32}
          height={32}
          alt=""
          role="presentation"
        />
      </Link>

      <div className="max-xl:hidden">
        <h1 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
          Dashboard
        </h1>
        <p className="font-medium">Next.js Admin Dashboard G-OMM</p>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4"></div>
    </header>
  );
}
