import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertEnquirySchema } from "@shared/schema";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const DOMAIN = process.env.REPL_SLUG 
  ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
  : "http://localhost:5000";

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

  // Payment routes
  app.post("/api/payments/create-session", async (req, res) => {
    try {
      const { courseId, email } = req.body;

      if (!courseId || !email) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const course = await storage.getCourseById(Number(courseId));
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: course.title,
                description: course.description,
              },
              unit_amount: Math.round(Number(course.price) * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${DOMAIN}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${DOMAIN}/payment/cancel`,
        customer_email: email,
      });

      // Create payment record
      await storage.createPayment({
        courseId: course.id,
        email,
        amount: course.price,
        currency: "usd",
        status: "pending",
        stripeSessionId: session.id,
        createdAt: new Date().toISOString(),
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating payment session:", error);
      res.status(500).json({ 
        message: "Failed to create payment session",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/payments/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        endpointSecret as string
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        await storage.updatePaymentStatus(session.id, "completed");
      }

      res.json({ received: true });
    } catch (err: unknown) {
      console.error("Webhook Error:", err);
      const error = err as Error;
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  app.get("/api/payments/:sessionId", async (req, res) => {
    try {
      const payment = await storage.getPaymentBySessionId(req.params.sessionId);
      if (!payment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }
      res.json(payment);
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ message: "Failed to fetch payment details" });
    }
  });

  return server;
}