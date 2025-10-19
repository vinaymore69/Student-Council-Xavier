// src/components/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { db, storage } from '../config/firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '../hooks/use-toast';
import { User, Competition, Result, FileMetadata } from '../lib/types';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'result' | 'upload'>('result');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [resultForm, setResultForm] = useState({
    eventType: '',
    editionId: '2024',
    competitionId: '',
    isFinal: true,
    notes: '',
    placements: [
      { place: 1, participantUserId: '', participantName: '' },
      { place: 2, participantUserId: '', participantName: '' },
      { place: 3, participantUserId: '', participantName: '' }
    ]
  });

  const [fileUploadForm, setFileUploadForm] = useState({
    file: null as File | null,
    fileName: '',
    eventType: '',
    editionId: '2024',
    competitionId: '',
    tags: [] as string[],
    description: '',
    fileType: 'image' as 'image' | 'document' | 'video'
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (resultForm.eventType) {
      fetchCompetitions(resultForm.eventType, resultForm.editionId);
    }
  }, [resultForm.eventType, resultForm.editionId]);

  useEffect(() => {
    if (fileUploadForm.eventType) {
      fetchCompetitions(fileUploadForm.eventType, fileUploadForm.editionId);
    }
  }, [fileUploadForm.eventType, fileUploadForm.editionId]);

  const fetchCompetitions = async (typeId: string, editionId: string) => {
    try {
      const compsRef = collection(
        db,
        `eventTypes/${typeId}/editions/${editionId}/competitions`
      );
      const snapshot = await getDocs(compsRef);
      const comps = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Competition[];
      setCompetitions(comps);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch competitions',
        variant: 'destructive'
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const usersList = snapshot.docs.map(doc => ({ 
        uid: doc.id, 
        ...doc.data() 
      })) as User[];
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      });
    }
  };

  const handleResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultData: Partial<Result> = {
        competitionId: resultForm.competitionId,
        submittedBy: 'admin', // Static admin for now
        createdAt: serverTimestamp(),
        isFinal: resultForm.isFinal,
        placements: resultForm.placements,
        tallyApplied: false,
        appliedSnapshot: null,
        notes: resultForm.notes
      };

      await addDoc(
        collection(
          db,
          `eventTypes/${resultForm.eventType}/editions/${resultForm.editionId}/competitions/${resultForm.competitionId}/results`
        ),
        resultData
      );

      toast({
        title: 'Success',
        description: 'Result submitted successfully! Tallies will be calculated automatically.'
      });

      // Reset form
      setResultForm({
        ...resultForm,
        competitionId: '',
        notes: '',
        placements: [
          { place: 1, participantUserId: '', participantName: '' },
          { place: 2, participantUserId: '', participantName: '' },
          { place: 3, participantUserId: '', participantName: '' }
        ]
      });
    } catch (error) {
      console.error('Error submitting result:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit result',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!fileUploadForm.file) {
        toast({
          title: 'Error',
          description: 'Please select a file',
          variant: 'destructive'
        });
        return;
      }

      const timestamp = Date.now();
      const fileName = `${fileUploadForm.eventType}/${fileUploadForm.editionId}/${fileUploadForm.competitionId}/${timestamp}_${fileUploadForm.file.name}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, fileUploadForm.file);
      const downloadURL = await getDownloadURL(storageRef);

      const fileMetadata: Partial<FileMetadata> = {
        fileName: fileUploadForm.fileName || fileUploadForm.file.name,
        fileType: fileUploadForm.fileType,
        fileUrl: downloadURL,
        filePath: fileName,
        eventType: fileUploadForm.eventType,
        editionId: fileUploadForm.editionId,
        competitionId: fileUploadForm.competitionId,
        tags: fileUploadForm.tags,
        description: fileUploadForm.description,
        uploadedAt: serverTimestamp(),
        uploadedBy: 'admin' // Static admin for now
      };

      await addDoc(collection(db, 'eventFiles'), fileMetadata);

      toast({
        title: 'Success',
        description: 'File uploaded successfully!'
      });

      // Reset form
      setFileUploadForm({
        file: null,
        fileName: '',
        eventType: '',
        editionId: '2024',
        competitionId: '',
        tags: [],
        description: '',
        fileType: 'image'
      });

      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlacementChange = (index: number, field: string, value: string) => {
    const newPlacements = [...resultForm.placements];
    newPlacements[index] = { ...newPlacements[index], [field]: value };

    if (field === 'participantUserId') {
      const selectedUser = users.find(u => u.uid === value);
      if (selectedUser) {
        newPlacements[index].participantName = selectedUser.name;
      }
    }

    setResultForm({ ...resultForm, placements: newPlacements });
  };

  const addTag = () => {
    if (newTag && !fileUploadForm.tags.includes(newTag)) {
      setFileUploadForm({
        ...fileUploadForm,
        tags: [...fileUploadForm.tags, newTag]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFileUploadForm({
      ...fileUploadForm,
      tags: fileUploadForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>🎯 Admin Dashboard</h1>
        <p>Manage competition results and event files</p>
        <div className="admin-badge">Logged in as: Admin</div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'result' ? 'active' : ''}
          onClick={() => setActiveTab('result')}
        >
          📊 Submit Results
        </button>
        <button
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          📁 Upload Files
        </button>
      </div>

      {activeTab === 'result' && (
        <div className="tab-content">
          <form onSubmit={handleResultSubmit} className="admin-form">
            <h2>Submit Competition Results</h2>

            <div className="form-group">
              <label>Event Type *</label>
              <select
                value={resultForm.eventType}
                onChange={(e) => setResultForm({ ...resultForm, eventType: e.target.value })}
                required
              >
                <option value="">Select Event Type</option>
                <option value="cultural">Cultural (Spandan)</option>
                <option value="sports">Sports (Khel Mahotsav)</option>
                <option value="technical">Technical (Technovation)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Edition Year *</label>
              <input
                type="text"
                value={resultForm.editionId}
                onChange={(e) => setResultForm({ ...resultForm, editionId: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Competition *</label>
              <select
                value={resultForm.competitionId}
                onChange={(e) => setResultForm({ ...resultForm, competitionId: e.target.value })}
                required
                disabled={!resultForm.eventType}
              >
                <option value="">Select Competition</option>
                {competitions.map(comp => (
                  <option key={comp.id} value={comp.competitionId}>
                    {comp.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={resultForm.isFinal}
                  onChange={(e) => setResultForm({ ...resultForm, isFinal: e.target.checked })}
                />
                Mark as Final Result
              </label>
            </div>

            <h3>Placements</h3>
            {resultForm.placements.map((placement, index) => (
              <div key={index} className="placement-group">
                <h4>
                  {placement.place === 1 ? '🥇' : placement.place === 2 ? '🥈' : '🥉'}
                  Place {placement.place}
                </h4>

                <div className="form-row">
                  <div className="form-group">
                    <label>Participant *</label>
                    <select
                      value={placement.participantUserId}
                      onChange={(e) => handlePlacementChange(index, 'participantUserId', e.target.value)}
                      required
                    >
                      <option value="">Select Participant</option>
                      {users.map(user => (
                        <option key={user.uid} value={user.uid}>
                          {user.name} ({user.rollNo}) - {user.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Participant Name *</label>
                    <input
                      type="text"
                      value={placement.participantName}
                      readOnly
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={resultForm.notes}
                onChange={(e) => setResultForm({ ...resultForm, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes about the competition..."
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : '✅ Submit Result'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="tab-content">
          <form onSubmit={handleFileUpload} className="admin-form">
            <h2>Upload Event Files</h2>

            <div className="form-group">
              <label>Event Type *</label>
              <select
                value={fileUploadForm.eventType}
                onChange={(e) => setFileUploadForm({ ...fileUploadForm, eventType: e.target.value })}
                required
              >
                <option value="">Select Event Type</option>
                <option value="cultural">Cultural (Spandan)</option>
                <option value="sports">Sports (Khel Mahotsav)</option>
                <option value="technical">Technical (Technovation)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Edition Year *</label>
              <input
                type="text"
                value={fileUploadForm.editionId}
                onChange={(e) => setFileUploadForm({ ...fileUploadForm, editionId: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Competition *</label>
              <select
                value={fileUploadForm.competitionId}
                onChange={(e) => setFileUploadForm({ ...fileUploadForm, competitionId: e.target.value })}
                required
                disabled={!fileUploadForm.eventType}
              >
                <option value="">Select Competition</option>
                {competitions.map(comp => (
                  <option key={comp.id} value={comp.competitionId}>
                    {comp.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>File Type *</label>
              <select
                value={fileUploadForm.fileType}
                onChange={(e) => setFileUploadForm({ ...fileUploadForm, fileType: e.target.value as any })}
                required
              >
                <option value="image">Image</option>
                <option value="document">Document</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select File *</label>
              <input
                id="fileInput"
                type="file"
                onChange={(e) => setFileUploadForm({ ...fileUploadForm, file: e.target.files?.[0] || null })}
                required
              />
            </div>

            <div className="form-group">
              <label>File Name (Optional)</label>
              <input
                type="text"
                value={fileUploadForm.fileName}
                onChange={(e) => setFileUploadForm({ ...fileUploadForm, fileName: e.target.value })}
                placeholder="Leave empty to use original file name"
              />
            </div>

            <div className="form-group">
              <label>Tags</label>
              <div className="tags-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag and press Enter"
                />
                <button type="button" onClick={addTag} className="add-tag-btn">
                  + Add Tag
                </button>
              </div>
              <div className="tags-list">
                {fileUploadForm.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={fileUploadForm.description}
                onChange={(e) => setFileUploadForm({ ...fileUploadForm, description: e.target.value })}
                rows={3}
                placeholder="Describe the file..."
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Uploading...' : '📤 Upload File'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;