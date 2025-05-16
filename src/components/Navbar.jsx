import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    // ✨ Menü dışına tıklanınca kapanmasını sağlar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <nav className="navbar navbar-dark bg-dark px-3 py-2 position-relative">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <NavLink to="/" className="navbar-brand">
                    <i className="bi bi-book-half me-2"></i>Digital Reading
                </NavLink>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    onClick={toggleMenu}
                    ref={buttonRef}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>

            <div
                ref={menuRef}
                className={`custom-menu ${isOpen ? 'show' : ''}`}
            >
                <ul className="nav flex-column p-3">
                    <li className="nav-item">
                        <NavLink
                            to="/"
                            end
                            className={({isActive}) =>
                                `nav-link text-white ${isActive ? 'active-link' : ''}`
                            }
                        >
                            <i className="bi bi-house me-2"></i>Ana Sayfa
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/upload"
                            className={({isActive}) =>
                                `nav-link text-white ${isActive ? 'active-link' : ''}`
                            }
                        >
                            <i className="bi bi-upload me-2"></i>Yükle
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/result"
                            className={({isActive}) =>
                                `nav-link text-white ${isActive ? 'active-link' : ''}`
                            }
                        >
                            <i className="bi bi-card-text me-2"></i>Sonuç
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/about"
                            className={({isActive}) =>
                                `nav-link text-white ${isActive ? 'active-link' : ''}`
                            }
                        >
                            <i className="bi bi-info-circle me-2"></i>Hakkında
                        </NavLink>
                    </li>
                </ul>

            </div>
        </nav>
    );
}
