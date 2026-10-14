/**
 * TRACE: Ghost Protocol — Mission Data (9 Missions)
 * 
 * Cryptic briefings, indirect hints, question-based flags.
 * Strictly sequential: M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8 → M9
 * 
 * NEW: Mission 4 (Ghost of Tsushima), Mission 7 (Horror Film Ghost)
 */

export const HANDLERS = {
  stark: {
    name: 'Tony Stark',
    codename: 'IRON',
    avatar: '🔴',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  romanoff: {
    name: 'Natasha Romanoff',
    codename: 'WIDOW',
    avatar: '🕷️',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  banner: {
    name: 'Bruce Banner',
    codename: 'HULK',
    avatar: '🟢',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
  },
  rogers: {
    name: 'Steve Rogers',
    codename: 'CAP',
    avatar: '🔵',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  barton: {
    name: 'Clint Barton',
    codename: 'HAWK',
    avatar: '🏹',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  strange: {
    name: 'Doctor Strange',
    codename: 'MYSTIC',
    avatar: '🔮',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
  },
  fury: {
    name: 'Nick Fury',
    codename: 'DIRECTOR',
    avatar: '🛡️',
    color: 'text-ghost-amber',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
};

export const MISSIONS = [
  // ═══════════════════════════════════════════════
  // MISSION 1 — Stark's Breadcrumb
  // ═══════════════════════════════════════════════
  {
    id: 'mission-1',
    number: 1,
    title: "Stark's Breadcrumb",
    handler: 'stark',
    category: 'Code Repository Analysis',
    difficulty: 'Easy',
    points: 100,
    prerequisites: [],
    briefing: `Agent, we intercepted a fragment from GHOST's encrypted channel:

"I left the blueprint where builders gather. The heart that keeps the suit alive — its name is the key. Find it in the open forge."

GHOST is pointing us toward something hidden in plain sight. A project. A codename. Something publicly accessible that the world overlooked.

Your mission: decode this message and report what you find.`,
    question: "What is the name of the device that powers Iron Man's suit? Find a public project with this exact name on the platform where developers share code. Submit the project name as your flag.",
    hints: [
      {
        text: "Think about the glowing circular device embedded in Tony Stark's chest.",
        penalty: 10,
      },
      {
        text: "It's two words joined by a hyphen. One word describes a curve, the other describes a nuclear device.",
        penalty: 25,
      },
    ],
    answerFormat: 'two-words-with-hyphen',
    discoveredClues: [
      {
        id: 'clue-codename',
        label: 'Project Codename',
        description: 'The codename discovered from the public forge',
        usedIn: ['mission-5', 'mission-9'],
      },
    ],
    evidenceRequired: [],
    connectionToNext: "Hold onto this codename. You'll need it later in the investigation.",
  },

  // ═══════════════════════════════════════════════
  // MISSION 2 — Romanoff's Contact
  // ═══════════════════════════════════════════════
  {
    id: 'mission-2',
    number: 2,
    title: "Romanoff's Contact",
    handler: 'romanoff',
    category: 'Profile Investigation',
    difficulty: 'Easy',
    points: 150,
    prerequisites: ['mission-1'],
    briefing: `Agent, Romanoff traced a digital phantom — someone who exists on the world's largest coding platform but has no face, no repositories, no activity.

"Every platform has its shadows. When a user vanishes, their footprints don't disappear — they get inherited by someone. Find the name of the one who inherits the abandoned."

This entity is real. It exists right now. It's not hidden — it's just overlooked. Investigate.`,
    question: "On the world's largest code hosting platform, there is a special account that takes ownership of contributions when a user deletes their profile. What is the username of this phantom account?",
    hints: [
      {
        text: "When someone deletes their account on this platform, their commits and issues don't vanish. They get reassigned to a placeholder identity.",
        penalty: 10,
      },
      {
        text: "Try visiting the profile of the 'invisible user' — the one whose name matches the very entity we're investigating in this entire operation.",
        penalty: 25,
      },
    ],
    answerFormat: 'single-word-username',
    discoveredClues: [
      {
        id: 'clue-alias',
        label: 'Phantom Alias',
        description: 'The username of the phantom account on the coding platform',
        usedIn: ['mission-6', 'mission-9'],
      },
    ],
    evidenceRequired: [],
    connectionToNext: "Remember this alias. It will help you narrow down a location later.",
  },

  // ═══════════════════════════════════════════════
  // MISSION 3 — Banner's Anomaly
  // ═══════════════════════════════════════════════
  {
    id: 'mission-3',
    number: 3,
    title: "Banner's Anomaly",
    handler: 'banner',
    category: 'Image & Metadata Analysis',
    difficulty: 'Medium',
    points: 200,
    prerequisites: ['mission-2'],
    briefing: `Agent, Dr. Banner detected something unusual in an image GHOST transmitted. On the surface, it appears to be an ordinary photograph — but Banner insists there's more than meets the eye.

"Every photograph carries invisible cargo — information the camera recorded automatically. The naked eye won't help you here. You need to look at what's written in the margins of the file itself."

The keyword is buried in the invisible layer. Extract it.`,
    question: "Photographs contain hidden data called metadata — information like camera model, GPS coordinates, and timestamps that the camera embeds automatically. What type of radiation is associated with Dr. Banner's alter ego? This is the keyword GHOST embedded in the image's hidden layer.",
    hints: [
      {
        text: "What type of radiation exposure caused Bruce Banner's transformation? Think Greek alphabet.",
        penalty: 15,
      },
      {
        text: "The third letter of the Greek alphabet. It's also a type of ray used in nuclear physics.",
        penalty: 35,
      },
    ],
    answerFormat: 'single-keyword',
    discoveredClues: [
      {
        id: 'clue-keyword',
        label: 'Anomaly Keyword',
        description: 'The keyword extracted from the hidden data layer',
        usedIn: ['mission-8', 'mission-9'],
      },
    ],
    evidenceRequired: [],
    connectionToNext: 'This keyword will be combined with another discovery to identify an operation.',
  },

  // ═══════════════════════════════════════════════
  // MISSION 4 — The Samurai's Shadow (Ghost of Tsushima)
  // ═══════════════════════════════════════════════
  {
    id: 'mission-4',
    number: 4,
    title: "The Samurai's Shadow",
    handler: 'rogers',
    category: 'Cultural OSINT',
    difficulty: 'Medium',
    points: 200,
    prerequisites: ['mission-3'],
    briefing: `Agent, Steve Rogers uncovered another layer. GHOST's trail doesn't just span the digital world — it reaches into history and culture.

"A warrior who became a ghost — not in death, but in defiance. He abandoned the way of the samurai to fight an impossible invasion. His story was told through a screen, but the island he defended is real. It was the first to fall when the storm came from the west."

GHOST is referencing something that blends history with modern storytelling. The answer lies where fiction meets the real world.`,
    question: "In 2020, a critically acclaimed video game told the story of a samurai who becomes 'The Ghost' to defend his homeland against Mongol invaders. The game's title references a real Japanese island that was historically invaded in 1274. What is the name of this island?",
    hints: [
      {
        text: "The game was developed by Sucker Punch Productions and is a PlayStation exclusive. Its title is 'Ghost of ______'.",
        penalty: 15,
      },
      {
        text: "The island sits in the strait between Japan and Korea. It was the first target of Kublai Khan's invasion fleet. The game's full title ends with this island's name.",
        penalty: 35,
      },
    ],
    answerFormat: 'single-word-island-name',
    discoveredClues: [
      {
        id: 'clue-island',
        label: 'Warrior Island',
        description: 'The real island from the ghost warrior story',
        usedIn: ['mission-9'],
      },
    ],
    evidenceRequired: [],
    connectionToNext: "The island's name is part of the final protocol code.",
  },

  // ═══════════════════════════════════════════════
  // MISSION 5 — The Winter Archive
  // ═══════════════════════════════════════════════
  {
    id: 'mission-5',
    number: 5,
    title: 'The Winter Archive',
    handler: 'rogers',
    category: 'Web Archive Research',
    difficulty: 'Medium',
    points: 250,
    prerequisites: ['mission-4'],
    briefing: `Agent, Rogers has another lead. He believes GHOST preserved critical evidence on a platform that remembers what the rest of the internet forgets.

"The internet has a memory longer than any of us. Even when pages are taken down, erased, or modified — there's a machine that never stops recording. It's been archiving the web since 1996."

GHOST used this machine to preserve evidence. Find its name.`,
    question: "There is a nonprofit digital library that has been archiving the entire World Wide Web since 1996. You can use it to view old versions of any website — snapshots frozen in time. What is the name of this time-traveling machine? (Use the codename from Mission 1 to search it and verify.)",
    hints: [
      {
        text: "It's named after a concept from science fiction — a device that lets you travel through time. The service lives at web.archive.org.",
        penalty: 15,
      },
      {
        text: "H.G. Wells wrote about a 'Time Machine.' This web archival service is called the '______ Machine.'",
        penalty: 35,
      },
    ],
    answerFormat: 'single-word',
    discoveredClues: [
      {
        id: 'clue-archive-ref',
        label: 'Archive Machine',
        description: 'The name of the web archiving service GHOST used',
        usedIn: ['mission-9'],
      },
    ],
    evidenceRequired: [
      {
        fromMission: 'mission-1',
        clueId: 'clue-codename',
        description: 'Use the project codename from Mission 1 to verify the archiving service.',
      },
    ],
    connectionToNext: 'The archive name is one piece of the final protocol code.',
  },

  // ═══════════════════════════════════════════════
  // MISSION 6 — Hawkeye's Long Shot
  // ═══════════════════════════════════════════════
  {
    id: 'mission-6',
    number: 6,
    title: "Hawkeye's Long Shot",
    handler: 'barton',
    category: 'Geolocation',
    difficulty: 'Hard',
    points: 300,
    prerequisites: ['mission-5'],
    briefing: `Agent, Clint Barton intercepted coordinates from GHOST's transmission, but they point to a place that no longer has living residents. It's frozen in time — abandoned but perfectly preserved.

"A town where time stopped. The residents left, but the buildings stayed. It's famous for being the best-preserved example of its kind in the American West. The government declared it a landmark."

Use the alias from Mission 2 to narrow your search. What kind of settlement matches both clues — the phantom alias AND an abandoned place?`,
    question: "There is a famous abandoned settlement in California's Mono County that is a National Historic Landmark and one of the best-preserved places of its kind in the American West. What is its name? (The type of settlement matches the phantom alias you discovered in Mission 2.)",
    hints: [
      {
        text: "The phantom alias from Mission 2 describes a type of town — one where everyone has left. California has a famous one that's now a State Historic Park.",
        penalty: 20,
      },
      {
        text: "This California town starts with the letter 'B' and was a gold mining town in the 1800s. It's in the Eastern Sierra Nevada mountains.",
        penalty: 45,
      },
    ],
    answerFormat: 'single-word-location-name',
    discoveredClues: [
      {
        id: 'clue-location',
        label: 'Location Code',
        description: 'The name of the abandoned landmark settlement',
        usedIn: ['mission-8', 'mission-9'],
      },
    ],
    evidenceRequired: [
      {
        fromMission: 'mission-2',
        clueId: 'clue-alias',
        description: 'The phantom alias helps identify the type of settlement.',
      },
    ],
    connectionToNext: 'Combine this location with the keyword from Mission 3.',
  },

  // ═══════════════════════════════════════════════
  // MISSION 7 — The Haunting Signal (Horror Film Ghost)
  // ═══════════════════════════════════════════════
  {
    id: 'mission-7',
    number: 7,
    title: 'The Haunting Signal',
    handler: 'strange',
    category: 'Media & Film OSINT',
    difficulty: 'Medium',
    points: 250,
    prerequisites: ['mission-6'],
    briefing: `Agent, Doctor Strange intercepted a disturbing transmission from GHOST. It's not digital data — it's something more primal. A reference to a story about vengeance and cursed media.

"Seven days. That's how long you have after watching it. The signal comes through the screen, and so does she. A girl. A well. A curse passed from viewer to viewer. She never stops."

GHOST is referencing a cultural phenomenon — a horror story that terrified the world. The spirit's identity is your next key.`,
    question: "In a famous 2002 horror film, a journalist investigates a mysterious videotape that kills anyone who watches it within seven days. A vengeful spirit with long dark hair crawls out of a television screen. What is the first name of this ghost?",
    hints: [
      {
        text: "The film is a Hollywood remake of a 1998 Japanese horror movie called 'Ringu.' The ghost is a young girl who was thrown into a well.",
        penalty: 15,
      },
      {
        text: "Her name starts with 'S' and ends with 'a.' Her last name is Morgan. She was played by Daveigh Chase in the 2002 film.",
        penalty: 40,
      },
    ],
    answerFormat: 'single-first-name',
    discoveredClues: [
      {
        id: 'clue-spirit',
        label: 'Spirit Name',
        description: 'The name of the vengeful ghost from the horror film',
        usedIn: ['mission-9'],
      },
    ],
    evidenceRequired: [],
    connectionToNext: "The spirit's name is another piece of the final protocol code.",
  },

  // ═══════════════════════════════════════════════
  // MISSION 8 — Strange Connections
  // ═══════════════════════════════════════════════
  {
    id: 'mission-8',
    number: 8,
    title: 'Strange Connections',
    handler: 'strange',
    category: 'Cross-Reference Analysis',
    difficulty: 'Hard',
    points: 350,
    prerequisites: ['mission-7'],
    briefing: `Agent, Doctor Strange has identified a pattern. Two pieces of evidence from your investigation are connected — and GHOST combined them to name a classified operation.

"In intelligence work, we call it 'pivoting' — taking two unrelated data points and finding the thread that connects them. GHOST's operation name is a direct combination of two things you've already discovered."

Review your Evidence Locker. Combine the keyword from Mission 3 with the location from Mission 6 to reconstruct the operation name.`,
    question: "GHOST named their operation by combining two of your previous discoveries. Take the keyword from Mission 3 and the location name from Mission 6, join them with a hyphen, and submit the operation name.",
    hints: [
      {
        text: "The format is: [keyword]-[location]. Both values should be in your Evidence Locker from earlier missions.",
        penalty: 20,
      },
      {
        text: "Combine the Greek radiation type with the California town name. Lowercase, joined by a hyphen.",
        penalty: 50,
      },
    ],
    answerFormat: 'keyword-hyphen-location',
    discoveredClues: [
      {
        id: 'clue-operation',
        label: 'Operation Name',
        description: 'The identified operation GHOST was conducting',
        usedIn: ['mission-9'],
      },
    ],
    evidenceRequired: [
      {
        fromMission: 'mission-3',
        clueId: 'clue-keyword',
        description: 'The keyword from the metadata analysis.',
      },
      {
        fromMission: 'mission-6',
        clueId: 'clue-location',
        description: 'The location name from the geolocation challenge.',
      },
    ],
    connectionToNext: 'The operation name is the final piece before the Ghost Protocol.',
  },

  // ═══════════════════════════════════════════════
  // MISSION 9 — The Ghost Protocol (Final Meta)
  // ═══════════════════════════════════════════════
  {
    id: 'mission-9',
    number: 9,
    title: 'The Ghost Protocol',
    handler: 'fury',
    category: 'Meta-Challenge',
    difficulty: 'Expert',
    points: 500,
    prerequisites: ['mission-8'],
    briefing: `Agent, this is Director Fury. Everything you've uncovered across eight missions leads to this moment.

GHOST left a trail on purpose. Every breadcrumb, every phantom, every hidden keyword, every warrior island, every archived page, every abandoned town, every vengeful spirit, every operation — they all connect to one final truth.

"The truth was never deleted. You just stopped looking."

Now you understand. GHOST wasn't hiding — GHOST was waiting for someone skilled enough to follow the entire trail. Your final task: combine ALL of your evidence into the Ghost Protocol code.

Open your Evidence Locker. You need seven discoveries — one from each critical mission. Assemble them in order.`,
    question: "Construct the Ghost Protocol code by combining ALL seven key discoveries from your investigation. The format is:\n\n[M1]-[M2]-[M3]-[M4]-[M5]-[M6]-[M7]\n\nThat's: codename, alias, keyword, island, archive, location, spirit.\n\nAll lowercase, separated by hyphens. Check your Evidence Locker for the exact values.",
    hints: [
      {
        text: "You need exactly seven values from missions 1 through 7. The order matters: codename, alias, keyword, island, archive, location, spirit.",
        penalty: 25,
      },
      {
        text: "The format is: [device]-[phantom-user]-[radiation]-[japanese-island]-[time-machine]-[california-town]-[horror-ghost]. All one string, hyphens between each.",
        penalty: 75,
      },
    ],
    answerFormat: 'seven-values-joined-by-hyphens',
    discoveredClues: [
      {
        id: 'clue-protocol',
        label: 'Ghost Protocol',
        description: 'The final protocol code combining all evidence',
        usedIn: [],
      },
    ],
    evidenceRequired: [
      {
        fromMission: 'mission-1',
        clueId: 'clue-codename',
        description: "The project codename from Stark's Breadcrumb.",
      },
      {
        fromMission: 'mission-2',
        clueId: 'clue-alias',
        description: "The phantom alias from Romanoff's investigation.",
      },
      {
        fromMission: 'mission-3',
        clueId: 'clue-keyword',
        description: "The anomaly keyword from Banner's analysis.",
      },
      {
        fromMission: 'mission-4',
        clueId: 'clue-island',
        description: "The warrior island from The Samurai's Shadow.",
      },
      {
        fromMission: 'mission-5',
        clueId: 'clue-archive-ref',
        description: 'The archive machine from The Winter Archive.',
      },
      {
        fromMission: 'mission-6',
        clueId: 'clue-location',
        description: "The location from Hawkeye's Long Shot.",
      },
      {
        fromMission: 'mission-7',
        clueId: 'clue-spirit',
        description: 'The spirit name from The Haunting Signal.',
      },
    ],
    connectionToNext: null,
    epilogue: `CLASSIFIED — EYES ONLY

Agent, you've completed the Ghost Protocol.

GHOST wasn't an adversary — GHOST was a former analyst who discovered that critical evidence was being suppressed. Unable to report through official channels, GHOST created a trail of breadcrumbs across the public internet, knowing that only a skilled investigator could piece it all together.

The trail spanned code repositories, phantom accounts, hidden metadata, ancient islands, web archives, abandoned towns, horror cinema, and intelligence operations — each one a thread in a web of truth.

"The truth was never deleted. You just stopped looking."

This message wasn't a taunt. It was a plea. GHOST needed someone to prove that open-source intelligence could uncover what others tried to bury.

You've proven that the truth persists — in the digital and the physical, in history and fiction, in the connections between them.

Welcome to the team, Agent.

— Director Fury
S.H.I.E.L.D. OSINT Division

⚠️ DISCLAIMER: This is a fan-made educational project.
It is not affiliated with or endorsed by Marvel Entertainment, Sony Interactive Entertainment, or DreamWorks Pictures.`,
  },
];

export const ANSWER_KEY = {
  'mission-1': 'arc-reactor',
  'mission-2': 'ghost',
  'mission-3': 'gamma',
  'mission-4': 'tsushima',
  'mission-5': 'wayback',
  'mission-6': 'bodie',
  'mission-7': 'samara',
  'mission-8': 'gamma-bodie',
  'mission-9': 'arc-reactor-ghost-gamma-tsushima-wayback-bodie-samara',
};

export const DIFFICULTY_COLORS = {
  'Easy': 'text-green-400 bg-green-500/10 border-green-500/30',
  'Medium': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  'Hard': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'Expert': 'text-red-400 bg-red-500/10 border-red-500/30',
};

export const CATEGORY_ICONS = {
  'Code Repository Analysis': '💻',
  'Profile Investigation': '🕵️',
  'Image & Metadata Analysis': '📸',
  'Cultural OSINT': '⛩️',
  'Web Archive Research': '📚',
  'Geolocation': '📍',
  'Media & Film OSINT': '🎬',
  'Cross-Reference Analysis': '🔗',
  'Meta-Challenge': '🏆',
};
