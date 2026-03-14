import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Users ───────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  roadmaps: many(roadmaps),
  progress: many(progress),
}));

// ─── Roadmaps ────────────────────────────────────────────
export const roadmaps = pgTable("roadmaps", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  prompt: text("prompt").notNull(),
  roadmapData: text("roadmap_data"), // full JSON from AI
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
  user: one(users, { fields: [roadmaps.userId], references: [users.id] }),
  nodes: many(roadmapNodes),
}));

// ─── Roadmap Nodes ───────────────────────────────────────
export const roadmapNodes = pgTable("roadmap_nodes", {
  id: uuid("id").defaultRandom().primaryKey(),
  roadmapId: uuid("roadmap_id")
    .references(() => roadmaps.id, { onDelete: "cascade" })
    .notNull(),
  nodeId: varchar("node_id", { length: 255 }).notNull(), // id from AI JSON
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  difficulty: varchar("difficulty", { length: 50 }),
  parentId: varchar("parent_id", { length: 255 }),
  positionX: real("position_x").default(0),
  positionY: real("position_y").default(0),
});

export const roadmapNodesRelations = relations(
  roadmapNodes,
  ({ one, many }) => ({
    roadmap: one(roadmaps, {
      fields: [roadmapNodes.roadmapId],
      references: [roadmaps.id],
    }),
    resources: many(resources),
    progress: many(progress),
  })
);

// ─── Resources ───────────────────────────────────────────
export const resources = pgTable("resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  nodeId: uuid("node_id")
    .references(() => roadmapNodes.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 50 }).default("youtube"),
});

export const resourcesRelations = relations(resources, ({ one }) => ({
  node: one(roadmapNodes, {
    fields: [resources.nodeId],
    references: [roadmapNodes.id],
  }),
}));

// ─── Progress ────────────────────────────────────────────
export const progress = pgTable("progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  nodeId: uuid("node_id")
    .references(() => roadmapNodes.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, { fields: [progress.userId], references: [users.id] }),
  node: one(roadmapNodes, {
    fields: [progress.nodeId],
    references: [roadmapNodes.id],
  }),
}));
