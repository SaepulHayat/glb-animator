import { ACCEPTED_FILE_EXTENSION, MAX_FILE_SIZE_BYTES } from './constants'

export type FileValidationResult =
  | { valid: true }
  | { valid: false; message: string }

export function validateGlbFile(file: File): FileValidationResult {
  if (!file.name.toLowerCase().endsWith(ACCEPTED_FILE_EXTENSION)) {
    return {
      valid: false,
      message: `File "${file.name}" bukan format ${ACCEPTED_FILE_EXTENSION}. Export ulang model Anda sebagai .glb (di Blender: File > Export > glTF 2.0, pilih "glTF Binary"), lalu upload lagi.`,
    }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      message: `Ukuran file ${sizeMb}MB melebihi batas maksimum 100MB. Kompres model Anda dulu (misalnya dengan gltf-transform atau gltfpack), lalu upload lagi.`,
    }
  }

  return { valid: true }
}
