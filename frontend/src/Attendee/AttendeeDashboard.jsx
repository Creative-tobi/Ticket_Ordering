import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Api from "../component/Api";

const AttendeeDashboard = () => {
  const [attendee, setAttendee] = useState(null);
  const [event, setEvent] = useState([]);
  const [ticket, setTicket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 For search + filter
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const location = useLocation();

  useEffect(() => {
    const fetchAttendeeProfile = async () => {
      try {
        const AttendeeID = localStorage.getItem("AttendeeID");
        if (!AttendeeID) {
          setError("No attendee ID found. Please log in again");
          return;
        }

        const { data } = await Api.get(`/attendee/profile/${AttendeeID}`);
        setAttendee(data.attendee);

        const eventRes = await Api.get(`/attendee/event`);
        setEvent(eventRes.data.allEvent || []);

        const ticketRes = await Api.get(`/attendee/gettickets`);
        setTicket(ticketRes.data.allEvent || []);
      } catch (err) {
        console.error(
          "Profile fetch error:",
          err.response?.data || err.message
        );
        setError("Failed to load profile data");
      }
    };

    fetchAttendeeProfile();
  }, []);

  // 🔹 Unique categories for dropdown
  const categories = [...new Set(event.map((ev) => ev.category))];

  // 🔹 Filtering logic
  const filteredEvents = event.filter((ev) => {
    const matchesSearch =
      searchCategory === "" ||
      ev.category?.toLowerCase().includes(searchCategory.toLowerCase());
    const matchesDropdown =
      selectedCategory === "" || ev.category === selectedCategory;
    return matchesSearch && matchesDropdown;
  });

  const handleTicket = async (eventId) => {
    setLoading(true);
    setError("");

    try {
      const AttendeeID = localStorage.getItem("AttendeeID");
      if (!AttendeeID) {
        setError("Attendee ID not found. Please log in again");
        setLoading(false);
        return;
      }

      const { data } = await Api.post(`/attendee/ticket`, {
        userID: AttendeeID,
        event: eventId,
        status: "Booked",
        qrcode: "",
      });

      setTicket([...ticket, data.populatedTicket]);
    } catch (err) {
      console.error(
        "Ticket creation error:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to create ticket");
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
            to="/attendee/dashboard"
            className="block py-2 px-4 rounded-lg hover:bg-blue-100">
            Dashboard
          </Link>
          <Link
            to="/attendee/dashboard/tickets"
            className="block py-2 px-4 rounded-lg hover:bg-blue-100">
            My Tickets
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

        {attendee ? (
          <>
            {/* Profile Card */}
            <div className="bg-white shadow-md rounded-xl p-6 flex items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                {attendee.name ? attendee.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{attendee.name}</h2>
                <p className="text-gray-500">{attendee.email}</p>
              </div>
            </div>

            {/* Stats Section */}
            {location.pathname === "/attendee/dashboard" && (
              <div>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">My Tickets</h3>
                    <p className="text-2xl font-bold text-blue-600">
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

                {/* All Events List */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                    <h3 className="text-lg font-semibold">All Events</h3>

                    {/* Search + Dropdown Controls */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search category..."
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="text-sm px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />

                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-sm px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500">
                        <option value="">All</option>
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {filteredEvents.length > 0 ? (
                    <div className="space-y-4">
                      {filteredEvents.map((ev) => (
                        <div
                          key={ev._id}
                          className="p-4 border rounded-lg hover:shadow-md">
                          <div className="flex justify-between items-center">
                            <p className="font-bold">{ev.name}</p>
                            <p className="text-blue-600 font-semibold">
                              ${ev.price}
                            </p>
                          </div>
                          <p className="text-gray-500">{ev.description}</p>
                          <p className="text-sm text-gray-400">
                            {ev.genre} • {ev.category} • {ev.type}
                          </p>
                          <button
                            className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                            onClick={() => handleTicket(ev._id)}
                            disabled={loading}>
                            {loading ? "Booking..." : "Get Ticket"}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No event found</p>
                  )}
                </div>
              </div>
            )}

            {/* All Bought Tickets List */}
            {location.pathname === "/attendee/dashboard/tickets" && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  All Bought Tickets
                </h3>
                {ticket.length > 0 ? (
                  <div className="space-y-4">
                    {ticket.map((tk) => (
                      <div
                        key={tk._id}
                        className="p-4 border rounded-lg hover:shadow-md">
                        <div className="flex justify-between items-center">
                          <h2 className="font-bold text-xl">
                            {tk.event?.name}
                          </h2>
                          <div>
                            <p className="text-blue-600 font-semibold">
                              ${tk.event?.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-500">
                              {tk.event?.description}
                            </p>
                            <p className="text-sm text-gray-400">
                              {tk.event?.genre} • {tk.event?.category} •{" "}
                              {tk.event?.type} • {tk.status}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Booked by {tk.userID?.name} ({tk.userID?.email})
                            </p>
                          </div>

                          <div>
                            <img
                              src={tk.qrcode}
                              alt="Ticket Qr code"
                              className="w-36 h-36"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Opps, looks like you haven't booked any ticket yet
                  </p>
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

export default AttendeeDashboard;
