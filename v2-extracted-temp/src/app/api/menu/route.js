import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import menuModel from '@/models/menuModel';
import menuCategoryModel from '@/models/menuCategoryModel';
import notificationModel from '@/models/notificationModel';
import activityModel from '@/models/activityModel';

// Activity logging function
async function logMenuActivity(action, itemName, itemId, category, request) {
  try {
    await activityModel.logActivity({
      action,
      entityType: 'menu_item',
      entityName: itemName,
      entityId: itemId,
      category: category,
      userId: 'admin',
      request
    });
    console.log(`✅ Activity logged: ${action} menu item "${itemName}"`);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

// GET all menu items with categories
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const popular = searchParams.get('popular');

    // Get categories
    const categories = await menuCategoryModel.getAllCategories({ active: true });

    // Transform categories to match admin panel expectations (use id instead of category_id)
    const transformedCategories = categories.map(cat => ({
      id: cat.category_id,
      title: cat.title,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      sort_order: cat.sort_order,
      active: cat.active,
      created_at: cat.created_at
    }));

    // Build menu items query
    const menuFilters = { available: true };
    if (category) {
      menuFilters.category = category;
    }
    if (popular === 'true') {
      menuFilters.popular = true;
    }

    // Get menu items
    let menuItems = await menuModel.getAllMenuItems(menuFilters);

    // Transform menu items to match admin panel expectations (use _id instead of id)
    const transformedItems = menuItems.map(item => ({
      _id: item.id.toString(),  // Convert id to _id string for compatibility
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      category: item.category_id,  // Convert category_id to category
      popular: Boolean(item.popular),
      ingredients: typeof item.ingredients === 'string' ? JSON.parse(item.ingredients || '[]') : (item.ingredients || []),
      calories: item.calories ? parseInt(item.calories) : null,
      image: item.image || '/menu-images/default-item.jpg',
      available: Boolean(item.available !== undefined ? item.available : true),
      sort_order: item.sort_order || 0,
      created_at: item.created_at
    }));

    // Group items by category
    const categorizedItems = transformedCategories.map(cat => ({
      ...cat,
      items: transformedItems.filter(item => item.category === cat.id)
    }));

    return NextResponse.json({
      success: true,
      data: {
        categories: categorizedItems,
        metadata: {
          lastUpdated: new Date().toISOString(),
          currency: 'USD',
          totalItems: transformedItems.length,
          popularItems: transformedItems.filter(item => item.popular).length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'خطا در دریافت اطلاعات منو'
      },
      { status: 500 }
    );
  }
}

// POST - Add new menu item
export async function POST(request) {
  try {
    const data = await request.json();

    console.log('📥 Received data for new item:', data);

    // Validate required fields
    if (!data.name || !data.price || !data.category) {
      return NextResponse.json(
        { success: false, error: 'نام، قیمت و دسته‌بندی الزامی هستند' },
        { status: 400 }
      );
    }

    // Create new menu item
    const newItemId = await menuModel.createMenuItem({
      name: data.name.trim(),
      description: data.description || '',
      price: parseFloat(data.price),
      category: data.category,
      popular: data.popular || false,
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
      calories: data.calories ? parseInt(data.calories) : null,
      image: data.image || '/menu-images/default-item.jpg',
      available: data.available !== undefined ? data.available : true,
      order: data.order || 0
    });

    console.log('💾 Item saved successfully! ID:', newItemId);

    // Get the created item
    const newItem = await menuModel.getMenuItemById(newItemId);

    // Log the activity
    await logMenuActivity('create', newItem.name, newItem.id, newItem.category_id, request);

    // Try to create notification (optional)
    try {
      await notificationModel.createNotification({
        type: 'system',
        title: 'آیتم جدید اضافه شد',
        message: `آیتم "${newItem.name}" به منو اضافه شد`,
        data: { itemId: newItem.id, category: newItem.category_id },
        priority: 'low'
      });
      console.log('📢 Notification created');
    } catch (notificationError) {
      console.log('Notification optional - skipped:', notificationError.message);
    }

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'آیتم با موفقیت اضافه شد'
    });

  } catch (error) {
    console.error('❌ Error adding menu item:', error.message);

    return NextResponse.json(
      {
        success: false,
        error: 'خطا در افزودن آیتم',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// PUT - Update menu item
export async function PUT(request) {
  try {
    const data = await request.json();

    // Handle both _id (from admin panel) and id (direct API calls)
    let itemId = data.id || data._id;
    
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'شناسه آیتم الزامی است' },
        { status: 400 }
      );
    }

    // Convert _id to id if needed (admin panel sends _id as string)
    if (data._id) {
      itemId = parseInt(data._id);
    }

    // Get existing item before update for logging
    const existingItem = await menuModel.getMenuItemById(itemId);
    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'آیتم یافت نشد' },
        { status: 404 }
      );
    }

    console.log('📝 Updating item:', itemId);

    // Update the item
    await menuModel.updateMenuItem(itemId, data);

    // Get updated item
    const updatedItem = await menuModel.getMenuItemById(itemId);

    console.log('✅ Item updated successfully:', updatedItem.name);

    // Log the activity
    await logMenuActivity('update', updatedItem.name, updatedItem.id, updatedItem.category_id, request);

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: 'آیتم با موفقیت به‌روزرسانی شد'
    });

  } catch (error) {
    console.error('❌ Error updating menu item:', error.message);

    return NextResponse.json(
      { success: false, error: 'خطا در به‌روزرسانی آیتم' },
      { status: 500 }
    );
  }
}

// DELETE - Remove menu item
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    
    // Also check for _id (from admin panel)
    if (!id) {
      id = searchParams.get('_id');
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'شناسه آیتم الزامی است' },
        { status: 400 }
      );
    }

    // Convert to integer for MySQL
    const itemId = parseInt(id);

    // Get item before deletion for logging
    const itemToDelete = await menuModel.getMenuItemById(itemId);
    if (!itemToDelete) {
      return NextResponse.json(
        { success: false, error: 'آیتم یافت نشد' },
        { status: 404 }
      );
    }

    console.log('🗑️ Deleting item:', itemToDelete.name);

    // Log the activity BEFORE deletion
    await logMenuActivity('delete', itemToDelete.name, itemToDelete.id, itemToDelete.category_id, request);

    // Delete the item
    const result = await menuModel.deleteMenuItem(itemId);

    if (result === 0) {
      return NextResponse.json(
        { success: false, error: 'آیتم یافت نشد' },
        { status: 404 }
      );
    }

    console.log('✅ Item deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'آیتم با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('❌ Error deleting menu item:', error.message);
    return NextResponse.json(
      { success: false, error: 'خطا در حذف آیتم' },
      { status: 500 }
    );
  }
}
