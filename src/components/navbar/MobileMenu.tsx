"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import links from "./links.json";

interface MobileMenuProps {
  open: boolean;
  toggleOpen: () => void;
}

function MobileMenu({ open, toggleOpen }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <RemoveScrollBar />
          <motion.aside
            className="absolute left-0 right-0 top-16 z-50 w-full bg-primary text-primary-foreground lg:hidden"
            initial={{ height: 0 }}
            animate={{
              height: "100vh",
            }}
            exit={{
              height: 0,
              transition: { delay: 0.1 },
            }}>
            <motion.div
              className="flex h-full flex-col overflow-y-auto p-5 pb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              exit={{ opacity: 0 }}>
              {links.map((link, id) =>
                link.sublinks ? (
                  <div key={id} className="border-border-900 border-b-2">
                    <div className="p-2 text-xl font-medium">{link.name}</div>
                    <div className="mb-1 ml-3">
                      {link.sublinks.map((sublink) => (
                        <Link
                          key={sublink.href}
                          className="flex flex-col py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                          href={sublink.href}
                          target={sublink.href?.startsWith("http") ? "_blank" : "_self"}
                          rel={sublink.href?.startsWith("http") ? "noopener noreferrer" : ""}
                          onClick={() => toggleOpen()}>
                          <div className="inline-flex text-sm font-medium leading-none">
                            {sublink.name}
                            {sublink.href?.startsWith("http") && (
                              <ArrowUpRight className="ml-1 inline-block h-3 w-3 text-muted dark:text-muted-foreground" />
                            )}
                          </div>
                          <div className="mt-1 text-xs text-muted dark:text-muted-foreground">
                            {sublink.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    className="border-border-900 border-b-2 p-2 text-xl font-medium no-underline transition-colors hover:bg-accent hover:text-accent-foreground"
                    href={link.href}
                    key={id}
                    onClick={() => toggleOpen()}>
                    {link.name}
                  </Link>
                )
              )}
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
