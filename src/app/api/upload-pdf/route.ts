import { NextRequest, NextResponse } from 'next/server'
import { uploadPDFFile } from '@/lib/actions/blob-upload'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const url = await uploadPDFFile(file)

    return NextResponse.json({ url })
  } catch (error: any) {
    console.error('API upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
