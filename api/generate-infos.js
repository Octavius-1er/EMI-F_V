export default async function handler(req, res) {
  // 1. Vérification de la méthode
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Seul le GET est autorisé' });
  }

  // 2. Vérification de la clé
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'La variable GEMINI_API_KEY est vide sur Vercel' });
  }

  try {
    const promptText = "Génère 5 infos courtes sur 2026 au format JSON. 3 vraies, 2 fausses (auteur Titouen Lia). Sépare les objets par ===";

    // 3. Appel API (On utilise v1beta qui est la plus flexible)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();

    // 4. Gestion d'erreur API Google
    if (data.error) {
      return res.status(400).json({ source: "Google API", details: data.error });
    }

    // 5. Extraction sécurisée du texte
    if (!data.candidates || !data.candidates[0].content) {
      return res.status(500).json({ error: "Réponse Google vide", data });
    }

    const text = data.candidates[0].content.parts[0].text;

    // 6. Parsing simple
    const parts = text.split('===').filter(p => p.trim());
    const infos = parts.map(p => {
      try {
        const match = p.match(/\{[\s\S]*\}/);
        return match ? JSON.parse(match[0]) : null;
      } catch (e) { return null; }
    }).filter(i => i !== null);

    return res.status(200).json({ infos });

  } catch (error) {
    // C'est ici que l'erreur 500 est capturée
    return res.status(500).json({ error: "Erreur serveur interne", message: error.message });
  }
}
