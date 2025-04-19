import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema from the existing setup
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories for the blog posts
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  count: integer("count").default(0),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Authors for blog posts
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  role: text("role"),
});

export const insertAuthorSchema = createInsertSchema(authors).pick({
  name: true,
  bio: true,
  avatar: true,
  role: true,
});

export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type Author = typeof authors.$inferSelect;

// Blog posts
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  categoryId: integer("category_id").notNull(),
  authorId: integer("author_id").notNull(),
  readTime: integer("read_time").default(5),
  isFeatured: integer("is_featured").default(0),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  publishedAt: timestamp("published_at").defaultNow(),
  tags: text("tags").array(),
});

export const insertBlogSchema = createInsertSchema(blogs).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  categoryId: true,
  authorId: true,
  readTime: true,
  isFeatured: true,
  tags: true,
});

export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Blog = typeof blogs.$inferSelect;

// Comments on blog posts
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  blogId: integer("blog_id").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  blogId: true,
  name: true,
  avatar: true,
  content: true,
  parentId: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Extended types for frontend use
export type BlogWithRelations = Blog & {
  category: Category;
  author: Author;
};

export type CommentWithReplies = Comment & {
  replies?: CommentWithReplies[];
};

export type CountryData = {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  population: number;
  languages: Record<string, string>;
  currencies: Record<string, { name: string; symbol: string }>;
  region: string;
  subregion: string;
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
};
