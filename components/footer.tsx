import Link from "next/link";
import React from "react";
const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">
                S
              </span>
            </div>
            <span className="text-sm text-muted-foreground">Summarise</span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link
              className="hover:text-foreground transition-smooth"
              href="/privacy"
            >
              Privacy
            </Link>
            <Link
              className="hover:text-foreground transition-smooth"
              href="/terms"
            >
              Terms
            </Link>
            <Link
              className="hover:text-foreground transition-smooth"
              href="/contact"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Summarise. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
