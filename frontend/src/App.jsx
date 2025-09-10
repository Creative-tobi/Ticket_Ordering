import React from 'react'
import OrganizerDashboard from './Organizer/OrganizerDashboard'
import OrganizerLogin from './Organizer/OrganizerLogin'
import AttendeeLogin from "./Attendee/AttendeeLogin"
import AttendeeRegister from "./Attendee/AttendeeRegister";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AttendeeDashboard from './Attendee/AttendeeDashboard'
import AdminLogin from './Admin/AdminLogin';
import AdminRegistration from './Admin/AdminRegistration';
import AdminDashboard from './Admin/AdminDashboard';
import OrganizerRegister from './Organizer/OrganizerRegister';

const App = () => {
  return (
    <>
      {/* <OrganizerDashboard/>
      <OrganizerLogin /> */}

      <BrowserRouter>
        <Routes>
          <Route path="/organizer/login" element={<OrganizerLogin />} />
          <Route path="/organizer/register" element={<OrganizerRegister />} />
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route
            path="/organizer/dashboard/events"
            element={<OrganizerDashboard />}
          />

          <Route path="/attendee/login" element={<AttendeeLogin />} />
          <Route path="/attendee/register" element={<AttendeeRegister />} />
          <Route path="/attendee/dashboard" element={<AttendeeDashboard />} />
          <Route
            path="/attendee/dashboard/tickets"
            element={<AttendeeDashboard />}
          />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegistration />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard/tickets" element={<AdminDashboard />} />
          <Route path="/admin/dashboard/events" element={<AdminDashboard />} />
          <Route
            path="/admin/dashboard/organizer"
            element={<AdminDashboard />}
          />
          <Route path="/admin/dashboard/attendee" element={<AdminDashboard />} />

          <Route path="/" element={<AttendeeLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
