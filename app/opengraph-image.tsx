import { ImageResponse } from 'next/og'

export const alt = 'Bader Bennani — Full-Stack Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  const nodes = [[860, 110], [1020, 160], [935, 260], [1100, 315], [820, 385], [1000, 470], [730, 215]]
  return new ImageResponse(<div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#F7F5F2', color: '#14161A', padding: '82px' }}><div style={{ display: 'flex', flexDirection: 'column', width: '670px' }}><div style={{ display: 'flex', color: '#5B5F6A', fontSize: 19, letterSpacing: 4, textTransform: 'uppercase' }}>Full-stack engineer · Meknès, Morocco</div><div style={{ display: 'flex', marginTop: 30, fontSize: 82, fontFamily: 'serif', letterSpacing: -4 }}>Bader Bennani</div><div style={{ display: 'flex', marginTop: 26, color: '#5B5F6A', fontSize: 28, lineHeight: 1.3 }}>Secure, scalable web systems — crafted with intent.</div></div><svg width="600" height="630" viewBox="0 0 600 630" style={{ position: 'absolute', right: 0, top: 0 }}><g stroke="#3B5BFF" strokeOpacity=".32" strokeWidth="1.5">{nodes.slice(0, -1).map(([x, y], index) => <line key={index} x1={x - 600} y1={y} x2={nodes[(index + 2) % nodes.length][0] - 600} y2={nodes[(index + 2) % nodes.length][1]} />)}</g>{nodes.map(([x, y], index) => <circle key={index} cx={x - 600} cy={y} r="8" fill="#3B5BFF" fillOpacity=".85" />)}</svg><div style={{ position: 'absolute', right: -100, bottom: -180, width: 500, height: 500, borderRadius: 999, background: '#E7ECFF', opacity: .8 }} /></div>, size)
}
