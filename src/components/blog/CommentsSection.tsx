import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MessageSquare, Send, ThumbsUp, Reply, Flag, User } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  likes: number;
  parentId?: string;
  createdAt: string;
  isApproved: boolean;
}

interface CommentsSectionProps {
  postId: string;
  postSlug: string;
}

export function CommentsSection({ postId, postSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts/${postSlug}/comments`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data.filter((c: Comment) => c.isApproved));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();

    if (!name || !email || !content) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts/${postSlug}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            postId,
            author: name,
            email,
            content,
            parentId,
          }),
        }
      );

      if (response.ok) {
        toast.success(
          "Commentaire soumis ! Il sera visible aprÃ¨s modÃ©ration."
        );
        setContent("");
        setReplyingTo(null);
        fetchComments();
      } else {
        toast.error("Erreur lors de la soumission du commentaire");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Erreur lors de la soumission");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleReport = async (commentId: string) => {
    toast.info("FonctionnalitÃ© de signalement Ã  venir");
  };

  // Organize comments into tree structure
  const organizeComments = (comments: Comment[]) => {
    const commentMap = new Map<string, Comment & { replies: Comment[] }>();
    const rootComments: (Comment & { replies: Comment[] })[] = [];

    // First pass: create map
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize hierarchy
    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const organizedComments = organizeComments(comments);

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: Comment & { replies: Comment[] };
    isReply?: boolean;
  }) => {
    const initials = comment.author
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isReply ? "ml-12 mt-4" : "mt-6"}`}
      >
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarFallback className="bg-gradient-to-br from-[#CCFF00]/20 to-[#DAFF40]/20 text-[#CCFF00]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white">{comment.author}</span>
              <span className="text-xs text-white/40">
                {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Content */}
            <p className="text-white/80 mb-3 leading-relaxed">
              {comment.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(comment.id)}
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-[#CCFF00] transition-colors group"
              >
                <ThumbsUp className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                {comment.likes > 0 && <span>{comment.likes}</span>}
              </button>

              {!isReply && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="flex items-center gap-1.5 text-sm text-white/40 hover:text-[#CCFF00] transition-colors"
                >
                  <Reply className="h-3.5 w-3.5" />
                  RÃ©pondre
                </button>
              )}

              <button
                onClick={() => handleReport(comment.id)}
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-red-400 transition-colors ml-auto"
              >
                <Flag className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                onSubmit={(e) => handleSubmit(e, comment.id)}
                className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Votre rÃ©ponse..."
                  className="mb-3 bg-white/5 border-white/10"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
                    size="sm"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Envoyer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setContent("");
                    }}
                    size="sm"
                    className="border-white/10"
                  >
                    Annuler
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="mt-16 pt-12 border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="h-6 w-6 text-[#CCFF00]" />
          <h2 className="text-2xl text-white">
            Commentaires ({comments.length})
          </h2>
        </div>

        {/* New Comment Form */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
          <h3 className="text-white mb-4">Laisser un commentaire</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Votre nom *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10"
                required
              />
              <Input
                type="email"
                placeholder="Votre email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10"
                required
              />
            </div>
            <Textarea
              placeholder="Votre commentaire *"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-white/5 border-white/10 min-h-[120px]"
              required
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/40">
                * Votre email ne sera pas publiÃ©. Les commentaires sont modÃ©rÃ©s.
              </p>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-[#0C0C0C] border-t-transparent rounded-full animate-spin" />
                    Envoi...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Publier
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-white/40 text-sm">Chargement des commentaires...</p>
            </div>
          </div>
        ) : organizedComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">
              Aucun commentaire pour le moment. Soyez le premier Ã  commenter !
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {organizedComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}

