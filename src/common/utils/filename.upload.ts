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