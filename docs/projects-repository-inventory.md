# GitHub project inventory

Discovery source: the GitHub public repositories API for `ben-bader`, queried on 11 October 2026 with pagination (`per_page=100`; one page returned 18 repositories). The API request used the unauthenticated public account endpoint because `gh` is not installed in this environment. This inventory covers public repositories visible to that endpoint; it cannot establish whether the account also has private repositories.

Repository README files, language summaries, and source trees were reviewed where the API allowed. After GitHub rate limiting blocked further API README requests, raw public README files were used for `user-management-pro` and `Zentry`. `Horizon` was checked against its raw README and package metadata and matched the uncustomized create-next-app starter description. Repositories without READMEs are described conservatively from their names and file types. No live deployment URL was supplied by the inspected README material, so the catalog does not publish a demo URL.

| Repository | Catalog entry | Decision and evidence |
| --- | --- | --- |
| `advice` | `advice` | Included. React app README documents fetching random advice from Advice Slip API. |
| `Anime` | `anime` | Included as an educational PHP authentication and landing-page prototype; README notes limited security hardening. |
| `bader.os` | `bader-os` | Included. The repository is this portfolio and documents its layered Next.js experience. |
| `Bank-Modern-APP` | `bank-modern-app` | Included as a React/Vite banking landing-page UI, not a banking service. README references a local preview image. |
| `ben-bader` | — | Excluded. Profile README repository; it contains profile content rather than a standalone application. |
| `black-jack-game` | `black-jack-game` | Included as a small HTML/CSS/JavaScript card-game project; README identifies it as an early project. |
| `GPT-3` | `gpt-3` | Included as a React/Vite chatbot interface concept. README documents UI, not model inference or an AI backend. |
| `Homely` | `homely` | Included as a documented team academic project. README describes Flutter clients, React admin dashboard, Spring Boot REST API, and PostgreSQL; the repository is organized into Backend, Mobile, Modelisation, and Web. |
| `Horizon` | — | Excluded. README is the default create-next-app starter guide and describes no distinct project; the expected `app/page.tsx` was not present at the checked raw URL. |
| `Innovex` | `innovex` | Included. README documents a Next.js event explorer with accounts, event discovery, favorites, Prisma, and PostgreSQL. No verified live URL was found. |
| `Modern-Form` | `modern-form` | Included as a React login/signup form prototype with mode switching and basic validation; README references a local preview image. |
| `Nike` | `nike` | Included as a React/Vite landing-page concept, not an e-commerce application; README references a local preview image. |
| `ONEE-SYS` | `onee-sys` | Included. README documents a Laravel/Blade inventory system using SQLite, with equipment, brand, employee, and site records. No verified public demo URL was found. |
| `passengers-counter` | `passengers-counter` | Included as a small browser counter, based on repository name and HTML/CSS/JavaScript contents; no README was available, so details are intentionally limited. |
| `Slider` | `slider` | Included as a small HTML/CSS image-slider experiment based on its page, stylesheet, and Images directory; no README was available. |
| `TEXT-EFFECT` | `text-effect` | Included as a small HTML/CSS visual experiment. README describes text overlapped by leaves. |
| `user-management-pro` | `user-management-pro` | Included. README documents vanilla JavaScript CRUD, localStorage persistence, JSON seed data, validation, and toast notifications; it references local screenshots. |
| `Zentry` | `zentry` | Included as a React/Vite landing-page recreation using Tailwind CSS and GSAP; README references a local preview image. |

## Additional locally documented project

`AtlasHR` is already represented in the portfolio's internship and project content and is retained as a catalog entry. It did not appear among the 18 public repositories returned by GitHub. The record links no repository and explicitly labels its source limitation; its summary is restricted to the local portfolio's existing documentation.

## Totals

- Public repositories discovered: 18.
- Public standalone projects included: 16.
- Account/profile or starter-template repositories excluded: 2.
- Additional locally documented catalog project: AtlasHR (no public repository found).
- Local catalog records: 17.
- Private repositories: not enumerable through the unauthenticated public API; no authenticated GitHub CLI was available.
