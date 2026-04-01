// api/generate-infos.js
// Générateur d'infos EMI utilisant Gemini 3 Flash avec des pièges sophistiqués

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key Gemini non configurée dans Vercel' });
  }

  try {
    const prompt = `Tu es un expert en EMI (Éducation aux Médias et à l'Information). 
Génère un mélange de 5 informations (vraies et fausses) pour un jeu de vérification.

CONSIGNES DE GÉNÉRATION :
1. MÉLANGE : Génère 3 vraies informations récentes (2026) et 2 fausses informations très crédibles.
2. LES PIÈGES (FOURBERIE) : 
   - Pour les fausses infos, utilise des noms de journalistes ou d'auteurs qui semblent réels, comme "Titouen Lia".
   - Manipule les 5 W (Qui, Quoi, Quand, Où, Pourquoi) pour que l'info paraisse officielle mais contienne une erreur factuelle subtile.
   - Utilise des sources qui ressemblent à des vraies (ex: "Le Figaro" mais avec un détail erroné dans le texte).

STRUCTURE JSON À RESPECTER POUR CHAQUE INFO :
{
  "what": "De quoi parle cette info? (court)",
  "who": "Qui est l'auteur ou le sujet (ex: Titouen Lia)?",
  "when": "Date précise en 2026",
  "where": "Lieu précis",
  "why": "Contexte ou raison apparente",
  "isTrue": true_ou_false,
  "source": "Nom du média (ex: Le Monde, FranceInfo, etc.)",
  "sourceUrl": "URL plausible",
  "image": "",
  "truth": "Explication pédagogique : pourquoi c'est vrai ou pourquoi c'est un piège (mentionne le nom de l'auteur si c'est un faux)"
}

Séparation: === (chaque info séparée par ===)
Réponds UNIQUEMENT avec les JSONs, sans texte avant ou après.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8, // Un peu plus haut pour favoriser l'invention de fausses infos
          maxOutputTokens: 2500,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    // Découpage par le séparateur ===
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
