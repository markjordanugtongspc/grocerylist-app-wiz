import "../styles/Header.css";  // Import CSS for styling
import React from "react";  // Import React

// Define the Header component that accepts props (backgroundImage, logoImage)
function Header(props) {
  return (
    <header className="header" style={{ backgroundImage: `url(${props.backgroundImage})` }}>  {/* Set background image using inline style */}
      <div className="img1">
        <img
          src={props.logoImage}  // Set logo image from props
          alt="Logo"  // Alt text for accessibility
          className="logo-img"  // Apply CSS class to style the logo
        />
      </div>
    </header>
  );
}

export default Header;  // Export the Header component