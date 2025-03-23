import express from 'express';
import {
    listCloudFilesByAuthorController,
    saveFileMetadataController,
    uploadFileController,
    getCloudFileByIdController,
    DownloadFileController
} from '$/controllers/cloud.controller';
import multer from 'multer';
import path from 'path';

const cloudRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        file.originalname = file.originalname.replace(/\s/g, "");
        cb(null, path.join(__dirname, './../../../cloud/'));
    },
    filename: (req, file, cb) => {
        console.log("Saving a new file",file,"Filename = ",file.originalname)
        cb(null, file.originalname); 
    },
});
const upload = multer({ storage });


cloudRouter.post('/', upload.single('file'), uploadFileController);
cloudRouter.get('/:id', getCloudFileByIdController);
cloudRouter.get('/author/:authorId', listCloudFilesByAuthorController);
cloudRouter.post('/new', saveFileMetadataController);
cloudRouter.get('/download/:id',DownloadFileController)


export default cloudRouter
