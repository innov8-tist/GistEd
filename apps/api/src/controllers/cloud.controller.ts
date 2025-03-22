import { Request, Response, NextFunction } from 'express';
import { CustomError } from '$/classes/CustomError.class';
import { createCloudFile, getCloudFileById, listCloudFilesByAuthor } from '../services/cloud.service';
import {listCloudFilesByAuthorSchema,createCloudFileSchema,getCloudFileByIdSchema} from "$/zod-request-schema/cloud-req.zod"
import { v4 } from 'uuid';

export async function uploadFileController(req: Request, res: Response, next: NextFunction) {
    try {
        const fileData = {
            section: req.body.section,
            filetype: req.body.filetype,
            title: req.body.title,
            description: req.body.description,
            fileSize: req.file?.size,
            path: req.file?.path,
            author: req.user?.id,
            id: v4()
        };

        const result = createCloudFileSchema.safeParse(fileData);
        if (!result.success) {
            return next(result.error);
        }

        const newFile = await createCloudFile(result.data);

        if (!newFile) {
            throw new CustomError(500, 'Failed to create cloud file');
        }

        res.status(201).json(newFile);
    } catch (error) {
        next(error);
    }
}

export async function saveFileMetadataController(req: Request, res: Response, next: NextFunction) {
    try {
        const fileData = {
            section: req.body.section,
            filetype: req.body.filetype,
            title: req.body.title,
            description: req.body.description,
            fileSize: req.body.fileSize,
            path: req.body.title,
            author: req.user?.id,
            id: v4()
        };
        console.log(fileData)

        const result = createCloudFileSchema.safeParse(fileData);
        if (!result.success) {
            return next(result.error);
        }

        const newFile = await createCloudFile(result.data);

        if (!newFile) {
            throw new CustomError(500, 'Failed to create cloud file');
        }

        res.status(201).json(newFile);
    } catch (error) {
        next(error);
    }
}


export async function getCloudFileByIdController(req: Request, res: Response, next: NextFunction) {
    const result = getCloudFileByIdSchema.safeParse(req.params);

    if (!result.success) {
        return next(result.error);
    }

    const { id } = result.data;
    const file = await getCloudFileById(id);

    if (!file) {
        throw new CustomError(404, 'File not found');
    }

    res.status(200).json(file);
}


export async function listCloudFilesByAuthorController(req: Request, res: Response, next: NextFunction) {
    const result = listCloudFilesByAuthorSchema.safeParse(req.params);
    if (!result.success) {
        return next(result.error);
    }
    const { authorId } = result.data;

    const files = await listCloudFilesByAuthor(authorId);
    res.status(200).json(files);
}

