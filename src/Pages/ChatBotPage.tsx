import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Image, 
  Upload, 
  X, 
  Sparkles,
  FileImage,
  Trash2,
  Download,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  images?: string[];
}

interface GeneratedImage {
  angle: string;
  stored_filename: string;
  url: string;
  content_type: string;
  size: number;
}

interface GenerateResponse {
  prompt: string;
  model_used: string;
  images: GeneratedImage[];
  prompt_tokens: number;
  candidates_tokens: number;
  total_tokens: number;
}

export default function ChatBotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Салом! Мен сизга ёрдам бериш учун шу ердаман. Савол беринг ёки сурат юборинг.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosters, setGeneratedPosters] = useState<GeneratedImage[]>([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [expandedPoster, setExpandedPoster] = useState<string | null>(null);
  
  const [posterForm, setPosterForm] = useState({
    prompt: '',
    product_name: '',
    product_type: '',
    description: '',
    theme: 'modern'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterFileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_URL;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole') || localStorage.getItem('role');
    setIsAuthenticated(!!token);
    setUserRole(role);
    
    if (!token) {
      navigate({ to: '/login' });
    }
  }, [navigate]);

  const isSuperAdmin = userRole === 'superAdmin' || userRole === 'superadmin';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getFullImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/files/')) {
      return `${API_BASE_URL}${imageUrl}`;
    }
    return `${API_BASE_URL}/files/${imageUrl}`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && selectedImages.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim() || '📷 Сурат юборилди',
      sender: 'user',
      timestamp: new Date(),
      images: imagePreviews.length > 0 ? imagePreviews : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      
      if (selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach(file => {
          formData.append('files', file);
        });
        formData.append('question', inputMessage.trim() || 'Суратни тахлил қилинг');

        const response = await axios.post(
          `${API_URL}/chatbot/ask-with-images`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.answer || 'Сурат тахлил қилинди.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        
        setSelectedImages([]);
        setImagePreviews([]);
      } else {
        const response = await axios.post(
          `${API_URL}/chatbot/ask`,
          {
            question: inputMessage.trim(),
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.answer || 'Саволга жавоб топилмади.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error.response?.data?.message || 'Хатолик юз берди. Қайта уриниб кўринг.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.slice(0, 4);
    setSelectedImages(validFiles);

    const previews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGeneratePoster = async () => {
    if (!posterForm.prompt.trim()) {
      alert('Промптни киритинг!');
      return;
    }

    setIsGenerating(true);
    setGeneratedPosters([]);

    try {
      const token = localStorage.getItem('accessToken');
      
      let response;
      if (selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach(file => {
          formData.append('files', file);
        });
        formData.append('prompt', posterForm.prompt);
        formData.append('product_name', posterForm.product_name || '');
        formData.append('product_type', posterForm.product_type || '');
        formData.append('description', posterForm.description || '');
        formData.append('theme', posterForm.theme || 'modern');

        response = await axios.post<GenerateResponse>(
          `${API_URL}/chatbot/generate-image-file`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        response = await axios.post<GenerateResponse>(
          `${API_URL}/chatbot/generate-image-file`,
          {
            prompt: posterForm.prompt,
            product_name: posterForm.product_name || undefined,
            product_type: posterForm.product_type || undefined,
            description: posterForm.description || undefined,
            theme: posterForm.theme || 'modern',
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (response.data.images) {
        const imagesWithFullUrl = response.data.images.map(img => ({
          ...img,
          url: getFullImageUrl(img.url)
        }));
        setGeneratedPosters(imagesWithFullUrl);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `✅ Постер генерацияланди! ${response.data.images.length} та сурат яратилди.`,
          sender: 'bot',
          timestamp: new Date(),
          images: imagesWithFullUrl.map(img => img.url),
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error: any) {
      console.error('Generate poster error:', error);
      alert(error.response?.data?.message || 'Постер генерацияланмади. Қайта уриниб кўринг.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPosterForm = () => {
    setPosterForm({
      prompt: '',
      product_name: '',
      product_type: '',
      description: '',
      theme: 'modern'
    });
    setSelectedImages([]);
    setImagePreviews([]);
    setGeneratedPosters([]);
    setShowGenerator(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePosterImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.slice(0, 4);
    setSelectedImages(validFiles);

    const previews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removePosterImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (posterFileInputRef.current) {
      posterFileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAE7C9] pt-20 pb-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-[#706233] text-[#FAE7C9] px-6 py-2 rounded-full mb-4">
            <Bot size={24} />
            <span className="font-bold">AI Assistant</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#706233]">
            Сайт-бот
          </h1>
          <p className="text-[#8B7A5A] mt-2">
            Савол беринг ёки сурат юборинг
          </p>
        </motion.div>

        {/* Кнопки управления */}
        <div className="flex flex-wrap gap-3 mb-6">
          {isSuperAdmin && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowGenerator(!showGenerator)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                showGenerator 
                  ? 'bg-[#706233] text-[#FAE7C9]' 
                  : 'bg-white/80 text-[#706233] border-2 border-[#706233]'
              }`}
            >
              <Sparkles size={18} />
              {showGenerator ? '✕ Чатга қайтиш' : '🎨 Постер генерациялаш'}
            </motion.button>
          )}
          
          {selectedImages.length > 0 && !showGenerator && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedImages([]);
                setImagePreviews([]);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-600 border-2 border-red-200 font-medium"
            >
              <Trash2 size={18} />
              Суратларни тозалаш ({selectedImages.length})
            </motion.button>
          )}
        </div>

        {/* Генератор постера */}
        <AnimatePresence>
          {showGenerator && isSuperAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-[#706233]/10">
                <h3 className="text-xl font-bold text-[#706233] mb-2 flex items-center gap-2">
                  <Sparkles size={24} className="text-[#706233]" />
                  🎨 Постер генерациялаш
                </h3>
                <p className="text-[#8B7A5A] text-sm mb-4">
                  Маҳсулот постере учун промпт ёзинг ва ихтиёрий равишда 4 тагача сурат юборинг
                </p>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Промпт (масалан: Make an eye-catching product advertisement poster...)"
                    value={posterForm.prompt}
                    onChange={(e) => setPosterForm({ ...posterForm, prompt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#E8DDD0] focus:border-[#706233] outline-none transition-colors bg-white"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Маҳсулот номи"
                      value={posterForm.product_name}
                      onChange={(e) => setPosterForm({ ...posterForm, product_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#E8DDD0] focus:border-[#706233] outline-none transition-colors bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Маҳсулот тури"
                      value={posterForm.product_type}
                      onChange={(e) => setPosterForm({ ...posterForm, product_type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#E8DDD0] focus:border-[#706233] outline-none transition-colors bg-white"
                    />
                  </div>

                  <textarea
                    placeholder="Тавсиф (ихтиёрий)"
                    value={posterForm.description}
                    onChange={(e) => setPosterForm({ ...posterForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#E8DDD0] focus:border-[#706233] outline-none transition-colors bg-white resize-none"
                  />

                  <select
                    value={posterForm.theme}
                    onChange={(e) => setPosterForm({ ...posterForm, theme: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#E8DDD0] focus:border-[#706233] outline-none transition-colors bg-white"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="luxury">Luxury</option>
                    <option value="creative">Creative</option>
                  </select>

                  <div>
                    <input
                      ref={posterFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePosterImageSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => posterFileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#706233]/30 hover:border-[#706233] transition-colors bg-white/50"
                    >
                      <Upload size={18} className="text-[#706233]" />
                      <span className="text-[#706233]">Суратларни танлаш ({selectedImages.length}/4)</span>
                    </button>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={preview} 
                            alt={`Preview ${index}`} 
                            className="w-20 h-20 object-cover rounded-xl border-2 border-[#E8DDD0]"
                          />
                          <button
                            onClick={() => removePosterImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGeneratePoster}
                    disabled={isGenerating}
                    className="w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-[#706233] text-[#FAE7C9] disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        ГЕНЕРАЦИЯЛАНМОҚДА...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        🎨 ПОСТЕР ГЕНЕРАЦИЯЛАШ
                      </>
                    )}
                  </motion.button>
                </div>

                {generatedPosters.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <h4 className="font-semibold text-[#706233] mb-3 flex items-center gap-2">
                      <FileImage size={18} />
                      ГЕНЕРАЦИЯЛАНГАН ПОСТЕРЛАР:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {generatedPosters.map((img, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative group"
                        >
                          <img 
                            src={img.url} 
                            alt={`Poster ${index + 1}`} 
                            className="w-full aspect-square object-cover rounded-xl border-2 border-[#E8DDD0] cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => setExpandedPoster(expandedPoster === img.url ? null : img.url)}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <a
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <Eye size={16} className="text-[#706233]" />
                            </a>
                            <a
                              href={img.url}
                              download
                              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <Download size={16} className="text-[#706233]" />
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setGeneratedPosters([])}
                      className="mt-3 text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Постерларни тозалаш
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Чат */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 rounded-2xl shadow-lg border border-[#706233]/10 overflow-hidden"
        >
          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' 
                      ? 'bg-[#706233]' 
                      : 'bg-[#E8DDD0]'
                  }`}>
                    {msg.sender === 'user' ? (
                      <User size={16} className="text-[#FAE7C9]" />
                    ) : (
                      <Bot size={16} className="text-[#706233]" />
                    )}
                  </div>
                  <div>
                    <div className={`px-4 py-2.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-[#706233] text-[#FAE7C9]'
                        : 'bg-[#F5F0E8] text-[#706233]'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {msg.images && msg.images.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {msg.images.map((img, index) => {
                          const fullUrl = getFullImageUrl(img);
                          return (
                            <a
                              key={index}
                              href={fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={fullUrl}
                                alt={`Image ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-lg border-2 border-[#E8DDD0] hover:shadow-md transition-shadow"
                              />
                            </a>
                          );
                        })}
                      </div>
                    )}
                    <div className={`text-xs text-[#8B7A5A]/50 mt-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      {msg.timestamp.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-2 bg-[#F5F0E8] px-4 py-2.5 rounded-2xl">
                  <Loader2 size={16} className="animate-spin text-[#706233]" />
                  <span className="text-[#706233] text-sm">Ёзяпти...</span>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Image previews in chat */}
          {imagePreviews.length > 0 && !showGenerator && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap border-t border-[#E8DDD0] pt-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-[#E8DDD0]"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-[#E8DDD0] p-3 flex gap-2 items-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl hover:bg-[#F5F0E8] transition-colors flex-shrink-0"
              title="Сурат юбориш (максимум 4 та)"
            >
              <Image size={20} className="text-[#706233]" />
            </button>
            
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Хабар ёзинг..."
              rows={1}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#E8DDD0] focus:border-[#706233] outline-none transition-colors resize-none bg-white min-h-[44px] max-h-[120px]"
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && selectedImages.length === 0) || isLoading}
              className="p-2.5 rounded-xl bg-[#706233] text-[#FAE7C9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-[#8B7A5A]/50">
          🤖 AI ёрдамчиси • Сурат юбориш мумкин (4 тагача)
          {isSuperAdmin && ' • 🎨 Постер генерациялаш'}
        </div>
      </div>

      {/* Expanded image modal */}
      <AnimatePresence>
        {expandedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setExpandedPoster(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={expandedPoster}
                alt="Expanded poster"
                className="w-full h-full object-contain rounded-xl"
              />
              <button
                onClick={() => setExpandedPoster(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X size={24} />
              </button>
              <a
                href={expandedPoster}
                download
                className="absolute bottom-4 right-4 p-2 bg-white rounded-full text-[#706233] hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Download size={20} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}