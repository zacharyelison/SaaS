// Store form data between pages
let formData = {};

document.getElementById('missionForm').addEventListener('submit', (e) => {
  e.preventDefault();
});

document.getElementById('nextButton').addEventListener('click', () => {
  const form = document.getElementById('missionForm');
  if (form.checkValidity()) {
    // Save form data
    const formElements = form.elements;
    for (let element of formElements) {
      if (element.name) {
        formData[element.name] = element.value;
      }
    }
    
    // Here you would navigate to the next page
    // For now, we'll just log the data
    console.log('Form data saved:', formData);
    alert('Ready for the next page! (Navigation will be implemented when you share the next image)');
  } else {
    form.reportValidity();
  }
});

// Optional: Add input validation and character limits if needed
document.querySelectorAll('input, textarea').forEach(element => {
  element.addEventListener('input', (e) => {
    // Add any specific validation logic here
  });
});