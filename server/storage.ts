import { 
  Course, InsertCourse,
  Material, InsertMaterial,
  Enquiry, InsertEnquiry,
} from "@shared/schema";

export interface IStorage {
  // Courses
  getCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Materials
  getMaterials(): Promise<Material[]>;
  getMaterialsByCourse(courseId: number): Promise<Material[]>;
  createMaterial(material: InsertMaterial): Promise<Material>;

  // Enquiries
  createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry>;
}

export class MemStorage implements IStorage {
  private courses: Map<number, Course>;
  private materials: Map<number, Material>;
  private enquiries: Map<number, Enquiry>;
  private courseId: number = 1;
  private materialId: number = 1;
  private enquiryId: number = 1;

  constructor() {
    this.courses = new Map();
    this.materials = new Map();
    this.enquiries = new Map();

    // Add sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleCourses: InsertCourse[] = [
      {
        title: "IELTS Academic Preparation",
        type: "IELTS",
        description: "Comprehensive IELTS preparation course covering all sections",
        level: "Intermediate to Advanced",
        duration: "8 недель",         // Changed from "12 weeks"
        price: "120 000 тенге"         // Changed from "599.99"
      },
      {
        title: "SAT Complete Course",
        type: "SAT",
        description: "Complete preparation for SAT Math and Verbal sections",
        level: "High School",
        duration: "12 недель",        // Changed from "16 weeks"
        price: "180 000 тенге"         // Changed from "799.99"
      },
      {
        title: "General English",
        type: "General English",
        description: "Foundation course covering basic English grammar, vocabulary, and conversation",
        level: "Beginner",
        duration: "в месяц",          // Updated to reflect monthly billing
        price: "45000 тенге в месяц"   // Changed from "299.99"
      },
      {
        title: "Business English",
        type: "General English",
        description: "Professional English course focusing on business communication",
        level: "Intermediate",
        duration: "в месяц",          // Updated to reflect monthly billing
        price: "50000 тенге в месяц"   // Changed from "399.99"
      }
    ];
  
    sampleCourses.forEach(course => this.createCourse(course));
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const newCourse = { ...course, id: this.courseId++ };
    this.courses.set(newCourse.id, newCourse);
    return newCourse;
  }

  async getMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values());
  }

  async getMaterialsByCourse(courseId: number): Promise<Material[]> {
    return Array.from(this.materials.values()).filter(m => m.courseId === courseId);
  }

  async createMaterial(material: InsertMaterial): Promise<Material> {
    const newMaterial = { ...material, id: this.materialId++ };
    this.materials.set(newMaterial.id, newMaterial);
    return newMaterial;
  }

  async createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry> {
    const newEnquiry = { ...enquiry, id: this.enquiryId++ };
    this.enquiries.set(newEnquiry.id, newEnquiry);
    return newEnquiry;
  }
}

export const storage = new MemStorage();