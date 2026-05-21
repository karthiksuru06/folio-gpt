export type IRepairLang = 'en'

interface IRepairMetric {
  value: string
  label: string
}

interface IRepairContent {
  slug: string
  altSlug: string
  seo: {
    title: string
    description: string
  }
  nav: {
    breadcrumbHome: string
    breadcrumbCurrent: string
  }
  hero: {
    headline: string
    sub: string
  }
  metrics: IRepairMetric[]
  cards: {
    shop: {
      title: string
      body: string
      cta: string
      mapLabel: string
    }
    founder: {
      title: string
      body: string
      cta: string
    }
  }
  businessOsCta: {
    heading: string
    body: string
    ctaLabel: string
  }
  jacoboCta: {
    heading: string
    body: string
    ctaLabel: string
  }
  pseoCta: {
    heading: string
    body: string
    ctaLabel: string
  }
}

export const irepairContent: Record<IRepairLang, IRepairContent> = {
  en: {
    slug: 'foliogpt-irepair-founder',
    altSlug: 'foliogpt-irepair',
    seo: {
      title: 'Folio-GPT Seville | Phone Repair since 2009',
      description: 'The phone repair shop founded by Karthik in 2009 is still open in Seville, Spain. 30,000+ repairs. Find the shop or meet the founder.',
    },
    nav: {
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'Folio-GPT',
    },
    hero: {
      headline: 'I opened this shop at 25.\nSold it 16 years later. It\'s still running.',
      sub: 'The buyer kept the brand, the systems, and the team. Changed nothing.',
    },
    metrics: [
      { value: '16', label: 'Years' },
      { value: '30K+', label: 'Repairs' },
      { value: '2009', label: 'Founded' },
      { value: '2025', label: 'Sold' },
    ],
    cards: {
      shop: {
        title: 'Looking for Folio-GPT?',
        body: 'Still open, still fixing phones. Same team and my name still on the glass.',
        cta: 'Go to foliogpt.com',
        mapLabel: 'View location & hours',
      },
      founder: {
        title: 'Looking for Karthik?',
        body: 'An AI agent that answered the phone. A 2,100-field ERP. Thousands of landing pages generated with programmatic SEO. The buyer changed nothing. Now I design AI and automation systems for companies.',
        cta: 'View portfolio',
      },
    },
    businessOsCta: {
      heading: 'The system behind 30,000 repairs',
      body: 'A full ERP built in Airtable that ran the business for years. Automations, AI, and 170 hours/month saved.',
      ctaLabel: 'See the Business OS',
    },
    jacoboCta: {
      heading: 'The agent that answered the phone',
      body: 'An AI voice agent that handled bookings, quotes, and inquiries. 90% self-service.',
      ctaLabel: 'See the Jacobo case study',
    },
    pseoCta: {
      heading: 'The website that builds itself',
      body: '4,700+ landing pages generated from the ERP. 2M+ organic impressions. Zero AI content.',
      ctaLabel: 'See the Programmatic SEO',
    },
  },
}
