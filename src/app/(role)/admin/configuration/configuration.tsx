import { useEffect, useState } from "react";
import { ConfigurationDTO } from "@/models/ConfigurationDTO";
import { ConfigurationService } from "@/services/ConfigurationService";
import Layout from "@/components/Layout";
import { Modal, Button, Toast } from "react-bootstrap";
import Guard from "@/components/Guard";

const Home: React.FC = () => {
  const [configurations, setConfigurations] = useState<ConfigurationDTO[]>([]);
  const [currentConfigurations, setCurrentConfigurations] = useState<
    ConfigurationDTO[]
  >([]);

  const [editedConfiguration, setEditedConfiguration] = useState<
    Partial<ConfigurationDTO>
  >({});
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newConfiguration, setNewConfiguration] = useState<ConfigurationDTO>({
    configurationId: "",
    commisionFee: 0,
    appliedDate: "",
    status: "",
    id: "",
  });

  const [deleteConfiguration, setDeleteConfiguration] = useState<
    ConfigurationDTO | undefined
  >(undefined);
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
    fetchConfigurations();
  }, []);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentConfigurations(
      configurations.slice(indexOfFirstItem, indexOfLastItem)
    );
  }, [currentPage]);

  const fetchConfigurations = async () => {
    try {
      // Fetch configurations from API
      const response = await ConfigurationService.getAllConfigurations();
      if (response.isSuccess && Array.isArray(response.result)) {
        setConfigurations(response.result);
        setTotalPages(Math.ceil(response.result.length / itemsPerPage));
        setCurrentPage(1);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching configurations:", error);
    }
  };

  const handleEdit = (configuration: ConfigurationDTO) => {
    setEditedConfiguration(configuration);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await ConfigurationService.updateConfiguration(
        editedConfiguration as ConfigurationDTO
      );
      if (response.isSuccess) {
        fetchConfigurations();
        setEditModalOpen(false);
        setShowToast(true);
        setToastMessage("Configuration updated successfully");
        setToastVariant("success");
      } else {
        console.error("Error updating configuration:", response.message);
        setShowToast(true);
        setToastMessage(response.message || "Failed to update configuration");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error updating configuration:", error);
      setShowToast(true);
      setToastMessage("Failed to update configuration");
      setToastVariant("danger");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await ConfigurationService.createNewConfiguration(newConfiguration);
      if (response.isSuccess) {
        setAddModalOpen(false);
        setShowToast(true);
        setToastMessage("Configuration added successfully");
        setToastVariant("success");
      } else {
        console.error("Error adding configuration:", response.message);
        setShowToast(true);
        setToastMessage(response.message || "Failed to add configuration");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error adding configuration:", error);
      setShowToast(true);
      setToastMessage("Failed to add configuration");
      setToastVariant("danger");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await ConfigurationService.deleteConfigurationByID(
        deleteConfiguration?.configurationId ?? ""
      );
      if (response.isSuccess) {
        fetchConfigurations();
        setConfirmDeleteModalOpen(false);
        setShowToast(true);
        setToastMessage("Configuration deleted successfully");
        setToastVariant("success");
      } else {
        console.error("Error deleting configuration:", response.message);
        setShowToast(true);
        setToastMessage(response.message || "Failed to delete configuration");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error deleting configuration:", error);
      setShowToast(true);
      setToastMessage("Failed to delete configuration");
      setToastVariant("danger");
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="mb-4">Configuration Page</h1>
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
              <th>Commission Fee</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentConfigurations.map((config) => (
              <tr key={config.configurationId}>
                <td>{config.configurationId}</td>
                <td>{config.commisionFee}</td>
                <td>{config.appliedDate}</td>
                <td>{config.status}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleEdit(config)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => {
                      setDeleteConfiguration(config);
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
          <Modal.Title>Edit Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form fields for editing */}
          <div className="mb-3">
            <label htmlFor="commissionFee" className="form-label">
              Commission Fee
            </label>
            <input
              type="number"
              className="form-control"
              id="commissionFee"
              value={editedConfiguration.commisionFee}
              onChange={(e) =>
                setEditedConfiguration({
                  ...editedConfiguration,
                  commisionFee: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="appliedDate" className="form-label">
              Applied Date
            </label>
            <input
              type="date"
              className="form-control"
              id="appliedDate"
              value={editedConfiguration.appliedDate}
              onChange={(e) =>
                setEditedConfiguration({
                  ...editedConfiguration,
                  appliedDate: e.target.value,
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
              value={editedConfiguration.status}
              onChange={(e) =>
                setEditedConfiguration({
                  ...editedConfiguration,
                  status: e.target.value,
                })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
          <Modal.Title>Add Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form fields for adding */}
          <div className="mb-3">
            <label htmlFor="commissionFee" className="form-label">
              Commission Fee
            </label>
            <input
              type="number"
              className="form-control"
              id="commissionFee"
              value={newConfiguration.commisionFee}
              onChange={(e) =>
                setNewConfiguration({
                  ...newConfiguration,
                  commisionFee: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="appliedDate" className="form-label">
              Applied Date
            </label>
            <input
              type="date"
              className="form-control"
              id="appliedDate"
              value={newConfiguration.appliedDate}
              onChange={(e) =>
                setNewConfiguration({
                  ...newConfiguration,
                  appliedDate: e.target.value,
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
              value={newConfiguration.status}
              onChange={(e) =>
                setNewConfiguration({
                  ...newConfiguration,
                  status: e.target.value,
                })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          {/* Add other form fields here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Configuration
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
        <Modal.Body>
          Are you sure you want to delete this configuration?
        </Modal.Body>
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

export default Guard(Home);
