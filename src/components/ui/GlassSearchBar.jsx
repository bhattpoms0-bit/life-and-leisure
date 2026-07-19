import { useState } from 'react'

const TRAVELER_OPTIONS = ['2 Adults, 0 Children', '1 Adult', '4 Adults, 2 Children']

// variant "hero": full frosted card w/ boxed fields (Home hero)
// variant "embedded": compact bar w/ divider-separated fields (Hotel listing hero)
// variant "compact": single field + CTA (Visa hero)
export default function GlassSearchBar({
  variant = 'hero',
  destination = '',
  dates = '',
  travelers = TRAVELER_OPTIONS[0],
  ctaLabel,
  onSubmit,
}) {
  const [form, setForm] = useState({ destination, dates, travelers })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (onSubmit) onSubmit(form)
    else console.log('Search submitted:', form)
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="glass-card p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-lg max-w-xl">
        <div className="flex-1 flex items-center px-4 gap-3 bg-surface-container-low rounded-xl py-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-outline">public</span>
          <input
            className="bg-transparent border-none focus:ring-0 w-full text-body-md placeholder:text-outline"
            placeholder="Where are you traveling to?"
            type="text"
            value={form.destination}
            onChange={(event) => setForm({ ...form, destination: event.target.value })}
          />
        </div>
        <button
          className="bg-primary text-on-primary px-xl py-4 rounded-xl font-label-md text-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
          type="submit"
        >
          {ctaLabel ?? 'Check Requirements'}
        </button>
      </form>
    )
  }

  if (variant === 'embedded') {
    return (
      <form onSubmit={handleSubmit} className="glass-card p-lg rounded-xl shadow-lg border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div className="space-y-xs">
            <span className="font-label-md text-caption uppercase text-primary/60">Destination</span>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary">location_on</span>
              <input
                className="bg-transparent border-none p-0 focus:ring-0 font-label-md text-primary w-full"
                type="text"
                value={form.destination}
                onChange={(event) => setForm({ ...form, destination: event.target.value })}
              />
            </div>
          </div>
          <div className="space-y-xs border-l border-outline-variant/30 pl-md hidden md:block">
            <span className="font-label-md text-caption uppercase text-primary/60">Dates</span>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary">calendar_today</span>
              <span className="font-label-md text-primary">{form.dates}</span>
            </div>
          </div>
          <div className="space-y-xs border-l border-outline-variant/30 pl-md hidden md:block">
            <span className="font-label-md text-caption uppercase text-primary/60">Guests</span>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary">person</span>
              <span className="font-label-md text-primary">{form.travelers}</span>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button
              className="bg-primary text-white w-full md:w-auto px-xl py-md rounded-lg font-label-md hover:shadow-xl transition-all"
              type="submit"
            >
              {ctaLabel ?? 'Search'}
            </button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass p-lg rounded-2xl editorial-shadow grid grid-cols-1 md:grid-cols-4 gap-md items-end">
      <div className="space-y-xs">
        <label className="text-caption font-label-md text-on-surface-variant uppercase tracking-widest px-2">Destination</label>
        <div className="flex items-center bg-surface-container-low rounded-xl px-md h-14">
          <span className="material-symbols-outlined text-outline mr-sm">location_on</span>
          <input
            className="bg-transparent border-none focus:ring-0 w-full text-body-md"
            placeholder="Where to?"
            type="text"
            value={form.destination}
            onChange={(event) => setForm({ ...form, destination: event.target.value })}
          />
        </div>
      </div>
      <div className="space-y-xs">
        <label className="text-caption font-label-md text-on-surface-variant uppercase tracking-widest px-2">Dates</label>
        <div className="flex items-center bg-surface-container-low rounded-xl px-md h-14">
          <span className="material-symbols-outlined text-outline mr-sm">calendar_month</span>
          <input
            className="bg-transparent border-none focus:ring-0 w-full text-body-md"
            placeholder="Select dates"
            type="text"
            value={form.dates}
            onChange={(event) => setForm({ ...form, dates: event.target.value })}
          />
        </div>
      </div>
      <div className="space-y-xs">
        <label className="text-caption font-label-md text-on-surface-variant uppercase tracking-widest px-2">Travelers</label>
        <div className="flex items-center bg-surface-container-low rounded-xl px-md h-14">
          <span className="material-symbols-outlined text-outline mr-sm">group</span>
          <select
            className="bg-transparent border-none focus:ring-0 w-full text-body-md appearance-none"
            value={form.travelers}
            onChange={(event) => setForm({ ...form, travelers: event.target.value })}
          >
            {TRAVELER_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        className="bg-secondary-container text-on-secondary-container h-16 rounded-xl font-headline-md text-body-lg font-bold flex items-center justify-center space-x-2 shadow-lg hover:bg-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        type="submit"
      >
        <span>{ctaLabel ?? 'Explore Packages'}</span>
        <span className="material-symbols-outlined">arrow_right_alt</span>
      </button>
    </form>
  )
}
