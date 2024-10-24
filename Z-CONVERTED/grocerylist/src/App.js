import './App.css';  // Import the CSS file for styling the App component
import Header from "./components/Header.js";  // Import the Header component from the components folder
import Body from "./components/Body.js";  // Import the Body component from the components folder
import Footer from "./components/Footer.js";  // Import the Footer component from the components folder

// Define the main App component
function App() {

  // Define a constant for the background image URL
  const backgroundImage = "https://pixvid.org/images/2024/10/03/grocery-list-background.webp";  
  // Define a constant for the logo image URL
  const logoImage = "https://pixvid.org/images/2024/10/02/imagea30e0a95662e6a70.png";  
  // Define a constant for the title of the grocery list
  const title = "Grocery List";  

  // The component returns the following JSX structure
  return (
    <>
    {/* Parent div that holds the entire app layout */}
    <div>
      {/* Render the Header component, passing backgroundImage and logoImage as props */}
      <Header backgroundImage={backgroundImage} logoImage={logoImage} />

      {/* Main content container */}
      <div className="Container">
        {/* Render the Body component and pass the title as a prop */}
        <Body title={title} />

        {/* Render the Footer component */}
        <Footer />
      </div>
    </div>
    </>
  );
}

export default App; // Export the App component as the default export of this file