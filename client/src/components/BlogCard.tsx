import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { BlogWithRelations } from "@shared/schema";

interface BlogCardProps {
  blog: BlogWithRelations;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const getCategoryColorClass = (categoryName: string) => {
    const colorMap: Record<string, string> = {
      'Travel': 'bg-blue-100 text-primary',
      'Nature': 'bg-green-100 text-secondary',
      'Food': 'bg-yellow-100 text-yellow-700',
      'Culture': 'bg-red-100 text-accent',
      'History': 'bg-purple-100 text-purple-700'
    };
    
    return colorMap[categoryName] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Link href={`/blog/${blog.slug}`}>
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row cursor-pointer">
        <div className="md:w-1/3">
          <img 
            src={blog.coverImage} 
            alt={blog.title} 
            className="w-full h-56 md:h-full object-cover" 
          />
        </div>
        <CardContent className="md:w-2/3 p-6">
          <div className="flex items-center text-sm text-neutral-700 mb-3">
            <span className={`${getCategoryColorClass(blog.category.name)} px-2 py-1 rounded-full text-xs font-medium`}>
              {blog.category.name}
            </span>
            <span className="mx-2">•</span>
            <span>{blog.readTime} min read</span>
            <span className="mx-2">•</span>
            <span>{formatDate(blog.publishedAt)}</span>
          </div>
          <h3 className="text-xl font-bold mb-3">{blog.title}</h3>
          <p className="text-neutral-700 mb-4">{blog.excerpt}</p>
          <div className="flex items-center mt-auto">
            <img 
              src={blog.author.avatar} 
              className="w-8 h-8 rounded-full mr-3" 
              alt={`${blog.author.name} avatar`} 
            />
            <div>
              <p className="font-medium">{blog.author.name}</p>
              <p className="text-sm text-neutral-700">{blog.author.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
