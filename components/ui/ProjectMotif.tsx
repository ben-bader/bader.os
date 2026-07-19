export function ProjectMotif({ motif }: { motif: 'hierarchy' | 'building' | 'inventory' | 'burst' }) {
  return <div className={`project-motif motif-${motif}`} aria-hidden="true"><span /><span /><span /><span /><span /></div>
}
