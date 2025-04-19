import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <i className="ri-earth-line text-primary text-2xl mr-2"></i>
            <Link href="/">
              <a className="font-bold text-xl text-primary">GlobalInsight</a>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <a className="text-neutral-700 hover:text-primary font-medium">Home</a>
            </Link>
            <a href="#" className="text-neutral-700 hover:text-primary font-medium">Categories</a>
            <a href="#" className="text-neutral-700 hover:text-primary font-medium">Popular</a>
            <div className="relative">
              <button 
                className="text-neutral-700 hover:text-primary"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <i className="ri-search-line text-xl"></i>
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg p-2">
                  <Input 
                    type="text" 
                    placeholder="Search blogs..." 
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <Button variant="outline" className="px-4 py-2 rounded-md text-primary font-medium border border-primary hover:bg-primary hover:text-white transition-colors">
                Log in
              </Button>
            </div>
            <div className="hidden md:block">
              <Button className="px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                Sign up
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden text-neutral-700 p-0">
                  <i className="ri-menu-line text-2xl"></i>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-3 mt-6">
                  <Link href="/">
                    <a className="text-neutral-700 hover:text-primary py-1 font-medium">Home</a>
                  </Link>
                  <a href="#" className="text-neutral-700 hover:text-primary py-1 font-medium">Categories</a>
                  <a href="#" className="text-neutral-700 hover:text-primary py-1 font-medium">Popular</a>
                  
                  <div className="relative mt-4 mb-2">
                    <Input type="text" placeholder="Search blogs..." className="w-full" />
                  </div>
                  
                  <div className="pt-2 border-t border-neutral-200 flex space-x-2 mt-4">
                    <Button variant="outline" className="flex-1 px-4 py-2 text-center rounded-md text-primary font-medium border border-primary hover:bg-primary hover:text-white transition-colors">
                      Log in
                    </Button>
                    <Button className="flex-1 px-4 py-2 text-center rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                      Sign up
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
