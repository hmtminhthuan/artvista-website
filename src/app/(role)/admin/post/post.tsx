import { useEffect, useState } from "react";
import { PostDTO } from "@/models/PostDTO";
import { PostService } from "@/services/PostService";
import Layout from "@/components/Layout";
import { Modal, Button, Toast } from "react-bootstrap";
import Guard from "@/components/Guard";

const Post: React.FC = () => {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [currentPosts, setCurrentPosts] = useState<PostDTO[]>([]);

  const [editedPost, setEditedPost] = useState<Partial<PostDTO>>({});
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPost, setNewPost] = useState<PostDTO>({
    postId: "string",
    tittle: "",
    description: "",
    status: "Active",
  });

  const [deletePost, setDeletePost] = useState<PostDTO | undefined>(undefined);
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
    fetchPosts();
  }, []);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentPosts(posts.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      // Fetch posts from API
      const response = await PostService.getAllPosts();
      if (response.isSuccess && Array.isArray(response.result)) {
        setPosts(response.result);
        setTotalPages(Math.ceil(response.result.length / itemsPerPage));
        setCurrentPage(1);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleEdit = (post: PostDTO) => {
    setEditedPost(post);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await PostService.updatePost(editedPost as PostDTO);
      if (response.isSuccess) {
        fetchPosts();
        setEditModalOpen(false);
        setShowToast(true);
        setToastMessage("Post updated successfully");
        setToastVariant("success");
        fetchPosts();
      } else {
        console.error("Error updating post:", response.message);
        setShowToast(true);
        setToastMessage("Failed to update post");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setShowToast(true);
      setToastMessage("Failed to update post");
      setToastVariant("danger");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await PostService.createNewPost(newPost);
      if (response.isSuccess) {
        setAddModalOpen(false);
        setShowToast(true);
        setToastMessage("Post added successfully");
        setToastVariant("success");
        fetchPosts();
      } else {
        console.error("Error adding post:", response.message);
        setShowToast(true);
        setToastMessage("Failed to add post");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      setShowToast(true);
      setToastMessage("Failed to add post");
      setToastVariant("danger");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await PostService.deletePostByID(
        deletePost?.postId ?? ""
      );
      if (response.isSuccess) {
        fetchPosts();
        setConfirmDeleteModalOpen(false);
        setShowToast(true);
        setToastMessage("Post deleted successfully");
        setToastVariant("success");
        fetchPosts();
      } else {
        console.error("Error deleting post:", response.message);
        setShowToast(true);
        setToastMessage("Failed to delete post");
        setToastVariant("danger");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setShowToast(true);
      setToastMessage("Failed to delete post");
      setToastVariant("danger");
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="mb-4">Post Page</h1>
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
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <tr key={post.postId}>
                <td>{post.postId}</td>
                <td>{post.tittle}</td>
                <td>{post.description}</td>
                <td>{post.status}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => {
                      setDeletePost(post);
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
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form fields for editing */}
          <div className="mb-3">
            <label htmlFor="postId" className="form-label">
              Post ID
            </label>
            <input
              type="text"
              className="form-control"
              id="postId"
              value={editedPost.postId}
              onChange={(e) =>
                setEditedPost({ ...editedPost, postId: e.target.value })
              }
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="artworkId" className="form-label">
              Artwork ID
            </label>
            <input
              type="text"
              className="form-control"
              id="artworkId"
              value={editedPost.artworkId}
              onChange={(e) =>
                setEditedPost({ ...editedPost, artworkId: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={editedPost.tittle}
              onChange={(e) =>
                setEditedPost({ ...editedPost, tittle: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              value={editedPost.description}
              onChange={(e) =>
                setEditedPost({ ...editedPost, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="createdOn" className="form-label">
              Created On
            </label>
            <input
              type="text"
              className="form-control"
              id="createdOn"
              value={editedPost.createdOn}
              onChange={(e) =>
                setEditedPost({ ...editedPost, createdOn: e.target.value })
              }
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              className="form-select"
              id="status"
              value={editedPost.status}
              onChange={(e) =>
                setEditedPost({ ...editedPost, status: e.target.value })
              }
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
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
          <Modal.Title>Add Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form fields for adding */}
          <div className="mb-3">
            <label htmlFor="artworkId" className="form-label">
              Artwork ID
            </label>
            <input
              type="text"
              className="form-control"
              id="artworkId"
              value={newPost.artworkId}
              onChange={(e) =>
                setNewPost({ ...newPost, artworkId: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={newPost.tittle}
              onChange={(e) =>
                setNewPost({ ...newPost, tittle: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              value={newPost.description}
              onChange={(e) =>
                setNewPost({ ...newPost, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              className="form-select"
              id="status"
              value={newPost.status}
              onChange={(e) =>
                setNewPost({ ...newPost, status: e.target.value })
              }
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          {/* Add other form fields here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Post
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
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
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

export default Guard(Post);
