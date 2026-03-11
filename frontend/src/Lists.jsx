import { DataTable, List, ReferenceField, ShowButton } from 'react-admin';

export const LecturerCourseList = () => (
    <List pagination={false}>
        <DataTable bulkActionButtons={false}>
            <DataTable.Col source="course_id" label="Course ID" sx={{ width: "10rem" }} />
            <DataTable.Col source="name" label="Name" />
            <DataTable.Col label="Actions" sx={{ width: "15rem" }}>
              <ShowButton label="View Students" />
            </DataTable.Col>
        </DataTable>
    </List>
);

