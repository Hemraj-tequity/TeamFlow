import crypto from "crypto";
import { ALGORITHM } from "./constants.js";

const secretKey = Buffer.from(process.env.ENCRYPTION_KEY!, "base64");

export const encrypt = (data: any) => {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(ALGORITHM, secretKey, iv);

  const plaintext = JSON.stringify(data);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  const result = Buffer.concat([iv, encrypted, authTag]);

  return result.toString("base64");
};  

export const decrypt = (data: any) => {
  const result = Buffer.from(data, "base64");

  const iv = result.slice(0, 12);
  const authTag = result.slice(-16);
  const encrypted = result.slice(12, -16);

  const decipher = crypto.createDecipheriv(ALGORITHM, secretKey, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8"));
};
