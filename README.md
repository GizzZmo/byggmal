# ByggMål - DIY Blueprint Generator

AI-drevet app som genererer nøyaktige mål, materiallister og kuttelister for DIY-prosjekter.

## Funksjoner

- Beskriv prosjektet ditt (f.eks. "Bokhylle i eik, 120 cm høy, 80 cm bred")
- AI beregner dimensjoner, materialer og kutteliste
- Minimerer materialsvinn
- Eksporter som PDF (planlagt)
- Delelister for elektronikkprosjekter

## Teknologistakk

- Next.js 14 (App Router)
- React
- Tailwind CSS
- OpenAI API for AI-generering (structured JSON output)

## Kom i gang

1. Klon repoet
2. Installer avhengigheter: `npm install`
3. Lag `.env.local` med `OPENAI_API_KEY=din_nøkkel`
4. Kjør `npm run dev`
5. Åpne http://localhost:3000

## Eksempel på AI-respons

Se koden i `app/api/generate/route.js` for system-prompt og forventet format.

## Bidrag

Velkommen! Dette er en MVP.
