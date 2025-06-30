import { useState, useEffect } from 'react';
import '../../css/Calender/Calaender.css'; // We'll create this CSS file separately

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState(() => {
    // Load notes from localStorage on initial render
    const savedNotes = localStorage.getItem('calendarNotes');
    return savedNotes ? JSON.parse(savedNotes) : {};
  });
  const [currentNote, setCurrentNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarNotes', JSON.stringify(notes));
  }, [notes]);

  // Calculate calendar grid data
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const grid = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || dayCounter > daysInMonth) {
          week.push(null);
        } else {
          week.push(dayCounter++);
        }
      }
      grid.push(week);
      if (dayCounter > daysInMonth) break;
    }
    return grid;
  };

  const grid = generateCalendarGrid();

  // Handle navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Handle date selection
  const handleDateClick = (day) => {
    if (day) {
      const dateString = `${year}-${month + 1}-${day}`;
      setSelectedDate(dateString);
      setCurrentNote(notes[dateString] || '');
      setIsEditing(Boolean(notes[dateString]));
    }
  };

  // Handle note saving
  const saveNote = () => {
    if (selectedDate && currentNote.trim()) {
      const updatedNotes = {
        ...notes,
        [selectedDate]: currentNote
      };
      setNotes(updatedNotes);
    } else if (selectedDate && notes[selectedDate]) {
      const updatedNotes = { ...notes };
      delete updatedNotes[selectedDate];
      setNotes(updatedNotes);
    }
    setSelectedDate(null);
    setCurrentNote('');
    setIsEditing(false);
  };

  // Check if a date has a note
  const hasNote = (day) => {
    if (!day) return false;
    const dateString = `${year}-${month + 1}-${day}`;
    return Boolean(notes[dateString]);
  };

  // Detect clicks outside the note editor to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectedDate && !e.target.closest('.note-editor') && !e.target.closest('.calendar-day')) {
        saveNote();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedDate, currentNote]);

  return (
    <div className="calendar-container">
      <h1>Calendar with Notes</h1>
      
      {/* Calendar header */}
      <div className="calendar-header">
        <button className="nav-button" onClick={goToPreviousMonth}>
          &lt; Prev
        </button>
        <h2>{monthNames[month]} {year}</h2>
        <button className="nav-button" onClick={goToNextMonth}>
          Next &gt;
        </button>
      </div>
      
      {/* Calendar grid */}
      <div className="calendar">
        {/* Weekday headers */}
        <div className="weekdays">
          {weekdays.map(day => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="days">
          {grid.flatMap((week, weekIndex) => 
            week.map((day, dayIndex) => (
              <div 
                key={`${weekIndex}-${dayIndex}`} 
                className={`calendar-day ${
                  day ? 'has-day' : 'empty-day'
                } ${selectedDate === `${year}-${month + 1}-${day}` ? 'selected' : ''}`}
                onClick={() => day && handleDateClick(day)}
              >
                {day && (
                  <>
                    <span className="day-number">{day}</span>
                    {hasNote(day) && (
                      <div className="note-preview">
                        {notes[`${year}-${month + 1}-${day}`].substring(0, 30)}
                        {notes[`${year}-${month + 1}-${day}`].length > 30 && '...'}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Note editor */}
      {selectedDate && (
        <div className="modal-overlay">
          <div className="note-editor">
            <h3>
              {isEditing ? 'Edit Note' : 'Add Note'} for {selectedDate}
            </h3>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Enter your note here..."
              autoFocus
            ></textarea>
            <div className="button-container">
              <button
                className="cancel-button"
                onClick={() => {
                  setSelectedDate(null);
                  setCurrentNote('');
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
              <button
                className="save-button"
                onClick={saveNote}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;