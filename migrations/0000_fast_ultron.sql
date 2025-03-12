-- Create courses table
CREATE TABLE "courses" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "type" text NOT NULL,
  "description" text NOT NULL,
  "level" text NOT NULL,
  "duration" text NOT NULL,
  "price" numeric NOT NULL
);

-- Create materials table
CREATE TABLE "materials" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "type" text NOT NULL,
  "description" text NOT NULL,
  "course_id" integer NOT NULL
);

-- Create enquiries table
CREATE TABLE "enquiries" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "subject" text NOT NULL,
  "message" text NOT NULL
);

-- Create users table with the new profile_data column
CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password_hash" text,
  "google_id" text,
  "avatar_url" text,
  "first_name" text,
  "last_name" text,
  "phone" text,
  "profile_data" jsonb  -- Added column for additional profile data
);