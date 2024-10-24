import React, { useState, useEffect } from "react";  // Import React and useState, useEffect hooks
import "../styles/Body.css";  // Import CSS file for styling
import Modal from "./Modal";  // Import the Modal component
import DetailsModal from "./DetailsModal";  // Import the DetailsModal component
import Apple from "../images/products/fruits/apple.jpg";  // Import image for Apple
import Carrot from "../images/products/vegetables/carrot.jpg";  // Import image for Carrot
import Banana from "../images/products/fruits/banana.jpg";  // Import image for Banana
import Broccoli from "../images/products/vegetables/broccoli.jpg";  // Import image for Broccoli

// Define a static array of product objects with id, name, quantity, price, image, and category
const staticProducts = [
  { id: 1, name: "Apple", quantity: "10", price: "20", image: Apple, category: "Fruits" },
  { id: 2, name: "Carrot", quantity: "15", price: "10", image: Carrot, category: "Vegetables" },
  { id: 3, name: "Banana", quantity: "12", price: "15", image: Banana, category: "Fruits" },
  { id: 4, name: "Broccoli", quantity: "8", price: "25", image: Broccoli, category: "Vegetables" },
];

// Main Body component that accepts 'title' as a prop
function Body({ title }) {
  
  const [listItems, setListItems] = useState(staticProducts);  // State to manage the list of items, initialized with staticProducts

  // State to manage the form input (item details) and track if an item is being edited
  const [item, setItem] = useState({ name: "", quantity: "", price: "", image: "", category: "", editIndex: null });

  const [isModalOpen, setIsModalOpen] = useState(false);  // State to control if the add/edit modal is open

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);  // State to control if the details modal is open

  const [selectedItem, setSelectedItem] = useState(null);  // State to store the item selected for viewing details

  // useEffect to load the items from localStorage when the component mounts
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("groceryList")) || [];  // Retrieve items from localStorage or fallback to staticProducts
    setListItems(storedItems.length ? storedItems : staticProducts);  // Set listItems state with stored or static data
  }, []);  // Empty dependency array, so it runs only on mount

  // useEffect to save the updated listItems to localStorage whenever the listItems state changes
  useEffect(() => {
    localStorage.setItem("groceryList", JSON.stringify(listItems));  // Store the listItems in localStorage
  }, [listItems]);  // Dependency on listItems, so it triggers whenever listItems changes

  // Function to handle adding or editing an item
  const handleAddItem = () => {
    // Only proceed if the form fields are not empty
    if (item.name.trim() !== "" && item.quantity.trim() !== "" && item.price.trim() !== "" && item.category) {
      // Create new item, using the editIndex for editing or creating a new id
      const newItem = {
        id: item.editIndex !== null ? item.editIndex : listItems.length + 1,  // Use editIndex for existing item or create new id
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        category: item.category,
      };

      // If editing, replace the existing item; otherwise, add the new one
      const updatedItems = item.editIndex !== null
        ? listItems.map((existingItem) => (existingItem.id === item.editIndex ? newItem : existingItem))
        : [...listItems, newItem];

      setListItems(updatedItems);  // Update the listItems state
      setItem({ name: "", quantity: "", price: "", image: "", category: "", editIndex: null });  // Reset the form fields
      setIsModalOpen(false);  // Close the modal
    }
  };

  // Function to handle editing an item (opens modal with pre-filled data)
  const handleEditItem = (id) => {
    const itemToEdit = listItems.find((item) => item.id === id);  // Find the item to edit by id
    if (itemToEdit) {
      const { name, quantity, price, image, category } = itemToEdit;  // Extract the properties of the item
      setItem({ name, quantity, price, image, category, editIndex: id });  // Set the form with the existing item data
      setIsModalOpen(true);  // Open the modal for editing
    }
  };

  // Function to view the details of a selected item (opens details modal)
  const handleViewDetails = (id) => {
    const itemToView = listItems.find((item) => item.id === id);  // Find the item to view by id
    if (itemToView) {
      setSelectedItem(itemToView);  // Set the selected item state
      setIsDetailsModalOpen(true);  // Open the details modal
    }
  };

  // Function to delete an item from the list
  const handleDeleteItem = (id) => {
    setListItems(listItems.filter((item) => item.id !== id));  // Remove the item with the given id from listItems
  };

  // Return the JSX structure for the Body component
  return (
    <div className="body-container">
      <h2 className="body-title">{title}</h2>  {/* Display the title prop */}
      <hr className="green-line" />  {/* Decorative line */}
      
      {/* Iterate over different categories */}
      {["Fruits", "Vegetables", "Other"].map((category) => (
        <div key={category}>
          <h3>{category}</h3>  {/* Display the category name */}
          <div className="dynamic-list">
            {listItems
              .filter((item) => item.category === category)  // Filter items by category
              .map((item) => (
                <div key={item.id} className="list-item" onClick={() => handleViewDetails(item.id)}>  {/* Clickable item div */}
                  <span className="item-text">{item.name} - {item.quantity}x - ₱{item.price}</span>  {/* Display item details */}
                  <div className="button-group">
                    <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEditItem(item.id); }}>Edit</button>  {/* Edit button */}
                    <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}>Delete</button>  {/* Delete button */}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Add new list button */}
      <button className="add-list-button" onClick={() => { setItem({ name: "", quantity: "", price: "", image: "", category: "", editIndex: null }); setIsModalOpen(true); }}>
        Add New List
      </button>

      {/* Modal for adding/editing an item */}
      <Modal
        isOpen={isModalOpen}  // Pass if modal is open
        onClose={() => setIsModalOpen(false)}  // Close modal function
        onSubmit={handleAddItem}  // Handle form submission
        item={item}  // Pass current item details to the modal
        setItem={setItem}  // Function to update form fields
      />

      {/* Details modal for viewing an item */}
      <DetailsModal
        isOpen={isDetailsModalOpen}  // Pass if details modal is open
        onClose={() => setIsDetailsModalOpen(false)}  // Close details modal function
        item={selectedItem}  // Pass selected item to the details modal
      />
    </div>
  );
}

export default Body;  // Export the Body component as default