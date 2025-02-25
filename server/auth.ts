import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

interface User {
  id: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
}
const users: User[] = [];

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
function generateToken(user: User) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const existingUser = users.find((u) => u.email === email);
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: User = { id: Date.now().toString(), email, passwordHash };
  users.push(newUser);
  const token = generateToken(newUser);
  res.json({ token });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const user = users.find((u) => u.email === email);
  if (!user || !user.passwordHash)
    return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = generateToken(user);
  res.json({ token });
});

// --- Google OAuth Setup ---

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: "/api/auth/google/callback",
      },
      (
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done: (error: any, user?: any) => void
      ) => {
        let user = users.find(u => u.googleId === profile.id);
        if (!user) {
          user = {
            id: Date.now().toString(),
            email: profile.emails ? profile.emails[0].value : "",
            googleId: profile.id,
          };
          users.push(user);
        }
        done(null, user);
      }
    ) as any // Optionally cast to any if type conflicts persist
  );

router.use(passport.initialize());

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    // @ts-ignore
    const token = generateToken(req.user);
    res.json({ token });
  }
);

export default router;