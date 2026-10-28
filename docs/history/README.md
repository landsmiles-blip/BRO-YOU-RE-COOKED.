# HISTORY — what happened here, and where to find it

This folder exists so the repository tells the whole story of the project, not only the code.

## What is in here

| File | What it is | How exact it is |
|---|---|---|
| `../brief/BRIEF.md` | Claude's account of the whole project, 9 Sep → 28 Oct 2026: story, decisions, failures, findings about the owner, where it stands, all 45 levels | A summary and a defence, written by Claude. Read it first |
| `CONVERSATION.md` | Every message the owner sent and every reply Claude sent from 19 Oct 2026, with the owner's answers to questions and every plan decision | **Word for word.** Tool calls, tool output and images are left out |
| `EARLIER.md` | The owner's messages from 27 Sep to 19 Oct, and the summaries that replaced the older conversation | The messages are word for word; the summaries are Claude's, written at the time |
| `DOSSIER.md` | The project's own documents in one file (CLAUDE.md, decisions, plan, held levels, difficulty, certification, case study, playtest, Playgama, launch kit, the retrospective) | Copies, generated; the originals are in `docs/`, `reports/` and `CLAUDE.md` |

The work itself is in the git history: **157+ commits** from 9 Sep 2026, each with a message saying what changed and why. `git log` is the exact record of what was built and when.

## What is NOT here, and why

1. **The owner's first prompt, and 9–26 Sep, word for word.**
   - The first prompt, as the owner recalled it on 28 Oct: *"i have game tha i would like you to read the markdown of it is different part of the same thing it will make sense in 1 minute"*. That is the owner's recollection, not a recording.
   - Claude's session storage keeps a conversation only while it lasts and compacts it as it grows. By the time anyone thought to save it, that part was gone.
   - What survives of September is:
     - short quotes in commit messages (`52a635b`, `5fff268`, `912abe2`, `a9ee798`);
     - quotes in `docs/PLAN.md`, `docs/HELD.md` and `CLAUDE.md`;
     - the retrospective `reports/Where the AI struggled.md`.
   - `BRIEF.md` marks every September quote *second-hand*.
2. **Claude's tool work** (each command and file edit). The commits hold it. Pasting raw machine output would bury the story.
3. **Images and video the owner attached** (screenshots, the GOOD BOY video). They are noted in `CONVERSATION.md` but were never stored in the repository.
4. **Anything said after the last export.** `CONVERSATION.md` is a snapshot. Regenerate it with:

   ```
   python3 -I tools/history/export-conversation.py <path to the session transcript .jsonl> docs/history
   ```

   The session transcript is kept at `~/.claude/projects/<project>/<session id>.jsonl` inside the Claude Code session; the script refuses to write a file if it finds anything that looks like a password or key.

## Why this was added

The owner asked on 28 Oct 2026: *"the repo need to tell me everything that i have been doing here… if its not why then do you have me attached a repo or a folder before i start a project."* The honest answer was that the repository only holds files, and the conversation was never one of them. Claude should have said so when it wrote the brief, and should have exported the conversation at every milestone, as it commits code. Going forward:
- re-run the export at each release;
- keep the decisions in `docs/DECISIONS.md`.

## A reading order for someone new (or for Claude chat)

1. `docs/brief/BRIEF.md` — the story and the verdicts.
2. `CLAUDE.md` — every rule the project paid for, each with the incident behind it.
3. `docs/DECISIONS.md` and `docs/PLAN.md` — what was decided, by whom, and the dated status notes.
4. `docs/history/CONVERSATION.md` and `EARLIER.md` — the owner's own words, to check the brief against.
5. `docs/launch/LAUNCH.md` — what to do next.
