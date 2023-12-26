import { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";

export default function DropdownModal({text, children}:IDropdownModal){
  const [state, setState] = useState({
    dropdownOpen: false,
  });

  const {dropdownOpen} = state;

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  function closeDropdown(e: MouseEvent) {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (dropdownBtn && !dropdownBtn.contains(e.target as Node)) {
      setState(s => ({ ...s, dropdownOpen: false }));
    }
  }

  function toggleDropdown() {
    setState(s => ({ ...s, dropdownOpen: !dropdownOpen }));
  }

  return (
    <>
      <div className="dropdown">
      <p className="dropdown-btn" onClick={toggleDropdown}><CgProfile />{text}</p>
        <ul className={`dropdown-content ${dropdownOpen ? '' : 'hidden'}`}>
          <li>drop down item 1</li>
          <li>drop down item 2</li>
          {children}
        </ul>
      </div>
    </>
  )
}

interface IDropdownModal {
  text: string;
  children: React.ReactNode;
}