import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Initialize Supabase Client
const supabaseUrl = 'https://xmtojtpopzoknrszmvvj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdG9qdHBvcHpva25yc3ptdnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NjA1NTksImV4cCI6MjEwMTUzNjU1OX0.K0XFOCC30aRf__cGJSpyXputqynJpog4mZxxnjiWeyQ'
const supabase = createClient(supabaseUrl, supabaseKey)

// Modal Logic
window.openModal = function() {
    document.getElementById('waitlist-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.closeModal = function() {
    document.getElementById('waitlist-modal').classList.remove('active');
    document.body.style.overflow = '';
}

// Cookie Helpers
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Waitlist Submission Logic
window.submitWaitlist = async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    
    submitBtn.innerText = 'Joining...';
    submitBtn.disabled = true;

    const fullName = form.querySelector('#full-name').value;
    const phoneNumber = form.querySelector('#phone-number').value;
    const userType = form.querySelector('#user-type').value;

    try {
        const { data, error } = await supabase
            .from('waitlist')
            .insert([
                { full_name: fullName, phone_number: phoneNumber, user_type: userType }
            ]);

        if (error) throw error;

        // Set cookie so modal follows them and we know they joined
        setCookie('hasJoinedWaitlist', 'true', 365);
        
        alert("You're on the list! We'll notify you when Napep Ride launches.");
        closeModal();
        form.reset();
        
        // Hide FABs if they exist
        const fabs = document.querySelectorAll('.waitlist-fab');
        fabs.forEach(fab => fab.style.display = 'none');
        
    } catch (error) {
        console.error('Error joining waitlist:', error);
        alert('Something went wrong. Please try again.');
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

// Check Cookie on Load to hide FABs if already joined
document.addEventListener('DOMContentLoaded', () => {
    if (getCookie('hasJoinedWaitlist') === 'true') {
        const fabs = document.querySelectorAll('.waitlist-fab');
        fabs.forEach(fab => fab.style.display = 'none');
    }
});
