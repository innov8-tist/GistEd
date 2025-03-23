import { Request, Response, NextFunction } from 'express';
import fs from 'fs'
import path from 'path';
import { CustomError } from '$/classes/CustomError.class';
import { createCloudFile, getCloudFileById, listCloudFilesByAuthor } from '../services/cloud.service';
import { listCloudFilesByAuthorSchema, createCloudFileSchema, getCloudFileByIdSchema } from "$/zod-request-schema/cloud-req.zod"
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
        console.log(error);
        next(error);
    }
}

export async function saveFileMetadataController(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("Req recieved",req.body)
        const fileData = {
            section: req.body.section,
            filetype: req.body.filetype,
            title: req.body.title,
            description: req.body.description,
            fileSize: req.body.fileSize,
            path: req.body.title,
            author: req.user?.id,
            dname:req.body.title,
            id: v4()
        };
        console.log(fileData)

        const result = createCloudFileSchema.safeParse(fileData);
        if (!result.success) {
            console.log(result.error)
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

export const DownloadFileController = async (req: Request, res: Response) => {
    let { id } = req.params;
    id = id?.toString()
    if (!id) {
        throw new Error("Invalid id")
    }
    try {
        const filePath = path.join(__dirname, './../../../cloud/', id);
        console.log(filePath)
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.setHeader('Content-Disposition', `attachment; filename=${id}`);
        res.setHeader('Content-Type', 'application/octet-stream');

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Failed to download file' });
    }
};



