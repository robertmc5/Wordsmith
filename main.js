// Datamuse API url prefix used for site functionality
const urlAPI = 'https://api.datamuse.com/words?';

// Main DOM selectors
const wordInput = document.getElementById('input');
const btnInput = document.getElementById('submit-btn');
const display = document.getElementById('output');
const panels = Array.from(document.getElementsByClassName('panel'));
// Special panel DOM selectors
const relStart = document.getElementById('relStart');
const relEnd = document.getElementById('relEnd');
const relWord = document.getElementById('relWord');

// Specific functions of Datamuse API
let queryType = '';
let query2nd = '';
let auxInput = '';

// Async function to GET result suggestions from API
const getSuggestions = async () => {
  let wordQuery = wordInput.value;
  const endpoint = urlAPI + queryType + wordQuery + query2nd + auxInput;
  console.log('ENDPOINT ' + endpoint);                                        /* TEST */
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

// Render error
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
  let current = event.currentTarget;
  console.log('CLICK feature PANEL at ' + event.currentTarget);                                /* TEST */
  panels.forEach(panel => {
    panel.setAttribute('style', 'background-color: #44804C; color: #fbf05b;'); 
  });
  current.setAttribute('style', 'background-color: #ABA104; color: #041e34;');        /* TODO */
  queryType = current.getAttribute('data-feat');                    /* TODO - queryType via data-* */
  query2nd = current.getAttribute('data-2nd');
  if (query2nd === '&sp=*') auxInput = current.querySelector('select').value;
  if (query2nd === '&sp=') auxInput = current.querySelector('select').value + '*';
  if (query2nd === '&topics=') auxInput = current.querySelector('input').value;
  if (!query2nd) {
    query2nd = '';
    auxInput = '';
  }
  console.log('query2nd at ' + query2nd + ' ' + auxInput);                                /* TEST */
}

// Clear past results in output display area then call API functionality
const displayResults = (event) => {
  event.preventDefault();
  if (display.lastChild) {
    display.removeChild(display.lastChild);
  }
  if (query2nd === '&topics=') auxInput = document.getElementById('relWord').value;           /* TEST */     
  getSuggestions();
}

// Register click event listener on word feature panels
panels.forEach(panel => {
  panel.addEventListener('click', selectPanel);
});

// Register Enter key event listener on text input for panel
const enterKey = (e) => {
  if (e.key === 'Enter') {
    auxInput = e.target.value;
    btnInput.focus();
  }
}
relWord.addEventListener('keydown', enterKey);

// Register click event listener on word query button
btnInput.addEventListener('click', displayResults);

// Set default event for initially selected word feature panel
document.getElementById('default').dispatchEvent(new Event('click'));
