// --- CONFIGURATION & DONNÉES ---
//let allSongs = []; // Liste globale des chants
let currentSong = null; // Chant actuellement affiché
let playlists = JSON.parse(localStorage.getItem('bibliotheque_listes')) || { "Ma Sélection": [] };
let activePlaylistName = Object.keys(playlists)[0];
let selectedSongIndexInPlaylist = null;

// --- INITIALISATION ---
window.onload = () => {
    loadAllSongs();
    updatePlaylistSelect();
    renderPlaylist();
    
    // Gestion du bouton menu (Toggle Sidebar)
    document.getElementById('toggleMenuBtn').onclick = () => {
        document.getElementById('sidebar').classList.toggle('hidden');
    };
};

/* // --- CHARGEMENT DES DONNÉES ---
async function loadAllSongs() {
    try {
        // Option A: Si vous avez un fichier index.json qui liste vos fichiers
        // const response = await fetch('chants/index.json');
        // allSongs = await response.json();
        
        // Simulation pour test (À remplacer par votre logique de chargement)
        allSongs = [
            { id: "001", titre: "Amazing Grace", auteur: "John Newton", paroles: "Amazing grace! How sweet the sound\nThat saved a wretch like me!" },
            { id: "002", titre: "La Mer", auteur: "Charles Trenet", paroles: "La mer\nQu'on voit danser le long des golfes clairs..." }
        ];
        
        displayExplorerSongs(allSongs);
    } catch (e) {
        console.error("Erreur de chargement : ", e);
    }
}*/
async function loadAllSongs() {
    // Comme les fichiers .js ont déjà été chargés dans index.html, 
    // la variable 'allSongs' contient déjà vos chants.
    
    if (allSongs.length === 0) {
        console.warn("Aucun chant n'a été chargé. Vérifiez vos balises <script>.");
    }
    
    displayExplorerSongs(allSongs);
}


// --- ONGLET 1 : EXPLORATEUR ---
function displayExplorerSongs(songs) {
    const container = document.getElementById('explorerList');
    container.innerHTML = '';
    songs.forEach(song => {
        const div = document.createElement('div');
        div.className = 'song-item';
        div.innerHTML = `<strong>${song.titre}</strong><small>${song.auteur}</small>`;
        div.onclick = () => {
            selectSong(song);
            // Sur mobile, on ferme le menu après sélection
            if(window.innerWidth < 768) document.getElementById('sidebar').classList.add('hidden');
        };
        container.appendChild(div);
    });
}

function filterSongs() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allSongs.filter(s => 
        s.titre.toLowerCase().includes(term) || s.auteur.toLowerCase().includes(term)
    );
    displayExplorerSongs(filtered);
}

// --- AFFICHAGE DU CHANT ---
function selectSong(song) {
    currentSong = song;
    document.getElementById('songTitle').innerText = song.titre;
    document.getElementById('songAuthor').innerText = song.auteur;
    document.getElementById('songLyrics').innerText = song.paroles;
    document.getElementById('viewer-actions').style.display = 'block';
    
    // Marquer comme sélectionné visuellement
    document.querySelectorAll('.song-item').forEach(el => el.classList.remove('selected'));
}

// --- NAVIGATION ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    document.getElementById('btn-' + tabId).classList.add('active');
}

// --- GESTION DES LISTES (PLAYLISTS) ---

function updatePlaylistSelect() {
    const select = document.getElementById('playlistSelect');
    select.innerHTML = '';
    Object.keys(playlists).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.innerText = name;
        if(name === activePlaylistName) opt.selected = true;
        select.appendChild(opt);
    });
}

function loadSelectedPlaylist() {
    activePlaylistName = document.getElementById('playlistSelect').value;
    renderPlaylist();
}

function renderPlaylist() {
    const container = document.getElementById('currentPlaylistContainer');
    container.innerHTML = '';
    const list = playlists[activePlaylistName] || [];
    
    list.forEach((song, index) => {
        const div = document.createElement('div');
        div.className = 'song-item';
        if(selectedSongIndexInPlaylist === index) div.classList.add('selected');
        div.innerHTML = `<strong>${song.titre}</strong>`;
        
        div.onclick = () => {
            selectedSongIndexInPlaylist = index;
            selectSong(song);
            renderPlaylist();
        };
        container.appendChild(div);
    });
}

function saveToLocalStorage() {
    localStorage.setItem('bibliotheque_listes', JSON.stringify(playlists));
}

// Actions sur les listes
function createList() {
    const name = prompt("Nom de la nouvelle liste :");
    if(name && !playlists[name]) {
        playlists[name] = [];
        activePlaylistName = name;
        saveToLocalStorage();
        updatePlaylistSelect();
        renderPlaylist();
    }
}

function renameList() {
    const newName = prompt("Nouveau nom pour " + activePlaylistName + " :");
    if(newName && newName !== activePlaylistName) {
        playlists[newName] = playlists[activePlaylistName];
        delete playlists[activePlaylistName];
        activePlaylistName = newName;
        saveToLocalStorage();
        updatePlaylistSelect();
    }
}

function deleteList() {
    if(confirm("Supprimer la liste " + activePlaylistName + " ?")) {
        delete playlists[activePlaylistName];
        activePlaylistName = Object.keys(playlists)[0] || "";
        saveToLocalStorage();
        updatePlaylistSelect();
        renderPlaylist();
    }
}

// Ajouter le chant affiché à la liste
function addCurrentSongToPlaylist() {
    if(!currentSong) return;
    if(!activePlaylistName) { alert("Créez une liste d'abord"); return; }
    
    playlists[activePlaylistName].push(currentSong);
    saveToLocalStorage();
    renderPlaylist();
    alert("Ajouté à " + activePlaylistName);
}

// Réordonner
function moveSongInPlaylist(direction) {
    if(selectedSongIndexInPlaylist === null) return;
    const list = playlists[activePlaylistName];
    const newIndex = selectedSongIndexInPlaylist + direction;
    
    if(newIndex >= 0 && newIndex < list.length) {
        const songToMove = list.splice(selectedSongIndexInPlaylist, 1)[0];
        list.splice(newIndex, 0, songToMove);
        selectedSongIndexInPlaylist = newIndex;
        saveToLocalStorage();
        renderPlaylist();
    }
}

// Retirer le chant sélectionné de la playlist actuelle
function removeSongFromPlaylist() {
    // 1. Vérifier si un chant est bien sélectionné dans la liste
    if (selectedSongIndexInPlaylist === null) {
        alert("Veuillez d'abord sélectionner un chant dans la liste pour le retirer.");
        return;
    }

    const songName = playlists[activePlaylistName][selectedSongIndexInPlaylist].titre;

    // 2. Demander confirmation
    //if (confirm(`Retirer "${songName}" de la liste "${activePlaylistName}" ?`)) {
        
        // 3. Supprimer l'élément du tableau
        playlists[activePlaylistName].splice(selectedSongIndexInPlaylist, 1);
        
        // 4. Réinitialiser la sélection
        selectedSongIndexInPlaylist = null;
        
        // 5. Sauvegarder et mettre à jour l'interface
        saveToLocalStorage();
        renderPlaylist();
        
        // Optionnel : Nettoyer l'affichage principal
        document.getElementById('songTitle').innerText = "Chant retiré";
        document.getElementById('songLyrics').innerText = "";
    //}
}
