// Datamuse API url prefix used for site functionality
const urlAPI = 'https://api.datamuse.com/words?';

// Main DOM selectors
const wordInput = document.getElementById('input');
const btnInput = document.getElementById('submit-btn');
const display = document.getElementById('output');
const panels = Array.from(document.getElementsByClassName('panel'));
// DOM selectors for panels with 2nd parameters
let current;
const relStart = document.getElementById('relStart');
const relEnd = document.getElementById('relEnd');
const relWord = document.getElementById('relWord');

// Specific functional string queries and secondary input for Datamuse API
let queryType = '';
let query2nd = '';
let auxInput = '';

// Async function to GET result suggestions from API
const getSuggestions = async () => {
  let wordQuery = wordInput.value;
  const endpoint = urlAPI + queryType + wordQuery + query2nd + auxInput;
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const jsonResponse = await response.json();
      renderResults(jsonResponse);
    }
    if (!response.ok) {
      throw new Error('Request failed.');
    }
  }
  catch (error) {
    renderError(error);
  }
}

// Render error if needed
const renderError = error => {
  let message = document.createElement('p');
  message.innerHTML = error;
  display.appendChild(message);
  return;
}

// Render the results of query
const renderResults = APIresponse => {
  if (!APIresponse.length) {
    let message = document.createElement('p');
    message.innerHTML = 'No suggestions found.';
    display.appendChild(message);
    return;
  }
  resultsList = [];
  for (let i = 0; i < Math.min(APIresponse.length, 15); i++) {
    resultsList.push(`<li>${APIresponse[i].word}</li>`);
  }
  resultsList = resultsList.join('');
  let results = document.createElement('ol');
  results.innerHTML = resultsList;
  display.appendChild(results);
  return;
}

// Select panel to choose word feature
const selectPanel = (event) => {
  current = event.currentTarget;
  panels.forEach(panel => {
    panel.setAttribute('style', 'background-color: #44804C; color: #fbf05b;'); 
  });
  current.setAttribute('style', 'background-color: #ABA104; color: #041e34;');
  queryType = current.getAttribute('data-feat');
  query2nd = current.getAttribute('data-2nd');
  if (query2nd === '&sp=*') auxInput = current.querySelector('select').value;
  if (query2nd === '&sp=') auxInput = current.querySelector('select').value + '*';
  if (query2nd === '&topics=') auxInput = current.querySelector('input').value;
  if (!query2nd) {
    query2nd = '';
    auxInput = '';
  }
}

// Check if 2nd parameter is expected
const check2ndParameters = () => {
  if (query2nd) {
    if (!auxInput || auxInput === '*') {
      current.setAttribute('style', 'background-color: #FF4500; color: #041e34;');
      let message = document.createElement('p');
      message.style.paddingLeft = '2rem';
      message.style.textAlign = 'left';
      message.style.fontWeight = '600';
      message.innerHTML = 'Please select a value to<br>include with that feature.';
      display.appendChild(message);
      return false;
    }
  }
  return true;
};

// Clear past results in output display area, check for 2nd parameters, then call API functionality
const displayResults = (event) => {
  event.preventDefault();
  if (display.lastChild) {
    display.removeChild(display.lastChild);
  }
  if (query2nd === '&topics=') auxInput = document.getElementById('relWord').value;
  let valid = check2ndParameters();
  if (valid) getSuggestions();
}

// Register click event listener on word feature panels
panels.forEach(panel => {
  panel.addEventListener('click', selectPanel);
});

// Register Enter key event listener on text input for 2nd parameter panel
const enterKey = (e) => {
  if (e.key === 'Enter') {
    auxInput = e.target.value;
    btnInput.focus();
  }
}
relWord.addEventListener('keydown', enterKey);

// Register click event listener on word query button
btnInput.addEventListener('click', displayResults);

// Create default event to initially select default word feature panel
document.getElementById('default').dispatchEvent(new Event('click'));
