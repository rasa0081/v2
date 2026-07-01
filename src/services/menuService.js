// cafe-website/src/services/menuService.js - MySQL Version
import menuModel from '@/models/menuModel';
import menuCategoryModel from '@/models/menuCategoryModel';

class MenuService {
  static async getAllCategories() {
    try {
      // Get all active categories
      const categories = await menuCategoryModel.getAllCategories({ active: true });

      // Get menu items for each category
      const categoriesWithItems = await Promise.all(
        categories.map(async (category) => {
          const items = await menuModel.getItemsByCategory(category.category_id, true);

          return {
            ...category,
            items: items || []
          };
        })
      );

      return categoriesWithItems;
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      return [];
    }
  }

  static async getCategoryById(id) {
    try {
      const category = await menuCategoryModel.getCategoryById(id);
      if (!category) return null;

      const items = await menuModel.getItemsByCategory(id, true);

      return {
        ...category,
        items: items || []
      };
    } catch (error) {
      console.error('Error in getCategoryById:', error);
      return null;
    }
  }

  static async getMenuItemById(id) {
    try {
      return await menuModel.getMenuItemById(id);
    } catch (error) {
      console.error('Error in getMenuItemById:', error);
      return null;
    }
  }

  static async getMetadata() {
    try {
      const itemCount = await menuModel.countAvailableItems();
      const popularCount = await menuModel.countPopularItems();

      return {
        lastUpdated: new Date().toISOString(),
        currency: 'IRT',
        currencySymbol: 'ت',
        totalItems: itemCount,
        popularItems: popularCount
      };
    } catch (error) {
      console.error('Error in getMetadata:', error);
      return {
        lastUpdated: new Date().toISOString(),
        currency: 'IRT',
        currencySymbol: 'ت',
        totalItems: 0,
        popularItems: 0
      };
    }
  }

  static async searchItems(query) {
    try {
      const searchTerm = query.toLowerCase();

      const items = await menuModel.searchMenuItems(searchTerm);

      // Get categories for items
      const categories = await menuCategoryModel.getAllCategories({ active: true });

      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.category_id] = cat.title;
      });

      return items.map(item => ({
        ...item,
        category: categoryMap[item.category_id] || item.category_id
      }));
    } catch (error) {
      console.error('Error in searchItems:', error);
      return [];
    }
  }

  static async getPopularItems() {
    try {
      const items = await menuModel.getAllMenuItems({ popular: true, available: true });

      // Get categories for items
      const categories = await menuCategoryModel.getAllCategories({ active: true });

      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.category_id] = cat.title;
      });

      return items.map(item => ({
        ...item,
        category: categoryMap[item.category_id] || item.category_id
      }));
    } catch (error) {
      console.error('Error in getPopularItems:', error);
      return [];
    }
  }

  // Admin methods
  static async getAllItemsForAdmin() {
    try {
      const categories = await menuCategoryModel.getAllCategories();
      const allItems = await menuModel.getAllMenuItems({});

      return categories.map(category => ({
        ...category,
        items: allItems.filter(item => item.category_id === category.category_id)
      }));
    } catch (error) {
      console.error('Error in getAllItemsForAdmin:', error);
      return [];
    }
  }

  static async createMenuItem(itemData) {
    try {
      const newItemId = await menuModel.createMenuItem(itemData);
      const newItem = await menuModel.getMenuItemById(newItemId);

      return {
        success: true,
        data: newItem
      };
    } catch (error) {
      console.error('Error in createMenuItem:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async updateMenuItem(id, updateData) {
    try {
      await menuModel.updateMenuItem(id, updateData);
      const updatedItem = await menuModel.getMenuItemById(id);

      if (!updatedItem) {
        return {
          success: false,
          error: 'Item not found'
        };
      }

      return {
        success: true,
        data: updatedItem
      };
    } catch (error) {
      console.error('Error in updateMenuItem:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async deleteMenuItem(id) {
    try {
      const itemToDelete = await menuModel.getMenuItemById(id);

      if (!itemToDelete) {
        return {
          success: false,
          error: 'Item not found'
        };
      }

      await menuModel.deleteMenuItem(id);

      return {
        success: true,
        message: 'Item deleted successfully'
      };
    } catch (error) {
      console.error('Error in deleteMenuItem:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default MenuService;
