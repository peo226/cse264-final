function Avatar({ name = 'User' }) {
  const initial = name.charAt(0).toUpperCase()

  return <div className="avatar-circle">{initial}</div>
}

export default Avatar