export default function SeoJsonLd(){
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://neezar.tech";
  const data = {"@context":"https://schema.org","@graph":[
    {"@type":"WebSite","@id":`${site}#website`,"url":site,"name":"Neezar Abd","alternateName":"Neezar Abdurrahman Ahnaf Abiyyi","inLanguage":"id-ID","publisher":{"@id":`${site}#person`},
     "potentialAction":{"@type":"SearchAction","target":`${site}/search?q={search_term_string}`,"query-input":"required name=search_term_string"}},
    {"@type":"Person","@id":`${site}#person`,"name":"Neezar Abdurrahman Ahnaf Abiyyi","alternateName":"Neezar Abd","url":site,"jobTitle":"Software Engineer",
     "knowsAbout":["Next.js","React","TypeScript","Tailwind CSS","MongoDB","Firebase","DevOps"],
     "homeLocation":{"@type":"Place","name":"Probolinggo, Indonesia"},
     "email":"mailto:neezar.dev@gmail.com","telephone":"+6283899200333",
     "sameAs":["https://github.com/neezar-abd","https://www.linkedin.com/in/nizar-abdurr-4a9846365","https://instagram.com/nizarxrpl1"]}
  ]};
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />;
}
