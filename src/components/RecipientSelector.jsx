import React, { useState, useEffect, useRef } from "react";
import { Users, GraduationCap, Trash2, Search, X } from "lucide-react";
import { TEMP_STUDENTS, TEMP_FACULTY } from "@/data/tempEmailData";

const RecipientSelector = ({ selectedRecipients, setSelectedRecipients }) => {
  const [recipientType, setRecipientType] = useState('students');
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeselect, setShowDeselect] = useState(false);
  const sectionRef = useRef(null);

  // Load temporary data
  useEffect(() => {
    setStudents(TEMP_STUDENTS);
    setFaculty(TEMP_FACULTY);
  }, []);

  const currentList = recipientType === 'students' ? students : faculty;

  const handleSelectAll = () => {
    const newRecipients = currentList.map(person => ({
      ...person,
      type: recipientType
    }));
    setSelectedRecipients([...selectedRecipients, ...newRecipients.filter(
      newRecip => !selectedRecipients.some(existing => existing.id === newRecip.id)
    )]);
  };

  const handleRemoveRecipient = (id) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.id !== id));
  };

  const filteredList = currentList.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recipientType === 'students' ? person.roll_no : person.faculty_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedFromCurrentList = selectedRecipients.filter(r => r.type === recipientType);

  return (
    <section ref={sectionRef} className="w-full py-8 sm:py-12 bg-gray-50" id="recipients">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">01</span>
            <span>Select Recipients</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant bg-white">
            {/* Type Selector */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => setRecipientType('students')}
                  className={`
                    px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2
                    ${recipientType === 'students' 
                      ? 'bg-pulse-500 text-white shadow-lg scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <GraduationCap className="w-5 h-5" />
                  Students ({students.length})
                </button>
                <button
                  onClick={() => setRecipientType('faculty')}
                  className={`
                    px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2
                    ${recipientType === 'faculty' 
                      ? 'bg-pulse-500 text-white shadow-lg scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <Users className="w-5 h-5" />
                  Faculty ({faculty.length})
                </button>
              </div>

              {/* Search and Select All */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${recipientType}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSelectAll}
                  className="px-6 py-3 bg-pulse-500 hover:bg-pulse-600 text-white font-semibold rounded-xl transition-colors duration-300"
                >
                  Select All {recipientType}
                </button>
                {selectedRecipients.length > 0 && (
                  <button
                    onClick={() => setShowDeselect(true)}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-300 flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Deselect ({selectedRecipients.length})
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="p-6 sm:p-8 max-h-96 overflow-y-auto">
              {filteredList.length > 0 ? (
                <div className="space-y-3">
                  {filteredList.map((person) => {
                    const isSelected = selectedRecipients.some(r => r.id === person.id);
                    return (
                      <div
                        key={person.id}
                        className={`
                          p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                          ${isSelected 
                            ? 'border-pulse-500 bg-pulse-50' 
                            : 'border-gray-200 hover:border-pulse-300 bg-white'
                          }
                        `}
                        onClick={() => {
                          if (isSelected) {
                            handleRemoveRecipient(person.id);
                          } else {
                            setSelectedRecipients([...selectedRecipients, { ...person, type: recipientType }]);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{person.name}</h4>
                            <p className="text-sm text-gray-600">{person.email}</p>
                            <div className="flex gap-4 mt-1">
                              <span className="text-xs text-gray-500">
                                {recipientType === 'students' ? `Roll: ${person.roll_no}` : `ID: ${person.faculty_id}`}
                              </span>
                              <span className="text-xs text-gray-500">
                                {person.department}
                              </span>
                              {recipientType === 'faculty' && (
                                <span className="text-xs text-pulse-600 font-medium">
                                  {person.designation}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                            ${isSelected ? 'border-pulse-500 bg-pulse-500' : 'border-gray-300'}
                          `}>
                            {isSelected && (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No {recipientType} found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deselect Modal */}
      {showDeselect && (
        <DeselectModal
          recipients={selectedRecipients}
          onRemove={handleRemoveRecipient}
          onClose={() => setShowDeselect(false)}
        />
      )}
    </section>
  );
};

const DeselectModal = ({ recipients, onRemove, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipients = recipients.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-2xl font-display font-bold">Selected Recipients ({recipients.length})</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {filteredRecipients.map((recipient) => (
              <div key={recipient.id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{recipient.name}</h4>
                  <p className="text-sm text-gray-600">{recipient.email}</p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs text-gray-500">
                      {recipient.type === 'students' ? `Roll: ${recipient.roll_no}` : `ID: ${recipient.faculty_id}`}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-pulse-100 text-pulse-600 rounded-full">
                      {recipient.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(recipient.id)}
                  className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientSelector;