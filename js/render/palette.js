// THE NOTEBOOK. A page of graph paper, a world drawn in graphite pencil, the
// player's line in blue ballpoint, and danger in red pen — the owner's brief of
// 25 Oct 2026, after "Sketchy Level": simple, a drawing game that looks drawn.
//
// Three pens, each with one job, is what keeps a busy level readable:
//   graphite  everything that is just THERE — ground, walls, shelves
//   blue      YOUR line, and nothing else, so it can never get lost
//   red       what kills him — the single-accent rule below still holds
// Colour beyond the three marks a part that does something (wood that moves,
// air that pushes, the goal), and stays soft like coloured pencil.
//
// THE SINGLE-ACCENT RULE IS ABSOLUTE: the danger colour appears on danger and
// on nothing else, ever. If it shows up on decoration, the level is wrong.
//
// Every token that freeze.js drain() touches MUST stay six-digit hex: drain
// parses the hex, and anything else becomes rgb(NaN,…), which a canvas ignores
// without a word.

export const C = {
  paper:      '#F7F6F2',   // the page
  paperDark:  '#E9E7E0',   // the desk round it, outside the play area
  grid:       '#D5DDE7',   // graph-paper squares, faint blue-grey
  margin:     '#EBB1AC',   // the notebook's margin line — pale, not the danger red
  ink:        '#33363B',   // graphite
  staticFill: '#E8ECF2',   // pale wash under the hatching
  hatch:      '#AAB5C4',   // pencil hatching across solid blocks
  // Mechanisms and props — planks, plates, gates. Warmer than fixed geometry so
  // they read as loose or moving parts, and deliberately NOT the danger accent:
  // they obstruct, they do not kill.
  plank:      '#CBAE82',
  // Moving air. Cool and pale on purpose: it is the only thing in the game
  // that ACTS on the world without being solid or lethal, so it must not read
  // as either. Nowhere near the danger accent.
  air:        '#86AECB',
  // A surface that gives energy back. Violet because every other role is
  // already spoken for — tan is a loose part, blue is moving air, green is the
  // goal, red is death — and a springboard is none of those. A player must be
  // able to tell at a glance that this piece of ground is not like the ground.
  spring:     '#9B6FA8',
  // The pin a lever or an arm turns about. Deliberately dark and metallic
  // rather than coloured: the pin is the one part that does NOT move, and it
  // must read as hardware holding a moving part, not as another moving part.
  pivot:      '#5E6168',
  danger:     '#E0452B',   // THE accent. Danger only. Red pen.
  // Fire: a lit fuse and the flash of a blast. Orange, between the anchor
  // yellow and the danger red and distinct from both — the anchor colour means
  // "attach here" and must never flicker on a bomb; the red stays for the
  // barrel itself and the ring inside which the blast kills.
  fire:       '#F28C28',
  goal:       '#4CB377',
  goalGlow:   'rgba(76,179,119,0.24)',
  milo:       '#FFD84A',   // highlighter yellow: the hero is the brightest thing on the page
  dog:        '#F4EEE2',   // its own token: Milo's colour is free to change
  // The player's own line: blue ballpoint, the one thing on the page in blue.
  stroke:     '#2950C4',
  strokeGlow: 'rgba(41,80,196,0.18)',
  ghost:      'rgba(41,80,196,0.16)',
  anchor:     '#F2C14E',
  dim:        'rgba(247,246,242,0.40)',
};

/** Handwriting first, the system sans as the fallback while it loads. */
export const HAND = '"Patrick Hand", ui-sans-serif, system-ui, -apple-system, sans-serif';
