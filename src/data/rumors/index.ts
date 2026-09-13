import type { Rumor } from '../../types/content'

/**
 * Every entry here tracks a CLAIM, not an article — see README's "Rumor
 * Intelligence" section for the full editorial policy. Only genuinely
 * notable, identifiably-sourced claims are included; each `sources` entry
 * is a paraphrase of reporting actually read while researching this file,
 * never a copied excerpt. Where several outlets simply repeated one
 * original report, only the original (or the clearest independent
 * corroboration/contradiction) is listed — reposts of the same leak are
 * not counted as separate corroborating sources.
 */
export const rumors: Rumor[] = [
  {
    id: 'rumor-tom-holland-spider-man-cameo',
    slug: 'tom-holland-spider-man-cameo',
    title: "Tom Holland's Spider-Man Cameo",
    claim: "Tom Holland's Spider-Man makes a cameo appearance in Avengers: Doomsday.",
    summary:
      "Tom Holland was absent from Marvel's official Avengers: Doomsday cast reveal, and reporting largely attributes this to scheduling conflicts with Spider-Man: Brand New Day. A cameo hasn't been ruled out, but it remains unconfirmed — Holland and co-star Tom Hiddleston have both given evasive, noncommittal answers when asked directly.",
    status: 'UNVERIFIED',
    confidence: 'low',
    firstReportedAt: '2026-07-29',
    lastUpdatedAt: '2026-08-03',
    sources: [
      {
        name: 'TheDirect',
        url: 'https://thedirect.com/article/spider-man-avengers-doomsday-tom-holland-tobey-maguire',
        publishedAt: '2026-07-29',
        type: 'AGGREGATOR',
        reliability: 'MEDIUM',
        author: 'Sam Hargrave',
        summary:
          "Reported that Holland's Spider-Man would likely be sidelined from Doomsday in favor of Tobey Maguire's, attributing this to Doomsday and Brand New Day filming concurrently; cited Holland telling Cinemania he's merely 'curious' about the Doomsday set.",
        role: 'FIRST_REPORT',
      },
      {
        name: 'ScreenRant',
        url: 'https://screenrant.com/is-tom-holland-spider-man-in-avengers-doomsday/',
        publishedAt: '2026-08-03',
        type: 'JOURNALIST',
        reliability: 'MEDIUM',
        author: 'Cooper Hood',
        summary:
          "Confirmed Holland did not receive a cast chair at the official reveal, and analyzed his evasive BBC quote ('I can't answer those questions') alongside Tom Hiddleston's comment calling Holland his favorite Spider-Man 'for reasons I cannot disclose' — concluding a secret cameo is possible but unconfirmed.",
        role: 'CORROBORATION',
      },
    ],
  },
  {
    id: 'rumor-tobey-maguire-opening-battle',
    slug: 'tobey-maguire-opening-battle',
    title: "Tobey Maguire's Opening Battle",
    claim:
      "Avengers: Doomsday opens with Tobey Maguire's Spider-Man fighting Wolverine (and possibly Deadpool) as Magneto destroys his reality in an Incursion.",
    summary:
      "Multiple entertainment outlets have reported that the film's opening sequence puts Maguire's Spider-Man up against Wolverine near a Daily Bugle-set rain scene, with Magneto simultaneously bombing the city as part of a multiversal Incursion. The most detailed version traces back to an anonymous Telegram leak account and has not been confirmed by Marvel Studios.",
    status: 'REPORTED',
    confidence: 'low',
    firstReportedAt: '2026-07-29',
    lastUpdatedAt: '2026-08-19',
    notes:
      'Both sources below may ultimately trace back to the same leak community rather than being fully independent — treated here as REPORTED, not CORROBORATED, since neither adds an identifiably separate origin.',
    sources: [
      {
        name: 'TheDirect',
        url: 'https://thedirect.com/article/spider-man-avengers-doomsday-tom-holland-tobey-maguire',
        publishedAt: '2026-07-29',
        type: 'AGGREGATOR',
        reliability: 'LOW',
        author: 'Sam Hargrave',
        summary:
          "Reported Maguire's Spider-Man was 'heavily rumored' to reprise the role in the film's opening sequence, potentially fighting Wolverine, citing unnamed 'latest reports.'",
        role: 'FIRST_REPORT',
      },
      {
        name: 'ComicBookMovie',
        url: 'https://comicbookmovie.com/avengers/avengers-doomsday/avengers-doomsday-plot-leak-details-the-movies-controversial-opening-action-scene-a229437',
        publishedAt: '2026-08-19',
        type: 'AGGREGATOR',
        reliability: 'LOW',
        author: 'JoshWilding',
        summary:
          'Relayed a detailed leak from an anonymous Telegram account (described as the source of prior trailer/image leaks): Wolverine and Spider-Man fight near the Daily Bugle in the rain while Magneto destroys the reality with bombs.',
        role: 'CONTEXT',
      },
    ],
  },
  {
    id: 'rumor-doctor-octopus-opening-battle',
    slug: 'doctor-octopus-opening-battle',
    title: 'Doctor Octopus in the Opening Battle',
    claim: "Alfred Molina's Doctor Octopus is part of Avengers: Doomsday's opening X-Men-universe battle.",
    summary:
      "Earlier chatter suggested Doctor Octopus would team up with Spider-Man against the X-Men in the film's opening. Two separate, independently sourced reports have since stated Doc Ock is not part of that scene — the earliest verifiable mention of the claim is itself one of the sources contradicting it.",
    status: 'DEBUNKED',
    confidence: 'low',
    firstReportedAt: '2026-08-19',
    lastUpdatedAt: '2026-09-07',
    notes:
      "The original claim's first-report date and source could not be independently verified — the dates here reflect the earliest verifiable discussion, which already disputes it. Documented rather than omitted, since a rumor being contradicted is exactly the kind of claim this archive exists to track.",
    sources: [
      {
        name: 'ComicBookMovie',
        url: 'https://comicbookmovie.com/avengers/avengers-doomsday/avengers-doomsday-plot-leak-details-the-movies-controversial-opening-action-scene-a229437',
        publishedAt: '2026-08-19',
        type: 'AGGREGATOR',
        reliability: 'LOW',
        author: 'JoshWilding',
        summary:
          "While detailing the Wolverine/Spider-Man opening-scene leak, explicitly stated that 'despite rumours to the contrary,' neither Doctor Octopus nor Green Goblin appear in it.",
        role: 'CONTRADICTION',
      },
      {
        name: 'Mandatory (via Yahoo Entertainment)',
        url: 'https://www.yahoo.com/entertainment/movies/articles/avengers-doomsday-rumor-casts-doubt-212854257.html',
        publishedAt: '2026-09-07',
        type: 'SOCIAL',
        reliability: 'MEDIUM',
        author: 'Daniel Richtman',
        summary:
          "Industry insider Daniel Richtman publicly dismissed the Doctor Octopus claim on X, writing: 'No, Doc Ock isn't in the X-Men universe trying to blow it up.'",
        role: 'CONTRADICTION',
      },
    ],
  },
  {
    id: 'rumor-180-actor-ensemble',
    slug: '180-actor-ensemble',
    title: 'The 180-Actor Ensemble',
    claim: "Avengers: Doomsday's full cast totals approximately 180 actors.",
    summary:
      "Empire magazine reported the film's ensemble runs to roughly 180 actors, far beyond the ~31 confirmed by Marvel's own cast-reveal livestream. Marvel has not confirmed an exact total, but Kevin Feige has separately, officially confirmed the production had '30 to 35 actors on set' simultaneously on some filming days — consistent with, though not proof of, the larger estimate.",
    status: 'REPORTED',
    confidence: 'medium',
    firstReportedAt: '2026-08-27',
    lastUpdatedAt: '2026-08-27',
    sources: [
      {
        name: 'Empire (via Yahoo Entertainment)',
        url: 'https://www.yahoo.com/entertainment/movies/articles/avengers-doomsday-cast-seemingly-includes-193023489.html',
        publishedAt: '2026-08-27',
        type: 'MAJOR_OUTLET',
        reliability: 'HIGH',
        author: 'Disita Sikdar',
        summary:
          "Attributed an approximately-180-actor cast estimate to Empire magazine, noting Marvel Studios remained tight-lipped on an official number beyond the 31 actors confirmed on its own site.",
        role: 'FIRST_REPORT',
      },
      {
        name: 'Fandango (Kevin Feige interview, via ScreenRant)',
        url: 'https://screenrant.com/avengers-doomsday-cast-ensemble-thirty-actors/',
        publishedAt: '2026-04-19',
        type: 'OFFICIAL',
        reliability: 'HIGH',
        author: 'Allison Hambrick',
        summary:
          "Kevin Feige told Fandango on the record: 'There are days [when] there are 30 [to] 35 actors on set,' describing the scale of the production — supports the plausibility of a large ensemble without confirming an exact total.",
        role: 'CONTEXT',
      },
    ],
  },
  {
    id: 'rumor-benedict-cumberbatch-doctor-strange-role',
    slug: 'benedict-cumberbatch-doctor-strange-role',
    title: "Benedict Cumberbatch's Doctor Strange Role",
    claim: 'Benedict Cumberbatch appears in Avengers: Doomsday, possibly as a variant of Doctor Strange.',
    summary:
      "Cumberbatch has given directly conflicting on-record statements about his own involvement over more than a year — first saying Doctor Strange 'doesn't align with this part of the story' and sits the film out, then saying he 'got it wrong' and is in it, while also joking 'don't ever believe anything I say.' An unverified social-media cast-list leak later claimed a Doctor Strange-variant role. Marvel has not confirmed his involvement in Doomsday either way.",
    status: 'DISPUTED',
    confidence: 'low',
    firstReportedAt: '2025-01-22',
    lastUpdatedAt: '2026-01-29',
    sources: [
      {
        name: 'Variety (via MovieWeb)',
        url: 'https://movieweb.com/is-doctor-strange-in-avengers-doomsday-answered/',
        publishedAt: '2025-01-22',
        type: 'INTERVIEW',
        reliability: 'HIGH',
        author: 'Richard Fink',
        summary:
          "Cumberbatch told Variety Doctor Strange 'does not align with this part of the story' and would sit out Doomsday, with a larger role expected in Secret Wars.",
        role: 'CONTRADICTION',
      },
      {
        name: 'ComicBook.com',
        url: 'https://comicbook.com/movies/news/marvel-avengers-doomsday-casts-benedict-cumberbatch-doctor-strange-secret-wars/',
        publishedAt: '2025-01-29',
        type: 'INTERVIEW',
        reliability: 'MEDIUM',
        author: 'Cameron Bonomolo',
        summary:
          "Cited a Business Insider interview in which Cumberbatch reversed himself just days later: 'I got that wrong. I am in the next one,' while cautioning 'Don't ever believe anything I say.'",
        role: 'CORROBORATION',
      },
      {
        name: 'Collider',
        url: 'https://collider.com/avengers-doomsday-benedict-cumberbatch-doctor-strange-casting-reaction/',
        publishedAt: '2025-09-04',
        type: 'INTERVIEW',
        reliability: 'LOW',
        author: 'Shrishty Mishra',
        summary:
          "In a Brazilian Omelete interview, Cumberbatch responded 'That's exactly it... Call him!' when asked if Kevin Feige was keeping his involvement secret — read by the outlet as playful deflection rather than confirmation.",
        role: 'CORROBORATION',
      },
      {
        name: 'Yahoo Entertainment',
        url: 'https://www.yahoo.com/entertainment/movies/articles/benedict-cumberbatch-avengers-doomsday-role-132923123.html',
        publishedAt: '2026-01-29',
        type: 'SOCIAL',
        reliability: 'LOW',
        author: 'Abdul Azim Naushad',
        summary:
          "Reported a claim from self-described 'internet scooper' MyTimetoShineHello, who posted an updated cast list on X saying Cumberbatch plays a Doctor Strange variant described as 'Doom's wizard sidekick.'",
        role: 'CORROBORATION',
      },
    ],
  },
  {
    id: 'rumor-x-men-avengers-death-toll',
    slug: 'x-men-avengers-death-toll',
    title: 'The X-Men and Avengers Death Toll',
    claim: 'Three X-Men characters and two Avengers die in Avengers: Doomsday.',
    summary:
      "A self-described insider claimed on social media that three X-Men and two Avengers die in the film, with only deaths from the climactic Incursion collision (not other on-screen deaths) reversible in Secret Wars. This is a single, unverifiable social-media claim with no independent corroboration and no official statement either way.",
    status: 'UNVERIFIED',
    confidence: 'low',
    firstReportedAt: '2026-09-08',
    lastUpdatedAt: '2026-09-08',
    notes:
      "Specific character names circulating alongside this claim (e.g. which X-Men or Avengers) are fan speculation layered on top of the insider's vaguer numeric claim, not something the source itself specified — deliberately not repeated here as fact, and no relatedCharacterSlugs are attached to this entry to avoid fabricating specificity the source didn't provide.",
    sources: [
      {
        name: 'Yahoo Entertainment',
        url: 'https://www.yahoo.com/entertainment/movies/articles/avengers-doomsday-rumor-offers-strong-154225570.html',
        publishedAt: '2026-09-08',
        type: 'SOCIAL',
        reliability: 'LOW',
        author: 'Christie D’Silva',
        summary:
          "Reported a claim from a self-described insider ('James Mack') on X that '3 X-Men and 2 Avengers' die in the film, with only deaths from the final Incursion collision reversed in Secret Wars; the outlet explicitly labeled this rumor and conjecture.",
        role: 'FIRST_REPORT',
      },
    ],
  },
]
