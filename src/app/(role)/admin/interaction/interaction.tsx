import React, { useEffect, useState } from 'react';
import { InteractionDTO } from '@/models/InteractionDTO';
import { InteractionService } from '@/services/InteractionService';
import Layout from '@/components/Layout';
import { Modal, Button, Toast } from 'react-bootstrap';
import Guard from '@/components/Guard';

const Interaction: React.FC = () => {
    const [interactions, setInteractions] = useState<InteractionDTO[]>([]);
    const [currentInteractions, setCurrentInteractions] = useState<InteractionDTO[]>([]);

    const [editedInteraction, setEditedInteraction] = useState<Partial<InteractionDTO>>({});
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newInteraction, setNewInteraction] = useState<InteractionDTO>({
        interactionId: 'string',
        id: 'string',
        createdOn: '2024-02-28T15:32:51.57',
        like: 0,
        comments: '',
        postId: '',
    });

    const [deleteInteraction, setDeleteInteraction] = useState<InteractionDTO | undefined>(undefined);
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');

    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchInteractions();
    }, []);

    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setCurrentInteractions(interactions.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage]);

    const fetchInteractions = async () => {
        try {
            // Fetch interactions from API
            const response = await InteractionService.getAllInteractions();
            if (response.isSuccess && Array.isArray(response.result)) {
                setInteractions(response.result);
                setTotalPages(Math.ceil(response.result.length / itemsPerPage));
                setCurrentPage(1);
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error('Error fetching interactions:', error);
        }
    };

    const handleEdit = (interaction: InteractionDTO) => {
        setEditedInteraction(interaction);
        setEditModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const response = await InteractionService.updateInteraction(editedInteraction as InteractionDTO);
            if (response.isSuccess) {
                fetchInteractions();
                setEditModalOpen(false);
                setShowToast(true);
                setToastMessage('Interaction updated successfully');
                setToastVariant('success');
            } else {
                console.error('Error updating interaction:', response.message);
                setShowToast(true);
                setToastMessage('Failed to update interaction');
                setToastVariant('danger');
            }
        } catch (error) {
            console.error('Error updating interaction:', error);
            setShowToast(true);
            setToastMessage('Failed to update interaction');
            setToastVariant('danger');
        }
    };

    const handleAdd = async () => {
        try {
            const response = await InteractionService.createNewInteraction(newInteraction);
            if (response.isSuccess) {
                setAddModalOpen(false);
                setShowToast(true);
                setToastMessage('Interaction added successfully');
                setToastVariant('success');
            } else {
                console.error('Error adding interaction:', response.message);
                setShowToast(true);
                setToastMessage(response?.message ?? 'Failed to add interaction');
                setToastVariant('danger');
            }
        } catch (error) {
            console.error('Error adding interaction:', error);
            setShowToast(true);
            setToastMessage('Failed to add interaction');
            setToastVariant('danger');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await InteractionService.deleteInteractionByID(deleteInteraction?.interactionId ?? '');
            if (response.isSuccess) {
                fetchInteractions();
                setConfirmDeleteModalOpen(false);
                setShowToast(true);
                setToastMessage('Interaction deleted successfully');
                setToastVariant('success');
            } else {
                console.error('Error deleting interaction:', response.message);
                setShowToast(true);
                setToastMessage('Failed to delete interaction');
                setToastVariant('danger');
            }
        } catch (error) {
            console.error('Error deleting interaction:', error);
            setShowToast(true);
            setToastMessage('Failed to delete interaction');
            setToastVariant('danger');
        }
    };

    return (
        <Layout>
            <div className="container mt-5">
                <h1 className="mb-4">Interaction Page</h1>
                <button type="button" className="btn btn-primary mt-1 mb-3" onClick={() => setAddModalOpen(true)} style={{ visibility: 'hidden' }}>Add</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Like</th>
                            <th>Comments</th>
                            <th>Post ID</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInteractions.map((interaction) => (
                            <tr key={interaction.interactionId}>
                                <td>{interaction.interactionId}</td>
                                <td>{interaction.like}</td>
                                <td>{interaction.comments}</td>
                                <td>{interaction.postId}</td>
                                <td>
                                    <button type="button" className="btn btn-primary" onClick={() => handleEdit(interaction)} style={{ visibility: 'hidden' }}>Edit</button>
                                    <button type="button" className="btn btn-danger ms-2" onClick={() => { setDeleteInteraction(interaction); setConfirmDeleteModalOpen(true); }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination component */}
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(1)}>First</button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                    </li>
                    {/* Render pagination items based on totalPages */}
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(totalPages)}>Last</button>
                    </li>
                </ul>
            </nav>

            {/* Bootstrap Modal for Editing */}
            <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Interaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Form fields for editing */}
                    <div className="mb-3">
                        <label htmlFor="interactionId" className="form-label">Interaction ID</label>
                        <input type="text" className="form-control" id="interactionId" value={editedInteraction.interactionId} onChange={(e) => setEditedInteraction({ ...editedInteraction, interactionId: e.target.value })} readOnly />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="like" className="form-label">Like</label>
                        <input type="number" className="form-control" id="like" value={editedInteraction.like} onChange={(e) => setEditedInteraction({ ...editedInteraction, like: parseInt(e.target.value) })} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="comments" className="form-label">Comments</label>
                        <input type="text" className="form-control" id="comments" value={editedInteraction.comments} onChange={(e) => setEditedInteraction({ ...editedInteraction, comments: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="postId" className="form-label">Post ID</label>
                        <input type="text" className="form-control" id="postId" value={editedInteraction.postId} onChange={(e) => setEditedInteraction({ ...editedInteraction, postId: e.target.value })} />
                    </div>
                    {/* Add other form fields here */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save changes</Button>
                </Modal.Footer>
            </Modal>


            {/* Bootstrap Modal for Adding */}
            <Modal show={addModalOpen} onHide={() => setAddModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Interaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Form fields for adding */}
                    <div className="mb-3">
                        <label htmlFor="like" className="form-label">Like</label>
                        <input type="number" className="form-control" id="like" value={newInteraction.like} onChange={(e) => setNewInteraction({ ...newInteraction, like: parseInt(e.target.value) })} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="comments" className="form-label">Comments</label>
                        <input type="text" className="form-control" id="comments" value={newInteraction.comments} onChange={(e) => setNewInteraction({ ...newInteraction, comments: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="postId" className="form-label">Post ID</label>
                        <input type="text" className="form-control" id="postId" value={newInteraction.postId} onChange={(e) => setNewInteraction({ ...newInteraction, postId: e.target.value })} />
                    </div>
                    {/* Add other form fields here */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setAddModalOpen(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAdd} style={{ visibility: 'hidden' }}>Add Interaction</Button>
                </Modal.Footer>
            </Modal>


            {/* Bootstrap Modal for Confirming Delete */}
            <Modal show={confirmDeleteModalOpen} onHide={() => setConfirmDeleteModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this interaction?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Bootstrap Toast */}
            <div
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    zIndex: 9999, // Adjust z-index as needed
                }}
            >
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                    <Toast.Header closeButton={false} className={`text-white bg-${toastVariant}`}>
                        <strong className="me-auto">Message</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </div>

        </Layout>
    );
};

export default Guard(Interaction);

