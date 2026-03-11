import { Show, SimpleShowLayout, TextField, EmailField, ReferenceArrayField, ReferenceField, DataTable, ArrayField } from 'react-admin';

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

export const LecturerDashboardShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
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

