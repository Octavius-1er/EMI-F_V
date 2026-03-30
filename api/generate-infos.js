// api/generate-infos.js
// Cette fonction Vercel génère les vraies infos automatiquement en appelant Claude

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const prompt = `Tu es un expert en EMI (Éducation aux Médias et à l'Information). 
Génère exactement 5 vraies informations RÉCENTES (de 2026 ou très actuelles) provenant de sources fiables françaises.

IMPORTANT: Les infos doivent être VRAIMENT RÉCENTES et vérifiables!

Pour chaque info, fournis UNE structure JSON valide:
{
  "what": "De quoi parle cette info? (court)",
  "who": "Qui dit cela / qui est concerné?",
  "when": "Quand? (date précise si possible)",
  "where": "Où? (lieu/endroit)",
  "why": "Pourquoi? (contexte/raison)",
  "isTrue": true,
  "source": "Nom du site/média (ex: francetv.fr, senat.fr)",
  "sourceUrl": "https://url-de-la-source.fr",
  "image": "",
  "truth": "Explication supplémentaire si nécessaire"
}

Séparation: === (chaque info séparée par ===)

Sources fiables à privilégier: info.gouv.fr, gouvernement.fr, franceinfo.fr, lemonde.fr, lefigaro.fr, bfmtv.com, anses.fr, education.gouv.fr

Réponds UNIQUEMENT avec les JSONs séparés par ===, sans autre texte.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      return res.status(response.status).json({ error: 'Claude API error' });
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parser les réponses
    const rawInfos = content.split('===').map(q => q.trim()).filter(q => q);
    const parsedInfos = rawInfos.map(info => {
      try {
        const jsonMatch = info.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
      return null;
    }).filter(info => info !== null);

    // Retourner max 5 infos
    const finalInfos = parsedInfos.slice(0, 5);

    if (finalInfos.length === 0) {
      return res.status(500).json({ error: 'Could not parse any infos' });
    }

    res.status(200).json({ infos: finalInfos });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
