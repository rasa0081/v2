import { NextResponse } from 'next/server';
import galleryModel from '@/models/galleryModel';
import activityModel from '@/models/activityModel';

// GET - Get all gallery images with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const activeOnly = searchParams.get('active') !== 'false';

    // Get images
    const images = await galleryModel.getAllGalleryImages({
      category,
      limit,
      page,
      activeOnly
    });

    // Get total count
    const total = await galleryModel.countGalleryImages({ activeOnly });

    // Get categories for filter
    const categories = await galleryModel.getDistinctCategories();

    return NextResponse.json({
      success: true,
      data: {
        images,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        categories,
        stats: {
          totalImages: total,
          activeImages: await galleryModel.countGalleryImages({ activeOnly: true }),
          categoriesCount: categories.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching gallery images:', error);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    console.error('Error sqlMessage:', error.sqlMessage);

    // Check if it's a "table doesn't exist" error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return NextResponse.json(
        { success: false, error: 'Gallery table does not exist in database. Please run database setup script.' },
        { status: 503 }
      );
    }

    // Check for column errors
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return NextResponse.json(
        { success: false, error: `Database column error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error fetching gallery: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Add new gallery image
export async function POST(request) {
  try {
    const data = await request.json();

    console.log('Adding gallery image:', data);

    // Validate required fields
    if (!data.title || !data.url) {
      return NextResponse.json(
        { success: false, error: 'عنوان و آدرس تصویر الزامی هستند' },
        { status: 400 }
      );
    }

    // Create new image
    const newImageId = await galleryModel.createGalleryImage({
      title: data.title,
      description: data.description || '',
      url: data.url,
      thumbnailUrl: data.thumbnailUrl || data.url,
      category: data.category || 'other',
      tags: data.tags || [],
      altText: data.altText || data.title,
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      uploadedBy: data.uploadedBy || 'admin'
    });

    // Get the created image
    const newImage = await galleryModel.getGalleryImageById(newImageId);

    // Log activity
    try {
      await activityModel.logActivity({
        action: 'upload',
        entityType: 'gallery_image',
        entityName: data.title,
        entityId: newImage.id,
        category: data.category || 'other',
        userId: 'admin'
      });
    } catch (logError) {
      console.log('Failed to log activity:', logError);
    }

    return NextResponse.json({
      success: true,
      data: newImage,
      message: 'تصویر با موفقیت اضافه شد'
    });

  } catch (error) {
    console.error('Error adding gallery image:', error);
    console.error('Error code:', error.code);
    console.error('Error sqlMessage:', error.sqlMessage);

    // Check for column errors
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return NextResponse.json(
        { success: false, error: `Database column error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error adding image: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT - Update gallery image
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'شناسه تصویر الزامی است' },
        { status: 400 }
      );
    }

    await galleryModel.updateGalleryImage(data.id, data);

    const updatedImage = await galleryModel.getGalleryImageById(data.id);

    if (!updatedImage) {
      return NextResponse.json(
        { success: false, error: 'تصویر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedImage,
      message: 'تصویر با موفقیت به‌روزرسانی شد'
    });

  } catch (error) {
    console.error('Error updating gallery image:', error);
    console.error('Error code:', error.code);
    console.error('Error sqlMessage:', error.sqlMessage);

    // Check for column errors
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return NextResponse.json(
        { success: false, error: `Database column error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error updating image: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove gallery image
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'شناسه تصویر الزامی است' },
        { status: 400 }
      );
    }

    // Get image before deletion for logging
    const imageToDelete = await galleryModel.getGalleryImageById(parseInt(id));

    if (!imageToDelete) {
      return NextResponse.json(
        { success: false, error: 'تصویر یافت نشد' },
        { status: 404 }
      );
    }

    // Log activity before deletion
    try {
      await activityModel.logActivity({
        action: 'delete',
        entityType: 'gallery_image',
        entityName: imageToDelete.title,
        entityId: imageToDelete.id,
        category: imageToDelete.category,
        userId: 'admin'
      });
    } catch (logError) {
      console.log('Failed to log activity:', logError);
    }

    // Delete the image
    const result = await galleryModel.deleteGalleryImage(parseInt(id));

    if (result === 0) {
      return NextResponse.json(
        { success: false, error: 'تصویر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تصویر با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Error deleting gallery image:', error);
    console.error('Error code:', error.code);
    console.error('Error sqlMessage:', error.sqlMessage);

    // Check for column errors
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return NextResponse.json(
        { success: false, error: `Database column error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error deleting image: ' + error.message },
      { status: 500 }
    );
  }
}
