import { Edit, SimpleForm, TextInput, ReferenceArrayInput, SelectArrayInput } from 'react-admin';

export const AdminSubjectEdit = (props) => (
    <Edit mutationMode="pessimistic" {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceArrayInput source="courses" reference="courses">
              <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
        </SimpleForm>
    </Edit>
);

