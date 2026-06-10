'use client';

import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAppContext } from '@/lib/registry';
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
  const { username } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHydrated] = useState(true);

  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('sidebar-expanded');
    } else {
      document.body.classList.remove('sidebar-expanded');
    }
  }, [isExpanded]);

  const navItems = [
    { href: '/', label: 'Blog', icon: <ArticleIcon /> },
    { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon />, requiresAuth: true },
    { href: '/contact', label: 'Contact', icon: <ContactPageIcon /> },
  ];

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
      `}</style>

      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="sidebar-toggle"
        style={{
          position: 'fixed',
          top: '16px',
          left: isExpanded ? '276px' : '80px',
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
        <div
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 1000,
          }}
        >
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '2px solid white',
            }}
          >
            <img
              src="/blank-profile-picture-973460_1280.webp"
              alt="User profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}

      {/* Login icon - top right (not authenticated) */}
      {isHydrated && username === '' && (
        <Link
          href="/login"
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 1000,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            color: '#191970',
          }}
        >
          <AccountCircleIcon style={{ fontSize: '28px' }} />
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
            width: '64px',
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
          width: isExpanded ? '260px' : '64px',
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
            if (item.requiresAuth && (!isHydrated || username === '')) return null;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="sidebar-item"
                onClick={() => setIsExpanded(false)}
                style={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
              >
                <span style={{ fontSize: '22px' }}>{item.icon}</span>
                {isExpanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Login button when not authenticated */}
        {isHydrated && username === '' && (
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Link
              href="/login"
              className="sidebar-item"
              onClick={() => setIsExpanded(false)}
              style={{
                justifyContent: isExpanded ? 'flex-start' : 'center',
                background: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <span style={{ fontSize: '22px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </span>
              {isExpanded && <span>Login</span>}
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
