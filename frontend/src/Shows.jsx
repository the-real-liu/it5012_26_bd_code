import { Show, SimpleShowLayout, FunctionField, TextField, EmailField, ReferenceArrayField, ReferenceField, DataTable, ArrayField } from 'react-admin';
import Alert from '@mui/material/Alert';

export const StudentShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="name" />
            <EmailField source="account.email" label="Email" />

            <ReferenceField source="subject" reference="subjects" />
        </SimpleShowLayout>
    </Show>
);

export const SubjectShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="name" />

            <ReferenceArrayField source="courses" reference="courses">
                <DataTable bulkActionButtons={false}>
                    <DataTable.Col source="course_id" label="Course ID" />
                    <DataTable.Col source="name" label="Name" />
                </DataTable>
            </ReferenceArrayField>
        </SimpleShowLayout>
    </Show>
);

export const LecturerShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="name" />
            <TextField type="email" source="account.email" label="Email" />
        </SimpleShowLayout>
    </Show>
);

export const CourseShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="name" />
        </SimpleShowLayout>
    </Show>
);

export const CourseDetailShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="name" />
            <ArrayField source="student_set" label="My Students">
              <DataTable bulkActionButtons={false}>
                <DataTable.Col source="student_id" label="Student ID" sx={{ width: "10rem" }} />
                <DataTable.Col source="name" label="Name" />
                <DataTable.Col source="account.email" label="Email" />
              </DataTable>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);

export const AdminDashboardShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <FunctionField label="Role" render={() => ("Admin")} />
            <EmailField source="email" label="My Email" />
            <Alert severity="info">You have full permission to all data, please be careful.</Alert>
        </SimpleShowLayout>
    </Show>
);

export const LecturerDashboardShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <FunctionField label="Role" render={() => ("Lecturer")} />
            <TextField source="lecturer_id" label="My Lecturer ID" />
            <TextField source="name" label="My Name" />
            <EmailField source="account.email" label="My Email" />
            <ArrayField source="course_set" label="Teaching Courses">
              <DataTable bulkActionButtons={false}>
                <DataTable.Col source="course_id" label="Course ID" sx={{ width: "10rem" }} />
                <DataTable.Col source="name" label="Name" />
              </DataTable>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);

export const StudentDashboardShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <FunctionField label="Role" render={() => ("Student")} />
            <TextField source="student_id" label="My Student ID" />
            <TextField source="name" label="My Name" />
            <TextField source="subject.name" label="My Subject" />
            <EmailField source="account.email" label="My Email" />
            <ArrayField source="enrolment" label="My Courses">
              <DataTable bulkActionButtons={false}>
                <DataTable.Col source="course_id" label="Course ID" sx={{ width: "10rem" }} />
                <DataTable.Col source="name" label="Name" />
                <DataTable.Col source="lecturer.name" label="Lecturer" />
                <DataTable.Col source="lecturer.account.email" label="Lecturer Email" />
              </DataTable>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);

