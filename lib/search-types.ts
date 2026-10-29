import type {ProgressLesson} from './learning-progress-types';
export type SearchLesson=ProgressLesson&{summary:string;group:string;minutes?:number};
