'use strict';

const container = document.querySelector('.extension-container');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const filterContainer = document.querySelector('.filter-container');

let fetchedData = [];
const fetchData = async () => {
    try {
        // Fetch data from the JSON file
        const response = await fetch('./data.json');
        fetchedData = await response.json();
        renderData(fetchedData);
    } catch (error) {
        console.error('Error fetching data:', error);
    };
}

// Populating the DOM
const renderData = (data) => {
    container.innerHTML = ''; // Clear the container before rendering new data

 data.forEach((item, index) => {
    const card = document.createElement('div');
    
    
    card.classList.add('extension-card');
    card.dataset.index = index;
    card.dataset.isActive = item.isActive; // Set the isActive attribute based on the data
    const stringToInject = `
    <div class="extension-info" >
    <img src="${item.logo}" alt="${item.name} icon" class="extension-icon">
    <div class="extension-details">
          <h2 class="extension-name">${item.name}</h2>
          <p class="extension-description">${item.description}</p>
      </div>
    </div>
    <div class="extension-actions">
        <button class="remove-button" aria-label="${item.name}remove">Remove</button>
        <label for="switch${index}" class="switch">
            <input type="checkbox" id="switch${index}" role="switch" aria-checked="${item.isActive}" aria-label="Toggle ${item.name} extension ${item.isActive ? 'on' : 'off'}" ${item.isActive ? 'checked' : ''}>
            <span class="slider"></span>
      </label>
      </div>
      `;
      card.innerHTML = stringToInject;
    container.appendChild(card);
}); 
}

// Switch functionality
container.addEventListener('change', (e) => {
    if (e.target.matches('.switch input')) { 
        const parentCard = e.target.closest('.extension-card');
        const index = parentCard.dataset.index;
    const isActive = e.target.checked;
    parentCard.dataset.isActive = isActive;
    // Update the actual data
    fetchedData[index].isActive = isActive;
}; 
});

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');

    if(currentTheme ==='light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.src = './assets/images/icon-sun.svg';
        themeToggle.classList.add('icon-sun');
        themeToggle.setAttribute('aria-label', 'Enable light mode');
        themeToggle.setAttribute('aria-pressed', 'true');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.src = './assets/images/icon-moon.svg';
        themeToggle.classList.remove('icon-sun');
        themeToggle.setAttribute('aria-label', 'Enable dark mode');
        themeToggle.setAttribute('aria-pressed', 'false');
    }
});

// Filter functionality
filterContainer.addEventListener('click', (e) =>{
    const filterButtons = document.querySelectorAll('.filter-tab');
    filterButtons.forEach(button => {
        button.classList.remove('active'); // Remove active class from all buttons
    });
    const button = e.target.closest('button');
    if (!button) return; // If the clicked element is not a button, do nothing

    const filterType = button.dataset.filter;
    let filteredData = [];
    if (filterType === 'all') {
        container.innerHTML = '' // Clear the container before rendering new data
        filteredData = fetchedData;
        button.classList.add('active'); // Add active class to the clicked button
    } else if (filterType === 'active') {
        container.innerHTML = ''; // Clear the container before rendering new data
        filteredData = fetchedData.filter(item => item.isActive === true);
        button.classList.add('active'); // Add active class to the clicked button
    }
    else if (filterType === 'inactive') {
        container.innerHTML = ''; // Clear the container before rendering new data
        filteredData = fetchedData.filter(item => item.isActive === false);
        button.classList.add('active'); // Add active class to the clicked button
    }
    renderData(filteredData);
});

//  Remove functionality
container.addEventListener('click', (e) => {
    if(e.target.classList.contains('remove-button')){
        const parentCard = e.target.closest('.extension-card');
        const index = parentCard.dataset.index;
        // Remove the item from the fetchedData array
        fetchedData.splice(index, 1);
        // Re-render UI
        renderData(fetchedData); 
    }
});

fetchData();