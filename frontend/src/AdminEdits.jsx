import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceInput,
} from "react-admin";

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

export const AdminStudentEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput type="email" source="account.email" label="Email" />

      <ReferenceInput source="subject" reference="subjects" />
    </SimpleForm>
  </Edit>
);

export const AdminLecturerEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput type="email" source="account.email" label="Email" />
    </SimpleForm>
  </Edit>
);

export const AdminCourseEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);
