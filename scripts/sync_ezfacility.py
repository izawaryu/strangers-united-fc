import urllib.request
import re
import os
import json

URL = "https://gaacomplextintonfalls.ezleagues.ezfacility.com/leagues/480009/CSX-Fall-Men-40-IV-2026.aspx"
LEAGUE_DATA_PATH = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "league_data.js"))

def fetch_html():
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def parse_standings(html):
    standings = []
    table_match = re.search(r'<table[^>]*id="gvStandings"[^>]*>(.*?)</table>', html, re.DOTALL)
    if not table_match:
        return standings
    
    rows = table_match.group(1).split('</tr>')
    
    rank = 1
    for row in rows:
        team_match = re.search(r'data-th="Team"[^>]*>.*?<a[^>]*>(.*?)</a>', row, re.DOTALL)
        gp_match = re.search(r'data-th="GP"[^>]*>\s*(\d+)\s*<', row, re.DOTALL)
        w_match = re.search(r'data-th="W"[^>]*>.*?(\d+)', row, re.DOTALL)
        l_match = re.search(r'data-th="L"[^>]*>.*?(\d+)', row, re.DOTALL)
        t_match = re.search(r'data-th="T"[^>]*>.*?(\d+)', row, re.DOTALL)
        gf_match = re.search(r'data-th="GF"[^>]*>\s*(\d+)\s*<', row, re.DOTALL)
        ga_match = re.search(r'data-th="GA"[^>]*>\s*(\d+)\s*<', row, re.DOTALL)
        pts_match = re.search(r'data-th="PTS"[^>]*>\s*(\d+)\s*<', row, re.DOTALL)
        gd_match = re.search(r'data-th="GD"[^>]*>\s*([-\d]+)\s*<', row, re.DOTALL)
        
        if team_match and gp_match:
            team_name = team_match.group(1).strip()
            standings.append({
                "rank": rank,
                "team": team_name,
                "gp": int(gp_match.group(1)),
                "w": int(w_match.group(1)) if w_match else 0,
                "l": int(l_match.group(1)) if l_match else 0,
                "t": int(t_match.group(1)) if t_match else 0,
                "gf": int(gf_match.group(1)) if gf_match else 0,
                "ga": int(ga_match.group(1)) if ga_match else 0,
                "pts": int(pts_match.group(1)) if pts_match else 0,
                "gd": int(gd_match.group(1)) if gd_match else 0,
                "isClub": "STRANGERS UNITED" in team_name
            })
            rank += 1
    return standings

def parse_matches(html):
    matches = []
    table_match = re.search(r'<table[^>]*id="ctl00_c_Schedule1_GridView1"[^>]*>(.*?)</table>', html, re.DOTALL)
    if not table_match:
        return matches
    
    rows = table_match.group(1).split('</tr>')
    
    match_id = 1
    for row in rows:
        home_match = re.search(r'data-th="Home"[^>]*>.*?<a[^>]*>(.*?)</a>', row, re.DOTALL)
        away_match = re.search(r'data-th="Away"[^>]*>.*?<a[^>]*>(.*?)</a>', row, re.DOTALL)
        date_match = re.search(r'data-th="Date"[^>]*>.*?<a[^>]*>(.*?)</a>', row, re.DOTALL)
        score_match = re.search(r'class="schedule-versus-column"[^>]*>[\s\S]*?<span[^>]*>(.*?)</span>', row, re.DOTALL)
        status_match = re.search(r'data-th="Time/Status"[^>]*>.*?<a[^>]*>(.*?)</a>', row, re.DOTALL)
        venue_match = re.search(r'data-th="Venue"[^>]*>.*?<a[^>]*>(.*?)</a>', row, re.DOTALL)
        
        if home_match and away_match:
            home = home_match.group(1).strip()
            away = away_match.group(1).strip()
            date_raw = date_match.group(1).strip() if date_match else "Upcoming"
            date_fmt = date_raw.replace("-", ", ") if "-" in date_raw else date_raw
            
            score_raw = score_match.group(1).replace('&nbsp;', ' ').strip() if score_match else "vs"
            status_raw = status_match.group(1).replace('&nbsp;', ' ').strip() if status_match else ""
            venue_raw = venue_match.group(1).replace('&nbsp;', ' ').strip() if venue_match else "Capelli Complex"
            
            is_complete = status_raw.lower() == "complete" or (re.search(r'\d+\s*-\s*\d+', score_raw) is not None)
            status_str = "Completed" if is_complete else "Upcoming"
            time_str = status_raw if not is_complete else ""
            
            is_club = "STRANGERS" in home or "STRANGERS" in away
            
            result_str = "Upcoming"
            if is_complete:
                result_str = "Completed"
                if is_club and "-" in score_raw:
                    scores = [int(s.strip()) for s in score_raw.split('-') if s.strip().isdigit()]
                    if len(scores) == 2:
                        strangers_score = scores[0] if "STRANGERS" in home else scores[1]
                        opp_score = scores[1] if "STRANGERS" in home else scores[0]
                        if strangers_score > opp_score: result_str = "W"
                        elif strangers_score < opp_score: result_str = "L"
                        else: result_str = "D"

            matches.append({
                "id": match_id,
                "date": date_fmt,
                "time": time_str,
                "home": home,
                "away": away,
                "score": score_raw if is_complete else "vs",
                "status": status_str,
                "venue": venue_raw,
                "isClubMatch": is_club,
                "result": result_str
            })
            match_id += 1
    return matches

def sync():
    try:
        html = fetch_html()
        standings = parse_standings(html)
        matches = parse_matches(html)
        
        if not standings or not matches:
            print("Failed to parse standings or matches from EZFacility HTML.")
            return

        js_content = f"""// CSX Fall Men 40+ IV 2026 - Official League Data (Auto-Synced from Capelli EZFacility)
const LEAGUE_INFO = {{
    name: "CSX Fall Men 40+ IV 2026",
    division: "8 v 8 - Adult Soccer (Men's Over 40)",
    facility: "Capelli Sport Complex, Tinton Falls, NJ",
    ezfacility_url: "{URL}"
}};

const STANDINGS_DATA = {json.dumps(standings, indent=4)};

const MATCHES_DATA = {json.dumps(matches, indent=4)};
"""
        with open(LEAGUE_DATA_PATH, "w", encoding="utf-8") as f:
            f.write(js_content)
        
        print(f"Successfully auto-synced {len(standings)} standings and {len(matches)} matches to league_data.js!")
    except Exception as e:
        print("Sync execution error:", e)

if __name__ == "__main__":
    sync()
