# Fralon Peanuts Frontend — Agent Guide

## Purpose

This repository is the Fralon Peanuts ecommerce frontend. It is a Next.js App Router application that provides the public storefront, authentication, customer account area, cart, checkout UI, and a small admin area.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 and shadcn/Radix UI components
- Supabase for authentication, database access, and product-image storage
- TanStack Query for server-state caching and mutations
- React Hook Form + Zod for forms and validation
- Sentry for error monitoring
- Resend/React Email assets for email-related functionality

## Project layout

- `src/app/` — routes and layouts using the App Router.
  - `auth/` contains authentication routes such as `/auth/login` and `/auth/register`.
  - `(main)/(public)/` contains public storefront pages.
  - `(main)/(protected)/` contains checkout, account, and admin routes.
- `src/modules/` — feature-first application code. Each feature owns its pages, components, hooks, schemas, services, and repositories where appropriate.
- `src/shared/` — reusable UI, utilities, Supabase clients, SEO, errors, and cross-cutting helpers.
- `src/providers/` — global React providers for auth and TanStack Query.
- `src/config/` — validated client/server environment configuration and site settings.
- `public/images/` — static marketing assets.

## Core flows

### Products

Product lists and product details are read directly from Supabase. Product repositories join `products`, `categories`, `product_images`, and `product_variants`. Supabase Storage bucket `products` is used to resolve image URLs.

### Authentication and profiles

`AuthProvider` initializes Supabase auth on the client, fetches the profile with its default address, and sets the Sentry user. Profile roles are used by the admin layout. Supabase is the active backend and authentication boundary.

`src/shared/lib/api-client.ts` and the Axios-based auth calls are legacy code from an earlier API-backed implementation. They are intentionally retained for reference, but new production features must not use or extend them. Remove or archive them only as a separately scoped cleanup after confirming that no active flow imports them.

### Cart

Guests store cart entries in `localStorage`. Authenticated users use Supabase `cart` and `cart_items` tables. On login, guest cart contents are merged into the server cart, preserving the higher quantity when the same variant exists in both carts.

### Checkout

Checkout currently collects fulfilment, delivery, and payment details, then routes to the success page. It does **not** yet create an order, initiate M-Pesa, check stock server-side, clear the cart, or persist checkout data.

Current checkout decisions: pickup is free; delivery uses one fixed fee for now; cash and M-Pesa are supported; the third-party payment provider will be selected later. Keep payment-provider code behind a small adapter so the order transaction and UI do not depend on a specific provider.

## Important conventions

- Keep feature code within `src/modules/<feature>/`; only promote genuinely reusable code into `src/shared/`.
- Prefer the existing Supabase repository/service/hook layering for product and cart data and any other future feature.
- Preserve the guest-cart and signed-in-cart behavior when changing cart code.
- Environment variables are validated at startup. Do not add client-exposed secrets; only `NEXT_PUBLIC_*` values are safe for client code.
- Database authorization must be enforced with Supabase RLS/server-side logic. Client-side route guards are only a UX layer.

## Known issues to consider before related work

- `src/proxy.ts` redirects unauthenticated users to `/login`, but the real route is `/auth/login`. Its authenticated-user exclusions similarly use `/login` and `/register` instead of the `/auth/*` routes.
- In `src/modules/cart/hooks/use-server-cart.ts`, mutation success callbacks reference `invalidate` without invoking it. Use `invalidate()` so cart queries refresh after mutations.
- The current checkout flow is a UI stub, not a complete ordering/payment integration.
- Axios API-client code is legacy and should not be extended. Active auth and data flows should use Supabase.
- Some source comments contain malformed encoding characters. Avoid introducing more and clean nearby text when editing it.
- `README.md` is still the default Next.js README and is not an authoritative setup or architecture reference.

## Implementation tracker

Use this as the durable work queue for the observations made during the initial project review. Keep entries here until they are verified complete; update the status, implementation notes, changed files, and verification after each task.

| Status | Work item | Desired outcome / acceptance criteria |
| --- | --- | --- |
| Complete | Refresh cart queries after mutations | `invalidate()` now runs after successful add, update, remove, and clear mutations. The cart drawer, page, count, and totals will refetch from the cart-items query without a manual refresh. |
| In progress | Enforce inventory limits | Prevent adding/updating cart quantities above available stock in the UI, but enforce the rule authoritatively in Supabase RLS/RPC/database logic and again when creating an order. |
| Backlog | Correct proxy auth routes | All redirects and authenticated-page exclusions use the actual `/auth/login` and `/auth/register` routes. Test guest and signed-in navigation for public, account, admin, and auth pages. |
| Backlog | Align client and proxy route protection | The client protected layout and server proxy should agree on destinations and protection rules, with no flash, loop, or incorrect redirect. |
| Complete | Repair signup profile/cart provisioning | The signup trigger now inserts the required `profiles.email` while creating profile/customer records. Verify a new user receives a profile, customer record, and exactly one cart. |
| Backlog | Complete checkout and ordering | Submitting checkout creates a server-validated order, calculates trusted prices/delivery, checks and reserves stock transactionally, starts the chosen payment flow (including M-Pesa when selected), handles payment confirmation, clears the cart only after a successful order, and renders real order data on the success page. |
| Deferred cleanup | Retire or archive the legacy Axios API client | Do not extend the Axios client or its remaining callers. When intentionally scheduled, audit imports, migrate any still-active calls to Supabase, then remove/archive the legacy implementation with verification. |
| Backlog | Replace the default README | Document prerequisites, environment variables (without secrets), local development, scripts, Supabase schema/RLS expectations, deployment, and the implemented ordering/payment workflow. |
| Backlog | Repair source-text encoding | Replace malformed comment characters with valid UTF-8 punctuation in touched source files, then perform a focused repository cleanup. |

### Tracker update format

When starting an item, change its status to `In progress` and add a short scope/decision note below this section. When completing it, mark it `Complete` and record:

- implementation summary and the relevant files;
- security or data-integrity decisions, where applicable;
- checks run and their outcome;
- any follow-up work that remains.

### Completed tracker notes

#### Refresh cart queries after mutations — Complete

- Changed `src/modules/cart/hooks/use-server-cart.ts` so every mutation success handler invokes `invalidate()` instead of only referencing it.
- This preserves server-confirmed updates: the cache is refreshed only after Supabase reports a successful mutation; failed mutations still show an error and do not trigger a refetch as a success path.
- Verification: inspected the four success handlers after the change. A focused ESLint run was attempted but timed out in this execution environment, so browser-level verification remains advisable: add, update, remove, and clear an item while checking the cart drawer, cart page, badge, and totals.

#### Repair signup profile/cart provisioning — Complete

- The Supabase signup trigger was updated in the SQL Editor to insert the required `profiles.email` from `auth.users.email` while creating profile and customer records.
- This restores atomic signup provisioning and allows the existing cart-creation trigger to run after registration.
- Verification was performed by the project owner in Supabase. A new-user smoke test should confirm one profile, one customer record, and one cart.

## Problem-solving and scale playbook

Treat this repository as a system that will grow in features, data volume, and contributors. Before changing a tracked item, preserve the reasoning below so a future agent or subagent can continue without rediscovering the decision context.

### Approach every task in this order

1. **Establish the current behavior.** Identify the route, module, data source, and user states affected (guest, signed-in customer, and admin where relevant). Read the existing implementation before proposing a fix.
2. **Define the boundary of responsibility.** Decide what belongs in UI, client state, Supabase/RLS, database RPCs, or a server-side integration. Client code improves experience; sensitive validation, prices, inventory, permissions, and payment state must be authoritative outside the browser.
3. **Write acceptance criteria before implementation.** Include expected behavior, failure behavior, security/data-integrity requirements, and how the result will be verified.
4. **Prefer small vertical changes.** Make one end-to-end improvement at a time, keeping feature code in its module and shared infrastructure minimal and intentional. Avoid broad refactors while fixing an unrelated issue.
5. **Make state explicit and recoverable.** Model loading, empty, success, error, retry, and concurrent-update states. Use idempotent server operations for checkout, payments, and other actions that may be retried.
6. **Verify at the correct layer.** Check UI behavior, repository/query behavior, and database/server guarantees separately. A passing client UI is not proof of authorization, stock integrity, or payment correctness.
7. **Record the outcome here.** Update the tracker entry with the decision, files, verification, and remaining work. This is the handoff record for the next human or agent.

### Scalable design guardrails

- Keep business rules close to their authoritative data source. Do not trust browser-calculated totals, stock, roles, or payment results.
- Use typed contracts and schemas at boundaries. Extend existing TypeScript types and Zod schemas rather than passing unstructured data through modules.
- Keep UI components presentational where possible; place remote operations in repositories/services/hooks.
- Design mutations to be safe when repeated and to handle stale data. Invalidate or update query cache deliberately after writes.
- Maintain clear ownership: feature modules own feature behavior; `shared` is for stable cross-feature utilities, not a catch-all folder.
- Add observability for consequential failures (orders, payments, auth, inventory) without logging secrets or sensitive user data.
- Prefer a staged rollout for high-impact flows: schema/RLS or RPC design, server implementation, client integration, then error/retry and monitoring.

### Agent/subagent handoff format

When delegating a bounded task, provide:

- tracker item and exact objective;
- relevant routes/modules and current behavior;
- constraints and decisions already made;
- acceptance criteria and required verification;
- explicit write scope and whether the assignee may modify shared infrastructure;
- a request to update this tracker with the implementation summary and evidence.

Do not delegate an undefined outcome such as “fix checkout.” Split it into independently verifiable pieces, for example: cart consistency, order schema/RPC, payment initiation, payment webhook verification, and success-page presentation.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

On Windows systems where PowerShell blocks `npm.ps1`, use `npm.cmd run <script>`.

## Change checklist

1. Check the matching route, module, and repository/hook before changing a flow.
2. Validate both guest and authenticated behavior for cart changes.
3. Validate route protection for auth, account, and admin changes.
4. For checkout/payment work, implement server-side order, price, stock, and payment verification; never trust client totals or payment state.
5. Run lint/build where the environment permits, and add/update tests when the project gains a test setup.
