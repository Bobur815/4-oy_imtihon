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
            
            if(file.mimetype.split('/')[1].match(/\/(jpg|jpeg|png)$/)){
                return cb(new Error("Image files allowed: jpg | jpeg | png"),false)
            }
            cb(null, true)
        }
    })
}