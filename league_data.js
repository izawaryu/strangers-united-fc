// CSX Summer Men 40+ Champions IV 2026 - Official League Data
const LEAGUE_INFO = {
    name: "CSX Summer Men 40+ Champions IV 2026",
    division: "8 v 8 - Adult Soccer (Men's Over 40)",
    facility: "Capelli Sport Complex, Tinton Falls, NJ",
    ezfacility_url: "https://gaacomplextintonfalls.ezleagues.ezfacility.com/leagues/478430/CSX-Summer-Men-40-Champions-IV-2026.aspx"
};

const STANDINGS_DATA = [
    { rank: 1, team: "PUEBLA FC", gp: 9, w: 8, l: 1, t: 0, gf: 60, ga: 31, pts: 24, gd: 29, isClub: false },
    { rank: 2, team: "OCEAN ALUMNI FC", gp: 8, w: 5, l: 1, t: 2, gf: 48, ga: 27, pts: 17, gd: 21, isClub: false },
    { rank: 3, team: "OUT OF SHAPE ALL STARS", gp: 9, w: 4, l: 5, t: 0, gf: 45, ga: 44, pts: 12, gd: 1, isClub: false },
    { rank: 4, team: "CASUAL WRECKS", gp: 8, w: 2, l: 5, t: 1, gf: 42, ga: 49, pts: 7, gd: -7, isClub: false },
    { rank: 5, team: "STRANGERS UNITED", gp: 8, w: 2, l: 5, t: 1, gf: 20, ga: 30, pts: 7, gd: -10, isClub: true },
    { rank: 6, team: "UNDRAFTED FC", gp: 8, w: 2, l: 6, t: 0, gf: 26, ga: 60, pts: 6, gd: -34, isClub: false }
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
        score: "3 - 2",
        status: "Completed",
        venue: "Wayside 3AB",
        isClubMatch: true,
        result: "L"
    },
    {
        id: 9,
        date: "Thu, Aug 20",
        time: "8:00 PM / 9:00 PM",
        home: "PUEBLA FC",
        away: "CASUAL WRECKS",
        score: "10 - 6",
        status: "Completed",
        venue: "Indoor 3AB (Playoffs)",
        isClubMatch: false,
        result: "Completed"
    },
    {
        id: 10,
        date: "Thu, Aug 27",
        time: "9:00 PM",
        home: "PUEBLA FC",
        away: "OUT OF SHAPE ALL STARS",
        score: "4 - 3",
        status: "Completed",
        venue: "Indoor 3AB (Championship)",
        isClubMatch: false,
        result: "Completed"
    }
];
