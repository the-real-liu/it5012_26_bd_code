import { Show, SimpleShowLayout, TextField, EmailField, ReferenceArrayField, ReferenceField, DataTable } from 'react-admin';

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


