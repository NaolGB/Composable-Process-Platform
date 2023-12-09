interface Props {
  label: string;
  id?: string;
  onClick?: () => void
}

function Button({ label, id, onClick }: Props) {
  return(<>
    <button id={id || ''} onClick={onClick}>{label}</button>
  </>)
}

export default Button;
