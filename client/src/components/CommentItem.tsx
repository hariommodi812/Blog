import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatTimeAgo } from "@/lib/utils";
import { CommentWithReplies } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface CommentItemProps {
  comment: CommentWithReplies;
  blogId: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, blogId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const queryClient = useQueryClient();

  const handleLikeComment = async () => {
    try {
      await apiRequest("POST", `/api/comments/${comment.id}/like`, {});
      setIsLiked(!isLiked);
      // Invalidate the comments query to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/blogs/${blogId}/comments`] });
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;

    try {
      await apiRequest("POST", `/api/blogs/${blogId}/comments`, {
        content: replyContent,
        parentId: comment.id,
        name: "Guest User", // In a real app, this would be the logged-in user's name
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg", // In a real app, this would be the user's avatar
      });

      // Reset form and hide it
      setReplyContent("");
      setShowReplyForm(false);

      // Invalidate the comments query to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/blogs/${blogId}/comments`] });
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  return (
    <div className="border-b border-neutral-200 pb-6">
      <div className="flex items-start gap-4 mb-3">
        <img src={comment.avatar} className="w-10 h-10 rounded-full" alt="Commenter avatar" />
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium">{comment.name}</p>
            <p className="text-sm text-neutral-700">{formatTimeAgo(comment.createdAt)}</p>
          </div>
          <p className="text-neutral-800">{comment.content}</p>
          
          <div className="flex items-center gap-6 mt-3">
            <button 
              className={`text-sm ${isLiked ? 'text-primary' : 'text-neutral-700 hover:text-primary'} flex items-center gap-1`}
              onClick={handleLikeComment}
            >
              <i className={isLiked ? "ri-heart-fill" : "ri-heart-line"}></i>
              <span>{comment.likeCount + (isLiked ? 1 : 0)}</span>
            </button>
            <button 
              className="text-sm text-neutral-700 hover:text-primary flex items-center gap-1"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <i className="ri-reply-line"></i>
              <span>Reply</span>
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-4">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px] mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReplyForm(false)}>Cancel</Button>
                <Button onClick={handleSubmitReply}>Post Reply</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-14 mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-4">
              <img src={reply.avatar} className="w-8 h-8 rounded-full" alt="Reply avatar" />
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">
                    {reply.name}
                    {reply.name === comment.name && (
                      <span className="text-sm font-normal text-primary ml-1">(Author)</span>
                    )}
                  </p>
                  <p className="text-sm text-neutral-700">{formatTimeAgo(reply.createdAt)}</p>
                </div>
                <p className="text-neutral-800">{reply.content}</p>
                
                <div className="flex items-center gap-6 mt-3">
                  <button 
                    className="text-sm text-neutral-700 hover:text-primary flex items-center gap-1"
                    onClick={() => {
                      // In a real app, we would handle like for replies
                    }}
                  >
                    <i className="ri-heart-line"></i>
                    <span>{reply.likeCount}</span>
                  </button>
                  <button 
                    className="text-sm text-neutral-700 hover:text-primary flex items-center gap-1"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                  >
                    <i className="ri-reply-line"></i>
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
