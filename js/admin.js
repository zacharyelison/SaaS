// Form field configurations
let formConfigs = {
    mission: {
        title: 'Mission Form',
        fields: [
            {
                id: 'mission',
                name: 'mission',
                type: 'textarea',
                label: 'Our mission is to',
                placeholder: 'Enter your mission statement',
                required: true
            },
            // test Add more fields...
        ]
    },
    culture: {
        title: 'Culture Form',
        fields: []
    },
    team: {
        title: 'Team Form',
        fields: []
    },
    problems: {
        title: 'Problems Form',
        fields: []
    },
    'target-market': {
        title: 'Target Market Form',
        fields: []
    },
    offer: {
        title: 'Offer Form',
        fields: []
    },
    goals: {
        title: 'Goals Form',
        fields: []
    }
};

let currentForm = 'mission';

// Initialize the dashboard
function initDashboard() {
    // Set up navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const formId = e.target.dataset.form;
            switchForm(formId);
        });
    });

    // Set up add field button
    document.getElementById('saveField').addEventListener('click', saveNewField);
    document.getElementById('updateField').addEventListener('click', updateField);

    // Load initial form
    switchForm('mission');
}

// Switch between forms
function switchForm(formId) {
    currentForm = formId;
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.form === formId) {
            link.classList.add('active');
        }
    });

    // Update form title
    document.getElementById('currentFormTitle').textContent = formConfigs[formId].title;

    // Refresh fields table
    refreshFieldsTable();
}

// Refresh the fields table
function refreshFieldsTable() {
    const tbody = document.getElementById('fieldsTable');
    tbody.innerHTML = '';

    formConfigs[currentForm].fields.forEach((field, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${field.name}</td>
            <td>${field.type}</td>
            <td>${field.label}</td>
            <td>${field.required ? 'Yes' : 'No'}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action" onclick="editField(${index})">
                    Edit
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="deleteField(${index})">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Save new field
function saveNewField() {
    const form = document.getElementById('addFieldForm');
    const formData = new FormData(form);

    const newField = {
        id: generateId(),
        name: formData.get('fieldName'),
        type: formData.get('fieldType'),
        label: formData.get('fieldLabel'),
        placeholder: formData.get('fieldPlaceholder'),
        required: formData.get('fieldRequired') === 'on'
    };

    formConfigs[currentForm].fields.push(newField);
    refreshFieldsTable();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addFieldModal'));
    modal.hide();
    form.reset();
}

// Edit field
function editField(index) {
    const field = formConfigs[currentForm].fields[index];
    const form = document.getElementById('editFieldForm');

    form.elements.fieldId.value = index;
    form.elements.fieldName.value = field.name;
    form.elements.fieldType.value = field.type;
    form.elements.fieldLabel.value = field.label;
    form.elements.fieldPlaceholder.value = field.placeholder || '';
    form.elements.fieldRequired.checked = field.required;

    const modal = new bootstrap.Modal(document.getElementById('editFieldModal'));
    modal.show();
}

// Update field
function updateField() {
    const form = document.getElementById('editFieldForm');
    const formData = new FormData(form);
    const index = parseInt(formData.get('fieldId'));

    const updatedField = {
        id: formConfigs[currentForm].fields[index].id,
        name: formData.get('fieldName'),
        type: formData.get('fieldType'),
        label: formData.get('fieldLabel'),
        placeholder: formData.get('fieldPlaceholder'),
        required: formData.get('fieldRequired') === 'on'
    };

    formConfigs[currentForm].fields[index] = updatedField;
    refreshFieldsTable();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editFieldModal'));
    modal.hide();
}

// Delete field
function deleteField(index) {
    if (confirm('Are you sure you want to delete this field?')) {
        formConfigs[currentForm].fields.splice(index, 1);
        refreshFieldsTable();
    }
}

// Generate unique ID
function generateId() {
    return 'field_' + Math.random().toString(36).substr(2, 9);
}

// Make functions available globally
window.editField = editField;
window.deleteField = deleteField;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);