import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BlogWithRelations, CommentWithReplies } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, extractCountriesFromContent } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import CountryInfo from "@/components/CountryInfo";
import CommentItem from "@/components/CommentItem";
import RelatedPostCard from "@/components/RelatedPostCard";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [_, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);

  // Fetch blog post by slug
  const { data: blog, isLoading: isLoadingBlog } = useQuery<BlogWithRelations>({
    queryKey: [`/api/blogs/slug/${slug}`],
    enabled: !!slug,
  });

  // Fetch related blogs
  const { data: relatedBlogs, isLoading: isLoadingRelated } = useQuery<BlogWithRelations[]>({
    queryKey: [`/api/blogs/${blog?.id}/related`],
    enabled: !!blog?.id,
  });

  // Fetch comments
  const { data: comments, isLoading: isLoadingComments } = useQuery<CommentWithReplies[]>({
    queryKey: [`/api/blogs/${blog?.id}/comments`],
    enabled: !!blog?.id,
  });

  useEffect(() => {
    if (blog) {
      // Extract countries mentioned in the blog content
      const extractedCountries = extractCountriesFromContent(blog.content);
      setCountries(extractedCountries);
    }
  }, [blog]);

  const handleLikeBlog = async () => {
    if (!blog) return;
    
    try {
      await apiRequest("POST", `/api/blogs/${blog.id}/like`, {});
      setIsLiked(!isLiked);
      // Invalidate the blog query to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/blogs/slug/${slug}`] });
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (!blog || !newComment.trim()) return;
    
    try {
      await apiRequest("POST", `/api/blogs/${blog.id}/comments`, {
        content: newComment,
        name: "Guest User", // In a real app, this would be the logged-in user's name
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg", // In a real app, this would be the user's avatar
      });
      
      // Clear comment field
      setNewComment("");
      
      // Invalidate the comments query to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/blogs/${blog.id}/comments`] });
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const scrollToComments = () => {
    document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Back button */}
          <Button
            variant="ghost"
            className="flex items-center text-neutral-700 hover:text-primary mb-6"
            onClick={() => navigate("/")}
          >
            <i className="ri-arrow-left-line mr-2"></i>
            <span>Back to all posts</span>
          </Button>
          
          {isLoadingBlog ? (
            // Skeleton for blog post
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Skeleton className="w-full h-96" />
              <div className="p-6 md:p-8">
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-10 w-full mb-4" />
                <div className="flex items-center mb-8">
                  <Skeleton className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-5 w-28 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ) : blog ? (
            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
              
              <div className="p-6 md:p-8">
                {/* Categories and metadata */}
                <div className="flex items-center text-sm text-neutral-700 mb-3 flex-wrap gap-y-2">
                  <span className="bg-blue-100 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {blog.category.name}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{blog.readTime} min read</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(blog.publishedAt)}</span>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <i className="ri-eye-line mr-1"></i>
                    <span>{blog.viewCount.toLocaleString()} views</span>
                  </div>
                </div>
                
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
                
                {/* Author */}
                <div className="flex items-center mb-8">
                  <img
                    src={blog.author.avatar}
                    className="w-12 h-12 rounded-full mr-4"
                    alt={`${blog.author.name} avatar`}
                  />
                  <div>
                    <p className="font-medium">{blog.author.name}</p>
                    <p className="text-sm text-neutral-700">{blog.author.role}</p>
                  </div>
                </div>
                
                {/* Blog Content */}
                <div 
                  className="blog-content text-lg text-neutral-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                
                {/* Country Info (if countries are mentioned) */}
                {countries.length > 0 && (
                  <CountryInfo countryName={countries[0]} />
                )}
                
                {/* Like and Share */}
                <div className="flex items-center justify-between py-6 border-t border-b border-neutral-200 my-8">
                  <div className="flex items-center gap-4">
                    <button 
                      className={`flex items-center gap-2 ${isLiked ? 'text-accent' : 'text-neutral-700 hover:text-primary'}`}
                      onClick={handleLikeBlog}
                    >
                      <i className={isLiked ? "ri-heart-fill" : "ri-heart-line"}></i>
                      <span>{blog.likeCount + (isLiked ? 1 : 0)} likes</span>
                    </button>
                    <button 
                      className="flex items-center gap-2 text-neutral-700 hover:text-primary"
                      onClick={scrollToComments}
                    >
                      <i className="ri-chat-1-line text-xl"></i>
                      <span>{blog.commentCount} comments</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 text-neutral-700 hover:text-primary">
                      <i className="ri-facebook-circle-fill text-xl"></i>
                    </button>
                    <button className="flex items-center gap-1 text-neutral-700 hover:text-primary">
                      <i className="ri-twitter-fill text-xl"></i>
                    </button>
                    <button className="flex items-center gap-1 text-neutral-700 hover:text-primary">
                      <i className="ri-linkedin-fill text-xl"></i>
                    </button>
                    <button className="flex items-center gap-1 text-neutral-700 hover:text-primary">
                      <i className="ri-link text-xl"></i>
                    </button>
                  </div>
                </div>
                
                {/* Author Bio */}
                <div className="bg-neutral-50 rounded-xl p-6 mb-8">
                  <div className="flex items-start">
                    <img 
                      src={blog.author.avatar} 
                      className="w-16 h-16 rounded-full mr-4" 
                      alt={`${blog.author.name} avatar`} 
                    />
                    <div>
                      <p className="font-bold text-lg">{blog.author.name}</p>
                      <p className="text-neutral-700 mb-3">{blog.author.bio}</p>
                      <div className="flex gap-2">
                        <a href="#" className="text-primary hover:text-primary/80">
                          <i className="ri-globe-line"></i>
                        </a>
                        <a href="#" className="text-primary hover:text-primary/80">
                          <i className="ri-instagram-line"></i>
                        </a>
                        <a href="#" className="text-primary hover:text-primary/80">
                          <i className="ri-twitter-line"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comments Section */}
                <div id="comments" className="py-4">
                  <h3 className="text-2xl font-bold mb-6">
                    Comments ({blog.commentCount})
                  </h3>
                  
                  {/* New Comment Form */}
                  <div className="mb-8">
                    <div className="flex items-start gap-4 mb-6">
                      <img 
                        src="https://randomuser.me/api/portraits/lego/1.jpg" 
                        className="w-10 h-10 rounded-full" 
                        alt="Your avatar" 
                      />
                      <div className="flex-grow">
                        <Textarea
                          placeholder="Add your comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                        />
                        <div className="flex justify-end mt-2">
                          <Button onClick={handleSubmitComment}>
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comments List */}
                  <div className="space-y-8">
                    {isLoadingComments ? (
                      // Skeleton for comments
                      Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="border-b border-neutral-200 pb-6">
                          <div className="flex items-start gap-4 mb-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                              <Skeleton className="h-4 w-full mb-1" />
                              <Skeleton className="h-4 w-3/4 mb-3" />
                              <div className="flex items-center gap-6">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : comments && comments.length > 0 ? (
                      comments.map((comment) => (
                        <CommentItem 
                          key={comment.id} 
                          comment={comment} 
                          blogId={blog.id} 
                        />
                      ))
                    ) : (
                      <p>No comments yet. Be the first to comment!</p>
                    )}
                    
                    {comments && comments.length > 5 && (
                      <div className="flex justify-center pt-4">
                        <Button variant="outline" className="px-6 py-3 border border-neutral-200 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition-colors">
                          Load More Comments
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <p className="text-lg">Blog post not found</p>
              <Button 
                className="mt-4"
                onClick={() => navigate("/")}
              >
                Return to home page
              </Button>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/4 space-y-8">
          {/* Related Posts */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">Related Posts</h3>
            {isLoadingRelated ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
                    <div>
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : relatedBlogs && relatedBlogs.length > 0 ? (
              <div className="space-y-4">
                {relatedBlogs.map((blog) => (
                  <RelatedPostCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <p>No related posts found</p>
            )}
          </div>
          
          {/* Popular Tags */}
          {blog && (
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <a 
                    href="#" 
                    key={index}
                    className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Newsletter */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">Subscribe to our Newsletter</h3>
            <p className="text-neutral-700 text-sm mb-4">Get the latest posts delivered straight to your inbox.</p>
            <form>
              <input 
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

export default BlogDetailPage;
