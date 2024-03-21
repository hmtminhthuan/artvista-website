import { useEffect, useState } from "react";
import { CategoryDTO } from "@/models/CategoryDTO";
import { CategoryService } from "@/services/CategoryService";
import Layout from "@/components/Layout";
import { Modal, Button, Toast } from "react-bootstrap";
import Guard from "@/components/Guard";

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [currentCategories, setCurrentCategories] = useState<CategoryDTO[]>([]);

  const [editedCategory, setEditedCategory] = useState<Partial<CategoryDTO>>(
    {}
  );
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<CategoryDTO>({
    categoryId: "string",
    categoryName: "",
    updatedDate: "2024-03-12T06:43:45.718Z",
    updatedBy: "string",
    type: "",
    quantity: 0,
    note: "",
  });

  const [deleteCategory, setDeleteCategory] = useState<CategoryDTO | undefined>(
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
    fetchCategories();
  }, []);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentCategories(categories.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      // Fetch categories from API
      const response = await CategoryService.getAllCategories();
      if (response.isSuccess && Array.isArray(response.result)) {
        setCategories(response.result);
        setTotalPages(Math.ceil(response.result.length / itemsPerPage));
        setCurrentPage(1);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEdit = (category: CategoryDTO) => {
    setEditedCategory(category);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await CategoryService.updateCategory(
        editedCategory as CategoryDTO
      );
      if (response.isSuccess) {
        fetchCategories();
        setEditModalOpen(false);
        setShowToast(true);
        setToastMessage("Category updated successfully");
        setToastVariant("success");
      } else {
        console.error("Error updating category:", response.message);
        setShowToast(true);
        setToastMessage("Failed to update category");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setShowToast(true);
      setToastMessage("Failed to update category");
      setToastVariant("danger");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await CategoryService.createNewCategory(newCategory);
      if (response.isSuccess) {
        setAddModalOpen(false);
        setShowToast(true);
        setToastMessage("Category added successfully");
        setToastVariant("success");
      } else {
        console.error("Error adding category:", response.message);
        setShowToast(true);
        setToastMessage("Failed to add category");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setShowToast(true);
      setToastMessage("Failed to add category");
      setToastVariant("danger");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await CategoryService.deleteCategoryByID(
        deleteCategory?.categoryId ?? ""
      );
      if (response.isSuccess) {
        fetchCategories();
        setConfirmDeleteModalOpen(false);
        setShowToast(true);
        setToastMessage("Category deleted successfully");
        setToastVariant("success");
      } else {
        console.error("Error deleting category:", response.message);
        setShowToast(true);
        setToastMessage("Failed to delete category");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setShowToast(true);
      setToastMessage("Failed to delete category");
      setToastVariant("danger");
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="mb-4">Category Page</h1>
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
              <th>Name</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category) => (
              <tr key={category.categoryId}>
                <td>{category.categoryId}</td>
                <td>{category.categoryName}</td>
                <td>{category.type}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => {
                      setDeleteCategory(category);
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
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form fields for editing */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={editedCategory.categoryName}
              onChange={(e) =>
                setEditedCategory({
                  ...editedCategory,
                  categoryName: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Type
            </label>
            <input
              type="text"
              className="form-control"
              id="type"
              value={editedCategory.type}
              onChange={(e) =>
                setEditedCategory({ ...editedCategory, type: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              value={editedCategory.quantity}
              onChange={(e) =>
                setEditedCategory({
                  ...editedCategory,
                  quantity: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="note" className="form-label">
              Note
            </label>
            <textarea
              className="form-control"
              id="note"
              value={editedCategory.note}
              onChange={(e) =>
                setEditedCategory({ ...editedCategory, note: e.target.value })
              }
            ></textarea>
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
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form fields for adding */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={newCategory.categoryName}
              onChange={(e) =>
                setNewCategory({ ...newCategory, categoryName: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Type
            </label>
            <input
              type="text"
              className="form-control"
              id="type"
              value={newCategory.type}
              onChange={(e) =>
                setNewCategory({ ...newCategory, type: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              value={newCategory.quantity}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  quantity: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="note" className="form-label">
              Note
            </label>
            <textarea
              className="form-control"
              id="note"
              value={newCategory.note}
              onChange={(e) =>
                setNewCategory({ ...newCategory, note: e.target.value })
              }
            ></textarea>
          </div>
          {/* Add other form fields here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Category
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
        <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
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

export default Guard(CategoryPage);

