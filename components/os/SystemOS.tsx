import SystemNavigator from './SystemNavigator'
import LayerCore from './LayerCore'
import LayerSystems from './LayerSystems'
import LayerMemory from './LayerMemory'
import LayerKnowledge from './LayerKnowledge'
import LayerProcess from './LayerProcess'
import LayerIntelligence from './LayerIntelligence'
import LayerLegacy from './LayerLegacy'

export default function SystemOS() {
  return (
    <>
      <SystemNavigator />
      <main id="main-content">
        <LayerCore />
        <LayerSystems />
        <LayerMemory />
        <LayerKnowledge />
        <LayerProcess />
        <LayerIntelligence />
      </main>
      <LayerLegacy />
    </>
  )
}
