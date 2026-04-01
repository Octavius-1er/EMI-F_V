export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Clé absente sur Vercel' });

  // On définit le prompt une seule fois
  const promptText = `Tu es un expert en EMI. Génère 5 informations sur l'actualité de 2026. 
  Mélange : 3 vraies et 2 fausses (auteur: Titouen Lia). 
  Réponds UNIQUEMENT en JSON pur, infos séparées par ===.
  Format: {"what":"","who":"","when":"","where":"","why":"","isTrue":true/false,"source":"","truth":""}`;

  // Liste des modèles à tester par ordre de priorité
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
  ];

  for (const modelName of modelsToTry) {
    try {
      // On teste la route v1beta qui est souvent plus permissive pour les nouveaux comptes
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      const data = await response.json();

      // Si ce modèle fonctionne, on traite la réponse et on s'arrête là
      if (response.ok && data.candidates && data.candidates[0].content) {
        const content = data.candidates[0].content.parts[0].text;
        const rawInfos = content.split('===').map(q => q.trim()).filter(q => q);
        const parsedInfos = rawInfos.map(info => {
          const jsonMatch = info.match(/\{[\s\S]*\}/);
          return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        }).filter(info => info !== null);

        return res.status(200).json({ infos: parsedInfos });
      }
      
      console.log(`Le modèle ${modelName} a échoué, essai du suivant...`);
    } catch (err) {
      continue; // On passe au modèle suivant en cas d'erreur réseau
    }
  }

  // Si on arrive ici, aucun modèle n'a fonctionné
  return res.status(500).json({ 
    error: "Aucun modèle Gemini n'est accessible avec cette clé",
    message: "Vérifie tes quotas sur Google AI Studio ou crée une nouvelle clé."
  });
}
