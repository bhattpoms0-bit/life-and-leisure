import useRevealOnScroll from '../../hooks/useRevealOnScroll'

export default function Reveal({ as: Tag = 'div', className = '', children, ...props }) {
  const [ref, visible] = useRevealOnScroll()

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
