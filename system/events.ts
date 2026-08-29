/** Ambient system events shown in the terminal overlay */
export interface SystemEvent {
  type:    'cmd' | 'ok' | 'warn' | 'sys' | 'plain'
  message: string
  delay?:  number   // ms after start
}

export const AMBIENT_EVENTS: SystemEvent[] = [
  { type: 'sys',   message: 'system init — bader.os v2.0.4',              delay: 0    },
  { type: 'cmd',   message: '$ docker compose up --build',                 delay: 400  },
  { type: 'ok',    message: '✓  gateway       running on :8080',           delay: 900  },
  { type: 'ok',    message: '✓  auth-service  running on :8081',           delay: 1200 },
  { type: 'ok',    message: '✓  employee-svc  running on :8082',           delay: 1500 },
  { type: 'ok',    message: '✓  postgresql     healthy',                   delay: 1800 },
  { type: 'ok',    message: '✓  rabbitmq       ready — amqp://localhost',  delay: 2100 },
  { type: 'sys',   message: 'all services online',                         delay: 2500 },
  { type: 'cmd',   message: '$ git log --oneline -5',                      delay: 3500 },
  { type: 'plain', message: 'a3f21bc  feat: add payroll microservice',     delay: 3800 },
  { type: 'plain', message: '9b4de12  refactor: extract auth middleware',   delay: 4000 },
  { type: 'plain', message: '5c8a091  fix: race condition in leave svc',    delay: 4200 },
  { type: 'plain', message: '2e7f3a4  chore: update docker compose',       delay: 4400 },
  { type: 'plain', message: '8d1c567  feat: employee onboarding flow',      delay: 4600 },
  { type: 'cmd',   message: '$ npm run build',                              delay: 6000 },
  { type: 'ok',    message: '✓  compiled successfully  5.2s',              delay: 7200 },
  { type: 'sys',   message: 'environment ready',                           delay: 7800 },
]

/** Events that loop after initial sequence */
export const LOOP_EVENTS: SystemEvent[] = [
  { type: 'cmd',  message: '$ prisma migrate deploy', },
  { type: 'ok',   message: '✓  migrations applied',  },
  { type: 'sys',  message: 'heartbeat — all systems nominal', },
  { type: 'cmd',  message: '$ docker stats --no-stream',  },
  { type: 'plain',message: 'gateway     cpu:0.2%  mem:128MB', },
  { type: 'plain',message: 'auth-svc    cpu:0.1%  mem:96MB',  },
  { type: 'plain',message: 'employee    cpu:0.3%  mem:184MB', },
  { type: 'cmd',  message: '$ redis-cli ping',  },
  { type: 'ok',   message: 'PONG',  },
  { type: 'sys',  message: 'next commit in ~14 minutes', },
]
