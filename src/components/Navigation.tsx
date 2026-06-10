'use client';

import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppContext } from '@/lib/registry';
import { logout } from '@/app/actions/auth';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
        .user-menu-item:hover {
          background-color: #f5f5f5;
        }
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="sidebar-toggle"
        style={{
          position: 'fixed',
          top: '16px',
          left: isExpanded ? expandedWidth + 16 : '80px',
          zIndex: 1001,
          background: 'white',
          border: 'none',
          borderRadius: '10px',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'left 0.3s ease',
          color: '#191970',
          padding: 0,
        }}
      >
        {isExpanded ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* User icon - top right (authenticated) */}
      {isHydrated && username !== '' && (
        <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 1000 }}>
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: userMenuOpen ? '3px solid #FF69B4' : '2px solid white',
            }}
          >
            <img
              src="/blank-profile-picture-973460_1280.webp"
              alt="User profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* User dropdown menu */}
          {userMenuOpen && (
            <>
              <div
                onClick={() => setUserMenuOpen(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: -1,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '52px',
                  right: 0,
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                  minWidth: '180px',
                  overflow: 'hidden',
                  animation: 'dropdownFadeIn 0.15s ease-out',
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
                    await logout();
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
            </>
          )}
        </div>
      )}

      {/* Login button - top right (not authenticated) */}
      {isHydrated && username === '' && (
        <Link
          href="/login"
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 1000,
            padding: '10px 20px',
            background: 'linear-gradient(90deg, #191970, #FF69B4)',
            borderRadius: '10px',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Sign In
        </Link>
      )}

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
