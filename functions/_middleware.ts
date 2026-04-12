export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  if (url.hostname === 'drcyc.io') {
    url.hostname = 'www.drcyc.io';
    return Response.redirect(url.toString(), 301);
  }
  return next();
};
