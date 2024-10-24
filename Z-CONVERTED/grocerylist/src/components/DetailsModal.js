import React from 'react';  // Import React
import "../styles/DetailsModal.css";  // Import the CSS for styling
import { FaTimes } from 'react-icons/fa';  // Import the close icon (FaTimes) from react-icons

// Define the DetailsModal component, which accepts isOpen (whether the modal is shown), onClose (function to close it), and item (the product details)
const DetailsModal = ({ isOpen, onClose, item }) => {
  // If the modal is not open or no item is selected, return null (don't render anything)
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>  {/* Overlay that covers the screen and closes modal when clicked */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>  {/* Modal content area, click is stopped from closing modal */}
        <div className="modal-header">
          <h2 className="modal-title">Item Details</h2>  {/* Modal title */}
          <FaTimes className="modal-close-icon" onClick={onClose} aria-label="Close modal" />  {/* Close icon that triggers onClose */}
        </div>
        <div className="modal-body">
          <p><strong>Name:</strong> {item.name}</p>  {/* Display item name */}
          <p><strong>Quantity:</strong> {item.quantity}</p>  {/* Display item quantity */}
          <p><strong>Price:</strong> ₱{item.price}</p>  {/* Display item price */}
          {item.image && <img src={item.image} alt={item.name} className="uploaded-image" />}  {/* Display item image if it exists */}
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;  // Export the DetailsModal component