import { NextResponse } from 'next/server';
import menuModel from '@/models/menuModel';
import menuCategoryModel from '@/models/menuCategoryModel';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const popular = searchParams.get('popular');

    const categories = await menuCategoryModel.getAllCategories({ active: true });

    const transformedCategories = categories.map((cat) => ({
      id: cat.category_id,
      title: cat.title,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      sort_order: cat.sort_order,
      active: cat.active,
      created_at: cat.created_at
    }));

    const menuFilters = { available: true };
    if (category) menuFilters.category = category;
    if (popular === 'true') menuFilters.popular = true;

    const menuItems = await menuModel.getAllMenuItems(menuFilters);

    const transformedItems = menuItems.map((item) => ({
      _id: item.id.toString(),
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      category: item.category_id,
      popular: Boolean(item.popular),
      ingredients:
        typeof item.ingredients === 'string'
          ? JSON.parse(item.ingredients || '[]')
          : (item.ingredients || []),
      calories: item.calories ? parseInt(item.calories) : null,
      image: item.image || '/menu-images/default-item.jpg',
      available: Boolean(item.available !== undefined ? item.available : true),
      sort_order: item.sort_order || 0,
      created_at: item.created_at
    }));

    const categorizedItems = transformedCategories.map((cat) => ({
      ...cat,
      items: transformedItems.filter((item) => item.category === cat.id)
    }));

    return NextResponse.json({
      success: true,
      data: {
        categories: categorizedItems,
        metadata: {
          lastUpdated: new Date().toISOString(),
          currency: 'IRR',
          totalItems: transformedItems.length,
          popularItems: transformedItems.filter((item) => item.popular).length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در دریافت اطلاعات منو' },
      { status: 500 }
    );
  }
}