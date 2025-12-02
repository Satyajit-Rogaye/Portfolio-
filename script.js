function myMenuFunction() {
    var menuBth = document.getElementById("myNavMenu");
    if (menuBth.className === "nav-menu") {
        menuBth.className += " responsive";
    } else {
        menuBth.className = "nav-menu";
    }
}
const body = document.querySelector("body");
toggleSwitch = document.getElementById("toggle-switch");

toggleSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");
});

var typingEffect = new Typed(".typedText", {
    strings: ["Data Scientist", "ML Engineer", "EDA Expert"],
    loop: true,
    typeSpeed: 100,
    backSpeed: 80,
    backDelay: 2000,
})
const sr = ScrollReveal({
    origin: "top",
    distance: "80px",
    duration: 2000,
    reset: true,
});

sr.reveal(".featured-name", { delay: 100 });
sr.reveal(".text-info", { delay: 200 });
sr.reveal(".text-btn", { delay: 200 });
sr.reveal(".social-icons", { delay: 200 });
sr.reveal(".featured-image", { delay: 320 });

sr.reveal(".project-box", { interval: 200 });
sr.reveal(".top-header");

const srLeft = ScrollReveal({
    origin: "left",
    distance: "80px",
    duration: 2000,
    reset: true,
});

srLeft.reveal(".about-info", { delay: 100 });
srLeft.reveal(".contact-info", { delay: 100 });

const srRight = ScrollReveal({
    origin: "right",   // FIXED
    distance: "80px",
    duration: 2000,
    reset: true,
});

srRight.reveal(".skill", { delay: 100 });
srRight.reveal(".skill-box", { delay: 100 });

const sections = document.querySelectorAll(".section[id]");
function scrollActive() {
    const scrollY = window.scrollY;
    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 50,
            sectionId = current.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document
                .querySelector(".nav-menu a[href*=" + sectionId + "]")
                .classList.add("active-link");
        } else {
            document
                .querySelector(".nav-menu a[href*=" + sectionId + "]")
                .classList.remove("active-link");
        }
    });
}
window.addEventListener("scroll",scrollActive);


// ========== Contact Form -> Open Gmail Compose ==========
// ================== EMAIL HELPER (DESKTOP vs MOBILE) ==================
function openEmailCompose(toEmail, subject, bodyText) {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(bodyText);

    if (isMobile) {
        // On mobile: open default mail app (Gmail app, etc.)
        const mailtoLink = `mailto:${toEmail}?subject=${encodedSubject}&body=${encodedBody}`;
        window.location.href = mailtoLink;
    } else {
        // On desktop: open Gmail web compose
        const gmailLink =
            `https://mail.google.com/mail/?view=cm&fs=1` +
            `&to=${encodeURIComponent(toEmail)}` +
            `&su=${encodedSubject}` +
            `&body=${encodedBody}`;

        window.open(gmailLink, "_blank");
    }
}

// ================== CONTACT FORM + HIRE ME BUTTONS ==================
document.addEventListener("DOMContentLoaded", function () {
    const toEmail = "ds.rogaye.satyajit@gmail.com";

    // ---- Contact form SEND button ----
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = contactForm.querySelector('input[name="name"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            const subject = contactForm.querySelector('input[name="subject"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value;

            const bodyText =
`Name: ${name}
Email: ${email}

Message:
${message}`;

            openEmailCompose(toEmail, subject, bodyText);
        });
    }

    // ---- All "Hire Me" buttons (hero + about) ----
    const hireButtons = document.querySelectorAll(".hire-btn");
    hireButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const subject = "Hiring / Collaboration Inquiry from Portfolio";
            const bodyText =
`Hi Satyajit,

I visited your portfolio and would like to discuss an opportunity with you.

(Write your details here...)

Thanks,`;

            openEmailCompose(toEmail, subject, bodyText);
        });
    });
});
