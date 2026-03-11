import { SimpleForm, TextInput, Edit, Toolbar, SaveButton } from 'react-admin';
import { useParams } from 'react-router-dom';

const ResetPasswordToolbar = props => (
    <Toolbar {...props} >
        <SaveButton />
    </Toolbar>
);

export const AdminResetPassword = (props) => {
  const { id } = useParams();

  return (
    <Edit resource="admin_reset_password" mutationMode="pessimistic" id={id}>
      <SimpleForm toolbar={<ResetPasswordToolbar />}>
        <TextInput type="password" source="new_password" label="New Password" />
      </SimpleForm>
    </Edit>
  );
};

