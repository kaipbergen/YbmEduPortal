// server/routes.ts
import type { Express, Request, Response, NextFunction } from "express";
import type { RequestHandler } from "express-serve-static-core";
import { createServer } from "http";
import { insertEnquirySchema, courses, materials, enquiries, users as usersTable } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import authRouter, { User as AuthUser } from "./auth";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Set up multer using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Cast upload.single to RequestHandler
const uploadSingle: RequestHandler = upload.single("photo") as RequestHandler;

// Cast cookie-parser middleware to satisfy Express types
const cookieParserMiddleware = cookieParser() as unknown as RequestHandler;

// Middleware to authenticate token from HTTP‑only cookie
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }
    req.user = user as AuthUser;
    next();
  });
}

// Register the profile endpoint
export function registerProfileRoute(app: Express) {
  app.get("/api/profile", authenticateToken, (req: Request, res: Response): void => {
    res.json({ profile: req.user });
  });
}

export async function registerRoutes(app: Express) {
  // Initialize cookie-parser middleware
  app.use(cookieParserMiddleware);

  const server = createServer(app);

  // Mount the auth routes:
  app.use("/api/auth", authRouter);

  // Register the profile endpoint
  registerProfileRoute(app);

  // New endpoint: Update avatar photo
  app.put(
    "/api/profile/photo",
    authenticateToken,
    uploadSingle,
    (req: Request, res: Response): void => {
      console.log("PUT /api/profile/photo reached");
      const file = (req as Request & { file?: Express.Multer.File }).file;
      console.log("Uploaded file:", file);
      if (!file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }
      // Use process.cwd() instead of __dirname in ES modules
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      const port = process.env.PORT || 5002;
      const newPhotoUrl = `http://localhost:${port}/uploads/${file.originalname}`;

      const userId = (req.user as AuthUser).id;
      // Update the user's avatar in the database
      db.update(usersTable)
        .set({ avatarUrl: newPhotoUrl })
        .where(eq(usersTable.id, userId))
        .then(() => {
          console.log("User updated with new avatar URL:", newPhotoUrl);
          res.json({ photoUrl: newPhotoUrl });
        })
        .catch((error) => {
          console.error("Error updating avatar in DB:", error);
          res.status(500).json({ message: "Error updating avatar" });
        });
    }
  );

  // Other endpoints...

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
        res.status(404).json({ message: "Course not found" });
        return;
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
      res.status(400).json({ message: "Invalid enquiry data" });
      return;
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