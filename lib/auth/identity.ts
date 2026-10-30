// Auth.js user IDs are random without an adapter. Google account IDs are stable.
export type IdentityToken = {sub?:string;email?:string|null;googleSubject?:string;legacyProgressIds?:string[]};
export function progressIdentity(token:IdentityToken){
  return token.googleSubject ? `google:${token.googleSubject}` : token.sub ? `google:${token.sub}` : null;
}
export function bindGoogleIdentity(token:IdentityToken,subject:string,previous:IdentityToken|null){
  token.googleSubject=subject;
  const owner=progressIdentity(token)!;
  // Only a server-verified previous cookie belonging to the same Google email can
  // authorize migration. Never accept an old owner supplied by the browser.
  const sameEmail=token.email&&previous?.email&&token.email.toLowerCase()===previous.email.toLowerCase()&&(!previous.googleSubject||previous.googleSubject===subject);
  token.legacyProgressIds=sameEmail ? [...new Set([progressIdentity(previous!),...(previous!.legacyProgressIds||[])])]
    .filter((id):id is string=>typeof id==='string'&&/^google:[a-zA-Z0-9-]+$/.test(id)&&id!==owner).slice(0,20) : [];
  return token;
}
