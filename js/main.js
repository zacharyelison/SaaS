// Store form data between pages
let formData = {};

// Page configuration
const pages = [
  { id: 'mission', file: '/src/pages/mission.html' },
  { id: 'culture', file: '/src/pages/culture.html' },
  { id: 'team', file: '/src/pages/team.html' },
  { id: 'problems', file: '/src/pages/problems.html' },
  { id: 'target-market', file: '/src/pages/target-market.html' },
  { id: 'offer', file: '/src/pages/offer.html' },
  { id: 'goals', file: '/src/pages/goals.html' }
];

let currentPageIndex = 0;

// Load page content
async function loadPage(index) {
  const page = pages[index];
  try {
    const response = await fetch(page.file);
    const html = await response.text();
    document.body.innerHTML = html;
    setupEventListeners();
    restoreFormData();
  } catch (error) {
    console.error('Error loading page:', error);
  }
}

// Save form data
function saveFormData(formElement) {
  const formElements = formElement.elements;
  for (let element of formElements) {
    if (element.name) {
      formData[element.name] = element.value;
    }
  }
}

// Restore form data
function restoreFormData() {
  const form = document.querySelector('form');
  if (!form) return;

  const formElements = form.elements;
  for (let element of formElements) {
    if (element.name && formData[element.name]) {
      element.value = formData[element.name];
    }
  }
}

// Generate PDF content
function generatePdfContent() {
  return `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #ff4444;">The Weekly RIOT PULSE</h1>
      
      <section>
        <h2>Mission</h2>
        <p>${formData.mission || ''}</p>
      </section>

      <section>
        <h2>Culture and Values</h2>
        <h3>Our Culture</h3>
        <ul>
          <li>${formData.culture_adj1 || ''}</li>
          <li>${formData.culture_adj2 || ''}</li>
          <li>${formData.culture_adj3 || ''}</li>
        </ul>
        
        <h3>Our Values</h3>
        <ul>
          <li>${formData.value1 || ''}</li>
          <li>${formData.value2 || ''}</li>
          <li>${formData.value3 || ''}</li>
        </ul>
      </section>

      <section>
        <h2>Team and Leadership</h2>
        <h3>Our Team</h3>
        <ul>
          <li>${formData.team_type1 || ''}</li>
          <li>${formData.team_type2 || ''}</li>
          <li>${formData.team_type3 || ''}</li>
        </ul>
        
        <h3>Our Leadership</h3>
        <ul>
          <li>${formData.leadership1 || ''}</li>
          <li>${formData.leadership2 || ''}</li>
          <li>${formData.leadership3 || ''}</li>
        </ul>
      </section>

      <section>
        <h2>Problems and Benefits</h2>
        <h3>Problems We Solve</h3>
        <ul>
          <li>${formData.problem1 || ''}</li>
          <li>${formData.problem2 || ''}</li>
          <li>${formData.problem3 || ''}</li>
        </ul>
      </section>

      <section>
        <h2>Target Market</h2>
        <p><strong>Industry/Sector:</strong> ${formData.industry || ''}</p>
        <p><strong>Audience:</strong> ${formData.audience || ''}</p>
      </section>

      <section>
        <h2>The Offer</h2>
        <p><strong>UVP:</strong> ${formData.uvp || ''}</p>
        <p><strong>Pricing Strategy:</strong> ${formData.pricing_strategy || ''}</p>
      </section>

      <section>
        <h2>Goals and Objectives</h2>
        <h3>Short-Term Goals</h3>
        <ul>
          <li>${formData.short_term_goal1 || ''}</li>
          <li>${formData.short_term_goal2 || ''}</li>
          <li>${formData.short_term_goal3 || ''}</li>
        </ul>
        
        <h3>Long-Term Goals</h3>
        <ul>
          <li>${formData.long_term_goal1 || ''}</li>
          <li>${formData.long_term_goal2 || ''}</li>
          <li>${formData.long_term_goal3 || ''}</li>
        </ul>
      </section>
    </div>
  `;
}

// Handle form submission
async function handleSubmit(form) {
  try {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Generating PDF...';

    // Save final form data
    saveFormData(form);

    // Create PDF content
    const element = document.createElement('div');
    element.innerHTML = generatePdfContent();

    const pdfBlob = await html2pdf().from(element).outputPdf('blob');
    
    // Convert blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = function() {
      const base64data = reader.result;
      button.textContent = 'Sending Email...';
      
      // Send email with PDF attachment
      emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          to_email: formData.email,
          pdf_content: base64data,
        }
      ).then(
        () => {
          alert("Your business profile has been generated and sent to your email!");
          button.disabled = false;
          button.textContent = 'Generate PDF & Send';
        },
        (error) => {
          console.error("Error:", error);
          alert("There was an error sending your profile. Please try again.");
          button.disabled = false;
          button.textContent = 'Generate PDF & Send';
        }
      );
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("There was an error generating your profile. Please try again.");
    const button = form.querySelector('button[type="submit"]');
    button.disabled = false;
    button.textContent = 'Generate PDF & Send';
  }
}

// Setup event listeners for the current page
function setupEventListeners() {
  const form = document.querySelector('form');
  const nextButton = document.getElementById('nextButton');
  const prevButton = document.getElementById('prevButton');

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (form.checkValidity()) {
        saveFormData(form);
        if (currentPageIndex < pages.length - 1) {
          currentPageIndex++;
          loadPage(currentPageIndex);
        }
      } else {
        form.reportValidity();
      }
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      saveFormData(form);
      if (currentPageIndex > 0) {
        currentPageIndex--;
        loadPage(currentPageIndex);
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.checkValidity()) {
      handleSubmit(form);
    } else {
      form.reportValidity();
    }
  });
}

// Initialize the first page
loadPage(currentPageIndex);