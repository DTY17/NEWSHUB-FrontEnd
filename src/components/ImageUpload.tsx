// import { useState } from "react";
// import { upload_image } from "../services/GoogleDrive";

// export default function ImageInput() {
//   const [preview, setPreview] = useState<string | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (!file) return;
//     setImageFile(file);
//     const uploadedUrl = await upload_image(file);
//     if (uploadedUrl) setPreview(uploadedUrl);
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleImageChange} />

//       {preview && (
//         <img
//           src={preview}
//           alt="Selected"
//           width={200}
//           style={{ marginTop: "10px", borderRadius: "10px" }}
//         />
//       )}
//     </div>
//   );
// }
