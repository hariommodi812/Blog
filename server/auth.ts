import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { authStorage } from "./authStorage";
import { User as UserType } from "@shared/schema";
import ConnectSqlite3 from "connect-sqlite3";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

const SQLiteStore = ConnectSqlite3(session);

export function setupAuth(app: Express) {
  // Set up session storage
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "globalinsightblogsecret",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.sqlite" }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  // Set up passport and session
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy for passport
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await authStorage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        const isValidPassword = await authStorage.verifyPassword(password, user.password);
        
        if (!isValidPassword) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize and deserialize user
  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await authStorage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register route
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("[Auth] Registration attempt for username:", username);
      
      // Check if username already exists
      const existingUser = await authStorage.getUserByUsername(username);
      if (existingUser) {
        console.log("[Auth] Registration failed: Username already exists");
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user
      const user = await authStorage.createUser({ username, password });
      console.log("[Auth] User created with ID:", user.id);
      
      // Login the user after registration
      req.login(user, (err: any) => {
        if (err) {
          console.error("[Auth] Session login error after registration:", err);
          return res.status(500).json({ message: "Error during login after registration" });
        }
        
        console.log("[Auth] Registration and login successful for user ID:", user.id);
        
        // Remove password from the response
        const userObj = user as any;
        const { password, ...userWithoutPassword } = userObj;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("[Auth] Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Login route
  app.post("/api/auth/login", (req, res, next) => {
    console.log("[Auth] Login attempt for username:", req.body.username);
    
    passport.authenticate("local", (err: any, user: Express.User | false, info: { message: string } | undefined) => {
      if (err) {
        console.error("[Auth] Login error:", err);
        return next(err);
      }
      
      if (!user) {
        console.log("[Auth] Login failed:", info?.message || "Authentication failed");
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      
      req.login(user, (err: any) => {
        if (err) {
          console.error("[Auth] Session login error:", err);
          return next(err);
        }
        
        console.log("[Auth] Login successful for user ID:", user.id);
        
        // Remove password from the response
        const userObj = user as any;
        const { password, ...userWithoutPassword } = userObj;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    console.log("[Auth] Logout attempt for user ID:", req.user?.id);
    
    req.logout((err: any) => {
      if (err) {
        console.error("[Auth] Logout error:", err);
        return res.status(500).json({ message: "Error during logout" });
      }
      console.log("[Auth] Logout successful");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Get current user route
  app.get("/api/auth/user", (req, res) => {
    if (req.user) {
      console.log("[Auth] Get current user - authenticated user ID:", req.user.id);
      
      // Remove password from the response
      const userObj = req.user as any;
      const { password, ...userWithoutPassword } = userObj;
      return res.status(200).json(userWithoutPassword);
    } else {
      console.log("[Auth] Get current user - not authenticated");
      return res.status(401).json({ message: "Not authenticated" });
    }
  });
}