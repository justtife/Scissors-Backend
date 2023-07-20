import dns from "dns";
import { BadRequestError } from "../errors";
export default async function validateURL(url: string) {
  const domain = new URL(url).hostname;
  await dns.promises
    .lookup(domain)
    .then(() => {
      return true;
    })
    .catch((err: Error) => {
      throw new BadRequestError("URL does not exist");
    });
}
