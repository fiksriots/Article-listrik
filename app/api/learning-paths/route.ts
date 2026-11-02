import {learningDirectory} from '@/lib/learning-directory';
export const dynamic='force-static';
export function GET(){return Response.json({schemaVersion:1,groups:learningDirectory},{headers:{'Access-Control-Allow-Origin':'*','Cache-Control':'public, max-age=60, s-maxage=60, must-revalidate'}});}
