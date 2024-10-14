"use client"
import React from 'react';
import Link from 'next/link';
import { ModeToggle } from "@/components/theme-toggle";

const NavigationHeader: React.FC = () => {


  return (
    <header className="w-full bg-background border-b border-border">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Poker Tracker
        </Link>
        <ul className="flex space-x-4 items-center">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Leaderboard
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </li>
          <li>
            <ModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavigationHeader;