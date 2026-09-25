import { Upload, Sparkles } from 'lucide-react';
import { useState } from 'react';

const Jarvis = () => {
  const [uploaded, setUploaded] = useState(false);
  const [skinTone, setSkinTone] = useState(null);

  const handleFileUpload = () => {
    // Simulate API call
    setUploaded(true);
    setTimeout(() => {
        setSkinTone({
            name: "Warm Ivory",
            hex: "#F5DEB3",
            recommendedColors: [
                { name: 'Olive Green', hex: '#556B2F' },
                { name: 'Burnt Orange', hex: '#CC5500' },
                { name: 'Deep Teal', hex: '#008080' },
                { name: 'Cream', hex: '#FFFDD0' },
            ]
        });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
      <div className="container mx-auto text-center">
        <Sparkles className="mx-auto text-brand-accent h-16 w-16 mb-4" />
        <h1 className="text-5xl md:text-7xl font-primary tracking-widest uppercase">JARVIS</h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Your personal AI stylist. Upload a well-lit photo, and I'll detect your skin tone to recommend the perfect color combinations and outfits for you.</p>

        <div className="mt-12 max-w-xl mx-auto p-8 border-2 border-dashed border-gray-700 rounded-lg">
          {!uploaded ? (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-500 mb-4" />
              <p className="mb-4">Drag & drop your photo here or click to select</p>
              <button onClick={handleFileUpload} className="bg-brand-accent text-white font-bold py-3 px-8 rounded-md hover:bg-opacity-80 transition-all">
                Upload Photo
              </button>
            </div>
          ) : !skinTone ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
              <p className="mt-4 text-lg">Analyzing your profile...</p>
            </div>
          ) : (
             <div className="text-left">
                <h2 className="text-2xl font-bold mb-4">Analysis Complete:</h2>
                <div className="bg-gray-900 p-4 rounded-lg flex items-center space-x-4">
                    <div style={{ backgroundColor: skinTone.hex }} className="w-12 h-12 rounded-full border-2 border-gray-500"></div>
                    <div>
                        <p className="text-gray-400">Detected Skin Tone:</p>
                        <p className="text-xl font-bold">{skinTone.name}</p>
                    </div>
                </div>
                <h3 className="text-xl font-bold mt-8 mb-4">Recommended Colors:</h3>
                <div className="flex flex-wrap gap-4">
                    {skinTone.recommendedColors.map(color => (
                        <div key={color.name} className="flex items-center space-x-2 bg-gray-800 p-2 rounded-md">
                            <div style={{ backgroundColor: color.hex }} className="w-6 h-6 rounded-sm"></div>
                            <span>{color.name}</span>
                        </div>
                    ))}
                </div>
                 <h3 className="text-xl font-bold mt-8 mb-4">Outfit Recommendations:</h3>
                 <p className="text-gray-400">Feature coming soon! Our AI is curating the best looks for you.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jarvis;