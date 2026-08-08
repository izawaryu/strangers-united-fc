// Strangers United FC - Portal App Logic

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderStandings();
    renderSchedule();
    renderAttendanceTracker();
    initIframeToggle();
});

// Navigation Tab Switcher
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(targetId).classList.add('active');

            // Smooth scroll to section top on mobile
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Render League Standings Table
function renderStandings() {
    const tbody = document.getElementById('standings-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    STANDINGS_DATA.forEach(team => {
        const tr = document.createElement('tr');
        if (team.isClub) {
            tr.classList.add('highlight-club');
        }

        tr.innerHTML = `
            <td class="rank-cell">${team.rank}</td>
            <td class="team-name-cell">
                ${team.team} ${team.isClub ? '<span class="club-badge">OUR CLUB</span>' : ''}
            </td>
            <td>${team.gp}</td>
            <td><span class="win">${team.w}</span></td>
            <td><span class="loss">${team.l}</span></td>
            <td><span class="tie">${team.t}</span></td>
            <td>${team.gf}</td>
            <td>${team.ga}</td>
            <td class="${team.gd > 0 ? 'win' : team.gd < 0 ? 'loss' : ''}">${team.gd > 0 ? '+' + team.gd : team.gd}</td>
            <td class="pts-cell">${team.pts}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Render Schedule & Results
function renderSchedule(filter = 'all') {
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
        card.className = `match-card ${match.status.toLowerCase()}`;

        let resultBadge = '';
        if (match.status === 'Completed') {
            if (match.result === 'W') resultBadge = '<span class="result-badge win">WIN</span>';
            else if (match.result === 'L') resultBadge = '<span class="result-badge loss">LOSS</span>';
            else resultBadge = '<span class="result-badge draw">DRAW</span>';
        } else {
            resultBadge = '<span class="result-badge upcoming">UPCOMING</span>';
        }

        card.innerHTML = `
            <div class="match-header">
                <span class="match-date">📅 ${match.date} ${match.time ? '• ' + match.time : ''}</span>
                <span class="match-venue">📍 ${match.venue}</span>
                ${resultBadge}
            </div>
            <div class="match-teams">
                <div class="team home ${match.home.includes('STRANGERS') ? 'club-team' : ''}">
                    <span>${match.home}</span>
                </div>
                <div class="score-box">
                    <span class="score-text">${match.score}</span>
                </div>
                <div class="team away ${match.away.includes('STRANGERS') ? 'club-team' : ''}">
                    <span>${match.away}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Setup Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderSchedule(btn.getAttribute('data-filter'));
        });
    });
}

// Member Attendance RSVP Tracker
function renderAttendanceTracker() {
    const container = document.getElementById('rsvp-matches-container');
    if (!container) return;

    const upcomingMatches = MATCHES_DATA.filter(m => m.status === 'Upcoming');
    const rsvpData = JSON.parse(localStorage.getItem('strangers_fc_rsvp') || '{}');

    container.innerHTML = '';

    upcomingMatches.forEach(match => {
        const userRsvp = rsvpData[match.id] || null;

        const card = document.createElement('div');
        card.className = 'rsvp-card';
        card.innerHTML = `
            <div class="rsvp-header">
                <h3>${match.date} @ ${match.time || 'TBD'}</h3>
                <span class="rsvp-venue">📍 ${match.venue}</span>
            </div>
            <div class="rsvp-versus">
                <strong>${match.home}</strong> vs <strong>${match.away}</strong>
            </div>
            <div class="rsvp-actions" data-match-id="${match.id}">
                <button class="rsvp-btn in ${userRsvp === 'IN' ? 'active' : ''}" onclick="setRSVP(${match.id}, 'IN')">
                    ✅ I'm Playing
                </button>
                <button class="rsvp-btn maybe ${userRsvp === 'MAYBE' ? 'active' : ''}" onclick="setRSVP(${match.id}, 'MAYBE')">
                    🤔 Maybe
                </button>
                <button class="rsvp-btn out ${userRsvp === 'OUT' ? 'active' : ''}" onclick="setRSVP(${match.id}, 'OUT')">
                    ❌ Out
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Global RSVP Status Function
window.setRSVP = function(matchId, status) {
    const rsvpData = JSON.parse(localStorage.getItem('strangers_fc_rsvp') || '{}');
    rsvpData[matchId] = status;
    localStorage.setItem('strangers_fc_rsvp', JSON.stringify(rsvpData));

    renderAttendanceTracker();
    updateRSVPSummary();
};

function updateRSVPSummary() {
    const rsvpData = JSON.parse(localStorage.getItem('strangers_fc_rsvp') || '{}');
    const summaryBox = document.getElementById('rsvp-summary-box');
    if (!summaryBox) return;

    const upcomingMatches = MATCHES_DATA.filter(m => m.status === 'Upcoming');
    let summaryText = `⚽ *Strangers United FC - Match Attendance*\n\n`;

    upcomingMatches.forEach(m => {
        const st = rsvpData[m.id] || 'Not Selected';
        const emoji = st === 'IN' ? '✅' : st === 'OUT' ? '❌' : st === 'MAYBE' ? '🤔' : '❓';
        summaryText += `• *${m.date} (${m.away})*: ${emoji} ${st}\n`;
    });

    summaryBox.value = summaryText;
}

// Copy RSVP Summary to Clipboard for WhatsApp/Group Chat
window.copyRSVPSummary = function() {
    const summaryBox = document.getElementById('rsvp-summary-box');
    if (!summaryBox) return;

    summaryBox.select();
    document.execCommand('copy');
    alert('Match RSVP status copied to clipboard! You can now paste it into WhatsApp or team text chat.');
};

// EZFacility Direct Iframe Modal Toggle
function initIframeToggle() {
    const toggleBtn = document.getElementById('toggle-ezfacility-btn');
    const iframeWrapper = document.getElementById('ezfacility-iframe-wrapper');

    if (toggleBtn && iframeWrapper) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = iframeWrapper.classList.contains('hidden');
            if (isHidden) {
                iframeWrapper.classList.remove('hidden');
                toggleBtn.innerText = 'Hide Official EZFacility Page';
            } else {
                iframeWrapper.classList.add('hidden');
                toggleBtn.innerText = 'View Raw Official EZFacility Page';
            }
        });
    }
}
