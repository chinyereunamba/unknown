import Link from 'next/link';
import React from 'react'
const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">S</span>
            </div>
            <span className="text-sm text-muted-foreground">SummaryAI</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-smooth">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-smooth">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-smooth">
              Contact
            </Link>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SummaryAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
