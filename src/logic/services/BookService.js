import {
  getSubcategoriesByCategory,
  getBooksByCategory,
} from '../../data/dao/bookDao';

export async function getSubcategoryOptions(category) {
  try {
    const subs = await getSubcategoriesByCategory(category);
    return subs || [];
  } catch (err) {
    return [];
  }
}

export async function getBookOptionsByCategory(category) {
  try {
    const books = await getBooksByCategory(category);
    return books || [];
  } catch (err) {
    return [];
  }
}
