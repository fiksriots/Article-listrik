import data from './iot-lessons.json';
import connectedLessons from './iot-connected-lessons.json';
import extendedLessons from './iot-extended-lessons.json';
import wirelessLessons from './iot-wireless-lessons.json';
import learningOrder from './iot-learning-order.json';
export const iotGroups=learningOrder;
export const iotStages=iotGroups.map(group=>group.title);
export type IoTPractice={title?:string;parts:string[];wiring:string[][];blocks:{label:string;language:string;code:string}[];result:string;troubleshoot:string[]};
export type IoTLesson={slug:string;title:string;summary:string;stage:number;minutes:number;analogy:string;explain:string[];example:string;practice:string[];warning:string;check:string;answer:string;nodes:string[];prerequisites?:string[];photos?:{src:string;width:number;height:number;alt:string;caption:string;source:string;author:string;license:string;licenseUrl:string}[];diagramCaption?:string;table?:{title?:string;intro?:string;headers:string[];rows:string[][]};sources?:{title:string;url:string}[];arduino?:IoTPractice & {section:string};lab?:IoTPractice};
const allLessons:IoTLesson[]=[...data,...connectedLessons,...extendedLessons,...wirelessLessons];
// One canonical order drives the catalog, progress resume, and article navigation.
export const iotLessons:IoTLesson[]=learningOrder.flatMap((group,stage)=>group.slugs.map(slug=>{
  const lesson=allLessons.find(item=>item.slug===slug);
  if(!lesson)throw new Error('Unknown IoT lesson: '+slug);
  return {...lesson,stage};
}));

export type IoTCatalogLesson=Pick<IoTLesson,'slug'|'title'|'summary'|'stage'|'minutes'> & {searchTerms:string};
export type IoTGroup=typeof learningOrder[number];
// Send only catalog metadata to the browser, not article text and code examples.
export const iotCatalog:IoTCatalogLesson[]=iotLessons.map(l=>({slug:l.slug,title:l.title,summary:l.summary,stage:l.stage,minutes:l.minutes,searchTerms:[l.title,l.summary,l.table?.rows.flat().join(' '),(l.arduino??l.lab)?.parts.join(' ')].filter(Boolean).join(' ')}));
