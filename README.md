# Meridian Banking — Sui Zer

- Deployed: <url>
- Run locally: `npm install && npm run dev`

## Project structure

```
src/
  api/            Data layer: starter client and types, TanStack Query hooks, demo-param forwarding
  components/     Shared pieces: Header, Skeleton, FieldError
  features/
    dashboard/    Balance hero, accounts, transactions with search, daily limit, skeleton and error states
    transfer/     Dialog, stepper, success panel, Zod schemas, request builder
      substeps/   The three steps (recipient, amount, review) and their shared layout
    preferences/  Theme and segment state, ThemeToggle, SegmentSwitch
  lib/            Pure helpers: formatting (starter), account totals, aria-describedby joiner
  test/           Test setup, render helper, money text helper
  index.css       Global layout, buttons and the few app-level variables not in the tokens
```

Each feature owns its components, CSS and tests. Anything used by more than one
feature lives in `components/` or `lib/`.

## Decisions and trade-offs

Server state vs UI state

- All API data goes through TanStack Query hooks in `src/api/queries.ts`. Nothing
  from the API is copied into `useState`; totals and the remaining limit are
  calculated from query data on render.
- After a transfer I invalidate customer, accounts and transactions rather than
  writing the response into the cache. It is less code and the server stays the
  source of truth for the balance, list and limit. `onSuccess` returns the
  invalidation promise, so the mutation stays pending until the dashboard has
  refetched and the success screen never sits next to a stale balance.
- Theme and segment are UI state, shared through a small React context because
  the segment switch appears in two places (header on desktop, under the
  greeting on mobile). I used `useContext` instead of Redux or Zustand because
  this preference is the only global state the app needs; server data already
  lives in the TanStack Query cache, so a state library would add a dependency
  for very little.

Forms and validation

- React Hook Form with Zod. Each step has its own form; the dialog keeps the
  values of finished steps so `Back` restores everything.
- Every rule lives once in `src/features/transfer/schema.ts`. The amount schema
  is created from the real accounts and remaining limit, so the balance and
  limit messages show live figures and the same schema drives inline errors and
  `Continue`.
- Fields validate on blur and on `Continue`; on `Continue` focus moves to the
  first invalid field. Server field errors are shown in the alert if the API
  still rejects a request.

Theming

- `data-theme` and `data-segment` are set on `<html>`. An inline script in
  `index.html` applies the stored or system choice before first paint, so there
  is no flash on reload.
- Visuals come only from `brief/design-tokens.css`. Values the tokens do not
  cover (rail width, dialog width, a few minimum heights, label tracking,
  disabled opacity, shimmer duration) are declared once as variables at the top
  of `src/index.css` rather than scattered through components.

Libraries added

- `lucide-react` for icons, as named in the brief.
- `@radix-ui/react-dialog` for the transfer dialog. It handles the focus trap,
  `Esc`, focus return and aria wiring, and is unstyled so it is styled with the
  tokens like everything else.

Other choices

- Clicking the backdrop does not close the dialog, so a half-filled transfer is
  not lost by accident. `Esc` and the close button still close it.
- Default segment: stored choice, then the customer's segment from the API,
  then Retail.
- Cards, Payments and Insights are rendered as disabled links, as the brief
  asks.

What I'd change with more time: the `Discard this transfer?` prompt, and a
shared field component to reduce repeated label/input/error markup.

## Loading, empty and error states

| State | How it is handled | How to see it on the deployed site |
| --- | --- | --- |
| Loading | Skeletons sized like the real cards, so the layout does not jump | `/?delay=3000` |
| Empty | Empty messages for accounts, transactions and payees | `/?scenario=empty` |
| Dashboard error | `We couldn't load your dashboard.` with `Retry` | `/?scenario=error` |
| No search results | `No transactions match your search.` with `Clear search` | Search for something like `zzz` |
| Send failure | Stays on review with an alert, data intact, can retry | Put `#fail` in the transfer note |

`src/api/demo.ts` forwards `scenario` and `delay` from the page URL to the GET
requests, so the states can be shown without a debug button in the UI. Without
those parameters requests are unchanged.

## Tests

- Dashboard: total of deposit accounts excludes the credit card.
- Dashboard: a failed accounts request shows the error and `Retry` loads it.
- Transfer: an amount over the balance shows the exact message, focuses the
  field and sends no POST request.
- Transfer: a successful transfer shows `Sending…`, the success screen with a
  reference, and the dashboard shows the new total, transaction and limit.
- Transfer: a failed send stays on review with the alert and the note intact.
- `format.ts`: the starter money and date formatting.

Tests render the whole app against the MSW handlers and use roles and visible
text, so they check behaviour rather than implementation.

## AI use

Tool: Cursor's AI agent.

I used AI mainly to set up the CSS and wire the components together, since from
experience that is the most time-consuming part. My prompt required it to stick
strictly to `design-tokens.css`: only values that are genuinely needed and not
defined in the tokens could be created, and those had to be declared once as
variables rather than hard-coded.

Places where I changed, rejected or fixed what it produced:

- Icons: it first wrote a custom inline-SVG icon component. I switched to
  `lucide-react`, which the brief names, to drop the hand-written paths.
- Dialog: it first built the dialog with its own focus handling. I moved to
  Radix Dialog so focus trap, `Esc` and focus return are handled by a tested
  library.
- Styling: I rejected recolouring the app to another bank's palette and pushed
  remaining hard-coded values (widths, letter spacing, opacity, `transparent`)
  either onto tokens or into the single app-level variable block.

## Not done / known issues

- Optional items not built: discard confirmation, balance-hide toggle, third
  segment, `#transfer` deep link, end-to-end test, CI workflow.
- Data lives in memory in the mock API, so a page refresh resets balances.
