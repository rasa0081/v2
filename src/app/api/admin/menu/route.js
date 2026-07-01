import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import menuModel from '@/models/menuModel';
import menuCategoryModel from '@/models/menuCategoryModel';
import activityModel from '@/models/activityModel';

const JWT_SECRET = process.env.JWT_SECRET || 'caribou-cafe-jwt-secret-2024';

// Middleware to verify admin token
const verifyAdmin = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded.role === 'admin';
  } catch {
    return false;
  }
};

// GET - Get all menu items for admin
export async function GET(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { success: false, error: 'دسترسی غیرمجاز' },
        { status: 401 }
      );
    }

    // Get all categories
    const categories = await menuCategoryModel.getAllCategories();

    // Get all items
    const allItems = await menuModel.getAllMenuItems({});

    // Group items by category
    const menuData = categories.map(category => ({
      ...category,
      items: allItems.filter(item => item.category_id === category.category_id)
    }));

    return NextResponse.json({
      success: true,
      data: menuData
    });

  } catch (error) {
    console.error('Error reading menu data:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در خواندن اطلاعات منو' },
      { status: 500 }
    );
  }
}

// POST - Add new menu item (admin)
export async function POST(request) {
  // Verify admin access
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'دسترسی غیرمجاز' },
      { status: 401 }
    );
  }

  try {
    const newItem = await request.json();

    // Validate required fields
    if (!newItem.name || !newItem.price || !newItem.categoryId) {
      return NextResponse.json(
        { success: false, error: 'نام، قیمت و دسته‌بندی الزامی هستند' },
        { status: 400 }
      );
    }

    // Create new item
    const newItemId = await menuModel.createMenuItem({
      name: newItem.name,
      description: newItem.description || '',
      price: parseFloat(newItem.price),
      category: newItem.categoryId,
      popular: newItem.popular || false,
      ingredients: newItem.ingredients || [],
      calories: newItem.calories ? parseInt(newItem.calories) : null,
      image: newItem.image || '/menu-images/default-item.jpg',
      available: newItem.available !== undefined ? newItem.available : true,
      order: newItem.order || 0
    });

    // Get created item
    const createdItem = await menuModel.getMenuItemById(newItemId);

    // Log activity
    await activityModel.logActivity({
      action: 'create',
      entityType: 'menu_item',
      entityName: newItem.name,
      entityId: createdItem.id,
      category: newItem.categoryId,
      userId: 'admin'
    });

    return NextResponse.json({
      success: true,
      data: createdItem,
      message: 'آیتم با موفقیت اضافه شد'
    });

  } catch (error) {
    console.error('Error adding menu item:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در افزودن آیتم' },
      { status: 500 }
    );
  }
}

// PUT - Update menu item (admin)
export async function PUT(request) {
  // Verify admin access
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'دسترسی غیرمجاز' },
      { status: 401 }
    );
  }

  try {
    const updatedItem = await request.json();

    if (!updatedItem.id) {
      return NextResponse.json(
        { success: false, error: 'شناسه آیتم الزامی است' },
        { status: 400 }
      );
    }

    // Get existing item for logging
    const existingItem = await menuModel.getMenuItemById(updatedItem.id);

    // Update item
    await menuModel.updateMenuItem(updatedItem.id, updatedItem);

    // Get updated item
    const updated = await menuModel.getMenuItemById(updatedItem.id);

    // Log activity
    await activityModel.logActivity({
      action: 'update',
      entityType: 'menu_item',
      entityName: updated.name,
      entityId: updated.id,
      category: updated.category_id,
      userId: 'admin'
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'آیتم با موفقیت به‌روزرسانی شد'
    });

  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در به‌روزرسانی آیتم' },
      { status: 500 }
    );
  }
}

// DELETE - Remove menu item (admin)
export async function DELETE(request) {
  // Verify admin access
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'دسترسی غیرمجاز' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'شناسه آیتم الزامی است' },
        { status: 400 }
      );
    }

    // Get item before deletion
    const itemToDelete = await menuModel.getMenuItemById(parseInt(id));

    if (!itemToDelete) {
      return NextResponse.json(
        { success: false, error: 'آیتم یافت نشد' },
        { status: 404 }
      );
    }

    // Delete item
    await menuModel.deleteMenuItem(parseInt(id));

    // Log activity
    await activityModel.logActivity({
      action: 'delete',
      entityType: 'menu_item',
      entityName: itemToDelete.name,
      entityId: itemToDelete.id,
      category: itemToDelete.category_id,
      userId: 'admin'
    });

    return NextResponse.json({
      success: true,
      message: 'آیتم با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در حذف آیتم' },
      { status: 500 }
    );
  }
}
