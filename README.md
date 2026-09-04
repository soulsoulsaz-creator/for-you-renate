# FOR YOU, RENATE

A zero-cost, static personal podcast website designed for GitHub Pages.

## Files
- `index.html` — structure
- `style.css` — visual design and animations
- `script.js` — episodes, player, progress saving, theme and interactions
- `assets/audio/` — add episode-01.mp3 through episode-08.mp3 here
- `assets/images/` — optional episode artwork

## Important
The current episode artwork uses built-in visual placeholders. Replace them later with:
`assets/images/episode-01.jpg` ... `episode-08.jpg`

Audio is not included. When an MP3 is missing, the player shows a Coming Soon state.

## GitHub Pages
Upload the contents of this folder to a GitHub repository and enable GitHub Pages from the repository's Pages settings. No build step is required.

## Editing your personal content
Open `script.js` and edit the `EPISODES` and `OPEN_WHEN_MESSAGES` objects near the top.
The story timeline placeholders are directly in `index.html`.


## Responsive update
This version preserves the original visual design while adding responsive behavior for desktop, tablet, phone, very small screens, and landscape phones.
