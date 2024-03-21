// import React, { useEffect, useState } from "react";
// import { PackageDTO } from "@/models/PackageDTO";
// import { PackageService } from "@/services/PackageService";
// import Layout from "@/components/Layout";
// import { Modal, Button, Toast } from "react-bootstrap";
// import Guard from "@/components/Guard";
// import { error } from "console";
// import { ReportDTO } from "@/models/ReportDTO";
// import { ReportService } from "@/services/ReportService";

// const Report: React.FC = () => {
//   // State for packages
//   const [reports, setReports] = useState<ReportDTO[]>([]);
//   const [currentReports, setCurrentReports] = useState<ReportDTO[]>([]);

//   // State for editing package
//   const [editedReport, setEditedReport] = useState<Partial<ReportDTO>>({});
//   const [editModalOpen, setEditModalOpen] = useState(false);

//   // State for adding new package
//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [newReport, setNewReport] = useState<ReportDTO>({
//     reportId: "",
//     createdOn: "",
//     createdBy: "",
//     artworkId: "",
//     status: "",
//     detail: "",
//     id: "",
//     actionNote: "",
//     // report: ReportDTO;
//   });

//   // State for deleting package
//   const [deleteReport, setDeleteReport] = useState<ReportDTO | undefined>(
//     undefined
//   );
//   const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

//   // State for toast notifications
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastVariant, setToastVariant] = useState<"success" | "danger">(
//     "success"
//   );

//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(0);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [totalPages, setTotalPages] = useState(0);

//   // Fetch packages on component mount
//   useEffect(() => {
//     fetchReports();
//   }, []);

//   useEffect(() => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     setCurrentReports(reports.slice(indexOfFirstItem, indexOfLastItem));
//   }, [currentPage]);

//   // Fetch packages from the API
//   const fetchReports = async () => {
//     try {
//       const response = await ReportService.;
//       if (response.isSuccess && Array.isArray(response.result)) {
//         setReports(response.result);
//         setTotalPages(Math.ceil(response.result.length / itemsPerPage));
//         setCurrentPage(1);
//       } else {
//         console.error("Invalid response format:", response);
//       }
//     } catch (error) {
//       console.error("Error fetching packages:", error);
//     }
//   };

//   // Handle opening edit modal for package
//   const handleEdit = (pkg: PackageDTO) => {
//     setEditedReport(pkg);
//     setEditModalOpen(true);
//   };

//   // Handle saving edited package
//   const handleSave = async () => {
//     try {
//       const response = await PackageService.updatePackage(
//         editedReport as PackageDTO
//       );
//       if (response.isSuccess) {
//         response.isSuccess;
//         fetchReports();
//         setEditModalOpen(false);
//         setShowToast(true);
//         setToastMessage("Package updated successfully");
//         setToastVariant("success");
//       } else {
//         console.error("Error updating package:", response.message);
//         setShowToast(true);
//         setToastMessage("Failed to update package");
//         setToastVariant("danger");
//       }
//     } catch (error) {
//       console.error("Error updating package:", error);
//       setShowToast(true);
//       setToastMessage("Failed to update package");
//       setToastVariant("danger");
//     }
//   };

//   // Handle adding new package
//   const handleAdd = async () => {
//     try {
//       const response = await PackageService.createNewPackage(newReport);
//       if (response.isSuccess) {
//         setAddModalOpen(false);
//         setShowToast(true);
//         setToastMessage("Package added successfully");
//         setToastVariant("success");
//       } else {
//         console.error("Error adding package:", response.message);
//         setShowToast(true);
//         setToastMessage("Failed to add package");
//         setToastVariant("danger");
//       }
//     } catch (error) {
//       console.error("Error adding package:", error);
//       setShowToast(true);
//       setToastMessage("Failed to add package");
//       setToastVariant("danger");
//     }
//   };

//   // Handle deleting package
//   const handleDelete = async () => {
//     try {
//       const response = await PackageService.deletePackageByID(
//         deleteReport?.packageId ?? "",
//         true
//       );
//       if (response.isSuccess) {
//         fetchReports();
//         setConfirmDeleteModalOpen(false);
//         setShowToast(true);
//         setToastMessage("Package deleted successfully");
//         setToastVariant("success");
//       } else {
//         console.error("Error deleting package:", response.message);
//         setShowToast(true);
//         setToastMessage("Failed to delete package");
//         setToastVariant("danger");
//       }
//     } catch (error) {
//       console.error("Error deleting package:", error);
//       setShowToast(true);
//       setToastMessage("Failed to delete package");
//       setToastVariant("danger");
//     }
//   };

//   return (
//     <Layout>
//       <div className="container mt-5">
//         <h1 className="mb-4">Package Page</h1>
//         <button
//           type="button"
//           className="btn btn-primary mt-1 mb-3"
//           onClick={() => setAddModalOpen(true)}
//         >
//           Add
//         </button>
//         <table className="table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Package Name</th>
//               <th>Maximum Artworks</th>
//               <th>Price</th>
//               <th>Discount</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentReports.map((pkg) => (
//               <tr key={pkg.packageId}>
//                 <td>{pkg.packageId}</td>
//                 <td>{pkg.packageName}</td>
//                 <td>{pkg.maximumArtworks}</td>
//                 <td>{pkg.price}</td>
//                 <td>{pkg.discount}</td>
//                 <td>
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={() => handleEdit(pkg)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-danger ms-2"
//                     onClick={() => {
//                       setDeleteReport(pkg);
//                       setConfirmDeleteModalOpen(true);
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination component */}
//       <nav aria-label="Page navigation example">
//         <ul className="pagination">
//           <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//             <button className="page-link" onClick={() => setCurrentPage(1)}>
//               First
//             </button>
//           </li>
//           <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//             <button
//               className="page-link"
//               onClick={() => setCurrentPage(currentPage - 1)}
//             >
//               Previous
//             </button>
//           </li>
//           {/* Render pagination items based on totalPages */}
//           {Array.from({ length: totalPages }).map((_, index) => (
//             <li
//               key={index}
//               className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(index + 1)}
//               >
//                 {index + 1}
//               </button>
//             </li>
//           ))}
//           <li
//             className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
//           >
//             <button
//               className="page-link"
//               onClick={() => setCurrentPage(currentPage + 1)}
//             >
//               Next
//             </button>
//           </li>
//           <li
//             className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
//           >
//             <button
//               className="page-link"
//               onClick={() => setCurrentPage(totalPages)}
//             >
//               Last
//             </button>
//           </li>
//         </ul>
//       </nav>

//       {/* Bootstrap Modal for Editing */}
//       <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Package</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {/* Form fields for editing */}
//           <div className="mb-3">
//             <label htmlFor="packageId" className="form-label">
//               Package ID
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="packageId"
//               value={editedReport.packageId}
//               onChange={(e) =>
//                 setEditedReport({ ...editedReport, packageId: e.target.value })
//               }
//               readOnly
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="packageName" className="form-label">
//               Package Name
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="packageName"
//               value={editedReport.packageName}
//               onChange={(e) =>
//                 setEditedReport({
//                   ...editedReport,
//                   packageName: e.target.value,
//                 })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="maximumArtworks" className="form-label">
//               Maximum Artworks
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="maximumArtworks"
//               value={editedReport.maximumArtworks}
//               onChange={(e) =>
//                 setEditedReport({
//                   ...editedReport,
//                   maximumArtworks: parseInt(e.target.value),
//                 })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="price" className="form-label">
//               Price
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="price"
//               value={editedReport.price}
//               onChange={(e) =>
//                 setEditedReport({
//                   ...editedReport,
//                   price: parseFloat(e.target.value),
//                 })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="discount" className="form-label">
//               Discount
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="discount"
//               value={editedReport.discount}
//               onChange={(e) =>
//                 setEditedReport({
//                   ...editedReport,
//                   discount: parseFloat(e.target.value),
//                 })
//               }
//             />
//           </div>
//           {/* Add other form fields here */}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleSave}>
//             Save changes
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Bootstrap Modal for Adding */}
//       <Modal show={addModalOpen} onHide={() => setAddModalOpen(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Package</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {/* Form fields for adding */}
//           <div className="mb-3">
//             <label htmlFor="packageName" className="form-label">
//               Package Name
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="packageName"
//               value={newReport.packageName}
//               onChange={(e) =>
//                 setNewReport({ ...newReport, packageName: e.target.value })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="maximumArtworks" className="form-label">
//               Maximum Artworks
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="maximumArtworks"
//               value={newReport.maximumArtworks}
//               onChange={(e) =>
//                 setNewReport({
//                   ...newReport,
//                   maximumArtworks: parseInt(e.target.value),
//                 })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="price" className="form-label">
//               Price
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="price"
//               value={newReport.price}
//               onChange={(e) =>
//                 setNewReport({
//                   ...newReport,
//                   price: parseFloat(e.target.value),
//                 })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="discount" className="form-label">
//               Discount
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="discount"
//               value={newReport.discount}
//               onChange={(e) =>
//                 setNewReport({
//                   ...newReport,
//                   discount: parseFloat(e.target.value),
//                 })
//               }
//             />
//           </div>
//           {/* Add other form fields here */}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleAdd}>
//             Add Package
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Bootstrap Modal for Confirming Delete */}
//       <Modal
//         show={confirmDeleteModalOpen}
//         onHide={() => setConfirmDeleteModalOpen(false)}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Are you sure you want to delete this package?</Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setConfirmDeleteModalOpen(false)}
//           >
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDelete}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Bootstrap Toast */}
//       <div
//         style={{
//           position: "absolute",
//           top: 20,
//           right: 20,
//           zIndex: 9999, // Adjust z-index as needed
//         }}
//       >
//         <Toast
//           show={showToast}
//           onClose={() => setShowToast(false)}
//           delay={3000}
//           autohide
//         >
//           <Toast.Header
//             closeButton={false}
//             className={`text-white bg-${toastVariant}`}
//           >
//             <strong className="me-auto">Message</strong>
//           </Toast.Header>
//           <Toast.Body>{toastMessage}</Toast.Body>
//         </Toast>
//       </div>
//     </Layout>
//   );
// };

// export default Guard(Report);
