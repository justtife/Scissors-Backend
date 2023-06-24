import qrcode from "qrcode";
import saveOnCloudinary from "./cloudinary";
async function generateQRCode(link: string, short_url: string) {
  const qrCode = await qrcode.toDataURL(link);
  const result = await saveOnCloudinary(
    qrCode,
    `${short_url}_code`,
    "scissors_qrcode"
  );
  return result.secure_url;
}
export default generateQRCode;
