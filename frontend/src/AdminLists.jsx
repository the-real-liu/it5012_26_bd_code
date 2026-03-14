import {
  DataTable,
  List,
  ReferenceField,
  EditButton,
  DeleteButton,
} from "react-admin";
import { Button, useRecordContext } from "react-admin";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

const ChangePasswordButton = () => {
  const record = useRecordContext();
  const navigate = useNavigate();

  if (!record) return null;

  const handleClick = (event) => {
    event.stopPropagation();
    navigate(`/admin/reset_password/${record.account.id}`);
  };

  return (
    <Button label="Change Password" onClick={handleClick}>
      <LockIcon />
    </Button>
  );
};

export const AdminStudentList = () => (
  <List pagination={false}>
    <DataTable bulkActionButtons={false} rowClick="show" sort={false}>
      <DataTable.Col
        source="student_id"
        label="Student ID"
        sx={{ width: "10rem" }}
      />
      <DataTable.Col source="name" label="Name" />
      <DataTable.Col source="account.email" label="Email" />
      <DataTable.Col label="Subject">
        <ReferenceField source="subject" reference="subjects" />
      </DataTable.Col>

      <DataTable.Col label="Actions" sx={{ width: "15rem" }}>
        <EditButton />
        <DeleteButton mutationMode="pessimistic" />
        <ChangePasswordButton />
      </DataTable.Col>
    </DataTable>
  </List>
);

export const AdminCourseList = () => (
  <List pagination={false}>
    <DataTable bulkActionButtons={false} sort={false}>
      <DataTable.Col
        source="course_id"
        label="Course ID"
        sx={{ width: "10rem" }}
      />
      <DataTable.Col source="name" label="Name" />

      <DataTable.Col label="Actions" sx={{ width: "15rem" }}>
        <EditButton />
        <DeleteButton mutationMode="pessimistic" />
      </DataTable.Col>
    </DataTable>
  </List>
);

export const AdminSubjectList = () => (
  <List pagination={false}>
    <DataTable bulkActionButtons={false} sort={false}>
      <DataTable.Col
        source="subject_id"
        label="Subject ID"
        sx={{ width: "10rem" }}
      />
      <DataTable.Col source="name" label="Name" />

      <DataTable.Col label="Actions" sx={{ width: "15rem" }}>
        <EditButton />
        <DeleteButton mutationMode="pessimistic" />
      </DataTable.Col>
    </DataTable>
  </List>
);

export const AdminLecturerList = () => (
  <List pagination={false}>
    <DataTable bulkActionButtons={false} sort={false}>
      <DataTable.Col
        source="lecturer_id"
        label="Lecturer ID"
        sx={{ width: "10rem" }}
      />
      <DataTable.Col source="name" label="Name" />
      <DataTable.Col source="account.email" label="Email" />

      <DataTable.Col label="Actions" sx={{ width: "15rem" }}>
        <EditButton />
        <DeleteButton mutationMode="pessimistic" />
        <ChangePasswordButton />
      </DataTable.Col>
    </DataTable>
  </List>
);
