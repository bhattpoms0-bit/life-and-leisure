import { Link } from 'react-router-dom'

export default function ServiceCard({ number, icon, title, description, to, label = 'Start an enquiry' }) {
  return <Link to={to} className="essential-card"><div className="essential-card-top"><span className="material-symbols-outlined" aria-hidden="true">{icon}</span><span>{number}</span></div><h3>{title}</h3><p>{description}</p><span className="text-link">{label} <span aria-hidden="true">↗</span></span></Link>
}
