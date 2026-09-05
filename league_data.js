// CSX Fall Men 40+ IV 2026 - Official League Data
const LEAGUE_INFO = {
    name: "CSX Fall Men 40+ IV 2026",
    division: "8 v 8 - Adult Soccer (Men's Over 40)",
    facility: "Capelli Sport Complex, Tinton Falls, NJ",
    ezfacility_url: "https://gaacomplextintonfalls.ezleagues.ezfacility.com/leagues/480009/CSX-Fall-Men-40-IV-2026.aspx"
};

const STANDINGS_DATA = [
    { rank: 1, team: "ELLAS", gp: 1, w: 1, l: 0, t: 0, gf: 5, ga: 0, pts: 3, gd: 5, isClub: false },
    { rank: 2, team: "FC JUVENTUS 40+", gp: 1, w: 1, l: 0, t: 0, gf: 4, ga: 3, pts: 3, gd: 1, isClub: false },
    { rank: 3, team: "OUT OF SHAPE ALL STARS", gp: 1, w: 1, l: 0, t: 0, gf: 3, ga: 2, pts: 3, gd: 1, isClub: false },
    { rank: 4, team: "CASUAL WRECKS", gp: 1, w: 0, l: 1, t: 0, gf: 3, ga: 4, pts: 0, gd: -1, isClub: false },
    { rank: 5, team: "STRANGERS UNITED", gp: 1, w: 0, l: 1, t: 0, gf: 2, ga: 3, pts: 0, gd: -1, isClub: true },
    { rank: 6, team: "OCEAN ALUMNI FC", gp: 1, w: 0, l: 1, t: 0, gf: 0, ga: 5, pts: 0, gd: -5, isClub: false }
];

const MATCHES_DATA = [
    {
        id: 1,
        date: "Thu, Sep 3",
        time: "9:00 PM",
        home: "STRANGERS UNITED",
        away: "OUT OF SHAPE ALL STARS",
        score: "2 - 3",
        status: "Completed",
        venue: "Wayside 4AB",
        isClubMatch: true,
        result: "L"
    },
    {
        id: 2,
        date: "Thu, Sep 10",
        time: "9:00 PM",
        home: "STRANGERS UNITED",
        away: "ELLAS",
        score: "vs",
        status: "Upcoming",
        venue: "Wayside 4AB",
        isClubMatch: true,
        result: "Upcoming"
    },
    {
        id: 3,
        date: "Thu, Sep 17",
        time: "10:00 PM",
        home: "STRANGERS UNITED",
        away: "FC JUVENTUS 40+",
        score: "vs",
        status: "Upcoming",
        venue: "Wayside 4AB",
        isClubMatch: true,
        result: "Upcoming"
    },
    {
        id: 4,
        date: "Thu, Sep 24",
        time: "8:00 PM",
        home: "STRANGERS UNITED",
        away: "CASUAL WRECKS",
        score: "vs",
        status: "Upcoming",
        venue: "Wayside 4AB",
        isClubMatch: true,
        result: "Upcoming"
    }
];
