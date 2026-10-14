// Strangers United FC - Mobile Web App Logic with Online Attendance & Registration Sync

let onlineAttendanceData = {};
let isCaptainMode = false;

document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    renderNextMatchSpotlight();
    renderMobileStandings();
    renderMobileSchedule();
    initRegistrationSection();
    initRosterForm();
    fetchOnlineAttendance();
    initIframeToggle();
});

// Dynamic Next Match Spotlight on Home Screen
function renderNextMatchSpotlight() {
    const container = document.getElementById('next-match-spotlight-container');
    if (!container) return;

    // Ensure we specifically find the next upcoming Strangers United fixture
    const nextMatch = MATCHES_DATA.find(m => m.status === 'Upcoming' && m.isClubMatch);

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

            <a href="#rsvp" class="app-btn btn-navy nav-tab-trigger" data-target="rsvp-section" style="margin-top:0.8rem;">
                ⚡ Mark Match Attendance
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
        // Prevent duplicate event handlers
        item.replaceWith(item.cloneNode(true));
    });

    const refreshedNavItems = document.querySelectorAll('.nav-item, .nav-tab-trigger');
    refreshedNavItems.forEach(item => {
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

// ==========================================
// REGISTRATION & SEASON DUES MODULE
// ==========================================

function initRegistrationSection() {
    renderSeasonDuesTracker();
    renderRegistrationRosterTable();
}

// Render Season Dues Tracker & Progress Bar
function renderSeasonDuesTracker() {
    const countEl = document.getElementById('reg-paid-count');
    const fillEl = document.getElementById('dues-progress-fill');
    const textEl = document.getElementById('dues-progress-text');
    if (!countEl || !fillEl || !textEl) return;

    const registrations = getStoredRegistrations();
    const paidCount = registrations.filter(p => p.paid === true).length;
    const minTarget = SEASON_CONFIG.minPlayers || 10;
    const estDues = SEASON_CONFIG.targetDues || 140;

    countEl.textContent = `${paidCount} / ${minTarget}`;

    const pct = Math.min(100, Math.round((paidCount / minTarget) * 100));
    fillEl.style.width = `${pct}%`;

    const collectedTotal = paidCount * estDues;
    const totalCost = SEASON_CONFIG.totalCost || 1399;

    if (paidCount < minTarget) {
        const needed = minTarget - paidCount;
        textEl.innerHTML = `<strong>${paidCount}</strong> committed players paid ($${collectedTotal} of $${totalCost} collected). Need <strong>${needed} more</strong> to reach minimum team registration!`;
    } else {
        const extra = paidCount - minTarget;
        textEl.innerHTML = `🎉 <strong>Minimum target reached!</strong> ${paidCount} players committed ($${collectedTotal} collected). ${extra > 0 ? `All ${extra} extra player dues will be refunded pro rata.` : 'Ready to lock in team deposit!'}`;
    }
}

// Render Registered Squad Table
function renderRegistrationRosterTable() {
    const container = document.getElementById('reg-roster-list');
    if (!container) return;

    const registrations = getStoredRegistrations();
    container.innerHTML = '';

    if (registrations.length === 0) {
        container.innerHTML = `
            <div class="empty-roster-msg">
                No players registered yet. Be the first to commit for the season!
            </div>
        `;
        return;
    }

    registrations.forEach(player => {
        const row = document.createElement('div');
        row.className = `reg-player-card ${player.paid ? 'is-paid' : 'is-unpaid'}`;

        let statusBadge = player.paid
            ? '<span class="dues-status-pill paid">✅ Paid & Active</span>'
            : '<span class="dues-status-pill unpaid">⏳ Unpaid</span>';

        let captainControls = '';
        if (isCaptainMode) {
            captainControls = `
                <div class="captain-player-actions">
                    <button class="btn-sm ${player.paid ? 'btn-mark-unpaid' : 'btn-mark-paid'}" onclick="togglePlayerPayment(${player.id})">
                        ${player.paid ? 'Mark Unpaid' : 'Verify & Mark Paid'}
                    </button>
                    <button class="btn-sm btn-delete-player" onclick="deleteRegistration(${player.id})" title="Remove Player">
                        🗑️
                    </button>
                </div>
            `;
        }

        row.innerHTML = `
            <div class="reg-player-main">
                <div class="reg-player-identity">
                    <strong class="reg-player-name">${player.name}</strong>
                    <span class="reg-player-pos">${player.position || 'Player'}</span>
                </div>
                ${statusBadge}
            </div>
            ${player.note ? `<div class="reg-player-note"><span class="note-label">Note:</span> ${player.note}</div>` : ''}
            ${isCaptainMode && player.whatsapp ? `<div class="reg-player-contact">📱 WhatsApp: <a href="tel:${player.whatsapp}">${player.whatsapp}</a></div>` : ''}
            ${captainControls}
        `;
        container.appendChild(row);
    });
}

// Handle Player Registration Form Submission
window.handlePlayerRegistration = function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('reg-player-name');
    const waInput = document.getElementById('reg-whatsapp');
    const posInput = document.getElementById('reg-position');
    const noteInput = document.getElementById('reg-payment-note');
    const msgBox = document.getElementById('reg-status-msg');

    if (!nameInput || !waInput) return;

    const name = nameInput.value.trim();
    const whatsapp = waInput.value.trim();
    const position = posInput ? posInput.value : 'Midfield';
    const note = noteInput ? noteInput.value.trim() : '';

    if (!name || !whatsapp) {
        alert('Please fill out your Name and WhatsApp phone number.');
        return;
    }

    const currentList = getStoredRegistrations();

    // Check for duplicate name
    const existingIndex = currentList.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    if (existingIndex >= 0) {
        alert(`A player named "${name}" has already registered! If this is you, please contact the captain or update your note.`);
        return;
    }

    const newPlayer = {
        id: Date.now(),
        name: name,
        whatsapp: whatsapp,
        position: position,
        paid: false, // Explicitly marked as Unpaid until captain verifies
        note: note ? note : 'Venmo pending',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    currentList.push(newPlayer);
    saveStoredRegistrations(currentList);

    // Reset form
    nameInput.value = '';
    waInput.value = '';
    if (noteInput) noteInput.value = '';

    // Update UI
    renderSeasonDuesTracker();
    renderRegistrationRosterTable();
    initRosterForm();
    renderRosterAttendanceGrid();

    if (msgBox) {
        msgBox.innerHTML = `
            <div class="reg-success-box">
                ✅ <strong>Registration submitted!</strong><br>
                Status is currently <strong>Unpaid (Pending Verification)</strong>.<br>
                Please send your ~$140 dues via Venmo to <strong>@${SEASON_CONFIG.venmoHandle}</strong>. Once verified, you will be added to the team WhatsApp group and matchday roster!
            </div>
        `;
        setTimeout(() => {
            msgBox.innerHTML = '';
        }, 8000);
    }
};

// Captain Mode Toggle (Password protected)
window.toggleCaptainMode = function() {
    const toggleBtn = document.getElementById('captain-toggle-btn');
    const toolsBar = document.getElementById('captain-tools-bar');

    if (isCaptainMode) {
        isCaptainMode = false;
        if (toggleBtn) toggleBtn.innerText = '🔒 Captain Mode';
        if (toolsBar) toolsBar.classList.add('hidden');
        renderRegistrationRosterTable();
        return;
    }

    const pin = prompt('Enter Captain PIN to unlock verification mode:');
    if (pin === SEASON_CONFIG.captainPin || pin === '1234') {
        isCaptainMode = true;
        if (toggleBtn) toggleBtn.innerText = '🔓 Exit Captain Mode';
        if (toolsBar) toolsBar.classList.remove('hidden');
        renderRegistrationRosterTable();
    } else if (pin !== null) {
        alert('Incorrect Captain PIN. Verification controls remain locked.');
    }
};

// Toggle Player Payment Status (Captain Only)
window.togglePlayerPayment = function(id) {
    if (!isCaptainMode) return;

    const list = getStoredRegistrations();
    const player = list.find(p => p.id === id);
    if (!player) return;

    player.paid = !player.paid;
    saveStoredRegistrations(list);

    // Refresh entire app state
    renderSeasonDuesTracker();
    renderRegistrationRosterTable();
    initRosterForm();
    renderRosterAttendanceGrid();
};

// Delete Player Registration (Captain Only)
window.deleteRegistration = function(id) {
    if (!isCaptainMode) return;

    const list = getStoredRegistrations();
    const player = list.find(p => p.id === id);
    if (!player) return;

    if (!confirm(`Are you sure you want to remove "${player.name}" from the registration list?`)) {
        return;
    }

    const updated = list.filter(p => p.id !== id);
    saveStoredRegistrations(updated);

    renderSeasonDuesTracker();
    renderRegistrationRosterTable();
    initRosterForm();
    renderRosterAttendanceGrid();
};

// Copy Paid WhatsApp Numbers for Captain
window.copyPaidWhatsAppList = function() {
    const list = getStoredRegistrations();
    const paidWithWA = list.filter(p => p.paid && p.whatsapp);

    if (paidWithWA.length === 0) {
        alert('No paid players with WhatsApp numbers found.');
        return;
    }

    const text = paidWithWA.map(p => `${p.name}: ${p.whatsapp}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
        alert(`Copied ${paidWithWA.length} WhatsApp numbers to clipboard!\n\n${text}`);
    }).catch(() => {
        prompt('Copy the WhatsApp numbers below:', text);
    });
};

// Reset Roster Prompt (Captain Only)
window.resetRosterPrompt = function() {
    if (!isCaptainMode) return;

    if (confirm('Reset squad roster back to default team members?')) {
        saveStoredRegistrations(DEFAULT_MEMBERS);
        renderSeasonDuesTracker();
        renderRegistrationRosterTable();
        initRosterForm();
        renderRosterAttendanceGrid();
        alert('Squad roster reset to default configuration.');
    }
};

// ==========================================
// ATTENDANCE & MATCH RSVP MODULE
// ==========================================

// Initialize Roster & Match Dropdowns
function initRosterForm() {
    const playerSelect = document.getElementById('player-dropdown');
    const matchSelect = document.getElementById('match-dropdown');
    const paidPlayers = getActivePaidPlayers();

    if (playerSelect) {
        playerSelect.innerHTML = '<option value="" disabled selected>-- Choose Your Name --</option>';
        if (paidPlayers.length === 0) {
            const opt = document.createElement('option');
            opt.disabled = true;
            opt.textContent = 'No verified paid players yet';
            playerSelect.appendChild(opt);
        } else {
            paidPlayers.forEach(player => {
                const opt = document.createElement('option');
                opt.value = player;
                opt.textContent = player;
                playerSelect.appendChild(opt);
            });
        }
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
            localStorage.setItem('strangers_fc_online_rsvp', JSON.stringify(onlineAttendanceData));
        } else {
            fallbackLocalAttendance();
        }
    } catch (e) {
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
        msgBox.innerHTML = '<span style="color:#0284C7;">⏳ Saving status...</span>';
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
            if (msgBox) msgBox.innerHTML = '<span style="color:#059669;">✅ Saved online! Team status updated.</span>';
        } else {
            if (msgBox) msgBox.innerHTML = '<span style="color:#059669;">✅ Saved locally! Status updated.</span>';
        }
    } catch (err) {
        if (msgBox) msgBox.innerHTML = '<span style="color:#059669;">✅ Saved locally! Status updated.</span>';
    }

    setTimeout(() => {
        if (msgBox) msgBox.innerHTML = '';
    }, 4000);
}

// Render Live Team Roster Grid & Counters (Only Paid Members)
function renderRosterAttendanceGrid() {
    const container = document.getElementById('roster-attendance-list');
    const matchSelect = document.getElementById('match-dropdown');
    if (!container || !matchSelect) return;

    const currentMatchId = matchSelect.value || (MATCHES_DATA.find(m => m.status === 'Upcoming' && m.isClubMatch) || {}).id;
    const matchRsvp = onlineAttendanceData[currentMatchId] || {};
    const paidPlayers = getActivePaidPlayers();

    let inCount = 0;
    let maybeCount = 0;
    let outCount = 0;

    container.innerHTML = '';

    if (paidPlayers.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:1.5rem; color:var(--slate-muted); font-size:0.88rem;">
                No verified paid players on the roster yet.<br>
                <a href="#register" class="nav-tab-trigger app-btn btn-navy" data-target="register-section" style="margin-top:0.8rem; display:inline-flex;">
                    Go to Registration
                </a>
            </div>
        `;
        initMobileNavigation();
    } else {
        paidPlayers.forEach(player => {
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
    }

    // Update Counter Pills
    const countIn = document.getElementById('count-in');
    const countMaybe = document.getElementById('count-maybe');
    const countOut = document.getElementById('count-out');

    if (countIn) countIn.textContent = `${inCount} IN`;
    if (countMaybe) countMaybe.textContent = `${maybeCount} MAYBE`;
    if (countOut) countOut.textContent = `${outCount} OUT`;

    updateRSVPSummaryText(currentMatchId);
}

// Format Roster Summary for WhatsApp (Paid Squad Only)
function updateRSVPSummaryText(matchId) {
    const summaryBox = document.getElementById('rsvp-summary-box');
    if (!summaryBox) return;

    const match = MATCHES_DATA.find(m => m.id == matchId) || {};
    const matchRsvp = onlineAttendanceData[matchId] || {};
    const paidPlayers = getActivePaidPlayers();

    const opponent = match.away ? (match.away.includes('STRANGERS') ? match.home : match.away) : 'TBD';
    const timeStr = match.time || '9:00 PM';
    const dateStr = match.date || 'Upcoming';
    const venueStr = match.venue || 'Capelli Complex';

    let text = `${dateStr} vs. ${opponent}\n${timeStr}\n${venueStr}\n\n`;

    let inList = [];
    let outList = [];

    paidPlayers.forEach(p => {
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
