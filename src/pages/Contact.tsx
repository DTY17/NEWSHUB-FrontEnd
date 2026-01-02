import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ContactPage: React.FC = () => (
  <div className="w-full px-4 py-12">
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-4xl font-bold text-indigo-900 mb-6">Contact Us</h1>
      <form className="space-y-6">
        {['Name', 'Email', 'Subject'].map(label => (
          <div key={label}>
            <label className="block text-gray-700 font-semibold mb-2">{label}</label>
            <input type={label === 'Email' ? 'email' : 'text'} className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800 placeholder-gray-400" placeholder={label === 'Email' ? 'your@email.com' : `Your ${label.toLowerCase()}`} />
          </div>
        ))}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Message</label>
          <textarea rows={6} className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800 placeholder-gray-400" placeholder="Your message..."></textarea>
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold text-lg">Send Message</button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold text-indigo-900 mb-4">Other Ways to Reach Us</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3"><Mail size={20} className="text-pink-500" /><span className="text-gray-700">contact@newshub.com</span></div>
          <div className="flex items-center space-x-3"><Phone size={20} className="text-pink-500" /><span className="text-gray-700">+1 (555) 123-4567</span></div>
          <div className="flex items-center space-x-3"><MapPin size={20} className="text-pink-500" /><span className="text-gray-700">123 News Street, New York, NY 10001</span></div>
        </div>
      </div>
    </div>
  </div>
);