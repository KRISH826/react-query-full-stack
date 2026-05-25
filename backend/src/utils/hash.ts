import crypto from "crypto"

export const hashedToken = (token:string) => {
    return crypto.createHash('sha256').update(token).digest("hex")
}