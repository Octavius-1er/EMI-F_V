export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Clé absente sur Vercel' });

  try {
    const prompt = `Tu es un expert en EMI. Génère 5 infos sur 2026 (3 vraies, 2 fausses avec auteur "Titouen Lia"). Réponds en JSON pur séparé par ===.`;

    // Cette URL est la seule 100% compatible avec les clés AI Studio v1
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: "Erreur Google", message: data.error.message });
    }

    const content = data.candidates[0].content.parts[0].text;
    const rawInfos = content.split('===').map(q => q.trim()).filter(q => q);
    const parsedInfos = rawInfos.map(info => {
      const jsonMatch = info.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }).filter(info => info !== null);

    res.status(200).json({ infos: parsedInfos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
