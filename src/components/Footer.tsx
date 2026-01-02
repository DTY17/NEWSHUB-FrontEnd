import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Newspaper } from 'lucide-react';

const genres = ["All", "Technology", "Business", "Sports", "Entertainment", "Politics", "Science", "Health", "Travel"];

export const Footer= ()=>{
  return (
    <footer className="bg-linear-to-br from-slate-900 via-gray-900 to-slate-800 text-white mt-16">
      <div className="w-full px-4 py-12">
        <div className="max-w-[1600px] mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
                  N
                </div>
                <span className="text-2xl font-bold">NewsHub</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Your trusted source for breaking news, in-depth analysis, and compelling stories from around the world.
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Newspaper size={14} />
                <span>Since 2025</span>
              </div>
            </div>

            {/* Genres */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-4 text-blue-400 uppercase tracking-wide">Categories</h3>
              <div className="grid grid-cols-1 gap-2">
                {genres.slice(1).map(g => (
                  <button 
                    key={g} 
                    className="text-left text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 text-sm"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-4 text-blue-400 uppercase tracking-wide">Contact Us</h3>
              <div className="space-y-3">
                <a 
                  href="mailto:contact@newshub.com"
                  className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                    <Mail size={16} className="text-blue-400" />
                  </div>
                  <span className="text-sm">contact@newshub.com</span>
                </a>
                <a 
                  href="tel:+15551234567"
                  className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                    <Phone size={16} className="text-blue-400" />
                  </div>
                  <span className="text-sm">+1 (555) 123-4567</span>
                </a>
                <div className="flex items-center space-x-3 text-gray-400 group">
                  <div className="w-8 h-8 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <MapPin size={16} className="text-blue-400" />
                  </div>
                  <span className="text-sm">123 News Street, NY 10001</span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-4 text-blue-400 uppercase tracking-wide">Follow Us</h3>
              <p className="text-gray-400 text-sm mb-4">Stay connected for the latest updates</p>
              <div className="flex space-x-3">
                <button className="w-11 h-11 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                  <Facebook size={20} />
                </button>
                <button className="w-11 h-11 bg-linear-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-sky-400/50 transition-all duration-300">
                  <Twitter size={20} />
                </button>
                <button className="w-11 h-11 bg-linear-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300">
                  <Instagram size={20} />
                </button>
                <button className="w-11 h-11 bg-linear-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300">
                  <Youtube size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; 2025 NewsHub. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <button className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Privacy Policy
                </button>
                <button className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Terms of Service
                </button>
                <button className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Advertise
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}