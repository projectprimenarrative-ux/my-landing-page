// --- Interaction Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // Attach listener to Profile Group as normal for GLOW effects
    const liquidHeader = document.querySelector('.liquid-header');

    // Make the entire header clickable for better UX
    if (liquidHeader) {
        liquidHeader.addEventListener('click', (e) => {
            // Toggle Glow on Liquid Header (Top Container)
            liquidHeader.classList.toggle('glow-active');

            // Toggle Glow on Spines and Bottom Containers (Synchronized Pulse)
            const spineBig = document.querySelector('.spine-connector');
            const spineSmall = document.querySelector('.spine-connector-small');
            const groups = document.querySelectorAll('.group-container');

            if (spineBig) spineBig.classList.toggle('glow-active');
            if (spineSmall) spineSmall.classList.toggle('glow-active');

            // Toggle glow on ALL groups
            groups.forEach(group => group.classList.toggle('glow-active'));

            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(50);
        });
    }

    // Instagram Deep Link Handler (Mobile App Opener)
    const instagramLink = document.getElementById('instagram-link');
    if (instagramLink) {
        instagramLink.addEventListener('click', (e) => {
            // Check if user is on a mobile device
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                e.preventDefault();
                const webUrl = instagramLink.href;
                // Try the deep link schema
                const appUrl = "instagram://user?username=project.prime.directive";

                // Attempt to open the app
                window.location.href = appUrl;

                // Fallback to web URL if app doesn't open within 1s
                setTimeout(() => {
                    // Check if the user is still on the page (meaning app didn't open)
                    // Note: This check is imperfect as some browsers pause JS when backgrounded,
                    // but it's the standard fallback method.
                    window.location.href = webUrl;
                }, 1000);
            }
            // Desktop users proceed normally with href (target="_blank")
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
