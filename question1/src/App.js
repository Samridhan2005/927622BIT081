import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockPage from "./pages/StockPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StockPage />} />
      </Routes>
    </Router>
  );
}

export default App;
