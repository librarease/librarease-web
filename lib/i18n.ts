import type { Metadata } from 'next'
import type { Route } from 'next'
import { SITE_NAME } from '@/lib/consts'

export const locales = ['en', 'my'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'
export const LOCALE_HEADER = 'x-librarease-locale'

const localizedPaths = [
  '/',
  '/about',
  '/terms',
  '/privacy',
  '/login',
  '/signup',
  '/forgot-password',
] as const
export type LocalizedPath = (typeof localizedPaths)[number]

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function isLocalizedPublicPath(
  value: string,
): value is LocalizedPath {
  return localizedPaths.includes(value as LocalizedPath)
}

export function localizePath(
  locale: Locale,
  path: LocalizedPath,
): Route {
  if (path === '/') {
    return `/${locale}` as Route
  }

  return `/${locale}${path}` as Route
}

export function getLocalizedUrl(
  locale: Locale,
  path: LocalizedPath,
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!baseUrl) {
    return localizePath(locale, path)
  }

  return new URL(localizePath(locale, path), baseUrl).toString()
}

export function getLocaleAlternates(
  locale: Locale,
  path: LocalizedPath,
) {
  return {
    canonical: getLocalizedUrl(locale, path),
    languages: {
      en: getLocalizedUrl('en', path),
      my: getLocalizedUrl('my', path),
    },
  }
}

type MetadataCopy = {
  title: string
  description: string
}

type LandingCard = {
  title: string
  description: string
}

type LandingStat = {
  value: string
  label: string
}

type LandingDictionary = {
  brand: string
  nav: {
    forLibraries: string
    forReaders: string
    exploreBooks: string
    signIn: string
    getStarted: string
  }
  hero: {
    title: string
    accent: string
    description: string
    primaryCta: string
    secondaryCta: string
  }
  stats: LandingStat[]
  forLibraries: {
    eyebrow: string
    title: string
    items: LandingCard[]
  }
  forReaders: {
    eyebrow: string
    title: string
    items: LandingCard[]
  }
  cta: {
    readerTitle: string
    readerDescription: string
    readerButton: string
    libraryTitle: string
    libraryDescription: string
    libraryButton: string
  }
  footer: {
    exploreBooks: string
    terms: string
    privacy: string
    signIn: string
    copyright: string
  }
}

type AboutDictionary = {
  backToHome: string
  title: string
  paragraphs: string[]
}

type LegalDictionary = {
  backToHome: string
  html: string
}

type Dictionary = {
  meta: {
    home: MetadataCopy
    about: MetadataCopy
    terms: MetadataCopy
    privacy: MetadataCopy
    login: MetadataCopy
    signup: MetadataCopy
    forgotPassword: MetadataCopy
  }
  landing: LandingDictionary
  about: AboutDictionary
  terms: LegalDictionary
  privacy: LegalDictionary
  auth: {
    login: {
      title: string
      description: string
      emailLabel: string
      emailPlaceholder: string
      passwordLabel: string
      passwordPlaceholder: string
      showPassword: string
      forgotPassword: string
      submit: string
      signupPrompt: string
      signupLink: string
    }
    signup: {
      title: string
      description: string
      nameLabel: string
      namePlaceholder: string
      emailLabel: string
      emailPlaceholder: string
      passwordLabel: string
      passwordPlaceholder: string
      submit: string
      loginPrompt: string
      loginLink: string
    }
    forgotPassword: {
      title: string
      description: string
      emailLabel: string
      emailPlaceholder: string
      backToLogin: string
      submit: string
      signupPrompt: string
      signupLink: string
    }
  }
}

export type LandingCopy = LandingDictionary

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    meta: {
      home: {
        title: SITE_NAME,
        description:
          'Modern library management for librarians and readers with a smoother borrowing experience.',
      },
      about: {
        title: `About · ${SITE_NAME}`,
        description:
          'Learn what LibrarEase offers for library teams and readers.',
      },
      terms: {
        title: `Terms · ${SITE_NAME}`,
        description: 'Terms and conditions for using LibrarEase.',
      },
      privacy: {
        title: `Privacy · ${SITE_NAME}`,
        description: 'Privacy information for LibrarEase users and libraries.',
      },
      login: {
        title: `Login · ${SITE_NAME}`,
        description: 'Log in to your LibrarEase account.',
      },
      signup: {
        title: `Signup · ${SITE_NAME}`,
        description: 'Create your LibrarEase account.',
      },
      forgotPassword: {
        title: `Forgot Password · ${SITE_NAME}`,
        description: 'Reset access to your LibrarEase account.',
      },
    },
    landing: {
      brand: 'Librarease',
      nav: {
        forLibraries: 'For Libraries',
        forReaders: 'For Readers',
        exploreBooks: 'Explore Books',
        signIn: 'Sign in',
        getStarted: 'Get started',
      },
      hero: {
        title: 'Your library,',
        accent: 'connected.',
        description:
          'Experience a modern library ecosystem built for smooth operations and a better borrowing experience. Smart management for librarians and effortless access for readers.',
        primaryCta: 'Get started free',
        secondaryCta: 'Browse books',
      },
      stats: [
        { value: '50+', label: 'Libraries' },
        { value: '10,000+', label: 'Active Members' },
        { value: '200,000+', label: 'Books' },
        { value: '99.9%', label: 'Uptime' },
      ],
      forLibraries: {
        eyebrow: 'For Libraries',
        title: 'Everything you need to run a modern library.',
        items: [
          {
            title: 'Organize your collection',
            description:
              'Add books with cover art and details. Import your existing catalog in bulk with a CSV file.',
          },
          {
            title: 'Manage memberships',
            description:
              'Create plans with custom loan limits, borrow periods, and fine rates. Members subscribe and start borrowing.',
          },
          {
            title: "See what's happening",
            description:
              'A clear picture of borrowing activity, popular titles, and revenue updated in real time.',
          },
          {
            title: 'Built for your whole team',
            description:
              'Give staff access to handle day-to-day borrowing and returns, while admins keep full oversight.',
          },
        ],
      },
      forReaders: {
        eyebrow: 'For Readers',
        title: 'Borrow books and keep track of your reading.',
        items: [
          {
            title: 'Browse available books',
            description:
              "Explore your library's collection and see what's available before you visit.",
          },
          {
            title: 'Track your borrows',
            description:
              "Know exactly what you have out, when it's due, and your full borrowing history.",
          },
          {
            title: 'Stay on top of due dates',
            description:
              "Get notified before a book is due so you never pay a fine you didn't expect.",
          },
          {
            title: 'Leave a review',
            description:
              "Share your thoughts on books you've read and help other members find their next favourite.",
          },
        ],
      },
      cta: {
        readerTitle: 'Just here to read?',
        readerDescription:
          'Browse books across all libraries on Librarease. No account needed to explore.',
        readerButton: 'Explore books',
        libraryTitle: 'Running a library?',
        libraryDescription:
          'Set up your library on Librarease in minutes. Manage your collection, members, and borrowing all in one place.',
        libraryButton: 'Get started free',
      },
      footer: {
        exploreBooks: 'Explore Books',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        signIn: 'Sign in',
        copyright: '© {year} Librarease',
      },
    },
    about: {
      backToHome: 'Back to Home',
      title: 'About LibrarEase',
      paragraphs: [
        'LibrarEase is a modern library management platform built to make libraries easier to run and more enjoyable to use. It gives libraries of all sizes one place to manage books, memberships, subscriptions, and borrowing activities.',
        'For librarians, LibrarEase provides practical tools to organize collections, track borrowing and return history, and manage memberships with less manual work. Teams can assign admin and staff roles, send notifications, and keep day-to-day operations moving smoothly.',
        'For readers and members, LibrarEase makes borrowing simple and accessible. Users can explore collections, subscribe through library memberships, receive timely notifications, and keep track of their activity in one place.',
        'Fast, reliable, and easy to use, LibrarEase brings together the essentials for a better library experience for both library teams and readers.',
      ],
    },
    terms: {
      backToHome: 'Back to Home',
      html: `
        <h1>Terms of Service</h1>
        <p>These terms govern your access to and use of LibrarEase. By using the service, you agree to use it in a lawful manner and to follow these terms.</p>
        <h2>Accounts and Access</h2>
        <p>You are responsible for the accuracy of the information associated with your account and for keeping your access credentials secure.</p>
        <h2>Library Data</h2>
        <p>Libraries remain responsible for the books, member records, and operational data they manage through LibrarEase. You should only upload data you are allowed to manage.</p>
        <h2>Acceptable Use</h2>
        <p>You may not misuse the service, attempt to disrupt availability, or access data that you do not have permission to view.</p>
        <h2>Service Changes</h2>
        <p>We may update, improve, or discontinue features from time to time. When material changes are made, we will aim to communicate them clearly.</p>
        <h2>Contact</h2>
        <p>If you have questions about these terms, contact the LibrarEase team through the support channels provided by your library or deployment owner.</p>
      `,
    },
    privacy: {
      backToHome: 'Back to Home',
      html: `
        <h1>Privacy Policy</h1>
        <p>This policy explains how LibrarEase handles information used to provide library services and the borrowing experience.</p>
        <h2>Information We Process</h2>
        <p>LibrarEase may process account details, membership information, borrowing history, notifications, and library catalog data in order to operate the service.</p>
        <h2>How Information Is Used</h2>
        <p>We use information to provide core product features such as catalog browsing, borrowing workflows, notifications, staff administration, and reporting.</p>
        <h2>Access and Sharing</h2>
        <p>Access to information should be limited to authorized users such as library admins, staff, and the relevant member account owner. Information should not be shared outside those purposes without a valid reason.</p>
        <h2>Retention</h2>
        <p>Libraries and deployment owners are responsible for deciding how long operational records should be retained in line with their policies and legal obligations.</p>
        <h2>Contact</h2>
        <p>If you have questions about privacy practices for a specific library deployment, contact the library or service owner responsible for that deployment.</p>
      `,
    },
    auth: {
      login: {
        title: 'Login',
        description: 'Enter your email below to log in to your account',
        emailLabel: 'Email',
        emailPlaceholder: 'e.g. mgmg@example.com',
        passwordLabel: 'Password',
        passwordPlaceholder: 'e.g. mypassword',
        showPassword: 'Show Password',
        forgotPassword: 'Forgot your password?',
        submit: 'Login',
        signupPrompt: "Don't have an account?",
        signupLink: 'Sign up',
      },
      signup: {
        title: 'Sign Up',
        description: 'Enter your information below to create your account',
        nameLabel: 'Name',
        namePlaceholder: 'e.g. Mg Mg',
        emailLabel: 'Email',
        emailPlaceholder: 'e.g. mgmg@example.com',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Set a password',
        submit: 'Sign Up',
        loginPrompt: 'Already have an account?',
        loginLink: 'Login',
      },
      forgotPassword: {
        title: 'Forgot Password',
        description: 'Enter your email to reset your password',
        emailLabel: 'Email',
        emailPlaceholder: 'e.g. mgmg@example.com',
        backToLogin: 'Remember your password?',
        submit: 'Reset Password',
        signupPrompt: "Don't have an account?",
        signupLink: 'Sign up',
      },
    },
  },
  my: {
    meta: {
      home: {
        title: `${SITE_NAME} | မြန်မာ`,
        description:
          'စာကြည့်တိုက်လုပ်ငန်းစဉ်များကို ပိုမိုစနစ်တကျ စီမံနိုင်ပြီး အသုံးပြုသူအတွေ့အကြုံကို မြှင့်တင်ပေးသော LibrarEase platform ။',
      },
      about: {
        title: `LibrarEase အကြောင်း · ${SITE_NAME}`,
        description:
          'LibrarEase က စာကြည့်တိုက်အဖွဲ့များနှင့် အသုံးပြုသူများအတွက် ပံ့ပိုးပေးသည့် အဓိကစွမ်းဆောင်ရည်များကို လေ့လာပါ။',
      },
      terms: {
        title: `စည်းကမ်းချက်များ · ${SITE_NAME}`,
        description: 'LibrarEase ဝန်ဆောင်မှုကို အသုံးပြုရာတွင် လိုက်နာရမည့် စည်းကမ်းချက်များ။',
      },
      privacy: {
        title: `ကိုယ်ရေးအချက်အလက် · ${SITE_NAME}`,
        description:
          'LibrarEase တွင် ကိုယ်ရေးအချက်အလက်များကို မည်သို့ ကိုင်တွယ်အသုံးပြုသည်ကို ရှင်းပြထားသော အချက်အလက်များ။',
      },
      login: {
        title: `ဝင်ရန် · ${SITE_NAME}`,
        description: 'သင့် LibrarEase အကောင့်သို့ ဝင်ရောက်ရန် အချက်အလက်များ ဖြည့်သွင်းပါ။',
      },
      signup: {
        title: `အကောင့်ဖွင့်ရန် · ${SITE_NAME}`,
        description: 'LibrarEase အကောင့်အသစ်တစ်ခု ဖန်တီးရန် အချက်အလက်များ ဖြည့်သွင်းပါ။',
      },
      forgotPassword: {
        title: `စကားဝှက်မေ့သွားပါသလား · ${SITE_NAME}`,
        description: 'သင့်အကောင့်ဝင်ရောက်ခွင့် ပြန်လည်ရယူရန် အီးမေးလ်လိပ်စာ ဖြည့်သွင်းပါ။',
      },
    },
    landing: {
      brand: 'Librarease',
      nav: {
        forLibraries: 'စာကြည့်တိုက်များအတွက်',
        forReaders: 'စာဖတ်သူများအတွက်',
        exploreBooks: 'စာအုပ်များကြည့်ရှုရန်',
        signIn: 'ဝင်ရန်',
        getStarted: 'စတင်အသုံးပြုပါ',
      },
      hero: {
        title: 'စာကြည့်တိုက်လုပ်ငန်းကို',
        accent: 'ပိုမိုချောမွေ့စွာ လည်ပတ်ပါ။',
        description:
          'LibrarEase သည် စာကြည့်တိုက်အုပ်ချုပ်မှု၊ အသင်းဝင်စီမံခန့်ခွဲမှုနှင့် စာအုပ်ငှားရမ်းမှုလုပ်ငန်းစဉ်များကို တစ်နေရာတည်းတွင် ထိရောက်စွာ စီမံနိုင်စေရန် တည်ဆောက်ထားသော ခေတ်မီ platform ဖြစ်သည်။ ဝန်ထမ်းများအတွက် လုပ်ငန်းစဉ်ပိုင်းကို လွယ်ကူစေသလို စာဖတ်သူများအတွက်လည်း အသုံးပြုရလွယ်ကူသော အတွေ့အကြုံကို ပေးစွမ်းပါသည်။',
        primaryCta: 'အခမဲ့ စတင်ပါ',
        secondaryCta: 'စာအုပ်များ ကြည့်ရှုပါ',
      },
      stats: [
        { value: '50+', label: 'စာကြည့်တိုက်များ' },
        { value: '10,000+', label: 'အသုံးပြုသူအဖွဲ့ဝင်များ' },
        { value: '200,000+', label: 'စာအုပ်များ' },
        { value: '99.9%', label: 'စနစ်တည်ငြိမ်ချိန်' },
      ],
      forLibraries: {
        eyebrow: 'စာကြည့်တိုက်များအတွက်',
        title: 'ခေတ်မီစာကြည့်တိုက်တစ်ခုကို စနစ်တကျ လည်ပတ်နိုင်ရန် လိုအပ်သမျှ အားလုံး။',
        items: [
          {
            title: 'စာအုပ်စုစည်းမှုကို စနစ်တကျ စီမံပါ',
            description:
              'စာအုပ်အချက်အလက်များ၊ အုပ်အဖုံးပုံများနှင့် catalog data များကို စနစ်တကျ မှတ်တမ်းတင်နိုင်ပြီး CSV ဖြင့် အစုလိုက် တင်သွင်းနိုင်သည်။',
          },
          {
            title: 'အသင်းဝင်အစီအစဉ်များကို ထိရောက်စွာ စီမံပါ',
            description:
              'ငှားရမ်းအရေအတွက်ကန့်သတ်ချက်၊ ပြန်အပ်ချိန်နှင့် ဒဏ်ကြေးနှုန်းများကို သတ်မှတ်ထားသော membership plan များကို လွယ်ကူစွာ ဖန်တီးနိုင်သည်။',
          },
          {
            title: 'လုပ်ငန်းအခြေအနေကို မြင်သာစွာ ခြေရာခံပါ',
            description:
              'ငှားရမ်းမှုလှုပ်ရှားမှုများ၊ လူကြိုက်များသော စာအုပ်များနှင့် အဓိကစာရင်းအင်းများကို အချိန်နှင့်တပြေးညီ ကြည့်ရှုနိုင်သည်။',
          },
          {
            title: 'အဖွဲ့လိုက် အသုံးပြုရန် အဆင်ပြေသည်',
            description:
              'နေ့စဉ်လုပ်ငန်းများအတွက် staff access ခွဲဝေပေးနိုင်ပြီး admin များက စနစ်တကျ ကြီးကြပ်စီမံနိုင်သည်။',
          },
        ],
      },
      forReaders: {
        eyebrow: 'စာဖတ်သူများအတွက်',
        title: 'စာအုပ်များကို အဆင်ပြေစွာ ရှာဖွေငှားရမ်းပြီး သင့်ဖတ်ရှုမှုကို စနစ်တကျ လိုက်ကြည့်ပါ။',
        items: [
          {
            title: 'ရရှိနိုင်သော စာအုပ်များကို လွယ်ကူစွာ ရှာဖွေပါ',
            description:
              'စာကြည့်တိုက်သို့ မသွားမီ စုစည်းမှုအတွင်းရှိ စာအုပ်များနှင့် လက်ရှိရရှိနိုင်မှုအခြေအနေကို ကြိုတင်ကြည့်ရှုနိုင်သည်။',
          },
          {
            title: 'သင်ငှားထားသော စာအုပ်များကို စနစ်တကျ လိုက်ကြည့်ပါ',
            description:
              'လက်ရှိငှားထားသောစာအုပ်များ၊ ပြန်အပ်ရမည့်နေ့စွဲများနှင့် ယခင်ငှားရမ်းမှတ်တမ်းများကို တစ်နေရာတည်းတွင် ကြည့်ရှုနိုင်သည်။',
          },
          {
            title: 'ပြန်အပ်ရက်များကို အချိန်မီ သိရှိနိုင်ပါစေ',
            description:
              'ပြန်အပ်ရက်မတိုင်မီ သတိပေးချက်များ ရရှိနိုင်သဖြင့် မလိုအပ်သော နောက်ကျဒဏ်ကြေးများကို လျှော့ချနိုင်သည်။',
          },
          {
            title: 'ဖတ်ပြီးသော စာအုပ်များကို သုံးသပ်ချက်ပေးပါ',
            description:
              'သင့်အမြင်နှင့် ဖတ်ရှုမှုအတွေ့အကြုံကို မျှဝေခြင်းဖြင့် အခြားစာဖတ်သူများအတွက် အသုံးဝင်သော အကြံပြုချက်များ ပေးနိုင်သည်။',
          },
        ],
      },
      cta: {
        readerTitle: 'စာဖတ်ဖို့ ရှာဖွေနေပါသလား?',
        readerDescription:
          'Librarease ပေါ်ရှိ စာကြည့်တိုက်များ၏ စာအုပ်စုစည်းမှုများကို အကောင့်မလိုဘဲ ကြည့်ရှုနိုင်သည်။',
        readerButton: 'စာအုပ်များ ကြည့်ရှုပါ',
        libraryTitle: 'သင်၏စာကြည့်တိုက်ကို စတင်စီမံလိုပါသလား?',
        libraryDescription:
          'မိနစ်ပိုင်းအတွင်း LibrarEase ပေါ်တွင် သင့်စာကြည့်တိုက်ကို စတင်နိုင်ပြီး စာအုပ်စုစည်းမှု၊ အသင်းဝင်များနှင့် ငှားရမ်းမှုလုပ်ငန်းစဉ်များကို တစ်နေရာတည်းမှာ စီမံနိုင်သည်။',
        libraryButton: 'အခမဲ့ စတင်ပါ',
      },
      footer: {
        exploreBooks: 'စာအုပ်များ ကြည့်ရှုပါ',
        terms: 'အသုံးပြုမှု စည်းကမ်းချက်များ',
        privacy: 'ကိုယ်ရေးအချက်အလက် မူဝါဒ',
        signIn: 'ဝင်ရန်',
        copyright: '© {year} Librarease',
      },
    },
    about: {
      backToHome: 'ပင်မသို့ ပြန်သွားရန်',
      title: 'LibrarEase အကြောင်း',
      paragraphs: [
        'LibrarEase သည် စာကြည့်တိုက်လုပ်ငန်းစဉ်များကို ပိုမိုစနစ်တကျ၊ ပိုမိုထိရောက်စွာ စီမံနိုင်ရန် ရည်ရွယ်ဖန်တီးထားသော ခေတ်မီ စာကြည့်တိုက်စီမံခန့်ခွဲမှု platform တစ်ခုဖြစ်သည်။ စာအုပ်စုစည်းမှု၊ အသင်းဝင်စီမံခန့်ခွဲမှု၊ subscription အစီအစဉ်များနှင့် ငှားရမ်းမှုလုပ်ငန်းစဉ်များကို တစ်နေရာတည်းတွင် စုပေါင်းစီမံနိုင်သည်။',
        'စာကြည့်တိုက်အဖွဲ့များအတွက် LibrarEase သည် catalog စီမံခန့်ခွဲမှု၊ ငှား/ပြန်အပ်မှတ်တမ်းများကို လိုက်လံကြည့်ရှုခြင်း၊ အသင်းဝင်များကို စီမံခြင်းနှင့် အဖွဲ့လိုက် access ခွဲဝေပေးခြင်းတို့ကို ပိုမိုလွယ်ကူစေသည်။ နေ့စဉ်လုပ်ငန်းများကို ထိန်းချုပ်ရလွယ်ကူစေပြီး စီမံခန့်ခွဲမှုအရည်အသွေးကို မြှင့်တင်ပေးသည်။',
        'စာဖတ်သူများနှင့် အသင်းဝင်များအတွက်လည်း LibrarEase သည် စာအုပ်ရှာဖွေမှု၊ ငှားရမ်းမှုအခြေအနေ လိုက်ကြည့်မှုနှင့် သတိပေးချက်ရယူမှုတို့ကို အဆင်ပြေစွာ အသုံးပြုနိုင်စေသည်။ အသုံးပြုသူများအတွက် ရိုးရှင်းပြီး ယုံကြည်စိတ်ချရသော borrowing experience ကို ပေးစွမ်းရန် ဒီဇိုင်းထုတ်ထားသည်။',
        'မြန်ဆန်မှု၊ တည်ငြိမ်မှုနှင့် အသုံးပြုရလွယ်ကူမှုကို အခြေခံထားသော LibrarEase သည် စာကြည့်တိုက်အဖွဲ့များနှင့် စာဖတ်သူများအတွက် ပိုမိုကောင်းမွန်သော library experience ကို ဖန်တီးပေးသည့် platform တစ်ခုဖြစ်သည်။',
      ],
    },
    terms: {
      backToHome: 'ပင်မသို့ ပြန်သွားရန်',
      html: `
        <h1>အသုံးပြုမှု စည်းကမ်းချက်များ</h1>
        <p>LibrarEase ဝန်ဆောင်မှုကို အသုံးပြုခြင်းနှင့် အသုံးပြုခွင့်ကို ဤစည်းကမ်းချက်များက ထိန်းချုပ်ပါသည်။ ဝန်ဆောင်မှုကို အသုံးပြုခြင်းအားဖြင့် ဤစည်းကမ်းချက်များကို လက်ခံသဘောတူသည်ဟု မှတ်ယူပါသည်။</p>
        <h2>အကောင့်နှင့် အသုံးပြုခွင့်</h2>
        <p>သင့်အကောင့်နှင့် ဆက်စပ်သော အချက်အလက်များ မှန်ကန်စေရန်နှင့် login အချက်အလက်များကို လုံခြုံစွာ ထိန်းသိမ်းရန် သင့်တွင် တာဝန်ရှိသည်။</p>
        <h2>စာကြည့်တိုက်ဒေတာ</h2>
        <p>LibrarEase ပေါ်တွင် စီမံထားသော စာအုပ်အချက်အလက်များ၊ အသင်းဝင်မှတ်တမ်းများနှင့် လုပ်ငန်းဆိုင်ရာဒေတာများအတွက် သက်ဆိုင်ရာ စာကြည့်တိုက် သို့မဟုတ် deployment owner ဘက်မှ တာဝန်ယူရမည်ဖြစ်သည်။ စီမံခန့်ခွဲခွင့်ရှိသော ဒေတာများသာ တင်သွင်းသင့်သည်။</p>
        <h2>သင့်လျော်သော အသုံးပြုမှု</h2>
        <p>ဝန်ဆောင်မှုကို အနှောင့်အယှက်ဖြစ်စေခြင်း၊ ခွင့်ပြုချက်မရှိသော ဒေတာများကို ဝင်ရောက်ကြည့်ရှုရန် ကြိုးစားခြင်း သို့မဟုတ် မသင့်လျော်သော ရည်ရွယ်ချက်များအတွက် အသုံးပြုခြင်း မပြုလုပ်ရပါ။</p>
        <h2>ဝန်ဆောင်မှု ပြောင်းလဲမှုများ</h2>
        <p>Feature များကို အချိန်အခါအလိုက် ပြင်ဆင်ခြင်း၊ တိုးတက်အောင် ဆောင်ရွက်ခြင်း သို့မဟုတ် ရပ်နားခြင်းများ ဖြစ်နိုင်သည်။ အရေးကြီးသော ပြောင်းလဲမှုများရှိပါက အသိပေးနိုင်ရန် ကြိုးစားပါမည်။</p>
        <h2>ဆက်သွယ်ရန်</h2>
        <p>ဤစည်းကမ်းချက်များနှင့် ပတ်သက်၍ မေးမြန်းလိုပါက သင့်စာကြည့်တိုက် သို့မဟုတ် deployment owner မှ ပံ့ပိုးပေးထားသော support channel များမှ ဆက်သွယ်နိုင်သည်။</p>
      `,
    },
    privacy: {
      backToHome: 'ပင်မသို့ ပြန်သွားရန်',
      html: `
        <h1>ကိုယ်ရေးအချက်အလက် မူဝါဒ</h1>
        <p>ဤမူဝါဒသည် LibrarEase က စာကြည့်တိုက်ဝန်ဆောင်မှုများနှင့် စာအုပ်ငှားရမ်းမှုအတွေ့အကြုံကို ပံ့ပိုးရန်အတွက် အချက်အလက်များကို မည်သို့ ကိုင်တွယ်အသုံးပြုသည်ကို ရှင်းပြပါသည်။</p>
        <h2>ကျွန်ုပ်တို့ ကိုင်တွယ်သော အချက်အလက်များ</h2>
        <p>ဝန်ဆောင်မှုကို လည်ပတ်ရန်အတွက် အကောင့်အသေးစိတ်၊ အသင်းဝင်အချက်အလက်၊ ငှားရမ်းမှတ်တမ်းများ၊ သတိပေးချက်ဆိုင်ရာ အချက်အလက်များနှင့် စာကြည့်တိုက် catalog data များကို LibrarEase က ကိုင်တွယ်နိုင်သည်။</p>
        <h2>အချက်အလက်အသုံးပြုပုံ</h2>
        <p>အချက်အလက်များကို catalog ကြည့်ရှုခြင်း၊ ငှားရမ်းမှုလုပ်ငန်းစဉ်များ၊ သတိပေးချက်ပို့ခြင်း၊ ဝန်ထမ်းစီမံခန့်ခွဲမှုနှင့် အစီရင်ခံစာများကဲ့သို့သော အဓိက feature များကို ပံ့ပိုးရန် အသုံးပြုသည်။</p>
        <h2>ဝင်ရောက်ခွင့်နှင့် မျှဝေမှု</h2>
        <p>အချက်အလက်ဝင်ရောက်ခွင့်ကို admin များ၊ staff များနှင့် သက်ဆိုင်ရာ member account ပိုင်ရှင်များကဲ့သို့ ခွင့်ပြုထားသော အသုံးပြုသူများထံသာ ကန့်သတ်ထားသင့်သည်။ လိုအပ်သော လုပ်ငန်းရည်ရွယ်ချက်မရှိဘဲ အပြင်ဘက်သို့ မျှဝေသင့်ခြင်း မရှိပါ။</p>
        <h2>သိုလှောင်ကာလ</h2>
        <p>လုပ်ငန်းဆိုင်ရာ မှတ်တမ်းများကို မည်မျှကြာ သိမ်းဆည်းမည်ကို စာကြည့်တိုက် သို့မဟုတ် deployment owner ဘက်မှ မူဝါဒများနှင့် ဥပဒေရေးရာ တာဝန်များအရ ဆုံးဖြတ်ရမည်ဖြစ်သည်။</p>
        <h2>ဆက်သွယ်ရန်</h2>
        <p>သီးသန့် library deployment တစ်ခုအတွက် ကိုယ်ရေးအချက်အလက်ဆိုင်ရာ မေးခွန်းများရှိပါက ထို deployment ကို စီမံသော library သို့မဟုတ် service owner ထံ ဆက်သွယ်ပါ။</p>
      `,
    },
    auth: {
      login: {
        title: 'အကောင့်ဝင်ရန်',
        description:
          'သင့် LibrarEase အကောင့်သို့ ဝင်ရောက်ရန် အီးမေးလ်နှင့် စကားဝှက်ကို ဖြည့်သွင်းပါ။',
        emailLabel: 'အီးမေးလ်',
        emailPlaceholder: 'ဥပမာ - mgmg@example.com',
        passwordLabel: 'စကားဝှက်',
        passwordPlaceholder: 'သင့်စကားဝှက်ကို ထည့်ပါ',
        showPassword: 'စကားဝှက်ကို ပြပါ',
        forgotPassword: 'စကားဝှက် မေ့သွားပါသလား?',
        submit: 'ဝင်ရန်',
        signupPrompt: 'အကောင့် မရှိသေးဘူးလား?',
        signupLink: 'အကောင့်ဖွင့်ပါ',
      },
      signup: {
        title: 'အကောင့်ဖွင့်ရန်',
        description:
          'LibrarEase ကို စတင်အသုံးပြုရန် လိုအပ်သော အချက်အလက်များကို အောက်တွင် ဖြည့်သွင်းပါ။',
        nameLabel: 'အမည်',
        namePlaceholder: 'ဥပမာ - မောင်မောင်',
        emailLabel: 'အီးမေးလ်',
        emailPlaceholder: 'ဥပမာ - mgmg@example.com',
        passwordLabel: 'စကားဝှက်',
        passwordPlaceholder: 'စကားဝှက်အသစ် သတ်မှတ်ပါ',
        submit: 'အကောင့်ဖွင့်ပါ',
        loginPrompt: 'အကောင့်ရှိပြီးသားလား?',
        loginLink: 'ဝင်ရန်',
      },
      forgotPassword: {
        title: 'စကားဝှက် ပြန်လည်သတ်မှတ်ရန်',
        description:
          'သင့်အကောင့်အတွက် စကားဝှက်ပြန်လည်သတ်မှတ်ရန် အီးမေးလ်လိပ်စာကို ဖြည့်သွင်းပါ။',
        emailLabel: 'အီးမေးလ်',
        emailPlaceholder: 'ဥပမာ - mgmg@example.com',
        backToLogin: 'စကားဝှက်ကို မှတ်မိပါသလား?',
        submit: 'စကားဝှက် ပြန်သတ်မှတ်ရန်',
        signupPrompt: 'အကောင့် မရှိသေးဘူးလား?',
        signupLink: 'အကောင့်ဖွင့်ပါ',
      },
    },
  },
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]
}

export function getMetadataForPage(
  locale: Locale,
  path: LocalizedPath,
  metadata: MetadataCopy,
): Metadata {
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: getLocaleAlternates(locale, path),
  }
}
