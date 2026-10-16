# Project principles

## Purpose

bader.os presents verified software work with clear engineering context. It should help a recruiter understand the candidate quickly and give an engineer enough detail to inspect the systems.

## Content integrity

- Keep project facts, status, technologies, responsibilities, links, and images in `data/projects/*.ts`; keep architecture topology in `lib/project-architecture.ts`.
- Do not invent business outcomes, project links, AI work, uptime, performance scores, screenshots, or methods.
- Mark planned or pending architecture components as such.
- Separate project inventory counts from measured product outcomes.

## Experience

- Keep identity and contact actions easy to find.
- Make projects the main evidence and expose their architecture without hover-only interactions.
- Preserve the seven section order and make the current location understandable.
- Keep body copy readable and metadata secondary.
- Support keyboard, touch, reduced motion, and narrow screens.

## Engineering

- Prefer server components for static sections; client state belongs only where interaction needs it.
- Use the project data as the source for architecture relationships.
- Keep useful component boundaries and avoid a monolithic page implementation.
- Keep animation, dependencies, and runtime work proportional to their value.
- Do not claim accessibility, performance, or SEO scores without measuring them.
