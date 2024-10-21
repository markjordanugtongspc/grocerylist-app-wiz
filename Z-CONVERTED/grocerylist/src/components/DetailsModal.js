import React from 'react';
import "../styles/DetailsModal.css"; // Ensure correct import for CSS
import { FaTimes } from 'react-icons/fa'; // Ensure react-icons is installed

const DetailsModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Item Details</h2>
          <FaTimes className="modal-close-icon" onClick={onClose} aria-label="Close modal" />
        </div>
        <div className="modal-body">
          <p><strong>Name:</strong> {item.name}</p>
          <p><strong>Quantity:</strong> {item.quantity}</p>
          <p><strong>Price:</strong> ₱{item.price}</p>
          {item.image && <img src={item.image} alt={item.name} className="uploaded-image" />}
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
