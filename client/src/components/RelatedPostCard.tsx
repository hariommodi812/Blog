import { Link } from "wouter";
import { BlogWithRelations } from "@shared/schema";
import { formatDate } from "@/lib/utils";

interface RelatedPostCardProps {
  blog: BlogWithRelations;
}

const RelatedPostCard: React.FC<RelatedPostCardProps> = ({ blog }) => {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <a className="flex items-start gap-3 group">
        <img 
          src={blog.coverImage} 
          alt={blog.title} 
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0" 
        />
        <div>
          <h4 className="font-medium text-neutral-800 group-hover:text-primary transition-colors">
            {blog.title}
          </h4>
          <p className="text-sm text-neutral-700">{formatDate(blog.publishedAt)}</p>
        </div>
      </a>
    </Link>
  );
};

export default RelatedPostCard;
