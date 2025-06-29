import { useState } from 'react';
import styles from '../../styles/SuperAdminDashboard.module.css';

const InstituteManagement = () => {
  const [institutes, setInstitutes] = useState([
    { id: '1', name: 'ABC Institute', departments: ['CSE', 'ECE'], adminEmail: 'admin@abc.com' },
    { id: '2', name: 'XYZ Institute', departments: ['ME', 'CE'], adminEmail: 'admin@xyz.com' },
  ]);

  const [newInstitute, setNewInstitute] = useState({ name: '', departments: '', adminEmail: '', adminPassword: '' });
  const [editInstituteId, setEditInstituteId] = useState('');
  const [editInstituteData, setEditInstituteData] = useState<{ name: string; departments: string[]; adminEmail: string }>({ name: '', departments: [], adminEmail: '' });

  const departmentOptions = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT'];

  const handleAddInstitute = () => {
    const newId = (institutes.length + 1).toString();
    setInstitutes([
      ...institutes,
      {
        id: newId,
        name: newInstitute.name,
        departments: newInstitute.departments.split(',').map(d => d.trim()),
        adminEmail: newInstitute.adminEmail,
      },
    ]);
    setNewInstitute({ name: '', departments: '', adminEmail: '', adminPassword: '' });
  };

  const handleRemoveInstitute = (id: string) => {
    setInstitutes(institutes.filter(inst => inst.id !== id));
  };

  const handleEditChange = (id: string) => {
    const inst = institutes.find(i => i.id === id);
    if (inst) {
      setEditInstituteId(id);
      setEditInstituteData({
        name: inst.name,
        departments: inst.departments,
        adminEmail: inst.adminEmail,
      });
    }
  };

  const handleDepartmentToggle = (dept: string) => {
    setEditInstituteData(prev => {
      const exists = prev.departments.includes(dept);
      return {
        ...prev,
        departments: exists
          ? prev.departments.filter(d => d !== dept)
          : [...prev.departments, dept],
      };
    });
  };

  const handleSaveEdit = () => {
    setInstitutes(institutes.map(inst => {
      if (inst.id === editInstituteId) {
        return {
          ...inst,
          name: editInstituteData.name,
          departments: editInstituteData.departments,
          adminEmail: editInstituteData.adminEmail,
        };
      }
      return inst;
    }));
    setEditInstituteId('');
    setEditInstituteData({ name: '', departments: [], adminEmail: '' });
  };

  return (
    <div className={styles.sectionWrapper}>
      <h1>Institute Management</h1>

      <h2>Add New Institute</h2>
      <input placeholder="Institute Name" value={newInstitute.name} onChange={e => setNewInstitute({ ...newInstitute, name: e.target.value })} />
      <input placeholder="Departments (comma separated)" value={newInstitute.departments} onChange={e => setNewInstitute({ ...newInstitute, departments: e.target.value })} />
      <input placeholder="Admin Email" value={newInstitute.adminEmail} onChange={e => setNewInstitute({ ...newInstitute, adminEmail: e.target.value })} />
      <input placeholder="Admin Password" type="password" value={newInstitute.adminPassword} onChange={e => setNewInstitute({ ...newInstitute, adminPassword: e.target.value })} />
      <button onClick={handleAddInstitute}>Add Institute</button>

      <h2>Existing Institutes</h2>
      {institutes.map(inst => (
        <div key={inst.id} style={{ margin: '1rem 0' }}>
          <strong>{inst.name}</strong> - Depts: {inst.departments.join(', ')} - Admin: {inst.adminEmail}
          <button onClick={() => handleRemoveInstitute(inst.id)} style={{ marginLeft: '1rem' }}>Remove</button>
          <button onClick={() => handleEditChange(inst.id)} style={{ marginLeft: '0.5rem' }}>Edit</button>
        </div>
      ))}

      {editInstituteId && (
        <div>
          <h2>Edit Institute</h2>
          <input placeholder="Institute Name" value={editInstituteData.name} onChange={e => setEditInstituteData({ ...editInstituteData, name: e.target.value })} />
          <div>
            <p>Select Departments:</p>
            {departmentOptions.map(dept => (
              <label key={dept} style={{ marginRight: '1rem' }}>
                <input
                  type="checkbox"
                  checked={editInstituteData.departments.includes(dept)}
                  onChange={() => handleDepartmentToggle(dept)}
                /> {dept}
              </label>
            ))}
          </div>
          <input placeholder="Admin Email" value={editInstituteData.adminEmail} onChange={e => setEditInstituteData({ ...editInstituteData, adminEmail: e.target.value })} />
          <button onClick={handleSaveEdit}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default InstituteManagement;
