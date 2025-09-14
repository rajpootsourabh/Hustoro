import React, { useEffect, useState } from "react";
import { CalendarClock, CalendarDays } from "lucide-react";
import CreateTodoModal from "./CreateTodoModal";
import EventCalendarModal from "./EventCalendarModal";
import { format, parse } from "date-fns";
import axios from "axios";

const CalendarCard = () => {
  const [activeTab, setActiveTab] = useState("Events");
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [loadingTodos, setLoadingTodos] = useState(false);

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (activeTab === "To Do") {
      fetchTodos();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "Events") {
      fetchEvents();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Convert `date` and `time` fields into JS Date object
      const parsed = res.data.map((event) => ({
        ...event,
        date: new Date(`${event.date}T${event.time}`),
      }));
      setEvents(parsed);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchTodos = async () => {
    try {
      setLoadingTodos(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/todos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodoList(res.data);
    } catch (err) {
      console.error("Failed to fetch todos", err);
    } finally {
      setLoadingTodos(false);
    }
  };

  const handleAddTodos = async (newTitles) => {
    try {
      const responses = await Promise.all(
        newTitles.map((title) =>
          axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/todos`,
            { title },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );
      const newTodos = responses.map((res) => res.data);
      setTodoList((prev) => [...prev, ...newTodos]);
    } catch (err) {
      console.error("Failed to create todos", err);
    }
  };

  const handleCheckboxChange = async (id, index) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/todos/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updated = [...todoList];
      updated[index].is_done = !updated[index].is_done;
      setTodoList(updated);
    } catch (err) {
      console.error("Failed to toggle todo", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#007a6e] rounded-full flex items-center justify-center text-white">
            <CalendarDays className="w-5 h-5" />
          </div>
        <p className="text-sm text-gray-800">{format(new Date(), "EEEE dd MMM, yyyy")}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {["Events", "To Do"].map((label) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${activeTab === label
                ? "bg-[#007a6e] text-white"
                : "bg-[#F3F7F8] text-[#757575]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-4 max-h-52 overflow-y-auto pr-2 scrollbar-enhanced">
          {activeTab === "Events" && (
            <>
              {loadingEvents ? (
                <p className="text-sm text-gray-400 text-center">Loading...</p>
              ) : events.length === 0 ? (
                <p className="text-sm text-gray-400 text-center">No events available.</p>
              ) : (
                events.map((item, idx) => {
                  const formattedDate = format(new Date(item.date), "EEE, d MMM");
                  let formattedTime = "Invalid Time";
                  try {
                    if (item.time) {
                      const parsedTime = parse(item.time, "HH:mm:ss", new Date());
                      if (!isNaN(parsedTime)) {
                        formattedTime = format(parsedTime, "hh:mm a");
                      }
                    }
                  } catch (e) {
                    console.warn("Time parsing failed for:", item.time, e);
                  }
                  return (
                    <div key={idx}>
                      <div className="flex gap-4 items-center px-2 py-2">
                        <div className="flex items-center gap-2 w-40">
                          <div className="bg-[#007a6e] text-white p-1 rounded-full">
                            <CalendarClock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {formattedDate}
                            </p>
                            <p className="text-xs text-gray-500">{formattedTime}</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-xs text-gray-500">{item.description}</p>
                          )}
                        </div>
                      </div>
                      {idx < events.length - 1 && (
                        <div className="border-t border-gray-200 mx-2"></div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === "To Do" && (
            <>
              {loadingTodos ? (
                <p className="text-sm text-gray-400 text-center">Loading...</p>
              ) : (
                <>
                  {todoList.map((item, idx) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 cursor-pointer px-2"
                    >
                      <input
                        type="checkbox"
                        checked={item.is_done}
                        onChange={() => handleCheckboxChange(item.id, idx)}
                        className="accent-[#007a6e] w-4 h-4"
                      />
                      <span
                        className={`text-sm ${item.is_done
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                          }`}
                      >
                        {item.title}
                      </span>
                    </label>
                  ))}
                  {todoList.length === 0 && (
                    <p className="text-sm text-gray-400 text-center">
                      No tasks available.
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer buttons */}
        {activeTab === "To Do" && (
          <div className="sticky bottom-0 pt-2 bg-white">
            <button
              onClick={() => setShowTodoModal(true)}
              className="text-[#007a6e] text-sm font-medium hover:underline"
            >
              + Create New Task
            </button>
          </div>
        )}

        {activeTab === "Events" && (
          <div className="sticky bottom-0 pt-2 bg-white">
            <button
              onClick={() => setShowEventModal(true)}
              className="text-[#007a6e] text-sm font-medium hover:underline"
            >
              + Create New Event
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTodoModal
        isOpen={showTodoModal}
        onClose={() => setShowTodoModal(false)}
        onSubmit={handleAddTodos}
      />

      <EventCalendarModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSubmit={(event) => {
          // Normalize date and time to match backend format
          const normalized = {
            ...event,
            date: format(event.date, "yyyy-MM-dd"), // string date
            time: event.time.length === 5 ? event.time + ":00" : event.time, // "09:00" -> "09:00:00"
          };

          setEvents((prev) => [...prev, normalized]);
        }}
      />
    </div>
  );
};

export default CalendarCard;
