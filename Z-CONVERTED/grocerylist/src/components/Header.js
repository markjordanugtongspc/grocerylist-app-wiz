import "../styles/Header.css";  // Import CSS styles specific to the Header component.
import React from "react";  // Import React to use JSX.

function Header(props) {
  return (
    <header className="header" style={{ backgroundImage: `url(${props.backgroundImage})` }}>
      {/* Render the background image using the backgroundImage prop */}
      <div className="img1">
        {/* Render the logo image using the logoImage prop */}
        <img
          src={props.logoImage}
          alt="Logo"
          className="logo-img"
        />
      </div>
    </header>
  );
}

export default Header;  // Export the Header component for use in other parts of the app.