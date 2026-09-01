import urllib.request
import re
import json
import os

URL = "https://gaacomplextintonfalls.ezleagues.ezfacility.com/leagues/478430/CSX-Summer-Men-40-Champions-IV-2026.aspx"

def fetch_and_sync():
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print("Successfully fetched live Capelli EZFacility page!")
            
            # Simple check if data is valid
            if "STRANGERS" in html:
                print("Strangers United FC found in live league data.")
                # We can write updated static JSON or JS if needed
    except Exception as e:
        print("Sync error:", e)

if __name__ == "__main__":
    fetch_and_sync()
