import { text, pgTable, uuid, timestamp, integer } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';

export const cloudTable = pgTable('cloud', {
    id: uuid('id').primaryKey(),
    section: text('section').notNull(),
    filetype: text('filetype').notNull(),
    title: text('title').notNull(),
    dname: text('dname').notNull(),
    description: text('description'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    fileSize: integer('fileSize').notNull(),
    path: text('path').notNull(),
    author: uuid('author').references(() => userTable.id).notNull(),
});

export type CloudFile = typeof cloudTable.$inferSelect;
export type NewCloudFile = typeof cloudTable.$inferInsert;
