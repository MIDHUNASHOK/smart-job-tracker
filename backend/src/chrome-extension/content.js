function cleanText(value) {
  return value
    ? value.replace(/\s+/g, ' ').trim()
    : '';
}

function getText(selectors) {

  for (const selector of selectors) {

    const element =
      document.querySelector(selector);

    if (
      element &&
      cleanText(element.innerText)
    ) {
      return cleanText(element.innerText);
    }

  }

  return '';

}

function getMetaContent(selectors) {

  for (const selector of selectors) {

    const element =
      document.querySelector(selector);

    if (
      element &&
      element.content
    ) {
      return cleanText(element.content);
    }

  }

  return '';

}

function extractFromJsonLd() {

  const scripts =
    document.querySelectorAll(
      'script[type="application/ld+json"]'
    );

  for (const script of scripts) {

    try {

      const data =
        JSON.parse(script.innerText);

      const items =
        Array.isArray(data)
          ? data
          : [data];

      for (const item of items) {

        if (item['@type'] === 'JobPosting') {

          return {
            jobTitle: cleanText(item.title),
            companyName: cleanText(
              item.hiringOrganization?.name
            ),
            location: cleanText(
              item.jobLocation?.address?.addressLocality ||
              item.jobLocation?.address?.addressRegion ||
              item.jobLocation?.address?.addressCountry ||
              ''
            ),
            jobUrl: window.location.href
          };

        }

      }

    } catch (error) {}

  }

  return null;

}

function extractLinkedIn() {

  return {

    jobTitle: getText([
      '.job-details-jobs-unified-top-card__job-title',
      '.job-details-jobs-unified-top-card__job-title h1',
      'h1'
    ]),

    companyName: getText([
      '.job-details-jobs-unified-top-card__company-name',
      '.job-details-jobs-unified-top-card__company-name a',
      '.job-card-container__primary-description'
    ]),

    location: getText([
      '.job-details-jobs-unified-top-card__primary-description-container',
      '.job-details-jobs-unified-top-card__tertiary-description-container',
      '.jobs-unified-top-card__bullet',
      '.job-details-jobs-unified-top-card__bullet'
    ]),

    jobUrl: window.location.href

  };

}

function findLocationFromBodyText() {

  const bodyText =
    cleanText(document.body.innerText);

  const locationKeywords = [
    'Berlin',
    'Munich',
    'Hamburg',
    'Frankfurt',
    'Cologne',
    'Düsseldorf',
    'Stuttgart',
    'Offenbach',
    'Germany',
    'Deutschland',
    'Remote',
    'Hybrid',
    'On-site',
    'Onsite'
  ];

  for (const keyword of locationKeywords) {

    if (
      bodyText
        .toLowerCase()
        .includes(keyword.toLowerCase())
    ) {
      return keyword;
    }

  }

  return '';

}

function extractGeneric() {

  const titleFromMeta =
    getMetaContent([
      'meta[property="og:title"]',
      'meta[name="title"]'
    ]);

  const pageTitle =
    cleanText(document.title);

  const h1 =
    getText(['h1']);

  let jobTitle =
    h1 || titleFromMeta || pageTitle;

  let companyName =
    getText([
      '[class*="company"]',
      '[class*="employer"]',
      '[data-testid*="company"]',
      '[class*="organization"]'
    ]);

  let location =
    getText([
      '[class*="location"]',
      '[data-testid*="location"]',
      '[class*="job-location"]',
      '[class*="address"]'
    ]);

  if (!companyName && pageTitle.includes('|')) {
    companyName =
      cleanText(pageTitle.split('|')[1]);
  }

  if (!companyName && pageTitle.includes('-')) {
    companyName =
      cleanText(pageTitle.split('-')[1]);
  }

  if (!location) {
    location =
      findLocationFromBodyText();
  }

  return {
    jobTitle,
    companyName,
    location,
    jobUrl: window.location.href
  };

}

function mergeResults(primary, fallback) {

  return {
    jobTitle:
      primary?.jobTitle ||
      fallback?.jobTitle ||
      '',
    companyName:
      primary?.companyName ||
      fallback?.companyName ||
      '',
    location:
      primary?.location ||
      fallback?.location ||
      '',
    jobUrl:
      window.location.href
  };

}

function extractJobDetails() {

  const url =
    window.location.href.toLowerCase();

  const jsonLdData =
    extractFromJsonLd();

  let platformData =
    null;

  if (url.includes('linkedin.com/jobs')) {
    platformData =
      extractLinkedIn();
  }

  const genericData =
    extractGeneric();

  return mergeResults(
    jsonLdData || platformData,
    genericData
  );

}

extractJobDetails();