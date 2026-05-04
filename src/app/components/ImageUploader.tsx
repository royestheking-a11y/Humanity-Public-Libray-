import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "motion/react";
import { 
  UploadCloud, X, Check, ZoomIn, ZoomOut, 
  Image as ImageIcon, Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { getCroppedImg } from "../utils/cropUtils";
import { api } from "../services/api";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  aspect?: number;
  label?: string;
  className?: string;
}

export default function ImageUploader({ 
  value, 
  onChange, 
  aspect = 3 / 4, 
  label = "Upload Image",
  className = "" 
}: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image || !croppedAreaPixels) return;

    setIsUploading(true);
    const toastId = toast.loading("Processing image...");

    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
      if (!croppedImageBlob) throw new Error("Cropping failed");

      const file = new File([croppedImageBlob], "upload.jpg", { type: "image/jpeg" });
      
      toast.loading("Uploading to cloud...", { id: toastId });
      const { url } = await api.upload(file);
      
      onChange(url);
      setShowCropper(false);
      setImage(null);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      
      <div className="flex gap-3 items-start">
        <div className="relative group overflow-hidden rounded-xl border border-gray-100 bg-gray-50 w-24 h-32 flex-shrink-0">
          {value ? (
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover transition-transform group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <ImageIcon size={24} />
              <span className="text-[10px] mt-1">No Image</span>
            </div>
          )}
          
          <label className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <UploadCloud size={20} className="text-white" />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste image URL here..."
            className="w-full px-3 py-2 rounded-xl text-sm outline-none border border-gray-200 focus:border-[#2563EB] transition-colors"
          />
          <p className="text-[10px] text-gray-400 italic">
            Tip: You can upload a file or paste a direct image URL.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showCropper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Crop & Zoom Image</h3>
                <button 
                  onClick={() => setShowCropper(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative h-80 bg-gray-900">
                <Cropper
                  image={image!}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <ZoomOut size={18} className="text-gray-400" />
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <ZoomIn size={18} className="text-gray-400" />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCropper(false)}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Apply & Upload
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
