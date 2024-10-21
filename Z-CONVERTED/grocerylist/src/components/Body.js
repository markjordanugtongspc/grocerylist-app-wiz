import React, { useState, useEffect } from "react";  // Import React and Hooks for managing state and side effects.
import "../styles/Body.css";  // Import CSS for styling.
import Modal from "./Modal";  // Import the Modal component used for adding/editing items.
import DetailsModal from "./DetailsModal";  // Import DetailsModal to show item details.

function Body({ title }) {
  // State to hold the list of items (grocery list).
  const [listItems, setListItems] = useState([]);
  
  // State to hold the current item being added/edited, with default values for name, quantity, price, image, and editIndex.
  const [item, setItem] = useState({ name: "", quantity: "", price: "", image: "", editIndex: null });

  // State to control the visibility of the modal for adding/editing items.
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State to control the visibility of the details modal for viewing item details.
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // State to store the item selected for viewing details.
  const [selectedItem, setSelectedItem] = useState(null);

  // useEffect to load the list from localStorage when the component mounts (runs only once).
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("groceryList")) || [];
    setListItems(storedItems);  // If items are stored in localStorage, set them to state.
  }, []);  // Empty dependency array means this runs only once after the component mounts.

  // useEffect to save the list to localStorage whenever the listItems state changes.
  useEffect(() => {
    localStorage.setItem("groceryList", JSON.stringify(listItems));  // Store listItems in localStorage.
  }, [listItems]);  // Runs whenever listItems changes.

  // Function to handle adding a new item or editing an existing one.
  const handleAddItem = () => {
    // Check if required fields are not empty.
    if (item.name.trim() !== "" && item.quantity.trim() !== "" && item.price.trim() !== "") {
      const newItem = {
        name: item.name,  // Item name
        quantity: item.quantity,  // Item quantity
        price: item.price,  // Item price
        image: item.image,  // Item image URL (optional)
      };
      
      // Check if editing an item. If editIndex is not null, replace the item at that index.
      const updatedItems = item.editIndex !== null
        ? listItems.map((_, index) => (index === item.editIndex ? newItem : _))
        : [...listItems, newItem];  // If not editing, add the new item to the list.

      setListItems(updatedItems);  // Update the list with the new or edited item.
      setItem({ name: "", quantity: "", price: "", image: "", editIndex: null });  // Reset the input fields.
      setIsModalOpen(false);  // Close the modal after adding the item.
    }
  };

  // Function to handle editing an existing item.
  const handleEditItem = (index) => {
    const { name, quantity, price, image } = listItems[index];  // Get the selected item details.
    setItem({ name, quantity, price, image, editIndex: index });  // Set the item in state with an editIndex.
    setIsModalOpen(true);  // Open the modal to allow editing.
  };

  // Function to handle viewing the details of an item.
  const handleViewDetails = (index) => {
    setSelectedItem(listItems[index]);  // Set the selected item to state for viewing.
    setIsDetailsModalOpen(true);  // Open the details modal.
  };

  // Function to handle deleting an item from the list.
  const handleDeleteItem = (index) => {
    setListItems(listItems.filter((_, i) => i !== index));  // Remove the item at the given index.
  };

  return (
    <div className="body-container">
      {/* Display the title of the component */}
      <h2 className="body-title">{title}</h2>
      
      <hr className="green-line" />
      
      {/* Display the dynamic list of items */}
      <div className="dynamic-list">
        {listItems.map((item, index) => (
          <div key={index} className="list-item" onClick={() => handleViewDetails(index)}>
            {/* Display the item name, quantity, and price */}
            <span className="item-text">{item.name} - {item.quantity}x - ₱{item.price}</span>
            
            {/* Edit and delete buttons for each item */}
            <div className="button-group">
              <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEditItem(index); }}>Edit</button>
              <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteItem(index); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Button to open the modal for adding a new item */}
      <button className="add-list-button" onClick={() => setIsModalOpen(true)}>
        Add New List
      </button>

      {/* Modal for adding or editing an item */}
      <Modal
        isOpen={isModalOpen}  // Controls whether the modal is visible.
        onClose={() => setIsModalOpen(false)}  // Function to close the modal.
        onSubmit={handleAddItem}  // Function to handle adding or editing an item.
        item={item}  // Pass the current item state to the modal.
        setItem={setItem}  // Function to update the item fields in the modal.
      />

      {/* Modal for viewing item details */}
      <DetailsModal
        isOpen={isDetailsModalOpen}  // Controls whether the details modal is visible.
        onClose={() => setIsDetailsModalOpen(false)}  // Function to close the details modal.
        item={selectedItem}  // Pass the selected item to the modal to display details.
      />
    </div>
  );
}

export default Body;  // Export the component for use in other parts of the application.