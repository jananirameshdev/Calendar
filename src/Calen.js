import React, { useState, useEffect } from "react";
import "./App.css";

function Calen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState(() => {
        return JSON.parse(localStorage.getItem("events")) || {};
    });
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEvent, setNewEvent] = useState({ name: "", startTime: "", endTime: "", description: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("events", JSON.stringify(events));
    }, [events]);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const daysInMonth = Array.from({ length: endOfMonth.getDate() }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1));

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const openEventModal = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const closeEventModal = () => {
        setSelectedDate(null);
        setNewEvent({ name: "", startTime: "", endTime: "", description: "" });
        setIsModalOpen(false);
    };

    const handleAddEvent = () => {
        if (!newEvent.name || !newEvent.startTime || !newEvent.endTime) {
            alert("Event name, start time, and end time are required.");
            return;
        }

        setEvents((prev) => {
            const dateKey = selectedDate.toISOString().split("T")[0];
            const updatedEvents = { ...prev };
            if (!updatedEvents[dateKey]) {
                updatedEvents[dateKey] = [];
            }
            updatedEvents[dateKey].push({ ...newEvent, id: Date.now() });
            return updatedEvents;
        });
        closeEventModal();
    };

    const handleDeleteEvent = (dateKey, eventId) => {
        setEvents((prev) => {
            const updatedEvents = { ...prev };
            updatedEvents[dateKey] = updatedEvents[dateKey].filter((event) => event.id !== eventId);
            if (updatedEvents[dateKey].length === 0) delete updatedEvents[dateKey];
            return updatedEvents;
        });
    };

    return (
        <div className="app">
            <header className="calendar-header">
                <button onClick={handlePreviousMonth}>&lt; Previous</button>
                <h1>{currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h1>
                <button onClick={handleNextMonth}>Next &gt;</button>
            </header>

            <div className="calendar-grid">
                {daysInMonth.map((date) => (
                    <div
                        key={date.toISOString()}
                        className={`calendar-day ${date.toISOString().split("T")[0] === new Date().toISOString().split("T")[0] ? "today" : ""}`}
                        onClick={() => openEventModal(date)}
                    >
                        <span>{date.getDate()}</span>
                        {events[date.toISOString().split("T")[0]] && (
                            <div className="event-count">
                                {events[date.toISOString().split("T")[0]].length} event(s)
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{selectedDate.toDateString()}</h2>
                        <div className="event-list">
                            {(events[selectedDate.toISOString().split("T")[0]] || []).map((event) => (
                                <div key={event.id} className="event-item">
                                    <h3>{event.name}</h3>
                                    <p>{event.startTime} - {event.endTime}</p>
                                    <p>{event.description}</p>
                                    <button onClick={() => handleDeleteEvent(selectedDate.toISOString().split("T")[0], event.id)}>Delete</button>
                                </div>
                            ))}
                        </div>

                        <h3>Add New Event</h3>
                        <input
                            type="text"
                            placeholder="Event Name"
                            value={newEvent.name}
                            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        />
                        <input
                            type="time"
                            value={newEvent.startTime}
                            onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        />
                        <input
                            type="time"
                            value={newEvent.endTime}
                            onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        />

                        <button onClick={handleAddEvent}>Add Event</button>
                        <button onClick={closeEventModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calen;
