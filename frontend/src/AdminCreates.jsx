import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceInput,
} from "react-admin";

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

export const AdminStudentCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput type="email" source="account.email" label="Email" />

      <ReferenceInput source="subject" reference="subjects" />
    </SimpleForm>
  </Create>
);

export const AdminLecturerCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput type="email" source="account.email" label="Email" />
    </SimpleForm>
  </Create>
);

export const AdminCourseCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);
