// server/auth.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { users as usersTable, User as DBUser } from "@shared/schema"; // Ensure your schema exports these
dotenv.config();

const router = Router();

// Define the User interface (this represents the shape returned by your DB)
export interface User {
  id: number;
  email: string;
  passwordHash?: string | null;
  googleId?: string | null;
  avatarUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
}

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
function generateToken(user: User) {
  // Include only necessary fields in the payload
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
}

const DEFAULT_AVATAR_URL = "https://via.placeholder.com/150";

// Traditional registration endpoint
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Check if the user already exists in the database
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .then((rows) => rows[0]);

  if (existingUser) {
    return res.status(400).json({ message: "User already registered" });
  }

  // Hash the password and insert the new user
  const passwordHash = await bcrypt.hash(password, 10);
  const newUsers = await db
    .insert(usersTable)
    .values({
      email,
      passwordHash,
      avatarUrl: DEFAULT_AVATAR_URL,
    })
    .returning();
  const newUser = newUsers[0] as DBUser;
  const token = generateToken(newUser);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ success: true });
});

// Traditional login endpoint
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Look for the user in the database
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .then((rows) => rows[0]);

  if (!user) {
    return res.status(400).json({ message: "User not registered" });
  }
  if (!user.passwordHash) {
    return res.status(400).json({ message: "User did not register with a password" });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  const token = generateToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ success: true });
});

// --- Google OAuth Setup ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/api/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        // Look for a user with the Google ID
        let user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.googleId, profile.id))
          .then((rows) => rows[0]);

        if (!user) {
          // Extract the avatar URL from the profile (try profile.photos or profile._json.picture)
          const avatarUrl =
            (profile.photos && profile.photos.length > 0 && profile.photos[0].value) ||
            profile._json?.picture;
          // Insert the new user into the database
          const newUsers = await db
            .insert(usersTable)
            .values({
              email: profile.emails ? profile.emails[0].value : "",
              googleId: profile.id,
              avatarUrl,
            })
            .returning();
          user = newUsers[0];
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  ) as any
);

router.use(passport.initialize());

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    const token = generateToken(req.user as User);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.redirect("http://localhost:5002/profile");
  }
);

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
});

export default router;