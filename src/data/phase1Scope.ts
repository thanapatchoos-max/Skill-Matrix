import { ROLE_PAGES, roleCanVisit } from './roleNavigation';
export const PAGE_ROLES:Record<string,string[]>=Object.fromEntries(Object.entries(ROLE_PAGES).flatMap(([role,pages])=>pages.map(page=>[page.id,[role]])));
export const canVisit=roleCanVisit;
