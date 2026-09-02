const TEXT = 'DISK ATACADO EMBALAGENS • GUARAPUAVA PR • '

export default function StampBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" className="animate-spin-slow">
        <defs>
          <path id="stamp-circle" d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
        </defs>
        <text className="fill-current text-[13px] uppercase tracking-[0.15em]" fontFamily="Inter">
          <textPath href="#stamp-circle">{TEXT.repeat(2)}</textPath>
        </text>
      </svg>
      <div className="absolute flex h-14 w-14 items-center justify-center rounded-full border border-current">
        <div className="h-2 w-2 rounded-full bg-current" />
      </div>
    </div>
  )
}
