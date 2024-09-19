import React from "react";
import { Link } from "react-router-dom";
import { Menu, XIcon } from "lucide-react";
import { Nav } from "@/components";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <header>
      <div className="max-w-screen-lg mx-auto px-4 my-2">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to={"/"} className="text-2xl font-bold text-nowrap">
              <div className="h-20 aspect-square">
                <img src="/logo.svg" alt="" className="w-full object-contain" />
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <Nav horizontal />
          </div>
          <div className="-mr-2 flex md:hidden">
            <Button onClick={() => setIsOpen(!isOpen)} size={"icon"}>
              {isOpen ? <XIcon /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <Nav />
        </div>
      )}
    </header>
  );
}
