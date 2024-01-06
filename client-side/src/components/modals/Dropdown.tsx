interface Props {
  children: React.ReactNode;
}

export default function Dropdown({ children }: Props) {
  return (
    <div className="dropdown">
      <ul className="dropdown-menu">
        {children}
      </ul>
    </div>
  )
}