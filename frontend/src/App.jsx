import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, CustomRoutes } from "react-admin";
import { Route, Navigate } from 'react-router-dom';
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { AdminStudentList, AdminCourseList, AdminLecturerList, AdminSubjectList } from "./AdminLists";
import { AdminStudentCreate, AdminCourseCreate, AdminLecturerCreate, AdminSubjectCreate } from "./AdminCreates";
import { AdminStudentEdit, AdminCourseEdit, AdminLecturerEdit, AdminSubjectEdit } from "./AdminEdits";
import { AdminResetPassword } from "./AdminResetPassword";
import { StudentShow, CourseShow, LecturerShow, SubjectShow } from "./Shows";

export const App = () => (
  <Admin layout={Layout} authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="students" list={AdminStudentList} create={AdminStudentCreate} edit={AdminStudentEdit} show={StudentShow} />
    <Resource name="courses" list={AdminCourseList} create={AdminCourseCreate} edit={AdminCourseEdit} show={CourseShow} />
    <Resource name="lecturers" list={AdminLecturerList} create={AdminLecturerCreate} edit={AdminLecturerEdit} show={LecturerShow} />
    <Resource name="subjects" list={AdminSubjectList} create={AdminSubjectCreate} edit={AdminSubjectEdit} show={SubjectShow} />
    <CustomRoutes>
      <Route path="/admin/reset_password/:id?" element={<AdminResetPassword />} />
      <Route path="/admin_reset_password" element={<Navigate to="/" />} />
    </CustomRoutes>
  </Admin>
);
