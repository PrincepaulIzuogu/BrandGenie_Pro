// src/pages/tools/googlecalender/CalendarPage.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { BsFillCalendar2WeekFill } from 'react-icons/bs';
import { useUser } from '../../../context/UserContext'; // ✅ import user context

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface EventType {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  allDay?: boolean;
}

const Sidebar = ({ onOpenModal }: { onOpenModal: () => void }) => (
  <div className="w-64 bg-white shadow-lg border-r p-4 text-sm">
    <div className="flex items-center space-x-2 mb-4">
      <img src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_20_2x.png" alt="logo" className="w-6 h-6" />
      <h1 className="text-xl font-semibold">Calendar</h1>
    </div>
    <button onClick={onOpenModal} className="flex items-center justify-between w-full px-3 py-2 bg-white text-black border rounded-md shadow-sm hover:bg-gray-100">
      <span className="text-sm font-medium">+ Create</span>
      <IoMdArrowDropdown className="ml-2" />
    </button>
    <div className="mt-6">
      <p className="text-sm font-semibold mb-2">June 2025</p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {[...Array(7)].map((_, i) => {
          const day = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][i];
          return <span key={`day-${i}`} className="font-bold text-gray-500">{day}</span>;
        })}
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i + 1} className={`w-6 h-6 flex items-center justify-center rounded-full ${i + 1 === 22 ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>
            {i + 1}
          </div>
        ))}
      </div>
    </div>
    <div className="mt-4">
      <div className="flex items-center px-2 py-1 border rounded bg-gray-100">
        <FiSearch className="text-gray-500" />
        <input type="text" placeholder="Search team members" className="ml-2 w-full bg-transparent outline-none text-sm" />
      </div>
    </div>
    <div className="mt-4">
      <p className="text-sm font-semibold">Marketing Calendars</p>
      <div className="mt-1 space-y-1">
        {["Campaign Launches", "Contract Deadlines", "Team Review Meetings"].map(item => (
          <label key={item} className="flex items-center"><input type="checkbox" defaultChecked className="mr-2" /> {item}</label>
        ))}
      </div>
      <p className="text-sm font-semibold mt-3">Other Calendars</p>
      <div className="mt-1 space-y-1">
        {["Holidays in Germany", "Freelancer Timelines"].map(item => (
          <label key={item} className="flex items-center"><input type="checkbox" defaultChecked className="mr-2" /> {item}</label>
        ))}
      </div>
    </div>
  </div>
);

const CalendarPage = () => {
  const { user } = useUser();
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<EventType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', start: '', end: '' });

  const fetchEvents = async () => {
    if (!user?.company_id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/calendar/events?company_id=${user.company_id}`);
      const data = await res.json();
      const formatted = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        description: event.description,
      }));
      setEvents(formatted);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const deleteEvent = async (eventId: number) => {
    try {
      await fetch(`http://localhost:5000/api/calendar/events/${eventId}`, { method: 'DELETE' });
      setEvents(prev => prev.filter(ev => ev.id !== eventId));
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const handleCreate = async () => {
    if (!form.title || !form.start || !form.end || !user?.company_id || !user?.id) {
      alert("Missing required fields.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/calendar/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: user.company_id,
          created_by: user.id,
          title: form.title,
          description: form.description,
          start_time: form.start,
          end_time: form.end,
        }),
      });

      if (res.ok) {
        setForm({ title: '', description: '', start: '', end: '' });
        setShowModal(false);
        fetchEvents();
      } else {
        const err = await res.json();
        alert("Failed to create event: " + JSON.stringify(err));
      }
    } catch (err) {
      console.error("Failed to create:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  return (
    <div className="flex h-screen">
      <Sidebar onOpenModal={() => setShowModal(true)} />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button className="border p-2 rounded hover:bg-gray-200" onClick={() => setDate(new Date())}>Today</button>
            <button onClick={() => setDate(new Date(date.setDate(date.getDate() - 7)))} className="p-2 border rounded hover:bg-gray-200"><FaChevronLeft /></button>
            <button onClick={() => setDate(new Date(date.setDate(date.getDate() + 7)))} className="p-2 border rounded hover:bg-gray-200"><FaChevronRight /></button>
            <h2 className="text-lg font-semibold ml-4">{format(date, 'MMMM yyyy')}</h2>
          </div>
          <div className="flex items-center border rounded px-2 py-1 bg-gray-100">
            <BsFillCalendar2WeekFill className="mr-1" /> Week
          </div>
        </div>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          date={date}
          onNavigate={setDate}
          style={{ height: '80vh' }}
          onSelectEvent={event => {
            if (window.confirm(`Delete event "${event.title}"?`)) {
              deleteEvent((event as EventType).id);
            }
          }}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 space-y-4">
            <h2 className="text-lg font-semibold">Create Event</h2>
            <input className="w-full p-2 border rounded" type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full p-2 border rounded" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input className="w-full p-2 border rounded" type="datetime-local" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
            <input className="w-full p-2 border rounded" type="datetime-local" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
