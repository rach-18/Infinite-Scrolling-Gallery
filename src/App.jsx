import React from "react";
import Gallery from "./components/Gallery";
import "./App.css"

const App = () => {
  return (
    <div className="App">
      <h1>Infinite Scrolling Gallery</h1>
      <Gallery />
    </div>
  );
};

export default App;