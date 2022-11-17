// Datamuse API url prefix used for site functionality
const urlAPI = 'https://api.datamuse.com/words?';

// DOM selectors
const wordInput = document.getElementById('input');
const btnInput = document.getElementById('submit-btn');
const display = document.getElementById('output');
const panels = Array.from(document.getElementsByClassName('panel'));

// Specific functions of Datamuse API
const queryType = 'rel_trg=';                                     /* Initally just one .. TODO expand to many */

// Async function to GET result suggestions from API
const getSuggestions = async () => {
  let wordQuery = wordInput.value;
  const endpoint = urlAPI + queryType + wordQuery;
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
  console.log('CLICK feature PANEL at ' + event.currentTarget);                                /* TEST */
  panels.forEach(panel => {
    panel.setAttribute('style', 'background-color: #44804C; color: #fbf05b;'); 
  });
  event.currentTarget.setAttribute('style', 'background-color: #ABA104; color: #041e34;');        /* TODO */
}

// Clear past results in output display area
const displayResults = (event) => {
  event.preventDefault();
  if (display.lastChild) {
    display.removeChild(display.lastChild);
  }
  getSuggestions();
}

// Register event listener on word feature panels
panels.forEach(panel => {
  panel.addEventListener('click', selectPanel);
});

// Register event listener on word query button
btnInput.addEventListener('click', displayResults);

// Set default event for initially selected word feature panel
document.getElementById('default').dispatchEvent(new Event("click"));
