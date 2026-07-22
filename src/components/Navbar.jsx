import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser, logout } from '../api/index.js';
import { Clock3, LogOut, Menu, Sparkles, UserRound, X } from 'lucide-react';
import Avatar from './Common/Avatar.jsx';

export default function Navbar() {
  const user = getUser();
  const nav = useNavigate();
  const location = useLocation();
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let sectionObserver;
    let mutationObserver;

    const collectSections = () => {
      const landingSections = Array.from(document.querySelectorAll('.landing-page section[id]'))
        .map((section) => ({
          id: section.id,
          label: section.dataset.navLabel || section.id
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase()),
          element: section,
        }));

      if (landingSections.length === 0) return false;

      setSections(landingSections);
      sectionObserver = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      }, { rootMargin: '-104px 0px -55% 0px', threshold: [0, 0.15, 0.5] });

      landingSections.forEach(({ element }) => sectionObserver.observe(element));
      const hashTarget = window.location.hash.replace(/^#/, '');
      if (hashTarget) setActiveSection(hashTarget);
      return true;
    };

    if (!collectSections()) {
      mutationObserver = new MutationObserver(() => {
        if (collectSections()) mutationObserver.disconnect();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      sectionObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [location.pathname]);

  const scrollToSection = (event, target) => {
    event.preventDefault();
    setMobileOpen(false);

    if (location.pathname !== '/') {
      nav(`/#${target}`);
      return;
    }

    const section = document.getElementById(target);
    if (!section) return;

    window.history.pushState({}, '', `/#${target}`);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <nav className="sticky top-4 z-50 mx-4 md:mx-6">
      <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-[#111113]/85 px-4 py-3 shadow-[0_16px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl md:px-5">
        <div className="flex min-w-0 items-center gap-5">
          <Link to="/" className="group flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em] text-zinc-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-violet-400/15 text-violet-300 ring-1 ring-violet-300/20 transition duration-200 group-hover:bg-violet-400/25">
              <Sparkles size={16} strokeWidth={2.2} />
            </span>
            <span>NexaCall</span>
          </Link>

          <div className="hidden h-6 w-px bg-white/10 sm:block" />

          {!user && sections.length > 0 && <div className="hidden items-center gap-1 lg:flex">
            {sections.map(({ id, label }) => (
              <a key={id} href={`/#${id}`} onClick={(event) => scrollToSection(event, id)} className={`rounded-[12px] px-3 py-2 text-[13px] font-medium transition ${activeSection === id ? 'bg-violet-400/12 text-violet-200' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-100'}`}>
                {label}
              </a>
            ))}
          </div>}
        {user && (
            <Link to="/history" className="flex items-center gap-2 rounded-[12px] px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-zinc-100">
              <Clock3 size={16} />
              <span>History</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!user && sections.length > 0 && (
            <button type="button" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="rounded-[12px] p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-100 lg:hidden">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
          {user ? (
            <>
              <div className="hidden items-center gap-2.5 rounded-[14px] border border-white/10 bg-white/[0.04] px-2.5 py-1.5 sm:flex">
                <Avatar name={user.name || 'User'} size="sm" />
                <div className="max-w-32 leading-tight">
                  <p className="truncate text-xs font-semibold text-zinc-100">{user.name || 'User'}</p>
                  <p className="truncate text-[11px] text-zinc-500">{user.email}</p>
                </div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-violet-400/10 text-violet-300 sm:hidden">
                <UserRound size={17} />
              </div>
              <button onClick={handleLogout} aria-label="Log out" className="group flex items-center gap-2 rounded-[12px] border border-white/10 px-3 py-2 text-sm font-medium text-zinc-400 hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300">
                <LogOut size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                <span className="hidden md:inline">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-[12px] px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-zinc-100">Log in</Link>
              <Link to="/signup" className="rounded-[12px] bg-violet-500 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400">Get started</Link>
            </>
          )}
      </div>
      {!user && mobileOpen && sections.length > 0 && (
        <div className="mx-auto mt-2 max-w-[1440px] rounded-[18px] border border-white/10 bg-[#111113]/95 p-2 shadow-[0_16px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl lg:hidden">
          {sections.map(({ id, label }) => (
            <a key={id} href={`/#${id}`} onClick={(event) => scrollToSection(event, id)} className={`block rounded-[12px] px-3 py-3 text-sm font-medium ${activeSection === id ? 'bg-violet-400/12 text-violet-200' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'}`}>
              {label}
            </a>
          ))}
        </div>
      )}
      </div>
    </nav>
  );
}
