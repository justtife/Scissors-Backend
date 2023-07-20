import qrcode from "qrcode";
export default async function generateQRCode(link: string) {
  const qrCode = await qrcode.toDataURL(link);
  return qrCode;
}
