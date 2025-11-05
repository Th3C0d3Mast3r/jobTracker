import crypto from "crypto";

const algorithm="aes-256-cbc";
const key=Buffer.from(process.env.ENCRYPTION_KEY,"base64");         // base 64 is what is needed
const ivLength=16;

export function encryptObject(obj){
    const iv=crypto.randomBytes(ivLength);
    const cipher=crypto.createCipheriv(algorithm,key,iv);
    let encrypted=cipher.update(JSON.stringify(obj),"utf8","base64");
    encrypted+=cipher.final("base64");
    return {iv:iv.toString("base64"),data:encrypted};
}

export function decryptObject(encObj){
    if(!encObj?.iv || !encObj?.data){
        throw new Error("Invalid encrypted object");
    }
    const iv=Buffer.from(encObj.iv,"base64");
    const decipher=crypto.createDecipheriv(algorithm,key,iv);
    let decrypted=decipher.update(encObj.data,"base64","utf8");
    decrypted+=decipher.final("utf8");
    return JSON.parse(decrypted);
}
