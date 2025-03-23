import { z } from 'zod';

export const createCloudFileSchema = z.object({
    id: z.string().min(1, 'Id is required'),
    section: z.string().min(1, 'Section is required'),
    filetype: z.string().min(1, 'File type is required'),
    title: z.string().min(1, 'Title is required'),
    dname: z.string().min(1, 'Title is required'),
    description: z.string().optional(), // Optional field
    fileSize: z.number().positive('File size must be a positive number'),
    path: z.string().min(1, 'File path is required'),
    author: z.string().uuid('Author ID must be a valid UUID'),
});


export const getCloudFileByIdSchema = z.object({
    id: z.string().uuid('File ID must be a valid UUID'),
});

export const listCloudFilesByAuthorSchema = z.object({
    authorId: z.string().uuid('Author ID must be a valid UUID'),
});

