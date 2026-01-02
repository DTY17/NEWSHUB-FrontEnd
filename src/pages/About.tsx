import React from 'react';

export const AboutPage: React.FC = () => (
  <div className="w-full px-4 py-12">
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-4xl font-bold text-indigo-900 mb-6">About Me</h1>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-6xl font-bold flex-shrink-0">JD</div>
        <div className="flex-1 space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">Welcome to NewsHub! I'm Jane Doe, a passionate journalist and content creator dedicated to bringing you the most relevant and engaging news from around the world.</p>
          <p className="leading-relaxed">With over 10 years of experience in digital journalism, I've covered everything from breaking technology news to in-depth environmental stories. My mission is to provide accurate, timely, and thought-provoking content that keeps you informed and engaged.</p>
          <p className="leading-relaxed">This platform was born out of a desire to create a space where quality journalism meets modern design. Whether you're interested in technology, sports, health, or global affairs, you'll find comprehensive coverage here.</p>
          <p className="leading-relaxed">Thank you for being part of our community. Your engagement and feedback drive me to deliver better content every day.</p>
        </div>
      </div>
    </div>
  </div>
);