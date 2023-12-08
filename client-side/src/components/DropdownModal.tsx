import { useState } from "react";

export default function DropdownModal(){
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="dropdown">

        <button className="dropdown-btn" onClick={() => setOpen(!open)} >click me</button>
        <ul className={`dropdown-content ${open ? '' : 'hidden'}`}>
          <li>drop down item 1</li>
          <li>drop down item 2</li>
        </ul>
      </div>
    </>
  )
}