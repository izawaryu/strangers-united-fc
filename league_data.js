// CSX Summer Men 40+ Champions IV 2026 - Official League Data
const LEAGUE_INFO = {
    name: "CSX Summer Men 40+ Champions IV 2026",
    division: "8 v 8 - Adult Soccer (Men's Over 40)",
    facility: "Capelli Sport Complex, Tinton Falls, NJ",
    ezfacility_url: "https://gaacomplextintonfalls.ezleagues.ezfacility.com/leagues/478430/CSX-Summer-Men-40-Champions-IV-2026.aspx"
};

const STANDINGS_DATA = [
    { rank: 1, team: "OCEAN ALUMNI FC", gp: 7, w: 5, l: 0, t: 2, gf: 44, ga: 21, pts: 17, gd: 23, isClub: false },
    { rank: 2, team: "PUEBLA FC", gp: 7, w: 5, l: 2, t: 0, gf: 46, ga: 33, pts: 15, gd: 13, isClub: false },
    { rank: 3, team: "OUT OF SHAPE ALL STARS", gp: 7, w: 3, l: 4, t: 0, gf: 36, ga: 36, pts: 9, gd: 0, isClub: false },
    { rank: 4, team: "CASUAL WRECKS", gp: 7, w: 2, l: 4, t: 1, gf: 41, ga: 47, pts: 7, gd: -6, isClub: false },
    { rank: 5, team: "STRANGERS UNITED", gp: 7, w: 2, l: 4, t: 1, gf: 18, ga: 27, pts: 7, gd: -9, isClub: true },
    { rank: 6, team: "UNDRAFTED FC", gp: 7, w: 2, l: 5, t: 0, gf: 31, ga: 52, pts: 6, gd: -21, isClub: false }
];

const MATCHES_DATA = [
    {
        id: 1,
        date: "Thu, Jun 25",
        home: "STRANGERS UNITED",
        away: "OUT OF SHAPE ALL STARS",
        score: "1 - 0",
        status: "Completed",
        venue: "Wayside 4CD",
        isClubMatch: true,
        result: "W"
    },
    {
        id: 2,
        date: "Thu, Jul 2",
        home: "STRANGERS UNITED",
        away: "UNDRAFTED FC",
        score: "3 - 0",
        status: "Completed",
        venue: "Wayside 1AB",
        isClubMatch: true,
        result: "W"
    },
    {
        id: 3,
        date: "Thu, Jul 9",
        home: "STRANGERS UNITED",
        away: "PUEBLA FC",
        score: "3 - 8",
        status: "Completed",
        venue: "Wayside 6CD",
        isClubMatch: true,
        result: "L"
    },
    {
        id: 4,
        date: "Thu, Jul 16",
        home: "STRANGERS UNITED",
        away: "CASUAL WRECKS",
        score: "3 - 6",
        status: "Completed",
        venue: "Indoor 2AB",
        isClubMatch: true,
        result: "L"
    },
    {
        id: 5,
        date: "Thu, Jul 23",
        home: "OCEAN ALUMNI FC",
        away: "STRANGERS UNITED",
        score: "3 - 3",
        status: "Completed",
        venue: "Wayside 5AB",
        isClubMatch: true,
        result: "D"
    },
    {
        id: 6,
        date: "Thu, Jul 30",
        home: "OUT OF SHAPE ALL STARS",
        away: "STRANGERS UNITED",
        score: "4 - 3",
        status: "Completed",
        venue: "Wayside 6CD",
        isClubMatch: true,
        result: "L"
    },
    {
        id: 7,
        date: "Thu, Aug 6",
        home: "UNDRAFTED FC",
        away: "STRANGERS UNITED",
        score: "6 - 2",
        status: "Completed",
        venue: "Wayside 6AB",
        isClubMatch: true,
        result: "L"
    },
    {
        id: 8,
        date: "Thu, Aug 13",
        time: "8:00 PM",
        home: "PUEBLA FC",
        away: "STRANGERS UNITED",
        score: "vs",
        status: "Upcoming",
        venue: "Wayside 6AB",
        isClubMatch: true,
        result: "Upcoming"
    },
    {
        id: 9,
        date: "Thu, Aug 20",
        time: "8:00 PM / 9:00 PM",
        home: "TBD (Playoffs)",
        away: "TBD (Playoffs)",
        score: "vs",
        status: "Upcoming",
        venue: "Wayside 6CD / 6AB",
        isClubMatch: true,
        result: "Upcoming"
    },
    {
        id: 10,
        date: "Thu, Aug 27",
        time: "9:00 PM",
        home: "TBD (Championship)",
        away: "TBD (Championship)",
        score: "vs",
        status: "Upcoming",
        venue: "Wayside 6AB",
        isClubMatch: true,
        result: "Upcoming"
    }
];
