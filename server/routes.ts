// routes.ts
import type { Express } from "express";
import { createServer } from "http";
// import { storage } from "./storage"; // Remove or comment out
import { insertEnquirySchema, courses, materials, enquiries } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      // Drizzle query for all courses
      const allCourses = await db.select().from(courses);
      res.json(allCourses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching courses" });
    }
  });

  // Get course by ID
  app.get("/api/courses/:id", async (req, res) => {
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
  app.get("/api/materials", async (req, res) => {
    try {
      // Query Drizzle for all materials
      const allMaterials = await db.select().from(materials);
      res.json(allMaterials);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching materials" });
    }
  });

  // Get materials by course ID
  app.get("/api/materials/:courseId", async (req, res) => {
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
  app.post("/api/enquiries", async (req, res) => {
    const result = insertEnquirySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid enquiry data" });
    }

    try {
      // Insert into enquiries table using Drizzle
      const [newEnquiry] = await db
        .insert(enquiries)
        .values(result.data)
        .returning(); // returns inserted row
      res.status(201).json(newEnquiry);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating enquiry" });
    }
  });

  return server;
}