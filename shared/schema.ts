// shared/schema.ts
import { pgTable, text, serial, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // e.g., "IELTS", "SAT"
  description: text("description").notNull(),
  level: text("level").notNull(),
  duration: text("duration").notNull(),
  price: decimal("price").notNull(),
});

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // We'll store PDF name without .pdf
  type: text("type").notNull(),   // e.g. "IELTS Reading", "SAT Math", "Vocabulary"
  description: text("description").notNull(),
  courseId: integer("course_id").notNull(),
});

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertMaterialSchema = createInsertSchema(materials).omit({ id: true });
export const insertEnquirySchema = createInsertSchema(enquiries).omit({ id: true });

export type Course = typeof courses.$inferSelect;
export type Material = typeof materials.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;