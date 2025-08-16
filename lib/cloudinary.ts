import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
}

export async function uploadToCloudinary(
  file: string | Buffer,
  options: {
    folder?: string
    transformation?: any[]
    crop?: string
    width?: number
    height?: number
  } = {},
): Promise<CloudinaryUploadResult> {
  try {
    let result;
    if (typeof file === "string") {
      result = await cloudinary.uploader.upload(file, {
        folder: options.folder || "dashboard",
        transformation: options.transformation,
        crop: options.crop,
        width: options.width,
        height: options.height,
        quality: "auto",
        fetch_format: "auto",
      });
    } else {
      result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder || "dashboard",
            transformation: options.transformation,
            crop: options.crop,
            width: options.width,
            height: options.height,
            quality: "auto",
            fetch_format: "auto",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file);
      });
    }

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw new Error("Failed to upload image")
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    throw new Error("Failed to delete image")
  }
}

export default cloudinary
