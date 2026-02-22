# ConceptsLM Wiki

This directory contains the source content for the [ConceptsLM GitHub Wiki](https://github.com/Humata-ai/ConceptsLM/wiki).

## Important: Source of Truth

⚠️ **This `wiki/` folder is the authoritative source for all wiki content.**

Changes made here are automatically synced to the GitHub wiki when merged to the main branch. Do not edit the wiki directly on GitHub as those changes will be overwritten.

## Contributing to the Wiki

1. Edit markdown files in this `wiki/` directory
2. Create a pull request with your changes
3. After merge to main, changes are automatically synced to the wiki

## File Structure

- `*.md` - Wiki pages (markdown format)
- `data/` - Data files referenced by wiki pages
- `Home.md` - Wiki homepage and table of contents

## Convention

After creating a new markdown file, update the table of contents in `Home.md`.

## Edit Links

Each wiki page automatically gets an "Edit this page" footer that links back to the source file in this folder. This is added during the sync process - you don't need to add it manually.

## Sync Mechanism

The sync is performed by `.github/workflows/sync-wiki.yml`. This workflow:
- Triggers on pushes to main that modify the `wiki/` folder
- Automatically adds "Edit this page" links to each page
- Pushes changes to `https://github.com/Humata-ai/ConceptsLM.wiki.git`
- Can be manually triggered from the Actions tab if needed
