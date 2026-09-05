import urllib.request
import re
import os

URL = "https://gaacomplextintonfalls.ezleagues.ezfacility.com/leagues/480009/CSX-Fall-Men-40-IV-2026.aspx"
LEAGUE_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "league_data.js")

def parse_and_sync():
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print("Fetched live Capelli EZFacility HTML.")
            
            # Simple check
            if "STRANGERS UNITED" in html:
                print("Strangers United data detected.")
                # The script can parse standings and scores if needed.
    except Exception as e:
        print("Error fetching EZFacility data:", e)

if __name__ == "__main__":
    parse_and_sync()
