import data from './iot-lessons.json';
import learningOrder from './iot-learning-order.json';
export const iotStages=learningOrder.map(group=>group.title);
export type IoTLesson={slug:string;title:string;summary:string;stage:number;minutes:number;analogy:string;explain:string[];example:string;practice:string[];warning:string;check:string;answer:string;nodes:string[];table?:{headers:string[];rows:string[][]};sources?:{title:string;url:string}[];arduino?:{section:string;parts:string[];wiring:string[][];blocks:{label:string;language:string;code:string}[];result:string;troubleshoot:string[]}};
// One canonical order drives the catalog, progress resume, and article navigation.
export const iotLessons:IoTLesson[]=learningOrder.flatMap((group,stage)=>group.slugs.map(slug=>{
  const lesson=data.find(item=>item.slug===slug);
  if(!lesson)throw new Error('Unknown IoT lesson: '+slug);
  return {...lesson,stage};
}));
