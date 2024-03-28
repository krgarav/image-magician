import { Routes, Route, Navigate, Router } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Merger from "./pages/Merger/Merger";
import TemplateEditor from "./pages/TemplateEditor/TemplateEditor";
import Textify from "./pages/Textify/Textify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/Cropper" element={<Homepage />} />
        <Route path="/Merger" element={<Merger />} />
        <Route path="Template Editor" element={<TemplateEditor />} />
        <Route path="Textify" element={<Textify />} />
        <Route path="*" element={<Navigate to="/Cropper" />} />
      </Routes>
    </>
  );
}

export default App;
