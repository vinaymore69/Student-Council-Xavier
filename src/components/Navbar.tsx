import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Function to load user data from localStorage
  const loadUserData = () => {
    try {
      const role = localStorage.getItem('userRole');
      const data = localStorage.getItem('userData');
      
      console.log('Loading user data - Role:', role); // Debug log
      console.log('Loading user data - Data:', data); // Debug log
      
      setUserRole(role);
      if (data) {
        const parsedData = JSON.parse(data);
        console.log('Parsed user data:', parsedData); // Debug log
        setUserData(parsedData);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserData(null);
      setUserRole(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load auth info from localStorage on mount
  useEffect(() => {
    console.log('Navbar mounted, loading user data...'); // Debug log
    loadUserData();

    // Listen for custom login event (for admin login)
    const handleUserLogin = () => {
      console.log('userLogin event received'); // Debug log
      // Add a small delay to ensure localStorage is updated
      setTimeout(() => {
        loadUserData();
      }, 100);
    };

    // Listen for storage events (changes in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userRole' || e.key === 'userData') {
        console.log('Storage changed:', e.key); // Debug log
        loadUserData();
      }
    };

    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('storage', handleStorageChange);

    // Listen for auth state changes to clear UI (e.g., sign out elsewhere)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session); // Debug log
      
      // If session is null and user is a student, clear local user state
      if (!session && userRole === 'student') {
        setUserRole(null);
        setUserData(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        setIsProfileOpen(false);
        setIsMenuOpen(false);
      }
      // On sign in reload localStorage values
      if (event === 'SIGNED_IN') {
        loadUserData();
      }
    });

    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('storage', handleStorageChange);
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent background scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (isMenuOpen) {
      closeMenu();
    }
  };

  const handleLogout = async () => {
    try {
      // Only sign out from Supabase Auth if user is a student
      if (userRole === 'student') {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      // Clear local state & storage and navigate home
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      setUserRole(null);
      setUserData(null);
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      navigate('/');
    }
  };

  const profileName = userData?.name || userData?.email || 'Profile';

  // Debug render
  console.log('Navbar rendering - userRole:', userRole, 'userData:', userData);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-2 sm:py-3 md:py-4 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <a 
          href="#" 
          className="flex items-center space-x-2"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          aria-label="Xie Student Council Logo"
        >
          <img 
            src="/xiesc.png" 
            alt="Xie Student Council Logo" 
            className="h-12 sm:h-16 " 
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/chat" className="nav-link">AI Chat</Link>
          <Link to="/gallery" className="nav-link">Gallery</Link>
          <Link to="/rankings" className="nav-link">Rankings</Link>
<Link to="/events" className="nav-link">Events</Link>
          {/* If user is not signed in show Login / Sign Up */}
          {!userRole && (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}

          {/* If user is signed in show Profile dropdown */}
          {userRole && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((s) => !s)}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  <User size={16} />
                </span>
                <span className="hidden sm:inline">{profileName}</span>
                <ChevronDown size={16} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-md py-1 z-50">
                  {/* Role-specific dashboard link */}
                  {userRole === 'student' && (
                    <Link
                      to="/student-dashboard"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {userRole === 'admin' && (
                  <Link
                    to="/admin"  // Changed from /admindashboard
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile menu button - increased touch target */}
        <button 
          className="md:hidden text-gray-700 p-3 focus:outline-none" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation - improved for better touch experience */}
      <div className={cn(
        "fixed inset-0 z-40 bg-white flex flex-col pt-16 px-6 md:hidden transition-all duration-300 ease-in-out overflow-y-auto",
        isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        <nav className="flex flex-col space-y-6 items-center mt-8 pb-8">
          <Link 
            to="/" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={closeMenu}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={closeMenu}
          >
            Contact
          </Link>
          <Link 
            to="/chat" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={closeMenu}
          >
            AI Chat
          </Link>
          <Link 
            to="/gallery" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={closeMenu}
          >
            Gallery
          </Link>

          {/* Authenticated links */}
          {userRole && (
            <>
              {userRole === 'admin' && (
  <Link 
    to="/admin"  // Changed from /admindashboard
    className="text-xl font-bold py-3 px-6 w-full text-center rounded-lg hover:bg-primary/10 text-primary" 
    onClick={closeMenu}
  >
    🎯 Admin Dashboard
  </Link>
)}
              {userRole === 'student' && (
                <Link 
                  to="/dashboard" 
                  className="text-xl font-bold py-3 px-6 w-full text-center rounded-lg hover:bg-primary/10 text-primary" 
                  onClick={closeMenu}
                >
                  📊 Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="w-full text-left text-xl font-medium py-3 px-6 rounded-lg hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}

          {/* If not signed in show login/signup */}
          {!userRole && (
            <div className="flex flex-col space-y-4 w-full mt-4">
              <Link to="/login" onClick={closeMenu}>
                <Button variant="ghost" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={closeMenu}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;