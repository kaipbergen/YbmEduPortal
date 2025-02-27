import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Extend the User interface to include an optional avatarUrl.
export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  avatarUrl?: string;
}

const users: User[] = [];

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
function generateToken(user: User) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

// Default avatar URL for traditional registrations
const DEFAULT_AVATAR_URL = "https://via.placeholder.com/150";

// Traditional registration endpoint (returns JSON)
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  // Assign a default avatar for traditional registrations
  const newUser: User = {
    id: Date.now().toString(),
    email,
    passwordHash,
    avatarUrl: DEFAULT_AVATAR_URL,
  };
  users.push(newUser);

  const token = generateToken(newUser);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set to false in dev if not using HTTPS
    sameSite: "lax",
  });
  // Return JSON so the client can navigate
  res.json({ success: true });
});

// Traditional login endpoint (returns JSON)
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = users.find((u) => u.email === email);
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
  // Return JSON so the client can navigate
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
    (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: (error: any, user?: any) => void
    ) => {
      let user = users.find((u) => u.googleId === profile.id);
      if (!user) {
        // Attempt to extract the avatar from profile.photos or profile._json.picture
        const avatarUrl =
          (profile.photos && profile.photos.length > 0 && profile.photos[0].value) ||
          profile._json?.picture;
        user = {
          id: Date.now().toString(),
          email: profile.emails ? profile.emails[0].value : "",
          googleId: profile.id,
          avatarUrl,
        };
        users.push(user);
      }
      done(null, user);
    }
  ) as any
);

router.use(passport.initialize());

// Route to initiate Google OAuth flow
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback endpoint: sets token as HTTP-only cookie and redirects to profile page
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    // @ts-ignore: assuming req.user is set by Passport
    const token = generateToken(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    // Redirect after successful OAuth
    res.redirect("http://localhost:5002/profile");
  }
);

// Logout endpoint
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
});

export default router;