document.addEventListener('DOMContentLoaded', function() {
    // Récupère les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const devisData = urlParams.get('data');
    
    if (devisData) {
        const decodedData = decodeURIComponent(devisData);
        const devis = JSON.parse(decodedData);
        
        // Affiche les données du devis
        document.getElementById('devis-num').textContent = devis.numero || 'DEV' + Date.now().toString().slice(-6);
        document.getElementById('devis-date').textContent = new Date().toLocaleDateString('fr-FR');
        document.getElementById('devis-content').innerHTML = formatDevisContent(devis);
        document.getElementById('devis-total').textContent = devis.total || '0.00';
        
        // Gestion des boutons
        document.getElementById('accept-btn').addEventListener('click', function() {
            document.getElementById('payment-form').classList.remove('hidden');
            this.disabled = true;
        });
        
        document.getElementById('refuse-btn').addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir refuser ce devis ?')) {
                alert('Merci pour votre réponse. Nous prendrons contact avec vous.');
                // Ici vous pourriez envoyer une notification à votre backend
            }
        });
    } else {
        alert('Aucun devis trouvé. Veuillez utiliser le lien fourni dans votre email.');
    }
});

function formatDevisContent(devis) {
    let html = `
        <p><strong>Client:</strong> ${devis.client || 'Non spécifié'}</p>
        <p><strong>Produit:</strong> ${devis.produit}</p>
        <p><strong>Description:</strong> ${devis.description}</p>
        <hr>
        <h3>Personnalisation</h3>
        <p><strong>Couleur:</strong> ${devis.couleur}</p>
        ${devis.texte ? `<p><strong>Texte:</strong> ${devis.texte}</p>` : ''}
        ${devis.logo ? `<p><strong>Logo:</strong> Oui</p>` : '<p><strong>Logo:</strong> Non</p>'}
        <p><strong>Position:</strong> ${devis.position}</p>
    `;
    return html;
}