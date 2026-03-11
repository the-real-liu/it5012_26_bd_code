import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { AdminStudentList, AdminCourseList, AdminLecturerList, AdminSubjectList } from "./AdminLists";
import { AdminSubjectCreate } from "./AdminCreates";
import { AdminSubjectEdit } from "./AdminEdits";

export const App = () => (
  <Admin layout={Layout} authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="students" list={AdminStudentList} />
    <Resource name="courses" list={AdminCourseList} />
    <Resource name="lecturers" list={AdminLecturerList} />
    <Resource name="subjects" list={AdminSubjectList} create={AdminSubjectCreate} edit={AdminSubjectEdit} />
  </Admin>
);
