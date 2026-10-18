export type TraceDirection = 'forward' | 'reverse'

export type CircuitTrace = {
  id: string
  d: string
  active?: boolean
  mobile?: boolean
}

export type CircuitNode = {
  id: string
  x: number
  y: number
  mobile?: boolean
  kind?: 'client' | 'gateway' | 'router' | 'auth' | 'validation' | 'service' | 'cache' | 'database' | 'queue' | 'worker' | 'completion' | 'observability'
  label?: string
  labelY?: number
}

export type CircuitRouteStep = {
  trace: string
  to: string
  direction?: TraceDirection
  dwell?: number
  activate?: boolean
}

export type CircuitRoute = {
  id: 'request' | 'cache' | 'database' | 'job' | 'telemetry'
  duration: number
  repeatDelay: number
  phase: number
  steps: CircuitRouteStep[]
  mobileSteps?: CircuitRouteStep[]
}

// Components and meaningful branch points sit on a 25-unit routing grid.
export const circuitNodes: CircuitNode[] = [
  { id: 'client', kind: 'client', label: 'CLIENT', x: 50, y: 300, labelY: 31 },
  { id: 'gateway', kind: 'gateway', label: 'API GATEWAY', x: 200, y: 300, labelY: 34 },
  { id: 'router', kind: 'router', label: 'ROUTER', x: 350, y: 300, labelY: 34 },
  { id: 'auth', kind: 'auth', label: 'AUTH', x: 350, y: 150, labelY: -25, mobile: false },
  { id: 'validation', kind: 'validation', label: 'VALIDATION', x: 500, y: 150, labelY: -25, mobile: false },
  { id: 'service', kind: 'service', label: 'SERVICE BUS', x: 600, y: 300, labelY: -29 },
  { id: 'cache', kind: 'cache', label: 'CACHE', x: 800, y: 150, labelY: -25, mobile: false },
  { id: 'database', kind: 'database', label: 'DATABASE', x: 850, y: 300, labelY: 43 },
  { id: 'queue', kind: 'queue', label: 'QUEUE', x: 600, y: 475, labelY: 40 },
  { id: 'worker', kind: 'worker', label: 'WORKER', x: 775, y: 475, labelY: -29 },
  { id: 'completion', kind: 'completion', label: 'COMPLETE', x: 925, y: 475, labelY: 33 },
  { id: 'observability', kind: 'observability', label: 'OBSERVABILITY', x: 400, y: 550, labelY: 39, mobile: false },

  { id: 'j-input', x: 100, y: 300 },
  { id: 'j-gateway-router', x: 275, y: 300 },
  { id: 'j-router-auth', x: 350, y: 250, mobile: false },
  { id: 'j-auth-validation', x: 425, y: 150, mobile: false },
  { id: 'j-validation-service', x: 550, y: 250, mobile: false },
  { id: 'j-router-service', x: 475, y: 300 },
  { id: 'j-service-observe', x: 500, y: 300, mobile: false },
  { id: 'j-service-cache', x: 675, y: 284, mobile: false },
  { id: 'j-cache-rise', x: 675, y: 200, mobile: false },
  { id: 'j-database-a', x: 700, y: 300 },
  { id: 'j-database-b', x: 800, y: 300 },
  { id: 'j-storage-split', x: 621, y: 300 },
  { id: 'j-service-queue', x: 600, y: 350 },
  { id: 'j-queue-feed', x: 550, y: 350 },
  { id: 'j-queue-turn', x: 550, y: 430 },
  { id: 'j-queue-worker-a', x: 675, y: 475 },
  { id: 'j-worker-completion', x: 850, y: 475 },
  { id: 'j-completion-return', x: 875, y: 475 },
  { id: 'j-completion-rise', x: 875, y: 400 },
  { id: 'j-return-service', x: 650, y: 400 },
  { id: 'j-return-feed', x: 620, y: 350 },
  { id: 'j-observe-rise', x: 500, y: 525, mobile: false },
  { id: 'j-observe-branch', x: 475, y: 550, mobile: false },
]

// Every trace uses only M/H/V commands. Paths are sharp-cornered and endpoints
// land on component ports or explicit junctions.
export const circuitTraces: CircuitTrace[] = [
  { id: 'client-input-a', d: 'M60 300 H100', active: true },
  { id: 'client-input-b', d: 'M100 300 H182', active: true },
  { id: 'gateway-router-a', d: 'M182 300 H218 H275', active: true },
  { id: 'gateway-router-b', d: 'M275 300 H334', active: true },
  { id: 'router-core', d: 'M334 300 H350', active: true },
  { id: 'router-auth-a', d: 'M350 300 V250', active: true, mobile: false },
  { id: 'router-auth-b', d: 'M350 250 V166', active: true, mobile: false },
  { id: 'auth-validation-a', d: 'M350 166 V150 H425', active: true, mobile: false },
  { id: 'auth-validation-b', d: 'M425 150 H484', active: true, mobile: false },
  { id: 'validation-service-a', d: 'M484 150 H516 H550 V250', active: true, mobile: false },
  { id: 'validation-service-b', d: 'M550 250 H600 V284', active: true, mobile: false },
  { id: 'service-core-in', d: 'M600 284 V300', active: true },
  { id: 'service-core-left', d: 'M600 300 H579', active: true },
  { id: 'service-core-right', d: 'M600 300 H621', active: true },

  { id: 'router-service-a', d: 'M350 300 H475', active: true },
  { id: 'router-service-b', d: 'M475 300 H500', active: true },
  { id: 'router-service-c', d: 'M500 300 H579', active: true },
  { id: 'service-cache-a', d: 'M621 300 V284 H675', mobile: false },
  { id: 'service-cache-b', d: 'M675 284 V200', mobile: false },
  { id: 'service-cache-c', d: 'M675 200 H750 V150 H781', mobile: false },
  { id: 'service-database-a', d: 'M621 300 H700', active: true },
  { id: 'service-database-b', d: 'M700 300 H800', active: true },
  { id: 'service-database-c', d: 'M800 300 H829', active: true },

  { id: 'service-queue-a', d: 'M600 316 V350' },
  { id: 'service-queue-b', d: 'M600 350 H550' },
  { id: 'service-queue-c', d: 'M550 350 V430' },
  { id: 'service-queue-d', d: 'M550 430 H600 V459' },
  { id: 'queue-worker-a', d: 'M600 459 V475 H675' },
  { id: 'queue-worker-b', d: 'M675 475 H775' },
  { id: 'worker-observe-a', d: 'M775 475 V575 H475 V550', mobile: false },
  { id: 'worker-completion-a', d: 'M775 475 H850' },
  { id: 'worker-completion-b', d: 'M850 475 H875' },
  { id: 'worker-completion-c', d: 'M875 475 H913' },
  { id: 'completion-service-a', d: 'M875 475 V400' },
  { id: 'completion-service-b', d: 'M875 400 H650' },
  { id: 'completion-service-c', d: 'M650 400 V350 H620' },
  { id: 'completion-service-d', d: 'M620 350 V316 H600' },

  { id: 'service-observe-a', d: 'M500 300 V525', mobile: false },
  { id: 'service-observe-b', d: 'M500 525 V550 H475', mobile: false },
  { id: 'observe-component', d: 'M475 550 H423', mobile: false },
]

const requestSteps: CircuitRouteStep[] = [
  { trace: 'client-input-a', to: 'j-input' },
  { trace: 'client-input-b', to: 'gateway', dwell: 0.08 },
  { trace: 'gateway-router-a', to: 'j-gateway-router' },
  { trace: 'gateway-router-b', to: 'router', activate: false },
  { trace: 'router-core', to: 'router', dwell: 0.1 },
  { trace: 'router-auth-a', to: 'j-router-auth' },
  { trace: 'router-auth-b', to: 'auth', dwell: 0.1 },
  { trace: 'auth-validation-a', to: 'j-auth-validation' },
  { trace: 'auth-validation-b', to: 'validation', dwell: 0.1 },
  { trace: 'validation-service-a', to: 'j-validation-service' },
  { trace: 'validation-service-b', to: 'service', activate: false },
  { trace: 'service-core-in', to: 'service', dwell: 0.18 },
  { trace: 'service-core-left', to: 'service', activate: false },
  { trace: 'router-service-c', to: 'j-service-observe', direction: 'reverse' },
  { trace: 'router-service-b', to: 'j-router-service', direction: 'reverse' },
  { trace: 'router-service-a', to: 'router', direction: 'reverse', dwell: 0.08 },
  { trace: 'router-core', to: 'router', direction: 'reverse', activate: false },
  { trace: 'gateway-router-b', to: 'j-gateway-router', direction: 'reverse' },
  { trace: 'gateway-router-a', to: 'gateway', direction: 'reverse', dwell: 0.08 },
  { trace: 'client-input-b', to: 'j-input', direction: 'reverse' },
  { trace: 'client-input-a', to: 'client', direction: 'reverse', dwell: 0.12 },
]

const mobileRequestSteps: CircuitRouteStep[] = [
  { trace: 'client-input-a', to: 'j-input' },
  { trace: 'client-input-b', to: 'gateway', dwell: 0.08 },
  { trace: 'gateway-router-a', to: 'j-gateway-router' },
  { trace: 'gateway-router-b', to: 'router', activate: false },
  { trace: 'router-core', to: 'router', dwell: 0.1 },
  { trace: 'router-service-a', to: 'j-router-service' },
  { trace: 'router-service-b', to: 'j-service-observe' },
  { trace: 'router-service-c', to: 'service', dwell: 0.18 },
  { trace: 'router-service-c', to: 'j-service-observe', direction: 'reverse' },
  { trace: 'router-service-b', to: 'j-router-service', direction: 'reverse' },
  { trace: 'router-service-a', to: 'router', direction: 'reverse', dwell: 0.08 },
  { trace: 'router-core', to: 'router', direction: 'reverse', activate: false },
  { trace: 'gateway-router-b', to: 'j-gateway-router', direction: 'reverse' },
  { trace: 'gateway-router-a', to: 'gateway', direction: 'reverse', dwell: 0.08 },
  { trace: 'client-input-b', to: 'j-input', direction: 'reverse' },
  { trace: 'client-input-a', to: 'client', direction: 'reverse', dwell: 0.12 },
]

const cacheSteps: CircuitRouteStep[] = [
  { trace: 'router-service-a', to: 'j-router-service' },
  { trace: 'router-service-b', to: 'j-service-observe', dwell: 0.08 },
  { trace: 'router-service-c', to: 'service' },
  { trace: 'service-core-left', to: 'service', direction: 'reverse', activate: false },
  { trace: 'service-core-right', to: 'service', activate: false },
  { trace: 'service-cache-a', to: 'j-service-cache' },
  { trace: 'service-cache-b', to: 'j-cache-rise' },
  { trace: 'service-cache-c', to: 'cache', dwell: 0.08 },
  { trace: 'service-cache-c', to: 'j-cache-rise', direction: 'reverse' },
  { trace: 'service-cache-b', to: 'j-service-cache', direction: 'reverse' },
  { trace: 'service-cache-a', to: 'service', direction: 'reverse', dwell: 0.08 },
  { trace: 'service-core-right', to: 'service', direction: 'reverse', activate: false },
  { trace: 'service-core-left', to: 'service', activate: false },
  { trace: 'router-service-c', to: 'j-service-observe', direction: 'reverse' },
  { trace: 'router-service-b', to: 'j-router-service', direction: 'reverse' },
  { trace: 'router-service-a', to: 'router', direction: 'reverse', dwell: 0.12 },
]

const databaseSteps: CircuitRouteStep[] = [
  { trace: 'service-database-a', to: 'j-database-a' },
  { trace: 'service-database-b', to: 'j-database-b' },
  { trace: 'service-database-c', to: 'database', dwell: 0.2 },
  { trace: 'service-database-c', to: 'j-database-b', direction: 'reverse' },
  { trace: 'service-database-b', to: 'j-database-a', direction: 'reverse' },
  { trace: 'service-database-a', to: 'service', direction: 'reverse', dwell: 0.16 },
]

const jobSteps: CircuitRouteStep[] = [
  { trace: 'service-queue-a', to: 'j-service-queue' },
  { trace: 'service-queue-b', to: 'j-queue-feed' },
  { trace: 'service-queue-c', to: 'j-queue-turn' },
  { trace: 'service-queue-d', to: 'queue', dwell: 0.12 },
  { trace: 'queue-worker-a', to: 'j-queue-worker-a' },
  { trace: 'queue-worker-b', to: 'worker', dwell: 0.12 },
  { trace: 'worker-observe-a', to: 'j-observe-branch' },
  { trace: 'observe-component', to: 'observability', dwell: 0.1 },
  { trace: 'observe-component', to: 'j-observe-branch', direction: 'reverse' },
  { trace: 'worker-observe-a', to: 'worker', direction: 'reverse', dwell: 0.08 },
  { trace: 'worker-completion-a', to: 'j-worker-completion' },
  { trace: 'worker-completion-b', to: 'j-completion-return' },
  { trace: 'worker-completion-c', to: 'completion', dwell: 0.14 },
  { trace: 'worker-completion-c', to: 'j-completion-return', direction: 'reverse' },
  { trace: 'completion-service-a', to: 'j-completion-rise' },
  { trace: 'completion-service-b', to: 'j-return-service' },
  { trace: 'completion-service-c', to: 'j-return-feed' },
  { trace: 'completion-service-d', to: 'service', dwell: 0.14 },
]

const mobileJobSteps: CircuitRouteStep[] = [
  { trace: 'service-queue-a', to: 'j-service-queue' },
  { trace: 'service-queue-b', to: 'j-queue-feed' },
  { trace: 'service-queue-c', to: 'j-queue-turn' },
  { trace: 'service-queue-d', to: 'queue', dwell: 0.12 },
  { trace: 'queue-worker-a', to: 'j-queue-worker-a' },
  { trace: 'queue-worker-b', to: 'worker', dwell: 0.12 },
  { trace: 'worker-completion-a', to: 'j-worker-completion' },
  { trace: 'worker-completion-b', to: 'j-completion-return' },
  { trace: 'worker-completion-c', to: 'completion', dwell: 0.14 },
  { trace: 'worker-completion-c', to: 'j-completion-return', direction: 'reverse' },
  { trace: 'completion-service-a', to: 'j-completion-rise' },
  { trace: 'completion-service-b', to: 'j-return-service' },
  { trace: 'completion-service-c', to: 'j-return-feed' },
  { trace: 'completion-service-d', to: 'service', dwell: 0.14 },
]

const telemetrySteps: CircuitRouteStep[] = [
  { trace: 'router-service-c', to: 'j-service-observe', direction: 'reverse' },
  { trace: 'service-observe-a', to: 'j-observe-rise' },
  { trace: 'service-observe-b', to: 'j-observe-branch' },
  { trace: 'observe-component', to: 'observability', dwell: 0.1 },
  { trace: 'observe-component', to: 'j-observe-branch', direction: 'reverse' },
  { trace: 'service-observe-b', to: 'j-observe-rise', direction: 'reverse' },
  { trace: 'service-observe-a', to: 'service', direction: 'reverse', dwell: 0.1 },
  { trace: 'router-service-c', to: 'service', activate: false },
]

export const circuitRoutes: CircuitRoute[] = [
  { id: 'request', duration: 10, repeatDelay: 1.3, phase: 0, steps: requestSteps, mobileSteps: mobileRequestSteps },
  { id: 'cache', duration: 4.2, repeatDelay: 1.9, phase: 2.4, steps: cacheSteps, mobileSteps: [] },
  { id: 'database', duration: 7.4, repeatDelay: 2.2, phase: 3.8, steps: databaseSteps, mobileSteps: [] },
  { id: 'job', duration: 8.2, repeatDelay: 1.5, phase: 5.1, steps: jobSteps, mobileSteps: mobileJobSteps },
  { id: 'telemetry', duration: 4, repeatDelay: 2.6, phase: 7.3, steps: telemetrySteps, mobileSteps: [] },
]
