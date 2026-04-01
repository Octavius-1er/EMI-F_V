// api/generate-infos.js
export default async function handler(req, res) {
  // 1. Sécurité : Accepter uniquement le GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Récupération de la clé API (Vérifie qu'elle est bien nommée ainsi sur Vercel)
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'La variable GEMINI_API_KEY est manquante sur Vercel.' });
  }

  try {
    // 3. Le Prompt ultra-fourbe
    const prompt = `Tu es un expert en EMI (Éducation aux Médias et à l'Information). 
    Génère exactement 5 informations sur l'actualité (réelles ou inventées) datées de 2026.
    
    MÉLANGE : 3 vraies informations et 2 fausses informations.

    CONSIGNES DE FOURBERIE POUR LES FAUSSES INFOS (isTrue: false) :
    - L'auteur cité dans le champ "who" DOIT obligatoirement être "Titouen Lia".
    - Utilise les 5W (Who, What, When, Where, Why) de manière très précise et sérieuse pour que le faux ressemble à du vrai.
    - La source citée doit exister (ex: Le Monde, France Info) mais l'info doit être inventée.

    CONSIGNES POUR LES VRAIES INFOS (isTrue: true) :
    - Utilise des faits réels de 2026 provenant de sources fiables.

    FORMAT DE RÉPONSE (Strictement JSON, chaque info séparée par ===) :
    {
      "what": "De quoi parle l'info?",
      "who": "L'auteur ou responsable (ex: Titouen Lia pour les faux)",
      "when": "Date précise en 2026",
      "where": "Lieu de l'action",
      "why": "Le contexte ou la raison",
      "isTrue": true/false,
      "source": "Nom du média (ex: francetv.fr, senat.fr)",
      "sourceUrl": "https://url-de-la-source.fr",
      "image": "",
      "truth": "Explication pédagogique : pourquoi c'est vrai ou pourquoi Titouen Lia a menti ici."
    }`;

    // 4. Appel à l'API Google Gemini (Correction de l'URL 404)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.9, // Température haute pour favoriser l'invention des fake news
          maxOutputTokens: 2500,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    
    // Extraction du texte de la réponse
    if (!data.candidates || !data.candidates[0].content) {
      throw new Error("Réponse vide de Gemini");
    }
    const content = data.candidates[0].content.parts[0].text;

    // 5. Parsing des données (Découpage par === et extraction du JSON)
    const rawInfos = content.split('===').map(q => q.trim()).filter(q => q);
    
    const parsedInfos = rawInfos.map(info => {
      try {
        // On cherche le premier { et le dernier } pour isoler le JSON pur
        const jsonMatch = info.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Erreur lors du parsing d\'un bloc info:', e);
      }
      return null;
    }).filter(info => info !== null);

    // 6. Envoi des 5 infos finales
    res.status(200).json({ infos: parsedInfos.slice(0, 5) });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message });
  }
}
