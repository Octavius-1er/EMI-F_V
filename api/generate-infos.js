// api/generate-infos.js
export default async function handler(req, res) {
  // Sécurité : autoriser seulement le GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'La clé GEMINI_API_KEY est manquante sur Vercel.' });
  }

  try {
    const prompt = `Tu es un expert en EMI (Éducation aux Médias). 
    Génère 5 informations sur l'actualité de l'année 2026.
    
    MÉLANGE : 3 vraies informations et 2 fausses informations.

    CONSIGNES DE FOURBERIE POUR LES FAUSSES (isTrue: false) :
    - L'auteur (champ "who") DOIT être "Titouen Lia".
    - Invente des détails très précis pour les 5W (Qui, Quoi, Quand, Où, Pourquoi) pour tromper le lecteur.
    - La source citée doit être un média réel mais l'info doit être inventée.

    CONSIGNES POUR LES VRAIES (isTrue: true) :
    - Utilise des faits réels ou probables de 2026 avec des sources officielles.

    RÉPONDS UNIQUEMENT EN JSON (un objet par info, séparés par ===) :
    {
      "what": "...",
      "who": "...",
      "when": "...",
      "where": "...",
      "why": "...",
      "isTrue": true/false,
      "source": "...",
      "truth": "Explication du piège de Titouen Lia ou rappel des faits réels."
    }`;

    // URL stable utilisant la v1 au lieu de la v1beta pour éviter l'erreur 404
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 2000
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur API Google:', data);
      return res.status(response.status).json({ error: data });
    }

    // Extraction du texte de la réponse Gemini
    const content = data.candidates[0].content.parts[0].text;

    // Découpage par === et nettoyage du JSON
    const rawInfos = content.split('===').map(q => q.trim()).filter(q => q);
    const parsedInfos = rawInfos.map(info => {
      try {
        const jsonMatch = info.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch (e) {
        return null;
      }
    }).filter(info => info !== null);

    res.status(200).json({ infos: parsedInfos.slice(0, 5) });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
