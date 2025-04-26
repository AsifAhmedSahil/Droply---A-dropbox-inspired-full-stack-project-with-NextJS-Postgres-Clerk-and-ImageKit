import {pgTable,text,uuid,integer,boolean, timestamp} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"


export const files = pgTable("files",{
    id:uuid("id").defaultRandom().primaryKey(),
    // basic file information

    name:text("name").notNull(),
    path:text("path").notNull(),
    size:integer("size").notNull(),
    type:text("type").notNull(),

    // storage information

    fileUrl:text("file_url").notNull(), // use to access the file
    thumbnailUrl:text("thumbnail_url").notNull(),

    // ownership

    userId: text("user_id").notNull(), 
    parentId: text("parent_id"),// 

    // file/folder flag
    isFolder: boolean("is_folder").default(false).notNull(),
    isStarred:boolean("is_starred").default(false).notNull(),
    isTrashed:boolean("is_trashed").default(false).notNull(),

    // TimeStamp

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

})

// Relationship

export const filesRelations = relations(files,({one,many})=>(
    {
        parent: one(files,{
            fields:[files.parentId],
            references:[files.id]
        }),

        children: many(files)
    }
))

// types declaration

export const File = typeof files.$inferSelect
export const NewFile = typeof files.$inferInsert