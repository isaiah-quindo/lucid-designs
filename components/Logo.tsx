type LogoProps = {
  className?: string
  title?: string
}

export default function Logo({ className, title = 'Lucid Designs' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      className={className}
      fill="currentColor"
    >
      <title>{title}</title>
      <path d="M3 4 H6 V17 H11 V20 H3 Z M13 4 H15.5 A 6.5 8 0 0 1 15.5 20 H13 Z" />
    </svg>
  )
}
