import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Api from "../component/Api";

const OrganizerDashboard = () => {
  const [organizer, setOrganizer] = useState(null);
  const [event, setEvent] = useState([]);
  const [ticket, setTicket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    genre: "",
    price: "",
    category: "",
    type: "",
  });

  const location = useLocation();

  useEffect(() => {
    const fetchOrganizerProfile = async () => {
      try {
        const OrganizerID = localStorage.getItem("OrganizerID");
        if (!OrganizerID) {
          setError("No organizer ID found. Please log in again");
          return;
        }

        const { data } = await Api.get(`/organizer/profile/${OrganizerID}`);
        setOrganizer(data.organizer);

        const eventRes = await Api.get(`/organizer/getevent`);
        setEvent(eventRes.data.allEvent || []);

        const ticketRes = await Api.get(`/organizer/gettickets`);
        setTicket(ticketRes.data.allEvent || []);
      } catch (err) {
        console.error(
          "Profile fetch error:",
          err.response?.data || err.message
        );
        setError("Failed to load profile data");
      }
    };

    fetchOrganizerProfile();
  }, []);

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const OrganizerID = localStorage.getItem("OrganizerID");
      if (!OrganizerID) {
        setError("Organizer ID not found. Please log in again");
        setLoading(false);
        return;
      }

      const { data } = await Api.post(`/organizer/event`, {
        ...newEvent,
        userID: OrganizerID,
      });

      setEvent([...event, data.newEvent]);
      setNewEvent({
        name: "",
        description: "",
        price: "",
        genre: "",
        type: "",
        category: "",
      });

        if (data.event?.id) localStorage.setItem("EventID", data.event.id);
    } catch (err) {
      console.error("Add event error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <nav className="space-y-4">
          <Link
            to="/organizer/dashboard"
            className="block py-2 px-4 rounded-lg hover:bg-purple-100">
            Dashboard
          </Link>
          <Link
            to="/organizer/dashboard/events"
            className="block py-2 px-4 rounded-lg hover:bg-purple-100">
            All Events
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {organizer ? (
          <>
            {/* Profile Card */}
            <div className="bg-white shadow-md rounded-xl p-6 flex items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                {organizer.name ? organizer.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{organizer.name}</h2>
                <p className="text-gray-500">{organizer.email}</p>
              </div>
            </div>

            {/* Stats Section */}
            {location.pathname === "/organizer/dashboard" && (
              <div>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">My Tickets</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {ticket.length}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">Total Events</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {event.length}
                    </p>
                  </div>
                </div>

                {/* Add Event Form */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Add Event</h3>
                  <form onSubmit={handleEvent} className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      placeholder="Event name"
                      value={newEvent.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                      disabled={loading}
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Event description"
                      value={newEvent.description}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                      disabled={loading}
                    />
                    <input
                      type="text"
                      name="price"
                      value={newEvent.price}
                      placeholder="Price"
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                      disabled={loading}
                    />
                    <input
                      type="text"
                      name="genre"
                      value={newEvent.genre}
                      placeholder="Genre"
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                      disabled={loading}
                    />
                    <input
                      type="text"
                      name="type"
                      value={newEvent.type}
                      placeholder="Event Type"
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                      disabled={loading}
                    />
                    <input
                      type="text"
                      name="category"
                      placeholder="Category"
                      value={newEvent.category}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                      {loading ? "Adding..." : "Add Event"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* All Events List */}
            {location.pathname === "/organizer/dashboard/events" && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">All Events</h3>
                {event.length > 0 ? (
                  <div className="space-y-4">
                    {event.map((event) => (
                      <div
                        key={event._id}
                        className="p-4 border rounded-lg hover:shadow-md">
                        <div className="flex justify-between items-center">
                          <p className="font-bold">{event.name}</p>
                          <p className="text-purple-600 font-semibold">
                            ${event.price}
                          </p>
                        </div>
                        <p className="text-gray-500">{event.description}</p>
                        <p className="text-sm text-gray-400">
                          {event.genre} • {event.category} • {event.type}
                        </p>
                        {/* <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                          Get Ticket
                        </button> */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No event available</p>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">Loading profile....</p>
        )}
      </div>
    </section>
  );
};

export default OrganizerDashboard;
