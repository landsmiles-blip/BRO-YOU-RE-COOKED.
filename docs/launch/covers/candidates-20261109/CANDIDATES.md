# Cover candidates, 9 Nov 2026: four rounds of self-critique, then shown to the owner

Nothing here is uploaded. The Playgama draft still holds the earlier "pop" set until the owner picks. Built by `generator/compose.html` from the game's own drawing code (the notebook ink strokes, Milo's real rig, the real palette, the game's embedded handwriting font); no generated imagery. Brief: `docs/research/most-played/thumbnails/DESIGN-BRIEF.md`.

## The concepts
- **C1 The line holds**: the boulder rests on the drawn line, Milo screaming underneath, the pencil at the line's end (the verb). The solved moment, calm.
- **C2 The moment before**: the boulder still falling above the line, fall streaks, Milo under the line. More tension.
- **C3 Close-up (recommended lead)**: giant Milo under the anchored line, the boulder looming and cropped by the frame. Strongest at small size. A text-free version of C3 exists for the YouTube hub (whether a title wordmark breaks YouTube's no-logos rule is UNVERIFIED).

## Checks against the brief (measured on the files)
| Rule | C1 | C2 | C3 |
|---|---|---|---|
| Milo's head at least 1/5 of tile height (landscape) | fail (about 0.11) | fail (about 0.10) | pass (about 0.25) |
| Boulder at least 1/4 of the picture area | fail | fail | closest; it is cropped, so it reads huge |
| Line is the loudest stroke and visibly anchored | pass | pass | pass |
| Not pale, not empty: percentile on Playgama tiles, 448x252 card crop (edge density, contrast) | 49th, 33rd | 41st, 33rd | 51st, 50th |
| Title cap height at 221x148 card at least 20 px | about 17 px, borderline | about 17 px | about 17 px |
| Landscape content inside x 9%..91% (the card box crops about 8% each side) | pass | pass | pass (right pillar edge at 91%) |
| Honest: the game's own art, a state the game can show | pass | pass | pass |
The old "pop" cover sat at the 0th percentile for busyness and the 6th for contrast; the paper set at the 99th for paleness (A2 measurements). These now sit mid-pack.

## Hard verdict: is this the best I can do?
Not entirely, and here is where it falls short:
1. C1 and C2 read well at full size but Milo's face is a dot at card size; they fail the one-fifth rule. C3 fixes that but gives up the pencil (the verb) and crops the boulder.
2. The title is legible at card size but its capitals are about 17 px against a 20 px target; making it bigger collides with the scene inside the safe zone.
3. The background (a sunburst and two clouds) is generic. It is bright and clean, which the measurements favour, but it carries no character of its own.
4. Milo's face is the game's own: two line eyes and an open mouth. It is expressive enough in the close-up, but it is not a MrBeast-style reaction face and cannot become one without changing the game's art.
5. At the 123 px Playgama square tile, no face or title detail survives; only the blue field, red boulder and yellow figure do.
6. Nothing here has been tested on players. No data says any of these earns more plays than another.

## Files
`byc-c1|c2|c3-{landscape-1920x1080, portrait-1080x1920, square-800x800}.png`, `byc-c3-notext-*.png`, `CONTACT-SHEET.png` (all variants). A local-only mock of the covers inside a real Playgama card row (third-party tiles, so not committed) is in `local/`.
