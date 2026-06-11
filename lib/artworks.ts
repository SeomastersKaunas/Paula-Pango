/**
 * Paula Pango — hardcoded artwork catalog (v1)
 * Prices are placeholders until client confirms real values.
 * Image mapping is temporary (image00001–12 → artworks 1–12).
 * Replace imageUrl paths once WebP-optimised files are prepared.
 */

export interface Artwork {
  id: string;
  slug: string;
  slugLt: string;
  title: string;
  titleLt: string;
  year: number;
  description: string;
  descriptionLt: string;
  widthCm: number;
  heightCm: number;
  medium: string;
  mediumLt: string;
  price: number; // EUR — placeholder
  imageUrl: string;
  sold: boolean;
}

const BASE_IMG = '/paula_assets/wetransfer_image_before_optimization';

export const artworks: Artwork[] = [
  {
    id: 'lady-with-an-ermine',
    slug: 'lady-with-an-ermine',
    slugLt: 'dama-su-seskele',
    title: 'Lady with an Ermine',
    titleLt: 'Dama su šeškele',
    year: 2026,
    description:
      'A copy of the Italian Renaissance artist Leonardo da Vinci\'s portrait Lady with an Ermine.',
    descriptionLt:
      'Italų renesanso menininko Leonardo da Vinci portreto „Dama su šeškele" kopija.',
    widthCm: 39,
    heightCm: 54,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 4800,
    imageUrl: `${BASE_IMG}/image00001.jpeg`,
    sold: false,
  },
  {
    id: 'anastasija',
    slug: 'anastasija',
    slugLt: 'anastasija',
    title: 'Anastasija',
    titleLt: 'Anastasija',
    year: 2026,
    description:
      'Quiet and reserved, yet witty and clever. She observes you from afar with a mysterious gaze and subtle smirk.',
    descriptionLt:
      'Tyli ir santūri, tačiau sumani ir gudri. Ji stebi tave iš tolo paslaptingu žvilgsniu ir subtilia šypsenėle.',
    widthCm: 30,
    heightCm: 40,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 2300,
    imageUrl: `${BASE_IMG}/image00002.jpeg`,
    sold: false,
  },
  {
    id: 'soul-mask',
    slug: 'soul-mask',
    slugLt: 'sielos-kaukė',
    title: 'Soul Mask',
    titleLt: 'Sielos kaukė',
    year: 2023,
    description:
      'Duality of the Soul. Her soul remains unfree, concealed within the shadows. Her face is hidden behind a mask she cannot remove. She lives a life she did not choose.',
    descriptionLt:
      'Sielos dvilypumas. Jos siela lieka nelaisva, paslėpta šešėliuose. Veidas slepiasi po kauke, kurios ji negali nuimti. Ji gyvena gyvenimą, kurio nepasrinko.',
    widthCm: 50,
    heightCm: 40,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 3700,
    imageUrl: `${BASE_IMG}/image00003.jpeg`,
    sold: false,
  },
  {
    id: 'the-observer',
    slug: 'the-observer',
    slugLt: 'stebetojas',
    title: 'The Observer',
    titleLt: 'Stebėtojas',
    year: 2022,
    description:
      'With a sharp and vigilant gaze, she silently observes from above, as though she possesses knowledge beyond what she chooses to reveal.',
    descriptionLt:
      'Aštriu ir budriu žvilgsniu ji tyliai stebi iš viršaus, tarsi turėdama žinių, daugiau nei ketina atskleisti.',
    widthCm: 50,
    heightCm: 40,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 3100,
    imageUrl: `${BASE_IMG}/image00004.jpeg`,
    sold: false,
  },
  {
    id: 'reach',
    slug: 'reach',
    slugLt: 'pasiekiamumas',
    title: 'Reach',
    titleLt: 'Pasiekiamumas',
    year: 2023,
    description:
      'Gone in an instant, like a gust of wind. Once so close, within reach, now so far and out of sight.',
    descriptionLt:
      'Dingo per akimirką, kaip vėjo gūsis. Kažkada taip arti, pasiekiama ranka, dabar taip toli ir nepastebima.',
    widthCm: 40,
    heightCm: 30,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 1900,
    imageUrl: `${BASE_IMG}/image00005.jpeg`,
    sold: false,
  },
  {
    id: 'the-rose',
    slug: 'the-rose',
    slugLt: 'rožė',
    title: 'The Rose',
    titleLt: 'Rožė',
    year: 2024,
    description: 'One-of-a-kind – mesmerising, delicate, and unforgettable.',
    descriptionLt: 'Nepakartojama – žavinga, subtili ir neužmirštama.',
    widthCm: 30,
    heightCm: 40,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 1600,
    imageUrl: `${BASE_IMG}/image00006.jpeg`,
    sold: false,
  },
  {
    id: 'elvis-presley',
    slug: 'elvis-presley',
    slugLt: 'elvis-presley',
    title: 'Elvis Presley',
    titleLt: 'Elvis Presley',
    year: 2025,
    description:
      '"Do something worth remembering." – Elvis Presley\nA portrait capturing his iconic presence and charisma as a defining figure of rock and roll, highlighting his expressive gaze and cultural impact.',
    descriptionLt:
      '„Padaryk kažką verto atminimo." – Elvis Presley\nPortretas, fiksuojantis jo ikonišką buvimą ir charizmą kaip apibrėžiančią roko ir rolo figūrą.',
    widthCm: 24,
    heightCm: 30,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 2700,
    imageUrl: `${BASE_IMG}/image00007.jpeg`,
    sold: false,
  },
  {
    id: 'bob-marley',
    slug: 'bob-marley',
    slugLt: 'bob-marley',
    title: 'Bob Marley',
    titleLt: 'Bob Marley',
    year: 2025,
    description:
      '"None but ourselves can free our minds." ― Bob Marley\nA portrait expressing his inner strength and spiritual presence as a symbol of peace, music, and unity.',
    descriptionLt:
      '„Niekas, išskyrus mus pačius, negali išlaisvinti mūsų protų." ― Bob Marley\nPortretas, perteikiantis jo vidinę stiprybę ir dvasinę buvimą kaip taikos, muzikos ir vienybės simbolio.',
    widthCm: 24,
    heightCm: 30,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 2700,
    imageUrl: `${BASE_IMG}/image00008.jpeg`,
    sold: false,
  },
  {
    id: 'marilyn-monroe',
    slug: 'marilyn-monroe',
    slugLt: 'marilyn-monroe',
    title: 'Marilyn Monroe',
    titleLt: 'Marilyn Monroe',
    year: 2025,
    description:
      '"Sometimes things fall apart so that better things can fall together." – Marilyn Monroe\nA portrait reflecting her timeless glamour and complex public image, balancing elegance with vulnerability.',
    descriptionLt:
      '„Kartais daiktai išyra tam, kad geresni daiktai galėtų susijungti." – Marilyn Monroe\nPortretas, atspindintis jos nelaikiną glamūrą ir sudėtingą viešąjį įvaizdį.',
    widthCm: 24,
    heightCm: 30,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 2900,
    imageUrl: `${BASE_IMG}/image00009.jpeg`,
    sold: false,
  },
  {
    id: 'chamomile',
    slug: 'chamomile',
    slugLt: 'ramunele',
    title: 'Chamomile',
    titleLt: 'Ramunėlė',
    year: 2023,
    description:
      'Majestic and strong, yet gentle and loyal. Her name was Chamomile.',
    descriptionLt:
      'Didinga ir stipri, tačiau švelni ir ištikima. Jos vardas buvo Ramunėlė.',
    widthCm: 40,
    heightCm: 50,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 3400,
    imageUrl: `${BASE_IMG}/image00010.jpeg`,
    sold: false,
  },
  {
    id: 'end-of-summer',
    slug: 'end-of-summer',
    slugLt: 'vasaros-pabaiga',
    title: 'End of Summer',
    titleLt: 'Vasaros pabaiga',
    year: 2025,
    description:
      'The sun shines warmly – the end of August. The same old oak and small bench still stand in my grandmother\'s garden, the place where countless childhood summers were spent.',
    descriptionLt:
      'Saulė šviečia šiltai – rugpjūčio pabaiga. Ta pati sena ąžuolas ir mažas suolelis vis dar stovi mano senelės sode – vietoje, kur buvo praleistos daugybė vaikystės vasarų.',
    widthCm: 40,
    heightCm: 30,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 2100,
    imageUrl: `${BASE_IMG}/image00011.jpeg`,
    sold: false,
  },
  {
    id: 'whisperer',
    slug: 'whisperer',
    slugLt: 'šnabzdetoja',
    title: 'Whisperer',
    titleLt: 'Šnabždetoja',
    year: 2021,
    description:
      'She holds a secret yet to be known. If you listen closely, you may hear her whispering in the still of the night.',
    descriptionLt:
      'Ji saugo paslaptį, kuriai dar lemta būti atskleistai. Jei klausysite atidžiai, galbūt išgirsite ją šnabždant tyloje.',
    widthCm: 50,
    heightCm: 40,
    medium: 'Oil on canvas',
    mediumLt: 'Aliejus ant drobės',
    price: 2600,
    imageUrl: `${BASE_IMG}/image00012.jpeg`,
    sold: false,
  },
];

/** Get a single artwork by its EN slug */
export function getArtworkBySlug(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug);
}

/** Get a single artwork by its LT slug */
export function getArtworkBySlugLt(slugLt: string): Artwork | undefined {
  return artworks.find((a) => a.slugLt === slugLt);
}
