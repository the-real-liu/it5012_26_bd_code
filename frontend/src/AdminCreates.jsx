import { Create, SimpleForm, TextInput, ReferenceArrayInput, SelectArrayInput } from 'react-admin';

export const AdminSubjectCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />

            <ReferenceArrayInput source="courses" reference="courses">
              <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
        </SimpleForm>
    </Create>
);

