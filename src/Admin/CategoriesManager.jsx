import { useState, useEffect } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory, fetchProducts, updateProduct } from '../services/api';
import { useConfirm } from '../components/ConfirmModal';

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#10B981]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function CategoriesManager() {
  const { confirm } = useConfirm();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    frenchName: '',
    description: '',
    isActive: true
  });
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast({ open: false, message: '', type: 'info' }), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    const [catsData, prodsData] = await Promise.all([fetchCategories(), fetchProducts()]);
    setCategories(catsData);
    setProducts(prodsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      id: '',
      name: '',
      frenchName: '',
      description: '',
      isActive: true
    });
    setSelectedProductIds([]);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      id: cat.id,
      name: cat.name || '',
      frenchName: cat.french_name || '',
      description: cat.description || '',
      isActive: cat.is_active !== false
    });

    // Find all products currently assigned to this category
    const assignedIds = products
      .filter(p => p.category?.toUpperCase() === cat.name?.toUpperCase())
      .map(p => p.id);

    setSelectedProductIds(assignedIds);
    setIsModalOpen(true);
  };

  const toggleProductSelection = (productId) => {
    setSelectedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('Category name is required', 'error');
      return;
    }

    const categoryName = formData.name.toUpperCase();
    let catRes;

    if (editingCategory) {
      catRes = await updateCategory(formData);
    } else {
      catRes = await createCategory(formData);
    }

    if (!catRes.success) {
      showToast(catRes.error || 'Failed to save category', 'error');
      return;
    }

    // Link products to this category in Supabase
    showToast(`Linking selected products to ${categoryName}...`);
    for (let p of products) {
      const isChecked = selectedProductIds.includes(p.id);
      const isCurrentlyInCat = p.category?.toUpperCase() === categoryName;

      if (isChecked && !isCurrentlyInCat) {
        await updateProduct({ id: p.id, category: categoryName });
      } else if (!isChecked && isCurrentlyInCat) {
        // Reassign to default if unchecked
        await updateProduct({ id: p.id, category: 'EXTRAIT DE PARFUM' });
      }
    }

    showToast(`Category "${categoryName}" & assigned products saved successfully!`);
    setIsModalOpen(false);
    loadData();
  };

  const handleToggleActive = async (cat) => {
    const updatedStatus = !cat.is_active;
    const res = await updateCategory({ id: cat.id, isActive: updatedStatus });
    if (res.success) {
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, is_active: updatedStatus } : c));
      showToast(`Category "${cat.name}" status updated.`);
    } else {
      showToast(res.error || 'Failed to update category status', 'error');
    }
  };

  const handleDelete = async (cat) => {
    const ok = await confirm(`Are you sure you want to delete category "${cat.name}"? This action cannot be undone.`, {
      title: 'Delete Category',
      confirmLabel: 'DELETE',
      danger: true
    });
    if (!ok) return;

    const res = await deleteCategory(cat.id);
    if (res.success) {
      showToast(`Category "${cat.name}" deleted.`);
      loadData();
    } else {
      showToast(res.error || 'Failed to delete category', 'error');
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.french_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans relative text-gray-900">
      {/* Toast Notification */}
      {toast.open && (
        <div className="fixed top-6 right-6 z-50 animate-bounce-in max-w-md w-full">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-4 backdrop-blur-md ${
            toast.type === 'error' ? 'bg-red-900/95 text-white border-red-500/50' : 'bg-[#111111]/95 text-white border-[#C08A3E]/40'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full shrink-0 ${toast.type === 'error' ? 'bg-red-400' : 'bg-[#C08A3E]'} animate-ping`} />
              <p className="text-xs font-sans font-medium tracking-wide">{toast.message}</p>
            </div>
            <button onClick={() => setToast({ open: false, message: '', type: 'info' })} className="text-gray-400 hover:text-white text-sm font-bold">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase text-[#C08A3E] block mb-1">
            MAISON LUNE • CATALOG MANAGEMENT
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 uppercase tracking-tight">
            FRAGRANCE CATEGORIES
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3.5 bg-[#111111] hover:bg-black text-white font-extrabold text-xs tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer shadow-lg flex items-center gap-2.5 active:scale-95 border border-black/20 self-start sm:self-auto"
        >
          <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>ADD NEW CATEGORY</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <svg className="w-4 h-4 absolute left-4 top-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category by name or subtitle..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-full text-xs text-gray-900 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
          TOTAL CATEGORIES: <span className="text-gray-900 font-serif font-black">{filteredCategories.length}</span>
        </div>
      </div>

      {/* Category Table */}
      {loading ? (
        <div className="py-24 text-center text-sm text-gray-500 font-medium">Loading fragrance categories...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-200">
          <h4 className="font-serif font-extrabold text-base uppercase text-gray-900">NO CATEGORIES FOUND</h4>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[9px] font-extrabold text-gray-500 tracking-[0.2em] uppercase">
                  <th className="py-4 px-5">CATEGORY NAME</th>
                  <th className="py-4 px-5">FRENCH SUBTITLE</th>
                  <th className="py-4 px-5">ASSIGNED PRODUCTS</th>
                  <th className="py-4 px-5">DESCRIPTION</th>
                  <th className="py-4 px-5 text-center">ACTIVE STATUS</th>
                  <th className="py-4 px-5 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredCategories.map((cat) => {
                  const assignedCount = products.filter(p => p.category?.toUpperCase() === cat.name?.toUpperCase()).length;
                  return (
                    <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-serif font-black text-sm text-gray-900 uppercase tracking-tight block">
                          {cat.name}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-gray-600 font-medium">
                        {cat.french_name || '—'}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-3 py-1 bg-gray-100 text-gray-900 font-extrabold text-[10px] uppercase rounded-full border border-gray-200">
                          {assignedCount} PRODUCTS LINKED
                        </span>
                      </td>
                      <td className="py-4 px-5 text-gray-600 max-w-xs truncate">
                        {cat.description || 'No description added'}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ToggleSwitch
                            checked={cat.is_active !== false}
                            onChange={() => handleToggleActive(cat)}
                          />
                          <span className={`text-[9px] font-extrabold uppercase ${cat.is_active !== false ? 'text-[#10B981]' : 'text-gray-400'}`}>
                            {cat.is_active !== false ? 'ACTIVE' : 'DRAFT'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(cat)}
                            title="Edit Category & Link Products"
                            className="p-2 bg-gray-100 hover:bg-gray-900 hover:text-white border border-gray-300 rounded-xl transition-all cursor-pointer"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            title="Delete Category"
                            className="p-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-500 rounded-xl transition-all cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal with Product Checklist */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 shrink-0">
              <div>
                <span className="text-[10px] font-extrabold text-[#C08A3E] uppercase tracking-widest block">
                  CATEGORY EDITOR
                </span>
                <h3 className="font-serif font-black text-xl text-gray-900 uppercase">
                  {editingCategory ? `EDIT CATEGORY: ${editingCategory.name}` : 'CREATE NEW CATEGORY'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-bold text-sm">
                ✕
              </button>
            </div>

            <form id="category-form" onSubmit={handleFormSubmit} className="space-y-6 font-sans text-xs overflow-y-auto pr-1 flex-1">
              <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  1. CATEGORY DETAILS
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1">
                      CATEGORY NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. DISCOVERY SETS"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1">
                      FRENCH SUBTITLE
                    </label>
                    <input
                      type="text"
                      value={formData.frenchName}
                      onChange={(e) => setFormData({ ...formData, frenchName: e.target.value })}
                      placeholder="e.g. Coffrets Découverte"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Category collection overview..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs text-gray-900"
                  />
                </div>
              </div>

              {/* SECTION 2: PRODUCT ASSIGNMENT CHECKLIST WITH IMAGES */}
              <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                      2. ASSIGN PRODUCTS TO THIS CATEGORY (CHECKLIST)
                    </h4>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Select which fragrance products belong under this category.
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#C08A3E] uppercase bg-[#C08A3E]/10 px-3 py-1 rounded-full border border-[#C08A3E]/20">
                    {selectedProductIds.length} SELECTED
                  </span>
                </div>

                {products.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-500 font-medium">
                    No products in catalog to assign.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                    {products.map((prod) => {
                      const isChecked = selectedProductIds.includes(prod.id);
                      return (
                        <div
                          key={prod.id}
                          onClick={() => toggleProductSelection(prod.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-white border-[#C08A3E] ring-2 ring-[#C08A3E]/20 shadow-xs'
                              : 'bg-white border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent div
                              className="w-4 h-4 rounded text-[#C08A3E] focus:ring-[#C08A3E] cursor-pointer"
                            />
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 border border-gray-200 shrink-0"
                            />
                            <div className="truncate">
                              <span className="font-bold text-xs text-gray-900 block truncate">
                                {prod.name}
                              </span>
                              <span className="text-[9px] font-extrabold text-gray-400 uppercase">
                                ${prod.price} • {prod.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </form>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-800 font-extrabold text-xs tracking-wider uppercase rounded-xl"
              >
                CANCEL
              </button>
              <button
                type="submit"
                form="category-form"
                className="px-7 py-2.5 bg-[#111111] hover:bg-black text-white font-extrabold text-xs tracking-[0.15em] uppercase rounded-xl shadow-md cursor-pointer"
              >
                {editingCategory ? 'SAVE & LINK PRODUCTS' : 'CREATE CATEGORY & LINK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
