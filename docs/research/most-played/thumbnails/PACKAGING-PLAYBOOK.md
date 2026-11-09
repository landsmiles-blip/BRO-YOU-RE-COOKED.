# How to package a game for Playgama and YouTube Playables (plain-language playbook, 9 Nov 2026)

For the owner, and for every future game (Poof Poof has the same empty Playgama draft). Evidence is in `REPORT.md`; the cover rules are in `DESIGN-BRIEF.md`.

## 1. What a player sees, and why you package for it
A game is a small picture (the cover) plus a name, in a grid of hundreds. The player decides in about a second. After the click, the game page has a title, a rating, a short description and "how to play" text, which people and search engines read. The cover earns the click; the text and the first minute of play earn the stay. A cover that promises something the game does not deliver is punished by the platforms and by the players.

## 2. What you must hand over to Playgama (the Sandbox needs all of it)
- Three covers: square 800x800, portrait 1080x1920, landscape 1920x1080 (PNG or JPEG, under 10 MB). The LANDSCAPE one is the card image most visitors see on Playgama; the portrait is what YouTube's hub uses.
- Title, exactly the same as inside the game (rule 3.5.1).
- Description and how-to-play text (see 4), category (decided by the main thing the player does; a "draw a line to beat a level" game is Puzzle), supported devices, orientations, language (English required).
- The game zip with `index.html` at the root.

## 3. The cover recipe
One subject, large. Show the verb (what the player does) and the stakes (what is about to go wrong) in one frame. A face with an emotion if the game has a character. Bright, clean, saturated background that the subject separates from. The game's name as big thick lettering is common on winning tiles (about two in three) but the biggest publisher mostly leaves it off, so make both versions. No other company's names or characters, no real person's face, no fake buttons, no instructions. Check it at 194 px wide and in greyscale, and put it in a mock row beside real neighbours before showing anyone.

## 4. The description recipe (Playgama's page template)
Playgama pages have About (2 to 3 sentences, what it is and what is special), How to Play (the goal first, then the loop, then the star or score rule), Controls (one line per input, desktop and mobile), Key Features (a short list) and sometimes an FAQ; about 300 words in all. Lead with what makes your game different from its nearest neighbours. Only claim what is true in the shipped build. Do not stuff keywords: the page title and meta description are generated and already say "free" and "online".

## 5. The process (what Claude does, what the owner does)
1. Look at the neighbours: the top games on both platforms, the nearest twin. (Claude)
2. Write a short design brief with checkable rules. (Claude)
3. Make four concepts from the game's own art; score them; criticise them hard; revise twice. (Claude)
4. Show one contact sheet on a mock grid. The owner picks. (Owner)
5. Upload covers; run Playgama's QA tool on the build; upload the zip; fill the form; publish the Sandbox. Each outward step is asked first. (Claude asks, owner says yes)
6. Log the date and cover id; swap one cover at a time and watch plays per day, read as a hint only. (Both)

## 6. Mistakes already paid for (so they are not repeated)
- Uploading covers before the owner has seen them.
- Applying a famous creator's look without evidence it transfers; the study showed the details that matter are one subject, one stake, readable small.
- Pale, busy or empty covers; the first two sets were exactly that.
- Leaving the form empty: description, how-to-play, category and devices are blank until someone fills them.
- Forgetting that a line floating in the air does not hold in the game: the cover must show a believable state.
