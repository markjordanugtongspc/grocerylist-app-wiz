import React from 'react';  // Import React for JSX usage.
import "../styles/Modal.css";  // Import the CSS file for the Modal component styling.

const Modal = ({ isOpen, onClose, onSubmit, item, setItem }) => {
  // If the modal is not open, return null and do not render anything.
  if (!isOpen) return null;

  // Function to handle form submission.
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent the default form submission behavior.
    onSubmit();  // Call the onSubmit function passed as a prop from the parent (Body component).
  };

  // Function to handle image file selection.
  const handleImageChange = (e) => {
    const file = e.target.files[0];  // Get the selected file from the input.
    if (file) {
      const imageUrl = URL.createObjectURL(file);  // Create a temporary URL for the image file.
      setItem({ ...item, image: imageUrl });  // Update the item state with the selected image URL.
    }
  };

  return (
    // Modal overlay that triggers the onClose function when clicked (outside the modal content).
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal content. The e.stopPropagation prevents the modal from closing when clicking inside the modal content. */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal title that changes based on whether an item is being edited or added */}
        <h2 className="modal-title">
          {item.editIndex !== null ? 'Edit Item' : 'Add New Item'}
        </h2>

        {/* Form for adding or editing an item */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Input for product name */}
          <input
            type="text"
            value={item.name}  // Set the value to the current item name.
            onChange={(e) => setItem({ ...item, name: e.target.value })}  // Update the name in item state.
            placeholder="Product Name"
            className="modal-input"
            required  // Make the input required.
          />

          {/* Input for product quantity */}
          <input
            type="number"
            value={item.quantity}  // Set the value to the current item quantity.
            onChange={(e) => setItem({ ...item, quantity: e.target.value })}  // Update the quantity in item state.
            placeholder="Quantity"
            className="modal-input"
            required  // Make the input required.
          />

          {/* Input for product price */}
          <input
            type="number"
            value={item.price}  // Set the value to the current item price.
            onChange={(e) => setItem({ ...item, price: e.target.value })}  // Update the price in item state.
            placeholder="Price"
            className="modal-input"
            required  // Make the input required.
          />

          {/* Input for selecting an image file */}
          <input
            type="file"
            accept="image/*"  // Accept only image file types.
            onChange={handleImageChange}  // Call the function to handle image selection.
            className="modal-input"
          />

          {/* If an image has been selected, display the preview */}
          {item.image && <img src={item.image} alt="Product" className="uploaded-image" />}

          {/* Button group for form submission and closing the modal */}
          <div className="modal-button-group">
            {/* Submit button changes text based on if editing or adding */}
            <button type="submit" className="modal-submit-button">
              {item.editIndex !== null ? 'Update Item' : 'Add Item'}
            </button>

            {/* Close button for closing the modal without submitting */}
            <button type="button" className="modal-close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;  // Export the Modal component for use in other parts of the app.