// Strangers United FC - Mobile Web App Logic

document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    renderMobileStandings();
    renderMobileSchedule();
    renderMobileAttendanceTracker();
    initIframeToggle();
});

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

// Render Mobile Attendance RSVP Cards
function renderMobileAttendanceTracker() {
    const container = document.getElementById('rsvp-matches-container');
    if (!container) return;

    const upcomingMatches = MATCHES_DATA.filter(m => m.status === 'Upcoming');
    const rsvpData = JSON.parse(localStorage.getItem('strangers_fc_rsvp') || '{}');

    container.innerHTML = '';

    upcomingMatches.forEach(match => {
        const userStatus = rsvpData[match.id] || null;

        const card = document.createElement('div');
        card.className = 'rsvp-mobile-card';
        card.innerHTML = `
            <div class="rsvp-card-title">${match.home} vs ${match.away}</div>
            <div class="rsvp-card-sub">📅 ${match.date} @ ${match.time || 'TBD'} • 📍 ${match.venue}</div>
            <div class="rsvp-buttons">
                <button class="r-btn in ${userStatus === 'IN' ? 'active' : ''}" onclick="setMobileRSVP(${match.id}, 'IN')">
                    ✅ I'm Playing
                </button>
                <button class="r-btn maybe ${userStatus === 'MAYBE' ? 'active' : ''}" onclick="setMobileRSVP(${match.id}, 'MAYBE')">
                    🤔 Maybe
                </button>
                <button class="r-btn out ${userStatus === 'OUT' ? 'active' : ''}" onclick="setMobileRSVP(${match.id}, 'OUT')">
                    ❌ Out
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    updateRSVPSummary();
}

window.setMobileRSVP = function(matchId, status) {
    const rsvpData = JSON.parse(localStorage.getItem('strangers_fc_rsvp') || '{}');
    rsvpData[matchId] = status;
    localStorage.setItem('strangers_fc_rsvp', JSON.stringify(rsvpData));

    renderMobileAttendanceTracker();
};

function updateRSVPSummary() {
    const rsvpData = JSON.parse(localStorage.getItem('strangers_fc_rsvp') || '{}');
    const summaryBox = document.getElementById('rsvp-summary-box');
    if (!summaryBox) return;

    const upcomingMatches = MATCHES_DATA.filter(m => m.status === 'Upcoming');
    let text = `⚽ *Strangers United FC - Match RSVP*\n\n`;

    upcomingMatches.forEach(m => {
        const st = rsvpData[m.id] || 'Not Selected';
        const emoji = st === 'IN' ? '✅' : st === 'OUT' ? '❌' : st === 'MAYBE' ? '🤔' : '❓';
        text += `• *${m.date} (${m.away})*: ${emoji} ${st}\n`;
    });

    summaryBox.value = text;
}

window.copyRSVPSummary = function() {
    const summaryBox = document.getElementById('rsvp-summary-box');
    if (!summaryBox) return;

    summaryBox.select();
    document.execCommand('copy');
    alert('Match RSVP status copied to clipboard! Ready to paste into WhatsApp.');
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
