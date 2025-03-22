CREATE TYPE "public"."provider" AS ENUM('google', 'github');--> statement-breakpoint
CREATE TABLE "cloud" (
	"id" uuid PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"filetype" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"fileSize" integer NOT NULL,
	"path" text NOT NULL,
	"author" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"pwd" text,
	"provider" "provider" NOT NULL,
	"p_id" text NOT NULL,
	"email" text,
	"pfp" text
);
--> statement-breakpoint
ALTER TABLE "cloud" ADD CONSTRAINT "cloud_author_users_id_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;