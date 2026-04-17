export function extractCategory(library) {
  const map = {};
  const mySubcategories = new Set();

  library.forEach(wb => {
    if (wb.source_type === 'user') {
      if (wb.subcategory) {
        mySubcategories.add(wb.subcategory);
      }
    } else {
      const cat = wb.category;
      const subcat = wb.subcategory;

      if (!map[cat]) {
        map[cat] = new Set();
      }

      if (subcat) {
        map[cat].add(subcat);
      }
    }
  });

  const categories = [];

  categories.push({
    name: '我的',
    subcategories: ['全部', ...Array.from(mySubcategories)],
  });

  Object.entries(map).forEach(([name, subSet]) => {
    categories.push({
      name,
      subcategories: ['全部', ...Array.from(subSet)],
    });
  });

  return categories;
}
