import React, { useState, useEffect } from 'react';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create an array of 44 images (1-44)
  const generateLocalImages = () => {
    const localImages = [];
    for (let i = 1; i <= 44; i++) {
      localImages.push({
        id: i,
        image: `/images/${i}.jpg`
      });
    }
    return localImages;
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        // Try to fetch from backend first
        const res = await fetch('http://127.0.0.1:8000/api/gallery/');
        if (res.ok) {
          const backendImages = await res.json();
          // If backend has images, use them, otherwise use local images
          if (backendImages.length > 0) {
            setImages(backendImages);
          } else {
            setImages(generateLocalImages());
          }
        } else {
          // If backend fails, use local images
          setImages(generateLocalImages());
        }
      } catch (e) {
        console.warn('Backend offline, using local gallery images.');
        // Always fallback to local images
        setImages(generateLocalImages());
      } finally {
        setLoading(false);
      }
    };
    
    fetchGallery();
  }, []);

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
            {images.map((img) => (
              <div key={img.id} className="relative rounded-xl overflow-hidden glass border border-white/10 group break-inside-avoid shadow-lg animate-fadeIn hover:shadow-blue-500/20 transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={img.image} 
                    alt="Gallery Image" 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      // If image fails to load, show a placeholder
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300/1e293b/64748b?text=Gallery+Image`;
                    }}
                  />
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;