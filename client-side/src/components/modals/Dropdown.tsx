interface Props {
  visible: boolean;
  children: React.ReactNode;
}

export default function Modal({visible, children}:Props){
  return (
    <>
      {visible && children}
    </>
  )
}