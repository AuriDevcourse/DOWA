import './App.css'
<<<<<<< Updated upstream
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/layout/Header.jsx"
import UpdateTracker from "@/components/layout/UpdateTracker.jsx"
import Departments from "@/pages/Departments.jsx"
import OrgChart from "@/pages/OrgChart.jsx"
import DepartmentTimeline from "@/pages/DepartmentTimeline.jsx"
import ProcessImport from "@/pages/ProcessImport.jsx"
import AddEvent from "@/pages/AddEvent.jsx"
import Settings from "@/pages/Settings.jsx"
import EmployeeBenefits from "@/pages/EmployeeBenefits.jsx"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <main className="pt-24">
          <Routes>
            <Route path="/" element={<Navigate to="/departments" replace />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/org-chart" element={<OrgChart />} />
            <Route path="/department-timeline" element={<DepartmentTimeline />} />
            <Route path="/processimport" element={<ProcessImport />} />
            <Route path="/addevent" element={<AddEvent />} />
            <Route path="/employee-benefits" element={<EmployeeBenefits />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <UpdateTracker />
      </div>
=======
import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Layout from '@/pages/Layout.jsx'
import Departments from '@/pages/Departments.jsx'
import DepartmentTimeline from '@/pages/DepartmentTimeline.jsx'
import Team from '@/pages/Team.jsx'
import Settings from '@/pages/Settings.jsx'
import AddEvent from '@/pages/AddEvent.jsx'
import Import from '@/pages/Import.jsx'
import ProcessImport from '@/pages/ProcessImport.jsx'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout><Departments /></Layout>} />
        <Route path="/departments" element={<Layout><Departments /></Layout>} />
        <Route path="/department-timeline" element={<Layout><DepartmentTimeline /></Layout>} />
        <Route path="/team" element={<Layout><Team /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/add-event" element={<Layout><AddEvent /></Layout>} />
        <Route path="/import" element={<Layout><Import /></Layout>} />
        <Route path="/process-import" element={<Layout><ProcessImport /></Layout>} />
      </Routes>
>>>>>>> Stashed changes
      <Toaster />
    </BrowserRouter>
  )
}

export default App 