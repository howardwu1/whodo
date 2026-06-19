'use client';

import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useAppContext } from '@/lib/registry';
import { logout } from '@/app/actions/auth';
import { useState, useEffect, useRef } from 'react';

const heartLogoSvg =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">' +
      '<text x="18" y="72" font-family="Georgia,serif" font-size="65" font-weight="bold" fill="white" transform="rotate(-10 50 50)">$</text>' +
      '<text x="48" y="72" font-family="Georgia,serif" font-size="65" font-weight="bold" fill="#FF69B4" transform="rotate(10 50 50)">?</text>' +
    '</svg>'
  );

export function Navigation() {
  const { username, setUsername } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(true);

  const collapsedWidth = 64;
  const originalWidth = 260;
  const expandedWidth = Math.floor(originalWidth * (2/3));
  const [isHydrated, setIsHydrated] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ left: number; bottom: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const toggleUserMenu = () => {
    if (userMenuOpen) {
      setUserMenuOpen(false);
      return;
    }
    const el = menuButtonRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setMenuPos({ left: rect.right + 8, bottom: window.innerHeight - rect.bottom });
    }
    setUserMenuOpen(true);
  };

  useEffect(() => {
    if (isExpanded) {
      document.body.style.marginLeft = expandedWidth + 'px';
    } else {
      document.body.style.marginLeft = collapsedWidth + 'px';
    }
  }, [isExpanded, expandedWidth, collapsedWidth]);

  const allNavItems = [
    { href: '/', label: 'Blog', icon: <ArticleIcon /> },
    { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon />, requiresAuth: true },
    { href: '/contact', label: 'Contact', icon: <ContactPageIcon /> },
  ];

  const navItems = allNavItems.filter(item => !item.requiresAuth || username !== '');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&display=swap');
        .sidebar-brand {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 0.5px;
          background: linear-gradient(90deg, white, #FF69B4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .sidebar-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .sidebar-item.active {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }
        .sidebar-item svg {
          flex-shrink: 0;
        }
        .sidebar-item:focus-visible {
          outline: 2px solid #FF69B4;
          outline-offset: 2px;
        }
        .user-menu-item:hover {
          background-color: #f5f5f5;
        }
        .sidebar-toggle-btn {
          background: linear-gradient(135deg, #191970 0%, #FF69B4 100%);
          color: white;
          border: none;
          border-radius: 50%;
          box-shadow: 0 4px 14px rgba(25, 25, 112, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4);
          transition: left 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
        }
        .sidebar-toggle-btn.is-collapsed {
          box-shadow: 0 4px 14px rgba(255, 105, 180, 0.45), 0 0 0 2px rgba(255, 105, 180, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4);
        }
        .sidebar-toggle-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 8px 24px rgba(255, 105, 180, 0.6), 0 2px 8px rgba(25, 25, 112, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.5);
        }
        .sidebar-toggle-btn:active {
          transform: scale(0.94);
        }
        .sidebar-toggle-btn svg {
          transition: transform 0.3s ease;
        }
        .sidebar-toggle-btn:hover svg {
          transform: rotate(90deg);
        }
        .sidebar-toggle-btn:focus-visible {
          outline: 2px solid #FF69B4;
          outline-offset: 3px;
        }
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Toggle button - attached to sidebar edge */}
      <button
        onClick={() => {
          setUserMenuOpen(false);
          setIsExpanded(!isExpanded);
        }}
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        className={`sidebar-toggle-btn${isExpanded ? '' : ' is-collapsed'}`}
        style={{
          position: 'fixed',
          top: '16px',
          left: isExpanded ? expandedWidth - 18 : collapsedWidth - 18,
          zIndex: 1001,
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {isExpanded ? <CloseIcon style={{ fontSize: '18px' }} /> : <MenuIcon style={{ fontSize: '18px' }} />}
      </button>

      {/* Sidebar overlay when collapsed */}
      {!isExpanded && (
        <div
          onClick={() => setIsExpanded(true)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: collapsedWidth,
            height: '100vh',
            background: 'linear-gradient(180deg, #191970 0%, #0f0f4a 100%)',
            zIndex: 999,
            cursor: 'pointer',
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isExpanded ? expandedWidth : collapsedWidth,
          height: '100vh',
          background: 'linear-gradient(180deg, #191970 0%, #0f0f4a 100%)',
          zIndex: 1000,
          transition: 'width 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Brand header */}
        <div
          style={{
            padding: isExpanded ? '20px 16px' : '20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            minHeight: '76px',
          }}
        >
          <img
            src={heartLogoSvg}
            alt="WhoDo Logo"
            style={{
              height: '36px',
              width: '36px',
              cursor: 'pointer',
              borderRadius: '8px',
              flexShrink: 0,
            }}
            onClick={() => (window.location.href = username ? '/dashboard' : '/login')}
          />
          {isExpanded && <span className="sidebar-brand">WhoDo</span>}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="sidebar-item"
                style={{ justifyContent: isExpanded ? 'flex-start' : 'center', display: 'flex', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '22px' }}>{item.icon}</span>
                {isExpanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Account area - bottom of sidebar (authenticated) */}
        {isHydrated && username !== '' && (
          <div ref={menuRef} style={{ padding: '12px 8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div
              ref={menuButtonRef}
              onClick={toggleUserMenu}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleUserMenu();
                }
                if (e.key === 'Escape') setUserMenuOpen(false);
              }}
              role="button"
              tabIndex={0}
              aria-label="Open user menu"
              aria-expanded={userMenuOpen}
              className="sidebar-item"
              style={{
                justifyContent: isExpanded ? 'flex-start' : 'center',
                display: 'flex',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  padding: '2px',
                  background: 'linear-gradient(135deg, #191970 0%, #FF69B4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }}
              >
                <img
                  src="/blank-profile-picture-973460_1280.webp"
                  alt="User profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '1.5px solid white',
                  }}
                />
              </div>
              {isExpanded && (
                <span style={{ color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {username}
                </span>
              )}
            </div>

            {/* User dropdown menu - fixed so it escapes the sidebar's overflow:hidden */}
            {userMenuOpen && menuPos && (
              <div
                style={{
                  position: 'fixed',
                  left: menuPos.left,
                  bottom: menuPos.bottom,
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                  minWidth: '180px',
                  overflow: 'hidden',
                  animation: 'dropdownFadeIn 0.15s ease-out',
                  zIndex: 1002,
                }}
              >
                <Link
                  href="/profile"
                  className="user-menu-item"
                  onClick={() => setUserMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 16px',
                    textDecoration: 'none',
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  <PersonIcon style={{ color: '#191970', fontSize: '20px' }} />
                  Profile
                </Link>
                <div style={{ height: '1px', backgroundColor: '#eee' }} />
                <button
                  onClick={async () => {
                    setUserMenuOpen(false);
                    try {
                      await logout();
                    } catch {
                      // If logout() fails or redirect doesn't work, do hard redirect
                      window.location.href = '/login';
                    }
                  }}
                  className="user-menu-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 16px',
                    width: '100%',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    color: '#d32f2f',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <LogoutIcon style={{ fontSize: '20px' }} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sign In CTA - bottom of sidebar (not authenticated) */}
        {isHydrated && username === '' && (
          <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Link
              href="/login"
              className="btn-gradient-pill"
              style={
                isExpanded
                  ? {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #191970 0%, #FF69B4 100%)',
                      borderRadius: '12px',
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '14px',
                      fontFamily: "'Outfit', sans-serif",
                    }
                  : {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      margin: '0 auto',
                      background: 'linear-gradient(135deg, #191970 0%, #FF69B4 100%)',
                      borderRadius: '50%',
                      color: 'white',
                    }
              }
            >
              <LoginIcon style={{ fontSize: isExpanded ? '20px' : '22px' }} />
              {isExpanded && <span>Sign In</span>}
            </Link>
          </div>
        )}
      </div>

      {/* Update CSS variable for content margin */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isExpanded ? '260px' : '64px',
          height: '1px',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
