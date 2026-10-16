import data from './mtcre-labs.json';
export type MtcreLab={slug:string;title:string;pages:string;modules:string[];goal:string;analogy:string;nodes:string[];edges:string[][];addresses:string[][];steps:{title:string;text:string;device:string;code:string}[];tests:string[][];faults:string[][];restore:string;source:string;prereq:string};
export const mtcreLabs:MtcreLab[]=data;
