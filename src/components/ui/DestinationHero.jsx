export default function DestinationHero({ image, badge, headline, subheading }) {
  return (
    <section className="relative h-[720px] min-h-[560px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} />
      <div className="absolute inset-0 hero-gradient" />
      <div className="relative h-full max-w-container-max mx-auto px-gutter flex flex-col justify-end pb-xxl">
        <div className="max-w-2xl space-y-md">
          <span className="inline-block px-md py-xs bg-secondary/90 text-white rounded-full font-label-md tracking-widest uppercase">
            {badge}
          </span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white leading-tight">
            {headline}
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl">{subheading}</p>
        </div>
      </div>
    </section>
  )
}
