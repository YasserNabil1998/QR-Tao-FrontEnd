
interface CategoryTabsProps {
  categories: any[]
  activeCategory: string
  setActiveCategory: (categoryId: string) => void
}

const CategoryTabs = ({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد فئات متاحة</p>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="flex overflow-x-auto scrollbar-hide space-x-2 space-x-reverse pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeCategory === category.id
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryTabs
