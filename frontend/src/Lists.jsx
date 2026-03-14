import { DataTable, List, ReferenceField, DateField, ShowButton, useRecordContext, useResourceContext, useDataProvider, useNotify, useRefresh, Button, Confirm, Labeled } from 'react-admin';
import { useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Card, CardContent, Box } from '@mui/material';
import { StudentProgressShowBase } from "./Shows";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const EnrolDropButton = (props) => {
    const record = useRecordContext();
    const resource = useResourceContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
    const { ['dropping']: dropping, ...otherProps } = props;
    const [open, setOpen] = useState(false);

    if (!record) return null;

    const handleConfirm = async () => {
        setOpen(false);
        try {
            await dataProvider.update(resource, {
              id: record.course_id,
              data: {
                is_enrolled: !dropping,
              },
            });

            if (dropping) {
              notify("Dropped!");
            } else {
              notify("Enrolled!");
            }
            refresh();
        } catch (error) {
            notify("Cannot enrol due to error", { type: "error" });
        }
    };

    return (
      <>
        <Button {...otherProps} onClick={(e) => {e.currentTarget.blur();setOpen(true)}}>
            {(!dropping && <AddIcon />)}
            {(dropping && <RemoveIcon />)}
        </Button>
        <Confirm
          isOpen={open}
          title="Confirm"
          content={`Are you sure you want to ${dropping ? "drop" : "enrol"} this course?`}
          onConfirm={handleConfirm}
          onClose={() => setOpen(false)}
        />
      </>
    );
};

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

export const StudentEnrolmentCourseList = () => (
    <List pagination={false}>
        <DataTable bulkActionButtons={false}>
            <DataTable.Col source="course_id" label="Course ID" sx={{ width: "10rem" }} />
            <DataTable.Col source="name" label="Name" />
            <DataTable.Col source="lecturer.name" label="Lecturer" />
            <DataTable.Col source="lecturer.account.email" label="Lecturer Email" />
            <DataTable.Col label="Enrolled" render={record => (record["is_enrolled"] ? <CheckIcon /> : <ClearIcon /> )} />
            <DataTable.Col label="Actions" sx={{ width: "8rem" }} render={record => (record["is_enrolled"] ? (
              <EnrolDropButton label="Drop" dropping />
            ) : (
              <EnrolDropButton label="Enrol" />
            ) )} />
        </DataTable>
    </List>
);

export const StudentGradeList = () => (
    <List pagination={false}>
        <DataTable bulkActionButtons={false}>
            <DataTable.Col source="course_id" label="Course ID" sx={{ width: "10rem" }} />
            <DataTable.Col source="course.name" label="Course Name" />
            <DataTable.Col source="given_by.name" label="Given By" />
            <DataTable.Col label="Assign Date">
              <DateField source="assign_date" showDate showTime />
            </DataTable.Col>
            <DataTable.Col source="percentage" label="Percentage" />
        </DataTable>
        <Card>
          <CardContent sx={{ width: '100%' }}>
            <Labeled label="Overall Academic Progress" sx={{ width: '100%' }}>
              <StudentProgressShowBase resource="student_progress" id="singleton" />
            </Labeled>
          </CardContent>
        </Card>
    </List>
);

