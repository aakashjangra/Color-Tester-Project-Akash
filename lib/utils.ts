import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v2 as cloudinary } from "cloudinary";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const uploadOnCloudinary = async (localFilePath) => {
//   console.log("image path is - ", localFilePath);
//   try {
//     if (!localFilePath) return null;
//     //uploading the file on cloudinary
//     const res = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     //file uploaded successfully
//     console.log("file is uploaded on cloudinary!", res, res.url, localFilePath);
//     //remove locally save temp file when upload is done
//     fs.unlinkSync(localFilePath);
//     return res;
//   } catch (error) {
//     fs.unlinkSync(localFilePath);
//     return null;
//   }
// };
