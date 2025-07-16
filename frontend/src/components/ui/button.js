export function Button({ children, ...props }) {
  return <button style={{ padding: "8px 12px", background: "#000000ff", color: "#fff" }} {...props}>{children}</button>;
}
