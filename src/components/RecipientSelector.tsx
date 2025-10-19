import React, { useState, useEffect, useRef } from "react";
import { Users, GraduationCap, Trash2, Search, X } from "lucide-react";
import { TEMP_STUDENTS, TEMP_FACULTY, Student, Faculty, Recipient } from "@/data/tempEmailData";

interface RecipientSelectorProps {
  selectedRecipients: Recipient[];
  setSelectedRecipients: React.Dispatch<React.SetStateAction<Recipient[]>>;
}

const RecipientSelector: React.FC<RecipientSelectorProps> = ({ 
  selectedRecipients, 
  setSelectedRecipients 
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty'>('students');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [students] = useState<Student[]>(TEMP_STUDENTS);
  const [faculty] = useState<Faculty[]>(TEMP_FACULTY);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(TEMP_STUDENTS);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>(TEMP_FACULTY);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-fade-in");
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'students') {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      const filtered = faculty.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaculty(filtered);
    }
  }, [searchTerm, activeTab, students, faculty]);

  const addRecipient = (recipient: Recipient) => {
    if (!selectedRecipients.find(r => r.email === recipient.email)) {
      setSelectedRecipients([...selectedRecipients, recipient]);
    }
  };

  const removeRecipient = (email: string) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.email !== email));
  };

  const addAllFiltered = () => {
    const recipientsToAdd = activeTab === 'students'
      ? filteredStudents.map(s => ({ name: s.name, email: s.email }))
      : filteredFaculty.map(f => ({ name: f.name, email: f.email }));

    const newRecipients = recipientsToAdd.filter(
      newR => !selectedRecipients.find(r => r.email === newR.email)
    );

    setSelectedRecipients([...selectedRecipients, ...newRecipients]);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50 animate-on-scroll"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Select Recipients
          </h2>
          <p className="text-gray-600 text-lg">
            Choose students or faculty members to send your email
          </p>
        </div>

        {/* Selected Recipients Summary */}
        {selectedRecipients.length > 0 && (
          <div className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Selected Recipients ({selectedRecipients.length})
              </h3>
              <button
                onClick={() => setSelectedRecipients([])}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedRecipients.map((recipient) => (
                <div
                  key={recipient.email}
                  className="bg-white px-4 py-2 rounded-lg border border-blue-300 flex items-center gap-2 group hover:border-blue-500 transition-colors"
                >
                  <span className="text-sm text-gray-700">{recipient.name}</span>
                  <button
                    onClick={() => removeRecipient(recipient.email)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))} 
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <GraduationCap size={24} />
            Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
              activeTab === 'faculty'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <Users size={24} />
            Faculty ({faculty.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={addAllFiltered}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            Add All Filtered
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'students' ? (
              filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {student.department} • {student.class} {student.division} • Roll: {student.rollNo}
                      </p>
                    </div>
                    <button
                      onClick={() => addRecipient({ name: student.name, email: student.email })}
                      disabled={selectedRecipients.some(r => r.email === student.email)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedRecipients.some(r => r.email === student.email)
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {selectedRecipients.some(r => r.email === student.email) ? 'Added' : 'Add'}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No students found
                </div>
              )
            ) : (
              filteredFaculty.length > 0 ? (
                filteredFaculty.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{f.name}</h4>
                      <p className="text-sm text-gray-600">{f.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {f.designation} • {f.department} • ID: {f.collegeId}
                      </p>
                    </div>
                    <button
                      onClick={() => addRecipient({ name: f.name, email: f.email })}
                      disabled={selectedRecipients.some(r => r.email === f.email)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedRecipients.some(r => r.email === f.email)
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {selectedRecipients.some(r => r.email === f.email) ? 'Added' : 'Add'}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No faculty found
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipientSelector;