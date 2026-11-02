import { GraduationCap } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <GraduationCap size={30} />
        <h2>StudyMate</h2>
      </div>

      <p>Student Task Manager</p>
    </nav>
  );
}

export default Navbar;