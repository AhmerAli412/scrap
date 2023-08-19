import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { css } from '@emotion/react';
import { SyncLoader } from 'react-spinners';
import { BiDownload } from 'react-icons/bi';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (imageUrls.length > 0) {
      document.title = `${imageUrls.length} Image URLs Found 🌈`;
    } else {
      document.title = 'Website Image Scraper 📷';
    }
  }, [imageUrls]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

 // Inside the handleSubmit function, after receiving the response and before setting image URLs
try {
  const response = await axios.get(`https://scrape-img-url.onrender.com/images?url=${url}`);
  const baseUrl = new URL(url).origin; // Get the base URL from the entered URL
  const completeImageUrls = response.data.map(imgUrl => {
    if (imgUrl.startsWith('/')) {
      return baseUrl + imgUrl; // Complete relative URLs with the base URL
    } else {
      return imgUrl; // Keep absolute URLs as is
    }
  });
  setImageUrls(completeImageUrls);
} catch (error) {
  console.error(error);
}


    setIsLoading(false);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(imageUrls.map((url) => ({ ImageURL: url })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Image URLs');
    XLSX.writeFile(wb, 'image_urls.xlsx');
  };

  return (
    <div className=" min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">📷 Website Image Scraper 🌐</h2>
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 rounded border focus:outline-none focus:border-blue-500"
            placeholder="Enter a website URL"
          />
          <button
            type="submit"
            className={`mt-4 w-full bg-blue-500 text-white py-2 rounded-lg ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            } transition duration-300`}
            disabled={isLoading}
          >
            {isLoading ? (
              <SyncLoader
                color="white"
                css={css`
                  display: inline-block;
                  margin-right: 8px;
                `}
                size={8}
              />
            ) : (
              'Get Image URLs 📸'
            )}
          </button>
        </form>
        <div className="mb-6 ">
          <button
            type="button"
            className={`bg-green-500 text-white py-2 px-4 rounded-lg ${
              imageUrls.length === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-600'
            } transition duration-300`}
            onClick={handleDownload}
            disabled={imageUrls.length === 0}
          >
            <BiDownload className="inline-block text-xl" />
            Download Excel 📂
          </button>
        </div>
        {imageUrls.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold mb-4 text-center">Image URLs 🌈:</h3>
            <div className="space-y-2">
              {imageUrls.map((imageUrl, index) => (
                <div key={index} className="bg-gray-200 p-3 rounded-lg">
                  <span className="break-all text-sm">{imageUrl}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
