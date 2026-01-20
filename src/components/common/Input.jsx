const Input = ({ type = 'text', placeholder, value, onChange, required = false, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      {...props}
    />
  )
}

export default Input