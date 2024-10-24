import React from 'react';  // Import React
import "../styles/Modal.css";  // Import CSS for styling

// Define the Modal component, which accepts isOpen (to control visibility), onClose (function to close it), onSubmit (form submission handler), item (product details), and setItem (function to update the item)
const Modal = ({ isOpen, onClose, onSubmit, item, setItem }) => {

  // If the modal is not open, return null (don't render anything)
  if (!isOpen) return null;

  // Handle form submission (prevents page reload and calls onSubmit function)
  const handleSubmit = (e) => {
    e.preventDefault();  
    onSubmit();  
  };

  // Handle image input change (creates a preview of the selected image)
  const handleImageChange = (e) => {
    const file = e.target.files[0];  // Get the first file selected
    if (file) {
      const imageUrl = URL.createObjectURL(file);  // Create a local URL for the image
      setItem({ ...item, image: imageUrl });  // Update the item state with the new image
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>  {/* Modal overlay that closes modal on click */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>  {/* Modal content, click is stopped from closing the modal */}
        
        <h2 className="modal-title">
          {item.editIndex !== null ? 'Edit Item' : 'Add New Item'}  {/* Display "Edit" or "Add New" based on whether editing or adding */}
        </h2>

        <form onSubmit={handleSubmit} className="modal-form">
          
          {/* Input for item name */}
          <input
            type="text"
            value={item.name}  // Bind to item.name
            onChange={(e) => setItem({ ...item, name: e.target.value })}  // Update item state on change
            placeholder="Product Name"
            className="modal-input"
            required  // Field is required
          />

          {/* Input for item quantity */}
          <input
            type="number"
            value={item.quantity}  // Bind to item.quantity
            onChange={(e) => setItem({ ...item, quantity: e.target.value })}  // Update item state on change
            placeholder="Quantity"
            className="modal-input"
            required  // Field is required
          />

          {/* Input for item price */}
          <input
            type="number"
            value={item.price}  // Bind to item.price
            onChange={(e) => setItem({ ...item, price: e.target.value })}  // Update item state on change
            placeholder="Price"
            className="modal-input"
            required  // Field is required
          />

          {/* Dropdown for category selection */}
          <select
            value={item.category || ""}  // Bind to item.category
            onChange={(e) => setItem({ ...item, category: e.target.value })}  // Update item state on change
            className="modal-input"
            required  // Field is required
          >
            <option value="" disabled>Select Category</option>  {/* Default option */}
            <option value="Fruits">Fruits</option>  {/* Fruits category option */}
            <option value="Vegetables">Vegetables</option>  {/* Vegetables category option */}
            <option value="Other">Other</option>  {/* Other category option */}
          </select>

          {/* Input for selecting an image file */}
          <input
            type="file"
            accept="image/*"  // Accept only image files
            onChange={handleImageChange}  // Call handleImageChange when file is selected
            className="modal-input"
          />

          {/* Display the uploaded image if available */}
          {item.image && <img src={item.image} alt="Product" className="uploaded-image" />}

          {/* Modal button group for submitting or closing the modal */}
          <div className="modal-button-group">
            <button type="submit" className="modal-submit-button">
              {item.editIndex !== null ? 'Update Item' : 'Add Item'}  {/* Show "Update" if editing, otherwise "Add" */}
            </button>

            <button type="button" className="modal-close-button" onClick={onClose}>
              Close  {/* Close button to close the modal */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;  // Export the Modal component