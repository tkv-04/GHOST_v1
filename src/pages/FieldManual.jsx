/**
 * TRACE: Ghost Protocol — Field Manual
 * 
 * Rules, ethical OSINT practices, and how-to guide.
 */

import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const SECTIONS = [
  {
    id: 'overview',
    icon: '📋',
    title: 'Mission Overview',
    content: `TRACE: Ghost Protocol is an Open Source Intelligence (OSINT) Capture The Flag (CTF) challenge. Your objective is to trace the digital breadcrumbs left by an unknown operator called GHOST across the public internet.

You will use real search engines, public websites, code repositories, web archives, image analysis tools, and geolocation techniques to solve seven interconnected missions.

Each mission is assigned to a handler — a fictional character who provides your briefing and clues. Missions build on each other: evidence discovered in early missions is required to solve later ones.

The campaign culminates in a final meta-challenge that combines all your discoveries.`,
  },
  {
    id: 'rules',
    icon: '⚖️',
    title: 'Rules of Engagement',
    content: `1. USE ONLY PUBLIC INFORMATION — All answers can be found through publicly accessible websites, search engines, and tools. No hacking, unauthorized access, or scanning is required or permitted.

2. CITE YOUR SOURCES — When submitting a flag, you should be able to explain where you found the information and why it's credible. Search engine snippets alone are not sufficient proof.

3. NO BRUTEFORCING — Do not attempt to guess flags through automated submissions. Each incorrect attempt is logged. Use investigation, not automation.

4. HINTS COST POINTS — Each hint reduces your potential score for that mission. Use them strategically.

5. PREREQUISITES MUST BE MET — Some missions require evidence from earlier missions. You cannot skip ahead without completing the required predecessors.

6. EVIDENCE LOCKER — Save important discoveries in your Evidence Locker with notes explaining their significance. This builds your case file for the final report.

7. WRITE YOUR METHODOLOGY — Document how you found each answer. Good OSINT isn't just about the answer — it's about the reproducible process.`,
  },
  {
    id: 'osint-guide',
    icon: '🔍',
    title: 'OSINT Techniques Guide',
    content: `SEARCH OPERATORS
• "exact phrase" — Search for an exact phrase
• site:example.com — Search within a specific website  
• filetype:pdf — Search for specific file types
• intitle:"keyword" — Search page titles
• inurl:"keyword" — Search within URLs
• -exclude — Remove results containing a word
• cache:url — View Google's cached version

CODE REPOSITORY ANALYSIS
• GitHub, GitLab, Bitbucket host public code
• Check commit history, issues, and contributor profiles
• Look for README files, documentation, and metadata
• Use site:github.com with search operators

WEB ARCHIVES
• The Wayback Machine (web.archive.org) stores historical snapshots
• Use timestamps and URL patterns to find archived pages
• archive.org also hosts books, videos, and audio

IMAGE ANALYSIS
• EXIF data contains camera info, GPS, timestamps, and comments
• Use tools like exif.tools, metadata2go.com, or exiftool
• Reverse image search with Google Images or TinEye
• Look for hidden text, steganography, or metadata fields

GEOLOCATION
• Google Maps, Google Earth, OpenStreetMap
• Cross-reference landmarks, street signs, and terrain
• Check geographical databases and public records
• Wikipedia and GeoNames for landmark identification

PROFILE INVESTIGATION
• Usernames can be searched across platforms
• Check join dates, activity patterns, and public posts
• GitHub profiles show contribution history
• Look for consistent aliases across services`,
  },
  {
    id: 'ethics',
    icon: '🛡️',
    title: 'Ethical Guidelines',
    content: `OSINT is powerful — and with that power comes responsibility.

DO:
✅ Use only publicly available information
✅ Respect privacy and personal boundaries
✅ Credit your sources and document your methodology
✅ Report any genuine security concerns through proper channels
✅ Use OSINT skills for defensive security, journalism, and research

DO NOT:
❌ Access systems without authorization
❌ Attempt to dox or expose private individuals
❌ Use leaked credentials or breached data
❌ Scan networks, ports, or systems without permission
❌ Impersonate real people or organizations
❌ Share personal information discovered during research

REMEMBER:
This challenge uses fictional identities, controlled artifacts, and public resources. All challenges are designed to be solved using ethical techniques. If a challenge seems to require unauthorized access, you're on the wrong path.

"The best intelligence comes from what's already in plain sight."`,
  },
  {
    id: 'scoring',
    icon: '🏆',
    title: 'Scoring System',
    content: `POINT VALUES:
• Easy missions: 100–150 points
• Medium missions: 200–250 points  
• Hard missions: 300–350 points
• Expert missions: 500 points

HINT PENALTIES:
• Hint 1: -10 to -25 points (general direction)
• Hint 2: -25 to -75 points (specific guidance)

TOTAL POSSIBLE SCORE: 1,850 points (all missions, no hints)

SCORING FACTORS:
• Correct flag submission (primary)
• Hint usage (penalty)
• Mission completion order (future: time bonus)
• Write-up quality (future: peer review)

FLAGS:
• Answers are case-insensitive
• Remove leading/trailing spaces
• Follow the format specified in each mission
• Some flags are single words, others are compound codes`,
  },
  {
    id: 'tools',
    icon: '🔧',
    title: 'Recommended Tools',
    content: `SEARCH:
• Google (google.com) — with advanced operators
• DuckDuckGo (duckduckgo.com) — alternative search
• Google Dorks reference (ghdb.exploit-db.com)

CODE ANALYSIS:
• GitHub (github.com) — code search and profiles
• grep.app — search across GitHub repos
• GitLab (gitlab.com) — alternative repository hosting

WEB ARCHIVES:
• Wayback Machine (web.archive.org)
• Google Cache (cache:url)
• archive.today

IMAGE ANALYSIS:
• EXIF Tools (exif.tools)
• Metadata2Go (metadata2go.com)
• Jeffrey's EXIF Viewer (exif.regex.info)
• TinEye (tineye.com) — reverse image search

GEOLOCATION:
• Google Maps (maps.google.com)
• Google Earth (earth.google.com)
• GeoGuessr (geoguessr.com) — practice
• What3Words (what3words.com)

GENERAL OSINT:
• OSINT Framework (osintframework.com)
• IntelTechniques (inteltechniques.com)
• Maltego (maltego.com) — link analysis`,
  },
  {
    id: 'faq',
    icon: '❓',
    title: 'FAQ',
    content: `Q: Is this affiliated with Marvel?
A: No. TRACE: Ghost Protocol is a fan-made educational project. It is not affiliated with, endorsed by, or connected to Marvel Entertainment, Disney, or any related entities. Character names are used under fair use for educational parody purposes.

Q: Do I need to install anything?
A: No special tools are required. All challenges can be solved with a web browser and an internet connection.

Q: Can I work in a team?
A: The current version is designed for individual investigation. Team-based competition will be supported in the multiplayer version.

Q: What if a source goes offline?
A: Each mission includes fallback artifacts and hints. If a live source becomes unavailable, check the mission briefing for alternative approaches.

Q: How do I know my answer is correct?
A: Flags are validated immediately upon submission. Correct answers are marked with a ✅ and the mission status changes to "Completed."

Q: Can I redo a mission?
A: Once a mission is completed, the flag is locked in. Your score includes any hint penalties from that attempt.

Q: Is my progress saved?
A: Yes, progress is saved in your browser's local storage. Clearing browser data will reset your progress. The backend version will persist data server-side.`,
  },
];

export default function FieldManual() {
  const { state } = useGame();
  const [activeSection, setActiveSection] = useState('overview');

  if (!state.isRecruited) return <Navigate to="/" replace />;

  const section = SECTIONS.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-ghost-dark pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ghost-amber animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-ghost-amber uppercase">Reference</span>
          </div>
          <h1 className="text-3xl font-bold text-ghost-text font-mono tracking-tight">Field Manual</h1>
          <p className="text-sm text-ghost-text-muted mt-1">
            Rules, OSINT techniques, ethical guidelines, and scoring reference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="glass rounded-lg p-2 sticky top-20" aria-label="Field manual sections">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full text-left px-3 py-2 rounded font-mono text-xs tracking-wider transition-ghost flex items-center gap-2 ${
                    activeSection === s.id
                      ? 'bg-ghost-amber/10 text-ghost-amber border-l-2 border-ghost-amber'
                      : 'text-ghost-text-muted hover:text-ghost-text hover:bg-ghost-card'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {section && (
              <div className="glass rounded-lg p-6 animate-fadeIn" key={section.id}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="text-xl font-bold text-ghost-text font-mono">{section.title}</h2>
                </div>
                <div className="whitespace-pre-line text-sm text-ghost-text-muted leading-relaxed font-mono">
                  {section.content}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
