export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé GEMINI_API_KEY manquante sur Vercel' });
  }

  try {
    const prompt = `Tu es un expert en EMI. Génère 5 infos sur l'actualité de 2026. 
    Mélange : 3 vraies et 2 fausses.
    IMPORTANT : Pour les fausses, l'auteur (champ "who") doit être "Titouen Lia".
    Réponds uniquement en JSON pur, chaque info séparée par ===.
    Format : {"what":"","who":"","when":"","where":"","why":"","isTrue":true/false,"source":"","truth":""}`;

    // SOLUTION : Utilisation de v1beta avec gemini-1.5-flash (nom standard)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1
        }
      })
    });

    const data = await response.json();

    // Gestion des erreurs spécifiques de Google
    if (data.error) {
      return res.status(data.error.code || 500).json({ 
        error: "Erreur API Google", 
        message: data.error.message 
      });
    }

    if (!data.candidates || data.candidates.length === 0) {
      return res.status(500).json({ error: "Aucun contenu généré par l'IA" });
    }

    const content = data.candidates[0].content.parts[0].text;
    const rawInfos = content.split('===').map(q => q.trim()).filter(q => q);
    
    const parsedInfos = rawInfos.map(info => {
      try {
        const jsonMatch = info.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch (e) { return null; }
    }).filter(info => info !== null);

    res.status(200).json({ infos: parsedInfos.slice(0, 5) });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
