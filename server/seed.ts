// server/seed.ts
console.log("Seed script started...");

import { db } from "./db.ts";
import { courses, materials } from "../shared/schema.ts";
import { eq } from "drizzle-orm";

async function seedCourses() {
  console.log("Inserting courses...");
  try {
    await db.insert(courses).values([
      {
        title: "IELTS Academic Preparation",
        type: "IELTS",
        description: "Comprehensive IELTS preparation course covering all sections",
        level: "Intermediate to Advanced",
        duration: "8 недель",
        price: "120000", // numeric value as string
      },
      {
        title: "SAT Complete Course",
        type: "SAT",
        description: "Complete preparation for SAT Math and Verbal sections",
        level: "High School",
        duration: "12 недель",
        price: "180000",
      },
      {
        title: "General English",
        type: "General English",
        description: "Foundation course covering basic English grammar, vocabulary, and conversation",
        level: "Beginner",
        duration: "в месяц",
        price: "45000",
      },
      {
        title: "Business English",
        type: "General English",
        description: "Professional English course focusing on business communication",
        level: "Intermediate",
        duration: "в месяц",
        price: "50000",
      },
    ]);
    console.log("Courses inserted.");
  } catch (error) {
    console.error("Error inserting courses:", error);
  }
}

async function seedMaterials() {
  console.log("Inserting materials...");
  try {
    await db.insert(materials).values([
      // IELTS Reading
      {
        title: "Cambridge_19", // matches Cambridge_19.pdf
        type: "IELTS Reading",
        description: "IELTS practice test from Cambridge.",
        courseId: 1,
      },
      {
        title: "MostCommonWords", // matches MostCommonWords.pdf
        type: "Vocabulary",
        description: "Common IELTS vocabulary words.",
        courseId: 1,
      },
      // SAT Math
      {
        title: "CollegePanda",
        type: "SAT Math",
        description: "College Panda SAT prep book.",
        courseId: 2,
      },
      {
        title: "desmos_guide",
        type: "SAT Math",
        description: "Using Desmos for SAT Math (Part 1).",
        courseId: 2,
      },
      {
        title: "desmos_guide2",
        type: "SAT Math",
        description: "Using Desmos for SAT Math (Part 2).",
        courseId: 2,
      },
      {
        title: "Prepros_150hard",
        type: "SAT Math",
        description: "150 hard practice questions for SAT.",
        courseId: 2,
      },
      {
        title: "PrincetonReview",
        type: "SAT Math",
        description: "Princeton Review SAT prep book.",
        courseId: 2,
      },
      // Grammar
      {
        title: "Erica_Grammar_DSAT",
        type: "Grammar",
        description: "Grammar practice for Digital SAT.",
        courseId: 2,
      },
      // SAT Verbal
      {
        title: "Erica_Reading_DSAT",
        type: "SAT Verbal",
        description: "Reading practice for Digital SAT.",
        courseId: 2,
      },
      // Vocabulary
      {
        title: "Erica_Vocabulary",
        type: "Vocabulary",
        description: "Vocabulary practice for SAT/IELTS.",
        courseId: 2,
      },
    ]);
    console.log("Materials inserted.");
  } catch (error) {
    console.error("Error inserting materials:", error);
  }
}

async function seedAll() {
  console.log("Seeding started...");

  // Clear existing data for a clean slate:
  try {
    await db.delete(materials).execute(); // Clear materials table
    await db.delete(courses).execute();   // Clear courses table
    console.log("Existing data cleared.");
  } catch (error) {
    console.error("Error clearing data:", error);
  }

  await seedCourses();
  await seedMaterials();
  console.log("Seeding finished.");
}

seedAll();