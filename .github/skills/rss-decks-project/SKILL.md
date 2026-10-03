---
name: rss-decks-project
description: "Use when working on RSS Decks: its Chrome extension architecture, RSS/Atom feed rendering, shortcuts, groups, article and audio panes, sync storage, settings import/export, or permissions."
---

# RSS Decks Project Overview

## Project

RSS Decks is a Manifest V3 Chrome extension built with **WXT** that opens a local extension page for organizing RSS and Atom feeds as blocks. The interface supports Japanese and English (i18next). The project uses TypeScript, React, and Vanilla Extract for styling.

## Build & Architecture

- **Build system**: WXT (Web extension template)
- **Language**: TypeScript
- **UI Framework**: React 19
- **i18n**: i18next + react-i18next (`ja`, `en`)
- **Testing**: Vitest + Testing Library (`yarn test`, setup in `setupTest.ts`)
- **Styling**: Vanilla Extract CSS-in-TS
- **Package manager**: Yarn
- **Linter**: Biome

### Key Files & Directories

- `wxt.config.ts`: WXT build configuration
- `src/entrypoints/`: WXT entrypoints (background, feed, help pages)
- `src/entrypoints/feed/Feed.tsx`: Main dashboard component for feed management
- `src/entrypoints/help/Help.tsx`: Help page
- `src/entrypoints/background.ts`: Service worker
- `src/components/`: React components (feature and shared)
- `src/hooks/`: Custom React hooks for state management
- `src/storage/`: Chrome Storage API abstractions
- `src/utils/`: Utilities (`feedParser.ts`, `hostPermission.ts` with `requestHostAccess`)
- `src/i18n.ts`: i18next setup; language persisted in `localStorage` (`rss-decks-language`), defaults to browser language (`ja` or `en`), fallback `ja`
- `src/locales/{ja,en}/translation.json`: Translation strings (keep both in sync)
- `src/styles/`: Theme and global styles
- `rss-blocks-settings.json`: Settings schema/defaults
- `tsconfig.json`: TypeScript configuration
- `biome.json`: Linting and formatting configuration

## Features

- **Feed Management**: Fetches RSS and Atom feeds, showing up to 15 items per feed
- **Thumbnails**: Uses feed's image metadata or article content; detects audio enclosures for playback
- **Article & Audio Panes**: Opens articles in an embedded side pane with audio player
- **Feed Blocks**: Editable title, URL, border color; drag-and-drop reordering; group assignment
- **Shortcuts**: Website shortcuts with icon fallback
- **Language**: `LanguageMenu` switches between Japanese and English
- **Settings**: JSON export/import for feeds, groups, shortcuts, and UI preferences
- **Preferences**: Thumbnail visibility toggle and embedded article-pane mode toggle

## Storage

Chrome Storage API (`chrome.storage.sync`) keys:

- `feeds`: Ordered feed objects with `url`, `title`, `color`, and `group`
- `groups`: Ordered group objects with `id`, `title`, `color`, and `collapsed`
- `shortcuts`: Website entries with `url` property
- `thumbs`: Boolean toggle for thumbnail visibility
- `sideOpen`: Boolean toggle for embedded article-pane mode

The settings JSON export includes `feeds`, `groups`, and `shortcuts` (not `thumbs` or `sideOpen`).

## Network and Security Notes

- The manifest grants `storage`, `alarms`, and `declarativeNetRequest`; host access (`http://*/*`, `https://*/*`) is **optional** and requested at runtime per origin via `requestHostAccess` (must be called synchronously in a user gesture) when adding/importing/refreshing feeds or opening articles
- Service worker removes `X-Frame-Options` and `Content-Security-Policy` headers for article iframes (scoped to extension initiator and subframe type)
- Article and shortcut links use `noopener noreferrer` when opened in new tabs

## Development Guidance

- **Build**: `yarn build` (WXT handles bundling for Chrome MV3)
- **Dev**: `yarn dev` (watch mode with hot reload)
- **Lint**: `yarn lint` (Biome)
- **Test**: `yarn test` (Vitest)
- **Type check**: `yarn compile`
- All user-facing strings go through `t()` with keys in both locale files
- Maintain React component modularity in `src/components/`
- Use custom hooks in `src/hooks/` for reusable state logic
- Store Chrome API abstractions in `src/storage/`
- Styles use Vanilla Extract CSS-in-TS files (`*.css.ts`)
- Keep feed/group state consistent with persisted order via storage hooks
