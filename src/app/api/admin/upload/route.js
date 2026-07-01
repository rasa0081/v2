// cafe-website/src/app/api/admin/upload/route.js - WITHOUT SHARP
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')
    const type = formData.get('type') || 'menu'
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'هیچ فایلی ارسال نشده است' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'فرمت فایل مجاز نیست. فقط JPG, PNG, WebP, GIF' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      return NextResponse.json(
        { 
          success: false, 
          error: `حجم فایل نباید بیشتر از ۱۰ مگابایت باشد. حجم فعلی: ${fileSizeMB}MB` 
        },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Determine upload directory based on type
    let uploadDir
    let baseUrl
    if (type === 'menu') {
      uploadDir = path.join(process.cwd(), 'public', 'menu-items')
      baseUrl = '/menu-items'
    } else if (type === 'gallery') {
      uploadDir = path.join(process.cwd(), 'public', 'gallery')
      baseUrl = '/gallery'
    } else if (type === 'hero') {
      uploadDir = path.join(process.cwd(), 'public', 'hero')
      baseUrl = '/hero'
    } else {
      uploadDir = path.join(process.cwd(), 'public', 'uploads')
      baseUrl = '/uploads'
    }
    
    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename - preserve original extension
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const originalName = file.name || 'image'
    const ext = path.extname(originalName).toLowerCase() || '.jpg'
    const filename = `${type}-${timestamp}-${randomString}${ext}`
    const filepath = path.join(uploadDir, filename)
    
    // Save original file directly without processing
    await writeFile(filepath, buffer)
    
    console.log(`✅ Image uploaded: ${filename} (${(buffer.length / 1024).toFixed(2)} KB)`)
    
    return NextResponse.json({
      success: true,
      data: {
        filename: filename,
        url: `${baseUrl}/${filename}`,
        size: buffer.length,
        sizeMB: (buffer.length / (1024 * 1024)).toFixed(2),
        originalName: originalName
      },
      message: 'تصویر با موفقیت آپلود شد'
    })
    
  } catch (error) {
    console.error('❌ Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'خطا در آپلود تصویر. لطفا دوباره تلاش کنید.' },
      { status: 500 }
    )
  }
}
