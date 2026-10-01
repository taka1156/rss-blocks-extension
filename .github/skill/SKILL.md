---
name: rss-blocks-project
description: "Use when working on RSS Blocks: its Chrome extension architecture, RSS/Atom feed rendering, shortcuts, groups, article and audio panes, sync storage, settings import/export, or permissions."
---

# RSS Blocks Project Overview

## Project

RSS Blocks is a Manifest V3 Chrome extension that opens a local extension page for organizing RSS and Atom feeds as blocks. The interface and user-facing messages are primarily Japanese. There is no build system or package manifest; the extension consists of plain HTML, CSS, and JavaScript.

## Files

- `manifest.json`: Extension metadata, permissions, service worker, and browser action.
- `background.js`: Opens or focuses `feeds.html` and registers a dynamic declarative network rule for article iframes.
- `feeds.html`: Main page markup, add-feed and add-shortcut dialog, settings import/export dialog, and article/audio pane.
- `feeds.js`: Feed parsing and rendering, shortcut and group management, drag-and-drop, persistence, article/audio playback, and settings JSON import/export.
- `feeds.css`: Page layout, dialogs, feed blocks, groups, shortcuts, and responsive article pane styling.

## Features

- Fetches RSS and Atom feeds, showing up to 15 items per feed.
- Uses a feed's available image metadata or article content for thumbnails; detects audio enclosures and plays them in the side pane.
- Opens articles in an embedded pane when enabled, with an option to open the article in a new tab.
- Supports feed blocks with editable title, URL, and border color; blocks can be reordered and assigned to groups.
- Supports standalone website shortcuts with favicon fallback.
- Provides settings JSON export/import for shortcuts, groups, and feed URL/title/border color/group assignment. Import validates the version, data shapes, and HTTP(S) URLs, then replaces those three settings collections.
- Offers thumbnail visibility and embedded article-pane preferences.

## Storage

The extension uses `chrome.storage.sync` with these keys:

- `feeds`: ordered feed objects with `url`, `title`, `color`, and `group`. Older string feed entries are normalized when rendered.
- `groups`: ordered group objects with `id`, `title`, `color`, and `collapsed`.
- `shortcuts`: website entries shaped as `{ "url": "https://example.com/" }`.
- `thumbs`: whether feed thumbnails are enabled.
- `sideOpen`: whether normal article clicks open in the embedded pane.

If `feeds` is absent, `feeds.js` displays the built-in `DEFAULTS`. The settings JSON includes `feeds`, `groups`, and `shortcuts`; it does not include the `thumbs` or `sideOpen` preferences.

## Network and Security Notes

- The manifest grants `storage`, `declarativeNetRequest`, and `<all_urls>` host access because the extension fetches arbitrary feeds and remote feed assets.
- `background.js` removes `X-Frame-Options` and `Content-Security-Policy` response headers for subframes initiated by this extension so article pages can be displayed in its iframe. Keep the rule scoped to the extension initiator and subframe resource type; do not broaden it unnecessarily.
- Article links and shortcut links opened in new tabs use `noopener noreferrer`.

## Development Guidance

- Keep the extension dependency-free and preserve the existing plain JavaScript patterns unless a task requires otherwise.
- Keep persisted feed/group state consistent with the DOM ordering; `persist()` reads the rendered grids and groups before saving.
- Preserve compatibility with older string-valued feed entries through `normFeed()`.
- There are no repository-defined build or test scripts. For JavaScript syntax checks, use `node --check feeds.js` when Node.js is available; manually reload the unpacked extension in Chrome to verify browser APIs and UI behavior.
