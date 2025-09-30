import './App.css'
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
      <Toaster />
    </BrowserRouter>
  )
}

export default App 