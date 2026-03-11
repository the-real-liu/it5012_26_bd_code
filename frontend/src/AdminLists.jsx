import { DataTable, List, ReferenceField, EditButton, DeleteButton } from 'react-admin';

export const AdminStudentList = () => (
    <List>
        <DataTable bulkActionButtons={false}>
            <DataTable.Col source="student_id" label="Student ID" />
            <DataTable.Col source="name" label="Name" />
            <DataTable.Col source="account.email" label="Email" />
            <DataTable.Col source="subject.name" label="Subject" />
        </DataTable>
    </List>
);

export const AdminCourseList = () => (
    <List>
        <DataTable bulkActionButtons={false}>
            <DataTable.Col source="course_id" label="Course ID" />
            <DataTable.Col source="name" label="Name" />
        </DataTable>
    </List>
);

export const AdminSubjectList = () => (
    <List>
        <DataTable bulkActionButtons={false}>
            <DataTable.Col source="subject_id" label="Subject ID" />
            <DataTable.Col source="name" label="Name" />

            <DataTable.Col label="Actions">
              <EditButton />
              <DeleteButton mutationMode="pessimistic" />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const AdminLecturerList = () => (
    <List>
        <DataTable bulkActionButtons={false}>
            <DataTable.Col source="lecturer_id" label="Lecturer ID" />
            <DataTable.Col source="name" label="Name" />
            <DataTable.Col source="account.email" label="Email" />
        </DataTable>
    </List>
);

