# Third-party libraries

Every direct dependency of this repository, with the version pinned by its lock file and its licence.
Transitive dependencies are not listed; reproduce the full tree with the commands at the end.

All licences below are permissive (MIT, Apache-2.0, BSD, ISC) except two under MPL-2.0: `web-push` (runtime) and `hypothesis` (tests only). MPL-2.0 is file-level copyleft: it applies to changes made to those libraries' own files, not to code that uses them, so both are compatible with this project's [MIT licence](LICENSE.md) as used here.

## Web app (`web/`, from `web/package-lock.json`)

| Package | Version | Licence | Used for |
|---|---|---|---|
| [@fullcalendar/daygrid](https://www.npmjs.com/package/@fullcalendar/daygrid) | 6.1.19 | MIT | runtime |
| [@fullcalendar/interaction](https://www.npmjs.com/package/@fullcalendar/interaction) | 6.1.19 | MIT | runtime |
| [@fullcalendar/react](https://www.npmjs.com/package/@fullcalendar/react) | 6.1.19 | MIT | runtime |
| [@fullcalendar/timegrid](https://www.npmjs.com/package/@fullcalendar/timegrid) | 6.1.19 | MIT | runtime |
| [@headlessui/react](https://www.npmjs.com/package/@headlessui/react) | 2.2.9 | MIT | runtime |
| [@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers) | 5.2.2 | MIT | runtime |
| [@radix-ui/react-accordion](https://www.npmjs.com/package/@radix-ui/react-accordion) | 1.2.12 | MIT | runtime |
| [@radix-ui/react-alert-dialog](https://www.npmjs.com/package/@radix-ui/react-alert-dialog) | 1.1.15 | MIT | runtime |
| [@radix-ui/react-checkbox](https://www.npmjs.com/package/@radix-ui/react-checkbox) | 1.3.3 | MIT | runtime |
| [@radix-ui/react-dialog](https://www.npmjs.com/package/@radix-ui/react-dialog) | 1.1.15 | MIT | runtime |
| [@radix-ui/react-dropdown-menu](https://www.npmjs.com/package/@radix-ui/react-dropdown-menu) | 2.1.16 | MIT | runtime |
| [@radix-ui/react-label](https://www.npmjs.com/package/@radix-ui/react-label) | 2.1.8 | MIT | runtime |
| [@radix-ui/react-progress](https://www.npmjs.com/package/@radix-ui/react-progress) | 1.1.8 | MIT | runtime |
| [@radix-ui/react-scroll-area](https://www.npmjs.com/package/@radix-ui/react-scroll-area) | 1.2.10 | MIT | runtime |
| [@radix-ui/react-select](https://www.npmjs.com/package/@radix-ui/react-select) | 2.2.6 | MIT | runtime |
| [@radix-ui/react-separator](https://www.npmjs.com/package/@radix-ui/react-separator) | 1.1.8 | MIT | runtime |
| [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) | 1.2.4 | MIT | runtime |
| [@radix-ui/react-toast](https://www.npmjs.com/package/@radix-ui/react-toast) | 1.2.15 | MIT | runtime |
| [@radix-ui/react-tooltip](https://www.npmjs.com/package/@radix-ui/react-tooltip) | 1.2.8 | MIT | runtime |
| [@supabase/ssr](https://www.npmjs.com/package/@supabase/ssr) | 0.7.0 | MIT | runtime |
| [@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js) | 2.79.0 | MIT | runtime |
| [@swc/jest](https://www.npmjs.com/package/@swc/jest) | 0.2.39 | MIT | runtime |
| [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) | 0.7.1 | Apache-2.0 | runtime |
| [clsx](https://www.npmjs.com/package/clsx) | 2.1.1 | MIT | runtime |
| [headlessui](https://www.npmjs.com/package/headlessui) | 0.0.0 | MIT | runtime |
| [lucide-react](https://www.npmjs.com/package/lucide-react) | 0.462.0 | ISC | runtime |
| [next](https://www.npmjs.com/package/next) | 15.5.4 | MIT | runtime |
| [react](https://www.npmjs.com/package/react) | 19.1.0 | MIT | runtime |
| [react-dom](https://www.npmjs.com/package/react-dom) | 19.1.0 | MIT | runtime |
| [react-hook-form](https://www.npmjs.com/package/react-hook-form) | 7.66.1 | MIT | runtime |
| [react-markdown](https://www.npmjs.com/package/react-markdown) | 10.1.0 | MIT | runtime |
| [recharts](https://www.npmjs.com/package/recharts) | 3.5.0 | MIT | runtime |
| [remark-gfm](https://www.npmjs.com/package/remark-gfm) | 4.0.1 | MIT | runtime |
| [supertest](https://www.npmjs.com/package/supertest) | 7.1.4 | MIT | runtime |
| [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) | 3.3.1 | MIT | runtime |
| [tailwindcss-animate](https://www.npmjs.com/package/tailwindcss-animate) | 1.0.7 | MIT | runtime |
| [web-push](https://www.npmjs.com/package/web-push) | 3.6.7 | MPL-2.0 | runtime |
| [zod](https://www.npmjs.com/package/zod) | 4.1.12 | MIT | runtime |
| [@eslint/eslintrc](https://www.npmjs.com/package/@eslint/eslintrc) | 3.3.1 | MIT | development and tests |
| [@playwright/test](https://www.npmjs.com/package/@playwright/test) | 1.57.0 | Apache-2.0 | development and tests |
| [@tailwindcss/postcss](https://www.npmjs.com/package/@tailwindcss/postcss) | 4.1.16 | MIT | development and tests |
| [@tailwindcss/typography](https://www.npmjs.com/package/@tailwindcss/typography) | 0.5.19 | MIT | development and tests |
| [@testing-library/dom](https://www.npmjs.com/package/@testing-library/dom) | 10.4.1 | MIT | development and tests |
| [@testing-library/jest-dom](https://www.npmjs.com/package/@testing-library/jest-dom) | 6.9.1 | MIT | development and tests |
| [@testing-library/react](https://www.npmjs.com/package/@testing-library/react) | 16.3.0 | MIT | development and tests |
| [@testing-library/user-event](https://www.npmjs.com/package/@testing-library/user-event) | 14.6.1 | MIT | development and tests |
| [@types/jest](https://www.npmjs.com/package/@types/jest) | 30.0.0 | MIT | development and tests |
| [@types/node](https://www.npmjs.com/package/@types/node) | 20.19.24 | MIT | development and tests |
| [@types/react](https://www.npmjs.com/package/@types/react) | 19.2.2 | MIT | development and tests |
| [@types/react-dom](https://www.npmjs.com/package/@types/react-dom) | 19.2.2 | MIT | development and tests |
| [@types/supertest](https://www.npmjs.com/package/@types/supertest) | 6.0.3 | MIT | development and tests |
| [@types/web-push](https://www.npmjs.com/package/@types/web-push) | 3.6.4 | MIT | development and tests |
| [autoprefixer](https://www.npmjs.com/package/autoprefixer) | 10.4.21 | MIT | development and tests |
| [concurrently](https://www.npmjs.com/package/concurrently) | 9.2.1 | MIT | development and tests |
| [dotenv](https://www.npmjs.com/package/dotenv) | 17.2.3 | BSD-2-Clause | development and tests |
| [eslint](https://www.npmjs.com/package/eslint) | 9.39.1 | MIT | development and tests |
| [eslint-config-next](https://www.npmjs.com/package/eslint-config-next) | 15.5.4 | MIT | development and tests |
| [identity-obj-proxy](https://www.npmjs.com/package/identity-obj-proxy) | 3.0.0 | MIT | development and tests |
| [jest](https://www.npmjs.com/package/jest) | 30.2.0 | MIT | development and tests |
| [jest-environment-jsdom](https://www.npmjs.com/package/jest-environment-jsdom) | 30.2.0 | MIT | development and tests |
| [postcss](https://www.npmjs.com/package/postcss) | 8.5.6 | MIT | development and tests |
| [prettier](https://www.npmjs.com/package/prettier) | 3.6.2 | MIT | development and tests |
| [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss) | 0.7.1 | MIT | development and tests |
| [tailwindcss](https://www.npmjs.com/package/tailwindcss) | 4.1.17 | MIT | development and tests |
| [ts-jest](https://www.npmjs.com/package/ts-jest) | 29.4.5 | MIT | development and tests |
| [ts-node](https://www.npmjs.com/package/ts-node) | 10.9.2 | MIT | development and tests |
| [tsx](https://www.npmjs.com/package/tsx) | 4.20.6 | MIT | development and tests |
| [tw-animate-css](https://www.npmjs.com/package/tw-animate-css) | 1.4.0 | MIT | development and tests |
| [typescript](https://www.npmjs.com/package/typescript) | 5.9.3 | Apache-2.0 | development and tests |

## Backend (`backend/`, from `backend/uv.lock`)

| Package | Version | Licence | Used for |
|---|---|---|---|
| [fastapi](https://pypi.org/project/fastapi/) | 0.123.0 | MIT | runtime |
| [google-genai](https://pypi.org/project/google-genai/) | 1.52.0 | Apache-2.0 | runtime |
| [pandas](https://pypi.org/project/pandas/) | 2.3.3 | BSD-3-Clause | runtime |
| [pydantic](https://pypi.org/project/pydantic/) | 2.12.5 | MIT | runtime |
| [python-dotenv](https://pypi.org/project/python-dotenv/) | 1.2.1 | BSD-3-Clause | runtime |
| [scikit-learn](https://pypi.org/project/scikit-learn/) | 1.7.2 | BSD-3-Clause | runtime |
| [sentence-transformers](https://pypi.org/project/sentence-transformers/) | 5.1.2 | Apache-2.0 | runtime |
| [supabase](https://pypi.org/project/supabase/) | 2.24.0 | MIT | runtime |
| [torch](https://pypi.org/project/torch/) | 2.9.1 | BSD-3-Clause | runtime |
| [transformers](https://pypi.org/project/transformers/) | 4.57.3 | Apache-2.0 | runtime |
| [uvicorn](https://pypi.org/project/uvicorn/) | 0.38.0 | BSD-3-Clause | runtime |
| [httpx](https://pypi.org/project/httpx/) | 0.28.1 | BSD-3-Clause | development and tests |
| [hypothesis](https://pypi.org/project/hypothesis/) | 6.148.3 | MPL-2.0 | development and tests |
| [pytest](https://pypi.org/project/pytest/) | 9.0.1 | MIT | development and tests |
| [ruff](https://pypi.org/project/ruff/) | 0.14.7 | MIT | development and tests |

## Reproduce this list

```bash
# web: every package with its licence, including transitive ones
cd web && npx license-checker --production --summary
# backend
cd backend && uv pip list && uvx pip-licenses --from=mixed
```

