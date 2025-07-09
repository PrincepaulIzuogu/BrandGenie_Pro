import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  getAllGroups,
  getAllProjects,
  getAllTools,
  getAllFilesByCompanyId,
} from '../api/userAssignments';
import { useUser } from '../context/UserContext';

type OptionType = { value: string; label: string };
type Assignment = { items: OptionType[]; durationValue: string; durationType: string };

const AddUser: React.FC = () => {
  const animatedComponents = makeAnimated();
  const { user } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    role: 'intern',
    durationType: 'days',
    durationValue: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const [groups, setGroups] = useState<OptionType[]>([]);
  const [projects, setProjects] = useState<OptionType[]>([]);
  const [tools, setTools] = useState<OptionType[]>([]);
  const [documents, setDocuments] = useState<OptionType[]>([]);

  const [selectedGroups, setSelectedGroups] = useState<MultiValue<OptionType>>([]);
  const [selectedProjects, setSelectedProjects] = useState<Assignment>({ items: [], durationValue: '', durationType: 'days' });
  const [selectedTools, setSelectedTools] = useState<Assignment>({ items: [], durationValue: '', durationType: 'days' });
  const [selectedDocuments, setSelectedDocuments] = useState<Assignment>({ items: [], durationValue: '', durationType: 'days' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupRes, projectRes, toolRes] = await Promise.all([
          getAllGroups(),
          getAllProjects(),
          getAllTools()
        ]);

        let fileRes = { data: [] };
        if (user?.company_id) {
          fileRes = await getAllFilesByCompanyId(user.company_id);
        }

        setGroups(groupRes.data.map((g: any) => ({ value: g.id.toString(), label: g.name })));
        setProjects(projectRes.data.map((p: any) => ({ value: p.id.toString(), label: p.name })));
        setTools(toolRes.data.map((t: any) => ({ value: t.id.toString(), label: t.title })));
        setDocuments(fileRes.data.map((d: any) => ({ value: d.id.toString(), label: d.path })));
      } catch (err) {
        toast.error('❌ Failed to fetch assignment data');
      }
    };

    fetchData();
  }, [user?.company_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user?.company_id) {
      toast.error('❌ Company not found for current user');
      setIsLoading(false);
      return;
    }

    const payload = {
      fullName: form.fullName,
      email: form.email,
      role: form.role,
      durationType: form.durationType,
      durationValue: parseInt(form.durationValue),
      company_id: user.company_id,
      groups: selectedGroups.map((g) => parseInt(g.value)),
      projects: {
        items: selectedProjects.items.map((p) => parseInt(p.value)),
        durationValue: parseInt(selectedProjects.durationValue),
        durationType: selectedProjects.durationType
      },
      tools: {
        items: selectedTools.items.map((t) => parseInt(t.value)),
        durationValue: parseInt(selectedTools.durationValue),
        durationType: selectedTools.durationType
      },
      documents: {
        items: selectedDocuments.items.map((d) => parseInt(d.value)),
        durationValue: parseInt(selectedDocuments.durationValue),
        durationType: selectedDocuments.durationType
      }
    };

    try {
      await axios.post('http://localhost:5000/api/adduser', payload);
      toast.success('✅ User added and email sent!');
      navigate('/view-users');
    } catch (error: any) {
      toast.error('❌ Failed to add user: ' + (error.response?.data?.detail || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderAssignmentSection = (
    label: string,
    options: OptionType[],
    value: Assignment,
    onChange: (assignment: Assignment) => void
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={options}
          value={value.items}
          onChange={(val) => onChange({ ...value, items: val as OptionType[] })}
          className="mb-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Duration</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="e.g. 2"
            value={value.durationValue}
            onChange={(e) => onChange({ ...value, durationValue: e.target.value })}
            className="w-2/3 border rounded px-3 py-2"
          />
          <select
            value={value.durationType}
            onChange={(e) => onChange({ ...value, durationType: e.target.value })}
            className="w-1/3 border rounded px-2 py-2"
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="intern">Intern</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contract Period</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="durationValue"
                value={form.durationValue}
                onChange={handleChange}
                className="w-2/3 border rounded px-3 py-2"
                placeholder="e.g. 3"
              />
              <select
                name="durationType"
                value={form.durationType}
                onChange={handleChange}
                className="w-1/3 border rounded px-2 py-2"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assign to Groups</label>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={groups}
            value={selectedGroups}
            onChange={(val) => setSelectedGroups(val)}
          />
        </div>

        {renderAssignmentSection('Assign Projects', projects, selectedProjects, setSelectedProjects)}
        {renderAssignmentSection('Assign Tools', tools, selectedTools, setSelectedTools)}
        {renderAssignmentSection('Assign Documents', documents, selectedDocuments, setSelectedDocuments)}

        <div className="text-center">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-lg shadow-lg transition"
            disabled={isLoading}
          >
            {isLoading ? 'Adding user...' : 'Add User'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddUser;
