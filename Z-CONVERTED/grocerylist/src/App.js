import './App.css';  // Import global styles for the app.
import Header from "./components/Header.js";  // Import the Header component.
import Body from "./components/Body.js";  // Import the Body component.
import Footer from "./components/Footer.js";  // Import the Footer component.

function App() {
  // Variables to hold data that will be passed as props to child components.
  const backgroundImage = "https://pixvid.org/images/2024/10/03/grocery-list-background.webp";  // Background image URL.
  const logoImage = "https://pixvid.org/images/2024/10/02/imagea30e0a95662e6a70.png";  // Logo image URL.
  const title = "Grocery List";  // Title for the Body component.

  return (
    <>
    <div>
      {/* Pass backgroundImage and logoImage as props to the Header component */}
      <Header backgroundImage={backgroundImage} logoImage={logoImage} />

      <div className="Container">
        {/* Pass title as a prop to the Body component */}
        <Body title={title} />

        {/* Render Footer component (no props needed here) */}
        <Footer />
      </div>
    </div>
    </>
  );
}

export default App;  // Export the App component to be used as the main component in the application.
