// shared/schema.ts
import { pgTable, text, serial, integer, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // e.g., "IELTS", "SAT"
  description: text("description").notNull(),
  level: text("level").notNull(),
  duration: text("duration").notNull(),
  price: decimal("price").notNull(),
});

// Materials table
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // PDF name without the .pdf extension
  type: text("type").notNull(),   // e.g., "IELTS Reading", "SAT Math", "Vocabulary"
  description: text("description").notNull(),
  courseId: integer("course_id").notNull(),
});

// Enquiries table
export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
});

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash"), // Nullable for Google-only users
  googleId: text("google_id"),
  avatarUrl: text("avatar_url"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
});

// Create insert schemas (omitting the auto‑generated id field)
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertMaterialSchema = createInsertSchema(materials).omit({ id: true });
export const insertEnquirySchema = createInsertSchema(enquiries).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });

// Infer TypeScript types from your tables and schemas
export type Course = typeof courses.$inferSelect;
export type Material = typeof materials.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type User = typeof users.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;