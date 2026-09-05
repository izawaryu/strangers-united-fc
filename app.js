// Strangers United FC - Mobile Web App Logic with Online Attendance Sync

let onlineAttendanceData = {};

document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    renderNextMatchSpotlight();
    renderMobileStandings();
    renderMobileSchedule();
    initRosterForm();
    fetchOnlineAttendance();
    initIframeToggle();
});

// Dynamic Next Match Spotlight on Home Screen
function renderNextMatchSpotlight() {
    const container = document.getElementById('next-match-spotlight-container');
    if (!container) return;

    const nextMatch = MATCHES_DATA.find(m => m.status === 'Upcoming');

    if (!nextMatch) {
        container.innerHTML = `
            <div class="card next-match-card">
                <div class="card-badge">SEASON COMPLETE</div>
                <h3 style="font-family:var(--font-heading); color:var(--navy-deep); margin-top:0.4rem;">All Season Matches Completed!</h3>
                <p style="font-size:0.85rem; color:var(--slate-muted); margin-top:0.4rem;">Check the standings & schedule tab for full results.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="card next-match-card">
            <div class="card-badge">NEXT MATCH</div>
            <div class="match-vs-header">
                <div class="vs-team ${nextMatch.home.includes('STRANGERS') ? 'club-highlight' : ''}">
                    <span class="vs-label">HOME</span>
                    <strong class="vs-name">${nextMatch.home}</strong>
                </div>
                <div class="vs-circle">VS</div>
                <div class="vs-team ${nextMatch.away.includes('STRANGERS') ? 'club-highlight' : ''}">
                    <span class="vs-label">AWAY</span>
                    <strong class="vs-name">${nextMatch.away}</strong>
                </div>
            </div>
            
            <div class="match-details-grid">
                <div class="detail-item">
                    <span class="icon">📅</span>
                    <span>${nextMatch.date} ${nextMatch.time ? '@ ' + nextMatch.time : ''}</span>
                </div>
                <div class="detail-item">
                    <span class="icon">📍</span>
                    <span>Field: ${nextMatch.venue || 'Capelli Complex'}</span>
                </div>
            </div>

            <a href="#rsvp" class="app-btn btn-navy nav-tab-trigger" data-target="rsvp-section">
                ⚡ Mark Attendance
            </a>
        </div>
    `;

    initMobileNavigation();
}

// Mobile Bottom Bar & Tab Navigation
function initMobileNavigation() {
    const navItems = document.querySelectorAll('.nav-item, .nav-tab-trigger');
    const sections = document.querySelectorAll('.app-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            if (!targetId) return;

            // Sync active state on bottom nav bar
            const bottomNavLinks = document.querySelectorAll('.app-bottom-nav .nav-item');
            bottomNavLinks.forEach(link => {
                if (link.getAttribute('data-target') === targetId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Switch section
            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Render Clean Mobile Standings Table
function renderMobileStandings() {
    const tbody = document.getElementById('standings-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    STANDINGS_DATA.forEach(team => {
        const tr = document.createElement('tr');
        if (team.isClub) {
            tr.classList.add('highlight-club');
        }

        tr.innerHTML = `
            <td><strong>${team.rank}</strong></td>
            <td>
                ${team.team} ${team.isClub ? '⭐' : ''}
            </td>
            <td>${team.gp}</td>
            <td><span class="win">${team.w}</span></td>
            <td><span class="loss">${team.l}</span></td>
            <td><span class="tie">${team.t}</span></td>
            <td class="pts-val">${team.pts}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Render Mobile Fixtures Feed
function renderMobileSchedule(filter = 'all') {
    const container = document.getElementById('schedule-list');
    if (!container) return;

    container.innerHTML = '';

    const filteredMatches = MATCHES_DATA.filter(m => {
        if (filter === 'upcoming') return m.status === 'Upcoming';
        if (filter === 'completed') return m.status === 'Completed';
        return true;
    });

    filteredMatches.forEach(match => {
        const card = document.createElement('div');
        card.className = 'fixture-card';

        let badgeHtml = '';
        if (match.status === 'Completed') {
            if (match.result === 'W') badgeHtml = '<span class="badge-result win">WIN</span>';
            else if (match.result === 'L') badgeHtml = '<span class="badge-result loss">LOSS</span>';
            else badgeHtml = '<span class="badge-result draw">DRAW</span>';
        } else {
            badgeHtml = '<span class="badge-result upcoming">UPCOMING</span>';
        }

        card.innerHTML = `
            <div class="fixture-header">
                <span>📅 ${match.date} ${match.time ? '• ' + match.time : ''}</span>
                ${badgeHtml}
            </div>
            <div class="fixture-teams-row">
                <span class="fixture-team ${match.home.includes('STRANGERS') ? 'is-club' : ''}">${match.home}</span>
                <span class="fixture-score">${match.score}</span>
                <span class="fixture-team ${match.away.includes('STRANGERS') ? 'is-club' : ''}" style="text-align: right;">${match.away}</span>
            </div>
            <div class="fixture-venue">📍 ${match.venue}</div>
        `;
        container.appendChild(card);
    });

    // Mobile Filter Tabs
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderMobileSchedule(pill.getAttribute('data-filter'));
        });
    });
}

// Initialize Roster & Match Dropdowns
function initRosterForm() {
    const playerSelect = document.getElementById('player-dropdown');
    const matchSelect = document.getElementById('match-dropdown');

    if (playerSelect) {
        playerSelect.innerHTML = '<option value="" disabled selected>-- Choose Your Name --</option>';
        ROSTER_PLAYERS.forEach(player => {
            const opt = document.createElement('option');
            opt.value = player;
            opt.textContent = player;
            playerSelect.appendChild(opt);
        });
    }

    if (matchSelect) {
        matchSelect.innerHTML = '';
        const upcoming = MATCHES_DATA.filter(m => m.status === 'Upcoming');
        upcoming.forEach(match => {
            const opt = document.createElement('option');
            opt.value = match.id;
            opt.textContent = `${match.date} vs ${match.away.includes('STRANGERS') ? match.home : match.away} (${match.time || 'TBD'})`;
            matchSelect.appendChild(opt);
        });

        matchSelect.addEventListener('change', () => {
            renderRosterAttendanceGrid();
        });
    }
}

// Fetch Shared Online Attendance Data
async function fetchOnlineAttendance() {
    try {
        const response = await fetch(ATTENDANCE_API_URL);
        if (response.ok) {
            const json = await response.json();
            onlineAttendanceData = json.attendance || {};
            // Cache locally
            localStorage.setItem('strangers_fc_online_rsvp', JSON.stringify(onlineAttendanceData));
        } else {
            fallbackLocalAttendance();
        }
    } catch (e) {
        console.warn('Using cached attendance data:', e);
        fallbackLocalAttendance();
    }
    renderRosterAttendanceGrid();
}

function fallbackLocalAttendance() {
    onlineAttendanceData = JSON.parse(localStorage.getItem('strangers_fc_online_rsvp') || '{}');
}

// Submit Attendance to Shared Online Blob
async function submitAttendance(status) {
    const playerSelect = document.getElementById('player-dropdown');
    const matchSelect = document.getElementById('match-dropdown');
    const msgBox = document.getElementById('sync-status-msg');

    const playerName = playerSelect ? playerSelect.value : '';
    const matchId = matchSelect ? matchSelect.value : '';

    if (!playerName) {
        alert('Please select your name from the drop-down menu first!');
        return;
    }

    if (!matchId) {
        alert('Please select a match!');
        return;
    }

    if (msgBox) {
        msgBox.innerHTML = '<span style="color:#0284C7;">⏳ Saving online...</span>';
    }

    if (!onlineAttendanceData[matchId]) {
        onlineAttendanceData[matchId] = {};
    }
    onlineAttendanceData[matchId][playerName] = status;

    // Cache locally immediately
    localStorage.setItem('strangers_fc_online_rsvp', JSON.stringify(onlineAttendanceData));
    renderRosterAttendanceGrid();

    // Push PUT update to JSONBlob
    try {
        const res = await fetch(ATTENDANCE_API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attendance: onlineAttendanceData })
        });

        if (res.ok) {
            if (msgBox) msgBox.innerHTML = '<span style="color:#059669;">✅ Saved online! Everyone can view your status.</span>';
        } else {
            if (msgBox) msgBox.innerHTML = '<span style="color:#D97706;">Saved locally. (Sync retry on refresh)</span>';
        }
    } catch (err) {
        if (msgBox) msgBox.innerHTML = '<span style="color:#D97706;">Saved locally.</span>';
    }

    setTimeout(() => {
        if (msgBox) msgBox.innerHTML = '';
    }, 4000);
}

// Render Live Team Roster Grid & Counters
function renderRosterAttendanceGrid() {
    const container = document.getElementById('roster-attendance-list');
    const matchSelect = document.getElementById('match-dropdown');
    if (!container || !matchSelect) return;

    const currentMatchId = matchSelect.value || (MATCHES_DATA.find(m => m.status === 'Upcoming') || {}).id;
    const matchRsvp = onlineAttendanceData[currentMatchId] || {};

    let inCount = 0;
    let maybeCount = 0;
    let outCount = 0;

    container.innerHTML = '';

    ROSTER_PLAYERS.forEach(player => {
        const st = matchRsvp[player] || 'PENDING';

        if (st === 'IN') inCount++;
        else if (st === 'MAYBE') maybeCount++;
        else if (st === 'OUT') outCount++;

        let badgeClass = 'pending';
        let badgeText = '❓ Pending';

        if (st === 'IN') { badgeClass = 'in'; badgeText = '✅ IN'; }
        else if (st === 'MAYBE') { badgeClass = 'maybe'; badgeText = '🤔 MAYBE'; }
        else if (st === 'OUT') { badgeClass = 'out'; badgeText = '❌ OUT'; }

        const row = document.createElement('div');
        row.className = 'roster-player-row';
        row.innerHTML = `
            <span class="player-name-text">${player}</span>
            <span class="player-st-badge ${badgeClass}">${badgeText}</span>
        `;
        container.appendChild(row);
    });

    // Update Counter Pills
    const countIn = document.getElementById('count-in');
    const countMaybe = document.getElementById('count-maybe');
    const countOut = document.getElementById('count-out');

    if (countIn) countIn.textContent = `${inCount} IN`;
    if (countMaybe) countMaybe.textContent = `${maybeCount} MAYBE`;
    if (countOut) countOut.textContent = `${outCount} OUT`;

    updateRSVPSummaryText(currentMatchId);
}

// Format Roster Summary for WhatsApp according to user specifications:
// 1. No emojis
// 2. Poll text: <time>, <date> vs. <opponent>\n<field>
// 3. Poll options: "In" or "Out"
// 4. No text after the poll
function updateRSVPSummaryText(matchId) {
    const summaryBox = document.getElementById('rsvp-summary-box');
    if (!summaryBox) return;

    const match = MATCHES_DATA.find(m => m.id == matchId) || {};
    const matchRsvp = onlineAttendanceData[matchId] || {};

    const opponent = match.away ? (match.away.includes('STRANGERS') ? match.home : match.away) : 'TBD';
    const timeStr = match.time || '9:00 PM';
    const dateStr = match.date || 'Upcoming';
    const venueStr = match.venue || 'Capelli Complex';

    let text = `${timeStr}, ${dateStr} vs. ${opponent}\n${venueStr}\n\n`;

    let inList = [];
    let outList = [];

    ROSTER_PLAYERS.forEach(p => {
        const st = matchRsvp[p];
        if (st === 'IN') inList.push(p);
        else if (st === 'OUT') outList.push(p);
    });

    text += `In (${inList.length}):\n`;
    if (inList.length > 0) {
        text += inList.map(p => `- ${p}`).join('\n') + `\n\n`;
    } else {
        text += `- (None)\n\n`;
    }

    text += `Out (${outList.length}):\n`;
    if (outList.length > 0) {
        text += outList.map(p => `- ${p}`).join('\n');
    } else {
        text += `- (None)`;
    }

    summaryBox.value = text;
}

window.copyRSVPSummary = function() {
    const summaryBox = document.getElementById('rsvp-summary-box');
    if (!summaryBox) return;

    summaryBox.select();
    document.execCommand('copy');
    alert('Poll copied to clipboard! Ready to paste into WhatsApp.');
};

window.shareToWhatsApp = function() {
    const summaryBox = document.getElementById('rsvp-summary-box');
    if (!summaryBox || !summaryBox.value) return;

    const encodedText = encodeURIComponent(summaryBox.value);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
};

function initIframeToggle() {
    const toggleBtn = document.getElementById('toggle-ezfacility-btn');
    const iframeWrapper = document.getElementById('ezfacility-iframe-wrapper');

    if (toggleBtn && iframeWrapper) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = iframeWrapper.classList.contains('hidden');
            if (isHidden) {
                iframeWrapper.classList.remove('hidden');
                toggleBtn.innerText = 'Hide EZFacility Page';
            } else {
                iframeWrapper.classList.add('hidden');
                toggleBtn.innerText = 'View EZFacility Official Page';
            }
        });
    }
}
