document.getElementById("main-logo").addEventListener("click", function() {
    window.location.reload(); // Refresh the page
});

// Function to calculate dynamic positions based on position of the bottom edge of the .welcome-container relative to the entire page.
function calculateScrollTargets() {
    const welcomeContainer = document.querySelector(".welcome-container");
    const welcomeContainerBottom =
        welcomeContainer.getBoundingClientRect().bottom + window.scrollY; // Bottom position relative to the page

    return {
        "home-taker": 0,
        "sub-home-taker": 0,
        "about-taker": welcomeContainerBottom - 69,
        "sub-about-taker": welcomeContainerBottom - 69,
        "skills-taker": welcomeContainerBottom + 561,
        "sub-skills-taker": welcomeContainerBottom + 561,
        "projects-taker": welcomeContainerBottom + 1191,
        "sub-projects-taker": welcomeContainerBottom + 1191,
        "contact-taker": welcomeContainerBottom + 1822,
        "sub-contact-taker": welcomeContainerBottom + 1822,
        "footer-link": 0,
        "footer-image": 0
    };
}

// Function to handle scroll behavior
function handleScroll(event) {
    event.preventDefault(); // Prevent default anchor behavior
    const scrollTargets = calculateScrollTargets();
    const targetId = event.target.id;
    const scrollPosition = scrollTargets[targetId];

    if (scrollPosition !== undefined) {
        window.scrollTo({
            top: scrollPosition,
        });
    }

    // Handle menu closure for "sub-" links
    if (targetId.startsWith("sub-")) {
        handleMenuClosure();
    }
}

// Attach event listeners to all scrollable links
const scrollTargetsKeys = [
    "home-taker", "sub-home-taker", "about-taker", "sub-about-taker",
    "skills-taker", "sub-skills-taker", "projects-taker", "sub-projects-taker",
    "contact-taker", "sub-contact-taker", "footer-link", "footer-image"
];

scrollTargetsKeys.forEach(targetId => {
    const element = document.getElementById(targetId);
    if (element) {
        element.addEventListener("click", handleScroll);
    }
});

const sections = document.querySelectorAll(".section");
const animatedElements = document.querySelectorAll("[data-animation]");

const observerLink = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(`a[href="#${entry.target.id}"]`);
        if (entry.isIntersecting) {
          // Highlight the link
          link.style.color = "#61dafb";
        } else {
          // Reset to default
          link.style.color = "";
        }
      });
    },
    {
      root: null, // Use the viewport as the root
      threshold: 0.55, // Trigger when 55% of the section is visible
    }
);

let myInterval;

const observerAnimation = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            const element = entry.target;
            const animationClass = element.getAttribute("data-animation");
             
            if (entry.isIntersecting) {                   
                element.classList.add(animationClass); // Add the animation class when the element comes into view
                  
                if(element == document.querySelector(".right-box img")) { //if the element coming into view is the image inside 
                    // .right-box, start the opacity toggling process
                        
                    clearInterval(myInterval); //but first make sure the current running interval is cleared, if it exists
                        
                    element.style.opacity = "1"; // Explicitly set initial opacity

                    myInterval = setInterval(() => {
                        element.style.opacity = element.style.opacity == 1 ? 0.5 : 1;
                    }, 3000);
                }
              }
            else
            element.classList.remove(animationClass); // Remove the animation class when the element goes out of view
        });
    },
    { threshold: 0 } // Adjust threshold as needed
);
  
sections.forEach((section) => observerLink.observe(section));
animatedElements.forEach((el) => observerAnimation.observe(el));

let menuButton = document.getElementById("menu-button");
let closeButton = document.getElementById("close-button");
let subNavbar = document.querySelector(".sub-navbar");
let anchors = document.querySelectorAll(".sub-navbar a");

let timeGap; // Time gap between menu close and reopen
let performTimeoutLogic = false; // Indicator to perform timeout behavior
let lastMenuClosureClickTime = 0; // Timestamp of the last menu-closing action
let lastMenuOpenClickTime = 0; // Timestamp of the last menu-opening action
const upperBound = 300; // Maximum allowed timeout duration in milliseconds
let waitDuration = 0; // Calculated timeout duration, capped at upperBound
let transitionDuration; // Store the transition duration for transitions in CSS

menuButton.addEventListener("click", function () {
    const currentTime = Date.now();
    timeGap = currentTime - lastMenuClosureClickTime; // Calculate the gap since last menu close

    transitionDuration = (upperBound + 200)/1000; //add 200 ms to upperBound and convert that into seconds
    document.documentElement.style.setProperty("--responsive-transition-duration", transitionDuration + "s");

    if (timeGap < waitDuration)
    performTimeoutLogic = false; // Perform timeout logic for quick reopen

    lastMenuOpenClickTime = currentTime; // Record the time of menu open click

    // Start showing the menu
    menuButton.style.display = "none";
    closeButton.style.display = "block";
    subNavbar.style.visibility = "visible";
    subNavbar.style.width = "100%";
    anchors.forEach((anchor) => {
        anchor.style.visibility = "visible";
        anchor.style.opacity = 1;
    });
});

closeButton.addEventListener("click", handleMenuClosure);

function handleMenuClosure() {
    const currentTime = Date.now();
    lastMenuClosureClickTime = currentTime; // Record the time of menu close click

    // Calculate the dynamic timeout duration
    waitDuration = currentTime - lastMenuOpenClickTime;
    if (waitDuration > upperBound)
    waitDuration = upperBound; // Cap the timeout duration at upperBound

    transitionDuration = (waitDuration + 200)/1000; //add 200 ms to waitDuration and convert that into seconds
    document.documentElement.style.setProperty("--responsive-transition-duration", transitionDuration + "s");

    // Start hiding the menu
    menuButton.style.display = "block";
    closeButton.style.display = "none";
    subNavbar.style.width = 0;
    anchors.forEach((anchor) => {
        anchor.style.opacity = 0;
    });

    // Schedule the timeout to hide the navbar completely
    setTimeout(() => {
        if (timeGap >= waitDuration || performTimeoutLogic) {
            console.log(`Closed menu after timeout. Time gap: ${timeGap}ms, Timeout waitDuration: ${waitDuration}ms`);
            subNavbar.style.visibility = "hidden";
            anchors.forEach((anchor) => {
                anchor.style.visibility = "hidden";
            });
        } else {
            console.log(`Timeout logic skipped. Time gap: ${timeGap}ms`);
            performTimeoutLogic = true; // Ensure subsequent closures work normally
        }
    }, waitDuration);
}

// Handle menuButton visibility on screen resize
window.addEventListener("resize", function() {
    if (window.innerWidth > 860) {
        menuButton.style.display = "none"; // Hide menuButton when nav-links are visible
        closeButton.style.display = "none"; // Ensure closeButton is also hidden
        subNavbar.style.width = "0"; // Reset subNavbar width
        subNavbar.style.visibility = "hidden"; // Ensure subNavbar is hidden
        anchors.forEach((anchor) => {
            anchor.style.visibility = "hidden";
            anchor.style.opacity = 0;
        });
    } else {
        if(closeButton.style.display == "none")
        menuButton.style.display = "block"; // Show menuButton when screen is resized to small and closeButton isn't displayed
    }
});

// Width Adjustments
function adjustDivsWidth(selector, percentage) {
    const viewportWidth = window.innerWidth;
    let gap = 150 + (1200 - viewportWidth) * 0.1;
    gap = Math.max(0, gap);
    const calculatedWidth = viewportWidth * percentage - gap;
    document.documentElement.style.setProperty(selector, `${calculatedWidth}px`);
}

// Adjust widths on resize
const adjustWidths = () => {
    adjustDivsWidth("--skills-div-responsive-width", 0.37);
    adjustDivsWidth("--projects-div-responsive-width", 0.44);
    adjustDivsWidth("--contact-div-responsive-width", 0.435);
};

// Initial adjustment
adjustWidths();

window.addEventListener("resize", adjustWidths);