## Trifecta Monorepo

This example monorepo contains the three major pieces of a mobile app product:

* Mobile App
* Web/API App
* Async Tasks

## Getting Started

Run the following command:

```sh
npm i -g pnpm
pnpm install
turbo build
turbo run develop
```

## OK, But What's So Great About It?

This setup is great for early-stage products that are moving quickly with a small team. Full-stack developers can easily build features that touch all three parts of the product. Shared types and logic keep everyone on the same page and regressions to a minimum.

```plaintext
trifecta-monorepo/
├── .github/
│   └── workflows/
├── apps/
│   ├── lambda/
│   ├── mobile/
│   ├── web/
├── packages/
│   ├── shared-types/
│   ├── shared-utils/
│   ├── ui/
```
