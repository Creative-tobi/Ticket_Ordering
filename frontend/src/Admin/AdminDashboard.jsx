import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Api from "../component/Api";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [attendee, setAttendee] = useState([]);
  const [event, setEvent] = useState([]);
  const [organizer, setOrganizer] = useState([]);
  const [ticket, setTicket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const AdminID = localStorage.getItem("AdminID");
        if (!AdminID) {
          setError("No attendee ID found. Please log in again");
          return;
        }

        const { data } = await Api.get(`/admin/profile/${AdminID}`);
        setAdmin(data.admin);

        const eventRes = await Api.get(`/admin/event`);
        setEvent(eventRes.data.allEvent || []);

        const ticketRes = await Api.get(`/admin/gettickets`);
        setTicket(ticketRes.data.allTickets || []);

        const attendeeRes = await Api.get(`/admin/attendee`);
        setAttendee(attendeeRes.data.attendee || []);

        const organizerRes = await Api.get(`/admin/organizer`);
        setOrganizer(organizerRes.data.organizer || []);
      } catch (err) {
        console.error(
          "Profile fetch error:",
          err.response?.data || err.message
        );
        setError("Failed to load profile data");
      }
    };

    fetchAdminProfile();
  }, []);

  const handleDeleteEvent = async (id) => {
    try {
      await Api.delete(`/admin/deleteevent/${id}`);
      setEvent(event.filter((s) => s._id !== id));
      alert("Event deleted successfully");
    } catch (error) {
      console.error("Delete event error:", err.response?.data || err.message);
      alert("Failed to delete event");
    }
  };

  const handleDeleteAttendee = async (id) => {
    try {
      await Api.delete(`/admin/deleteAttendee/${id}`);
      setEvent(attendee.filter((s) => s._id !== id));
      alert("Attendee deleted successfully");
    } catch (error) {
      console.error(
        "Delete attendee error:",
        err.response?.data || err.message
      );
      alert("Failed to delete attendee");
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      await Api.delete(`/admin/deleteTicket/${id}`);
      setEvent(ticket.filter((s) => s._id !== id));
      alert("Ticket deleted successfully");
    } catch (error) {
      console.error(
        "Delete tickets error:",
        err.response?.data || err.message
      );
      alert("Failed to delete tickets");
    }
  };

  const handleDeleteOrganizer = async (id) => {
    try {
      await Api.delete(`/admin/deleteOrganizer/${id}`);
      setEvent(organizer.filter((s) => s._id !== id));
      alert("Organizer deleted successfully");
    } catch (error) {
      console.error(
        "Delete organizer error:",
        err.response?.data || err.message
      );
      alert("Failed to delete organizer");
    }
  };
  return (
    <section className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <nav className="space-y-4">
          <Link
            to="/admin/dashboard"
            className="block py-2 px-4 rounded-lg hover:bg-purple-100">
            Dashboard
          </Link>
          <Link
            to="/admin/dashboard/organizer"
            className="block py-2 px-4 rounded-lg hover:bg-purple-100">
            All Organizers
          </Link>
          <Link
            to="/admin/dashboard/attendee"
            className="block py-2 px-4 rounded-lg hover:bg-purple-100">
            All Attendees
          </Link>
          {/* <Link
            to="/admin/dashboard/events"
            className="block py-2 px-4 rounded-lg hover:bg-purple-100">
            All Events
          </Link> */}
          <Link
            to="/admin/dashboard/tickets"
            className="block py-2 px-4 rounded-lg hover:bg-purple-100">
            All Tickets
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

        {admin ? (
          <>
            {/* Profile Card */}
            <div className="bg-white shadow-md rounded-xl p-6 flex items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                {admin.name ? admin.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{admin.name}</h2>
                <p className="text-gray-500">{admin.email}</p>
              </div>
            </div>

            {/* Stats Section */}
            {location.pathname === "/admin/dashboard" && (
              <div>
                <div className="flex justify-between mb-8">
                  <div className="bg-white p-6 md:w-[250px] rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">Total Organizer</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {organizer.length}
                    </p>
                  </div>
                  <div className="bg-white p-6 md:w-[250px] rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">Total Attendee</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {attendee.length}
                    </p>
                  </div>

                  <div className="bg-white p-6 md:w-[250px] rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">Total Tickets</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {ticket.length}
                    </p>
                  </div>

                  <div className="bg-white p-6 md:w-[250px] rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">Total Events</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {event.length}
                    </p>
                  </div>
                </div>

                {/* All Events List */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-4">All Events</h3>
                  {event.length > 0 ? (
                    <div className="space-y-4">
                      {event.map((ev) => (
                        <div
                          key={ev._id}
                          className="p-4 border rounded-lg hover:shadow-md">
                          <div className="flex justify-between items-center">
                            <p className="font-bold">{ev.name}</p>
                            <p className="text-purple-600 font-semibold">
                              ${ev.price}
                            </p>
                          </div>
                          <p className="text-gray-500">{ev.description}</p>
                          <p className="text-sm text-gray-400">
                            {ev.genre} • {ev.category} • {ev.type}
                          </p>
                          <button
                            className="mt-2 bg-red-400 text-white px-4 py-1 rounded hover:bg-red-600"
                            onClick={() => handleDeleteEvent(ev._id)}
                            disabled={loading}>
                            {loading ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No event available</p>
                  )}
                </div>
              </div>
            )}

            {/* All Available Organizer List */}
            {/* Stats Section */}
            {location.pathname === "/admin/dashboard/organizer" && (
              <div>
                {/* All Organizer List */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-4">All Organizers</h3>
                  {organizer.length > 0 ? (
                    <div className="space-y-4">
                      {organizer.map((or) => (
                        <div
                          key={or._id}
                          className="p-4 border rounded-lg hover:shadow-md">
                          <div className="flex justify-between items-center">
                            <p className="font-bold">{or.name}</p>
                            <p className="text-purple-600 font-semibold">
                              ${or.email}
                            </p>
                          </div>
                          <button
                            className="mt-2 bg-red-400 text-white px-4 py-1 rounded hover:bg-red-600"
                            onClick={() => handleDeleteOrganizer(or._id)}
                            disabled={loading}>
                            {loading ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No organizer available</p>
                  )}
                </div>
              </div>
            )}

            {/* All Available Attendee List */}
            {/* Stats Section */}
            {location.pathname === "/admin/dashboard/attendee" && (
              <div>
                {/* All Organizer List */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-4">All Attendee</h3>
                  {attendee.length > 0 ? (
                    <div className="space-y-4">
                      {attendee.map((at) => (
                        <div
                          key={at._id}
                          className="p-4 border rounded-lg hover:shadow-md">
                          <div className="flex justify-between items-center">
                            <p className="font-bold">{at.name}</p>
                            <p className="text-purple-600 font-semibold">
                              ${at.email}
                            </p>
                          </div>
                          <button
                            className="mt-2 bg-red-400 text-white px-4 py-1 rounded hover:bg-red-600"
                            onClick={() => handleDeleteAttendee(at._id)}
                            disabled={loading}>
                            {loading ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No organizer available</p>
                  )}
                </div>
              </div>
            )}
            {/* All Bought Tickets List */}
            {location.pathname === "/admin/dashboard/tickets" && (
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
                              {tk.event?.type} •{tk.status} •{}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Booked by {tk.userID?.name} ({tk.userID?.email})
                            </p>
                          </div>
                          <button
                            className="mt-2 bg-red-400 text-white px-4 py-1 rounded hover:bg-red-600"
                            onClick={() => handleDeleteTicket(tk._id)}
                            disabled={loading}>
                            {loading ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No available tickets</p>
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

export default AdminDashboard;
