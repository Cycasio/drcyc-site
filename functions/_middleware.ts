import { knownArticleRedirect } from './_shared/known-article-redirects';

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  const destination = knownArticleRedirect(url.pathname);
  if ((request.method === 'GET' || request.method === 'HEAD') && destination) {
    url.pathname = destination;
    if (url.hostname === 'drcyc.io') url.hostname = 'www.drcyc.io';
    return Response.redirect(url.toString(), 301);
  }
  if (url.hostname === 'drcyc.io') {
    url.hostname = 'www.drcyc.io';
    return Response.redirect(url.toString(), 301);
  }
  return next();
};
