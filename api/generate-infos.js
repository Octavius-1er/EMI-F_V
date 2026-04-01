export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Clé absente sur Vercel' });

  try {
    const promptText = "Génère 5 infos sur 2026 (3 vraies, 2 fausses par Titouen Lia) en JSON pur.";

    // ON CHANGE L'URL POUR TESTER LA VERSION "001" QUI EST SOUVENT LA SEULE ACTIVE
    // ET ON PASSE EN V1 (STABLE)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();

    // SI LE 1.5 FLASH NE MARCHE TOUJOURS PAS, ON TENTE LE VIEUX GEMINI PRO (Dernière chance)
    if (data.error) {
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
      const fallbackRes = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      });
      const fallbackData = await fallbackRes.json();
      
      if (fallbackData.error) {
        return res.status(404).json({ 
          message: "Google refuse tous les modèles pour cette clé.",
          error_flash: data.error.message,
          error_pro: fallbackData.error.message 
        });
      }
      return res.status(200).json({ source: "backup_pro", data: fallbackData });
    }

    return res.status(200).json({ source: "flash-001", data });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
