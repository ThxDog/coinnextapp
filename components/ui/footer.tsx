"use client";
import {
  Button,
  FixedLayout,
  Modal,
  Placeholder,
} from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {
  BoxesIcon,
  FlaskConicalIcon,
  HomeIcon,
  LucideClipboardList,
  RocketIcon,
} from "lucide-react";
import { Span } from "next/dist/trace";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import ModalBoost from "./modal-boost";

const Footer = () => {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Home",
      children: (
        <span className="flex justify-center items-center gap-2 flex-1 transition-colors ease-in duration-300  rounded-lg  py-1">
          <HomeIcon className="size-6" />
        </span>
      ),
      href: "/",
    },
    {
      name: "Task",
      children: (
        <span className="flex justify-center items-center gap-2 flex-1 transition-colors ease-in duration-300  rounded-lg  py-1">
          <LucideClipboardList className="size-6" />
        </span>
      ),
      href: "tasks",
    },
    {
      name: "Boost",
      children: <ModalBoost />,
      href: "",
    },
    {
      name: "Fren",
      children: (
        <span className="flex justify-center items-center gap-2 flex-1 transition-colors ease-in duration-300 rounded-lg  py-1">
          <BoxesIcon className="size-6" />
        </span>
      ),
      href: "frens",
    },
    {
      name: "Lab",
      children: (
        <span className="flex justify-center items-center gap-2 flex-1 transition-colors ease-in duration-300  rounded-lg  py-1">
          <FlaskConicalIcon className="size-6" />
        </span>
      ),
      href: "labs",
    },
  ];

  return (
    <footer className="flex fixed pb-4 bottom-0   w-full   flex-col justify-center items-center bg-[#212121] gap-2 self-stretch border-spacing-1 border-white/10 border-t">
      <div className="flex p-4 items-start self-stretch gap-2">
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.name}
            className={`flex-1 ${
              pathname.endsWith(item.href) && item.href !== ""
                ? "text-primary"
                : "text-gray-500"
            }`}
          >
            {item.children}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
