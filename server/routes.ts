import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { insertEnquirySchema, courses, materials, enquiries } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import authRouter, { User as AuthUser } from "./auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware to authenticate token from HTTP-only cookie
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user as AuthUser;
    next();
  });
}

// Register the profile endpoint
export function registerProfileRoute(app: Express) {
  app.get("/api/profile", authenticateToken, (req: Request, res: Response) => {
    res.json({ profile: req.user });
  });
}

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Mount the auth routes:
  app.use("/api/auth", authRouter);

  // Register the profile endpoint
  registerProfileRoute(app);

  // Get all courses
  app.get("/api/courses", async (req: Request, res: Response) => {
    try {
      const allCourses = await db.select().from(courses);
      res.json(allCourses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching courses" });
    }
  });

  // Get course by ID
  app.get("/api/courses/:id", async (req: Request, res: Response) => {
    try {
      const courseId = Number(req.params.id);
      const [course] = await db.select().from(courses).where(eq(courses.id, courseId));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching course" });
    }
  });

  // Get all materials
  app.get("/api/materials", async (req: Request, res: Response) => {
    try {
      const allMaterials = await db.select().from(materials);
      res.json(allMaterials);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching materials" });
    }
  });

  // Get materials by course ID
  app.get("/api/materials/:courseId", async (req: Request, res: Response) => {
    try {
      const courseId = Number(req.params.courseId);
      const results = await db.select().from(materials).where(eq(materials.courseId, courseId));
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching materials by course" });
    }
  });

  // Submit enquiry
  app.post("/api/enquiries", async (req: Request, res: Response) => {
    const result = insertEnquirySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid enquiry data" });
    }
    try {
      const [newEnquiry] = await db.insert(enquiries).values(result.data).returning();
      res.status(201).json(newEnquiry);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating enquiry" });
    }
  });

  return server;
}