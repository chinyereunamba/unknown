import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-xs text-neutral-400">
          © {new Date().getFullYear()} WebWhisper AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
