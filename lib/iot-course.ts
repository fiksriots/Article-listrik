import data from './iot-lessons.json';
import connectedLessons from './iot-connected-lessons.json';
import learningOrder from './iot-learning-order.json';
export const iotStages=learningOrder.map(group=>group.title);
export type IoTPractice={title?:string;parts:string[];wiring:string[][];blocks:{label:string;language:string;code:string}[];result:string;troubleshoot:string[]};
export type IoTLesson={slug:string;title:string;summary:string;stage:number;minutes:number;analogy:string;explain:string[];example:string;practice:string[];warning:string;check:string;answer:string;nodes:string[];diagramCaption?:string;table?:{headers:string[];rows:string[][]};sources?:{title:string;url:string}[];arduino?:IoTPractice & {section:string};lab?:IoTPractice};
const allLessons:IoTLesson[]=[...data,...connectedLessons];
// One canonical order drives the catalog, progress resume, and article navigation.
export const iotLessons:IoTLesson[]=learningOrder.flatMap((group,stage)=>group.slugs.map(slug=>{
  const lesson=allLessons.find(item=>item.slug===slug);
  if(!lesson)throw new Error('Unknown IoT lesson: '+slug);
  return {...lesson,stage};
}));
