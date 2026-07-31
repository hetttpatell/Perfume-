import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, toggleProductFlags } from '../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export default function AdminPanelModal({ isOpen, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadCatalog = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadCatalog();
    }
  }, [isOpen]);

  const handleToggle = async (product, flagType) => {
    setTogglingId(product.id);
    const updatedHero = flagType === 'hero' ? !product.isHero : product.isHero;
    const updatedFeatured = flagType === 'featured' ? !product.isFeatured : product.isFeatured;

    try {
      await toggleProductFlags(product.id, { isHero: updatedHero, isFeatured: updatedFeatured });
      setProducts(prev =>
        prev.map(p =>
          p.id === product.id
            ? { ...p, isHero: updatedHero, isFeatured: updatedFeatured }
            : p
        )
      );
      setStatusMessage(`Updated ${product.name} showcase flags.`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      alert('Failed to update showcase flags');
    } finally {
      setTogglingId(null);
    }
  };

  const handleImageUpload = async (productId, file) => {
    if (!file) return;
    setUploadingId(productId);
    setStatusMessage('Converting image to .webp and uploading to Supabase...');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('productId', productId);

      const token = localStorage.getItem('lune_token');
      const response = await axios.post(`${API_BASE_URL}/admin/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setStatusMessage('Image converted to WebP & uploaded successfully!');
        loadCatalog();
      }
    } catch (err) {
      alert('Image upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingId(null);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-4 sm:inset-10 z-50 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans border border-black/10 max-w-5xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#111111] text-white p-6 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-[#C08A3E]">
                  MAISON LUNE • ADMIN CONTROL CENTER
                </span>
                <h2 className="font-serif font-black text-xl sm:text-2xl uppercase tracking-tight">
                  PRODUCT SHOWCASE & WEBP IMAGE MANAGER
                </h2>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Notification Banner */}
            {statusMessage && (
              <div className="bg-[#ECFDF5] border-b border-[#10B981]/30 px-6 py-2.5 text-xs text-[#065F46] font-medium flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Product List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8F8FA]">
              {loading ? (
                <div className="py-20 text-center text-sm font-sans text-[#555555]">
                  Loading catalog products...
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-black/10 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 hover:shadow-md transition-shadow"
                  >
                    {/* Left: Product Info */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-xl border border-black/10 shrink-0"
                      />
                      <div>
                        <span className="text-[9px] font-sans font-extrabold tracking-widest text-[#C08A3E] uppercase block">
                          ID: {product.id}
                        </span>
                        <h4 className="font-serif font-extrabold text-base text-[#111111] uppercase">
                          {product.name}
                        </h4>
                        <p className="text-xs font-sans text-[#555555] font-semibold">
                          {product.frenchName || product.category} • $ {product.price}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Hero & Featured Toggles */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end">
                      {/* Hero Toggle */}
                      <button
                        disabled={togglingId === product.id}
                        onClick={() => handleToggle(product, 'hero')}
                        className={`px-4 py-2 rounded-full text-[10px] font-sans font-extrabold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                          product.isHero
                            ? 'bg-[#111111] text-white shadow-xs'
                            : 'bg-[#F4F4F6] text-[#737373] hover:text-[#111111] border border-black/10'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${product.isHero ? 'bg-[#10B981]' : 'bg-gray-400'}`} />
                        <span>HERO SHOWCASE {product.isHero ? '(ACTIVE)' : ''}</span>
                      </button>

                      {/* Featured Toggle */}
                      <button
                        disabled={togglingId === product.id}
                        onClick={() => handleToggle(product, 'featured')}
                        className={`px-4 py-2 rounded-full text-[10px] font-sans font-extrabold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                          product.isFeatured
                            ? 'bg-[#C08A3E] text-white shadow-xs'
                            : 'bg-[#F4F4F6] text-[#737373] hover:text-[#111111] border border-black/10'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${product.isFeatured ? 'bg-white' : 'bg-gray-400'}`} />
                        <span>FEATURED {product.isFeatured ? '(ACTIVE)' : ''}</span>
                      </button>
                    </div>

                    {/* Right: WebP Image Upload Button */}
                    <div className="shrink-0 w-full md:w-auto">
                      <label className="px-4 py-2 bg-white border border-black/20 hover:border-black text-[#111111] hover:bg-black hover:text-white font-sans font-extrabold text-[10px] tracking-widest uppercase rounded-full transition-all cursor-pointer inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>{uploadingId === product.id ? 'UPLOADING WEBP...' : 'UPLOAD WEBP IMAGE'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(product.id, e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
