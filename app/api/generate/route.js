import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Du er en erfaren møbelsnekker og ingeniør. Du genererer nøyaktige DIY-blueprints.
Svar KUN med gyldig JSON i følgende format (ingen ekstra tekst):

{
  "project_name": "string",
  "dimensions": {
    "width": "X cm",
    "height": "Y cm",
    "depth": "Z cm"
  },
  "materials": [
    { "item": "string", "quantity": "string", "note": "string (valgfri)" }
  ],
  "cut_list": [
    { "part": "string", "dimensions": "A x B cm", "quantity": number }
  ],
  "assembly_steps": ["string", "string"]
}

Regler:
- Bruk metriske mål (cm).
- Beregn tykkelser realistisk (f.eks. 18 mm for hyller, 12-16 mm for kasser).
- Kuttelisten skal være praktisk og minimere svinn der mulig.
- Inkluder relevante komponenter for elektronikkprosjekter.
- Monteringssteg skal være konkrete og sikre.
- Hvis prosjektet er uklart, gjør fornuftige antakelser og noter dem.`;

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return Response.json({ error: 'Mangler prompt' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Demo-fallback
      return Response.json({
        project_name: "Demo: " + prompt.slice(0, 40),
        dimensions: { width: "80 cm", height: "120 cm", depth: "30 cm" },
        materials: [
          { item: "Eikefiner / plate 18 mm", quantity: "1 stk", note: "Standard plate" },
          { item: "Treglim", quantity: "1 tube" }
        ],
        cut_list: [
          { part: "Sider", dimensions: "120 x 30 cm", quantity: 2 },
          { part: "Hyller", dimensions: "76 x 30 cm", quantity: 4 },
          { part: "Topp/bunn", dimensions: "80 x 30 cm", quantity: 2 }
        ],
        assembly_steps: [
          "Kapp delene etter listen.",
          "Lim og skru sammen sidene med topp og bunn.",
          "Monter hyllene jevnt fordelt.",
          "Slip og behandle overflaten."
        ]
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content;
    const data = JSON.parse(content);
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message || 'Generering feilet' }, { status: 500 });
  }
}
