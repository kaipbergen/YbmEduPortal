import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertEnquirySchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Get all courses
  app.get("/api/courses", async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  // Get course by ID
  app.get("/api/courses/:id", async (req, res) => {
    const course = await storage.getCourseById(Number(req.params.id));
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json(course);
  });

  // Get materials by course
  app.get("/api/materials/:courseId", async (req, res) => {
    const materials = await storage.getMaterialsByCourse(Number(req.params.courseId));
    res.json(materials);
  });

  // Submit enquiry
  app.post("/api/enquiries", async (req, res) => {
    const result = insertEnquirySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid enquiry data" });
      return;
    }

    const enquiry = await storage.createEnquiry(result.data);
    res.status(201).json(enquiry);
  });

  return server;
}