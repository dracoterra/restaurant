/**
 * Fragmentos GraphQL reutilizables
 * Optimiza queries evitando duplicación de código
 */

// Fragmento para información básica de página
const PAGE_BASIC_FIELDS = `
  id
  databaseId
  title
  slug
  content
  date
  modified
`;

// Fragmento para imagen destacada
const FEATURED_IMAGE_FRAGMENT = `
  featuredImage {
    node {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
  }
`;

// Fragmento para SEO
const SEO_FRAGMENT = `
  seo {
    title
    metaDesc
    canonical
    opengraphTitle
    opengraphDescription
    opengraphImage {
      sourceUrl
    }
    twitterTitle
    twitterDescription
    twitterImage {
      sourceUrl
    }
  }
`;

// Fragmento para imagen ACF (con node)
const ACF_IMAGE_FRAGMENT = `
  node {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
`;

// Fragmento para galería ACF
const ACF_GALLERY_FRAGMENT = `
  nodes {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
`;

// Fragmento completo de página básica
const PAGE_BASIC_QUERY = `
  ${PAGE_BASIC_FIELDS}
  ${FEATURED_IMAGE_FRAGMENT}
  ${SEO_FRAGMENT}
`;

// Fragmento para autor
const AUTHOR_FRAGMENT = `
  author {
    node {
      id
      name
      slug
      avatar {
        url
      }
    }
  }
`;

// Fragmento para categorías
const CATEGORIES_FRAGMENT = `
  categories {
    nodes {
      id
      name
      slug
    }
  }
`;

// Fragmento para tags
const TAGS_FRAGMENT = `
  tags {
    nodes {
      id
      name
      slug
    }
  }
`;

// Helper para construir queries con fragmentos
function buildQuery(fields, fragments = []) {
  const fragmentDeclarations = fragments.map((f, i) => 
    `fragment Fragment${i} on ${f.type} { ${f.fields} }`
  ).join('\n');
  
  return `
    ${fragmentDeclarations}
    query {
      ${fields}
    }
  `;
}

module.exports = {
  PAGE_BASIC_FIELDS,
  FEATURED_IMAGE_FRAGMENT,
  SEO_FRAGMENT,
  ACF_IMAGE_FRAGMENT,
  ACF_GALLERY_FRAGMENT,
  PAGE_BASIC_QUERY,
  AUTHOR_FRAGMENT,
  CATEGORIES_FRAGMENT,
  TAGS_FRAGMENT,
  buildQuery
};

