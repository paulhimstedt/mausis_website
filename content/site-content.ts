export interface TimelineEntry {
  title: string;
  text: string;
}

export const siteContent = {
  eyebrow: "Unser erstes gemeinsames Jahr",
  heroTitle: "Ein Jahr mit Laura",
  heroDescription:
    "Zwölf Monate voller kleiner Abenteuer, großer Gefühle und unvergesslicher Momente. Diese Seite ist für dich.",
  ctaText: "Unsere Momente entdecken",
  timeline: [
    {
      title: "Der erste Funke",
      text: "Aus einem besonderen Moment wurde schnell eine Geschichte, die wir zusammen schreiben.",
    },
    {
      title: "Gemeinsame Abenteuer",
      text: "Von spontanen Ausflügen bis zu ruhigen Abenden: mit dir fühlt sich alles nach Zuhause an.",
    },
    {
      title: "Heute",
      text: "Ein Jahr später bin ich noch dankbarer, dich an meiner Seite zu haben.",
    },
  ] satisfies TimelineEntry[],
};
