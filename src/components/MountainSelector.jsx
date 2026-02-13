import React, { useState } from 'react';
import { mountains } from '../data/mountains';

const MountainSelector = ({ selectedMountain, onSelectMountain }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMountains = mountains.filter(m =>
        m.name.includes(searchTerm) || m.location.includes(searchTerm)
    );

    return (
        <div className="relative w-full max-w-sm mx-auto mb-6 z-50">
            <div
                className="bg-white/30 backdrop-blur-md rounded-lg p-3 text-white cursor-pointer flex justify-between items-center shadow-md border border-white/40"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-lg">{selectedMountain.name}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl max-h-80 overflow-y-auto text-gray-800 p-2">
                    <input
                        type="text"
                        placeholder="산 이름 또는 지역 검색"
                        className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <ul>
                        {filteredMountains.map(mountain => (
                            <li
                                key={mountain.id}
                                className={`p-2 hover:bg-blue-100 cursor-pointer rounded-md ${selectedMountain.id === mountain.id ? 'bg-blue-50 font-bold text-blue-600' : ''}`}
                                onClick={() => {
                                    onSelectMountain(mountain);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{mountain.name}</span>
                                    <span className="text-xs text-gray-500">{mountain.location} | {mountain.height}</span>
                                </div>
                            </li>
                        ))}
                        {filteredMountains.length === 0 && (
                            <li className="p-2 text-center text-gray-500">검색 결과가 없습니다.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MountainSelector;
