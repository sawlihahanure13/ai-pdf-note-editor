import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate upload URL for a file
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Add new file entry in DB
export const AddFileEntryToDb = mutation({
  args: {
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pdfFiles", {
      fileId: args.fileId,
      storageId: args.storageId,
      fileName: args.fileName,
      fileUrl: args.fileUrl,
      userEmail: args.userEmail,
    });
    return "Inserted";
  },
});

// Get file URL by storageId
export const getFileUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.storage.getUrl(args.storageId);
  },
});

// Get file record by fileId
export const getFileRecord = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();
  },
});

// Get all files for a user
export const getUserFiles = query({
  args: {
    userEmail: v.optional(v.string()),
  },
  handler: async (ctx, { userEmail }) => {
    if (!userEmail) return [];

    return await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("userEmail"), userEmail))
      .collect();
  },
});
