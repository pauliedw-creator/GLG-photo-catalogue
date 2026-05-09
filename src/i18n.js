// Centralised UI strings for PL / EN
// Slab data itself is bilingual via the data pipeline; this is for site chrome.
export const strings = {
  pl: {
    siteName: 'Golden Leaf Granit',
    siteNameFull: 'Golden Leaf Granit Sp. z o.o',
    tagline: 'Katalog pÅ‚yt',
    nav: {
      catalogue: 'Katalog',
      contact: 'Kontakt'
    },
    catalogue: {
      title: 'Katalog pÅ‚yt',
      subtitle: 'Aktualne stany magazynowe â€” ',
      filters: {
        search: 'Szukaj',
        searchPlaceholder: 'Nazwa materiaÅ‚u, ID pÅ‚ytyâ€¦',
        material: 'MateriaÅ‚',
        stoneType: 'Rodzaj kamienia',
        colour: 'Kolor',
        finish: 'WykoÅ„czenie',
        thickness: 'GruboÅ›Ä‡',
        status: 'Status',
        all: 'Wszystkie',
        clear: 'WyczyÅ›Ä‡ filtry'
      },
      results: {
        showing: 'Pokazano',
        of: 'z',
        slabs: 'pÅ‚yt',
        none: 'Brak pÅ‚yt speÅ‚niajÄ…cych kryteria.'
      },
      sortBy: 'Sortuj wg',
      sortOptions: {
        newest: 'Najnowsze',
        largest: 'NajwiÄ™ksze',
        material: 'MateriaÅ‚ (Aâ€“Z)'
      }
    },
    slab: {
      dimensions: 'Wymiary',
      area: 'Powierzchnia',
      thickness: 'GruboÅ›Ä‡',
      stoneType: 'Rodzaj kamienia',
      colour: 'Kolor',
      finish: 'WykoÅ„czenie',
      edge: 'KrawÄ™dÅº',
      origin: 'Pochodzenie',
      status: 'Status',
      received: 'Data przyjÄ™cia',
      enquire: 'Zapytaj o tÄ™ pÅ‚ytÄ™',
      callUs: 'ZadzwoÅ„ teraz',
      back: 'WrÃ³Ä‡ do katalogu',
      shareWhatsApp: 'UdostÄ™pnij na WhatsApp',
      sold: 'SPRZEDANY',
      reserved: 'ZAREZERWOWANY'
    },
    contact: {
      title: 'Kontakt',
      lead: 'JesteÅ›my bezpoÅ›rednim importerem i hurtowym dostawcÄ… pÅ‚yt granitowych dla zakÅ‚adÃ³w kamieniarskich. Skontaktuj siÄ™ w sprawie zapytania ofertowego lub wizyty w magazynie w Nowej DÄ™bowej Woli.',
      phone: 'Telefon',
      email: 'E-mail',
      address: 'Adres',
      hours: 'Godziny otwarcia',
      hoursValue: 'Pnâ€“Pt 8:00â€“17:00, Sb na umÃ³wienie',
      formTitle: 'WyÅ›lij zapytanie',
      form: {
        company: 'Firma',
        name: 'ImiÄ™ i nazwisko',
        phone: 'Telefon',
        email: 'E-mail (opcjonalnie)',
        slabIds: 'PÅ‚yty (numery)',
        message: 'WiadomoÅ›Ä‡',
        submit: 'WyÅ›lij zapytanie',
        required: 'wymagane'
      }
    },
    footer: {
      copyright: 'Â© Golden Leaf Granit Sp. z o.o.'
    }
  },
  en: {
    siteName: 'Golden Leaf Granit',
    siteNameFull: 'Golden Leaf Granit Sp. z o.o',
    tagline: 'Slab Catalogue',
    nav: {
      catalogue: 'Catalogue',
      contact: 'Contact'
    },
    catalogue: {
      title: 'Slab Catalogue',
      subtitle: 'Current Stock â€” ',
      filters: {
        search: 'Search',
        searchPlaceholder: 'Material name, slab IDâ€¦',
        material: 'Material',
        stoneType: 'Stone Type',
        colour: 'Colour',
        finish: 'Finish',
        thickness: 'Thickness',
        status: 'Status',
        all: 'All',
        clear: 'Clear Filters'
      },
      results: {
        showing: 'Showing',
        of: 'of',
        slabs: 'slabs',
        none: 'No Slabs Match These Filters.'
      },
      sortBy: 'Sort By',
      sortOptions: {
        newest: 'Newest',
        largest: 'Largest',
        material: 'Material (Aâ€“Z)'
      }
    },
    slab: {
      dimensions: 'Dimensions',
      area: 'Area',
      thickness: 'Thickness',
      stoneType: 'Stone Type',
      colour: 'Colour',
      finish: 'Finish',
      edge: 'Edge',
      origin: 'Origin',
      status: 'Status',
      received: 'Received',
      enquire: 'Enquire About This Slab',
      callUs: 'Call Us Now',
      back: 'Back to Catalogue',
      shareWhatsApp: 'Share on WhatsApp',
      sold: 'SOLD',
      reserved: 'RESERVED'
    },
    contact: {
      title: 'Contact',
      lead: 'We are a direct importer and wholesale supplier of granite slabs to monument workshops and stonemasons. Get in touch for a quote or to arrange a warehouse visit in Nowa DÄ™bowa Wola.',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      hours: 'Opening Hours',
      hoursValue: 'Monâ€“Fri 8:00â€“17:00, Sat by Appointment',
      formTitle: 'Send an Enquiry',
      form: {
        company: 'Company',
        name: 'Your Name',
        phone: 'Phone',
        email: 'Email (optional)',
        slabIds: 'Slab IDs',
        message: 'Message',
        submit: 'Send Enquiry',
        required: 'required'
      }
    },
    footer: {
      copyright: 'Â© Golden Leaf Granit Sp. z o.o.'
    }
  }
};

export function t(lang) {
  return strings[lang] || strings.pl;
}
