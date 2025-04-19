import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { z } from "zod";
import { insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  
  // Get all blog posts
  app.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getAllBlogs();
      res.json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  // Get featured blog post
  app.get("/api/blogs/featured", async (req, res) => {
    try {
      const featuredBlog = await storage.getFeaturedBlog();
      if (!featuredBlog) {
        return res.status(404).json({ message: "No featured blog found" });
      }
      res.json(featuredBlog);
    } catch (error) {
      console.error("Error fetching featured blog:", error);
      res.status(500).json({ message: "Failed to fetch featured blog" });
    }
  });

  // Get blog post by ID
  app.get("/api/blogs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      const blog = await storage.getBlogById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Increment view count
      await storage.updateBlogViews(id);
      
      res.json(blog);
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  // Get blog post by slug
  app.get("/api/blogs/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const blog = await storage.getBlogBySlug(slug);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Increment view count
      await storage.updateBlogViews(blog.id);
      
      res.json(blog);
    } catch (error) {
      console.error("Error fetching blog by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  // Get related blog posts
  app.get("/api/blogs/:id/related", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const relatedBlogs = await storage.getRelatedBlogs(id, limit);
      
      res.json(relatedBlogs);
    } catch (error) {
      console.error("Error fetching related blogs:", error);
      res.status(500).json({ message: "Failed to fetch related blogs" });
    }
  });

  // Like a blog post
  app.post("/api/blogs/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      const blog = await storage.getBlogById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Toggle like (for simplicity, we're just incrementing)
      await storage.updateBlogLikes(id, true);
      
      res.json({ message: "Blog liked successfully" });
    } catch (error) {
      console.error("Error liking blog:", error);
      res.status(500).json({ message: "Failed to like blog" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get comments for a blog post
  app.get("/api/blogs/:id/comments", async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      if (isNaN(blogId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      const comments = await storage.getCommentsByBlogId(blogId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Add a comment to a blog post
  app.post("/api/blogs/:id/comments", async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      if (isNaN(blogId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      const blog = await storage.getBlogById(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      const validatedData = insertCommentSchema.parse({
        ...req.body,
        blogId,
      });

      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error adding comment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // Like a comment
  app.post("/api/comments/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }

      await storage.updateCommentLikes(id, true);
      res.json({ message: "Comment liked successfully" });
    } catch (error) {
      console.error("Error liking comment:", error);
      res.status(500).json({ message: "Failed to like comment" });
    }
  });

  // Get country data from RestCountries API
  app.get("/api/countries/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const response = await axios.get(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
      res.json(response.data[0]);
    } catch (error) {
      console.error("Error fetching country data:", error);
      res.status(500).json({ message: "Failed to fetch country data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
