import React, { useState, useEffect } from 'react';
import { BMKRequest, Track, Priority } from '../types.ts';
import { XMarkIcon, SparklesIcon } from './icons.tsx';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRequest: (requestData: Partial<BMKRequest>) => void;
  initialData: Partial<BMKRequest>;
}

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ isOpen, onClose, onCreateRequest, initialData }) => {
  const [formData, setFormData] = useState<Partial<BMKRequest>>({});

  useEffect(() => {
    if (isOpen) {
        setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRequest(formData);
    onClose();
  };

  const inputClasses = "mt-1 block w-full text-base bg-gray-100/80 rounded-lg border-gray-300 placeholder-gray-500 focus:ring-1 focus:ring-blue focus:border-blue transition";

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-white/30"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-gray-200/80 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-blue" />
            Confirm New Request
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="p-6 overflow-y-auto space-y-4">
                 <div className="bg-blue/10 p-4 rounded-lg text-sm text-blue-800 border border-blue/20">
                    Gemini AI has drafted this request based on the source communication. Please review and edit before creating.
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" id="title" value={formData.title || ''} onChange={handleInputChange} className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" rows={4} value={formData.description || ''} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="stakeholder" className="block text-sm font-medium text-gray-700">Stakeholder</label>
                    <input type="text" name="stakeholder" id="stakeholder" value={formData.stakeholder || ''} onChange={handleInputChange} className={inputClasses} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="track" className="block text-sm font-medium text-gray-700">Function</label>
                        <select id="track" name="track" value={formData.track || ''} onChange={handleInputChange} className={inputClasses}>
                            {Object.values(Track).map(track => <option key={track} value={track}>{track}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <select id="priority" name="priority" value={formData.priority || ''} onChange={handleInputChange} className={inputClasses}>
                            {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <footer className="mt-auto p-4 bg-gray-50/80 border-t border-gray-200/80 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue hover:opacity-90 disabled:opacity-40 transition"
                >
                    Create Request
                </button>
            </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestModal;
