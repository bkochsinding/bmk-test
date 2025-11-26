import React, { useState } from 'react';
import { BMKRequest, Track, Priority, User } from '../types.ts';
// Fix: Add ChevronRightIcon to imports from icons.tsx
import { XMarkIcon, BuildingOffice2Icon, UserIcon, ChevronLeftIcon, ChevronRightIcon } from './icons.tsx';

interface RequestTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRequest: (requestData: Partial<BMKRequest>) => void;
  users: User[];
  trackOwners: Record<Track, { owner: string; [key: string]: any }>;
}

const CalendarPicker: React.FC<{ onDateSelect: (date: string) => void, selectedDate?: string}> = ({ onDateSelect, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    const today = new Date();

    return (
        <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-4 px-2">
                <button type="button" onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="h-5 w-5" /></button>
                <h3 className="text-base font-semibold">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <button type="button" onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-medium mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => {
                    const dateStr = d.toISOString().split('T')[0];
                    const isSelected = dateStr === selectedDate;
                    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                    const isToday = d.toDateString() === today.toDateString();
                    return (
                        <button
                            type="button"
                            key={i}
                            onClick={() => onDateSelect(dateStr)}
                            className={`w-10 h-10 rounded-full text-sm transition-colors ${
                                isSelected ? 'bg-blue text-white' : 
                                isToday ? 'bg-gray-200 text-gray-800' : 
                                isCurrentMonth ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                        >
                            {d.getDate()}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}


const RequestTaskModal: React.FC<RequestTaskModalProps> = ({ isOpen, onClose, onCreateRequest, users, trackOwners }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BMKRequest>>({
    title: '',
    description: '',
    priority: Priority.Medium,
    track: Track.Tech,
  });
  const [assigneeType, setAssigneeType] = useState<'function' | 'stakeholder'>('function');

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    let finalData = { ...formData };
    
    if (assigneeType === 'function' && finalData.track) {
        finalData.corporateRef = trackOwners[finalData.track].owner;
        finalData.stakeholder = finalData.track;
    } else {
      finalData.corporateRef = finalData.stakeholder;
    }
    
    onCreateRequest(finalData);
    // Reset for next time
    setStep(1);
    setFormData({
        title: '', description: '', priority: Priority.Medium, track: Track.Tech,
    });
    onClose();
  };

  const isStep1Valid = formData.title && formData.title.trim() !== '';
  const isStep2Valid = (assigneeType === 'function' && formData.track) || (assigneeType === 'stakeholder' && formData.stakeholder);
  const isStep3Valid = formData.timeline;
  
  const inputClasses = "mt-1 block w-full text-base bg-gray-100/80 rounded-lg border-gray-300 placeholder-gray-500 focus:ring-1 focus:ring-blue focus:border-blue transition";


  const renderStepContent = () => {
      switch(step) {
          case 1:
              return (
                  <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">What is the request?</h3>
                      <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className={inputClasses} required placeholder="e.g., Automate Financial Report"/>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleInputChange} className={inputClasses} placeholder="Provide details about the request..."/>
                        </div>
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                             <select id="priority" name="priority" value={formData.priority} onChange={handleInputChange} className={inputClasses}>
                                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                      </div>
                  </div>
              );
          case 2:
              return (
                   <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">Who is this for?</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                          <button type="button" onClick={() => setAssigneeType('function')} className={`p-4 rounded-lg border-2 transition-colors ${assigneeType === 'function' ? 'border-blue bg-blue/10' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                              <BuildingOffice2Icon className={`h-8 w-8 mx-auto mb-2 ${assigneeType === 'function' ? 'text-blue' : 'text-gray-500'}`} />
                              <span className="font-semibold text-gray-800">A Function</span>
                          </button>
                           <button type="button" onClick={() => setAssigneeType('stakeholder')} className={`p-4 rounded-lg border-2 transition-colors ${assigneeType === 'stakeholder' ? 'border-blue bg-blue/10' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                              <UserIcon className={`h-8 w-8 mx-auto mb-2 ${assigneeType === 'stakeholder' ? 'text-blue' : 'text-gray-500'}`} />
                              <span className="font-semibold text-gray-800">A Stakeholder</span>
                          </button>
                      </div>
                       {assigneeType === 'function' ? (
                            <div>
                                <label htmlFor="track" className="block text-sm font-medium text-gray-700">Function</label>
                                <select id="track" name="track" value={formData.track} onChange={handleInputChange} className={inputClasses}>
                                    {Object.values(Track).map(track => <option key={track} value={track}>{track}</option>)}
                                </select>
                            </div>
                       ) : (
                            <div>
                                <label htmlFor="stakeholder" className="block text-sm font-medium text-gray-700">Stakeholder</label>
                                <select id="stakeholder" name="stakeholder" value={formData.stakeholder} onChange={handleInputChange} className={inputClasses}>
                                    <option value="">Select a stakeholder</option>
                                    {users.map(user => <option key={user.email} value={user.email}>{user.email}</option>)}
                                </select>
                            </div>
                       )}
                  </div>
              )
          case 3:
              return (
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">When is it needed by?</h3>
                    <CalendarPicker onDateSelect={(date) => setFormData(prev => ({...prev, timeline: date}))} selectedDate={formData.timeline} />
                  </div>
              )
      }
  }

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-white/30" onClick={e => e.stopPropagation()}>
            <header className="p-4 border-b border-gray-200/80 flex items-center">
                {step > 1 && (
                    <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100 mr-2">
                        <ChevronLeftIcon className="h-5 w-5 text-gray-600"/>
                    </button>
                )}
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">Request a Task</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </header>
            <div className="w-full bg-gray-200 h-1 rounded-full">
                <div className="bg-blue h-1 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
                {renderStepContent()}
            </div>

            <footer className="p-4 bg-gray-50/80 border-t border-gray-200/80 flex justify-end gap-3">
                 <button onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 hover:bg-gray-50">Cancel</button>
                {step < 3 ? (
                    <button onClick={handleNext} disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)} className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue hover:opacity-90 disabled:opacity-50">Next</button>
                ) : (
                    <button onClick={handleSubmit} disabled={!isStep3Valid} className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue hover:opacity-90 disabled:opacity-50">Submit Request</button>
                )}
            </footer>
        </div>
    </div>
  );
};

export default RequestTaskModal;