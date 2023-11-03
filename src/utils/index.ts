import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'
import { extname } from 'path'
import { diskStorage } from 'multer'
config()

// Cloudinary configuration...
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const responseHandler = ({status, statusCode, message, data}) => {
    return {
        status,
        statusCode,
        message,
        data
    }
}

const uploadManager = (file: any, destination: string): Promise<{status: boolean, data?: {id: string, url: string}, error?: any}> => {
    return new Promise(async(resolve, reject) => {
      return await cloudinary.uploader.upload(file, {
                folder: `e-commerce/${destination}`,
                resource_type: "auto"
            },
         (err, result) => {
            if (err) {
                console.log(err)
                return reject({
                    error: err,
                    status: false
                })
            } else {
                return resolve({
                    status: true,
                    data:{
                        url: result.secure_url,
                        id: result.public_id
                    }

                })
            }
        }
        )
    })
}

const multeroption = {
    storage: diskStorage({}),
    fileFilter: (req: any, file: any, cb: any)=>{
        let ext = extname(file.originalname);
        if(ext !== ".jpg" && ext !== ".JPG" && ext !== ".jpeg" && ext !== ".png" && ext !== ".PNG" && ext !== ".svg" && ext !== ".SVG") {
            return cb( responseHandler({
                status: false,
                statusCode: 400,
                message: "Image type is not supported",
                data: {}
            }), false);
        }
        cb(null, true);
    },
}

export{
    responseHandler,
    uploadManager,
    multeroption
}