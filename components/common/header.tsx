import { FileText } from "lucide-react";

import { Button } from "../ui/button";
import NavLink from "./nav-link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header(){
    const isLoggedIn = false;
    return <nav className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto">
        
        <div className="flex lg:flex-1">
            <NavLink href="/" className="flex items-center gap-1 lg:gap-2 shrink-0">
                <FileText className="w-5 h-8 lg:w-8 lg:h-8 text-gray-900 hover:rotate-12 transform transition duration-200 ease-in-out cursor-pointer"></FileText>
                <span className="font-extrabold lg:text-xl text-gray-900">Chota</span>
            </NavLink>
        </div>

        <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
            <NavLink href="/#pricing" className="relative inline-flex items-center justify-center px-4 rounded-full border border-rose-500 bg-gradient-to-r from-rose-500/10 to-rose-700/10 text-rose-600 font-semibold shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-rose-500/40 hover:text-rose-700 ">Pricing</NavLink>
            <SignedIn>
                <NavLink href="/dashboard" className="relative inline-flex items-center justify-center px-4  rounded-full border border-rose-500 bg-gradient-to-r from-rose-500/10 to-rose-700/10 text-rose-600 font-semibold shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-rose-500/40 hover:text-rose-700 ">Your Summaries</NavLink>
            </SignedIn>
           
        </div>

        <div className="flex lg:justify-end lg:flex-1">
            <SignedIn>
                <div className="flex gap-2 items-center">
                    <NavLink href="/upload"><div className="relative inline-flex items-center justify-center px-4 py-2 rounded-full border border-rose-500 bg-gradient-to-r from-rose-500/10 to-rose-700/10 text-rose-600 font-semibold shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-rose-500/40 hover:text-rose-700">
                                                <span className="animate-pulse">Upload Your</span> 
                                                <span className="ml-2 text-rose-700 font-bold tracking-wide animate-bounce">PDF</span>
                                            </div>
                    </NavLink>
                    <div>Pro</div>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </SignedIn>
            
            <SignedOut>
                <NavLink href="sign-in">Sign In</NavLink>
            </SignedOut>
            
        </div>
    
    </nav>;
}