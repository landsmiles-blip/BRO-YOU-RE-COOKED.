#!/usr/bin/env python3
"""Export the working conversation to readable Markdown, so the repository holds it.

    python3 -I tools/history/export-conversation.py <transcript.jsonl> [out dir]

The conversation between the owner and Claude lives in Claude's session
storage, not in the repository. This turns it into three plain files:

  CONVERSATION.md  every message the owner sent and every reply Claude sent,
                   word for word, dated, plus the owner's answers to questions
                   and every plan decision. Not included: tool calls and their
                   output (the commits hold that work), images (a note says what
                   each was), and system noise.
  EARLIER.md       what came before the transcript starts: the owner's messages
                   from 27 Sep to 19 Oct, recovered word for word from a search
                   run on 25 Oct and kept inside the transcript, and the
                   compaction summaries that carry the older history.

It refuses to write a file that matches a secret pattern, and says where.
"""
import json
import re
import sys
from pathlib import Path

src = Path(sys.argv[1])
out = Path(sys.argv[2] if len(sys.argv) > 2 else "docs/history")
out.mkdir(parents=True, exist_ok=True)

SECRET = re.compile(r"(sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|"
                    r"AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[baprs]-[A-Za-z0-9-]{10,})")
NOISE = ("<system-reminder>", "<task-notification", "<local-command", "<command-name>",
         "Base directory for this skill", "[SYSTEM NOTIFICATION", "<artifact-content-authored-by-others/>\nThe summarized")
IMAGE = re.compile(r"^\[Image: (source|original)[^\]]*\]$")


def blocks(msg):
    c = msg.get("content")
    if isinstance(c, str):
        return [{"type": "text", "text": c}]
    return [b for b in (c or []) if isinstance(b, dict)]


def tool_text(b):
    c = b.get("content")
    return c if isinstance(c, str) else "".join(x.get("text", "") for x in (c or []) if isinstance(x, dict))


convo, summaries = [], []
for line in src.read_text().split("\n"):
    try:
        e = json.loads(line)
    except Exception:
        continue
    t, ts = e.get("type"), e.get("timestamp", "")[:16].replace("T", " ")
    if t not in ("user", "assistant"):
        continue
    for b in blocks(e.get("message", {})):
        if b.get("type") == "tool_result":
            x = tool_text(b)
            if x.startswith(("The user answered", "Your questions have been answered", "User has answered")):
                convo.append((ts, "OWNER'S ANSWERS TO MY QUESTIONS", x.strip()))
            elif "User has approved your plan" in x:
                convo.append((ts, "PLAN APPROVED BY THE OWNER", x.split("## Approved Plan:")[0].strip() + "\n(the approved plan is in the repository's history of the plan file; summarised in BRIEF.md)"))
            elif "You are not in plan mode" in x and "ExitPlanMode" in x:
                convo.append((ts, "PLAN APPROVAL STEP FAILED (not in plan mode)", x.strip()[:300]))
            continue
        if b.get("type") != "text":
            continue
        x = b["text"].strip()
        if not x:
            continue
        if t == "user" and "This session is being continued from a previous conversation" in x[:400]:
            summaries.append((ts, x))
            continue
        if x.startswith(NOISE) or any(n in x[:300] for n in NOISE):
            continue
        if t == "user" and x.startswith("Stop hook feedback"):
            convo.append((ts, "AUTOMATED (not the owner): git stop hook", x))
            continue
        if t == "user" and IMAGE.match(x):
            convo.append((ts, "OWNER (image attached)", x + "\n(the image itself is not stored; it was a screenshot or video frame from the game)"))
            continue
        convo.append((ts, "OWNER" if t == "user" else "CLAUDE", x))

# Collapse runs of image placeholders from the same minute into one line.
merged = []
for ts, who, x in convo:
    if merged and who == "OWNER (image attached)" and merged[-1][1].startswith("OWNER (image"):
        merged[-1] = (merged[-1][0], "OWNER (images attached)", merged[-1][2] + "\n" + x.split("\n")[0])
    else:
        merged.append((ts, who, x))
convo = merged

# The owner's earlier messages, recovered from the search run on 25 Oct.
earlier = ""
for line in src.read_text().split("\n"):
    if "===== 2026-09-27T06:46" in line:
        try:
            e = json.loads(line)
            for b in blocks(e["message"]):
                if b.get("type") == "tool_result" and "===== 2026-09-27T06:46" in tool_text(b):
                    earlier = tool_text(b)
        except Exception:
            pass
        break


def write(name, text):
    m = SECRET.search(text)
    if m:
        sys.exit(f"REFUSING to write {name}: secret-like text near {text[max(0, m.start()-40):m.start()]!r}")
    (out / name).write_text(text)
    print(f"wrote {out / name}  ({len(text):,} bytes)")


head = "# THE CONVERSATION, word for word\n\n"
head += ("Every message the owner sent and every reply Claude sent in this session, dated (UTC), in order.\n"
         "Tool calls and their output are not here (the commits hold that work); images are noted, not stored.\n"
         "The session's transcript begins 19 Oct 2026. For anything earlier see `EARLIER.md`.\n\n---\n\n")
body = ""
for ts, who, x in convo:
    body += f"### {ts} — {who}\n\n{x}\n\n"
write("CONVERSATION.md", head + body)

head2 = "# EARLIER — before the transcript begins\n\n"
head2 += ("What survives of the conversation before 19 Oct 2026. Read `README.md` for what is missing.\n\n"
          "## 1. The owner's messages, 27 Sep – 19 Oct, word for word\n\n"
          "Recovered on 25 Oct from the session's own record, which still existed then, and stored in the transcript.\n"
          "Image attachments are listed first by the time they were sent; the text follows.\n\n")
head2 += "```\n" + earlier.strip() + "\n```\n\n"
head2 += "## 2. The compaction summaries\n\nWhen the conversation grew too long it was summarised, and the summary replaced the older text. These are those summaries, as written then.\n\n"
for ts, x in summaries:
    head2 += f"### Summary written {ts}\n\n{x}\n\n"
write("EARLIER.md", head2)
print(f"{len(convo)} entries, {len(summaries)} summaries, earlier-messages block {len(earlier):,} chars")
