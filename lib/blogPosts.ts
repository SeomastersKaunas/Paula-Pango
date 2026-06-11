export interface BlogPost {
  id: string;
  slug: string;
  slugLt: string;
  title: string;
  titleLt: string;
  date: string; // ISO
  excerpt: string;
  excerptLt: string;
  content: string; // HTML string
  contentLt: string;
  imageUrl: string;
}

const BASE_IMG = '/paula_assets/wetransfer_image_before_optimization';

export const blogPosts: BlogPost[] = [
  {
    id: 'oil-painting-process',
    slug: 'oil-painting-process',
    slugLt: 'aliejiniu-darbu-kurimo-procesas',
    title: 'Inside My Process: How an Oil Painting Comes to Life',
    titleLt: 'Mano kūrybos procesas: kaip gimsta aliejinis paveikslas',
    date: '2026-05-10',
    excerpt:
      'From blank canvas to finished work — a look at how Paula approaches each new painting, from initial sketch to final brushstroke.',
    excerptLt:
      'Nuo tuščios drobės iki baigto kūrinio — kaip Paula artėja prie kiekvieno naujo paveikslo, nuo eskizo iki paskutinio teptuko potėpio.',
    imageUrl: `${BASE_IMG}/image00003.jpeg`,
    content: `<p>Every painting begins with a feeling. Before I pick up a brush, I spend time thinking — what do I want this piece to say? What emotion should linger after someone looks away?</p>
<p>Once the idea is clear, I sketch lightly on canvas with charcoal. I don't plan every detail; I leave room for the painting to evolve. Oil paint rewards patience — it dries slowly, which means mistakes can be corrected and layers can breathe.</p>
<p>The first layer, called the underpainting, is usually monochromatic. I use burnt umber or raw sienna to block in the shapes and values. This gives me a roadmap for everything that follows.</p>
<p>Layer by layer, colour comes in. I work wet-on-wet in some areas for soft blends, and wet-on-dry in others for sharp, defined edges. Portraits especially demand close attention — a few millimetres can change the entire expression of a face.</p>
<p>The last stage is glazing: transparent layers of oil mixed paint over dried sections, adding depth and luminosity that cannot be achieved any other way. This is where a painting truly comes alive.</p>
<p>If you have questions about my process or are curious about a specific work, feel free to reach out.</p>`,
    contentLt: `<p>Kiekvienas paveikslas prasideda nuo jausmo. Prieš paėmdama teptuką, skiriu laiko apmąstymams — ką šis kūrinys turėtų pasakyti? Kokią emociją paliks žiūrintysis?</p>
<p>Kai idėja aiški, ant drobės lengvai eskizuoju angimi. Neplanuoju kiekvienos detalės — palieku erdvę paveikslo evoliucijai. Aliejiniai dažai atlygina už kantrybę: jie džiūsta lėtai, todėl klaidas galima ištaisyti, o sluoksniai gali kvėpuoti.</p>
<p>Pirmasis sluoksnis, vadinamas gruntavimu, paprastai yra monochromatinis. Naudoju degintą umbrą arba žalią sieną, kad užblokuočiau formas ir vertes. Tai suteikia man kelrodį visam tolesniam darbui.</p>
<p>Sluoksnis po sluoksnio atsiranda spalva. Kai kuriose vietose dirbu šlapias-ant-šlapio, kad gautų minkštus perėjimus, kitur — šlapias-ant-sauso, siekiant aštrių, aiškių kraštų. Portretai ypač reikalauja dėmesio — keletas milimetrų gali pakeisti visą veido išraišką.</p>
<p>Paskutinis etapas — lazūravimas: skaidrūs aliejinių dažų sluoksniai ant džiūstančių sekcijų, suteikiantys gylio ir šviesos, kurių kitaip nepasieksi. Čia paveikslas tikrai atgyja.</p>
<p>Jei turite klausimų apie mano procesą ar domitės konkrečiu kūriniu, drąsiai susisiekite.</p>`,
  },
  {
    id: 'collecting-original-art',
    slug: 'collecting-original-art',
    slugLt: 'originalaus-meno-kolekcionavimas',
    title: 'Why Collect Original Art? A First-Time Buyer\'s Guide',
    titleLt: 'Kodėl verta kolekcionuoti originalų meną? Pradedančiųjų vadovas',
    date: '2026-04-18',
    excerpt:
      'Buying your first original painting is a meaningful step. Here\'s what to consider — and why it\'s worth it.',
    excerptLt:
      'Pirmojo originalaus paveikslo įsigijimas yra reikšmingas žingsnis. Štai ką reikia apsvarstyti ir kodėl verta.',
    imageUrl: `${BASE_IMG}/image00006.jpeg`,
    content: `<p>Buying original art for the first time can feel intimidating. With so many choices and no clear "price guide", it's hard to know where to start. But collecting art is one of the most rewarding decisions you can make for your home — and your wellbeing.</p>
<h2>What makes an original worth buying?</h2>
<p>Unlike prints, an original painting is unique. No other copy exists. It carries the physical marks of the artist's hand — impasto texture, brushwork, the slight imperfections that give it life. Over time, original works often hold or increase their value, especially from artists with a growing reputation.</p>
<h2>How to choose the right piece</h2>
<p>Start with what you love, not what you think you should love. Live with a painting in your mind before you buy it. Can you imagine waking up to it every morning? Does it bring something — calm, energy, wonder — into a room?</p>
<p>Size matters too. A small, intimate work can be as impactful as a large statement piece in the right setting.</p>
<h2>The practical side</h2>
<p>All paintings ship carefully packaged and insured. Certificates of authenticity are provided. If you have questions about a specific piece — dimensions, framing, shipping — just ask.</p>
<p>The first painting is always the hardest to buy. After that, you'll never stop.</p>`,
    contentLt: `<p>Pirmą kartą perkant originalų meną, gali kilti baimė. Su tiek daug pasirinkimų ir be aiškaus „kainų vadovo" sunku žinoti, nuo ko pradėti. Tačiau meno kolekcionavimas yra vienas iš labiausiai atlyginančių sprendimų, kurį galite priimti savo namams ir savijautai.</p>
<h2>Kas daro originalą vertą pirkimo?</h2>
<p>Skirtingai nuo atspaudų, originalus paveikslas yra unikalus. Kitos kopijos nėra. Jis nešioja fizinius menininko rankos pėdsakus — faktūrą, teptuko darbus, nedidelius netobulumas, suteikiančius jam gyvybės. Laikui bėgant, originalūs kūriniai dažnai išlaiko arba didina savo vertę.</p>
<h2>Kaip pasirinkti tinkamą kūrinį</h2>
<p>Pradėkite nuo to, ką mylite, o ne nuo to, ką manote turį mylėti. Pagyvenkite su paveikslu galvoje prieš pirkdami. Ar galite įsivaizduoti, kad kiekvieną rytą pabundate su juo? Ar jis atneša ką nors — ramybę, energiją, nuostabą — į kambarį?</p>
<h2>Praktinė pusė</h2>
<p>Visi paveikslai siunčiami kruopščiai supakuoti ir apdrausti. Pateikiami autentiškumo sertifikatai. Jei turite klausimų apie konkretų kūrinį — matmenis, rėminimą, pristatymą — tiesiog paklauskite.</p>
<p>Pirmasis paveikslas visada sunkiausias. Po to nebegalėsite sustoti.</p>`,
  },
  {
    id: 'kaunas-art-scene',
    slug: 'kaunas-art-scene',
    slugLt: 'kauno-meno-scena',
    title: 'Kaunas and Its Quiet Art Scene',
    titleLt: 'Kaunas ir jo tyli meno scena',
    date: '2026-03-05',
    excerpt:
      'Paula reflects on growing up and working as an artist in Kaunas, Lithuania\'s second city with a quietly thriving creative community.',
    excerptLt:
      'Paula pasakoja apie augimą ir kūrybą Kaune — antrajame Lietuvos mieste su tyliai klestinčia kūrybine bendruomene.',
    imageUrl: `${BASE_IMG}/image00011.jpeg`,
    content: `<p>Kaunas doesn't shout. It doesn't need to. The city carries a certain quiet confidence — wide boulevards, art deco facades, the confluence of two rivers — and underneath it all, a creative energy that is easy to miss if you're not looking.</p>
<p>I grew up here and still live and work here. My studio is a converted room with north-facing light — the best kind for painting, consistent and cool. From my window I can see the old town, and on clear days, the castle hill.</p>
<h2>A city for artists</h2>
<p>Kaunas has a long history with art. The M. K. Čiurlionis National Art Museum houses one of the country's most important collections. There are independent galleries, open studios, and a community of artists who genuinely support each other.</p>
<p>In recent years, the city has grown more confident in celebrating its creative scene. The European Capital of Culture designation in 2022 brought new energy and new audiences.</p>
<h2>Why I paint here</h2>
<p>Place shapes work. The muted palette of Lithuanian winters — grey skies, dark rivers, bare trees — has found its way into many of my paintings without me consciously choosing it. So has the quietness. The people here are reserved but warm, observant. I find that quality beautiful, and I try to paint it.</p>
<p>If you ever visit Kaunas, I hope you'll take time to look closely. There's more here than first appears.</p>`,
    contentLt: `<p>Kaunas nešaukia. Jam to nereikia. Miestas turi savotišką tylų pasitikėjimą — plačius prospektus, art deco fasadus, dviejų upių santaką — ir po visu tuo kūrybinę energiją, kurią lengva praleisti, jei neieškai.</p>
<p>Čia užaugau ir vis dar gyvenu bei dirbu. Mano studija — perstatytas kambarys su šiaurinės pusės šviesa — geriausia tapybai, pastovi ir vėsi. Pro langą matau senamiestį, o giedrą dieną — ir pilio kalną.</p>
<h2>Miestas menininkams</h2>
<p>Kauno ryšys su menu yra ilgas. M. K. Čiurlionio nacionalinis dailės muziejus saugo vieną svarbiausių šalies kolekcijų. Yra nepriklausomų galerijų, atvirų studijų ir menininkų bendruomenė, kuri tikrai remia vienas kitą.</p>
<h2>Kodėl tapau čia</h2>
<p>Vieta formuoja kūrybą. Lietuviškų žiemų prislopinta paletė — pilki dangūs, tamsios upės, plikų medžių siluetai — pateko į daugelį mano paveikslų, netgi be sąmoningo pasirinkimo. Taip pat ir tyla. Čia žmonės santūrūs, bet šilti, stebintys. Tą savybę laikau gražia ir stengiuosi ją pavaizduoti.</p>`,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostBySlugLt(slugLt: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slugLt === slugLt);
}
