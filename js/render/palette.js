// M0 placeholder palette — but the Bible §6.4 HIERARCHY applies from day one,
// because it costs nothing and it is what lets a player parse a level in 400ms
// with no tutorial.
//
// THE SINGLE-ACCENT RULE IS ABSOLUTE: the danger colour appears on danger and
// on nothing else, ever. If it shows up on decoration, the level is wrong.

export const C = {
  paper:      '#E8E2D6',
  paperDark:  '#DCD4C4',
  ink:        '#2A2622',
  staticFill: '#C6BCA9',
  // Mechanisms and props — planks, plates, gates. Warmer than fixed geometry so
  // they read as loose or moving parts, and deliberately NOT the danger accent:
  // they obstruct, they do not kill.
  plank:      '#B79A6E',
  // Moving air. Cool and pale on purpose: it is the only thing in the game
  // that ACTS on the world without being solid or lethal, so it must not read
  // as either. Nowhere near the danger accent.
  air:        '#7FA3B5',
  danger:     '#E0452B',   // THE accent. Danger only.
  goal:       '#3FA96B',
  goalGlow:   'rgba(63,169,107,0.28)',
  milo:       '#F6F1E6',
  stroke:     '#2A2622',
  strokeGlow: 'rgba(42,38,34,0.22)',
  ghost:      'rgba(42,38,34,0.18)',
  anchor:     '#F2C14E',
  dim:        'rgba(232,226,214,0.38)',
};
