import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <i className="ri-earth-line text-primary text-2xl mr-2"></i>
              <span className="font-bold text-xl text-primary">GlobalInsight</span>
            </div>
            <p className="text-neutral-700 mb-4">
              Exploring the world through thoughtful travel writing, cultural insights, and global perspectives.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-neutral-700 hover:text-primary">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" aria-label="Twitter" className="text-neutral-700 hover:text-primary">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" aria-label="Instagram" className="text-neutral-700 hover:text-primary">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" aria-label="Pinterest" className="text-neutral-700 hover:text-primary">
                <i className="ri-pinterest-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-700 hover:text-primary">Home</a></li>
              <li><a href="#" className="text-neutral-700 hover:text-primary">Featured Posts</a></li>
              <li><a href="#" className="text-neutral-700 hover:text-primary">Recent Articles</a></li>
              <li><a href="#" className="text-neutral-700 hover:text-primary">Categories</a></li>
              <li><a href="#" className="text-neutral-700 hover:text-primary">Authors</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Information</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-700 hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-neutral-700 hover:text-primary">Contact</a></li>
              <li><a href="#" className="text-neutral-700 hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-neutral-700 hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="text-neutral-700 hover:text-primary">Sitemap</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Subscribe</h3>
            <p className="text-neutral-700 mb-4">Join our newsletter to receive updates about new posts and travel tips.</p>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="w-full rounded-r-none focus:ring-2 focus:ring-primary/20 outline-none" 
              />
              <Button className="bg-primary text-white px-4 py-2 rounded-l-none hover:bg-primary/90 transition-colors">
                <i className="ri-send-plane-fill"></i>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-700 text-sm">&copy; {new Date().getFullYear()} GlobalInsight Blog. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-neutral-700 hover:text-primary text-sm">Privacy</a>
            <a href="#" className="text-neutral-700 hover:text-primary text-sm">Terms</a>
            <a href="#" className="text-neutral-700 hover:text-primary text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
