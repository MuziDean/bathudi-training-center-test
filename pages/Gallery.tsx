import React, { useState, useEffect } from 'react';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [useBackendImages, setUseBackendImages] = useState(false);

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  // Generate ALL 44 local images with correct extensions
  const generateLocalImages = () => {
    const localImages = [];
    
    // Images 1-11 are .jpg
    for (let i = 1; i <= 11; i++) {
      localImages.push({
        id: i,
        jpgPath: `/images/${i}.jpg`,
        jpegPath: `/images/${i}.jpeg`,
        currentPath: `/images/${i}.jpg`, // Start with .jpg for 1-11
        label: `Gallery Image ${i}`,
        extension: 'jpg',
        isBackendImage: false
      });
    }
    
    // Images 12-44 are .jpeg
    for (let i = 12; i <= 44; i++) {
      localImages.push({
        id: i,
        jpgPath: `/images/${i}.jpg`,
        jpegPath: `/images/${i}.jpeg`,
        currentPath: `/images/${i}.jpeg`, // Start with .jpeg for 12-44
        label: `Gallery Image ${i}`,
        extension: 'jpeg',
        isBackendImage: false
      });
    }
    
    return localImages;
  };

  const localImages = generateLocalImages();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        // Try to fetch from backend first (admin uploaded images)
        const res = await fetch(`${API_BASE_URL}/gallery/`);
        if (res.ok) {
          const backendImages = await res.json();
          // If backend has images, combine them with local images
          if (backendImages.length > 0) {
            console.log(`Found ${backendImages.length} admin-uploaded images`);
            
            // Format backend images to match our structure
            const formattedBackendImages = backendImages.map((img: any, index: number) => ({
              id: `backend-${img.id || index}`,
              image: img.image_url || img.image,
              label: img.title || `Admin Upload ${index + 1}`,
              isBackendImage: true
            }));
            
            // Combine backend images with local images
            setImages([...formattedBackendImages, ...localImages]);
            setUseBackendImages(true);
          } else {
            // No backend images, just use local
            setImages(localImages);
          }
        } else {
          // Backend failed, just use local images
          console.warn('Backend gallery fetch failed, using local images only');
          setImages(localImages);
        }
      } catch (e) {
        console.warn('Backend offline, using local gallery images only.');
        setImages(localImages);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGallery();
  }, []);

  // Handle image error with extension fallback
  const handleImageError = (img: any, e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const currentSrc = target.src;
    
    // For backend images, just show placeholder if they fail
    if (img.isBackendImage) {
      console.log(`Backend image failed: ${img.id}`);
      target.src = `https://via.placeholder.com/400x300/1e293b/64748b?text=Admin+Image`;
      target.onerror = null;
      return;
    }
    
    // For local images, try extension fallback
    const imageId = img.id;
    const failedJpg = failedImages.has(`${imageId}-jpg`);
    const failedJpeg = failedImages.has(`${imageId}-jpeg`);
    
    // If current src ends with .jpg and we haven't tried .jpeg yet
    if (currentSrc.includes('.jpg') && !failedJpeg) {
      console.log(`Image ${imageId}: .jpg failed, trying .jpeg`);
      target.src = `/images/${imageId}.jpeg`;
      setFailedImages(prev => new Set(prev).add(`${imageId}-jpg`));
    }
    // If current src ends with .jpeg and we haven't tried .jpg yet
    else if (currentSrc.includes('.jpeg') && !failedJpg) {
      console.log(`Image ${imageId}: .jpeg failed, trying .jpg`);
      target.src = `/images/${imageId}.jpg`;
      setFailedImages(prev => new Set(prev).add(`${imageId}-jpeg`));
    }
    // Both extensions failed, show placeholder with image number
    else {
      console.log(`Image ${imageId}: both extensions failed, using placeholder`);
      target.src = `https://via.placeholder.com/400x300/1e293b/64748b?text=Image+${imageId}`;
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
          {/* REMOVED: The empty conditional that was causing the error */}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {images.map((img) => {
              // Determine the image source
              let imageSrc;
              if (img.isBackendImage) {
                imageSrc = img.image; // Backend image URL
              } else {
                // Local image - use the appropriate path based on ID
                imageSrc = img.currentPath || (img.id <= 11 ? `/images/${img.id}.jpg` : `/images/${img.id}.jpeg`);
              }
              
              return (
                <div 
                  key={img.id} 
                  className="relative rounded-xl overflow-hidden glass border border-white/10 group break-inside-avoid shadow-lg animate-fadeIn hover:shadow-blue-500/20 transition-shadow duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={imageSrc}
                      alt={img.label || `Gallery Image ${img.id}`}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => handleImageError(img, e)}
                    />
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-500" />
                  </div>
                  {img.isBackendImage && (
                    <div className="absolute top-2 right-2 bg-blue-600/80 text-white text-[8px] px-1.5 py-0.5 rounded">
                      Admin
                    </div>
                  )}
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