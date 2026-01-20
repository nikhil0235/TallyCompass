const Button = ({ children, onClick, type = 'button', disabled = false, variant = 'primary', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button