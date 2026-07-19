import Link from 'next/link'

export default function NotFound(): React.ReactElement {
  return (
    <main id="main" className="not-found-shell">
      <div className="lost-wireframe" aria-hidden="true"><i /><i /><i /></div>
      <p className="eyebrow">Error 404</p>
      <h1>This page drifted off the network.</h1>
      <Link className="button button-primary" href="/">Back home</Link>
    </main>
  )
}
