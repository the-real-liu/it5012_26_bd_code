import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, CustomRoutes, usePermissions } from "react-admin";
import { Route, Navigate } from 'react-router-dom';
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { AdminStudentList, AdminCourseList, AdminLecturerList, AdminSubjectList } from "./AdminLists";
import { AdminStudentCreate, AdminCourseCreate, AdminLecturerCreate, AdminSubjectCreate } from "./AdminCreates";
import { AdminStudentEdit, AdminCourseEdit, AdminLecturerEdit, AdminSubjectEdit } from "./AdminEdits";
import { AdminResetPassword } from "./AdminResetPassword";
import { StudentShow, CourseShow, LecturerShow, SubjectShow, AdminDashboardShow, LecturerDashboardShow, CourseDetailShow, StudentDashboardShow } from "./Shows";
import { LecturerCourseList, StudentEnrolmentCourseList, StudentGradeList } from "./Lists";
import { AssignGradesPage } from "./AssignGradesPage";

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

const LecturerRoleResources = () => (
    <>
        <Resource name="lecturer_courses" options={{ label: 'My Courses' }} list={LecturerCourseList} show={CourseDetailShow} />
        <CustomRoutes>
          <Route path="/assign_grades" element={<AssignGradesPage />} />
        </CustomRoutes>
    </>
);

const StudentRoleResources = () => (
    <>
        <Resource name="student_enrolment" options={{ label: 'Enrolment' }} list={StudentEnrolmentCourseList} />
        <Resource name="student_grades" options={{ label: 'My Results' }} list={StudentGradeList} />
    </>
);

const RoleResources = (permissions) => {
  if (permissions === "admin") {
    return AdminRoleResources();
  } else if (permissions === "lecturer") {
    return LecturerRoleResources();
  } else if (permissions === "student") {
    return StudentRoleResources();
  } else {
    return (<></>);
  }
}

const AdminDashboard = () => (
    <AdminDashboardShow title="Dashboard" resource="admin_dashboard" id="singleton" />
);

const LecturerDashboard = () => (
    <LecturerDashboardShow title="Dashboard" resource="lecturer_dashboard" id="singleton" />
);

const StudentDashboard = () => (
    <StudentDashboardShow title="Dashboard" resource="student_dashboard" id="singleton" />
);

const RoleDashboard = () => {
  const { permissions } = usePermissions();
  if (permissions === "admin") {
    return AdminDashboard();
  } else if (permissions === "lecturer") {
    return LecturerDashboard();
  } else if (permissions === "student") {
    return StudentDashboard();
  } else {
    return (<></>);
  }
}

export const App = () => (
    <Admin layout={Layout} authProvider={authProvider} dataProvider={dataProvider} dashboard={RoleDashboard} requireAuth>
        {permissions => RoleResources(permissions)}
    </Admin>
);

