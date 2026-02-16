import React, { useState, useEffect } from 'react';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  // Create an array of 44 images with fallback extensions
  const generateLocalImages = () => {
    const localImages = [];
    for (let i = 1; i <= 44; i++) {
      localImages.push({
        id: i,
        // Store both possible extensions
        jpgPath: `/images/${i}.jpg`,
        jpegPath: `/images/${i}.jpeg`,
        currentPath: `/images/${i}.jpg`, // Start with .jpg
        label: `Gallery Image ${i}`
      });
    }
    return localImages;
  };

  const localImages = generateLocalImages();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        // Try to fetch from backend first
        const res = await fetch(`${API_BASE_URL}/gallery/`);
        if (res.ok) {
          const backendImages = await res.json();
          // If backend has images, use them
          if (backendImages.length > 0) {
            setImages(backendImages);
          } else {
            setImages(localImages);
          }
        } else {
          // If backend fails, use local images
          setImages(localImages);
        }
      } catch (e) {
        console.warn('Backend offline, using local gallery images.');
        // Always fallback to local images
        setImages(localImages);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGallery();
  }, []);

  // Handle image error - try .jpeg if .jpg fails
  const handleImageError = (img: any, e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const currentSrc = target.src;
    
    // If current src ends with .jpg, try .jpeg
    if (currentSrc.includes('.jpg') && !failedImages.has(`${img.id}-jpeg`)) {
      console.log(`Trying .jpeg for image ${img.id}`);
      const newPath = `/images/${img.id}.jpeg`;
      target.src = newPath;
      setFailedImages(prev => new Set(prev).add(`${img.id}-jpg`));
    }
    // If .jpeg also fails, show placeholder
    else if (currentSrc.includes('.jpeg') || failedImages.has(`${img.id}-jpeg`)) {
      console.log(`Using placeholder for image ${img.id}`);
      target.src = `https://via.placeholder.com/400x300/1e293b/64748b?text=Image+${img.id}`;
      target.onerror = null; // Prevent infinite loop
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Visual Journey</h2>
          <h3 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-6">Our Center in Action</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our state-of-the-art facilities and active training sessions.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {images.map((img) => {
              // Handle both backend image objects and local image objects
              const imageId = img.id;
              const imageSrc = img.image || img.jpgPath || `/images/${img.id}.jpg`;
              const imageLabel = img.title || img.label || `Gallery Image ${img.id}`;
              
              return (
                <div 
                  key={img.id} 
                  className="relative rounded-xl overflow-hidden glass border border-white/10 group break-inside-avoid shadow-lg animate-fadeIn hover:shadow-blue-500/20 transition-shadow duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={imageSrc}
                      alt={imageLabel}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => handleImageError(img, e)}
                    />
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-500" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;