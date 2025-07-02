import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer'
import { RequestWithUser } from "src/modules/profiles/profiles.controller";


export function AvatarUpload(){
    return FileInterceptor('avatar_url',{
        storage:diskStorage({
            destination: 'src/common/uploads/avatars',
            filename: (req,file, cb) => {
                const { id: userId } = (req as RequestWithUser).user;
                const timestamp = Date.now();
                const originalName = file.originalname.replace(/\s+/g, '_')
                cb(null, `${userId}-${timestamp}-${originalName}`)
            },
        }),
        fileFilter: (req,file,cb) => {
            
            if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) {
                return cb(new Error("Only image files (jpg, jpeg, png) are allowed"), false);
            }
            cb(null, true);
            
        }
    })
}

export function PosterUpload(){
    return FileInterceptor('poster_url',{
        storage:diskStorage({
            destination: 'src/common/uploads/posters',
            filename: (req,file, cb) => {
                
                const { id: userId } = (req as RequestWithUser).user;
                const timestamp = Date.now();
                const originalName = file.originalname.replace(/\s+/g, '_')
                cb(null, `${userId}-${timestamp}-${originalName}`)
            },
        }),
        fileFilter: (req,file,cb) => {
            
            if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) {
                return cb(new Error("Only image files (jpg, jpeg, png) are allowed"), false);
            }
            cb(null, true);
            
        }
    })
}

export function MovieFileUpload(){
    return FileInterceptor('file_url',{
        storage:diskStorage({
            destination: 'src/common/uploads/movieFiles',
            filename: (req,file, cb) => {
                
                const { id: userId } = (req as RequestWithUser).user;
                const timestamp = Date.now();
                const originalName = file.originalname.replace(/\s+/g, '_')
                cb(null, `${userId}-${timestamp}-${originalName}`)
            },
        }),
        fileFilter: (req,file,cb) => {
            const allowedTypes = [
                'video/mp4',
                'video/webm',
                'video/ogg',
                'video/x-msvideo',
                'video/quicktime',
                'video/x-matroska',
                'video/x-flv',
                'video/x-ms-wmv',
                ];
            if (!allowedTypes.includes(file.mimetype)) {
                return cb(new Error("Only video files are allowed"), false);
            }
            cb(null, true);
            
        }
    })
}