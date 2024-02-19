document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");
  const weatherToggle = document.getElementById("weatherToggle");
  const weatherMenu = document.getElementById("weatherMenu");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      toggleElementVisibility(menu);
      hideElement(weatherMenu);
    });
  }

  if (weatherToggle) {
    weatherToggle.addEventListener("click", () => {
      toggleElementVisibility(weatherMenu);
    });
  }

  updateLiveTimer();
  setInterval(updateLiveTimer, 60000);
});

function toggleElementVisibility(element) {
  element.classList.toggle('hidden');
}

function hideElement(element) {
  element.classList.add('hidden');
}

function updateLiveTimer() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  document.getElementById('liveTimer').textContent = timeString;
}

setInterval(updateLiveTimer, 6000);

function performSearch() {
  const searchBar = document.getElementById('searchBar');
  const searchPrompt = document.getElementById('searchPrompt');
  const searchText = searchBar.value.trim();

  if (searchText.length > 0) {
    searchPrompt.textContent = `Searching for "${searchText}"...`;
    searchPrompt.classList.remove('hidden');
  } else {
    searchPrompt.classList.add('hidden');
  }
}

