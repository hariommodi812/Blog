import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { BlogWithRelations } from "@shared/schema";

interface FeaturedBlogCardProps {
  blog: BlogWithRelations;
}

const FeaturedBlogCard: React.FC<FeaturedBlogCardProps> = ({ blog }) => {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-72 object-cover"
        />
        <CardContent className="p-6">
          <div className="flex items-center text-sm text-neutral-700 mb-3">
            <span className="bg-blue-100 text-primary px-2 py-1 rounded-full text-xs font-medium">
              {blog.category.name}
            </span>
            <span className="mx-2">•</span>
            <span>{blog.readTime} min read</span>
            <span className="mx-2">•</span>
            <span>{formatDate(blog.publishedAt)}</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">{blog.title}</h3>
          <p className="text-neutral-700 mb-4">{blog.excerpt}</p>
          <div className="flex items-center">
            <img
              src={blog.author.avatar}
              className="w-10 h-10 rounded-full mr-3"
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

export default FeaturedBlogCard;
