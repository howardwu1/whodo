'use client';

import Link from 'next/link';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAppContext } from '@/lib/registry';
import { useState, useRef } from 'react';

const heartLogoSvg =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">' +
      '<defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" style="stop-color:%23191970;stop-opacity:1"/>' +
        '<stop offset="100%" style="stop-color:%23E91E63;stop-opacity:1"/>' +
      '</linearGradient></defs>' +
      '<path d="M50 85 C20 55, 10 35, 25 20 C40 5, 50 15, 50 25 C50 15, 60 5, 75 20 C90 35, 80 55, 50 85Z" fill="url(#grad)"/>' +
      '<text x="35" y="58" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="white">$</text>' +
      '<text x="55" y="58" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="white">?</text>' +
    '</svg>'
  );

export function Navigation() {
  const { username, setUsername, project } = useAppContext();
  const [userDropdown, setUserDropdown] = useState(false);
  const [isHydrated] = useState(true);
  const loginButtonRef = useRef(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&display=swap');
        .brand-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 22px;
          letter-spacing: 0.5px;
          background: linear-gradient(90deg, #191970, #E91E63);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <nav className="navigation">
        <img
          src={heartLogoSvg}
          alt="WhoDo Logo"
          style={{ height: '32px', width: '32px', margin: '0 0.5em 0 1.5em', cursor: 'pointer', borderRadius: '8px' }}
          onClick={() => (window.location.href = username ? '/dashboard' : '/login')}
        />
        <span className="brand-text">WhoDo</span>
        {project ? (
          <h2 style={{ color: 'white' }}>&nbsp;- {project}</h2>
        ) : null}
        <div className="navigation-menu">
          <ul>
            <li>
              <Link href="/">Blog</Link>
            </li>
            {isHydrated && username !== '' && (
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            )}
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              {!isHydrated ? null : username === '' ? (
                <Link href="/login">Login</Link>
              ) : (
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setUserDropdown(true);
                  }}
                  ref={loginButtonRef}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {username} <ArrowDropDownIcon />
                  </span>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
      {userDropdown && (
        <>
          <style>{`
            @keyframes dropdownFadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .profile-menu-item:hover {
              background-color: #f5f5f5;
              border-radius: 8px;
            }
          `}</style>
          <div
            onClick={() => setUserDropdown(false)}
            style={{
              width: '100%',
              height: '100vh',
              zIndex: '2',
              position: 'fixed',
              top: '0px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '60px',
              right: '20px',
              zIndex: '3',
              animation: 'dropdownFadeIn 0.2s ease-out',
            }}
          >
            <div
              style={{
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                borderRadius: '16px',
                backgroundColor: 'white',
                minWidth: '220px',
                overflow: 'hidden',
              }}
            >
              {/* Header with profile */}
              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#191970',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <img
                  src="/blank-profile-picture-973460_1280.webp"
                  alt="profile-pic"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '3px solid white',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <p
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      margin: 0,
                    }}
                  >
                    {username}
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      margin: '4px 0 0 0',
                    }}
                  >
                    Welcome back
                  </p>
                </div>
              </div>

              {/* Menu items */}
              <div style={{ padding: '8px' }}>
                <Link
                  href="/profile"
                  className="profile-menu-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#333',
                    fontSize: '14px',
                    transition: 'background-color 0.15s',
                  }}
                  onClick={() => setUserDropdown(false)}
                >
                  <PersonIcon style={{ color: '#191970', fontSize: '20px' }} />
                  Profile
                </Link>
                <Link
                  href="/reports"
                  className="profile-menu-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#333',
                    fontSize: '14px',
                    transition: 'background-color 0.15s',
                  }}
                  onClick={() => setUserDropdown(false)}
                >
                  <AssessmentIcon style={{ color: '#191970', fontSize: '20px' }} />
                  Reports
                </Link>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#eee', margin: '0 16px' }} />

              {/* Sign out */}
              <div style={{ padding: '8px' }}>
                <Link
                  href="/login"
                  className="profile-menu-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#d32f2f',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'background-color 0.15s',
                  }}
                  onClick={() => {
                    setUsername('');
                    setUserDropdown(false);
                  }}
                >
                  <ExitToAppIcon style={{ fontSize: '20px' }} />
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
