import dns from "dns";
import CustomError from "../errors";
export async function validateURL(url: string) {
  const domain = new URL(url).hostname;
  await dns.promises
    .lookup(domain)
    .then(() => {
      return true;
    })
    .catch((err: Error) => {
      throw new CustomError.BadRequestError("URL does not exist");
    });
}
