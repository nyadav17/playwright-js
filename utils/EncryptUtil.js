import CryptoJS from "crypto-js";

const secretKey = process.env.SECRET_KEY ? process.env.SECRET_KEY : "";

export function encryptData(data) {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}
export function decryptData(data) {
  return CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
}
