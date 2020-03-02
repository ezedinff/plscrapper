import {CourseModule} from "./module";

export interface Course {
    title?: string;
    path?: string;
    author?: string;
    level?: string;
    hour?: string;
    date?: string;
    description?: string;
    modules?: CourseModule[];
}
