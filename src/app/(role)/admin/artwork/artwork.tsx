import React, { useEffect, useState } from "react";
import { ArtworkDTO } from "@/models/ArtWorkDTO";
import { ArtWorkService } from "@/services/ArtWorkService";
import Layout from "@/components/Layout";
import { Modal, Button, Toast } from "react-bootstrap";
import Guard from "@/components/Guard";

const Artwork: React.FC = () => {
  const [artworks, setArtworks] = useState<ArtworkDTO[]>([]);
  const [currentArtworks, setCurrentArtworks] = useState<ArtworkDTO[]>([]);

  const [editedArtwork, setEditedArtwork] = useState<Partial<ArtworkDTO>>({});
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newArtwork, setNewArtwork] = useState<ArtworkDTO>({
    artworkName: "",
    price: 0,
    discount: 0,
    status: "",
  });

  const [deleteArtwork, setDeleteArtwork] = useState<ArtworkDTO | undefined>(
    undefined
  );
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentArtworks(artworks.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage]);

  const fetchArtworks = async () => {
    try {
      // Fetch artworks from API
      const response = await ArtWorkService.getAllArtworks();
      if (response.isSuccess && Array.isArray(response.result)) {
        setArtworks(response.result);
        setTotalPages(Math.ceil(response.result.length / itemsPerPage));
        setCurrentPage(1);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  const handleEdit = (artwork: ArtworkDTO) => {
    setEditedArtwork(artwork);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await ArtWorkService.updateArtwork(
        editedArtwork as ArtworkDTO
      );
      if (response.isSuccess) {
        fetchArtworks();
        setEditModalOpen(false);
        setShowToast(true);
        setToastMessage("Artwork updated successfully");
        setToastVariant("success");
      } else {
        console.error("Error updating artwork:", response.message);
        setShowToast(true);
        setToastMessage("Failed to update artwork");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error updating artwork:", error);
      setShowToast(true);
      setToastMessage("Failed to update artwork");
      setToastVariant("danger");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await ArtWorkService.createNewArtwork(newArtwork);
      if (response.isSuccess) {
        setAddModalOpen(false);
        setShowToast(true);
        setToastMessage("Artwork added successfully");
        setToastVariant("success");
      } else {
        console.error("Error adding artwork:", response.message);
        setShowToast(true);
        setToastMessage("Failed to add artwork");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error adding artwork:", error);
      setShowToast(true);
      setToastMessage("Failed to add artwork");
      setToastVariant("danger");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await ArtWorkService.deleteArtworkByID(
        deleteArtwork?.artworkId ?? "",
        true
      );
      if (response.isSuccess) {
        fetchArtworks();
        setConfirmDeleteModalOpen(false);
        setShowToast(true);
        setToastMessage("Artwork deleted successfully");
        setToastVariant("success");
      } else {
        console.error("Error deleting artwork:", response.message);
        setShowToast(true);
        setToastMessage("Failed to delete artwork");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error deleting artwork:", error);
      setShowToast(true);
      setToastMessage("Failed to delete artwork");
      setToastVariant("danger");
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="mb-4">Artwork Page</h1>
        <button
          type="button"
          className="btn btn-primary mt-1 mb-3"
          onClick={() => setAddModalOpen(true)}
        >
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Artwork Name</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentArtworks.map((artwork) => (
              <tr key={artwork.artworkId}>
                <td>{artwork.artworkId}</td>
                <td>{artwork.artworkName}</td>
                <td>{artwork.price}</td>
                <td>{artwork.discount}</td>
                <td>{artwork.status}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleEdit(artwork)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => {
                      setDeleteArtwork(artwork);
                      setConfirmDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination component */}
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(1)}>
              First
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
          </li>
          {/* Render pagination items based on totalPages */}
          {Array.from({ length: totalPages }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </li>
          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(totalPages)}
            >
              Last
            </button>
          </li>
        </ul>
      </nav>

      {/* Bootstrap Modal for Editing */}
      <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Artwork</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form fields for editing */}
          <div className="mb-3">
            <label htmlFor="artworkId" className="form-label">
              Artwork ID
            </label>
            <input
              type="text"
              className="form-control"
              id="artworkId"
              value={editedArtwork.artworkId}
              onChange={(e) =>
                setEditedArtwork({
                  ...editedArtwork,
                  artworkId: e.target.value,
                })
              }
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="artworkName" className="form-label">
              Artwork Name
            </label>
            <input
              type="text"
              className="form-control"
              id="artworkName"
              value={editedArtwork.artworkName}
              onChange={(e) =>
                setEditedArtwork({
                  ...editedArtwork,
                  artworkName: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              value={editedArtwork.price}
              onChange={(e) =>
                setEditedArtwork({
                  ...editedArtwork,
                  price: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="discount" className="form-label">
              Discount
            </label>
            <input
              type="number"
              className="form-control"
              id="discount"
              value={editedArtwork.discount}
              onChange={(e) =>
                setEditedArtwork({
                  ...editedArtwork,
                  discount: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              className="form-select"
              id="status"
              value={editedArtwork.status}
              onChange={(e) =>
                setEditedArtwork({ ...editedArtwork, status: e.target.value })
              }
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
          {/* Add other form fields here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bootstrap Modal for Adding */}
      <Modal show={addModalOpen} onHide={() => setAddModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Artwork</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form fields for adding */}
          <div className="mb-3">
            <label htmlFor="artworkName" className="form-label">
              Artwork Name
            </label>
            <input
              type="text"
              className="form-control"
              id="artworkName"
              value={newArtwork.artworkName}
              onChange={(e) =>
                setNewArtwork({ ...newArtwork, artworkName: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              value={newArtwork.price}
              onChange={(e) =>
                setNewArtwork({
                  ...newArtwork,
                  price: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="discount" className="form-label">
              Discount
            </label>
            <input
              type="number"
              className="form-control"
              id="discount"
              value={newArtwork.discount}
              onChange={(e) =>
                setNewArtwork({
                  ...newArtwork,
                  discount: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              className="form-select"
              id="status"
              value={newArtwork.status}
              onChange={(e) =>
                setNewArtwork({ ...newArtwork, status: e.target.value })
              }
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
          {/* Add other form fields here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Artwork
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bootstrap Modal for Confirming Delete */}
      <Modal
        show={confirmDeleteModalOpen}
        onHide={() => setConfirmDeleteModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this artwork?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setConfirmDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bootstrap Toast */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 9999, // Adjust z-index as needed
        }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Header
            closeButton={false}
            className={`text-white bg-${toastVariant}`}
          >
            <strong className="me-auto">Message</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>
    </Layout>
  );
};

export default Guard(Artwork);