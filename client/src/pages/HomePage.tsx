import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BlogWithRelations, Category } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FeaturedBlogCard from "@/components/FeaturedBlogCard";
import BlogCard from "@/components/BlogCard";

const HomePage = () => {
  const [sortOrder, setSortOrder] = useState("recent");
  
  const { data: blogData, isLoading: isLoadingBlogs } = useQuery<BlogWithRelations[]>({
    queryKey: ["/api/blogs"],
  });

  const { data: featuredBlog, isLoading: isLoadingFeatured } = useQuery<BlogWithRelations>({
    queryKey: ["/api/blogs/featured"],
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Filter out the featured blog from the regular blogs list
  const regularBlogs = blogData?.filter(blog => blog.id !== featuredBlog?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Featured post */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Featured Story</h2>
            {isLoadingFeatured ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Skeleton className="w-full h-72" />
                <div className="p-6">
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-8 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            ) : featuredBlog ? (
              <FeaturedBlogCard blog={featuredBlog} />
            ) : (
              <p>No featured story available</p>
            )}
          </div>
          
          {/* Latest posts */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Latest Posts</h2>
              <div className="relative">
                <Select 
                  defaultValue={sortOrder} 
                  onValueChange={(value) => setSortOrder(value)}
                >
                  <SelectTrigger className="bg-white border border-neutral-200 rounded-md px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Blog list */}
            <div className="space-y-8">
              {isLoadingBlogs ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <Skeleton className="w-full h-56 md:h-full" />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <Skeleton className="h-4 w-32 mb-3" />
                      <Skeleton className="h-6 w-full mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full mr-3" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : regularBlogs && regularBlogs.length > 0 ? (
                regularBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))
              ) : (
                <p>No blog posts available</p>
              )}
            </div>
            
            {/* Pagination */}
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center space-x-1">
                <a href="#" className="px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-200">
                  <i className="ri-arrow-left-s-line"></i>
                </a>
                <a href="#" className="px-4 py-2 rounded-md bg-primary text-white font-medium">1</a>
                <a href="#" className="px-4 py-2 rounded-md text-neutral-700 hover:bg-neutral-200">2</a>
                <a href="#" className="px-4 py-2 rounded-md text-neutral-700 hover:bg-neutral-200">3</a>
                <span className="px-2 text-neutral-700">...</span>
                <a href="#" className="px-4 py-2 rounded-md text-neutral-700 hover:bg-neutral-200">8</a>
                <a href="#" className="px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-200">
                  <i className="ri-arrow-right-s-line"></i>
                </a>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/4 space-y-8">
          {/* Search */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">Search</h3>
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Find articles..." 
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
              />
              <button className="absolute right-3 top-2.5">
                <i className="ri-search-line text-neutral-700"></i>
              </button>
            </div>
          </div>
          
          {/* Categories */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            {isLoadingCategories ? (
              <ul className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-8 rounded-full" />
                  </li>
                ))}
              </ul>
            ) : categories && categories.length > 0 ? (
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id} className="flex items-center justify-between">
                    <a href="#" className="text-neutral-700 hover:text-primary">
                      {category.name}
                    </a>
                    <span className="bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full text-xs">
                      {category.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No categories available</p>
            )}
          </div>
          
          {/* Popular Tags */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1 rounded-full text-sm">#adventure</a>
              <a href="#" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1 rounded-full text-sm">#photography</a>
              <a href="#" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1 rounded-full text-sm">#cuisine</a>
              <a href="#" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1 rounded-full text-sm">#sustainable</a>
              <a href="#" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1 rounded-full text-sm">#architecture</a>
              <a href="#" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1 rounded-full text-sm">#festivals</a>
              <a href="#" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1 rounded-full text-sm">#wildlife</a>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">Subscribe to our Newsletter</h3>
            <p className="text-neutral-700 text-sm mb-4">Get the latest posts delivered straight to your inbox.</p>
            <form>
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none mb-3" 
              />
              <button className="w-full bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
