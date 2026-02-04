/**
 * Landing Services Admin Management
 * Handles CRUD operations for landing page services
 */

let servicesTable;
let currentSections = [];
let sectionCounter = 0;

// Initialize on page load
$(document).ready(function() {
  loadServices();
  setupImagePreview();
  setupSlugGeneration();
});

/**
 * Load all services from the API
 */
function loadServices() {
  fetch('/api/admin/landing-services', {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      renderServicesTable(data.data);
    } else {
      Swal.fire('Error', data.message || 'Failed to load services', 'error');
    }
  })
  .catch(error => {
    console.error('Error loading services:', error);
    Swal.fire('Error', 'Failed to load services. Please try again.', 'error');
  });
}

/**
 * Render the services table
 */
function renderServicesTable(services) {
  const tbody = document.getElementById('servicesTableBody');
  tbody.innerHTML = '';

  services.forEach((service, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-center">
        <img src="${service.cardImage}" alt="${service.title}" onerror="this.src='/assets/images/immaculate.png'">
      </td>
      <td><strong>${service.title}</strong></td>
      <td><code>/landingpage/${service.slug}</code></td>
      <td class="text-center">
        <span class="badge ${service.isActive ? 'badge-active' : 'badge-inactive'}">
          ${service.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td class="text-center">
        <div class="btn-group" role="group">
          <button class="btn btn-sm btn-info btn-action" onclick="previewService('${service._id}')" title="Preview">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-warning btn-action" onclick="editService('${service._id}')" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-${service.isActive ? 'secondary' : 'success'} btn-action" 
                  onclick="toggleStatus('${service._id}')" title="${service.isActive ? 'Deactivate' : 'Activate'}">
            <i class="bi bi-${service.isActive ? 'eye-slash' : 'eye'}"></i>
          </button>
          <button class="btn btn-sm btn-danger btn-action" onclick="deleteService('${service._id}')" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Initialize or refresh DataTable
  if ($.fn.DataTable.isDataTable('#servicesTable')) {
    $('#servicesTable').DataTable().destroy();
  }
  
  servicesTable = $('#servicesTable').DataTable({
    pageLength: 10,
    order: [[1, 'asc']],
    columnDefs: [
      { orderable: false, targets: [0, 4] }
    ]
  });
}

/**
 * Open the add service modal
 */
function openAddModal() {
  document.getElementById('serviceModalLabel').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Add New Service';
  document.getElementById('serviceForm').reset();
  document.getElementById('serviceId').value = '';
  document.getElementById('isActive').checked = true;
  currentSections = [];
  sectionCounter = 0;
  renderSections();
  clearImagePreviews();
  
  const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
  modal.show();
}

/**
 * Edit an existing service
 */
function editService(id) {
  fetch(`/api/admin/landing-services/${id}`, {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const service = data.data;
      
      document.getElementById('serviceModalLabel').innerHTML = '<i class="bi bi-pencil me-2"></i>Edit Service';
      document.getElementById('serviceId').value = service._id;
      document.getElementById('title').value = service.title;
      document.getElementById('slug').value = service.slug;
      document.getElementById('cardImage').value = service.cardImage;
      document.getElementById('bannerImage').value = service.bannerImage;
      document.getElementById('description').value = service.description;
      document.getElementById('isActive').checked = service.isActive;
      
      // Load sections
      currentSections = service.sections || [];
      sectionCounter = currentSections.length;
      renderSections();
      
      // Show image previews
      updateImagePreview('cardImage');
      updateImagePreview('bannerImage');
      
      const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
      modal.show();
    } else {
      Swal.fire('Error', data.message || 'Failed to load service', 'error');
    }
  })
  .catch(error => {
    console.error('Error loading service:', error);
    Swal.fire('Error', 'Failed to load service. Please try again.', 'error');
  });
}

/**
 * Save service (create or update)
 */
function saveService() {
  const id = document.getElementById('serviceId').value;
  const title = document.getElementById('title').value.trim();
  const slug = document.getElementById('slug').value.trim().toLowerCase();
  const cardImage = document.getElementById('cardImage').value.trim();
  const bannerImage = document.getElementById('bannerImage').value.trim();
  const description = document.getElementById('description').value.trim();
  const isActive = document.getElementById('isActive').checked;

  // Validate required fields
  if (!title || !slug || !cardImage || !bannerImage || !description) {
    Swal.fire('Validation Error', 'Please fill in all required fields.', 'warning');
    return;
  }

  // Validate slug format
  if (!/^[a-z0-9_]+$/.test(slug)) {
    Swal.fire('Validation Error', 'Slug can only contain lowercase letters, numbers, and underscores.', 'warning');
    return;
  }

  // Collect sections data from the form
  collectSectionsData();

  const serviceData = {
    title,
    slug,
    cardImage,
    bannerImage,
    description,
    sections: currentSections,
    isActive
  };

  const url = id ? `/api/admin/landing-services/${id}` : '/api/admin/landing-services';
  const method = id ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(serviceData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      Swal.fire('Success', data.message || 'Service saved successfully!', 'success');
      bootstrap.Modal.getInstance(document.getElementById('serviceModal')).hide();
      loadServices();
    } else {
      Swal.fire('Error', data.message || 'Failed to save service', 'error');
    }
  })
  .catch(error => {
    console.error('Error saving service:', error);
    Swal.fire('Error', 'Failed to save service. Please try again.', 'error');
  });
}

/**
 * Delete a service
 */
function deleteService(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will permanently delete this service. This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/admin/landing-services/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          Swal.fire('Deleted!', 'The service has been deleted.', 'success');
          loadServices();
        } else {
          Swal.fire('Error', data.message || 'Failed to delete service', 'error');
        }
      })
      .catch(error => {
        console.error('Error deleting service:', error);
        Swal.fire('Error', 'Failed to delete service. Please try again.', 'error');
      });
    }
  });
}

/**
 * Toggle service active status
 */
function toggleStatus(id) {
  fetch(`/api/admin/landing-services/${id}/toggle-status`, {
    method: 'PUT',
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      Swal.fire('Success', data.message, 'success');
      loadServices();
    } else {
      Swal.fire('Error', data.message || 'Failed to toggle status', 'error');
    }
  })
  .catch(error => {
    console.error('Error toggling status:', error);
    Swal.fire('Error', 'Failed to toggle status. Please try again.', 'error');
  });
}

/**
 * Preview a service
 */
function previewService(id) {
  fetch(`/api/admin/landing-services/${id}`, {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const service = data.data;
      renderPreview(service);
      document.getElementById('previewLink').href = `/landingpage/${service.slug}`;
      const modal = new bootstrap.Modal(document.getElementById('previewModal'));
      modal.show();
    } else {
      Swal.fire('Error', data.message || 'Failed to load preview', 'error');
    }
  })
  .catch(error => {
    console.error('Error loading preview:', error);
    Swal.fire('Error', 'Failed to load preview. Please try again.', 'error');
  });
}

/**
 * Render preview content
 */
function renderPreview(service) {
  let html = `
    <h1>${service.title}</h1>
    <img src="${service.bannerImage}" alt="${service.title}" class="img-fluid" onerror="this.style.display='none'">
    <p class="lead mt-3">${service.description}</p>
  `;

  if (service.sections && service.sections.length > 0) {
    const sortedSections = [...service.sections].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    sortedSections.forEach(section => {
      switch (section.type) {
        case 'heading':
          html += `<h2 class="section-title">${section.content}</h2>`;
          break;
        case 'paragraph':
          html += `<p>${section.content}</p>`;
          break;
        case 'image':
          html += `<img src="${section.content}" alt="Section image" class="img-fluid" onerror="this.style.display='none'">`;
          break;
        case 'list':
          if (section.items && section.items.length > 0) {
            html += '<ul>';
            section.items.forEach(item => {
              html += `<li>${item}</li>`;
            });
            html += '</ul>';
          }
          break;
        case 'blockquote':
          html += `<blockquote>${section.content}</blockquote>`;
          break;
      }
    });
  }

  document.getElementById('previewContent').innerHTML = html;
}

// ============================================================================
// SECTION MANAGEMENT
// ============================================================================

/**
 * Add a new section
 */
function addSection() {
  const newSection = {
    _id: 'new_' + sectionCounter,
    type: 'heading',
    content: '',
    items: [],
    order: currentSections.length
  };
  currentSections.push(newSection);
  sectionCounter++;
  renderSections();
}

/**
 * Remove a section
 */
function removeSection(index) {
  currentSections.splice(index, 1);
  // Update order values
  currentSections.forEach((section, i) => {
    section.order = i;
  });
  renderSections();
}

/**
 * Move section up
 */
function moveSectionUp(index) {
  if (index > 0) {
    collectSectionsData();
    const temp = currentSections[index];
    currentSections[index] = currentSections[index - 1];
    currentSections[index - 1] = temp;
    // Update order values
    currentSections.forEach((section, i) => {
      section.order = i;
    });
    renderSections();
  }
}

/**
 * Move section down
 */
function moveSectionDown(index) {
  if (index < currentSections.length - 1) {
    collectSectionsData();
    const temp = currentSections[index];
    currentSections[index] = currentSections[index + 1];
    currentSections[index + 1] = temp;
    // Update order values
    currentSections.forEach((section, i) => {
      section.order = i;
    });
    renderSections();
  }
}

/**
 * Render all sections
 */
function renderSections() {
  const container = document.getElementById('sectionsContainer');
  const noSectionsMsg = document.getElementById('noSectionsMessage');
  
  if (currentSections.length === 0) {
    container.innerHTML = '';
    noSectionsMsg.style.display = 'block';
    return;
  }
  
  noSectionsMsg.style.display = 'none';
  container.innerHTML = '';
  
  currentSections.forEach((section, index) => {
    const sectionHtml = createSectionCard(section, index);
    container.innerHTML += sectionHtml;
  });
}

/**
 * Create section card HTML
 */
function createSectionCard(section, index) {
  const typeLabels = {
    heading: 'Heading',
    paragraph: 'Paragraph',
    image: 'Image',
    list: 'List',
    blockquote: 'Blockquote'
  };

  const typeColors = {
    heading: 'primary',
    paragraph: 'secondary',
    image: 'success',
    list: 'info',
    blockquote: 'warning'
  };

  let contentHtml = '';
  
  switch (section.type) {
    case 'heading':
    case 'paragraph':
    case 'blockquote':
      contentHtml = `
        <div class="mb-2">
          <label class="form-label">Content</label>
          <textarea class="form-control section-content" data-index="${index}" rows="3" 
                    placeholder="Enter ${section.type} content...">${section.content || ''}</textarea>
        </div>
      `;
      break;
    case 'image':
      contentHtml = `
        <div class="mb-2">
          <label class="form-label">Image URL</label>
          <input type="text" class="form-control section-content" data-index="${index}" 
                 value="${section.content || ''}" placeholder="/assets/images/example.jpg or https://...">
          ${section.content ? `<img src="${section.content}" class="image-preview mt-2" onerror="this.style.display='none'">` : ''}
        </div>
      `;
      break;
    case 'list':
      const items = section.items || [''];
      let listItemsHtml = '';
      items.forEach((item, itemIndex) => {
        listItemsHtml += `
          <div class="list-item-row">
            <input type="text" class="form-control list-item" data-section="${index}" data-item="${itemIndex}" 
                   value="${item}" placeholder="List item ${itemIndex + 1}">
            <button type="button" class="btn btn-sm btn-danger" onclick="removeListItem(${index}, ${itemIndex})">
              <i class="bi bi-x"></i>
            </button>
          </div>
        `;
      });
      contentHtml = `
        <div class="mb-2">
          <label class="form-label">List Items</label>
          <div class="list-items-container" id="listItems_${index}">
            ${listItemsHtml}
          </div>
          <button type="button" class="btn btn-sm btn-outline-primary mt-2" onclick="addListItem(${index})">
            <i class="bi bi-plus"></i> Add Item
          </button>
        </div>
      `;
      break;
  }

  return `
    <div class="section-card" data-index="${index}">
      <div class="section-header">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-grip-vertical drag-handle"></i>
          <span class="badge bg-${typeColors[section.type]} section-type-badge">${typeLabels[section.type]}</span>
          <select class="form-select form-select-sm" style="width: auto;" onchange="changeSectionType(${index}, this.value)">
            <option value="heading" ${section.type === 'heading' ? 'selected' : ''}>Heading</option>
            <option value="paragraph" ${section.type === 'paragraph' ? 'selected' : ''}>Paragraph</option>
            <option value="image" ${section.type === 'image' ? 'selected' : ''}>Image</option>
            <option value="list" ${section.type === 'list' ? 'selected' : ''}>List</option>
            <option value="blockquote" ${section.type === 'blockquote' ? 'selected' : ''}>Blockquote</option>
          </select>
        </div>
        <div class="btn-group">
          <button type="button" class="btn btn-sm btn-outline-secondary" onclick="moveSectionUp(${index})" ${index === 0 ? 'disabled' : ''}>
            <i class="bi bi-arrow-up"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-secondary" onclick="moveSectionDown(${index})" ${index === currentSections.length - 1 ? 'disabled' : ''}>
            <i class="bi bi-arrow-down"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeSection(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <div class="section-body">
        ${contentHtml}
      </div>
    </div>
  `;
}

/**
 * Change section type
 */
function changeSectionType(index, newType) {
  collectSectionsData();
  currentSections[index].type = newType;
  if (newType === 'list' && (!currentSections[index].items || currentSections[index].items.length === 0)) {
    currentSections[index].items = [''];
  }
  renderSections();
}

/**
 * Add list item
 */
function addListItem(sectionIndex) {
  collectSectionsData();
  if (!currentSections[sectionIndex].items) {
    currentSections[sectionIndex].items = [];
  }
  currentSections[sectionIndex].items.push('');
  renderSections();
}

/**
 * Remove list item
 */
function removeListItem(sectionIndex, itemIndex) {
  collectSectionsData();
  currentSections[sectionIndex].items.splice(itemIndex, 1);
  if (currentSections[sectionIndex].items.length === 0) {
    currentSections[sectionIndex].items = [''];
  }
  renderSections();
}

/**
 * Collect sections data from the form
 */
function collectSectionsData() {
  currentSections.forEach((section, index) => {
    if (section.type === 'list') {
      const items = [];
      document.querySelectorAll(`.list-item[data-section="${index}"]`).forEach(input => {
        if (input.value.trim()) {
          items.push(input.value.trim());
        }
      });
      section.items = items.length > 0 ? items : [''];
    } else {
      const contentEl = document.querySelector(`.section-content[data-index="${index}"]`);
      if (contentEl) {
        section.content = contentEl.value.trim();
      }
    }
    section.order = index;
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Setup image preview functionality
 */
function setupImagePreview() {
  document.getElementById('cardImage').addEventListener('input', function() {
    updateImagePreview('cardImage');
  });
  
  document.getElementById('bannerImage').addEventListener('input', function() {
    updateImagePreview('bannerImage');
  });
}

/**
 * Update image preview
 */
function updateImagePreview(inputId) {
  const input = document.getElementById(inputId);
  const previewContainer = document.getElementById(inputId + 'Preview');
  const url = input.value.trim();
  
  if (url) {
    previewContainer.innerHTML = `<img src="${url}" class="image-preview" onerror="this.parentElement.innerHTML='<span class=\\'text-danger\\'>Invalid image URL</span>'">`;
  } else {
    previewContainer.innerHTML = '';
  }
}

/**
 * Clear image previews
 */
function clearImagePreviews() {
  document.getElementById('cardImagePreview').innerHTML = '';
  document.getElementById('bannerImagePreview').innerHTML = '';
}

/**
 * Setup automatic slug generation from title
 */
function setupSlugGeneration() {
  document.getElementById('title').addEventListener('input', function() {
    const slugInput = document.getElementById('slug');
    // Only auto-generate if slug is empty or matches previous auto-generated value
    if (!slugInput.value || slugInput.dataset.autoGenerated === 'true') {
      const slug = this.value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);
      slugInput.value = slug;
      slugInput.dataset.autoGenerated = 'true';
    }
  });
  
  document.getElementById('slug').addEventListener('input', function() {
    this.dataset.autoGenerated = 'false';
  });
}
