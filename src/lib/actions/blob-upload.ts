"use server"

import { put } from "@vercel/blob"

export async function uploadPDFFile(file: File): Promise<string> {
  try {
    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error("Please select a PDF file only.")
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size must be less than 10MB.")
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      contentType: 'application/pdf',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })

    return blob.url
  } catch (error) {
    console.error("Blob upload error:", error)
    throw new Error("Failed to upload PDF file.")
  }
}
