[日本語版はこちら](README.ja.md)

# RSS Blocks

A Chrome extension for organizing multiple RSS/Atom feeds into blocks. View articles in the extension or play audio enclosures, such as podcasts.

## Installation

### Run in a development environment

1. Clone this repository locally.
2. Install the dependencies.
   ```sh
   npm install
   ```
3. Build for the Chromium target.
   ```sh
   npm run build
   ```
4. Open `chrome://extensions` in Chrome.
5. Enable **Developer mode**.
6. Select **Load unpacked** and choose the generated `.output/chrome-mv3` folder.
7. Open RSS Blocks by clicking its toolbar icon.

## Usage

- Select **Add** to register an RSS/Atom feed or a shortcut to a website.
- Use **Groups** to organize feeds, then drag them to reorder.
- Select an article in a feed to display it in the article pane by default. It opens in a new tab if the article pane is disabled or if you select the button to open it in a new tab.
- For articles with audio enclosures, select the play button to play the audio.
- Select **Refresh** to fetch feeds again. Up to 15 articles are shown for each feed.
- Use the checkboxes at the top of the page to toggle thumbnails and the article pane.
- Use **Settings** to export or import shortcuts, groups, and feeds as JSON. Importing replaces all three types of settings.

Feeds, groups, shortcuts, and display preferences are stored in `chrome.storage.sync` and are subject to Chrome sync. If no feeds have been saved yet, the default feeds from Zenn, Qiita, and Yahoo! News are displayed.

## Permissions and privacy

- `storage`: Saves settings to Chrome sync storage.
- `declarativeNetRequest`: Removes the `X-Frame-Options` and `Content-Security-Policy` response headers only for subframes loaded by the extension itself, so articles can be displayed in the extension's article pane.
- Access to all hosts: Used to fetch arbitrary feeds and their images, audio, and other content.

Feed content and linked pages are retrieved from external websites. Review the URLs you register and the content of articles displayed in embedded views.

## Development

### Tech stack

- **WXT**: Chrome extension framework
- **React**: UI library
- **TypeScript**: JavaScript with static typing
- **Vanilla Extract**: CSS-in-JS library
- **Vitest**: Unit testing framework
- **Biome**: Code formatter and linter

### Project structure

- `src/entrypoints/`: Extension entrypoints (background, content script, and UI)
- `src/components/`: React components
- `src/hooks/`: Custom hooks
- `src/utils/`: Utility functions
- `src/storage/`: Local storage operations
- `src/styles/`: Global styles
