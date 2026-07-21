import { useState } from 'react';

export default function Footer({ onScrollToTop }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubscribed(false);
      }, 4000);
    }
  };

  const socialLinks = [
    {
      id: 'facebook',
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      url: 'https://x.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      url: 'https://pinterest.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: 'https://youtube.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      url: 'https://tiktok.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525 2.25c.14 0 .28.01.42.01v4.39a6.04 6.04 0 0 1-3.64-1.22V15.5a5.5 5.5 0 1 1-5.5-5.5c.34 0 .67.03 1 .1v4.44a1.05 1.05 0 1 0 1.06 1.05V2.25h6.66zM19.5 7.75a6.05 6.05 0 0 1-4.22-1.74v-3.76a10.45 10.45 0 0 0 5.48 1.55v3.95h-1.26z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-white text-[#1A1A1A] font-sans border-t border-gray-200 mt-12">
      {/* Main 4-Column Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 items-start">
          
          {/* Column 1: PERFUME Brand & Newsletter */}
          <div className="flex flex-col pr-0 lg:pr-4">
            <h3 className="font-serif font-light uppercase text-3xl sm:text-4xl text-[#1A1A1A] tracking-[0.15em] mb-2 leading-none">
              PERFUME
            </h3>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C08A3E] font-semibold mb-3">
              HAUTE PARFUMERIE • PARIS
            </span>
            <p className="font-sans text-xs sm:text-sm text-[#737373] leading-relaxed mb-6">
              Crafting luxury olfactory masterpieces since 1921. Join our Gazette for confidential updates and exclusive offers.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">
                ✓ Thank you for subscribing to PERFUME!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative w-full max-w-sm">
                <div className="flex items-center bg-white border border-gray-300 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-black transition-colors shadow-2xs">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full text-xs sm:text-sm text-[#1A1A1A] placeholder-gray-400 bg-transparent focus:outline-none pr-2"
                  />
                  <button
                    type="submit"
                    aria-label="Submit Email"
                    className="w-9 h-9 bg-[#1A1A1A] hover:bg-black text-white rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer"
                  >
                    <svg className="w-4 h-4 transform rotate-45 -translate-x-0.5 translate-y-0.5 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h4 className="font-sans font-bold text-base text-[#1A1A1A] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-[#555555]">
              <li>
                <a href="#hero" className="hover:text-black transition-colors block">
                  Home
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-black transition-colors block">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-black transition-colors block">
                  Services
                </a>
              </li>
              <li>
                <a href="#boutique" className="hover:text-black transition-colors block">
                  Products
                </a>
              </li>
              <li>
                <a href="#boutiques" className="hover:text-black transition-colors block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="flex flex-col">
            <h4 className="font-sans font-bold text-base text-[#1A1A1A] mb-4">
              Contact Us
            </h4>
            <div className="space-y-2 font-sans text-xs sm:text-sm text-[#555555] leading-relaxed">
              <p>31 Rue Cambon, Flagship Boutique</p>
              <p>Paris, France 75001</p>
              <p className="pt-1">Phone: +33 (0)1 44 50 70 00</p>
              <p>Email: concierge@perfume.com</p>
            </div>
          </div>

          {/* Column 4: Follow Us & Social Media Accounts */}
          <div className="flex flex-col">
            <h4 className="font-sans font-bold text-base text-[#1A1A1A] mb-4">
              Follow Us
            </h4>

            {/* Complete Social Media Icons Grid */}
            <div className="flex flex-wrap items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow PERFUME on ${social.name}`}
                  title={social.name}
                  className="w-9 h-9 rounded-full border border-gray-300 hover:border-black text-[#4A4A4A] hover:bg-black hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer shadow-2xs"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="w-full border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#737373]">
          <div>
            © 2026 PERFUME. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-black transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-black transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
