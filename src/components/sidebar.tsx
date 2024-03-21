import React from "react";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPaintBrush, faThList, faCog, faEnvelope, faBox, faComment } from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
    activeItem?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem }) => {
    const routes = [
        { path: "/admin/dashboard", title: "Dashboard", icon: faHome },
        { path: "/admin/configuration", title: "Configuration", icon: faCog },
        { path: "/admin/post", title: "Post", icon: faEnvelope },
        { path: "/admin/interaction", title: "Interaction", icon: faComment },
        { path: "/admin/category", title: "Category", icon: faThList },
        { path: "/admin/package", title: "Package", icon: faBox },
        { path: "/admin/artwork", title: "Artwork", icon: faPaintBrush },
    ];

    const renderNavItem = (item: any) => {
        const isActive = activeItem === item.path;
        return (
            <Nav.Item key={item.path} className="mb-2 d-flex align-items-center justify-content-center">
                <NavLink href={item.path} active={isActive} className={`btn btn-secondary text-light w-100 text-center ${isActive ? "active" : ""}`}>
                    <FontAwesomeIcon icon={item.icon} className="mr-2" /> {item.title}
                </NavLink>
            </Nav.Item>
        );
    };

    return (
        <Nav
            className="d-flex flex-column bg-dark text-light sidebar align-items-center pt-3 ps-3 px-2 flex-nowrap"
            style={{ width: "14%", height: "100vh", overflow: "hidden" }}
        >
            <h2 className="fw-bold mb-4 fs-5 px-3">Admin ⚙️<br></br>Management</h2>
            {routes.map(renderNavItem)}
        </Nav>
    );
};

export default Sidebar;
