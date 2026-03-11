import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, CustomRoutes } from "react-admin";
import { Route, Navigate } from 'react-router-dom';
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { AdminStudentList, AdminCourseList, AdminLecturerList, AdminSubjectList } from "./AdminLists";
import { AdminStudentCreate, AdminCourseCreate, AdminLecturerCreate, AdminSubjectCreate } from "./AdminCreates";
import { AdminStudentEdit, AdminCourseEdit, AdminLecturerEdit, AdminSubjectEdit } from "./AdminEdits";
import { AdminResetPassword } from "./AdminResetPassword";
import { StudentShow, CourseShow, LecturerShow, SubjectShow, LecturerDashboardShow, CourseDetailShow } from "./Shows";
import { LecturerCourseList } from "./Lists";

const LecturerRoleResources = () => (
    <>
        <Resource name="lecturer_courses" options={{ label: 'My Courses' }} list={LecturerCourseList} show={CourseDetailShow} />
    </>
);

const AdminRoleResources = () => (
    <>
        <Resource name="students" list={AdminStudentList} create={AdminStudentCreate} edit={AdminStudentEdit} show={StudentShow} />
        <Resource name="courses" list={AdminCourseList} create={AdminCourseCreate} edit={AdminCourseEdit} show={CourseShow} />
        <Resource name="lecturers" list={AdminLecturerList} create={AdminLecturerCreate} edit={AdminLecturerEdit} show={LecturerShow} />
        <Resource name="subjects" list={AdminSubjectList} create={AdminSubjectCreate} edit={AdminSubjectEdit} show={SubjectShow} />
        <CustomRoutes>
          <Route path="/admin/reset_password/:id?" element={<AdminResetPassword />} />
          <Route path="/admin_reset_password" element={<Navigate to="/" />} />
        </CustomRoutes>
    </>
);

const RoleResources = (permissions) => {
  console.log(permissions);
  if (permissions === "admin") {
    return AdminRoleResources();
  } else if (permissions === "lecturer") {
    return LecturerRoleResources();
  } else {
    return (<></>);
  }
}

const LecturerDashboard = () => (
  <>
    <LecturerDashboardShow title="Dashboard" resource="lecturer_dashboard" id="singleton" options={{ label: 'Dashboard' }} />
  </>
);

export const App = () => {

  return (
      <Admin layout={Layout} authProvider={authProvider} dataProvider={dataProvider} dashboard={LecturerDashboard} requireAuth>
          {permissions => RoleResources(permissions)}
      </Admin>
  );
}

