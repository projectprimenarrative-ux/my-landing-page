// Video Background Mode - Simplified Script

document.addEventListener('DOMContentLoaded', () => {
    // --- Interaction Logic ---

    // Attach listener to Profile Group (Name Container)
    const profileGroup = document.querySelector('.profile-group');
    const liquidHeader = document.querySelector('.liquid-header');

    // Make the entire header clickable for better UX
    if (liquidHeader) {
        liquidHeader.addEventListener('click', (e) => {
            console.log('Header Clicked - Toggling Glow'); // DEBUG

            // Toggle Glow on Liquid Header (Top Container)
            liquidHeader.classList.toggle('glow-active');

            // Toggle Glow on Spines and Bottom Containers (Synchronized Pulse)
            const spineBig = document.querySelector('.spine-connector');
            const spineSmall = document.querySelector('.spine-connector-small');
            const groups = document.querySelectorAll('.group-container');

            if (spineBig) spineBig.classList.toggle('glow-active');
            if (spineSmall) spineSmall.classList.toggle('glow-active');

            // Toggle glow on ALL groups (including profile group if not already handled by parent)
            groups.forEach(group => group.classList.toggle('glow-active'));

            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(50);
        });
    }
});

// --- Action Logic ---
function downloadVCard() {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Vijay Ragavan G
N:G;Vijay;Ragavan;;
ORG:Triiq Innovations Private Limited
TITLE:CEO Prime Directive / Innovation Catalyst
TEL;TYPE=CELL:+919342262534
EMAIL:contact@primedirective.tech
END:VCARD`;
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Vijay_Ragavan_G.vcf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

function openWhatsApp() {
    window.open('https://wa.me/919342262534?text=Hi%20Vijay,%20I%20came%20across%20your%20profile%20and%20would%20like%20to%20connect.', '_blank');
}
