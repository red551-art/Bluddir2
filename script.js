const searchPage = document.getElementById('searchPage');
const resultsPage = document.getElementById('resultsPage');
const bludditPage = document.getElementById('bludditPage');
const searchInput = document.getElementById('searchInput');
const resultsSearchInput = document.getElementById('resultsSearchInput');

// Search functionality
function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        resultsSearchInput.value = query;
        searchPage.style.display = 'none';
        resultsPage.style.display = 'block';
        bludditPage.style.display = 'none';
        window.scrollTo(0, 0);
    }
}

// Enter key search
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

resultsSearchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Go back to search
function goToSearch() {
    searchPage.style.display = 'flex';
    resultsPage.style.display = 'none';
    bludditPage.style.display = 'none';
    searchInput.value = '';
    searchInput.focus();
}

// Go to results (from Bluddit)
function goToResults() {
    searchPage.style.display = 'none';
    resultsPage.style.display = 'block';
    bludditPage.style.display = 'none';
    window.scrollTo(0, 0);
}

// Open Bluddit post
function openBluddit() {
    searchPage.style.display = 'none';
    resultsPage.style.display = 'none';
    bludditPage.style.display = 'block';
    window.scrollTo(0, 0);
}

// Focus search input on load
window.onload = function() {
    searchInput.focus();
};
