"use client";
import { motion, AnimatePresence, useCycle } from "framer-motion";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { RemoveScrollBar } from 'react-remove-scroll-bar';

interface MobileMenuProps {
  links: Link[];
}

function MobileMenu({ links }: MobileMenuProps) {
  const [open, cycleOpen] = useCycle(false, true);
  return (
    <div className="lg:hidden">
      <Button variant="outline" size="icon" onClick={() => cycleOpen()}>
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>
      <AnimatePresence>
        {open && (
          <>
            <RemoveScrollBar />
            <motion.aside
              className="lg:hidden bg-primary text-primary-foreground w-full absolute left-0 right-0 top-16 z-50 overflow-scroll min-h-screen pb-16"
              initial={{ height: 0 }}
              animate={{
                height: "100vh",
              }}
              exit={{
                height: 0,
                transition: { delay: 0.1 },
              }}>
              <motion.div
                className="p-5 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                exit={{ opacity: 0 }}>
                {links.map((link, id) =>
                  link.sublinks ? (
                    <div key={id} className="border-b-2 border-border-900">
                      <div className="text-2xl font-medium p-2 pb-4">
                        {link.name}
                      </div>
                      <div className="ml-3 mb-1">
                        {link.sublinks.map((sublink) => (
                          <Link
                            key={sublink.href}
                            className="flex flex-col p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                            href={sublink.href}
                            target={
                              sublink.href?.startsWith("http")
                                ? "_blank"
                                : "_self"
                            }
                            rel={
                              sublink.href?.startsWith("http")
                                ? "noopener noreferrer"
                                : ""
                            }
                            onClick={() => cycleOpen()}>
                            <div className="inline-flex text-sm font-medium leading-none">
                              {sublink.name}
                              {sublink.href?.startsWith("http") && (
                                <ArrowUpRight className="inline-block w-3 h-3 ml-1 text-muted dark:text-muted-foreground" />
                              )}
                            </div>
                            <div className="text-muted dark:text-muted-foreground text-sm mt-2">
                              {sublink.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      className="border-b-2 border-border-900 hover:bg-accent hover:text-accent-foreground transition-colors no-underline text-2xl font-medium p-2"
                      href={link.href}
                      key={id}
                      onClick={() => cycleOpen()}>
                      {link.name}
                    </Link>
                  )
                )}
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileMenu;
