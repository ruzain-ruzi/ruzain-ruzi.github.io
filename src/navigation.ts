export interface PortfolioRoute { screen: string; category?: string; url: string }
export const screenNames = ['home','about','expertise','experience','work','architecture','resumes','contact','recruiter','not-found'] as const;
export const projectSlugs = ['onedi-transit','onedi-smart-pos','onedi-media','chandini-dsr'] as const;
/** A small allowlisted router shared by DOM navigation and route tests. */
export function resolveRoute(url: URL): PortfolioRoute | null {
  const hash = url.hash.slice(1);
  const aliases: Record<string,string> = { projects:'work',skills:'expertise',credentials:'about',impact:'experience',top:'home',main:'home' };
  if (hash) {
    if (hash.startsWith('skill-') && ['mobile','architecture','data','hardware','cross-platform','delivery'].includes(hash.slice(6))) return {screen:'expertise',category:hash.slice(6),url:'/#'+hash};
    const screen = aliases[hash] ?? hash;
    if ((screenNames as readonly string[]).includes(screen)) return {screen,url:'/#'+screen};
    return null;
  }
  const match = url.pathname.match(/^\/work\/([a-z-]+)\.html$/);
  if (match && (projectSlugs as readonly string[]).includes(match[1])) return {screen:'project-'+match[1],url:url.pathname};
  if (url.pathname==='/' || url.pathname==='/index.html' || url.pathname==='/__audit') return {screen:'home',url:'/#home'};
  if (url.pathname==='/404.html') return {screen:'not-found',url:'/404.html'};
  return null;
}
