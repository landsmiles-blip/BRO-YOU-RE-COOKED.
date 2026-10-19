# Claude Code skills, plugins and MCP connectors for building, testing, art-directing and marketing BRO, YOU'RE COOKED. (vetted, free-only, as of 2026-10-19)

> How the citations work: `mcp://<Connector>/<tool>` means a live tool schema or a read-only call made in this session (2026-10-18 unless marked 2026-10-19). `file://` means a file in this repo. GitHub star, push-date and licence figures come from the GitHub search API through the GitHub MCP server on 2026-10-18. No write, publish, schedule, upload or credit-spending call was made on any connector.

## 1. What can each ALREADY-connected connector (vidIQ, Canva, Figma, Google Drive, Gmail, Calendar, Metricool, Unsplash, HyperFrames, Viberate) do for this game, what does its free tier allow, and what are its limits and risks?

### Takeaway
Only four of the ten connectors do real work for this game, and all four have tight caps:
- **Canva**: listing art and social graphics. It has a limited monthly AI allowance, and Canva or AI elements may not be used in a logo.
- **vidIQ**: YouTube competitor research. It costs 5 credits a call against a 150-credit cycle, and the balance is 0 until 2026-10-24.
- **Google Drive**: sharing playtest kits.
- **Metricool**: scheduling social posts, with 20 published posts a month on the free plan, but only after a social network is connected. None is connected yet.

The other six are no use here:
- **HyperFrames**: the hosted compose and render tools are disabled from Claude Code. Use its Apache-2.0 local skills instead.
- **Figma**: a Starter plan with a View seat allows about 6 MCP tool calls a month.
- **Gmail**: this session exposes only `delete_draft`.
- **Viberate**: music-industry analytics, with no music you can licence.
- **Unsplash and Google Calendar**: marginal, and only worth using when the user asks for them.

### Cited Findings
**Inventory (2026-10-18)**
- These ten are connected and enabled in this chat: Canva, Figma, Gmail, Google Calendar, Google Drive, HyperFrames by HeyGen, Metricool, Unsplash, Viberate and vidIQ. ElevenLabs, Frontify, Loops, Riverside and Roam Research are listed but `connect_incomplete`, so they are not usable. — [ListConnectors](mcp://claude.ai/ListConnectors)
- No plugins are enabled on the user's claude.ai account. — [ListPlugins](mcp://claude.ai/ListPlugins)
- Skills enabled on the account include skill-creator, mcp-builder, theme-factory, web-artifacts-builder, deep-research, docx/pdf/pptx/xlsx, chrome-browser, built-in-browser, computer-use and **remove-ai-marks**. — [ListSkills](mcp://claude.ai/ListSkills)
- Connectors are connected at claude.ai/customize/connectors, and a session reads them when it starts. — [Claude Code Remote docs, connectors.add](mcp://Claude_Code_Remote/read_documentation)
- Connector traffic in a cloud session "travels through Anthropic's servers rather than the session's network", so connectors work whatever the network allowlist says. — [Cloud environments](https://code.claude.com/docs/en/cloud-environments)

**vidIQ**
- Balance on 2026-10-18: `type: limited`, `totalCredits: 0`, `maxRenewableCredits: 150`, `renewableResetsAt: 2026-10-24T12:48:39Z`, no add-on credits. — [vidiq_balance](mcp://vidIQ/vidiq_balance)
- Research tools cost 5 credits a call:
  - youtube_search: whole-YouTube search with a topic filter (e.g. `puzzleVideoGame`), region, date and duration — [schema](mcp://vidIQ/vidiq_youtube_search)
  - outliers: videos over-performing their channel, Shorts included — [schema](mcp://vidIQ/vidiq_outliers)
  - keyword_research — [schema](mcp://vidIQ/vidiq_keyword_research)
  - trending_videos — [schema](mcp://vidIQ/vidiq_trending_videos)
  - similar_videos — [schema](mcp://vidIQ/vidiq_similar_videos)
  - video_transcript — [schema](mcp://vidIQ/vidiq_video_transcript)
  - score_thumbnail — [schema](mcp://vidIQ/vidiq_score_thumbnail)
- Generation is expensive against 150 credits:
  - generate_thumbnail: 22 credits — [schema](mcp://vidIQ/vidiq_generate_thumbnail)
  - generate_music: 25 credits a track. The tool's own text calls the output "original, royalty-free background-music". — [schema](mcp://vidIQ/vidiq_generate_music)
  - generate_video: duration × the model's per-second rate × 20 credits — [schema](mcp://vidIQ/vidiq_generate_video)
  - compose and motion_graphics: 1 credit per 4 s, minimum 2 — [compose](mcp://vidIQ/vidiq_compose), [motion_graphics](mcp://vidIQ/vidiq_motion_graphics)
  - generate_clips: 9 credits a minute — [schema](mcp://vidIQ/vidiq_generate_clips)
  - voiceover: 14 credits per 1,000 characters — [schema](mcp://vidIQ/vidiq_voiceover_generate)
  - B-roll: 1 credit, and "Attribution is required: always credit the photographer" — [schema](mcp://vidIQ/vidiq_generate_broll)
- The connector also exposes tools that act on the user's accounts: `vidiq_update_video`, `vidiq_update_video_thumbnail`, `vidiq_reply_to_comment`, `vidiq_instagram_publish_reel`, `vidiq_connect_youtube_channel` and `vidiq_authorize_with_youtube`. — [session tool list](mcp://vidIQ)
- No tool in the list targets YouTube Playables specifically. — [session tool list](mcp://vidIQ)

**Canva**
- Tools:
  - `create-design`: a brief becomes an editable design.
  - `generate-design`: types include `youtube_thumbnail`, `youtube_banner`, `logo`, `your_story` and `instagram_post`.
  - `generate-image`
  - `export-design`: pdf, png, jpg, gif, pptx, mp4 or csv.
  - `resize-design`: any custom width and height.
  - `remove-background` and `separate-image-layers`
  - `upload-asset-from-url`: takes a public HTTPS URL only — "Do not use for local, private, or agent-generated files".
  - Sources: [generate-design](mcp://Canva/generate-design), [export-design](mcp://Canva/export-design), [resize-design](mcp://Canva/resize-design), [upload-asset-from-url](mcp://Canva/upload-asset-from-url)
- Canva's official Help Center answer, returned through the connector:
  - Canva Free has "a limited monthly AI allowance for features like Magic Media and Dream Lab".
  - AI images and free elements may be used commercially, "including promotional art and app/game store icons or banners".
  - "Canva elements (including AI-generated images) cannot be used as part of a trademark, logo, or service mark."
  - Source: [Canva help tool, 2026-10-18](mcp://Canva/help); [Canva Content License Agreement](https://www.canva.com/policies/content-license-agreement/)

**Figma**
- whoami: plan "Land of Smiles's team", `tier: starter`, `seat: View`, `user_can_access_figma_ai: true`. — [whoami](mcp://Figma/whoami)
- Figma's own pages could not be fetched (DNS failure in the fetch tool, empty page by curl), so these figures come from search extraction:
  - "Starter plan and View/Collab seats" get "up to 6 tool calls per month".
  - `add_code_connect_map`, `generate_figma_design` and `whoami` are exempt.
  - Replit's copy of the table agrees.
  - Sources: [Figma plans/access](https://developers.figma.com/docs/figma-mcp-server/plans-access-and-permissions/), [Figma rate limits](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/), [Replit mirror](https://docs.replit.com/references/mcp/figma.md)
- `generate_image` "is a paid feature — each call consumes Figma AI credits". `export_video` renders a Figma timeline to MP4. — [generate_image](mcp://Figma/generate_image), [export_video](mcp://Figma/export_video)

**Google Drive / Gmail / Google Calendar**
- Drive tools:
  - search, read and download
  - `create_file`: upload as base64 or text
  - `copy_file`, `update_file`, `trash_file`
  - `share_file`: reader, commenter or writer, to a user, group or Chat space
  - Sources: [search_files](mcp://Google_Drive/search_files), [create_file](mcp://Google_Drive/create_file), [share_file](mcp://Google_Drive/share_file)
- The only Gmail tool exposed in this session is `delete_draft`. A ToolSearch for "gmail" returned nothing else, although the directory describes the connector as "Draft replies, summarize threads, & search your inbox". — [ToolSearch gmail, 2026-10-19](mcp://Gmail/delete_draft); [ListConnectors](mcp://claude.ai/ListConnectors)
- Calendar tools: create, update and delete events; list and search events; suggest a time. — [create_event](mcp://Google_Calendar/create_event), [list_events](mcp://Google_Calendar/list_events)

**Metricool**
- `getBrandSettings` returned: "This brand doesn't have any social network connected yet" (blogId 7075979). — [getBrandSettings](mcp://Metricool/getBrandSettings)
- `createScheduledPost` supports:
  - YouTube video or short. It needs a video, a title and `madeForKids`, and has an `isAiGeneratedContent` flag, "as YouTube requires the channel owner to declare".
  - TikTok, Instagram, Pinterest, Bluesky and others.
  - `autoPublish` (default true) publishes automatically. `draft` exists.
  - Source: [createScheduledPost](mcp://Metricool/createScheduledPost)
- Review flows need "a plan with team management". — [createScheduledPostForReview](mcp://Metricool/createScheduledPostForReview)
- Free plan, per the help center:
  - one brand
  - 20 published posts a month, resetting on the 1st
  - 30 days of analytics history
  - LinkedIn and X excluded
  - One Metricool article says 50 posts, which looks out of date.
  - Sources: [Metricool help](https://help.metricool.com/main-differences-between-free-and-paid-plans-bl0v9); contradicted by [Metricool blog](https://metricool.com/premium-vs-free-metricool-plans)

**Unsplash**
- Current user `smiles254`, `subscribed: false`, so no Unsplash+. — [get_current_user](mcp://Unsplash/get_current_user)
- `search_illustrations` offers `flat`, `line_art`, `3d` and `hand_drawn` styles. `download_asset` must be used to download, because the raw URLs "are watermarked for Unsplash+ assets". The server says it is not for generating images, logos or icons. — [search_illustrations](mcp://Unsplash/search_illustrations), [download_asset](mcp://Unsplash/download_asset), [server instructions](mcp://Unsplash)
- Licence, per search extraction because the page was unreachable by fetch:
  - Free commercial use; attribution appreciated, not required.
  - No selling without significant modification.
  - No compiling images "to replicate a similar or competing service".
  - Unsplash+ adds restrictions, including no AI or ML use.
  - Sources: [Unsplash License](https://unsplash.com/license), [Unsplash+ License](https://unsplash.com/plus/license)

**HyperFrames by HeyGen**
- What the server's own instructions say:
  - "From a CLI/IDE agent on the user's machine (Claude Code, Cursor, Codex …), `compose` and `render_video` are disabled … Calls to those two tools from such clients are rejected with a pointer to install them: `npx skills add heygen-com/hyperframes`".
  - The read tools stay available.
  - The hosted path gives "a hosted HeyGen project with a `project_id` … and the cloud render queue". `render_video` is "a paid action".
  - Source: [HyperFrames server instructions and schemas](mcp://HyperFrames_by_HeyGen)
- `list_projects` returned an empty list. — [list_projects](mcp://HyperFrames_by_HeyGen/list_projects)
- The open-source project:
  - "Requirements: Node.js 22+, FFmpeg".
  - "The renderer seeks each frame in headless Chrome and encodes the result with FFmpeg". The engine is "Seekable page-to-video capture … using Puppeteer and FFmpeg".
  - "Apache 2.0 license, with no per-render fees or commercial-use thresholds".
  - It has 21 skills. Install with `claude plugin install hyperframes@hyperframes`, `npx skills add heygen-com/hyperframes`, or `npx hyperframes skills update`, which installs the core set from `main`. "`skills add` … can lag `main` by hours".
  - Source: [HyperFrames README](https://raw.githubusercontent.com/heygen-com/hyperframes/main/README.md)
- Repo `heygen-com/hyperframes`: organization-owned, Apache-2.0, 66,627 stars, last push 2026-10-18, created 2026-03-10. Also listed in Anthropic's official marketplace with author "HeyGen". — [GitHub](https://github.com/heygen-com/hyperframes); [official marketplace manifest](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json)
- This container has Node v22.22.0 and FFmpeg 6.1.1. — [container check: `node --version`, `ffmpeg -version`, 2026-10-18](mcp://Bash/container-check)
- Chromium build 1194 is preinstalled in `/opt/pw-browsers`. — [session-start.sh](file:///home/user/BRO-YOU-RE-COOKED./.claude/hooks/session-start.sh)
- `storage.googleapis.com` is on the default Trusted allowlist. — [Cloud environments](https://code.claude.com/docs/en/cloud-environments)

**Viberate**
- Account is on the Free plan. — [get_subscription_status](mcp://Viberate/get_subscription_status)
- Tools cover artist, track, label and festival search, charts, metrics and playlists, plus `buy_subscription` (returns a checkout link for "Professional + MCP"), `manage_subscription` and `cancel_subscription`. There is no download or licensing tool. — [buy_subscription](mcp://Viberate/buy_subscription), [search_tracks](mcp://Viberate/search_tracks)

**What the game itself constrains**
- "EVERY SOUND IN THIS GAME IS SYNTHESISED AT RUNTIME … a design decision". — [js/audio.js](file:///home/user/BRO-YOU-RE-COOKED./js/audio.js)
- The game makes zero external network calls: the build fails on `fetch`, XHR, WebSocket, `sendBeacon` and `importScripts`. It is played muted inside YouTube. — [CLAUDE.md](file:///home/user/BRO-YOU-RE-COOKED./CLAUDE.md)

### Inferences
**Verdicts**
- **vidIQ: USE OCCASIONALLY.**
  - Use it for research only: rival "draw to save" gameplay videos and Shorts, outliers, keyword and title ideas, rival trailer transcripts.
  - Budget at most 30 research calls per cycle. Make no calls before 2026-10-24.
  - Never use the generation tools. One music track is 25 of 150 credits.
  - Never call the account-acting tools: update_video, publish_reel, reply_to_comment.
  - Confidence: high.
- **Canva: USE OCCASIONALLY.**
  - Use it for the Playables listing banner, Shorts thumbnails and social cards, laid out around real game frames.
  - Do not build the game's logo or icon mark from Canva elements or Canva AI images, because the licence forbids it in a trademark or logo.
  - Getting local frames in needs a public HTTPS URL, such as the published web build, or Canva's upload-URL flow. That flow may be blocked from the container, because Canva's hosts are not on the default allowlist (not tested).
  - Confidence: medium-high.
- **Figma: SKIP.**
  - About 6 calls a month on a Starter/View seat cannot support iterative design work.
  - Image generation spends paid Figma AI credits.
  - Nothing in this game's pipeline lives in Figma.
  - Revisit only if the user upgrades.
  - Confidence: high on fit, medium-high on the exact limit.
- **Google Drive: USE OCCASIONALLY.**
  - Use it to hand playtest kits, trailers and press kits to testers, and to read feedback documents.
  - Never call `share_file` unless the user asks.
  - Base64 upload is impractical for large MP4s (inference).
  - Confidence: high.
- **Gmail: SKIP.**
  - In this session it can only delete drafts.
  - An inbox is untrusted content, and therefore a prompt-injection surface.
  - Confidence: high.
- **Google Calendar: USE OCCASIONALLY, on request only.**
  - Booking playtests, launch reminders.
  - For agent follow-ups, this session's own scheduled tasks are the better tool.
  - Confidence: high.
- **Metricool: USE OCCASIONALLY, once the user connects YouTube, TikTok or Instagram.**
  - Schedule Shorts with `draft: true` or `autoPublish: false`, so a human approves each one.
  - Keep within 20 published posts a month.
  - Today it can do nothing, because no network is connected.
  - Confidence: high.
- **Unsplash: USE OCCASIONALLY, for marketing mood boards only.**
  - SKIP it for in-game assets: photos clash with code-drawn art, and every asset would have to be bundled because the game makes no network calls.
  - Confidence: medium-high.
- **HyperFrames connector: SKIP inside Claude Code.**
  - compose and render are disabled here.
  - The hosted path only makes sense from claude.ai chat, and its render is paid.
  - Instead, INSTALL the open-source skills (see section 4).
  - Confidence: high. This rests on the server's own instructions; compose was deliberately not called.
- **Viberate: SKIP.**
  - It is music-industry analytics with nothing to licence or download, and the game's audio is procedural by design.
  - It exposes purchase and cancel tools that must never be called.
  - Confidence: high.
- **remove-ai-marks (account skill): SKIP for this project's marketing media.**
  - YouTube asks channel owners to declare realistic synthetic content.
  - Metricool's schema carries that flag for YouTube, TikTok and Instagram.
  - Stripping provenance from AI-generated promo media works against that disclosure.
  - Confidence: medium.

### Gaps
- Canva Free's exact monthly AI allowance. The help answer gave no number.
- Viberate's free-tier limits. No source was found.
- vidIQ's licence terms for generated music and thumbnails. "Royalty-free" is vidIQ's own wording, and its terms were not checked.
- The Figma limits were not read from Figma's own page (DNS failure).
- Unsplash's API-guideline attribution rule for apps. Claimed only by a third-party blog.
- Why Gmail exposes only one tool: a user permission setting or the connector's design. Unknown.
- Whether HyperFrames' compose actually rejects a call from this cloud session. Not tested: it would be a write or paid action.

## 2. Which official Anthropic and well-known community skills, plugins and marketplaces are relevant (game development, frontend/canvas, testing, image/audio, YouTube/marketing), and are they real, maintained and safe?

### Takeaway
Anthropic's three catalogs are real, organization-owned and active as of October 2026:
- `anthropics/skills`: 181,966 stars.
- The `claude-code-plugins` marketplace inside `anthropics/claude-code`.
- `anthropics/claude-plugins-official`: 315 plugins, Apache-2.0, pushed 2026-10-18.

For a vanilla-JS Matter.js game the useful entries are few:
- **HyperFrames (HeyGen)**: video.
- **frontend-design (Anthropic)**: the public web page.
- **chrome-devtools-mcp**: performance debugging.

Most of the rest overlaps something the project already has, or does not apply:
- The Playwright entries duplicate the project's own pinned harness.
- `webapp-testing` is Python.
- The Unity and Unreal entries are not applicable.
- No HTML5, JavaScript or physics-game plugin exists in the official catalog.

Plugins that the repo declares do not load in cloud sessions at all.

### Cited Findings
- **anthropics/skills**
  - Organization-owned, 181,966 stars, pushed 2026-10-09. — [GitHub](https://github.com/anthropics/skills)
  - "Many skills in this repo are open source (Apache 2.0)". The document skills are "source-available, not open source". The skills are "provided for demonstration and educational purposes only". — [README](https://raw.githubusercontent.com/anthropics/skills/main/README.md)
  - Install with `/plugin marketplace add anthropics/skills` and `/plugin install example-skills@anthropic-agent-skills`. — [README](https://raw.githubusercontent.com/anthropics/skills/main/README.md)
  - The marketplace `anthropic-agent-skills` (owner email @anthropic.com) contains:
    - `document-skills`
    - `example-skills`: algorithmic-art, brand-guidelines, canvas-design, doc-coauthoring, frontend-design, internal-comms, mcp-builder, skill-creator, slack-gif-creator, theme-factory, web-artifacts-builder, webapp-testing
    - `claude-api`, `academy-guide`, `discernment-nudge`
    - Source: [marketplace.json](https://raw.githubusercontent.com/anthropics/skills/main/.claude-plugin/marketplace.json)
- **Individual skills** (each with an Apache LICENSE.txt, checked 2026-10-19):
  - `webapp-testing`: "write native Python Playwright scripts", using `scripts/with_server.py`. — [SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/webapp-testing/SKILL.md)
  - `frontend-design`: "Guidance for distinctive, intentional visual design when building new UI". — [SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
  - `canvas-design`: PNG and PDF posters from a "design philosophy". — [SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/SKILL.md)
  - `algorithmic-art`: p5.js. — [SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/algorithmic-art/SKILL.md)
  - `slack-gif-creator`: "animated GIFs optimized for Slack". — [SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/slack-gif-creator/SKILL.md)
- **anthropics/claude-code**
  - 152,241 stars, pushed 2026-10-17. — [GitHub](https://github.com/anthropics/claude-code)
  - Its `claude-code-plugins` marketplace contains: agent-sdk-dev, claude-opus-4-5-migration, code-review, commit-commands, explanatory-output-style, feature-dev, frontend-design, hookify, learning-output-style, plugin-dev, pr-review-toolkit, ralph-wiggum, security-guidance. — [marketplace.json](https://raw.githubusercontent.com/anthropics/claude-code/main/.claude-plugin/marketplace.json)
- **anthropics/claude-plugins-official**
  - Owner "Anthropic", 315 plugins, Apache-2.0, 42,559 stars, pushed 2026-10-18. — [marketplace.json](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json); [GitHub](https://github.com/anthropics/claude-plugins-official)
  - Relevant entries, with author or source as declared in the manifest:
    - `playwright`: "Browser automation and end-to-end testing MCP server by Microsoft"
    - `chrome-devtools-mcp`: ChromeDevTools/chrome-devtools-mcp
    - `browser-use`
    - `figma`: figma/mcp-server-guide
    - `canva`: canva-sdks/canva-skills, author Canva
    - `hyperframes`: author HeyGen
    - `frontend-design`: Anthropic
    - `huggingface-skills`
    - `superpowers`: obra/superpowers
    - `context7`: Upstash
    - `runway-api`: Runway, "Video generation at scale"
    - `postiz`: social scheduling
    - `adobe-for-creativity`, `superdesign`, `cloudinary`, `posthog`
    - `playground`, `security-guidance`, `claude-security`, `skill-creator`, `claude-code-setup`: all Anthropic
    - `modern-web-guidance`: Google Chrome
    - `unity`: Unity Technologies
    - `unreal-engine-skills-for-claude-code`: Epic Games
    - Source: [marketplace.json](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json)
  - The full name list has no Phaser, Pixi, three.js, Babylon, Matter.js or other HTML5-game-engine plugin. — [marketplace.json](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json)
- **Repo checks** (all organization-owned unless noted):
  - `obra/superpowers`: owned by a user account, MIT, 301,594 stars, pushed 2026-10-10 — [GitHub](https://github.com/obra/superpowers)
  - `vercel-labs/skills`: the `npx skills` CLI, MIT, 35,482 stars, pushed 2026-10-09 — [GitHub](https://github.com/vercel-labs/skills)
  - `canva-sdks/canva-skills`: Apache-2.0, 126 stars, pushed 2026-10-16 — [GitHub](https://github.com/canva-sdks/canva-skills)
  - `figma/mcp-server-guide`: no licence detected, 2,086 stars, pushed 2026-10-15 — [GitHub](https://github.com/figma/mcp-server-guide)
  - `remotion-dev/skills`: no licence detected, 5,328 stars, pushed 2026-10-16 — [GitHub](https://github.com/remotion-dev/skills)
  - `upstash/context7`: MIT, 63,252 stars — [GitHub](https://github.com/upstash/context7)
- **How the marketplaces work**
  - "Claude Code adds Anthropic's official marketplace for you the first time you start an interactive terminal session". Auto-update is on by default for official marketplaces and off for community and third-party ones. — [Install plugins](https://code.claude.com/docs/en/discover-plugins)
  - Official and community names are accepted "only for marketplaces sourced from `github.com/anthropics/` repositories, so a third-party marketplace can't present itself as an Anthropic one". The community catalog pins nearly every entry to a commit SHA. — [Plugin security](https://code.claude.com/docs/en/plugins/security)
  - The trust warning shown for every plugin reads: "Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they will work as intended or that they won't change." — [Plugin security](https://code.claude.com/docs/en/plugins/security)

### Inferences
**Verdicts**
- **frontend-design** (Anthropic, Apache-2.0): **USE OCCASIONALLY.**
  - Use it only for the public web page, press kit or Playables application page.
  - The game's own UI is drawn on canvas and is governed by the project's rules, so this skill does not apply there.
  - To use it in cloud sessions, copy its single SKILL.md into `.claude/skills/`.
  - Confidence: medium.
- **skill-creator** (already enabled on the account): **USE OCCASIONALLY.**
  - Use it to package the project's own repeated procedures (film-and-read, the level production line) as committed project skills.
  - Confidence: medium.
- **webapp-testing: SKIP.** It is Python, and the project's Node `playwright-core` harness already films, checks the board and runs conformance. Confidence: high.
- **canvas-design, algorithmic-art, slack-gif-creator, theme-factory, brand-guidelines: SKIP.**
  - Generic poster or p5 art would fight the game's code-drawn look.
  - The best marketing frames are real game frames.
  - FFmpeg already makes GIFs.
  - Confidence: medium-high.
- **superpowers: SKIP.**
  - It is a whole development methodology that overlaps CLAUDE.md's own rules and adds context cost.
  - It has a single owner.
  - Confidence: medium.
- **context7: SKIP.**
  - Its remote host `mcp.context7.com` is not on the default allowlist.
  - The Matter.js source can be read locally.
  - Confidence: medium.
- **canva plugin and figma plugin: SKIP.** The Canva connector's tools describe themselves, and Figma is capped (section 1). Confidence: medium-high.
- **playground, claude-code-setup, security-guidance, claude-security: SKIP.**
  - The project has its own sketch and solver tooling, and a build gate that bans network primitives.
  - The built-in `/security-review` covers ad-hoc reviews.
  - Confidence: medium.
- **runway-api, adobe-for-creativity, superdesign, cloudinary, postiz: SKIP.** They are paid APIs or duplicate a connected tool. Confidence: medium.
- **unity, unreal-engine-skills-for-claude-code: SKIP (not applicable)** to a vanilla-JS game. Confidence: high.

### Gaps
- Contents of the community marketplace (`claude-community`) were not enumerated.
- Not every skill folder's licence was checked. Only the five above were read.
- Whether plugins synced from the claude.ai account load in cloud sessions. The docs mention only managed-settings plugins, so this is unverified.
- How skills.sh, the registry behind `npx skills add`, is governed.

## 3. Are there reputable free MCP servers for browser testing, image or sprite work, audio/SFX, video editing, YouTube Data API access and analytics? (Game-engine MCPs noted as not applicable.)

### Takeaway
**Browser testing.** Microsoft's Playwright MCP and Chrome DevTools MCP are genuine, Apache-2.0 and very active. But Microsoft itself steers coding agents to its CLI plus skills instead, and this project already has a pinned `playwright-core` 1.56 harness.

**Images.** No free, licence-clean generator fits the code-drawn art. Canva's free allowance is the only connected option.

**Audio.** SKIP. The game synthesizes all sound by design, and ElevenLabs' local MCP is archived.

**Video.** HyperFrames is the fit: Apache-2.0, local. Remotion is source-available with a company-size threshold.

**YouTube data.** The official API is free at 10,000 units a day, with a search costing 100 units. Prefer a direct script with the user's own key over unvetted community servers.

**Analytics.** Does not apply inside the game, which makes no network calls.

**Godot, Unity and Unreal MCPs.** Not applicable.

### Cited Findings
- **Playwright MCP** (`microsoft/playwright-mcp`)
  - Apache-2.0, 38,335 stars, pushed 2026-10-16. — [GitHub](https://github.com/microsoft/playwright-mcp)
  - Uses "structured accessibility snapshots" and runs as `npx @playwright/mcp@latest`.
  - "If you are using a coding agent, you might benefit from using the CLI+SKILLS … more token-efficient". — [README](https://raw.githubusercontent.com/microsoft/playwright-mcp/main/README.md)
- **Playwright CLI** (`microsoft/playwright-cli`)
  - Apache-2.0, 14,337 stars, pushed 2026-10-14. — [GitHub](https://github.com/microsoft/playwright-cli)
  - Installs with `npm install -g @playwright/cli@latest`. — [README](https://raw.githubusercontent.com/microsoft/playwright-cli/main/README.md)
- **This project's own Playwright setup**
  - The project pins `playwright-core` 1.56 because "that release drives Chromium build 1194 … preinstalled in /opt/pw-browsers. A different minor expects a different build and would try to download one." — [session-start.sh](file:///home/user/BRO-YOU-RE-COOKED./.claude/hooks/session-start.sh)
  - Its filmstrip launches that Chromium and takes `page.screenshot()` frames. — [tools/test/filmstrip.js](file:///home/user/BRO-YOU-RE-COOKED./tools/test/filmstrip.js)
  - Its audio test renders sounds through an `OfflineAudioContext`. — [tools/test/audio.js](file:///home/user/BRO-YOU-RE-COOKED./tools/test/audio.js)
  - The default allowlist has no Playwright CDN entry (grep found 0). — [Cloud environments](https://code.claude.com/docs/en/cloud-environments)
- **Chrome DevTools MCP** (`ChromeDevTools/chrome-devtools-mcp`)
  - Apache-2.0, 53,797 stars, pushed 2026-10-18. — [GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
  - "Record performance traces, analyze network requests, check console messages with source-mapped stack traces". — [official marketplace](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json)
- **ElevenLabs**
  - The `elevenlabs/elevenlabs-mcp` repo is **archived**: "deprecated in favor of the ElevenLabs hosted MCP server … `https://api.elevenlabs.io/v1/mcp` … This repository is no longer actively maintained." — [README](https://raw.githubusercontent.com/elevenlabs/elevenlabs-mcp/main/README.md); [GitHub](https://github.com/elevenlabs/elevenlabs-mcp)
  - The claude.ai ElevenLabs connector is `connect_incomplete` and is described as "Manage your ElevenAgents voice agents". — [ListConnectors](mcp://claude.ai/ListConnectors)
- **Hugging Face MCP**
  - Remote at `https://huggingface.co/mcp`, signed in with `?login` or a bearer token. Spaces are chosen at huggingface.co/settings/mcp. — [hf-mcp-server README](https://raw.githubusercontent.com/huggingface/hf-mcp-server/main/README.md)
  - Repo: MIT, 306 stars. — [GitHub](https://github.com/huggingface/hf-mcp-server)
  - huggingface.co is not on the default allowlist. — [Cloud environments](https://code.claude.com/docs/en/cloud-environments)
- **Remotion**
  - Licence: free for "an individual", "a for-profit organization with up to 3 employees" and non-profits. Otherwise "a company license is required". — [Remotion LICENSE](https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md)
  - Skills install with `npx skills add remotion-dev/skills`. — [remotion-dev/skills README](https://raw.githubusercontent.com/remotion-dev/skills/main/README.md)
  - HyperFrames says both tools "render video with headless Chrome and FFmpeg"; Remotion's model is React, HyperFrames' is plain HTML. — [HyperFrames README](https://raw.githubusercontent.com/heygen-com/hyperframes/main/README.md)
- **YouTube Data API**
  - Default quota is 10,000 units a day. `search.list` costs 100 units. The quota resets at midnight Pacific time, and extensions are requested by form. — [YouTube Data API overview](https://developers.google.com/youtube/v3/getting-started); [quota costs](https://developers.google.com/youtube/v3/determine_quota_cost)
  - `*.googleapis.com` is on the default allowlist. — [Cloud environments](https://code.claude.com/docs/en/cloud-environments)
- **The claude.ai connector directory**
  - Searched on 2026-10-18 for browser testing, image generation, sound effects, video editing, YouTube and analytics.
  - It returned TinyFish (a cloud browser agent), several marketing-analytics connectors (Supermetrics and others) and vidIQ.
  - It returned no Playwright, Chrome DevTools, free image-generation or SFX connector.
  - Source: [SearchMcpRegistry](mcp://claude.ai/SearchMcpRegistry)
- **Other repos checked**
  - `googleanalytics/google-analytics-mcp`: Apache-2.0, 3,499 stars, pushed 2026-10-02 — [GitHub](https://github.com/googleanalytics/google-analytics-mcp)
  - `modelcontextprotocol/servers`: 91,352 stars — [GitHub](https://github.com/modelcontextprotocol/servers)
  - `modelcontextprotocol/registry`: 7,375 stars — [GitHub](https://github.com/modelcontextprotocol/registry)
- **Game-engine MCPs**
  - `Coding-Solo/godot-mcp`: 6,148 stars, last push 2026-04-16 — [GitHub](https://github.com/Coding-Solo/godot-mcp)
  - `CoplayDev/unity-mcp`: 15,088 stars — [GitHub](https://github.com/CoplayDev/unity-mcp)
- **Matter.js**: `liabru/matter-js` is MIT, 18,480 stars, pushed 2026-09-30. — [GitHub](https://github.com/liabru/matter-js)

### Inferences
**Verdicts**
- **Playwright MCP, the `playwright` plugin, Playwright CLI: SKIP.**
  - The project's pinned harness already covers testing and filming.
  - `@latest` would expect a newer Chromium than build 1194 and try to download one from a host that is not allowlisted.
  - The accessibility-snapshot loop costs tokens and adds nothing to scripted, deterministic films.
  - Confidence: high.
- **Chrome DevTools MCP: USE OCCASIONALLY.**
  - Use it only to investigate a suspected frame-rate or memory problem on low-end devices.
  - Add it temporarily. Do not commit it to `.mcp.json`, because cloud sessions start committed servers without asking (section 5).
  - It has not been tested against the preinstalled Chromium.
  - Confidence: medium.
- **Image generation for in-game art: SKIP.** This covers Hugging Face MCP, Figma `generate_image`, vidIQ thumbnails, Canva `generate-image` and Runway.
  - Generated images clash with the code-drawn look.
  - Every asset would need bundling.
  - Most of these options are paid or capped.
  - For marketing, use Canva's free allowance only, around real frames.
  - Confidence: medium-high.
- **Audio/SFX tools: SKIP.** This covers ElevenLabs (connector and archived MCP) and vidIQ music.
  - The runtime synthesis is load-bearing: sound is driven by the same `normalSpeed` that decides lethality.
  - For trailer sound, the project's own `OfflineAudioContext` rendering could export the game's real sounds, which avoids any licence question (inference, untested).
  - Confidence: high.
- **HyperFrames (open source): INSTALL** (see section 4). **Remotion: SKIP.** HyperFrames covers the same job under Apache-2.0, with no company-size threshold. Confidence: medium-high.
- **YouTube data**
  - **Community YouTube MCP servers: SKIP.** None could be vetted here, and fake "YouTube utilities" were a known malware lure (section 5).
  - If vidIQ's 30 calls a cycle prove too few: **USE OCCASIONALLY** a small direct script against the YouTube Data API with the user's own key, stored as an environment network secret.
  - Confidence: medium.
- **Analytics MCPs (Google Analytics and others): SKIP.** The game cannot send analytics, because it makes zero network calls. Social analytics come from Metricool. Confidence: high.
- **Godot, Unity and Unreal MCPs and plugins: SKIP (not applicable).** Confidence: high.

### Gaps
- Free quotas for Hugging Face MCP image generation (ZeroGPU), and the ElevenLabs free-plan commercial terms. Not verified, because both are SKIP for this game.
- Community YouTube MCP repos could not be checked: the GitHub API is restricted to this session's own repos, and search was not run for them.
- Whether Chrome DevTools MCP can be pointed at `/opt/pw-browsers` Chromium. Untested.

## 4. How does each kind of tool get into this project's Claude Code sessions (especially cloud/web sessions), and what is the final integrate / occasional / skip list?

### Takeaway
In a cloud session, which is how this project is mostly built, only these reach the session:
- skills committed to `.claude/skills/`
- MCP servers in the repo's `.mcp.json`
- skills enabled on claude.ai
- connectors connected on claude.ai

Plugins listed in `.claude/settings.json` are **not** installed, and `/plugin` is unavailable. In practice, "installing" a plugin here means vendoring its skills into `.claude/skills/` at a pinned commit, or adding a pinned server to `.mcp.json`.

### Cited Findings
- **What carries over into a cloud session**:
  - "Your repo's `.mcp.json` MCP servers: Yes, in a session with one repository".
  - "Your repo's `.claude/skills/`, `.claude/agents/`, `.claude/commands/`: Yes".
  - "Plugins and marketplaces declared in your repo's `.claude/settings.json`: No".
  - User-level `~/.claude` skills and MCP servers: No. Cloud sessions "automatically load skills you enable on claude.ai".
  - Source: [Cloud environments — What carries over](https://code.claude.com/docs/en/cloud-environments)
- A cloud session "has no plugin browser and doesn't load the plugins you installed on your own machine or the ones your repository's `.claude/settings.json` turns on". — [Install plugins](https://code.claude.com/docs/en/discover-plugins)
- Terminal-only commands "such as `/plugin` or `/resume`, aren't available" in cloud sessions. — [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web)
- Project skills live at `.claude/skills/<skill-name>/SKILL.md`, and "Cloud sessions additionally load project skills committed to the cloned repository's `.claude/skills/`." — [Skills docs](https://code.claude.com/docs/en/skills)
- `npx skills add <owner/repo>` installs per project by default into `./<agent>/skills/`, which for Claude Code is `.claude/skills/`. `-g` installs globally, and `-a claude-code` targets the agent. — [vercel-labs/skills README](https://raw.githubusercontent.com/vercel-labs/skills/main/README.md)
- `claude mcp add --transport http <name> --scope project <url>` writes `.mcp.json`. — [MCP docs](https://code.claude.com/docs/en/mcp)
- **Network levels**: None, Trusted (the default: "package registries, GitHub, cloud SDKs"), Full and Custom. — [Cloud environments](https://code.claude.com/docs/en/cloud-environments)
  - Connectors, GitHub and network-secret hosts bypass the allowlist. — [Cloud environments](https://code.claude.com/docs/en/cloud-environments)
  - Hosts that are on the Trusted list: `registry.npmjs.org`, `pypi.org`, `nodejs.org`, `*.googleapis.com` and `storage.googleapis.com`. — [Cloud environments](https://code.claude.com/docs/en/cloud-environments)
  - Hosts that are not: huggingface.co, unsplash, canva, figma, heygen, elevenlabs, the Playwright CDN. — [Cloud environments](https://code.claude.com/docs/en/cloud-environments)
- The project already installs tools at session start: its SessionStart hook installs esbuild and `playwright-core@1.56` into `/tmp/node_modules`. — [session-start.sh](file:///home/user/BRO-YOU-RE-COOKED./.claude/hooks/session-start.sh)

### Inferences
**Final list for "which skills, plugins and repositories will you actually integrate?"**

| Item | Verdict | How it enters the project | Reason | Confidence |
|---|---|---|---|---|
| HyperFrames open-source skills (heygen-com/hyperframes) | **INSTALL / USE IN THE PROJECT WORKFLOW** | Run `npx hyperframes skills update` (core set) or `npx skills add heygen-com/hyperframes`. Review the skills, then commit them under `.claude/skills/` at a recorded commit. Render locally with the container's Node 22, FFmpeg and Chromium. | Makes trailers and Shorts from real gameplay captures. Apache-2.0, no per-render fees. Its hosted connector is disabled in Claude Code. | Medium-high: requirements verified, no end-to-end render tried yet |
| FFmpeg 6.1.1 + the existing playwright-core 1.56 harness | **USE IN THE PROJECT WORKFLOW** (already present) | Nothing to install. | Turns frame sequences into MP4 and GIF clips. Stays the testing and filming backbone. | High |
| vidIQ connector | USE OCCASIONALLY | Already connected. | Research only, at most 30 calls a cycle, none before 2026-10-24. | High |
| Canva connector | USE OCCASIONALLY | Already connected. | Listing and social art around real frames. Never the logo. | Medium-high |
| Metricool connector | USE OCCASIONALLY | The user must connect YouTube, TikTok or Instagram first. | Scheduling drafts for human approval, at most 20 published a month. | High |
| Google Drive connector | USE OCCASIONALLY | Already connected. | Distributing playtest kits and press kits. | High |
| Google Calendar connector | USE OCCASIONALLY (on request) | Already connected. | Booking playtests. | High |
| Unsplash connector | USE OCCASIONALLY (marketing only) | Already connected. | Mood boards. No in-game use. | Medium-high |
| frontend-design skill (Anthropic) | USE OCCASIONALLY | Copy SKILL.md into `.claude/skills/` when web-page work starts. | Public web page and press kit only. | Medium |
| skill-creator (built-in) | USE OCCASIONALLY | Already enabled. | Package the project's own procedures as skills. | Medium |
| Chrome DevTools MCP | USE OCCASIONALLY | Add temporarily, pinned. Do not commit it. | Performance or console investigations only. | Medium |
| Direct YouTube Data API script | USE OCCASIONALLY (if needed) | The user's key, stored as a network secret. | Free 10k units a day, if vidIQ credits run short. | Medium |
| HyperFrames connector, Figma, Gmail, Viberate, remove-ai-marks | SKIP | — | See section 1. | High / high / high / high / medium |
| Playwright MCP, playwright plugin, playwright-cli, webapp-testing | SKIP | — | Redundant with the pinned harness. Would try a browser download. Python. | High |
| canvas-design, algorithmic-art, slack-gif-creator, theme-factory, brand-guidelines, superpowers, context7, playground, claude-code-setup, security-guidance, claude-security, figma plugin, canva plugin | SKIP | — | Overlap with what the project has, style mismatch, or context cost. | Medium to medium-high |
| Remotion + remotion skills, runway-api, adobe-for-creativity, superdesign, cloudinary, postiz | SKIP | — | Licence threshold, paid, or a duplicate. | Medium |
| ElevenLabs, Hugging Face MCP or any image generator for in-game art, Google Analytics MCP, community YouTube MCP servers, TinyFish | SKIP | — | Procedural audio and art, no runtime network, unvetted. | Medium-high |
| Godot, Unity and Unreal MCPs and plugins | SKIP (not applicable) | — | Vanilla JS + Matter.js. | High |

### Gaps
- Whether `npx hyperframes skills update` writes to `.claude/skills/` or `.agents/skills/` in this repo. To be confirmed on the first install.
- Whether HyperFrames' Puppeteer accepts the preinstalled Chromium or downloads Chrome for Testing from the allowlisted `storage.googleapis.com`. Untested.

## 5. Security: what are the known risks of community MCP servers, skills and plugins, what incidents are documented, and how do you vet one?

### Takeaway
The risk is real and documented across 2025–2026:
- a typosquatted MCP server that stole email (postmark-mcp, September 2025)
- hundreds of malicious agent skills, including fake "YouTube utilities" (ClawHub/ClawHavoc, early 2026)
- prompt-injection data leaks through MCP servers
- Claude Code CVEs triggered by malicious project files, now patched

Two facts matter most for this project:
- A plugin runs code with full user privileges.
- Cloud sessions start servers listed in a committed `.mcp.json` **without an approval prompt**.

Vet by publisher identity, activity, licence, the actual hook, MCP and bin contents, and pinned versions.

### Cited Findings
- **postmark-mcp (September 2025)**
  - A copy of Postmark's MCP server was published under the same name. Version 1.0.16, released 17 September 2025, BCC'd every email sent through it to `phan@giftshop[.]club`.
  - Koi Security called it the first real-world malicious MCP server.
  - Download figures differ by source; one report says 1,643 in total.
  - The publisher deleted the package, but deletion does not clean machines that already installed it.
  - Sources: [The Hacker News](https://thehackernews.com/2025/09/first-malicious-mcp-server-found.html); [CSO Online](https://www.csoonline.com/article/4064009/trust-on-mcp-takes-first-in-the-wild-hit-via-squatted-postmark-connector.html); [SC World](https://www.scworld.com/news/open-source-mcp-server-package-caught-stealing-emails)
- **ClawHub / ClawHavoc (early 2026)**
  - Koi reviewed 2,857 OpenClaw skills and flagged 341. Of those, 335 belonged to one campaign that used a fake "Prerequisites" step to install the Atomic macOS Stealer.
  - The lures included "YouTube utilities" and Google Workspace integrations, and many were typosquats.
  - Antiy CERT counts at least 1,184 malicious skills over time.
  - Sources: [The Hacker News](https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html); [eSecurity Planet](https://esecurityplanet.com/threats/hundreds-of-malicious-skills-found-in-openclaws-clawhub); [Antiy](https://www.antiy.net/p/clawhavoc-analysis-of-large-scale-poisoning-campaign-targeting-the-openclaw-skill-market-for-ai-agents/)
- **Claude Code project-file flaws (Check Point Research, 25 February 2026)**. All three are patched. The details come from secondary write-ups; the primary report was not read.
  - A malicious hook in a repository's config ran when the project was opened (GHSA-ph6w-f82w-28w6, fixed in 1.0.87).
  - CVE-2025-59536: repo settings could auto-approve MCP servers before the trust dialog appeared. CVSS 8.7, fixed in 1.0.111.
  - CVE-2026-21852: an `ANTHROPIC_BASE_URL` override could leak the API key. CVSS 5.3, fixed in 2.0.65.
  - Sources: [Check Point Research](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/); [The Register](https://www.theregister.com/2026/02/26/clade_code_cves/); [Dark Reading](https://www.darkreading.com/application-security/flaws-claude-code-developer-machines-risk); [Hackmag](https://hackmag.com/news/claude-code-flaws)
- **Other documented MCP incidents** (secondary sources):
  - Tool poisoning, where hidden instructions sit in a tool's description (Invariant Labs, April 2025).
  - GitHub MCP prompt injection through public issues that leaked private repo code (May 2025).
  - mcp-remote CVE-2025-6514: command injection through the OAuth `authorization_endpoint`. Affects versions >=0.0.5 <0.1.16, rated critical; one source gives CVSS 9.6 and about 437k downloads.
  - Sources: [UpGuard](https://upguard.com/blog/mcp-security-incidents); [OSV](https://osv.dev/vulnerability/CVE-2025-6514); [Fluid Attacks](https://db.fluidattacks.com/adv/npm/mcp-remote/CVE-2025-6514)
- **What Anthropic's own docs say**
  - Plugins: "A Claude Code plugin you install can execute arbitrary code on your machine with your user privileges". Hooks, monitors and MCP servers run "outside the sandbox". With auto-update, "the files you reviewed can change on disk". — [Plugin security](https://code.claude.com/docs/en/plugins/security)
  - MCP: "Verify you trust each server before connecting it. Servers that fetch external content can expose you to prompt injection risk." — [MCP docs](https://code.claude.com/docs/en/mcp)
  - The approval prompt for project `.mcp.json` servers "can't appear in `claude -p` runs, Agent SDK sessions, or cloud sessions, so Claude Code loads project-scoped servers there without asking", unless the server is listed in `disabledMcpjsonServers`. — [MCP docs](https://code.claude.com/docs/en/mcp)
  - Skills: "Workspace trust doesn't gate this field … A skill can grant itself broad tool access, so review the `allowed-tools` of skills checked into a repository". — [Skills docs](https://code.claude.com/docs/en/skills)
  - Cloud: "Turn off any connector you don't need to limit which tools Claude can reach." — [Cloud environments](https://code.claude.com/docs/en/cloud-environments)
- **Impersonation protections**: reserved official and community marketplace names are honoured only from `github.com/anthropics/`, the community catalog pins commit SHAs, and archive sources can be pinned by sha256. — [Plugin security](https://code.claude.com/docs/en/plugins/security)

### Inferences
**Vetting checklist used in these notes, and recommended for anything new**
1. Check that the publisher is the vendor's own organization (heygen-com, microsoft, ChromeDevTools, canva-sdks, figma). Prefer entries that also appear in `claude-plugins-official` with the vendor named as author.
2. Check activity: recent pushes, not archived. ElevenLabs' local MCP failed this check.
3. Check that the licence allows commercial use.
4. Before committing, read `hooks/hooks.json`, `.mcp.json`, `bin/` and every skill's `allowed-tools`.
5. Pin versions or commits. Never commit `@latest` to `.mcp.json`, because cloud sessions start those servers unprompted.
6. Prefer claude.ai directory connectors with OAuth over npx packages that hold API keys.
7. Keep connectors that read untrusted content, such as an inbox, switched off in coding sessions.
8. Never install a "YouTube", "crypto" or "workspace" helper from an unknown registry. That is exactly what ClawHavoc used as bait.

For this project the residual risk is low if the integrate list stays as in section 4: HyperFrames is the only third-party code it adds, and all the connectors are first-party vendor servers.

### Gaps
- The primary Check Point report was not read in full; the CVE version numbers come from secondary sources.
- No audit history was found for skills.sh or for the `npx skills` registry pipeline.

## 6. What can the agent NOT do, even with every tool above?

### Takeaway
The agent cannot do any of these:
- Publish to YouTube Playables. Access is early-stage and form-based, and the SDK, test suite and certification only open after onboarding.
- Log into YouTube Studio in this cloud session.
- Use anything that needs a network call at game runtime.
- Create accounts, accept terms or pay for anything.

Every connector is also capped, as of this week:
- vidIQ: 0 credits until 2026-10-24.
- Figma: about 6 calls a month.
- Metricool: no network connected, and 20 posts a month once one is.
- HyperFrames: hosted compose and render disabled.
- Gmail: delete-only.

### Cited Findings
- **Playables**: "Interested developers can submit their games via a provided form". The SDK, test-suite guide and certification requirements are available "only after the onboarding as a Playable developer". — [YouTube Playables (developers.google.com)](https://developers.google.com/youtube/gaming/playables)
- **Game runtime**: zero external network calls; the build fails on `fetch` and the other network primitives; "no runtime AI/API call is possible, ever". — [CLAUDE.md](file:///home/user/BRO-YOU-RE-COOKED./CLAUDE.md)
- **Browser sign-ins**: browser control that uses the user's own sign-ins (Claude in Chrome, the built-in browser) needs the desktop app or a cloud session linked to the user's computer. No such tools are loaded in this session. — [ListSkills descriptions](mcp://claude.ai/ListSkills)
- **Per-connector limits**:
  - vidIQ balance 0 until 2026-10-24 — [vidiq_balance](mcp://vidIQ/vidiq_balance)
  - Figma Starter with a View seat — [whoami](mcp://Figma/whoami); [Figma limits](https://developers.figma.com/docs/figma-mcp-server/plans-access-and-permissions/)
  - Metricool has no network connected — [getBrandSettings](mcp://Metricool/getBrandSettings)
  - HyperFrames compose and render disabled from CLI agents — [server instructions](mcp://HyperFrames_by_HeyGen)
  - Gmail exposes only `delete_draft` — [ToolSearch](mcp://Gmail/delete_draft)
- **Cloud session limits**:
  - No `/plugin`, and repo-declared plugins are not loaded — [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web); [Cloud environments](https://code.claude.com/docs/en/cloud-environments)
  - Non-allowlisted hosts are blocked unless the user widens network access — [Cloud environments](https://code.claude.com/docs/en/cloud-environments)
- **Purchase tools that exist but must never be called**: Viberate's `buy_subscription` and `cancel_subscription`, and Figma's paid AI credits. — [buy_subscription](mcp://Viberate/buy_subscription); [generate_image](mcp://Figma/generate_image)

### Inferences
- The agent cannot judge how the game sounds or feels to a stranger. CLAUDE.md's rule is that playtesting outranks every gate, so human playtests remain the only evidence on comprehension, and none of these tools change that.
- Anything that publishes needs a human to approve it at the moment it happens: Metricool `autoPublish`, vidIQ's `update_video` and `publish_reel`, Drive `share_file`. Default to drafts.
- A Playables submission, the YouTube channel and any app-store-style listing remain the user's own manual steps. The agent can prepare the assets (banner, icon, trailer, copy) but cannot submit them.

### Gaps
- The full Playables certification and listing-asset specification (sizes for the icon and banner). It is only available after onboarding, so it was not verifiable here.
