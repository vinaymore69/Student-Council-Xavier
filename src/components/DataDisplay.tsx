// src/components/DataDisplay.tsx
import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';
import { Result, FileMetadata, Tally, Competition } from '../lib/types';
import './DataDisplay.css';

const DataDisplay: React.FC = () => {
  const [activeView, setActiveView] = useState<'results' | 'files' | 'tallies'>('results');
  const [results, setResults] = useState<any[]>([]);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [tallies, setTallies] = useState<{ departments: Tally[]; classes: Tally[] }>({
    departments: [],
    classes: []
  });
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    eventType: '',
    editionId: '2024',
    competitionId: '',
    fileType: '',
    tags: [] as string[]
  });

  useEffect(() => {
    if (activeView === 'results') {
      fetchResults();
    } else if (activeView === 'files') {
      fetchFiles();
    } else if (activeView === 'tallies') {
      fetchTallies();
    }
  }, [activeView, filters]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      let resultsData: any[] = [];
      const eventTypes = filters.eventType ? [filters.eventType] : ['cultural', 'sports', 'technical'];

      for (const typeId of eventTypes) {
        const compsRef = collection(
          db,
          `eventTypes/${typeId}/editions/${filters.editionId || '2024'}/competitions`
        );

        const compsSnapshot = await getDocs(compsRef);

        for (const compDoc of compsSnapshot.docs) {
          if (filters.competitionId && compDoc.id !== filters.competitionId) continue;

          const resultsSubRef = collection(compDoc.ref, 'results');
          const resultsSnapshot = await getDocs(resultsSubRef);

          resultsSnapshot.forEach(resultDoc => {
            resultsData.push({
              id: resultDoc.id,
              eventType: typeId,
              competitionId: compDoc.id,
              competitionTitle: compDoc.data().title,
              ...resultDoc.data()
            });
          });
        }
      }

      setResults(resultsData);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      let q = collection(db, 'eventFiles');
      const constraints: any[] = [];

      if (filters.eventType) {
        constraints.push(where('eventType', '==', filters.eventType));
      }
      if (filters.fileType) {
        constraints.push(where('fileType', '==', filters.fileType));
      }
      if (filters.competitionId) {
        constraints.push(where('competitionId', '==', filters.competitionId));
      }

      constraints.push(orderBy('uploadedAt', 'desc'));

      const finalQuery = query(q, ...constraints);
      const snapshot = await getDocs(finalQuery);
      let filesData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as FileMetadata[];

      if (filters.tags && filters.tags.length > 0) {
        filesData = filesData.filter(file =>
          filters.tags.some(tag => file.tags && file.tags.includes(tag))
        );
      }

      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTallies = async () => {
    setLoading(true);
    try {
      const eventType = filters.eventType || 'cultural';
      const editionId = filters.editionId || '2024';

      const deptRef = collection(
        db,
        `eventTypes/${eventType}/editions/${editionId}/tallies/departments/departmentsList`
      );
      const deptSnapshot = await getDocs(query(deptRef, orderBy('points', 'desc')));
      const deptData = deptSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Tally[];

      const classRef = collection(
        db,
        `eventTypes/${eventType}/editions/${editionId}/tallies/classes/classesList`
      );
      const classSnapshot = await getDocs(query(classRef, orderBy('points', 'desc')));
      const classData = classSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Tally[];

      setTallies({ departments: deptData, classes: classData });
    } catch (error) {
      console.error('Error fetching tallies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-display">
      <div className="display-header">
        <h1>📊 Event Data Display</h1>
        <p>View and filter competition results, files, and tallies</p>
      </div>

      <div className="view-tabs">
        <button
          className={activeView === 'results' ? 'active' : ''}
          onClick={() => setActiveView('results')}
        >
          🏆 Results
        </button>
        <button
          className={activeView === 'files' ? 'active' : ''}
          onClick={() => setActiveView('files')}
        >
          📁 Files
        </button>
        <button
          className={activeView === 'tallies' ? 'active' : ''}
          onClick={() => setActiveView('tallies')}
        >
          📈 Tallies
        </button>
      </div>

      {/* FILTERS */}
      <div className="filters-section">
        <h3>🔍 Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Event Type</label>
            <select
              value={filters.eventType}
              onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
            >
              <option value="">All Events</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Edition Year</label>
            <input
              type="text"
              value={filters.editionId}
              onChange={(e) => setFilters({ ...filters, editionId: e.target.value })}
              placeholder="2024"
            />
          </div>

          {activeView === 'files' && (
            <div className="filter-group">
              <label>File Type</label>
              <select
                value={filters.fileType}
                onChange={(e) => setFilters({ ...filters, fileType: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
                <option value="video">Videos</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* RESULTS VIEW */}
      {activeView === 'results' && (
        <div className="results-view">
          {loading ? (
            <p>Loading results...</p>
          ) : results.length === 0 ? (
            <p className="no-data">No results found</p>
          ) : (
            <div className="results-grid">
              {results.map(result => (
                <div key={result.id} className="result-card">
                  <div className="card-header">
                    <h3>{result.competitionTitle}</h3>
                    <span className={`badge ${result.eventType}`}>
                      {result.eventType}
                    </span>
                  </div>
                  <div className="placements">
                    {result.placements?.map((p: any, idx: number) => (
                      <div key={idx} className="placement-item">
                        <span className="medal">
                          {p.place === 1 ? '🥇' : p.place === 2 ? '🥈' : '🥉'}
                        </span>
                        <span className="participant">{p.participantName}</span>
                      </div>
                    ))}
                  </div>
                  {result.notes && (
                    <p className="notes">📝 {result.notes}</p>
                  )}
                  <div className="card-footer">
                    <span className={`status ${result.isFinal ? 'final' : 'draft'}`}>
                      {result.isFinal ? '✓ Final' : '⏱ Draft'}
                    </span>
                    <span className={`tally ${result.tallyApplied ? 'applied' : 'pending'}`}>
                      {result.tallyApplied ? '✓ Tally Applied' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FILES VIEW */}
      {activeView === 'files' && (
        <div className="files-view">
          {loading ? (
            <p>Loading files...</p>
          ) : files.length === 0 ? (
            <p className="no-data">No files found</p>
          ) : (
            <div className="files-grid">
              {files.map(file => (
                <div key={file.id} className="file-card">
                  <div className="file-preview">
                    {file.fileType === 'image' ? (
                      <img src={file.fileUrl} alt={file.fileName} />
                    ) : (
                      <div className="file-icon">
                        {file.fileType === 'document' ? '📄' : '🎥'}
                      </div>
                    )}
                  </div>
                  <div className="file-info">
                    <h4>{file.fileName}</h4>
                    <p>{file.description}</p>
                    <div className="file-tags">
                      {file.tags?.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                    <div className="file-meta">
                      <span className={`badge ${file.eventType}`}>
                        {file.eventType}
                      </span>
                      <span className="file-type">{file.fileType}</span>
                    </div>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-btn"
                    >
                      📥 Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TALLIES VIEW */}
      {activeView === 'tallies' && (
        <div className="tallies-view">
          {loading ? (
            <p>Loading tallies...</p>
          ) : (
            <>
              <div className="tally-section">
                <h2>🏢 Department Rankings</h2>
                {tallies.departments.length === 0 ? (
                  <p className="no-data">No department tallies found</p>
                ) : (
                  <table className="tally-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Department</th>
                        <th>🥇 Gold</th>
                        <th>🥈 Silver</th>
                        <th>🥉 Bronze</th>
                        <th>⭐ Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tallies.departments.map((dept, idx) => (
                        <tr key={dept.id}>
                          <td className="rank">{idx + 1}</td>
                          <td className="department">{dept.departmentName}</td>
                          <td>{dept.gold || 0}</td>
                          <td>{dept.silver || 0}</td>
                          <td>{dept.bronze || 0}</td>
                          <td className="points">{dept.points || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="tally-section">
                <h2>🎓 Class Rankings</h2>
                {tallies.classes.length === 0 ? (
                  <p className="no-data">No class tallies found</p>
                ) : (
                  <table className="tally-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Class</th>
                        <th>🥇 Gold</th>
                        <th>🥈 Silver</th>
                        <th>🥉 Bronze</th>
                        <th>⭐ Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tallies.classes.map((cls, idx) => (
                        <tr key={cls.id}>
                          <td className="rank">{idx + 1}</td>
                          <td className="class">{cls.className}</td>
                          <td>{cls.gold || 0}</td>
                          <td>{cls.silver || 0}</td>
                          <td>{cls.bronze || 0}</td>
                          <td className="points">{cls.points || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DataDisplay;