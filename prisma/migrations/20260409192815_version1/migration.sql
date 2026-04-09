/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLAYER', 'CLUB', 'ADMIN');

-- CreateEnum
CREATE TYPE "tournament_status" AS ENUM ('DRAFT', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "tournament_visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "category_gender" AS ENUM ('MALE', 'FEMALE', 'MIXED', 'OPEN');

-- CreateEnum
CREATE TYPE "category_status" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "registration_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'WAITLIST');

-- CreateEnum
CREATE TYPE "team_status" AS ENUM ('PENDING_PARTNER', 'ACTIVE', 'WITHDRAWN', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "team_invitation_status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "phase_type" AS ENUM ('GROUP_STAGE', 'KNOCKOUT', 'ROUND_ROBIN');

-- CreateEnum
CREATE TYPE "phase_status" AS ENUM ('DRAFT', 'PENDING', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "match_status" AS ENUM ('PENDING', 'SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED', 'WALKOVER');

-- CreateEnum
CREATE TYPE "bracket_round_type" AS ENUM ('ROUND_OF_32', 'ROUND_OF_16', 'QUARTERFINAL', 'SEMIFINAL', 'FINAL', 'THIRD_PLACE', 'CUSTOM');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "account" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "session" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" VARCHAR(30),
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PLAYER',
ADD COLUMN     "username" VARCHAR(50),
ALTER COLUMN "emailVerified" SET DEFAULT false,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "clubs" (
    "id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "phone" VARCHAR(30),
    "website" VARCHAR(255),
    "logo_url" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "dominant_hand" VARCHAR(20),
    "level" VARCHAR(50),
    "gender" VARCHAR(20),
    "birth_date" DATE,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(190) NOT NULL,
    "description" TEXT,
    "venue_name" VARCHAR(150),
    "venue_address" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "registration_open_at" TIMESTAMP(3),
    "registration_close_at" TIMESTAMP(3),
    "status" "tournament_status" NOT NULL DEFAULT 'DRAFT',
    "visibility" "tournament_visibility" NOT NULL DEFAULT 'PUBLIC',
    "rules" TEXT,
    "cover_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(140),
    "description" TEXT,
    "gender" "category_gender" NOT NULL DEFAULT 'OPEN',
    "level" VARCHAR(50),
    "min_age" INTEGER,
    "max_age" INTEGER,
    "format_name" VARCHAR(80),
    "max_teams" INTEGER,
    "min_teams" INTEGER,
    "requires_partner" BOOLEAN NOT NULL DEFAULT true,
    "status" "category_status" NOT NULL DEFAULT 'DRAFT',
    "registration_fee" DECIMAL(10,2) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "captain_user_id" TEXT NOT NULL,
    "player1_user_id" TEXT NOT NULL,
    "player2_user_id" TEXT,
    "name" VARCHAR(180),
    "status" "team_status" NOT NULL DEFAULT 'PENDING_PARTNER',
    "seed" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_invitations" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "invited_user_id" TEXT NOT NULL,
    "invited_by_user_id" TEXT NOT NULL,
    "status" "team_invitation_status" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMP(3),
    "responded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "registered_by_user_id" TEXT NOT NULL,
    "status" "registration_status" NOT NULL DEFAULT 'PENDING',
    "payment_status" VARCHAR(30) DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phases" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "type" "phase_type" NOT NULL,
    "round_type" "bracket_round_type",
    "phase_order" INTEGER NOT NULL,
    "status" "phase_status" NOT NULL DEFAULT 'DRAFT',
    "qualifies_count" INTEGER,
    "is_main_phase" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phase_groups" (
    "id" TEXT NOT NULL,
    "phase_id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "group_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phase_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_teams" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "phase_id" TEXT NOT NULL,
    "group_id" TEXT,
    "round_type" "bracket_round_type",
    "match_number" INTEGER,
    "team_a_id" TEXT,
    "team_b_id" TEXT,
    "winner_team_id" TEXT,
    "scheduled_at" TIMESTAMP(3),
    "venue_name" VARCHAR(150),
    "court_name" VARCHAR(100),
    "status" "match_status" NOT NULL DEFAULT 'PENDING',
    "walkover_winner_team_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_sets" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "set_number" INTEGER NOT NULL,
    "team_a_games" INTEGER NOT NULL,
    "team_b_games" INTEGER NOT NULL,
    "tiebreak_a_points" INTEGER,
    "tiebreak_b_points" INTEGER,

    CONSTRAINT "match_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phase_advancements" (
    "id" TEXT NOT NULL,
    "from_phase_id" TEXT NOT NULL,
    "to_phase_id" TEXT NOT NULL,
    "source_group_id" TEXT,
    "source_position" INTEGER,
    "target_slot" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phase_advancements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clubs_owner_user_id_key" ON "clubs"("owner_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_slug_key" ON "clubs"("slug");

-- CreateIndex
CREATE INDEX "clubs_city_idx" ON "clubs"("city");

-- CreateIndex
CREATE INDEX "clubs_state_idx" ON "clubs"("state");

-- CreateIndex
CREATE INDEX "clubs_country_idx" ON "clubs"("country");

-- CreateIndex
CREATE UNIQUE INDEX "player_profiles_user_id_key" ON "player_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_slug_key" ON "tournaments"("slug");

-- CreateIndex
CREATE INDEX "tournaments_club_id_idx" ON "tournaments"("club_id");

-- CreateIndex
CREATE INDEX "tournaments_status_idx" ON "tournaments"("status");

-- CreateIndex
CREATE INDEX "tournaments_visibility_idx" ON "tournaments"("visibility");

-- CreateIndex
CREATE INDEX "tournaments_start_date_idx" ON "tournaments"("start_date");

-- CreateIndex
CREATE INDEX "tournaments_club_id_start_date_idx" ON "tournaments"("club_id", "start_date");

-- CreateIndex
CREATE INDEX "categories_tournament_id_idx" ON "categories"("tournament_id");

-- CreateIndex
CREATE INDEX "categories_status_idx" ON "categories"("status");

-- CreateIndex
CREATE UNIQUE INDEX "categories_tournament_id_name_key" ON "categories"("tournament_id", "name");

-- CreateIndex
CREATE INDEX "teams_category_id_idx" ON "teams"("category_id");

-- CreateIndex
CREATE INDEX "teams_captain_user_id_idx" ON "teams"("captain_user_id");

-- CreateIndex
CREATE INDEX "teams_player1_user_id_idx" ON "teams"("player1_user_id");

-- CreateIndex
CREATE INDEX "teams_player2_user_id_idx" ON "teams"("player2_user_id");

-- CreateIndex
CREATE INDEX "team_invitations_team_id_idx" ON "team_invitations"("team_id");

-- CreateIndex
CREATE INDEX "team_invitations_invited_user_id_idx" ON "team_invitations"("invited_user_id");

-- CreateIndex
CREATE INDEX "team_invitations_status_idx" ON "team_invitations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_team_id_key" ON "registrations"("team_id");

-- CreateIndex
CREATE INDEX "registrations_category_id_idx" ON "registrations"("category_id");

-- CreateIndex
CREATE INDEX "registrations_status_idx" ON "registrations"("status");

-- CreateIndex
CREATE INDEX "registrations_payment_status_idx" ON "registrations"("payment_status");

-- CreateIndex
CREATE INDEX "phases_category_id_idx" ON "phases"("category_id");

-- CreateIndex
CREATE INDEX "phases_type_idx" ON "phases"("type");

-- CreateIndex
CREATE INDEX "phases_phase_order_idx" ON "phases"("phase_order");

-- CreateIndex
CREATE UNIQUE INDEX "phases_category_id_phase_order_key" ON "phases"("category_id", "phase_order");

-- CreateIndex
CREATE INDEX "phase_groups_phase_id_idx" ON "phase_groups"("phase_id");

-- CreateIndex
CREATE UNIQUE INDEX "phase_groups_phase_id_name_key" ON "phase_groups"("phase_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "phase_groups_phase_id_group_order_key" ON "phase_groups"("phase_id", "group_order");

-- CreateIndex
CREATE INDEX "group_teams_group_id_idx" ON "group_teams"("group_id");

-- CreateIndex
CREATE INDEX "group_teams_team_id_idx" ON "group_teams"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_teams_group_id_team_id_key" ON "group_teams"("group_id", "team_id");

-- CreateIndex
CREATE INDEX "matches_category_id_idx" ON "matches"("category_id");

-- CreateIndex
CREATE INDEX "matches_phase_id_idx" ON "matches"("phase_id");

-- CreateIndex
CREATE INDEX "matches_group_id_idx" ON "matches"("group_id");

-- CreateIndex
CREATE INDEX "matches_status_idx" ON "matches"("status");

-- CreateIndex
CREATE INDEX "matches_scheduled_at_idx" ON "matches"("scheduled_at");

-- CreateIndex
CREATE UNIQUE INDEX "matches_phase_id_match_number_key" ON "matches"("phase_id", "match_number");

-- CreateIndex
CREATE INDEX "match_sets_match_id_idx" ON "match_sets"("match_id");

-- CreateIndex
CREATE UNIQUE INDEX "match_sets_match_id_set_number_key" ON "match_sets"("match_id", "set_number");

-- CreateIndex
CREATE INDEX "phase_advancements_from_phase_id_idx" ON "phase_advancements"("from_phase_id");

-- CreateIndex
CREATE INDEX "phase_advancements_to_phase_id_idx" ON "phase_advancements"("to_phase_id");

-- CreateIndex
CREATE UNIQUE INDEX "phase_advancements_to_phase_id_target_slot_key" ON "phase_advancements"("to_phase_id", "target_slot");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_profiles" ADD CONSTRAINT "player_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_captain_user_id_fkey" FOREIGN KEY ("captain_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_player1_user_id_fkey" FOREIGN KEY ("player1_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_player2_user_id_fkey" FOREIGN KEY ("player2_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_registered_by_user_id_fkey" FOREIGN KEY ("registered_by_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phases" ADD CONSTRAINT "phases_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phase_groups" ADD CONSTRAINT "phase_groups_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "phases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_teams" ADD CONSTRAINT "group_teams_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "phase_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_teams" ADD CONSTRAINT "group_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "phases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "phase_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_team_a_id_fkey" FOREIGN KEY ("team_a_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_team_b_id_fkey" FOREIGN KEY ("team_b_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_winner_team_id_fkey" FOREIGN KEY ("winner_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_walkover_winner_team_id_fkey" FOREIGN KEY ("walkover_winner_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_sets" ADD CONSTRAINT "match_sets_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phase_advancements" ADD CONSTRAINT "phase_advancements_from_phase_id_fkey" FOREIGN KEY ("from_phase_id") REFERENCES "phases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phase_advancements" ADD CONSTRAINT "phase_advancements_to_phase_id_fkey" FOREIGN KEY ("to_phase_id") REFERENCES "phases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phase_advancements" ADD CONSTRAINT "phase_advancements_source_group_id_fkey" FOREIGN KEY ("source_group_id") REFERENCES "phase_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
