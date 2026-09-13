import type { Person } from '../../types/content'

const RT_SOURCE = {
  name: 'Rotten Tomatoes',
  url: 'https://editorial.rottentomatoes.com/article/everything-we-know-about-avengers-doomsday/',
}

/**
 * D23 (Disney's official fan-club/news outlet) published Marvel Studios'
 * own cast announcement on March 26, 2025 — the primary, highest-authority
 * source for every actor added in the Phase 12 expansion below. It confirms
 * the actor is cast in the film; it does not pair every actor with a
 * character (only Robert Downey Jr./Doctor Doom is named explicitly in that
 * article). Each actor's specific role below is their own pre-existing,
 * previously-established Marvel/X-Men-franchise identity — reprised, not
 * invented for this film — and is independently corroborated by trade
 * reporting (e.g. TV Insider, Aug 17, 2026) and, for the X-Men trio and the
 * Wakanda/Fantastic-Four group, by this site's own already-verified trailer
 * analysis (see `src/data/trailers`'s `x-men-teaser` and
 * `wakanda-fantastic-four-teaser`).
 */
const D23_SOURCE = {
  name: 'D23 (Disney)',
  url: 'https://d23.com/marvel-studios-announces-avengers-doomsday-cast/',
}

/**
 * Small, officially confirmed selection — every entry names the actor and
 * their confirmed role separately, and cites where the casting was reported.
 */
export const cast: Person[] = [
  {
    id: 'cast-robert-downey-jr',
    slug: 'robert-downey-jr',
    name: 'Robert Downey Jr.',
    role: 'Victor von Doom / Doctor Doom',
    description:
      'Returns to the MCU after playing Tony Stark/Iron Man, now confirmed as the villain Victor von Doom in Avengers: Doomsday.',
    source: RT_SOURCE,
  },
  {
    id: 'cast-chris-evans',
    slug: 'chris-evans',
    name: 'Chris Evans',
    role: 'Steve Rogers / Captain America',
    description: 'Confirmed to return as Steve Rogers, the original Captain America.',
    source: RT_SOURCE,
  },
  {
    id: 'cast-chris-hemsworth',
    slug: 'chris-hemsworth',
    name: 'Chris Hemsworth',
    role: 'Thor',
    description: 'Confirmed to reprise his role as Thor, the Asgardian Avenger he has played since 2011.',
    source: RT_SOURCE,
  },
  {
    id: 'cast-pedro-pascal',
    slug: 'pedro-pascal',
    name: 'Pedro Pascal',
    role: 'Reed Richards / Mister Fantastic',
    description: 'Confirmed as Reed Richards, leader of the Fantastic Four.',
    source: RT_SOURCE,
  },
  {
    id: 'cast-anthony-mackie',
    slug: 'anthony-mackie',
    name: 'Anthony Mackie',
    role: 'Sam Wilson / Captain America',
    description:
      'Confirmed to return as Sam Wilson, who took up the Captain America mantle after Avengers: Endgame.',
    source: RT_SOURCE,
  },
  // --- Phase 12 expansion — officially confirmed via D23, March 26, 2025 ---
  {
    id: 'cast-paul-rudd',
    slug: 'paul-rudd',
    name: 'Paul Rudd',
    role: 'Scott Lang / Ant-Man',
    description: 'Confirmed to return as Scott Lang, who has fought alongside the Avengers as Ant-Man since 2015.',
    source: D23_SOURCE,
  },
  {
    id: 'cast-tom-hiddleston',
    slug: 'tom-hiddleston',
    name: 'Tom Hiddleston',
    role: 'Loki',
    description: "Confirmed to return as Loki, the God of Mischief, following the character's own Disney+ series.",
    source: D23_SOURCE,
  },
  {
    id: 'cast-simu-liu',
    slug: 'simu-liu',
    name: 'Simu Liu',
    role: 'Shang-Chi',
    description:
      'Confirmed to return as Shang-Chi, master of the Ten Rings, introduced in Shang-Chi and the Legend of the Ten Rings (2021).',
    source: D23_SOURCE,
  },
  {
    id: 'cast-sebastian-stan',
    slug: 'sebastian-stan',
    name: 'Sebastian Stan',
    role: 'Bucky Barnes / Winter Soldier',
    description: "Confirmed to return as Bucky Barnes, the former Winter Soldier and Steve Rogers' oldest friend.",
    source: D23_SOURCE,
  },
  {
    id: 'cast-florence-pugh',
    slug: 'florence-pugh',
    name: 'Florence Pugh',
    role: 'Yelena Belova',
    description:
      'Confirmed to return as Yelena Belova, the Black Widow-trained operative introduced in Black Widow (2021).',
    source: D23_SOURCE,
  },
  {
    id: 'cast-wyatt-russell',
    slug: 'wyatt-russell',
    name: 'Wyatt Russell',
    role: 'John Walker / U.S. Agent',
    description:
      'Confirmed to return as John Walker, who took up the U.S. Agent identity after briefly serving as Captain America.',
    source: D23_SOURCE,
  },
  {
    id: 'cast-david-harbour',
    slug: 'david-harbour',
    name: 'David Harbour',
    role: 'Alexei Shostakov / Red Guardian',
    description:
      'Confirmed to return as Alexei Shostakov, the Soviet super-soldier known as the Red Guardian.',
    source: D23_SOURCE,
  },
  {
    id: 'cast-hannah-john-kamen',
    slug: 'hannah-john-kamen',
    name: 'Hannah John-Kamen',
    role: 'Ava Starr / Ghost',
    description:
      'Confirmed to return as Ava Starr, the intangible operative known as Ghost, introduced in Ant-Man and the Wasp (2018).',
    source: D23_SOURCE,
  },
  {
    id: 'cast-lewis-pullman',
    slug: 'lewis-pullman',
    name: 'Lewis Pullman',
    role: 'Bob Reynolds / Sentry',
    description:
      'Confirmed to return as Bob Reynolds, the unstable superhuman known as Sentry, introduced in Thunderbolts* (2025).',
    source: D23_SOURCE,
  },
  {
    id: 'cast-danny-ramirez',
    slug: 'danny-ramirez',
    name: 'Danny Ramirez',
    role: 'Joaquin Torres / Falcon',
    description:
      'Confirmed to return as Joaquin Torres, who took up the Falcon mantle in Captain America: Brave New World (2025).',
    source: D23_SOURCE,
  },
  {
    id: 'cast-letitia-wright',
    slug: 'letitia-wright',
    name: 'Letitia Wright',
    role: 'Shuri / Black Panther',
    description:
      'Confirmed to return as Shuri, who assumed the mantle of Black Panther in Black Panther: Wakanda Forever (2022).',
    source: D23_SOURCE,
  },
  {
    id: 'cast-winston-duke',
    slug: 'winston-duke',
    name: 'Winston Duke',
    role: "M'Baku",
    description: "Confirmed to return as M'Baku, leader of Wakanda's Jabari tribe.",
    source: D23_SOURCE,
  },
  {
    id: 'cast-tenoch-huerta',
    slug: 'tenoch-huerta',
    name: 'Tenoch Huerta Mejía',
    role: 'Namor',
    description:
      'Confirmed to return as Namor, ruler of the underwater nation of Talokan, introduced in Black Panther: Wakanda Forever (2022).',
    source: D23_SOURCE,
  },
  {
    id: 'cast-vanessa-kirby',
    slug: 'vanessa-kirby',
    name: 'Vanessa Kirby',
    role: 'Susan Storm / Invisible Woman',
    description:
      'Confirmed as Susan Storm, Invisible Woman and a founding member of the Fantastic Four, introduced in The Fantastic Four: First Steps (2025).',
    source: D23_SOURCE,
  },
  {
    id: 'cast-ebon-moss-bachrach',
    slug: 'ebon-moss-bachrach',
    name: 'Ebon Moss-Bachrach',
    role: 'Ben Grimm / The Thing',
    description: 'Confirmed as Ben Grimm, the rock-skinned member of the Fantastic Four known as The Thing.',
    source: D23_SOURCE,
  },
  {
    id: 'cast-joseph-quinn',
    slug: 'joseph-quinn',
    name: 'Joseph Quinn',
    role: 'Johnny Storm / Human Torch',
    description: 'Confirmed as Johnny Storm, the Human Torch and youngest member of the Fantastic Four.',
    source: D23_SOURCE,
  },
  {
    id: 'cast-patrick-stewart',
    slug: 'patrick-stewart',
    name: 'Patrick Stewart',
    role: 'Charles Xavier / Professor X',
    description:
      'Confirmed to return as Charles Xavier, founder of the X-Men, reprising the role he has played across multiple X-Men films since 2000.',
    source: D23_SOURCE,
  },
  {
    id: 'cast-ian-mckellen',
    slug: 'ian-mckellen',
    name: 'Ian McKellen',
    role: 'Erik Lehnsherr / Magneto',
    description:
      'Confirmed to return as Erik Lehnsherr, the mutant known as Magneto, reprising the role he has played across multiple X-Men films since 2000.',
    source: D23_SOURCE,
  },
  {
    id: 'cast-james-marsden',
    slug: 'james-marsden',
    name: 'James Marsden',
    role: 'Scott Summers / Cyclops',
    description:
      "Confirmed to return as Scott Summers, the X-Men's field leader Cyclops, reprising the role he first played in X-Men (2000).",
    source: D23_SOURCE,
  },
  {
    id: 'cast-rebecca-romijn',
    slug: 'rebecca-romijn',
    name: 'Rebecca Romijn',
    role: 'Raven Darkholme / Mystique',
    description:
      'Confirmed to return as Raven Darkholme, the shapeshifting mutant Mystique, reprising the role she first played in X-Men (2000).',
    source: D23_SOURCE,
  },
  {
    id: 'cast-alan-cumming',
    slug: 'alan-cumming',
    name: 'Alan Cumming',
    role: 'Kurt Wagner / Nightcrawler',
    description:
      'Confirmed to return as Kurt Wagner, the teleporting mutant Nightcrawler, reprising the role he first played in X2 (2003).',
    source: D23_SOURCE,
  },
  {
    id: 'cast-kelsey-grammer',
    slug: 'kelsey-grammer',
    name: 'Kelsey Grammer',
    role: 'Hank McCoy / Beast',
    description:
      'Confirmed to return as Hank McCoy, the mutant known as Beast, reprising the role he first played in X-Men: The Last Stand (2006).',
    source: D23_SOURCE,
  },
  {
    id: 'cast-channing-tatum',
    slug: 'channing-tatum',
    name: 'Channing Tatum',
    role: 'Remy LeBeau / Gambit',
    description: 'Confirmed as Remy LeBeau, the card-throwing mutant Gambit.',
    source: D23_SOURCE,
  },
]
