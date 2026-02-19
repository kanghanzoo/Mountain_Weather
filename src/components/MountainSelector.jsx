import { useState, useRef, useEffect } from 'react';
import { mountains } from '../data/mountains';

const CustomMountainSelector = ({ selectedMountain, onSelectMountain }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const filteredMountains = mountains.filter(m =>
        m.name.includes(searchTerm) || m.location.includes(searchTerm)
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        // Removed padding to allow parent to control spacing
        <div className="relative w-full pointer-events-auto" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-[#1f1f1f]/95 backdrop-blur-md text-white border border-white/20 rounded-2xl px-5 py-3 shadow-2xl hover:bg-[#2a2a2a] transition-all ring-1 ring-white/10"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold tracking-tight">⛰️ {selectedMountain.name}</span>
                    <span className="text-sm text-gray-400 font-normal">({selectedMountain.location})</span>
                </div>
                <span className={`text-gray-400 text-lg transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Dropdown Menu - Floating with margin */}
            {isOpen && (
                <div className="absolute top-[calc(100%-8px)] left-4 right-4 max-h-[400px] bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[9999] mt-2 ring-1 ring-black/50">
                    {/* Search */}
                    <div className="p-3 border-b border-white/10 bg-white/5">
                        <input
                            type="text"
                            placeholder="산 이름 검색..."
                            className="w-full bg-black/30 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-white/30 placeholder-gray-500 text-base outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredMountains.map(m => (
                            <button
                                key={m.id}
                                onClick={() => {
                                    onSelectMountain(m);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                                className={`w-full text-left px-5 py-3 hover:bg-white/10 transition-colors flex items-center gap-2 border-b border-white/5 last:border-0 ${selectedMountain.id === m.id ? 'bg-white/20' : ''}`}
                            >
                                <span className="font-bold text-white text-base">{m.name}</span>
                                <span className="text-gray-400 text-xs">({m.location})</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomMountainSelector;
