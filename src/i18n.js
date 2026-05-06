// Centralised UI strings for PL / EN
// Slab data itself is bilingual via the data pipeline; this is for site chrome.
export const strings = {
  pl: {
    siteName: 'Golden Leaf Granit',
    tagline: 'Katalog płyt',
    nav: {
      catalogue: 'Katalog',
      contact: 'Kontakt'
    },
    catalogue: {
      title: 'Katalog płyt',
      subtitle: 'Aktualne stany magazynowe — ',
      filters: {
        material: 'Materiał',
        finish: 'Wykończenie',
        thickness: 'Grubość',
        status: 'Status',
        all: 'Wszystkie',
        clear: 'Wyczyść filtry'
      },
      results: {
        showing: 'Pokazano',
        of: 'z',
        slabs: 'płyt',
        none: 'Brak płyt spełniających kryteria.'
      },
      sortBy: 'Sortuj wg',
      sortOptions: {
        newest: 'Najnowsze',
        largest: 'Największe',
        material: 'Materiał (A–Z)'
      }
    },
    slab: {
      dimensions: 'Wymiary',
      area: 'Powierzchnia',
      thickness: 'Grubość',
      finish: 'Wykończenie',
      edge: 'Krawędź',
      origin: 'Pochodzenie',
      status: 'Status',
      received: 'Data przyjęcia',
      enquire: 'Zapytaj o tę płytę',
      callUs: 'Zadzwoń teraz',
      back: 'Wróć do katalogu',
      shareWhatsApp: 'Udostępnij na WhatsApp',
      sold: 'SPRZEDANY',
      reserved: 'ZAREZERWOWANY'
    },
    contact: {
      title: 'Kontakt',
      lead: 'Jesteśmy bezpośrednim importerem i hurtowym dostawcą płyt granitowych dla zakładów kamieniarskich. Skontaktuj się w sprawie zapytania ofertowego lub wizyty w magazynie w Nowej Dębowej Woli.',
      phone: 'Telefon',
      email: 'E-mail',
      address: 'Adres',
      hours: 'Godziny otwarcia',
      hoursValue: 'Pn–Pt 8:00–17:00, Sb na umówienie',
      formTitle: 'Wyślij zapytanie',
      form: {
        company: 'Firma',
        name: 'Imię i nazwisko',
        phone: 'Telefon',
        email: 'E-mail (opcjonalnie)',
        slabIds: 'Płyty (numery)',
        message: 'Wiadomość',
        submit: 'Wyślij zapytanie',
        required: 'wymagane'
      }
    },
    footer: {
      copyright: '© Golden Leaf Granit Sp. z o.o.'
    }
  },
  en: {
    siteName: 'Golden Leaf Granit',
    tagline: 'Slab catalogue',
    nav: {
      catalogue: 'Catalogue',
      contact: 'Contact'
    },
    catalogue: {
      title: 'Slab catalogue',
      subtitle: 'Current stock — ',
      filters: {
        material: 'Material',
        finish: 'Finish',
        thickness: 'Thickness',
        status: 'Status',
        all: 'All',
        clear: 'Clear filters'
      },
      results: {
        showing: 'Showing',
        of: 'of',
        slabs: 'slabs',
        none: 'No slabs match these filters.'
      },
      sortBy: 'Sort by',
      sortOptions: {
        newest: 'Newest',
        largest: 'Largest',
        material: 'Material (A–Z)'
      }
    },
    slab: {
      dimensions: 'Dimensions',
      area: 'Area',
      thickness: 'Thickness',
      finish: 'Finish',
      edge: 'Edge',
      origin: 'Origin',
      status: 'Status',
      received: 'Received',
      enquire: 'Enquire about this slab',
      callUs: 'Call us now',
      back: 'Back to catalogue',
      shareWhatsApp: 'Share on WhatsApp',
      sold: 'SOLD',
      reserved: 'RESERVED'
    },
    contact: {
      title: 'Contact',
      lead: 'We are a direct importer and wholesale supplier of granite slabs to monument workshops and stonemasons. Get in touch for a quote or to arrange a warehouse visit in Nowa Dębowa Wola.',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      hours: 'Opening hours',
      hoursValue: 'Mon–Fri 8:00–17:00, Sat by appointment',
      formTitle: 'Send an enquiry',
      form: {
        company: 'Company',
        name: 'Your name',
        phone: 'Phone',
        email: 'Email (optional)',
        slabIds: 'Slab IDs',
        message: 'Message',
        submit: 'Send enquiry',
        required: 'required'
      }
    },
    footer: {
      copyright: '© Golden Leaf Granit Sp. z o.o.'
    }
  }
};

export function t(lang) {
  return strings[lang] || strings.pl;
}
