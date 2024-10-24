import "../styles/Footer.css";  // Import CSS for styling
import React from "react";  // Import React

// Define the Footer component (no props needed)
function Footer() {
  return (
    <div className="Footer">
      {/* Static footer content */}
      <span>Copyright &copy; 2024</span>  {/* Display copyright notice */}
    </div>
  );
}

export default Footer;  // Export the Footer component