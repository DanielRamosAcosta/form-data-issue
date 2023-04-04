import { FormData } from "formdata-node"
import { FormDataEncoder } from "form-data-encoder";
import { Readable } from "stream";

/**
 * 
 * @param {FormData} form 
 * @returns {string}
 */
export async function toStringRepresentation(form) {
  const encoder = new FormDataEncoder(form)
  const readable = Readable.from(encoder)
  const buffer = await new Promise((resolve) => {
    const chunks = []
    readable.on("data", (chunk) => chunks.push(chunk))
    readable.on("end", () => resolve(Buffer.concat(chunks)))
  })

  return buffer.toString()
}

/**
 * 
 * @param {string} formDataString 
 * @returns {string}
 */
export function removeRandomnessOfForm(formDataString) {
  return formDataString.replace(
    /--form-data-boundary-\w{16}/g,
    "--form-data-boundary-xxxxxxxxxxxxxxxx",
  )
}

/**
 * 
 * @param {string} data 
 * @returns {string}
 */
export function crlfToLf(data) {
  return data.replace(/\r\n/g, "\n")
}
