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

    // TENTATIVE AVEC LE NOM DE MODÈLE LE PLUS PRÉCIS : gemini-1.5-flash-001
    // C'est souvent la solution quand "gemini-1.5-flash" tout court est rejeté
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9
        }
      })
    });

    const data = await response.json();

    // Si gemini-1.5-flash-001 échoue aussi, on tente un dernier recours automatique
    if (data.error) {
      console.error("Échec avec flash-001, tentative avec gemini-pro...");
      const backupUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      const backupRes = await fetch(backupUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const backupData = await backupRes.json();
      
      if (backupData.error) {
        return res.status(500).json({ error: "Google rejette tous les modèles", details: backupData.error.message });
      }
      return processGeminiResponse(backupData, res);
    }

    return processGeminiResponse(data, res);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Fonction pour traiter la réponse proprement
function processGeminiResponse(data, res) {
  const content = data.candidates[0].content.parts[0].text;
  const rawInfos = content.split('===').map(q => q.trim()).filter(q => q);
  const parsedInfos = rawInfos.map(info => {
    try {
      const jsonMatch = info.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) { return null; }
  }).filter(info => info !== null);

  res.status(200).json({ infos: parsedInfos.slice(0, 5) });
}
