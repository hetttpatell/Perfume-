import { useState, useEffect } from 'react';
import {
  fetchProducts,
  toggleProductFlags,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStockStatus,
  fetchCategories
} from '../services/api';
import { useConfirm } from '../components/ConfirmModal';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Custom Minimalist Luxury Toggle Switch Component
function ToggleSwitch({ checked, onChange, disabled, activeColor = 'bg-[#111111]' }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none active:scale-95 ${
        checked ? activeColor : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function ProductsManager() {
  const { confirm } = useConfirm();
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoriesList = dbCategories.length > 0
    ? dbCategories.map(c => c.name.toUpperCase())
    : ['EXTRAIT DE PARFUM', 'EAU DE PARFUM', 'BODY CARE'];
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pop-Up Toast Notification State
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    frenchName: '',
    category: 'EXTRAIT DE PARFUM',
    subtitle: '',
    price: '',
    inStock: true,
    badge: 'HAUTE COUTURE',
    description: '',
    imageUrl: '',
    heroImageUrl: '',
    galleryImages: [],
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    heroTitle: '',
    heroSubtitle: '',
    heroQuote: '',
    heroNote1: '',
    heroNote2: '',
    heroNote3: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast({ open: false, message: '', type: 'info' }), 4000);
  };

  const loadProducts = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const [prodsData, catsData] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(prodsData);
      setDbCategories(catsData);
    } catch (error) {
      console.error('Failed to load products/categories:', error);
    }
    if (showLoader) setLoading(false);
  };

  useEffect(() => {
    loadProducts(true);
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: '',
      name: '',
      frenchName: '',
      category: categoriesList[0] || 'EXTRAIT DE PARFUM',
      subtitle: '',
      price: '',
      inStock: true,
      badge: 'HAUTE COUTURE',
      description: '',
      imageUrl: '',
      heroImageUrl: '',
      galleryImages: [],
      topNotes: '',
      heartNotes: '',
      baseNotes: '',
      heroTitle: '',
      heroSubtitle: '',
      heroQuote: '',
      heroNote1: '',
      heroNote2: '',
      heroNote3: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);

    const mainImg = p.image || '';
    const existingGallery = (p.galleryImages || []).filter(img => img !== mainImg);
    const allImgs = mainImg ? [mainImg, ...existingGallery] : existingGallery;

    setFormData({
      id: p.id,
      name: p.name || '',
      frenchName: p.frenchName || '',
      category: p.category || categoriesList[0] || 'EXTRAIT DE PARFUM',
      subtitle: p.subtitle || '',
      price: p.price || '',
      inStock: p.inStock !== false && p.in_stock !== false,
      badge: p.badge || 'HAUTE COUTURE',
      description: p.description || '',
      imageUrl: mainImg,
      heroImageUrl: p.heroImageUrl || p.hero_image_url || '',
      galleryImages: allImgs,
      topNotes: p.scentDetails?.top_notes || p.topNotes || '',
      heartNotes: p.scentDetails?.heart_notes || p.heartNotes || '',
      baseNotes: p.scentDetails?.base_notes || p.baseNotes || '',
      heroTitle: p.heroTitle || p.name || '',
      heroSubtitle: p.heroSubtitle || p.frenchName || '',
      heroQuote: p.heroQuote || p.description || '',
      heroNote1: p.heroNote1 || 'Galbanum',
      heroNote2: p.heroNote2 || 'Iris Pallida',
      heroNote3: p.heroNote3 || 'Vetiver'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Please fill in Product Name and Price', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const mainImageToSave = formData.imageUrl || (formData.galleryImages && formData.galleryImages[0]) || '';
      const subImagesToSave = (formData.galleryImages || []).filter(img => img !== mainImageToSave);

      const payload = {
        ...formData,
        imageUrl: mainImageToSave,
        galleryImages: subImagesToSave
      };

      if (editingProduct) {
        const res = await updateProduct({ ...payload, id: editingProduct.id });
        if (res.success) {
          showToast(`Product "${formData.name}" updated successfully!`);
          setIsModalOpen(false);
          await loadProducts(false);
        } else {
          showToast(res.error || 'Failed to update product', 'error');
        }
      } else {
        const res = await createProduct(payload);
        if (res.success) {
          showToast(`New creation "${formData.name}" added to catalog!`);
          setIsModalOpen(false);
          await loadProducts(false);
        } else {
          showToast(res.error || 'Failed to create product', 'error');
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to process product action', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    const ok = await confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`, {
      title: 'Delete Product',
      confirmLabel: 'DELETE',
      danger: true
    });
    if (!ok) return;

    setActionLoadingId(product.id);
    const res = await deleteProduct(product.id);
    if (res.success) {
      showToast(`Deleted "${product.name}" from catalog.`);
      loadProducts();
    } else {
      showToast(res.error || 'Failed to delete product', 'error');
    }
    setActionLoadingId(null);
  };

  const handleToggleStock = async (product) => {
    setActionLoadingId(product.id);
    const currentStatus = product.inStock !== false && product.in_stock !== false;
    const newStockStatus = !currentStatus;

    const res = await toggleProductStockStatus(product.id, newStockStatus);
    if (res.success) {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: newStockStatus, in_stock: newStockStatus } : p));
      showToast(`"${product.name}" is now ${newStockStatus ? 'ACTIVE' : 'DRAFT'}`);
    } else {
      showToast(res.error || 'Failed to toggle product status', 'error');
    }
    setActionLoadingId(null);
  };

  const handleToggleFlags = async (product, flagType) => {
    setActionLoadingId(product.id);
    const updatedHero = flagType === 'hero' ? !product.isHero : product.isHero;
    const updatedFeatured = flagType === 'featured' ? !product.isFeatured : product.isFeatured;

    try {
      await toggleProductFlags(product.id, { isHero: updatedHero, isFeatured: updatedFeatured });
      setProducts(prev =>
        prev.map(p => p.id === product.id ? { ...p, isHero: updatedHero, isFeatured: updatedFeatured } : p)
      );
      showToast(`Updated ${flagType.toUpperCase()} flag for "${product.name}".`);
    } catch (err) {
      showToast('Failed to update showcase flags', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Batch Image Upload Handler with Multi-Tier Fallback
  const handleBatchImageUpload = async (files) => {
    if (!files || files.length === 0) return;
    showToast(`Uploading ${files.length} image(s) — converting to .webp...`);

    try {
      const formPayload = new FormData();
      for (let i = 0; i < files.length; i++) {
        formPayload.append('images', files[i]);
      }
      formPayload.append('productId', editingProduct?.id || formData.id || 'temp-product');

      const token = localStorage.getItem('lune_token');
      let response;
      
      try {
        response = await axios.post(`${API_BASE_URL}/admin/images/upload-batch`, formPayload, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
      } catch (err1) {
        try {
          response = await axios.post(`${API_BASE_URL}/products/upload-batch`, formPayload, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
          });
        } catch (err2) {
          const uploadedUrls = [];
          for (let i = 0; i < files.length; i++) {
            const singlePayload = new FormData();
            singlePayload.append('image', files[i]);
            singlePayload.append('productId', editingProduct?.id || formData.id || 'temp-product');
            singlePayload.append('isPrimary', i === 0 ? 'true' : 'false');

            const singleRes = await axios.post(`${API_BASE_URL}/admin/images/upload`, singlePayload, {
              headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            if (singleRes.data.success && singleRes.data.image) {
              uploadedUrls.push(singleRes.data.image.public_url);
            }
          }
          response = { data: { success: true, images: uploadedUrls } };
        }
      }

      if (response.data.success && response.data.images) {
        const newWebpUrls = response.data.images;
        showToast(`${newWebpUrls.length} image(s) auto-converted to .webp and added!`);

        setFormData(prev => {
          const updatedGallery = Array.from(new Set([...(prev.galleryImages || []), ...newWebpUrls]));
          const currentMain = prev.imageUrl || updatedGallery[0] || '';
          return {
            ...prev,
            imageUrl: currentMain,
            galleryImages: updatedGallery
          };
        });
      }
    } catch (err) {
      showToast('Image upload failed: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const setAsMainImage = (imgUrl) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: imgUrl
    }));
    showToast('Selected image set as MAIN PRIMARY product photo!');
  };

  const removeUploadedImage = (imgUrlToRemove) => {
    setFormData(prev => {
      const newGallery = prev.galleryImages.filter(url => url !== imgUrlToRemove);
      const newMain = prev.imageUrl === imgUrlToRemove ? (newGallery[0] || '') : prev.imageUrl;
      return {
        ...prev,
        imageUrl: newMain,
        galleryImages: newGallery
      };
    });
  };

  const handleHeroImageUpload = async (file) => {
    if (!file) return;
    const token = localStorage.getItem('lune_token');
    const payload = new FormData();
    payload.append('image', file);
    payload.append('productId', editingProduct?.id || formData.id || 'temp-product');

    showToast('Converting image to .webp Base64 format for Hero Section...', 'info');

    try {
      let response;
      try {
        response = await axios.post(`${API_BASE_URL}/admin/images/upload-hero`, payload, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
      } catch (e1) {
        response = await axios.post(`${API_BASE_URL}/products/upload-hero`, payload, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
      }

      if (response.data.success && response.data.image) {
        const webpBase64Url = response.data.image.public_url;
        setFormData(prev => ({
          ...prev,
          heroImageUrl: webpBase64Url
        }));
        showToast('Hero section showcase image converted to .WEBP Base64 and saved!');
      }
    } catch (err) {
      showToast('Hero image upload failed: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.frenchName?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const isProdActive = p.inStock !== false && p.in_stock !== false;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && isProdActive) ||
      (statusFilter === 'INACTIVE' && !isProdActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans relative text-gray-900">
      {/* Floating Pop-Up Toast Notification */}
      {toast.open && (
        <div className="fixed top-6 right-6 z-50 animate-bounce-in max-w-md w-full">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-4 backdrop-blur-md ${
            toast.type === 'error'
              ? 'bg-red-900/95 text-white border-red-500/50'
              : 'bg-[#111111]/95 text-white border-[#C08A3E]/40'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full shrink-0 ${toast.type === 'error' ? 'bg-red-400' : 'bg-[#C08A3E]'} animate-ping`} />
              <p className="text-xs font-sans font-medium tracking-wide">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast({ open: false, message: '', type: 'info' })}
              className="text-[#A3A3A3] hover:text-white text-sm font-bold shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <span className="text-[10px] font-sans font-extrabold tracking-[0.3em] uppercase text-[#C08A3E] block mb-1">
            MAISON LUNE • CATALOG MANAGEMENT
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#111111] uppercase tracking-tight">
            PRODUCTS & SHOWCASE INVENTORY
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3.5 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-xs tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer shadow-lg flex items-center gap-2.5 active:scale-95 border border-black/20 self-start md:self-auto"
        >
          <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>ADD NEW PRODUCT</span>
        </button>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <svg className="w-4 h-4 absolute left-4 top-3 text-[#737373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product by name, french subtitle, category..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-black/10 rounded-full text-xs text-[#111111] focus:outline-none focus:border-black font-sans transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-xs text-[#888888] hover:text-[#111111]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-[11px] font-sans font-extrabold text-[#555555] uppercase tracking-wider">
            PRODUCTS LISTING: <span className="text-[#111111] font-serif font-black">{filteredProducts.length}</span> ITEMS
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/10">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[9px] font-sans font-extrabold text-[#C08A3E] tracking-widest uppercase mr-2">
              CATEGORY:
            </span>
            {['ALL', ...categoriesList].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-sans font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#111111] text-white shadow-2xs'
                    : 'bg-white text-[#555555] hover:text-[#111111] border border-black/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-sans font-extrabold text-[#C08A3E] tracking-widest uppercase mr-2">
              STATUS:
            </span>
            {['ALL', 'ACTIVE', 'INACTIVE'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-sans font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#C08A3E] text-white shadow-2xs'
                    : 'bg-white text-[#555555] hover:text-[#111111] border border-black/10'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Column-Wise Product Table */}
      {loading ? (
        <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-[#F8F8FA] border-b border-black/10 text-[9px] font-extrabold text-[#555555] tracking-[0.2em] uppercase">
                  <th className="py-4 px-4 text-center w-24">MAIN IMAGE</th>
                  <th className="py-4 px-5">PRODUCT NAME & SUBTITLE</th>
                  <th className="py-4 px-4">CATEGORY</th>
                  <th className="py-4 px-4 text-center">PRICE</th>
                  <th className="py-4 px-4 text-center">ACTIVE STATUS</th>
                  <th className="py-4 px-4 text-center">HERO SLIDER</th>
                  <th className="py-4 px-4 text-center">FEATURED</th>
                  <th className="py-4 px-5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <tr key={idx} className="bg-white">
                    <td className="py-4 px-4 text-center">
                      <div className="w-14 h-14 bg-gray-200/80 rounded-xl mx-auto animate-pulse" />
                    </td>
                    <td className="py-4 px-5 space-y-2">
                      <div className="w-20 h-3 bg-gray-200/80 rounded animate-pulse" />
                      <div className="w-48 h-4 bg-gray-300/80 rounded animate-pulse" />
                      <div className="w-32 h-3 bg-gray-200/80 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-28 h-6 bg-gray-200/80 rounded-full animate-pulse" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="w-16 h-4 bg-gray-200/80 rounded mx-auto animate-pulse" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="w-10 h-5 bg-gray-200/80 rounded-full mx-auto animate-pulse" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="w-10 h-5 bg-gray-200/80 rounded-full mx-auto animate-pulse" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="w-10 h-5 bg-gray-200/80 rounded-full mx-auto animate-pulse" />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="w-20 h-8 bg-gray-200/80 rounded-xl ml-auto animate-pulse" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-[#F4F4F6] rounded-2xl border border-black/10 space-y-2">
          <h4 className="font-serif font-extrabold text-base uppercase text-[#111111]">NO PRODUCTS FOUND</h4>
          <p className="font-sans text-xs text-[#555555]">No items match your search filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-[#F8F8FA] border-b border-black/10 text-[9px] font-extrabold text-[#555555] tracking-[0.2em] uppercase">
                  <th className="py-4 px-4 text-center w-24">MAIN IMAGE</th>
                  <th className="py-4 px-5">PRODUCT NAME & SUBTITLE</th>
                  <th className="py-4 px-4">CATEGORY</th>
                  <th className="py-4 px-4 text-center">PRICE</th>
                  <th className="py-4 px-4 text-center">ACTIVE STATUS</th>
                  <th className="py-4 px-4 text-center">HERO SLIDER</th>
                  <th className="py-4 px-4 text-center">FEATURED</th>
                  <th className="py-4 px-5 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/10 text-xs">
                {filteredProducts.map((product) => {
                  const isProdActive = product.inStock !== false && product.in_stock !== false;
                  return (
                    <tr key={product.id} className="hover:bg-[#F8F8FA]/60 transition-colors">
                      {/* COLUMN 1: Main Image Thumbnail */}
                      <td className="py-4 px-4 text-center">
                        <div className="relative inline-block">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 object-contain rounded-xl border border-black/10 bg-[#F4F4F6] p-1 mx-auto"
                          />
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#C08A3E] text-white text-[7px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-2xs whitespace-nowrap">
                            MAIN IMAGE
                          </span>
                        </div>
                      </td>

                      {/* COLUMN 2: Product Name & Subtitle */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-bold text-[#C08A3E] uppercase">
                            #{product.id}
                          </span>
                          {product.badge && (
                            <span className="px-2 py-0.2 bg-black/5 text-[#555555] font-extrabold text-[8px] tracking-wider uppercase rounded-full border border-black/5">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif font-black text-sm text-[#111111] uppercase tracking-tight truncate mt-0.5">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-[#555555] font-medium truncate">
                          {product.frenchName || product.subtitle || 'Vaporisateur de Parfum'}
                        </p>
                      </td>

                      {/* COLUMN 3: Category */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-[#F4F4F6] text-[#111111] border border-black/10 font-sans font-extrabold text-[9px] tracking-wider uppercase rounded-full whitespace-nowrap">
                          {product.category}
                        </span>
                      </td>

                      {/* COLUMN 4: Price */}
                      <td className="py-4 px-4 text-center font-serif font-black text-sm text-[#111111] whitespace-nowrap">
                        $ {product.price}
                      </td>

                      {/* COLUMN 5: Active Status Toggle */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <ToggleSwitch
                            checked={isProdActive}
                            onChange={() => handleToggleStock(product)}
                            disabled={actionLoadingId === product.id}
                            activeColor="bg-[#10B981]"
                          />
                          <span className={`text-[8.5px] font-sans font-extrabold tracking-wider uppercase ${isProdActive ? 'text-[#10B981]' : 'text-gray-400'}`}>
                            {isProdActive ? 'ACTIVE' : 'DRAFT'}
                          </span>
                        </div>
                      </td>

                      {/* COLUMN 6: Hero Showcase Toggle */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <ToggleSwitch
                            checked={!!product.isHero}
                            onChange={() => handleToggleFlags(product, 'hero')}
                            disabled={actionLoadingId === product.id}
                            activeColor="bg-[#111111]"
                          />
                          <span className={`text-[8.5px] font-sans font-extrabold tracking-wider uppercase ${product.isHero ? 'text-[#111111]' : 'text-gray-400'}`}>
                            {product.isHero ? 'HERO ★' : 'OFF'}
                          </span>
                        </div>
                      </td>

                      {/* COLUMN 7: Featured Item Toggle */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <ToggleSwitch
                            checked={!!product.isFeatured}
                            onChange={() => handleToggleFlags(product, 'featured')}
                            disabled={actionLoadingId === product.id}
                            activeColor="bg-[#C08A3E]"
                          />
                          <span className={`text-[8.5px] font-sans font-extrabold tracking-wider uppercase ${product.isFeatured ? 'text-[#C08A3E]' : 'text-gray-400'}`}>
                            {product.isFeatured ? 'FEATURED ★' : 'OFF'}
                          </span>
                        </div>
                      </td>

                      {/* COLUMN 8: Edit & Delete Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            title="Edit Product & Manage Images"
                            className="p-2.5 bg-[#F4F4F6] hover:bg-[#111111] text-[#111111] hover:text-white border border-black/10 rounded-xl transition-all cursor-pointer active:scale-95"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          <button
                            disabled={actionLoadingId === product.id}
                            onClick={() => handleDelete(product)}
                            title="Delete Product Permanently"
                            className="p-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-500 rounded-xl transition-all cursor-pointer active:scale-95"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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

      {/* ULTRA-READABLE HIGH-CONTRAST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-4xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C08A3E]" />
                  <span className="text-[10px] font-sans font-extrabold tracking-[0.25em] text-[#C08A3E] uppercase">
                    MAISON LUNE ADMIN SUITE
                  </span>
                </div>
                <h3 className="font-serif font-black text-2xl text-gray-900 uppercase tracking-tight mt-0.5">
                  {editingProduct ? `EDIT PRODUCT: ${editingProduct.name}` : 'CREATE NEW FRAGRANCE PRODUCT'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center font-bold text-base cursor-pointer shadow-xs"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="product-form" onSubmit={handleFormSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-8 font-sans">
              
              {/* SECTION 1: GENERAL PRODUCT METADATA */}
              <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <h4 className="text-xs font-extrabold text-[#111111] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]">1</span>
                    GENERAL PRODUCT METADATA
                  </h4>
                  <span className="text-[10px] font-bold text-[#C08A3E] uppercase tracking-wider bg-[#C08A3E]/10 px-2.5 py-1 rounded-full border border-[#C08A3E]/20">
                    REQUIRED FIELDS *
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1.5 tracking-wider">
                      PRODUCT ID (UNIQUE SLUG)
                    </label>
                    <input
                      type="text"
                      disabled={!!editingProduct}
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      placeholder="e.g. n19-extrait"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl font-mono text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:bg-gray-100 disabled:text-gray-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1.5 tracking-wider">
                      FULL PRODUCT NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. LUNE N°19 EXTRAIT DE PARFUM"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1.5 tracking-wider">
                      FRENCH SUBTITLE
                    </label>
                    <input
                      type="text"
                      value={formData.frenchName}
                      onChange={(e) => setFormData({ ...formData, frenchName: e.target.value })}
                      placeholder="e.g. Extrait de Parfum Pur"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1.5 tracking-wider">
                      CATEGORY
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 uppercase"
                    >
                      {categoriesList.map(catName => (
                        <option key={catName} value={catName}>{catName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1.5 tracking-wider">
                      PRICE ($ USD) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="340"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-black text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: BATCH IMAGE UPLOADER & MAIN IMAGE SELECTOR */}
              <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-[#111111] uppercase tracking-widest flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]">2</span>
                      PRODUCT IMAGES & GALLERY
                    </h4>
                    <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                      Upload all product photos at once. Click "SET AS MAIN" on your primary bottle photo.
                    </p>
                  </div>

                  <label className="px-5 py-3 bg-gray-900 hover:bg-black text-white text-xs font-extrabold tracking-wider uppercase rounded-xl transition-all cursor-pointer active:scale-95 inline-flex items-center justify-center gap-2 shadow-md shrink-0">
                    <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>UPLOAD IMAGES FROM COMPUTER</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleBatchImageUpload(e.target.files)}
                    />
                  </label>
                </div>

                {/* Uploaded Images Grid */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-gray-800 tracking-wider">
                      UPLOADED PHOTOS ({formData.galleryImages?.length || 0} TOTAL)
                    </span>
                    {formData.imageUrl && (
                      <span className="text-[10px] font-extrabold text-[#C08A3E] uppercase tracking-wider bg-[#C08A3E]/10 px-3 py-1 rounded-full border border-[#C08A3E]/20">
                        1 PRIMARY PHOTO SELECTED
                      </span>
                    )}
                  </div>

                  {formData.galleryImages && formData.galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {formData.galleryImages.map((imgUrl, idx) => {
                        const isMain = formData.imageUrl === imgUrl;
                        return (
                          <div
                            key={idx}
                            className={`relative group bg-gray-50 p-2 rounded-2xl border transition-all ${
                              isMain
                                ? 'border-[#C08A3E] ring-2 ring-[#C08A3E]/40 shadow-md bg-white'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Product image ${idx + 1}`}
                              className="w-full h-24 object-contain rounded-xl bg-white p-1.5 mx-auto"
                            />

                            {/* Badge / Select Main Action */}
                            {isMain ? (
                              <span className="mt-2 w-full py-1.5 bg-[#C08A3E] text-white text-[9px] font-black uppercase rounded-lg block text-center shadow-xs tracking-wider">
                                ★ MAIN PHOTO
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAsMainImage(imgUrl)}
                                className="mt-2 w-full py-1.5 bg-gray-200 hover:bg-gray-900 text-gray-800 hover:text-white text-[9px] font-extrabold uppercase rounded-lg block text-center transition-all cursor-pointer tracking-wider"
                              >
                                SET AS MAIN
                              </button>
                            )}

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(imgUrl)}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-md hover:bg-red-700 transition-all cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-2 border-2 border-dashed border-gray-200 rounded-xl">
                      <p className="text-xs text-gray-500 font-semibold">
                        No photos uploaded yet for this fragrance product.
                      </p>
                      <label className="inline-block text-xs font-black text-[#C08A3E] uppercase tracking-wider cursor-pointer hover:underline">
                        Click "UPLOAD IMAGES FROM COMPUTER" to select photos
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleBatchImageUpload(e.target.files)}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: HERO SECTION SHOWCASE DISPLAY */}
              <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="text-xs font-extrabold text-[#111111] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]">3</span>
                    HERO SLIDER SHOWCASE & DEDICATED HERO IMAGE
                  </h4>
                  <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                    Customize titles, sensory quotes, floating notes, and upload a dedicated hero section image.
                  </p>
                </div>

                {/* DEDICATED HERO SECTION IMAGE INPUT */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-[11px] font-extrabold uppercase text-gray-900 tracking-wider">
                      HERO SECTION SHOWCASE IMAGE
                    </label>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3 text-amber-600 fill-current" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/></svg>
                      Auto-Converts Any Format to .WEBP Base64
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-gray-500">
                    Select any photo from your computer (PNG, JPG, WEBP, GIF, etc.). The backend will automatically convert it into optimized .WEBP Base64 format and store it directly in the database.
                  </p>

                  {formData.heroImageUrl ? (
                    <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img
                          src={formData.heroImageUrl}
                          alt="Hero Showcase Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1 bg-emerald-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow">
                          WEBP
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1">
                            <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                            WEBP BASE64 STORED IN DATABASE
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-gray-500 truncate max-w-xs sm:max-w-md">
                          {formData.heroImageUrl.startsWith('data:image/webp;base64,')
                            ? `data:image/webp;base64,... (${(formData.heroImageUrl.length / 1024).toFixed(1)} KB)`
                            : formData.heroImageUrl}
                        </p>

                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                          <label className="px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors shadow-xs">
                            CHANGE HERO IMAGE
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files[0] && handleHeroImageUpload(e.target.files[0])}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, heroImageUrl: '' }))}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold rounded-lg border border-red-200 transition-colors"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 hover:border-gray-900 bg-white rounded-2xl p-6 text-center transition-colors">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-50 text-[#C08A3E] flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-xs font-bold text-gray-900 mb-1">
                        Upload Custom Image for Hero Showcase
                      </p>
                      <p className="text-[11px] text-gray-500 mb-3">
                        Select any image file. Backend automatically converts it into .WEBP Base64 format.
                      </p>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-md hover:shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        SELECT HERO IMAGE FILE
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files[0] && handleHeroImageUpload(e.target.files[0])}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-gray-200">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1.5 tracking-wider">
                      HERO TITLE OVERLAY
                    </label>
                    <input
                      type="text"
                      value={formData.heroTitle}
                      onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                      placeholder="e.g. LUNE N°19"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1.5 tracking-wider">
                      HERO SUBTITLE OVERLAY
                    </label>
                    <input
                      type="text"
                      value={formData.heroSubtitle}
                      onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                      placeholder="e.g. EXTRAIT DE PARFUM • PURE ESSENCE"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1.5 tracking-wider">
                    HERO SLIDER QUOTE / ONE-LINER
                  </label>
                  <input
                    type="text"
                    value={formData.heroQuote}
                    onChange={(e) => setFormData({ ...formData, heroQuote: e.target.value })}
                    placeholder="“An ethereal floral whisper wrapped in powdery iris and galbanum.”"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 font-serif italic"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-gray-900 mb-1 tracking-wider">FLOATING NOTE 1</label>
                    <input
                      type="text"
                      value={formData.heroNote1}
                      onChange={(e) => setFormData({ ...formData, heroNote1: e.target.value })}
                      placeholder="Galbanum"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-gray-900 mb-1 tracking-wider">FLOATING NOTE 2</label>
                    <input
                      type="text"
                      value={formData.heroNote2}
                      onChange={(e) => setFormData({ ...formData, heroNote2: e.target.value })}
                      placeholder="Iris Pallida"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-gray-900 mb-1 tracking-wider">FLOATING NOTE 3</label>
                    <input
                      type="text"
                      value={formData.heroNote3}
                      onChange={(e) => setFormData({ ...formData, heroNote3: e.target.value })}
                      placeholder="Vetiver"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: DESCRIPTION & OLFACTORY SCENT NOTES */}
              <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="text-xs font-extrabold text-[#111111] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]">4</span>
                    DESCRIPTION & OLFACTORY PYRAMID
                  </h4>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1.5 tracking-wider">
                    PRODUCT DESCRIPTION & HERITAGE STORY
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe fragrance story, bouquet essence, and ingredients..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-[#C08A3E] mb-1 tracking-wider">TOP NOTES</label>
                    <input
                      type="text"
                      value={formData.topNotes}
                      onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                      placeholder="Galbanum, Bergamot"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-[#C08A3E] mb-1 tracking-wider">HEART NOTES</label>
                    <input
                      type="text"
                      value={formData.heartNotes}
                      onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                      placeholder="Iris Pallida, May Rose"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-[#C08A3E] mb-1 tracking-wider">BASE NOTES</label>
                    <input
                      type="text"
                      value={formData.baseNotes}
                      onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                      placeholder="Vetiver, Cedarwood"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* High-Contrast Sticky Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md flex items-center justify-end gap-4 shrink-0">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 border border-gray-300 text-gray-800 font-extrabold text-xs tracking-widest uppercase rounded-xl hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CANCEL
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#111111] hover:bg-black text-white font-extrabold text-xs tracking-[0.2em] uppercase rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 border border-black/20 flex items-center gap-2.5 disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 h-4 w-4 text-[#C08A3E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{editingProduct ? 'SAVING CHANGES...' : 'CREATING PRODUCT...'}</span>
                  </>
                ) : (
                  <span>{editingProduct ? 'SAVE CHANGES' : 'CREATE PRODUCT'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
