# ByggMål

**AI-drevet DIY Blueprint Generator** – få nøyaktige mål, materiallister og kuttelister for dine prosjekter på sekunder.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/GizzZmo/byggmal?style=social)](https://github.com/GizzZmo/byggmal)

![ByggMål App](https://raw.githubusercontent.com/GizzZmo/byggmal/main/assets/screenshot-main.png)

## Funksjoner

- **Prosjektbeskrivelse** – Skriv fritt eller velg ferdig mal (bokhylle, bord, Bluetooth-høytaler, skjenk, sengegavl)
- **AI-drevet dimensjonering** – Strukturert JSON med nøyaktige mål, materialer og monteringssteg
- **Kutteliste + optimering** – Automatisk estimat av antall standardplater (2440×1220 mm) med arealberegning
- **PDF-eksport** – Last ned komplett prosjekt som PDF (jspdf)
- **Lagring** – Prosjekter lagres lokalt i nettleseren (localStorage)
- **Demo-modus** – Fungerer uten OpenAI-nøkkel med eksempeldata

## Teknologistakk

- Next.js 14 (App Router)
- React 18 + Tailwind CSS
- OpenAI API (structured JSON output)
- jspdf for PDF-generering

## Skjermbilder

### Hovedskjerm med maler
![Hovedskjerm](https://raw.githubusercontent.com/GizzZmo/byggmal/main/assets/screenshot-main.png)

### Resultat med kuttliste og optimering
![Resultat](https://raw.githubusercontent.com/GizzZmo/byggmal/main/assets/screenshot-result.png)

### Lagrede prosjekter
![Lagrede](https://raw.githubusercontent.com/GizzZmo/byggmal/main/assets/screenshot-saved.png)

## Kom i gang

```bash
git clone https://github.com/GizzZmo/byggmal.git
cd byggmal
npm install
cp .env.example .env.local
# Legg inn OPENAI_API_KEY=sk-... i .env.local (valgfritt – demo fungerer uten)
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000)

## Deploy

Repoet er klart for Vercel. Koble det til din Vercel-konto for automatisk deploy ved push.

## Bidrag

Issues og pull requests er velkomne! Dette er en aktiv MVP.

---

Laget med ❤️ for hobbysnekkere og skapere.
